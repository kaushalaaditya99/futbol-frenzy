from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Notification, Settings, Drill, Workout, Assignment, Submission, SubmittedDrill, SoccerClass, ClassMember
from futbolfrenzy.serializers import NotificationSerializer, SettingsSerializer, DrillSerializer, WorkoutSerializer, AssignmentSerializer, SubmissionSerializer, SubmittedDrillSerializer, SoccerClassSerializer, ClassMemberSerializer
# viewsets for databases

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]

class SettingsViewSet(viewsets.ModelViewSet):
    queryset = Settings.objects.all()
    serializer_class = SettingsSerializer
    permission_classes = [AllowAny]

class DrillViewSet(viewsets.ModelViewSet):
    queryset = Drill.objects.all()
    serializer_class = DrillSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Drill.objects.all()
        coach_id = self.request.query_params.get('coachID')

        if coach_id is not None:
            queryset = queryset.filter(coachID=coach_id)

        return queryset

class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
    permission_classes = [AllowAny]

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()

        student_id = self.request.query_params.get("studentID")
        class_id = self.request.query_params.get("classID")

        # assignments for a specific student
        if student_id:
            queryset = queryset.filter(
                soccer_classes__classmember__studentID=student_id
            ).distinct()

        # assignments for a specific class
        if class_id:
            queryset = queryset.filter(
                soccer_classes__id=class_id
            ).distinct()

        return queryset

class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [AllowAny]

class SubmittedDrillViewSet(viewsets.ModelViewSet):
    queryset = SubmittedDrill.objects.all()
    serializer_class = SubmittedDrillSerializer
    permission_classes = [AllowAny]

class SoccerClassViewSet(viewsets.ModelViewSet):
    queryset = SoccerClass.objects.all()
    serializer_class = SoccerClassSerializer
    permission_classes = [AllowAny]

class ClassMemberViewSet(viewsets.ModelViewSet):
    queryset = ClassMember.objects.all()
    serializer_class = ClassMemberSerializer
    permission_classes = [AllowAny]