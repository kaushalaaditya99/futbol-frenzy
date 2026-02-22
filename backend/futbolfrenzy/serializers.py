from rest_framework import serializers
from futbolfrenzy.models import Account

#class serializers to help django convert JSON data to python objects

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'typeId', 'username', 'hashpassword']
        read_only_fields = ['id', 'typeId']