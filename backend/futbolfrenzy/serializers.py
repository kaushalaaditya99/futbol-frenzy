from rest_framework import serializers
from futbolfrenzy.models import Drill, Workout

#class serializers to help django convert JSON data to python objects

class DrillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drill
        fields = ['id', 'drillName', 'drillType', 'coachID', 'url',
                  'time', 'difficultyLevel', 'instructions', 'imageBackgroundColor',
                  'imageText', 'imageTextColor', 'publicDrill']
        read_only_fields = ['id']


class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ['id', 'workoutName', 'workoutType', 'coachID', 'dueDate',
                  'imageBackgroundColor','imageText', 'imageTextColor', 'drills', 'publicWorkout']
        read_only_fields = ['id']