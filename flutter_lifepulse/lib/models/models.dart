class User {
  final int? id;
  final String email;
  final String name;

  User({this.id, required this.email, required this.name});

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'] ?? '',
      name: json['name'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'email': email,
      'name': name,
    };
  }
}

class Habit {
  final int? id;
  final String title;
  final String description;
  final String habitType;
  final int targetValue;
  final String unit;
  final List<String> frequency;
  final bool isActive;

  Habit({
    this.id,
    required this.title,
    required this.description,
    required this.habitType,
    required this.targetValue,
    required this.unit,
    required this.frequency,
    required this.isActive,
  });

  factory Habit.fromJson(Map<String, dynamic> json) {
    var freqRaw = json['frequency'] ?? '';
    List<String> freqList = freqRaw.toString().split(',').where((s) => s.isNotEmpty).toList();
    return Habit(
      id: json['id'],
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      habitType: json['habit_type'] ?? 'health',
      targetValue: json['target_value'] ?? 1,
      unit: json['unit'] ?? 'times',
      frequency: freqList,
      isActive: json['is_active'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'title': title,
      'description': description,
      'habit_type': habitType,
      'target_value': targetValue,
      'unit': unit,
      'frequency': frequency.join(','),
      'is_active': isActive,
    };
  }
}

class WaterLog {
  final int? id;
  final int quantityMl;
  final DateTime loggedAt;

  WaterLog({this.id, required this.quantityMl, required this.loggedAt});

  factory WaterLog.fromJson(Map<String, dynamic> json) {
    return WaterLog(
      id: json['id'],
      quantityMl: json['quantity_ml'] ?? 0,
      loggedAt: DateTime.parse(json['logged_at'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'quantity_ml': quantityMl,
      'logged_at': loggedAt.toIso8601String(),
    };
  }
}

class WorkoutLog {
  final int? id;
  final String workoutName;
  final int durationMinutes;
  final int caloriesBurned;
  final DateTime workoutDate;
  final String notes;

  WorkoutLog({
    this.id,
    required this.workoutName,
    required this.durationMinutes,
    required this.caloriesBurned,
    required this.workoutDate,
    required this.notes,
  });

  factory WorkoutLog.fromJson(Map<String, dynamic> json) {
    return WorkoutLog(
      id: json['id'],
      workoutName: json['workout_name'] ?? '',
      durationMinutes: json['duration_minutes'] ?? 0,
      caloriesBurned: json['calories_burned'] ?? 0,
      workoutDate: DateTime.parse(json['workout_date'] ?? DateTime.now().toIso8601String()),
      notes: json['notes'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'workout_name': workoutName,
      'duration_minutes': durationMinutes,
      'calories_burned': caloriesBurned,
      'workout_date': workoutDate.toIso8601String(),
      'notes': notes,
    };
  }
}

class Meal {
  final int? id;
  final String mealName;
  final String mealType;
  final double calories;
  final double protein;
  final double carbs;
  final double fat;
  final DateTime mealTime;
  final String notes;

  Meal({
    this.id,
    required this.mealName,
    required this.mealType,
    required this.calories,
    required this.protein,
    required this.carbs,
    required this.fat,
    required this.mealTime,
    required this.notes,
  });

  factory Meal.fromJson(Map<String, dynamic> json) {
    return Meal(
      id: json['id'],
      mealName: json['meal_name'] ?? '',
      mealType: json['meal_type'] ?? '',
      calories: (json['calories'] ?? 0.0).toDouble(),
      protein: (json['protein'] ?? 0.0).toDouble(),
      carbs: (json['carbs'] ?? 0.0).toDouble(),
      fat: (json['fat'] ?? 0.0).toDouble(),
      mealTime: DateTime.parse(json['meal_time'] ?? DateTime.now().toIso8601String()),
      notes: json['notes'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'meal_name': mealName,
      'meal_type': mealType,
      'calories': calories,
      'protein': protein,
      'carbs': carbs,
      'fat': fat,
      'meal_time': mealTime.toIso8601String(),
      'notes': notes,
    };
  }
}

class DailyScore {
  final int? id;
  final int waterScore;
  final int nutritionScore;
  final int activityScore;
  final int sleepScore;
  final int overallScore;
  final DateTime scoreDate;

  DailyScore({
    this.id,
    required this.waterScore,
    required this.nutritionScore,
    required this.activityScore,
    required this.sleepScore,
    required this.overallScore,
    required this.scoreDate,
  });

  factory DailyScore.fromJson(Map<String, dynamic> json) {
    return DailyScore(
      id: json['id'],
      waterScore: json['water_score'] ?? 0,
      nutritionScore: json['nutrition_score'] ?? 0,
      activityScore: json['activity_score'] ?? 0,
      sleepScore: json['sleep_score'] ?? 0,
      overallScore: json['overall_score'] ?? 0,
      scoreDate: DateTime.parse(json['score_date'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'water_score': waterScore,
      'nutrition_score': nutritionScore,
      'activity_score': activityScore,
      'sleep_score': sleepScore,
      'overall_score': overallScore,
      'score_date': scoreDate.toIso8601String().split('T')[0],
    };
  }
}
