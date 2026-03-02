from rest_framework import serializers
from futbolfrenzy.models import Drill, Enrollment

#class serializers to help django convert JSON data to python objects

class DrillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drill
        fields = ['id', 'drillName', 'drillType', 'coachID', 'imageBackgroundColor', 'imageEmoji']
        read_only_fields = ['id']

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['id', 'studentID', 'coachID', 'drillID', 'time', 'completed']
        read_only_fields = ['id']
