from rest_framework import serializers
from futbolfrenzy.models import Drill, Enrollment

#class serializers to help django convert JSON data to python objects

"""
class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'typeId', 'username', 'hashpassword']
        read_only_fields = ['id', 'typeId']
        """

class DrillSerializer(serializers.modelSerializer):
    class Meta:
        model = Drill
        fields = ['id', 'drillName', 'coachID']
        read_only_fields = ['id']

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['id', 'studentID', 'coachID', 'drillID', 'assignedDate', 'dueDate', 'completed']
        read_only_fields = ['id']
