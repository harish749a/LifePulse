import 'package:flutter/material.dart';

class AppTheme {

  static ThemeData get lightTheme {

    return ThemeData(

      useMaterial3: true,

      colorSchemeSeed: Colors.green,

      scaffoldBackgroundColor: Colors.white,

      appBarTheme: const AppBarTheme(

        centerTitle: true,

        elevation: 0,

      ),

      inputDecorationTheme: InputDecorationTheme(

        border: OutlineInputBorder(

          borderRadius: BorderRadius.circular(10),

        ),
      ),

      elevatedButtonTheme:

          ElevatedButtonThemeData(

        style: ElevatedButton.styleFrom(

          minimumSize:

              const Size(double.infinity, 50),

        ),
      ),
    );
  }
}