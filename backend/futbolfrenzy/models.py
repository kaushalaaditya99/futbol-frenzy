from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Drill(models.Model):
    # id
    drillName = models.CharField(max_length = 255) # listed as varchar
    coachID = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.drillName

