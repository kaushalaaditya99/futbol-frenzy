from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . import views
from . import viewsets

api_router = DefaultRouter()
api_router.register(r'drills', viewsets.DrillViewSet)
api_router.register(r'workouts', viewsets.WorkoutViewSet)

urlpatterns = [
    path('home/', views.home, name='futbolfrenzy-home'),
    # For this path, we're passing in a Router that
    # is registered with the DrillViewSet and EnrollmentViewSet.
    # The Router will define the paths that ultimately
    # allow us to access /api/drills and /api/enrollments.
    path('api/', include(api_router.urls)),
]