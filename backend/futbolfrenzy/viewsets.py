from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from . models import Drill, Enrollment
from django.http import HttpResponse
from django.template import loader

from futbolfrenzy.serializers import DrillSerializer, EnrollmentSerializer

"""
class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [AllowAny]
"""

# futbolfrenzy/
def home(request):
    return HttpResponse('<h1>Home</h1>')

# futbolfrenzy/test/
def test(request):
    return HttpResponse('<h1>Test</h1>')

"""
def drills(request):
    drill = Drill.objects.all()
    template = loader.get_template('drills.html')
    context = {'drill': drill,}
    return HttpResponse(template.render(context, request))
    """

# viewsets for databases
class DrillViewSet(viewsets.ModelViewSet):
    queryset = Drill.objects.all()
    serializer_class = DrillSerializer
    permission_classes = [AllowAny]

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [AllowAny]
