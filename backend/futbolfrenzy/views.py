from django.shortcuts import render
from .models import Drill, Settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import User, Drill, Workout, Assignment, Submission, SubmittedDrill, SoccerClass, ClassMember
from .serializers import SoccerClassSerializer, AssignmentSerializer, SubmissionSerializer
import os
import boto3
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User, Group
import os
from dotenv import load_dotenv
import uuid
from .mediapipe import PoseService, VideoPoseService
from rest_framework import status
from django.utils.dateparse import parse_datetime, parse_date
from django.db.models import Q
from django.utils import timezone

load_dotenv(override=True)

GOOGLE_WEB_CLIENT_ID = os.getenv('GOOGLE_WEB_CLIENT_ID')
GOOGLE_IOS_CLIENT_ID = os.getenv('GOOGLE_IOS_CLIENT_ID')
GOOGLE_ANDROID_CLIENT_ID = os.getenv('GOOGLE_ANDROID_CLIENT_ID')

pose_service = PoseService()
video_service = VideoPoseService()
# Create your views here.

def home(request):
    context = {
        'drills': Drill.objects.all()
    }
    return render (request, 'futbolfrenzy/home.html', context)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'groups': list(user.groups.values_list('name', flat=True))
    })

#returns extended user data with the setting, including data such as profile picture and such
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def detailed_user_info(request):
    user = request.user
    # Get or create settings for the user
    extended_settings, created = Settings.objects.get_or_create(
        userID=user,
        defaults={
            'mode': 'NONE',
            'notificationType': 'NONE',
            'profileBackgroundColor': '#FFFFFF',
            'isDarkMode': False,
            'position': 'US',
        }
    )
    return Response({
        'id': user.id,
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'role': list(user.groups.values_list('name', flat=True)),
        'position': extended_settings.position,
        'profilePicture': extended_settings.profilePicture,
        'profileBackgroundColor' : extended_settings.profileBackgroundColor,
        'isDarkMode': extended_settings.isDarkMode,
    })
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')

    if not current_password or not new_password:
        return Response({'error': 'Both current_password and new_password are required.'}, status=400)

    if not user.check_password(current_password):
        return Response({'error': 'Current password is incorrect.'}, status=400)

    if len(new_password) < 8:
        return Response({'error': 'New password must be at least 8 characters.'}, status=400)

    import re
    if not re.search(r'[A-Z]', new_password):
        return Response({'error': 'Password must contain at least one uppercase letter.'}, status=400)
    if not re.search(r'[a-z]', new_password):
        return Response({'error': 'Password must contain at least one lowercase letter.'}, status=400)
    if not re.search(r'[0-9]', new_password):
        return Response({'error': 'Password must contain at least one number.'}, status=400)
    if not re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>/?`~]', new_password):
        return Response({'error': 'Password must contain at least one special character.'}, status=400)

    user.set_password(new_password)
    user.save()

    # Re-create the auth token so the user stays logged in
    Token.objects.filter(user=user).delete()
    new_token = Token.objects.create(user=user)

    return Response({'message': 'Password changed successfully.', 'token': new_token.key})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def coach_submissions(request):
    from django.utils import timezone
    coach = request.user

    # Get all classes this coach owns
    coach_classes = SoccerClass.objects.filter(coachID=coach)

    # Get all assignment IDs across those classes
    assignment_ids = set()
    class_by_assignment = {}  # assignment_id -> class_name
    for sc in coach_classes:
        for assignment in sc.assignments.all():
            assignment_ids.add(assignment.id)
            class_by_assignment[assignment.id] = sc.className

    # Filter by today if ?today=true
    submissions = Submission.objects.filter(
        assignmentID__in=assignment_ids
    ).select_related('studentID', 'assignmentID', 'assignmentID__workoutID').order_by('-dateSubmitted')

    today_only = request.query_params.get('today', '').lower() == 'true'
    if today_only:
        now = timezone.now()
        submissions = submissions.filter(
            dateSubmitted__date=now.date()
        )

    limit = request.query_params.get('limit')
    if limit:
        submissions = submissions[:int(limit)]

    results = []
    for sub in submissions:
        workout = sub.assignmentID.workoutID
        results.append({
            'id': sub.id,
            'studentName': f"{sub.studentID.first_name} {sub.studentID.last_name}",
            'studentID': sub.studentID.id,
            'drillName': workout.workoutName if workout else '',
            'className': class_by_assignment.get(sub.assignmentID.id, ''),
            'dateSubmitted': sub.dateSubmitted.isoformat(),
            'grade': sub.grade,
        })

    return Response(results)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_stats(request):
    from django.utils import timezone
    from datetime import timedelta
    student = request.user
    today = timezone.now().date()

    # Get all classes this student is in
    student_classes = SoccerClass.objects.filter(members__studentID=student)

    # Due Today: assignments due today across all student's classes
    due_today = Assignment.objects.filter(
        soccer_classes__in=student_classes,
        dueDate__date=today,
    ).distinct().count()

    # This Week: submissions the student made this week (Mon-Sun)
    start_of_week = today - timedelta(days=today.weekday())
    this_week = Submission.objects.filter(
        studentID=student,
        dateSubmitted__date__gte=start_of_week,
        dateSubmitted__date__lte=today,
    ).count()

    # Days Streak: consecutive days with at least one submission
    streak = 0
    check_date = today
    while True:
        has_submission = Submission.objects.filter(
            studentID=student,
            dateSubmitted__date=check_date,
        ).exists()
        if has_submission:
            streak += 1
            check_date -= timedelta(days=1)
        else:
            break

    return Response({
        'daysStreak': streak,
        'thisWeek': this_week,
        'dueToday': due_today,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_schedule(request):
    from django.utils import timezone
    student = request.user
    date_str = request.query_params.get('date')

    if date_str:
        from datetime import datetime
        target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    else:
        target_date = timezone.now().date()

    # Get classes the student is in
    student_classes = SoccerClass.objects.filter(members__studentID=student)

    # Get assignments due on target date
    assignments = Assignment.objects.filter(
        soccer_classes__in=student_classes,
        dueDate__date=target_date,
    ).select_related('workoutID').distinct()

    # Check which assignments the student has already submitted
    submitted_assignment_ids = set(
        Submission.objects.filter(
            studentID=student,
            assignmentID__in=assignments,
        ).values_list('assignmentID', flat=True)
    )

    results = []
    for assignment in assignments:
        workout = assignment.workoutID
        # Find which class this assignment belongs to for this student
        class_name = ''
        for sc in student_classes:
            if sc.assignments.filter(id=assignment.id).exists():
                class_name = sc.className
                break

        results.append({
            'id': assignment.id,
            'workoutId': workout.id,
            'name': workout.workoutName,
            'type': workout.workoutType,
            'dueDate': assignment.dueDate.isoformat() if assignment.dueDate else None,
            'className': class_name,
            'submitted': assignment.id in submitted_assignment_ids,
            'imageBackgroundColor': assignment.imageBackgroundColor or workout.imageBackgroundColor,
            'imageText': assignment.imageText or workout.imageText,
            'imageTextColor': assignment.imageTextColor or workout.imageTextColor,
        })

    return Response(results)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_results(request):
    student = request.user

    # Get graded submissions for this student
    submissions = Submission.objects.filter(
        studentID=student,
        grade__isnull=False,
    ).select_related('assignmentID', 'assignmentID__workoutID').order_by('-dateGraded')[:10]

    results = []
    for sub in submissions:
        workout = sub.assignmentID.workoutID
        results.append({
            'id': sub.id,
            'name': workout.workoutName,
            'type': workout.workoutType,
            'score': sub.grade,
            'date': sub.dateGraded.strftime('%b %d') if sub.dateGraded else sub.dateSubmitted.strftime('%b %d'),
            'imageBackgroundColor': sub.imageBackgroundColor or '#1C1C1C',
            'imageTextColor': sub.imageTextColor or '#FFFFFF',
        })

    return Response(results)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def coach_stats(request):
    coach = request.user

    # Get all classes this coach owns
    coach_classes = SoccerClass.objects.filter(coachID=coach)

    # To Review: ungraded submissions across coach's assignments
    assignment_ids = set()
    for sc in coach_classes:
        for assignment in sc.assignments.all():
            assignment_ids.add(assignment.id)

    to_review = Submission.objects.filter(
        assignmentID__in=assignment_ids,
        grade__isnull=True,
    ).count()

    # Students: unique students across all coach's classes
    total_students = ClassMember.objects.filter(
        classID__in=coach_classes
    ).values('studentID').distinct().count()

    # Completion: average today's completion across classes
    from django.utils import timezone
    today = timezone.now().date()
    completion_values = []
    for sc in coach_classes:
        todays_assignments = sc.assignments.filter(dueDate__date=today)
        num_students = ClassMember.objects.filter(classID=sc).count()
        if num_students == 0 or todays_assignments.count() == 0:
            continue
        assignment_ids_today = list(todays_assignments.values_list('id', flat=True))
        total_expected = num_students * len(assignment_ids_today)
        class_student_ids = ClassMember.objects.filter(classID=sc).values_list('studentID', flat=True)
        submissions_count = Submission.objects.filter(
            assignmentID__in=assignment_ids_today,
            studentID__in=class_student_ids,
        ).count()
        completion_values.append(round((submissions_count / total_expected) * 100))

    avg_completion = round(sum(completion_values) / len(completion_values)) if completion_values else 0

    return Response({
        'toReview': to_review,
        'totalStudents': total_students,
        'completion': avg_completion,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def coach_class_progress(request):
    from django.utils import timezone
    coach = request.user
    today = timezone.now().date()

    coach_classes = SoccerClass.objects.filter(coachID=coach)
    results = []

    for sc in coach_classes:
        # Get assignments due today for this class
        todays_assignments = sc.assignments.filter(dueDate__date=today)

        # Total students in the class
        total_students = ClassMember.objects.filter(classID=sc).count()

        if total_students == 0 or todays_assignments.count() == 0:
            results.append({
                'id': sc.id,
                'name': sc.className,
                'completion': 0,
                'assignmentsToday': todays_assignments.count(),
                'studentsCompleted': 0,
                'totalStudents': total_students,
            })
            continue

        # Count how many unique students have submitted for ALL of today's assignments
        assignment_ids = list(todays_assignments.values_list('id', flat=True))
        total_expected = total_students * len(assignment_ids)

        # Count total submissions from class members for today's assignments
        class_student_ids = ClassMember.objects.filter(classID=sc).values_list('studentID', flat=True)
        submissions_count = Submission.objects.filter(
            assignmentID__in=assignment_ids,
            studentID__in=class_student_ids,
        ).count()

        completion = round((submissions_count / total_expected) * 100) if total_expected > 0 else 0

        results.append({
            'id': sc.id,
            'name': sc.className,
            'completion': completion,
            'assignmentsToday': len(assignment_ids),
            'studentsCompleted': submissions_count,
            'totalStudents': total_students,
        })

    return Response(results)

@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    token = request.data.get('idToken')

    try:
        user_info = None
        for client_id in [GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID, GOOGLE_ANDROID_CLIENT_ID]:
            try:
                user_info = id_token.verify_oauth2_token(token, google_requests.Request(), client_id)
                break
            except ValueError:
                continue
        if user_info is None:
            raise ValueError("Token verification failed for all client IDs")

        email = user_info['email']
        first_name = user_info.get('given_name', '')
        last_name = user_info.get('family_name', '')

        user, created = User.objects.get_or_create(username=email)

        user.email = email
        user.first_name = first_name
        user.last_name = last_name
        user.save()

        auth_token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'token': auth_token.key,
            'groups': list(user.groups.values_list('name', flat=True))
        })

    except ValueError:
        return Response({'error': 'Invalid Google token'}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_role(request):
    group_name = request.data.get('group')
    if group_name not in ('Coach', 'Student'):
        return Response({'error': 'Invalid role. Must be Coach or Student.'}, status=400)

    group, _ = Group.objects.get_or_create(name=group_name)
    request.user.groups.clear()
    request.user.groups.add(group)

    return Response({'groups': [group_name]})

# view to generate a presigned URL for direct S3 uploads
# s3_client initialized w AWS credentials (keys in .env)
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name='us-east-1'
)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_presigned_url(request):
    # generates a presigned URL so frontend can directly upload to S3
    file_name = request.data.get('file_name')
    file_type = request.data.get('file_type')
    if not file_name or not file_type:
        return Response({"error": "Missing file_name or file_type"}, status=400)

    # Generate a unique key using user id and timestamp to prevent collisions
    unique_key = f"user_{request.user.id}/{uuid.uuid4().hex}_{file_name}"

    try:
        # call .generate_presigned_post on client instance to get presigned URL
        presigned_url = s3_client.generate_presigned_post(
            Bucket='direct-object-upload-seniorproj-s3',
            Key=unique_key,
            Fields={"Content-Type": file_type},
            Conditions=[
                {"Content-Type": file_type}
            ],
            ExpiresIn=600 #10 minutes expiration URL
        )
        return Response({
            "uploadUrl": presigned_url['url'],
            "fields": presigned_url['fields'],
            "fileKey": unique_key,
            "videoUrl": f"https://direct-object-upload-seniorproj-s3.s3.amazonaws.com/{unique_key}"
        })
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_class_by_assignment(request, assignment_id):
    try:
        assignment = Assignment.objects.get(id=assignment_id)
        soccer_class = SoccerClass.objects.filter(assignments=assignment).first()
        if not soccer_class:
            return Response({'error': 'No class found for this assignment'}, status=404)
        return Response(SoccerClassSerializer(soccer_class).data)
    except Assignment.DoesNotExist:
        return Response({'error': 'Assignment not found'}, status=404)

@api_view(['POST'])
@permission_classes([AllowAny])
def analyze_pose(request):
    image = request.FILES.get("image")

    if not image:
        return Response({"error": "No image provided"}, status=400)

    result = pose_service.process_image(image)

    return Response(result)

@api_view(['POST'])
@permission_classes([AllowAny])
def analyze_video_pose(request):
    video = request.FILES.get("video")
    if not video:
        return Response({"error": "No video provided"}, status=400)

    result = video_service.process_video(video)
    return Response(result)

@api_view(['GET'])
def get_assignments_for_class(request, class_id):
    try:
        soccer_class = SoccerClass.objects.get(id=class_id)
    except SoccerClass.DoesNotExist:
        return Response({'error': 'Class not found'}, status=status.HTTP_404_NOT_FOUND)

    assignments_qs = soccer_class.assignments.all()
    serializer = AssignmentSerializer(assignments_qs, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_class_submission_workout_analytics(request, class_id):
    try:
        soccer_class = SoccerClass.objects.get(id=class_id)
    except SoccerClass.DoesNotExist:
        return Response({'error': 'Class not found'}, status=status.HTTP_404_NOT_FOUND)

    # parse params
    start = request.query_params.get('start_date')
    end = request.query_params.get('end_date')
    student_ids_param = request.query_params.get('student_ids')  # e.g. "1,2,3"

    # build filters
    submissions_qs = Submission.objects.filter(assignmentID__in=soccer_class.assignments.all())

    if student_ids_param:
        try:
            student_ids = [int(s) for s in student_ids_param.split(',') if s.strip()]
            submissions_qs = submissions_qs.filter(studentID__id__in=student_ids)
        except ValueError:
            return Response({'error': 'student_ids must be comma separated integers'}, status=status.HTTP_400_BAD_REQUEST)

    if start:
        dt_start = parse_datetime(start) or parse_date(start)
        if not dt_start:
            return Response({'error': 'Invalid start_date'}, status=status.HTTP_400_BAD_REQUEST)
        submissions_qs = submissions_qs.filter(dateSubmitted__gte=dt_start)

    if end:
        dt_end = parse_datetime(end) or parse_date(end)
        if not dt_end:
            return Response({'error': 'Invalid end_date'}, status=status.HTTP_400_BAD_REQUEST)
        submissions_qs = submissions_qs.filter(dateSubmitted__lte=dt_end)

    submissions_qs = submissions_qs.order_by('dateSubmitted')  # ascending;

    serializer = SubmissionSerializer(submissions_qs, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)
@api_view(['POST'])
def grade_submission(request, submission_id):
    try:
        data = json.loads(request.body)
        grade = data.get("grade")
        grades = data.get("grades", {})

        submission = Submission.objects.get(id=submission_id)
        submission.grade = grade
        submission.dateGraded = timezone.now()
        submission.save()

        submitted_drills = SubmittedDrill.objects.filter(
            submissionID=submission_id
        ).order_by("id")

        for index, drill in enumerate(submitted_drills):
            if str(index) in grades:
                drill.grade = grades[str(index)]
                drill.save()

        return Response({"success": True}, status=200)

    except Submission.DoesNotExist:
        return Response({"error": "Submission not found"}, status=404)
    
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
@api_view(['POST'])
def create_submission(request):
    if request.method != "POST":
        return Response({"error": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body)
        assignment_id = data.get("assignmentID")
        student_id = data.get("studentID")

        # Return existing submission if one already exists
        existing = Submission.objects.filter(
            assignmentID=assignment_id,
            studentID=student_id
        ).first()

        if existing:
            serializer = SubmissionSerializer(existing)
            return Response(serializer.data, status=status.HTTP_200_OK)

        submission = Submission.objects.create(
            assignmentID_id=assignment_id,
            studentID_id=student_id,
            imageBackgroundColor="#FFFFFF",
            imageText="",
            imageTextColor="#000000",
        )
        
        serializer = SubmissionSerializer(submission)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=500)
