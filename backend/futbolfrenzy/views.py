from django.shortcuts import render
from .models import Drill
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import json
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User, Group
import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_WEB_CLIENT_ID = os.getenv('GOOGLE_WEB_CLIENT_ID')
GOOGLE_IOS_CLIENT_ID = os.getenv('GOOGLE_IOS_CLIENT_ID')
GOOGLE_ANDROID_CLIENT_ID = os.getenv('GOOGLE_ANDROID_CLIENT_ID')

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

