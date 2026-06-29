import 'package:flutter/material.dart';

import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();

  bool _loading = false;

  bool get loading => _loading;

  void _setLoading(bool value) {
    _loading = value;
    notifyListeners();
  }

  Future<bool> login({
    required String email,
    required String password,
  }) async {
    try {
      _setLoading(true);

      final result = await _authService.login(
        email: email,
        password: password,
      );

      return result;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> register({
    required String firstName,
    required String lastName,
    required String email,
    required String phone,
    required String password,
  }) async {
    try {
      _setLoading(true);

      final result = await _authService.register(
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        password: password,
      );

      return result;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> forgotPassword(
      String email,
      ) async {
    try {
      _setLoading(true);

      return await _authService.forgotPassword(email);
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> resetPassword({
    required String token,
    required String newPassword,
  }) async {
    try {
      _setLoading(true);

      return await _authService.resetPassword(
        token: token,
        newPassword: newPassword,
      );
    } finally {
      _setLoading(false);
    }
  }

  Future<void> logout() async {
    try {
      _setLoading(true);

      await _authService.logout();
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> refreshToken() async {
    return await _authService.refreshToken();
  }
}