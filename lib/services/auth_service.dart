import 'package:dio/dio.dart';

import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import 'storage_service.dart';

class AuthService {
  final Dio _dio = ApiClient.dio;

  Future<bool> register({
    required String firstName,
    required String lastName,
    required String email,
    required String phone,
    required String password,
  }) async {
    try {
      await _dio.post(
        ApiConstants.register,
        data: {
          "first_name": firstName,
          "last_name": lastName,
          "email": email,
          "phone": phone,
          "password": password,
        },
      );

      return true;
    } on DioException catch (e) {
      print("STATUS CODE: ${e.response?.statusCode}");
      print("RESPONSE: ${e.response?.data}");
      print("MESSAGE: ${e.message}");

      throw Exception(
        e.response?.data.toString() ??
        e.message ??
        "Registration failed",
      );
    }
  }

  Future<bool> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _dio.post(
        ApiConstants.login,
        data: {
          "email": email,
          "password": password,
        },
      );

      await StorageService.saveAccessToken(
        response.data["access_token"],
      );

      if (response.data["refresh_token"] != null) {
        await StorageService.saveRefreshToken(
          response.data["refresh_token"],
        );
      }

      return true;
    } on DioException catch (e) {
      throw Exception(
        e.response?.data["detail"] ?? "Login failed",
      );
    }
  }

  Future<bool> forgotPassword(String email) async {
    try {
      await _dio.post(
        ApiConstants.forgotPassword,
        data: {
          "email": email,
        },
      );

      return true;
    } on DioException catch (e) {
      throw Exception(
        e.response?.data["detail"] ?? "Request failed",
      );
    }
  }

  Future<bool> resetPassword({
    required String token,
    required String newPassword,
  }) async {
    try {
      await _dio.post(
        ApiConstants.resetPassword,
        data: {
          "token": token,
          "new_password": newPassword,
        },
      );

      return true;
    } on DioException catch (e) {
      throw Exception(
        e.response?.data["detail"] ?? "Reset failed",
      );
    }
  }

  Future<void> logout() async {
    final token = await StorageService.getAccessToken();

    await _dio.post(
      ApiConstants.logout,
      data: {
        "token": token,
      },
    );

    await StorageService.clearTokens();
  }

  Future<bool> refreshToken() async {
    final refreshToken =
        await StorageService.getRefreshToken();

    if (refreshToken == null) {
      return false;
    }

    try {
      final response = await _dio.post(
        ApiConstants.refreshToken,
        data: {
          "refresh_token": refreshToken,
        },
      );

      await StorageService.saveAccessToken(
        response.data["access_token"],
      );

      if (response.data["refresh_token"] != null) {
        await StorageService.saveRefreshToken(
          response.data["refresh_token"],
        );
      }

      return true;
    } catch (_) {
      return false;
    }
  }
}