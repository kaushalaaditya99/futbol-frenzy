from django.db import models

# Create your models here.
class Account(models.Model):
    #id = models.FloatField(primary_key = True) #listed as bigint
    #id is already a basic django class attribute
    typeId = models.FloatField() #listed as bigint
    username = models.CharField(max_length=255)#listed as varchar
    hashpassword = models.CharField(max_length=255)#listed as varchar