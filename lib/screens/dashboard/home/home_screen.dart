import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {

  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      appBar: AppBar(

        title: const Text("LifePulse"),

        centerTitle: true,

      ),

      body: const Center(

        child: Text(

          "Home",

          style: TextStyle(
            fontSize: 26,
            fontWeight: FontWeight.bold,
          ),

        ),

      ),

    );

  }
}