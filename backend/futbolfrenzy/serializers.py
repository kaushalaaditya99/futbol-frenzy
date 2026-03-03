from rest_framework import serializers
from futbolfrenzy.models import Drill

#class serializers to help django convert JSON data to python objects

class DrillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drill
        fields = ['id', 'drillName', 'coachID']
        read_only_fields = ['id']