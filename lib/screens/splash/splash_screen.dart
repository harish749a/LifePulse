import 'package:flutter/material.dart';

import '../../routes/app_router.dart';
import '../../services/storage_service.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {

  @override
  void initState() {
    super.initState();
    checkLogin();
  }

  Future<void> checkLogin() async {

    await Future.delayed(
      const Duration(seconds: 2),
    );

    final token =
        await StorageService.getAccessToken();

    if (!mounted) return;

    if (token == null || token.isEmpty) {

      Navigator.pushReplacementNamed(
        context,
        AppRouter.login,
      );

    } else {

      Navigator.pushReplacementNamed(
        context,
        AppRouter.dashboard,
      );

    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text(
          "LifePulse",
          style: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}