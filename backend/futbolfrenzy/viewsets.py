from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import AllowAny, IsAuthenticated

from futbolfrenzy.serializers import (
    AssignmentSerializer,
    ClassMemberSerializer,
    DrillSerializer,
    NotificationSerializer,
    SettingsSerializer,
    SoccerClassSerializer,
    SubmissionSerializer,
    SubmittedDrillSerializer,
    UserSerializer,
    WorkoutSerializer,
)

from .models import (
    Assignment,
    ClassMember,
    Drill,
    Notification,
    Settings,
    SoccerClass,
    Submission,
    SubmittedDrill,
    Workout,
)


# helpers to check group of a user (Student vs. Coach)
def user_is_student(user):
    return user.groups.filter(name="Student").exists()


def user_is_coach(user):
    return user.groups.filter(name="Coach").exists()


# VIEWSETS


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == "create":
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    # def get_queryset(self):
    # Users can only see/edit their own account
    #   if self.request.user.is_authenticated:
    #     return User.objects.filter(id=self.request.user.id)
    #  return User.objects.none()


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):

        user_id = self.request.query_params.get("userID")
        queryset = super().get_queryset()

        # notifications for a specific user
        if user_id:
            queryset = queryset.filter(userID=user_id)

        return queryset


class SettingsViewSet(viewsets.ModelViewSet):
    queryset = Settings.objects.all()
    serializer_class = SettingsSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):

        user_id = self.request.query_params.get("userID")
        queryset = super().get_queryset()

        # settings for a specific user
        if user_id:
            queryset = queryset.filter(userID=user_id)

        return queryset


class DrillViewSet(viewsets.ModelViewSet):
    queryset = Drill.objects.all()
    serializer_class = DrillSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):

        queryset = Drill.objects.all()
        coach_id = self.request.query_params.get("coachID")

        # drills by a specific coach
        if coach_id:
            queryset = queryset.filter(coachID=coach_id)

        return queryset


class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
    permission_classes = [AllowAny]

    filter_backends = [OrderingFilter]
    ordering_fields = ["dueDate"]
    ordering = ["dueDate"]  # default

    def get_queryset(self):

        queryset = super().get_queryset()
        coach_id = self.request.query_params.get("coachID")

        # workouts made by a specific coach
        if coach_id:
            queryset = queryset.filter(coachID=coach_id)

        return queryset


class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [AllowAny]

    filter_backends = [OrderingFilter]

    # fields that you can sort by (use -dueDate for descending)
    ordering_fields = ["dueDate"]
    # default sorting
    ordering = ["dueDate"]

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
            queryset = queryset.filter(soccer_classes__id=class_id).distinct()

        return queryset


class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [AllowAny]

    filter_backends = [OrderingFilter]
    ordering_fields = ["dateSubmitted", "grade", "dateGraded"]
    ordering = ["-dateSubmitted"]  # default order

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
    ordering_fields = ["grade", "touchCount"]
    ordering = ["-grade"]  # default

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

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()

        if user_is_student(user):
            queryset = queryset.filter(members__studentID=user.id).distinct()
        elif user_is_coach(user):
            queryset = queryset.filter(coachID=user.id)
        else:
            queryset = SoccerClass.objects.none()
        return queryset

    """
    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()

        coach_id = self.request.query_params.get("coachID")
        student_id = self.request.query_params.get("studentID")

        # classes made by a specific coach (coach view)
        if coach_id:
            queryset = queryset.filter(coachID=coach_id)

        # classes that a specific student is in (student view)
        if student_id:
            queryset = queryset.filter(classmember__studentID=student_id).distinct()
        return queryset
        """


class ClassMemberViewSet(viewsets.ModelViewSet):
    queryset = ClassMember.objects.all()
    serializer_class = ClassMemberSerializer
    permission_classes = [AllowAny]
