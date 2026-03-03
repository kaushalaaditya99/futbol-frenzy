from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from . models import Drill, Workout
from futbolfrenzy.serializers import DrillSerializer, WorkoutSerializer
# viewsets for databases

class DrillViewSet(viewsets.ModelViewSet):
    queryset = Drill.objects.all()
    serializer_class = DrillSerializer
    permission_classes = [AllowAny]

class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
    permission_classes = [AllowAny]