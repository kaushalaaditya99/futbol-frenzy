from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Drill(models.Model):
    # id
    drillName = models.CharField(max_length = 255) 
    drillType = models.CharField(max_length = 255)
    coachID = models.ForeignKey(User, on_delete=models.CASCADE)
    url = models.URLField(max_length=200)
    time = models.IntegerField()
    difficultyLevel = models.CharField(max_length = 255)
    instructions = models.TextField()
    imageBackgroundColor = models.CharField(max_length = 7)
    imageText = models.CharField(max_length = 255)
    imageTextColor = models.CharField(max_length = 255)
    publicDrill = models.BooleanField(default = False)

    def __str__(self):
        return self.drillName