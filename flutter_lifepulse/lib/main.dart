import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'services/api_service.dart';
import 'screens/login_screen.dart';
import 'screens/home_shell.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final apiService = ApiService();
  final prefs = await SharedPreferences.getInstance();
  final bool hasToken = prefs.containsKey('lifepulse_access_token');

  runApp(
    MultiProvider(
      providers: [
        Provider<ApiService>.value(value: apiService),
        ChangeNotifierProvider(create: (_) => AppState(apiService)),
      ],
      child: LifePulseApp(startInDashboard: hasToken),
    ),
  );
}

class LifePulseApp extends StatelessWidget {
  final bool startInDashboard;

  const LifePulseApp({super.key, required this.startInDashboard});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'LifePulse',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: const Color(0xFFF8FAFC), // slate-50
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF059669), // emerald-600
          primary: const Color(0xFF059669),
          secondary: const Color(0xFF1E293B), // slate-800
          background: const Color(0xFFF8FAFC),
        ),
        textTheme: const TextTheme(
          displayLarge: TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
          bodyLarge: TextStyle(fontFamily: 'Inter', color: Color(0xFF334155)),
          bodyMedium: TextStyle(fontFamily: 'Inter', color: Color(0xFF475569)),
        ),
        cardTheme: CardThemeData(
          color: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24.0),
            side: const BorderSide(color: Color(0xFFF1F5F9), width: 1),
          ),
        ),
      ),
      home: startInDashboard ? const HomeShell() : const LoginScreen(),
    );
  }
}

class AppState extends ChangeNotifier {
  final ApiService api;
  String? _userEmail;
  String _displayName = 'User';
  
  // Dashboard Metrics state matching React
  int waterCurrent = 400;
  final int waterGoal = 2000;

  int completedGymSessions = 1;
  final int gymGoal = 4;

  bool loggedBreakfast = false;
  bool loggedLunch = false;
  bool loggedDinner = false;

  AppState(this.api);

  String get userEmail => _userEmail ?? '';
  String get displayName => _displayName;

  void setUserSession(String email, String name) {
    _userEmail = email;
    _displayName = name;
    notifyListeners();
  }

  void incrementWater(int amount) {
    waterCurrent += amount;
    if (waterCurrent < 0) waterCurrent = 0;
    notifyListeners();
    api.syncWaterLog(amount);
    _syncOverallHealth();
  }

  void resetWater() {
    waterCurrent = 0;
    notifyListeners();
  }

  void incrementGym() {
    if (completedGymSessions < gymGoal) {
      completedGymSessions++;
      notifyListeners();
      api.syncWorkoutLog('Gym Workout Session', 45, 300);
      _syncOverallHealth();
    }
  }

  void toggleMeal(String mealType) {
    if (mealType == 'breakfast') {
      loggedBreakfast = !loggedBreakfast;
      if (loggedBreakfast) api.syncMealLog('Breakfast', 'breakfast', 400);
    } else if (mealType == 'lunch') {
      loggedLunch = !loggedLunch;
      if (loggedLunch) api.syncMealLog('Lunch', 'lunch', 650);
    } else if (mealType == 'dinner') {
      loggedDinner = !loggedDinner;
      if (loggedDinner) api.syncMealLog('Dinner', 'dinner', 500);
    }
    notifyListeners();
    _syncOverallHealth();
  }

  int get dailyHealthScore {
    double waterPct = (waterCurrent / waterGoal).clamp(0.0, 1.0);
    double gymPct = (completedGymSessions / gymGoal).clamp(0.0, 1.0);
    int mealsLogged = (loggedBreakfast ? 1 : 0) + (loggedLunch ? 1 : 0) + (loggedDinner ? 1 : 0);
    double mealPct = mealsLogged / 3.0;

    double score = (waterPct * 30.0) + (gymPct * 30.0) + (mealPct * 40.0);
    return score.round();
  }

  void _syncOverallHealth() {
    int score = dailyHealthScore;
    api.syncDailyScore(
      (waterCurrent / waterGoal * 100).round().clamp(0, 100),
      (loggedBreakfast || loggedLunch || loggedDinner ? 85 : 0),
      (completedGymSessions / gymGoal * 100).round().clamp(0, 100),
      80, // static sleep rating
      score,
    );
  }

  Future<void> logOut() async {
    await api.clearTokens();
    _userEmail = null;
    _displayName = 'User';
    notifyListeners();
  }
}
