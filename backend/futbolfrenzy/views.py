from django.shortcuts import render
from .models import Drill, Settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def detailed_user_info(request):
    user = request.user
    extended_settings = Settings.objects.get(pk=user.id)
    return Response
    ({
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
