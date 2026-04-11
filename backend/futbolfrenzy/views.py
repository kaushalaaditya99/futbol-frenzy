from django.shortcuts import render
from .models import Drill, Settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import User, Drill, Workout, Assignment, Submission, SubmittedDrill, SoccerClass
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

GOOGLE_WEB_CLIENT_ID = os.getenv('GOOGLE_WEB_CLIENT_ID')
GOOGLE_IOS_CLIENT_ID = os.getenv('GOOGLE_IOS_CLIENT_ID')
GOOGLE_ANDROID_CLIENT_ID = os.getenv('GOOGLE_ANDROID_CLIENT_ID')


load_dotenv()
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
        'groups': list(user.groups.values_list('name', flat=True))
    })

#returns extended user data with the setting, including data such as profile picture and such
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def detailed_user_info(request):
    user = request.user
    extended_settings, _ = Settings.objects.get_or_create(userID=user)
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
