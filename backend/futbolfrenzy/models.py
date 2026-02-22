from django.db import models

# Create your models here.
class Account(models.Model):
    id = models.FloatField() #listed as bigint
    typeId = models.FloatField() #listed as bigint
    username = models.CharField(max_length=255)#listed as varchar
    hashpassword = models.CharField(max_length=255)#listed as varchar