from django.shortcuts import render
from .models import Drill, Enrollment
from .serializers import DrillSerializer, EnrollmentSerializer
from django.http import HttpResponse

# Create your views here.


def home(request):
    context = {
        'drills': Drill.objects.all()
    }
    return render (request, 'futbolfrenzy/home.html', context)


