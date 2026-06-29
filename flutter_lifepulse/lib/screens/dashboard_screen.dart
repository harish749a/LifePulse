import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../main.dart';
import 'login_screen.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = Provider.of<AppState>(context);
    final todayStr = DateFormat('EEEE, d MMMM').format(DateTime.now());

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        todayStr.toUpperCase(),
                        style: const TextStyle(fontSize: 10.0, fontWeight: FontWeight.bold, color: Color(0xFF64748B), letterSpacing: 1.5),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Hey, ${state.displayName} 👋',
                        style: const TextStyle(fontSize: 22.0, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.logout, color: Color(0xFF94A3B8)),
                    onPressed: () async {
                      await state.logOut();
                      if (context.mounted) {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(builder: (_) => const LoginScreen()),
                        );
                      }
                    },
                    tooltip: 'Log Out',
                  )
                ],
              ),

              const SizedBox(height: 28),

              // HEALTH SCORE PANEL
              _buildScoreCircle(state.dailyHealthScore),

              const SizedBox(height: 24),

              // WATER TRACKER CARD
              _buildWaterCard(context, state),

              const SizedBox(height: 16),

              // GYM SESSION CARD
              _buildGymCard(context, state),

              const SizedBox(height: 16),

              // MEALS TRACKER CARD
              _buildMealsCard(context, state),

              const SizedBox(height: 32),
              
              const Text(
                'Connected to PostgreSQL Cloud Storage',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8), fontWeight: FontWeight.w500),
              )
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildScoreCircle(int score) {
    return Container(
      padding: const EdgeInsets.all(24.0),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF0F172A), Color(0xFF1E293B)], // deep slate dark
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(28.0),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0F172A).withOpacity(0.15),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'DAILY PULSE SCORE',
                  style: TextStyle(color: Color(0xFF34D399), fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.5),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Your overall health ranking for today is calculated instantly.',
                  style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13, height: 1.4),
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: const Color(0xFF334155), borderRadius: BorderRadius.circular(12)),
                  child: const Text('Live Sync Enabled', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
          const SizedBox(width: 16),
          // Circular progress ring
          Stack(
            alignment: Alignment.center,
            children: [
              SizedBox(
                width: 90,
                height: 90,
                child: CircularProgressIndicator(
                  value: score / 100.0,
                  strokeWidth: 8,
                  backgroundColor: const Color(0xFF334155),
                  valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF34D399)), // emerald-400
                ),
              ),
              Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    '$score',
                    style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const Text(
                    'rating',
                    style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10),
                  ),
                ],
              )
            ],
          )
        ],
      ),
    );
  }

  Widget _buildWaterCard(BuildContext context, AppState state) {
    double completion = (state.waterCurrent / state.waterGoal).clamp(0.0, 1.0);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(color: const Color(0xFFEFF6FF), borderRadius: BorderRadius.circular(12)),
                      child: const Icon(Icons.local_drink, color: Color(0xFF3B82F6)),
                    ),
                    const SizedBox(width: 12),
                    const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Water Intake', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                        Text('Target: 2000 ml', style: TextStyle(color: Color(0xFF64748B), fontSize: 12)),
                      ],
                    ),
                  ],
                ),
                Text(
                  '${state.waterCurrent} ml',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF1E293B)),
                ),
              ],
            ),
            const SizedBox(height: 18),
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: LinearProgressIndicator(
                value: completion,
                minHeight: 8,
                backgroundColor: const Color(0xFFF1F5F9),
                valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF3B82F6)),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                TextButton(
                  onPressed: state.resetWater,
                  child: const Text('Reset', style: TextStyle(color: Colors.grey, fontSize: 12)),
                ),
                ElevatedButton.icon(
                  onPressed: () => state.incrementWater(250),
                  icon: const Icon(Icons.add, size: 16),
                  label: const Text('Add 250ml'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFEFF6FF),
                    foregroundColor: const Color(0xFF3B82F6),
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGymCard(BuildContext context, AppState state) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(color: const Color(0xFFFEF3C7), borderRadius: BorderRadius.circular(12)),
                      child: const Icon(Icons.fitness_center, color: Color(0xFFD97706)),
                    ),
                    const SizedBox(width: 12),
                    const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Workout Targets', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                        Text('Weekly Gym Sessions', style: TextStyle(color: Color(0xFF64748B), fontSize: 12)),
                      ],
                    ),
                  ],
                ),
                Text(
                  '${state.completedGymSessions}/${state.gymGoal}',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF1E293B)),
                ),
              ],
            ),
            const SizedBox(height: 18),
            Row(
              children: List.generate(state.gymGoal, (index) {
                bool done = index < state.completedGymSessions;
                return Expanded(
                  child: Container(
                    height: 8,
                    margin: EdgeInsets.only(
                      left: index == 0 ? 0 : 4,
                      right: index == state.gymGoal - 1 ? 0 : 4,
                    ),
                    decoration: BoxDecoration(
                      color: done ? const Color(0xFFD97706) : const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                );
              }),
            ),
            const SizedBox(height: 16),
            Align(
              alignment: Alignment.centerRight,
              child: ElevatedButton.icon(
                onPressed: state.completedGymSessions < state.gymGoal ? state.incrementGym : null,
                icon: const Icon(Icons.check, size: 16),
                label: const Text('Log Workout'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFFEF3C7),
                  foregroundColor: const Color(0xFFD97706),
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMealsCard(BuildContext context, AppState state) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: const Color(0xFFECFDF5), borderRadius: BorderRadius.circular(12)),
                  child: const Icon(Icons.restaurant_menu, color: Color(0xFF059669)),
                ),
                const SizedBox(width: 12),
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Meal Tracker', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                    Text('PostgreSQL nutrition logger', style: TextStyle(color: Color(0xFF64748B), fontSize: 12)),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 18),
            _buildMealRow(state, 'breakfast', 'Breakfast Reminder', state.loggedBreakfast),
            const Divider(color: Color(0xFFF1F5F9)),
            _buildMealRow(state, 'lunch', 'Lunch Reminder', state.loggedLunch),
            const Divider(color: Color(0xFFF1F5F9)),
            _buildMealRow(state, 'dinner', 'Dinner Reminder', state.loggedDinner),
          ],
        ),
      ),
    );
  }

  Widget _buildMealRow(AppState state, String key, String title, bool checked) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: const TextStyle(fontSize: 14, color: Color(0xFF334155))),
        Checkbox(
          value: checked,
          activeColor: const Color(0xFF059669),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
          onChanged: (_) => state.toggleMeal(key),
        )
      ],
    );
  }
}
