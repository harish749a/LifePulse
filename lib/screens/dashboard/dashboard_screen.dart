import 'package:flutter/material.dart';

import 'home/home_screen.dart';
import 'journal/journal_screen.dart';
import 'music/music_screen.dart';
import 'insights/insights_screen.dart';
import 'profile/profile_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() =>
      _DashboardScreenState();
}

class _DashboardScreenState
    extends State<DashboardScreen> {

  int currentIndex = 0;

  final pages = const [

    HomeScreen(),

    JournalScreen(),

    MusicScreen(),

    InsightsScreen(),

    ProfileScreen(),

  ];

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      body: pages[currentIndex],

      bottomNavigationBar: BottomNavigationBar(

        currentIndex: currentIndex,

        type: BottomNavigationBarType.fixed,

        onTap: (index){

          setState(() {

            currentIndex = index;

          });

        },

        items: const [

          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: "Home",
          ),

          BottomNavigationBarItem(
            icon: Icon(Icons.menu_book),
            label: "Journal",
          ),

          BottomNavigationBarItem(
            icon: Icon(Icons.music_note),
            label: "Music",
          ),

          BottomNavigationBarItem(
            icon: Icon(Icons.analytics),
            label: "Insights",
          ),

          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: "Profile",
          ),

        ],
      ),
    );
  }
}