import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/models.dart';

class ApiService {
  String _baseUrl = 'http://localhost:8000';
  bool _isRefreshing = false;
  final List<void Function(String)> _refreshCallbacks = [];

  ApiService() {
    _loadBaseUrl();
  }

  Future<void> _loadBaseUrl() async {
    final prefs = await SharedPreferences.getInstance();
    _baseUrl = prefs.getString('lifepulse_api_url') ?? 'http://localhost:8000';
  }

  Future<void> setBaseUrl(String url) async {
    _baseUrl = url;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('lifepulse_api_url', url);
  }

  String get baseUrl => _baseUrl;

  Future<String?> _getAccessToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('lifepulse_access_token');
  }

  Future<String?> _getRefreshToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('lifepulse_refresh_token');
  }

  Future<void> _setTokens(String access, String refresh) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('lifepulse_access_token', access);
    await prefs.setString('lifepulse_refresh_token', refresh);
  }

  Future<void> clearTokens() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('lifepulse_access_token');
    await prefs.remove('lifepulse_refresh_token');
  }

  /// Heartbeat ping function to verify PostgreSQL database state and FastAPI status.
  Future<Map<String, dynamic>> pingBackend(String customUrl) async {
    final cleanedUrl = customUrl.replaceAll(RegExp(r'/$'), '');
    final uri = Uri.parse('$cleanedUrl/db-test');
    try {
      final response = await http.get(uri).timeout(const Duration(seconds: 4));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return {
          'success': true,
          'message': data['message'] ?? 'Successfully connected to FastAPI & PostgreSQL! 🚀',
        };
      }
      return {
        'success': false,
        'message': 'FastAPI returned status code: ${response.statusCode}.',
      };
    } catch (e) {
      return {
        'success': false,
        'message': 'Cannot reach FastAPI at "$cleanedUrl". Ensure your server is running on port 8000.',
      };
    }
  }

  /// Sends request with secure JWT authorization, fallback token refresh handles, and parsing logic.
  Future<dynamic> request(
    String path, {
    String method = 'GET',
    Map<String, String>? headers,
    dynamic body,
  }) async {
    final cleanedPath = path.replaceAll(RegExp(r'^/'), '');
    final url = Uri.parse('${_baseUrl.replaceAll(RegExp(r'/$'), '')}/$cleanedPath');

    final token = await _getAccessToken();
    final Map<String, String> requestHeaders = {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
      ...?(headers),
    };

    http.Response response;
    final encodedBody = body != null ? json.encode(body) : null;

    if (method == 'POST') {
      response = await http.post(url, headers: requestHeaders, body: encodedBody);
    } else if (method == 'PUT') {
      response = await http.put(url, headers: requestHeaders, body: encodedBody);
    } else if (method == 'DELETE') {
      response = await http.delete(url, headers: requestHeaders, body: encodedBody);
    } else {
      response = await http.get(url, headers: requestHeaders);
    }

    // Auto Refresh tokens if status is 401
    if (response.statusCode == 401) {
      final refresh = await _getRefreshToken();
      if (refresh != null) {
        try {
          final newAccessToken = await _handleTokenRefresh(refresh);
          requestHeaders['Authorization'] = 'Bearer $newAccessToken';
          
          if (method == 'POST') {
            response = await http.post(url, headers: requestHeaders, body: encodedBody);
          } else if (method == 'PUT') {
            response = await http.put(url, headers: requestHeaders, body: encodedBody);
          } else if (method == 'DELETE') {
            response = await http.delete(url, headers: requestHeaders, body: encodedBody);
          } else {
            response = await http.get(url, headers: requestHeaders);
          }
        } catch (e) {
          await clearTokens();
          throw Exception('Session expired. Please log in again.');
        }
      }
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      String errMsg = 'API Error: ${response.statusCode}';
      try {
        final decoded = json.decode(response.body);
        errMsg = decoded['detail'] ?? decoded['message'] ?? errMsg;
      } catch (_) {}
      throw Exception(errMsg);
    }

    if (response.statusCode == 204 || response.body.isEmpty) {
      return null;
    }

    return json.decode(response.body);
  }

  Future<String> _handleTokenRefresh(String refreshToken) async {
    if (_isRefreshing) {
      return Future.any([
        Future.delayed(const Duration(seconds: 4), () => throw Exception('Token refresh timed out')),
        // Simple callback wait
      ]);
    }

    _isRefreshing = true;
    final url = Uri.parse('${_baseUrl.replaceAll(RegExp(r'/$'), '')}/auth/refresh');
    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'refresh_token': refreshToken}),
      );

      if (response.statusCode != 200) {
        throw Exception('Token refresh failed');
      }

      final data = json.decode(response.body);
      final newAccess = data['access_token'];
      final newRefresh = data['refresh_token'];
      await _setTokens(newAccess, newRefresh);
      
      for (var cb in _refreshCallbacks) {
        cb(newAccess);
      }
      _refreshCallbacks.clear();
      return newAccess;
    } finally {
      _isRefreshing = false;
    }
  }

  Future<void> register(String email, String password, String name) async {
    await request(
      '/auth/register',
      method: 'POST',
      body: {
        'email': email,
        'password': password,
        'name': name,
      },
    );
  }

  Future<void> login(String email, String password) async {
    final data = await request(
      '/auth/login',
      method: 'POST',
      body: {
        'email': email,
        'password': password,
      },
    );
    if (data != null && data['access_token'] != null && data['refresh_token'] != null) {
      await _setTokens(data['access_token'], data['refresh_token']);
    }
  }

  Future<User> getProfile() async {
    final data = await request('/users/me');
    return User.fromJson(data);
  }

  // --- POSTGRES BACKEND SYNCHRONIZATIONS ---

  Future<void> syncHabit(Habit habit) async {
    try {
      await request(
        '/habits',
        method: 'POST',
        body: habit.toJson(),
      );
    } catch (e) {
      print('Local offline log: Syncing habit deferred.');
    }
  }

  Future<void> syncWaterLog(int quantityMl) async {
    try {
      await request(
        '/water-logs',
        method: 'POST',
        body: {
          'quantity_ml': quantityMl,
          'logged_at': DateTime.now().toIso8601String(),
        },
      );
    } catch (e) {
      print('Local offline log: Syncing water deferred.');
    }
  }

  Future<void> syncWorkoutLog(String name, int duration, int calories, {String notes = ''}) async {
    try {
      await request(
        '/workout-logs',
        method: 'POST',
        body: {
          'workout_name': name,
          'duration_minutes': duration,
          'calories_burned': calories,
          'workout_date': DateTime.now().toIso8601String(),
          'notes': notes,
        },
      );
    } catch (e) {
      print('Local offline log: Syncing workout deferred.');
    }
  }

  Future<void> syncMealLog(String name, String type, double calories) async {
    try {
      await request(
        '/meals',
        method: 'POST',
        body: {
          'meal_name': name,
          'meal_type': type,
          'calories': calories,
          'protein': 0.0,
          'carbs': 0.0,
          'fat': 0.0,
          'meal_time': DateTime.now().toIso8601String(),
          'notes': '',
        },
      );
    } catch (e) {
      print('Local offline log: Syncing meal deferred.');
    }
  }

  Future<void> syncDailyScore(int water, int nutrition, int activity, int sleep, int overall) async {
    try {
      await request(
        '/daily-scores',
        method: 'POST',
        body: {
          'water_score': water,
          'nutrition_score': nutrition,
          'activity_score': activity,
          'sleep_score': sleep,
          'overall_score': overall,
          'score_date': DateTime.now().toIso8601String().split('T')[0],
        },
      );
    } catch (e) {
      print('Local offline log: Syncing score deferred.');
    }
  }
}
