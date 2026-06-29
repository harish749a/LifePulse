import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../models/models.dart';
import '../main.dart';

class HabitScreen extends StatefulWidget {
  const HabitScreen({super.key});

  @override
  State<HabitScreen> createState() => _HabitScreenState();
}

class _HabitScreenState extends State<HabitScreen> {
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  final _targetController = TextEditingController(text: '1');
  final _unitController = TextEditingController(text: 'times');
  
  String _selectedCategory = 'health';
  List<String> _selectedDays = ['Mon', 'Wed', 'Fri'];
  bool _isLoading = false;
  List<Habit> _habits = [];

  final List<String> _categories = ['health', 'fitness', 'mindfulness', 'tech', 'sleep'];
  final List<String> _weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  @override
  void initState() {
    super.initState();
    _fetchHabits();
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    _targetController.dispose();
    _unitController.dispose();
    super.dispose();
  }

  Future<void> _fetchHabits() async {
    setState(() => _isLoading = true);
    try {
      final api = Provider.of<ApiService>(context, listen: false);
      final rawList = await api.request('/habits') as List;
      setState(() {
        _habits = rawList.map((item) => Habit.fromJson(item)).toList();
      });
    } catch (e) {
      // Fallback to demo default habits if backend is unreachable
      setState(() {
        _habits = [
          Habit(
            id: 1,
            title: 'Read a book',
            description: 'Read 10 pages of any educational or tech book.',
            habitType: 'mindfulness',
            targetValue: 1,
            unit: 'time',
            frequency: ['Mon', 'Wed', 'Fri'],
            isActive: true,
          ),
          Habit(
            id: 2,
            title: 'Walk 10,000 steps',
            description: 'Maintain cardio fitness by tracking daily steps.',
            habitType: 'fitness',
            targetValue: 10000,
            unit: 'steps',
            frequency: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            isActive: true,
          ),
        ];
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _createHabit() async {
    if (_titleController.text.trim().isEmpty) return;

    final api = Provider.of<ApiService>(context, listen: false);
    final newHabit = Habit(
      title: _titleController.text.trim(),
      description: _descController.text.trim(),
      habitType: _selectedCategory,
      targetValue: int.tryParse(_targetController.text) ?? 1,
      unit: _unitController.text.trim(),
      frequency: _selectedDays,
      isActive: true,
    );

    // Close bottom sheet
    Navigator.pop(context);

    setState(() => _isLoading = true);
    try {
      await api.syncHabit(newHabit);
      _titleController.clear();
      _descController.clear();
      _targetController.text = '1';
      _unitController.text = 'times';
      await _fetchHabits();
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Habit added successfully! Synchronized to your database.'),
            backgroundColor: Color(0xFF059669),
          ),
        );
      }
    } catch (e) {
      setState(() {
        _habits.add(newHabit); // optimistic UI adding
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _showAddHabitSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setModalState) {
            return Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(28.0),
                  topRight: Radius.circular(28.0),
                ),
              ),
              padding: EdgeInsets.only(
                top: 24.0,
                left: 24.0,
                right: 24.0,
                bottom: MediaQuery.of(context).viewInsets.bottom + 24.0,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Add New Habit',
                          style: TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () => Navigator.pop(context),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    
                    TextField(
                      controller: _titleController,
                      decoration: InputDecoration(
                        labelText: 'Habit Title',
                        hintText: 'e.g., Code for 1 hour',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                    ),
                    const SizedBox(height: 12),
                    
                    TextField(
                      controller: _descController,
                      decoration: InputDecoration(
                        labelText: 'Description',
                        hintText: 'Short notes about your objective',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                    ),
                    const SizedBox(height: 16),
                    
                    // Category selector
                    const Text('Category', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF64748B))),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8.0,
                      children: _categories.map((cat) {
                        bool selected = _selectedCategory == cat;
                        return ChoiceChip(
                          label: Text(cat.toUpperCase(), style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                          selected: selected,
                          selectedColor: const Color(0xFFD1FAE5),
                          checkmarkColor: const Color(0xFF059669),
                          labelStyle: TextStyle(color: selected ? const Color(0xFF059669) : const Color(0xFF475569)),
                          onSelected: (val) {
                            if (val) {
                              setModalState(() {
                                _selectedCategory = cat;
                              });
                            }
                          },
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 16),

                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _targetController,
                            keyboardType: TextInputType.number,
                            decoration: InputDecoration(
                              labelText: 'Target Value',
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextField(
                            controller: _unitController,
                            decoration: InputDecoration(
                              labelText: 'Unit',
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    const Text('Frequency (Days)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF64748B))),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 6.0,
                      children: _weekdays.map((day) {
                        bool isChosen = _selectedDays.contains(day);
                        return FilterChip(
                          label: Text(day, style: const TextStyle(fontSize: 11)),
                          selected: isChosen,
                          selectedColor: const Color(0xFFECFDF5),
                          checkmarkColor: const Color(0xFF059669),
                          onSelected: (val) {
                            setModalState(() {
                              if (val) {
                                _selectedDays.add(day);
                              } else {
                                _selectedDays.remove(day);
                              }
                            });
                          },
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 24),

                    ElevatedButton(
                      onPressed: _createHabit,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF059669),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        elevation: 0,
                      ),
                      child: const Text('Sync & Save Habit', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  Color _getCategoryColor(String type) {
    switch (type.toLowerCase()) {
      case 'fitness':
        return const Color(0xFFFCD34D); // Amber
      case 'mindfulness':
        return const Color(0xFF93C5FD); // Blue
      case 'tech':
        return const Color(0xFFC084FC); // Purple
      case 'sleep':
        return const Color(0xFFFDA4AF); // Rose
      default:
        return const Color(0xFFA7F3D0); // Emerald
    }
  }

  IconData _getCategoryIcon(String type) {
    switch (type.toLowerCase()) {
      case 'fitness':
        return Icons.fitness_center;
      case 'mindfulness':
        return Icons.spa;
      case 'tech':
        return Icons.code;
      case 'sleep':
        return Icons.bedtime;
      default:
        return Icons.health_and_safety;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Your Habit Checklists', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: const Color(0xFF0F172A),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _fetchHabits,
            tooltip: 'Refresh live DB',
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddHabitSheet,
        backgroundColor: const Color(0xFF059669),
        foregroundColor: Colors.white,
        child: const Icon(Icons.add),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF059669)))
          : _habits.isEmpty
              ? _buildEmptyState()
              : ListView.builder(
                  padding: const EdgeInsets.all(24.0),
                  itemCount: _habits.length,
                  itemBuilder: (context, index) {
                    final h = _habits[index];
                    Color categoryColor = _getCategoryColor(h.habitType);
                    IconData icon = _getCategoryIcon(h.habitType);

                    return Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFFF1F5F9)),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(20),
                        child: Theme(
                          data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
                          child: ExpansionTile(
                            leading: Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: categoryColor.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: Icon(icon, color: categoryColor.withOpacity(0.9) == Colors.white ? Colors.black : Color.lerp(categoryColor, Colors.black, 0.4)),
                            ),
                            title: Text(
                              h.title,
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF0F172A)),
                            ),
                            subtitle: Text(
                              'Goal: ${h.targetValue} ${h.unit}',
                              style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                            ),
                            trailing: Switch(
                              value: h.isActive,
                              activeColor: const Color(0xFF059669),
                              onChanged: (val) {
                                setState(() {
                                  // Update state locally for reactive touch
                                  _habits[index] = Habit(
                                    id: h.id,
                                    title: h.title,
                                    description: h.description,
                                    habitType: h.habitType,
                                    targetValue: h.targetValue,
                                    unit: h.unit,
                                    frequency: h.frequency,
                                    isActive: val,
                                  );
                                });
                              },
                            ),
                            children: [
                              Padding(
                                padding: const EdgeInsets.only(left: 20.0, right: 20.0, bottom: 20.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    if (h.description.isNotEmpty) ...[
                                      const Text(
                                        'NOTES',
                                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF94A3B8)),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        h.description,
                                        style: const TextStyle(fontSize: 13, color: Color(0xFF475569), height: 1.4),
                                      ),
                                      const SizedBox(height: 12),
                                    ],
                                    const Text(
                                      'FREQUENCY SCHEDULE',
                                      style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF94A3B8)),
                                    ),
                                    const SizedBox(height: 6),
                                    Wrap(
                                      spacing: 4,
                                      children: h.frequency.map((day) {
                                        return Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                          decoration: BoxDecoration(
                                            color: const Color(0xFFF1F5F9),
                                            borderRadius: BorderRadius.circular(6),
                                          ),
                                          child: Text(
                                            day,
                                            style: const TextStyle(fontSize: 10, color: Color(0xFF475569), fontWeight: FontWeight.bold),
                                          ),
                                        );
                                      }).toList(),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                ),
    );
  }

  Widget _buildEmptyState() {
    return Padding(
      padding: const EdgeInsets.all(32.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.spa, size: 80, color: Colors.green[100]),
          const SizedBox(height: 16),
          const Text(
            'Begin Building Habits',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF1E293B)),
          ),
          const SizedBox(height: 8),
          const Text(
            'Create personal metrics checklists. Your statistics will sync seamlessly to PostgreSQL.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Color(0xFF64748B), height: 1.4),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: _showAddHabitSheet,
            icon: const Icon(Icons.add),
            label: const Text('Create First Habit'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF059669),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              elevation: 0,
            ),
          ),
        ],
      ),
    );
  }
}
