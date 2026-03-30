from rest_framework import serializers
from .models import Notification, Settings, Drill, Workout, Assignment, Submission, SubmittedDrill, SoccerClass, ClassMember

#class serializers to help django convert JSON data to python objects

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'userID', 'title', 'body', 'url', 'seen']
        read_only_fields = ['id']

class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = ['id', 'userID', 'mode', 'notificationType', 
                  'profilePicture', 'profileBackgroundColor', 'position']
        read_only_fields = ['id']


class DrillSerializer(serializers.ModelSerializer):
    coachName = serializers.CharField(source='coachID.username', read_only=True)

    class Meta:
        model = Drill
        fields = ['id', 'drillName', 'drillType', 'coachID', 'coachName', 'url',
                  'time', 'difficultyLevel', 'instructions', 'imageBackgroundColor',
                  'imageText', 'imageTextColor', 'publicDrill']
        read_only_fields = ['id']


class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ['id', 'workoutName', 'workoutType', 'coachID', 'dueDate',
                  'imageBackgroundColor','imageText', 'imageTextColor', 'drills', 'publicWorkout']
        read_only_fields = ['id']

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ['id', 'workoutID', 'dueDate', 
                  'imageBackgroundColor','imageText', 'imageTextColor']
        read_only_fields = ['id']

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['id', 'studentID', 'assignmentID', 'grade',
                  'dateGraded', 'dateSubmitted', 
                  'imageBackgroundColor','imageText', 'imageTextColor']
        read_only_fields = ['id']

class SubmittedDrillSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubmittedDrill
        fields = ['id', 'submissionID', 'drillID', 
                  'videoURL','grade', 'touchCount']
        read_only_fields = ['id']

class SoccerClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoccerClass
        fields = ['id', 'className', 'coachID', 'assignments']
        read_only_fields = ['id']

class ClassMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassMember
        fields = ['id', 'studentID', 'classID']
        read_only_fields = ['id']
