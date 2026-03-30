from django.shortcuts import render
from .models import Drill
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import User, Drill, Workout, Assignment, Submission, SubmittedDrill, SoccerClass
import os
import boto3
from rest_framework.decorators import api_view
from rest_framework.response import Response
import uuid
from dotenv import load_dotenv

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
