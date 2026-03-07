from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Notification, Settings, Drill, Workout, Assignment, Submission, SubmittedDrill, SoccerClass, ClassMember
from futbolfrenzy.serializers import NotificationSerializer, SettingsSerializer, DrillSerializer, WorkoutSerializer, AssignmentSerializer, SubmissionSerializer, SubmittedDrillSerializer, SoccerClassSerializer, ClassMemberSerializer
from rest_framework.filters import OrderingFilter
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

    filter_backends = [OrderingFilter]

    # fields that you can sort by (use -dueDate for descending)
    ordering_fields = ['dueDate']
    # default sorting
    ordering = ['dueDate']   

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

    filter_backends = [OrderingFilter]
    ordering_fields = ['dateSubmitted', 'grade', 'dateGraded']
    ordering = ['-dateSubmitted'] # default order

    def get_queryset(self):
        queryset = super().get_queryset()
        student_id = self.request.query_params.get("studentID")
        assignment_id = self.request.query_params.get("assignmentID")

        # submissions for a specific student
        if student_id:
            queryset = queryset.filter(studentID=student_id)

        # submissions for a specific assignment (probably coach use for grading)
        if assignment_id:
            queryset = queryset.filter(assignmentID=assignment_id)

        return queryset

class SubmittedDrillViewSet(viewsets.ModelViewSet):
    queryset = SubmittedDrill.objects.all()
    serializer_class = SubmittedDrillSerializer
    permission_classes = [AllowAny]

    filter_backends = [OrderingFilter]
    ordering_fields = ['grade', 'touchCount']
    ordering = ['-grade'] #default

    def get_queryset(self):
        queryset = super().get_queryset()
        student_id = self.request.query_params.get("studentID")
        assignment_id = self.request.query_params.get("assignmentID")
        drill_id = self.request.query_params.get("drillID")

        # drill submissions from a specific student (student use probably to view feedback and grades)
        if student_id:
            queryset = queryset.filter(submissionID__studentID=student_id)

        # drill submissions for a specific assignment (coach use for grading probably)
        if assignment_id:
            queryset = queryset.filter(submissionID__assignmentID=assignment_id)

        # drill submissions for a specific drill
        if drill_id:
            queryset = queryset.filter(drillID=drill_id)

        return queryset

class SoccerClassViewSet(viewsets.ModelViewSet):
    queryset = SoccerClass.objects.all()
    serializer_class = SoccerClassSerializer
    permission_classes = [AllowAny]

    # classes for a specific student
    def get_queryset(self):
        queryset = super().get_queryset()
        student_id = self.request.query_params.get("studentID")
        if student_id:
            queryset = queryset.filter(classmember__studentID=student_id).distinct()
        return queryset

class ClassMemberViewSet(viewsets.ModelViewSet):
    queryset = ClassMember.objects.all()
    serializer_class = ClassMemberSerializer
    permission_classes = [AllowAny]