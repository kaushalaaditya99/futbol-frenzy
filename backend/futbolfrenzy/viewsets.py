from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Notification, Settings, Drill, DrillBookmark, Workout, WorkoutBookmark, WorkoutDrill, Assignment, Submission, SubmittedDrill, SoccerClass, ClassMember
from futbolfrenzy.serializers import UserSerializer, NotificationSerializer, SettingsSerializer, DrillSerializer, DrillBookmarkSerializer, WorkoutSerializer, WorkoutBookmarkSerializer, WorkoutDrillSerializer, AssignmentSerializer, SubmissionSerializer, SubmittedDrillSerializer, SoccerClassSerializer, ClassMemberSerializer
from rest_framework.filters import OrderingFilter
from django.contrib.auth.models import User
from .services import notify_user
import random
import string
from rest_framework.decorators import action
from rest_framework.response import Response

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
            # Said it couldn't find it so I commented it out (Lysandra)
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


        #user_id = self.request.query_params.get("userID")
        #queryset = super().get_queryset()

        # notifications for a specific user
        #if user_id:
        #    queryset = queryset.filter(userID=user_id)

        return Notification.objects.filter(userID=self.request.user)


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
        publicDrills = Drill.objects.filter(publicDrill=True)
    
        if not self.request.user.is_authenticated:
            return publicDrills
        
        userDrills = Drill.objects.filter(coachID=self.request.user)
        return publicDrills | userDrills
        #all drills marked public
        publicDrills = Drill.objects.filter(publicDrill=True)
        #all drills belonging to a coach
        userDrills = Drill.objects.filter(coachID=self.request.user)

        #combine the two querysets using | operator (supports .get() unlike union())
        queryset = publicDrills | userDrills  # without duplicates

        #modify Drill to return public Drills and userDrills for a Coach. This action may have consequences
        #queryset = Drill.objects.all()
        #coach_id = self.request.query_params.get("coachID")

        # drills by a specific coach
        #if coach_id:
        #    queryset = queryset.filter(coachID=coach_id)

        return queryset

class DrillBookmarkViewSet(viewsets.ModelViewSet):
    queryset = DrillBookmark.objects.all()
    serializer_class = DrillBookmarkSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):

        queryset = DrillBookmark.objects.all()
        user_id = self.request.query_params.get('userID')

        # drills bookmarked by a specific user
        if user_id:
            queryset = queryset.filter(userID=user_id)

        return queryset


class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
    permission_classes = [AllowAny]

    filter_backends = [OrderingFilter]
    ordering_fields = ["dueDate"]
    ordering = ["dueDate"]  # default

    def get_queryset(self):

         #all workouts marked public
         publicWorkouts = Workout.objects.filter(publicWorkout=True)
         #all workouts belonging to a coach
         userWorkouts = Workout.objects.filter(coachID=self.request.user.id)

         #combine the two querysets using | operator (supports .get() unlike union())
         queryset = publicWorkouts | userWorkouts  # without duplicates
         return queryset


class WorkoutBookmarkViewSet(viewsets.ModelViewSet):
    queryset = WorkoutBookmark.objects.all()
    serializer_class = WorkoutBookmarkSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):

        queryset = WorkoutBookmark.objects.all()
        user_id = self.request.query_params.get('userID')

        # workouts bookmarked by a specific user
        if user_id:
            queryset = queryset.filter(userID=user_id)

        return queryset

class WorkoutDrillViewSet(viewsets.ModelViewSet):
    queryset = WorkoutDrill.objects.all()
    serializer_class = WorkoutDrillSerializer
    permission_classes = [AllowAny]


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

    # Notifies students when a new assignment is created for their class
    def perform_create(self, serializer):
        instance = serializer.save()

        # Assignment is linked to classes via M2M, notify all students in those classes
        for soccer_class in instance.soccer_classes.all():
            coach_name = f"{soccer_class.coachID.first_name} {soccer_class.coachID.last_name}".strip() or soccer_class.coachID.username
            for member in soccer_class.members.all():
                notify_user(
                    member.studentID,
                    title="New Assignment",
                    description=f"{coach_name} assigned a new session in {soccer_class.className}.",
                    icon="session",
                    iconBackground="#6db1ff",
                )


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

    # Notifies coach when a student submits an assignment
    def perform_create(self, serializer):
        instance = serializer.save()

        student = instance.studentID
        student_name = f"{student.first_name} {student.last_name}".strip() or student.username
        assignment = instance.assignmentID
        workout_name = assignment.workoutID.workoutName

        # Find which class this assignment belongs to and notify the coach
        for soccer_class in assignment.soccer_classes.all():
            notify_user(
                soccer_class.coachID,
                title="New Submission",
                description=f"{student_name} submitted {workout_name} in {soccer_class.className}.",
                icon="session",
                iconBackground="#c3f7c8",
            )



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

    # Notifies student when coach grades a drill
    def perform_update(self, serializer):
        instance = serializer.save()

        if 'grade' in serializer.validated_data:
            student = instance.submissionID.studentID
            drill = instance.drillID
            notify_user(
                student,
                title="Drill Graded!",
                description=f"You scored {instance.grade}/10 on {drill.drillName}.",
                icon="graded",
                iconBackground="#c3f7c8",
            )


class SoccerClassViewSet(viewsets.ModelViewSet):
    queryset = SoccerClass.objects.all()
    serializer_class = SoccerClassSerializer
    permission_classes = [AllowAny]

    # Need to generate a class code
    def perform_create(self, serializer):
        existing_codes = set(SoccerClass.objects.values_list('classCode', flat=True))

        # https://stackoverflow.com/questions/2257441/random-string-generation-with-upper-case-letters-and-digits
        N = 5
        class_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=N))
        while class_code in existing_codes:
            class_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=N))

        serializer.save(classCode=class_code)

    # Look for class by its code
    @action(detail=False, methods=['get'], url_path='code')
    def by_code(self, request):
        code = request.query_params.get('code')

        if not code:
            return Response({
                "error": "Must provide a code."
            }, status=400)

        try:
            object = SoccerClass.objects.get(classCode=code)
            serializer = self.get_serializer(object)
            return Response(serializer.data)
        except SoccerClass.DoesNotExist:
            return Response({
                "error": "There is no class with the provided code."
            }, status=404)


    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()

        if user_is_student(user):
            class_ids = ClassMember.objects.filter(studentID=user.id).values_list('classID', flat=True)


            queryset = queryset.filter(id__in=class_ids)

        else:
            queryset = queryset.filter(coachID=user.id)
        # PUT BACK WHEN DONE
        # elif user_is_coach(user):
        #     queryset = queryset.filter(coachID=user.id)
        # else:
        #     queryset = SoccerClass.objects.none()
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

    def get_queryset(self):
        queryset = super().get_queryset()
        class_id = self.request.query_params.get("classID")
        student_id = self.request.query_params.get("studentID")
        if class_id:
            queryset = queryset.filter(classID=class_id)
        if student_id:
            queryset = queryset.filter(studentID=student_id)
        return queryset

    # Notifies coach when a student joins their class
    def perform_create(self, serializer):
        instance = serializer.save()

        student = instance.studentID
        student_name = f"{student.first_name} {student.last_name}".strip() or student.username
        soccer_class = instance.classID

        notify_user(
            soccer_class.coachID,
            title="New Student",
            description=f"{student_name} joined {soccer_class.className}.",
            icon="chat",
            iconBackground="#E8DEF8",
        )
