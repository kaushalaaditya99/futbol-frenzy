from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

"""
# Create your models here.
class AccountType(models.Model):
    # id
    typeName = models.CharField(max_length = 255) # listed as varchar
    """

"""
class Account(models.Model):
    #id = models.FloatField(primary_key = True) # listed as bigint
    #id is already a basic django class attribute
    username = models.CharField(max_length=255) # listed as varchar
    hashpassword = models.CharField(max_length=255) # listed as varchar
"""

class Drill(models.Model):
    # id
    drillName = models.CharField(max_length = 255) # listed as varchar
    drillType = models.CharField(max_length = 255, default="N/A")
    coachID = models.ForeignKey(User, on_delete=models.CASCADE)
    imageBackgroundColor = models.CharField(max_length = 255, default="#1C1C1C")
    imageEmoji = models.CharField(max_length = 255, default="🏃‍♂️")

    #coachID = models.CharField(max_length = 255)

    def __str__(self):
        return self.drillName

class Enrollment(models.Model):
    # id
    studentID = models.ForeignKey(User, on_delete=models.CASCADE, related_name="student_drills") # listed as bigint
    coachID = models.ForeignKey(User, on_delete=models.CASCADE, related_name="coach_drills") # listed as bigint
    drillID = models.ForeignKey(Drill, on_delete=models.CASCADE) # listed as bigint

    time = models.IntegerField(default=0)

    #assignedDate = models.DateTimeField(default=timezone.now) # listed as date time
    #dueDate = models.DateTimeField() # listed as date time
    completed = models.BooleanField() # listed as boolean

    def __str__(self):
        return self.drillID.drillName