from django.contrib.auth.models import Group, User
from rest_framework import serializers
from django.db.models import F, Value
from django.db.models.functions import Coalesce
from .models import Notification, Settings, Drill, DrillBookmark, Workout, WorkoutBookmark, WorkoutDrill, Assignment, Submission, SubmittedDrill, SoccerClass, ClassMember
#class serializers to help django convert JSON data to python objects

class StudentSerializer(serializers.ModelSerializer):
    position = serializers.CharField(read_only=True, allow_blank=True)
    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "position",
        ]
        read_only_fields = ["id", "position"]

class UserSerializer(serializers.ModelSerializer):
    group = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "password",
            "email",
            "first_name",
            "last_name",
            "group",
        ]
        extra_kwargs = {"password": {"write_only": True}}
        read_only_fields = ["id"]

    # overwrite User Post function to fix validation issues
    def create(self, validated_data):

        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )

        # log user with relevant group(does it need logic to validate presence of Student and Coach group?)

        # adds user to group, will create group if it doesnt exist
        my_group, created = Group.objects.get_or_create(name=validated_data["group"])
        user.groups.add(my_group)

        user_default_settings = Settings.objects.create(userID=user, mode="light")

        return user


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'userID', 'title', 'description', 'url', 'read', 'created_at', 'icon', 'iconBackground']
        read_only_fields = ['id']

class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = [
            "userID",
            "mode",
            "notificationType",
            "profilePicture",
            "profileBackgroundColor",
            "position",
            "isDarkMode",
        ]
        read_only_fields = ["id"]


class DrillSerializer(serializers.ModelSerializer):
    coach = serializers.SerializerMethodField()

    class Meta:
        model = Drill
        fields = ['id', 'drillName', 'drillType', 'coachID', 'url',
                  'difficultyLevel', 'instructions', 'imageBackgroundColor',
                  'imageText', 'imageTextColor', 'publicDrill', 'coach']
        read_only_fields = ['id', 'coach']
    
    def get_coach(self, obj):
        return UserSerializer(obj.coachID).data


class DrillBookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = DrillBookmark
        fields = ['id', 'drillID', 'userID']
        read_only_fields = ['id']


class WorkoutBookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutBookmark
        fields = ['id', 'workoutID', 'userID']
        read_only_fields = ['id']

class WorkoutDrillSerializer(serializers.ModelSerializer):
    drill = DrillSerializer(source='drillID', read_only=True) 

    class Meta:
        model = WorkoutDrill
        fields = ['id', 'workoutID', 'drillID', 'drill', 'minutes', 'repetitions']
        read_only_fields = ['id']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        drill_data = representation.pop('drill')
        representation.update(drill_data)
        return representation

class WorkoutSerializer(serializers.ModelSerializer):
    coach = serializers.SerializerMethodField()
    drills = WorkoutDrillSerializer(source='workoutdrill_set', many=True, read_only=True)

    class Meta:
        model = Workout
        fields = [
            "id",
            "workoutName",
            "workoutType",
            "coachID",
            "dueDate",
            "imageBackgroundColor",
            "imageText",
            "imageTextColor",
            "drills",
            "publicWorkout",
            'coach'
        ]
        read_only_fields = ["id", 'coach', 'drills']

    def get_coach(self, obj):
        return UserSerializer(obj.coachID).data

    def create(self, validated_data):
        drills_data = self.context.get('request').data.get('drills', [])
        workout = Workout.objects.create(**validated_data)
        for drill_data in drills_data:
            WorkoutDrill.objects.create(
                workoutID=workout,
                drillID_id=drill_data.get('drillID'),
                minutes=drill_data.get('minutes'),
                repetitions=drill_data.get('repetitions')
            )
        return workout

class SubmittedDrillSerializer(serializers.ModelSerializer):
    drill = serializers.SerializerMethodField()

    class Meta:
        model = SubmittedDrill
        fields = ["id", "submissionID", "drillID", "videoURL", "grade", "touchCount", "feedback", 'drill']
        read_only_fields = ["id", 'drill']
    
    def get_drill(self, obj):
        return DrillSerializer(obj.drillID).data

class SubmissionSerializer(serializers.ModelSerializer):
    student = serializers.SerializerMethodField()
    submitted_drills = serializers.SerializerMethodField()

    class Meta:
        model = Submission
        fields = [
            "id",
            "studentID",
            "assignmentID",
            "grade",
            "dateGraded",
            "dateSubmitted",
            "imageBackgroundColor",
            "imageText",
            "imageTextColor",
            'student',
            'submitted_drills'
        ]
        read_only_fields = [
            "id", 
            'student',
            'submitted_drills'
        ]
    
    def get_student(self, obj):
        return StudentSerializer(obj.studentID).data
    
    def get_submitted_drills(self, obj):
        submitted_drills = obj.submitteddrill_set.all()
        return SubmittedDrillSerializer(submitted_drills, many=True).data

class AssignmentSerializer(serializers.ModelSerializer):
    workout = serializers.SerializerMethodField()
    submissions = serializers.SerializerMethodField()
    soccer_classes = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=SoccerClass.objects.all(),
        required=False
    )

    class Meta:
        model = Assignment
        fields = [
            "id",
            "workoutID",
            "dueDate",
            "imageBackgroundColor",
            "imageText",
            "imageTextColor",
            'workout',
            'submissions',
            'soccer_classes'
        ]
        read_only_fields = ["id", 'workout', 'submissions']

    def get_workout(self, obj):
        return WorkoutSerializer(obj.workoutID).data

    def get_submissions(self, obj):
        submissions = obj.submission_set.all()
        return SubmissionSerializer(submissions, many=True).data

class SoccerClassSerializer(serializers.ModelSerializer):
    coach = serializers.SerializerMethodField()
    students = serializers.SerializerMethodField()

    class Meta:
        model = SoccerClass
        fields = ['id', 'className', 'classCode', 'coachID', 'description', 'assignments', 'students', 'coach', 'imageText', 'imageTextColor', 'imageBackgroundColor']
        read_only_fields = ['id', 'students', 'coach']

    def get_coach(self, obj):
        return UserSerializer(obj.coachID).data

    def get_students(self, obj):
        student_ids = ClassMember.objects.filter(classID=obj).values_list('studentID', flat=True)
        users = User.objects.filter(id__in=student_ids).annotate(
            position=Coalesce(F('settings__position'), Value('US'))
        )
        return StudentSerializer(users, many=True).data


class ClassMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassMember
        fields = ['id', 'studentID', 'classID']
        read_only_fields = ['id', 'classCode']
