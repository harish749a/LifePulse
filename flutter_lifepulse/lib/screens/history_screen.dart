import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../models/models.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isLoading = false;

  List<Meal> _meals = [];
  List<WorkoutLog> _workouts = [];
  List<WaterLog> _waterLogs = [];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _fetchHistoryData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _fetchHistoryData() async {
    setState(() => _isLoading = true);
    final api = Provider.of<ApiService>(context, listen: false);

    try {
      final List rawMeals = await api.request('/meals') as List;
      final List rawWorkouts = await api.request('/workout-logs') as List;
      final List rawWater = await api.request('/water-logs') as List;

      setState(() {
        _meals = rawMeals.map((m) => Meal.fromJson(m)).toList();
        _workouts = rawWorkouts.map((w) => WorkoutLog.fromJson(w)).toList();
        _waterLogs = rawWater.map((wt) => WaterLog.fromJson(wt)).toList();
      });
    } catch (e) {
      // Setup mock data fallback if FastAPI backend is not running or offline
      setState(() {
        _meals = [
          Meal(id: 1, mealName: 'Granola & Greek Yogurt', mealType: 'breakfast', calories: 350, protein: 18, carbs: 45, fat: 8, mealTime: DateTime.now().subtract(const Duration(hours: 4)), notes: 'High protein breakfast'),
          Meal(id: 2, mealName: 'Grilled Chicken & Quinoa', mealType: 'lunch', calories: 550, protein: 42, carbs: 60, fat: 12, mealTime: DateTime.now().subtract(const Duration(hours: 1)), notes: 'Clean nutrition'),
        ];
        _workouts = [
          WorkoutLog(id: 1, workoutName: 'Cardio Core Training', durationMinutes: 35, caloriesBurned: 280, workoutDate: DateTime.now().subtract(const Duration(hours: 2)), notes: 'Indoor cycling and core workouts'),
        ];
        _waterLogs = [
          WaterLog(id: 1, quantityMl: 250, loggedAt: DateTime.now().subtract(const Duration(hours: 3))),
          WaterLog(id: 2, quantityMl: 250, loggedAt: DateTime.now().subtract(const Duration(hours: 5))),
        ];
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  double get _totalCaloriesConsumed {
    return _meals.fold(0.0, (sum, m) => sum + m.calories);
  }

  int get _totalCaloriesBurned {
    return _workouts.fold(0, (sum, w) => sum + w.caloriesBurned);
  }

  int get _totalWaterDrank {
    return _waterLogs.fold(0, (sum, wt) => sum + wt.quantityMl);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('PostgreSQL Pulse Analytics', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: const Color(0xFF0F172A),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _fetchHistoryData,
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          labelColor: const Color(0xFF059669),
          unselectedLabelColor: const Color(0xFF64748B),
          indicatorColor: const Color(0xFF059669),
          tabs: const [
            Tab(icon: Icon(Icons.restaurant_menu), text: 'Nutrition'),
            Tab(icon: Icon(Icons.fitness_center), text: 'Workouts'),
            Tab(icon: Icon(Icons.local_drink), text: 'Hydration'),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF059669)))
          : Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Summary KPI Bar
                _buildSummaryHeader(),
                
                // Tab Views
                Expanded(
                  child: TabBarView(
                    controller: _tabController,
                    children: [
                      _buildMealsTab(),
                      _buildWorkoutsTab(),
                      _buildWaterTab(),
                    ],
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildSummaryHeader() {
    return Container(
      margin: const EdgeInsets.all(24.0),
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B), // slate-800
        borderRadius: BorderRadius.circular(24),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildKpiItem('Intake', '${_totalCaloriesConsumed.round()} kcal', Icons.restaurant, Colors.greenAccent),
          _buildKpiItem('Burned', '$_totalCaloriesBurned kcal', Icons.flash_on, Colors.amberAccent),
          _buildKpiItem('Water', '$_totalWaterDrank ml', Icons.local_drink, Colors.blueAccent),
        ],
      ),
    );
  }

  Widget _buildKpiItem(String label, String value, IconData icon, Color accent) {
    return Column(
      children: [
        Icon(icon, color: accent, size: 20),
        const SizedBox(height: 6),
        Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 10, fontWeight: FontWeight.w500)),
      ],
    );
  }

  Widget _buildMealsTab() {
    if (_meals.isEmpty) return _buildNoDataState('No meal logs found.');

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
      itemCount: _meals.length,
      itemBuilder: (context, index) {
        final m = _meals[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: const CircleAvatar(
              backgroundColor: Color(0xFFECFDF5),
              child: Icon(Icons.restaurant, color: Color(0xFF059669), size: 18),
            ),
            title: Text(m.mealName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            subtitle: Text(m.mealType.toUpperCase(), style: const TextStyle(color: Color(0xFF64748B), fontSize: 11, fontWeight: FontWeight.bold)),
            trailing: Text(
              '${m.calories.round()} kcal',
              style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
            ),
          ),
        );
      },
    );
  }

  Widget _buildWorkoutsTab() {
    if (_workouts.isEmpty) return _buildNoDataState('No workout records logged.');

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
      itemCount: _workouts.length,
      itemBuilder: (context, index) {
        final w = _workouts[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: const CircleAvatar(
              backgroundColor: Color(0xFFFEF3C7),
              child: Icon(Icons.fitness_center, color: Color(0xFFD97706), size: 18),
            ),
            title: Text(w.workoutName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            subtitle: Text('${w.durationMinutes} minutes workout', style: const TextStyle(color: Color(0xFF64748B), fontSize: 12)),
            trailing: Text(
              '-${w.caloriesBurned} kcal',
              style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFD97706)),
            ),
          ),
        );
      },
    );
  }

  Widget _buildWaterTab() {
    if (_waterLogs.isEmpty) return _buildNoDataState('No water logs created today.');

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
      itemCount: _waterLogs.length,
      itemBuilder: (context, index) {
        final wt = _waterLogs[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: const CircleAvatar(
              backgroundColor: Color(0xFFEFF6FF),
              child: Icon(Icons.local_drink, color: Color(0xFF3B82F6), size: 18),
            ),
            title: const Text('Water Intake Log', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            subtitle: Text('Logged: ${wt.loggedAt.hour.toString().padLeft(2, '0')}:${wt.loggedAt.minute.toString().padLeft(2, '0')}', style: const TextStyle(color: Color(0xFF64748B), fontSize: 12)),
            trailing: Text(
              '+${wt.quantityMl} ml',
              style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF3B82F6)),
            ),
          ),
        );
      },
    );
  }

  Widget _buildNoDataState(String msg) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.hourglass_empty, size: 48, color: Color(0xFFCBD5E1)),
          const SizedBox(height: 12),
          Text(msg, style: const TextStyle(color: Color(0xFF64748B), fontSize: 14)),
        ],
      ),
    );
  }
}
