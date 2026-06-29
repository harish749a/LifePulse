import 'package:flutter/material.dart';
import 'routes/app_router.dart';
import 'core/theme/app_theme.dart';

class LifePulseApp extends StatelessWidget {
  const LifePulseApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "LifePulse",
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      initialRoute: AppRouter.splash,
      onGenerateRoute: AppRouter.generateRoute,
    );
  }
}