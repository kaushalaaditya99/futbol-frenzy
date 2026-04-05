from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . import views
from . import viewsets
from .views import me, detailed_user_info, analyze_pose, analyze_video_pose

api_router = DefaultRouter()
api_router.register(r'user', viewsets.UserViewSet)
api_router.register(r'notifications', viewsets.NotificationViewSet)
api_router.register(r'settings', viewsets.SettingsViewSet)
api_router.register(r'drills', viewsets.DrillViewSet)
api_router.register(r'drillBookmarks', viewsets.DrillBookmarkViewSet)
api_router.register(r'workouts', viewsets.WorkoutViewSet)
api_router.register(r'workoutBookmarks', viewsets.WorkoutBookmarkViewSet)
api_router.register(r'workoutDrills', viewsets.WorkoutDrillViewSet)
api_router.register(r'assignments', viewsets.AssignmentViewSet)
api_router.register(r'submissions', viewsets.SubmissionViewSet)
api_router.register(r'submitteddrills', viewsets.SubmittedDrillViewSet)
api_router.register(r'classes', viewsets.SoccerClassViewSet)
api_router.register(r'classmembers', viewsets.ClassMemberViewSet)

urlpatterns = [
    path('home/', views.home, name='futbolfrenzy-home'),
    path('api/users/me/', me, name='me'),
    path('api/users/detailed-user-info/', detailed_user_info, name='detailed-user-info'),
    # For this path, we're passing in a Router that
    # is registered with the DrillViewSet and EnrollmentViewSet.
    # The Router will define the paths that ultimately
    # allow us to access /api/drills and /api/enrollments.
    path('api/', include(api_router.urls)),
    path('api/google-auth/', views.google_auth),
    path('api/set-role/', views.set_role),
    path('', views.home, name='test-home'),
    path('get_presigned_url/', views.get_presigned_url, name='get_presigned_url'),
    path('analyze-pose/', analyze_pose),
    path('analyze-video-pose/', analyze_video_pose),
]
