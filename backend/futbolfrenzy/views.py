from django.shortcuts import render
from .models import Drill, Enrollment
from .serializers import DrillSerializer, EnrollmentSerializer
from django.http import HttpResponse

# /home/
def home(request):
    return HttpResponse('<h1>Home</h1>')

# /test/
def test(request):
    return HttpResponse('<h1>Test</h1>')

