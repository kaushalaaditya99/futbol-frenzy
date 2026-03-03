from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from . models import Drill
from django.http import HttpResponse
from django.template import loader
from futbolfrenzy.serializers import DrillSerializer
# viewsets for databases
class DrillViewSet(viewsets.ModelViewSet):
    queryset = Drill.objects.all()
    serializer_class = DrillSerializer
    permission_classes = [AllowAny]