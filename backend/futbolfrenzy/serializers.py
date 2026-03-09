from rest_framework import serializers
from .models import Notification, Settings, Drill, Workout, Assignment, Submission, SubmittedDrill, SoccerClass, ClassMember
from django.contrib.auth.models import User
#class serializers to help django convert JSON data to python objects

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name']
        extra_kwargs = {
            'password': {'write_only': True}
        }
        read_only_fields = ['id']
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        return user


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
