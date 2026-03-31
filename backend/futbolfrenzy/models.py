from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

# Notifications for users
class Notification(models.Model):
    # id
    userID = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length = 255) 
    description = models.CharField(max_length = 255) 
    url = models.URLField(max_length=200, blank=True, null=True)
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    icon = models.CharField(max_length=50)
    iconBackground = models.CharField(max_length=7, default="#FFFFFF")

# Settings for each user
class Settings(models.Model):
    # id
    userID = models.ForeignKey(User, on_delete=models.CASCADE)
    mode = models.CharField(max_length = 255) 
    notificationType = models.CharField(max_length = 255, default='NONE') 
    profilePicture = models.CharField(max_length = 255, null=True, blank=True) 
    profileBackgroundColor = models.CharField(max_length = 255, default='#FFFFFF') 

    class Position(models.TextChoices):
        GOALKEEPER = 'GK', 'Goalkeeper'
        DEFENDER = 'DF', 'Defender'
        MIDFIELDER = 'MF', 'Midfielder'
        FORWARD = 'FW', 'Forward'
        COACH = 'CO', 'Coach'
        UNSELECTED = 'US', 'Unselected'

    position = models.CharField(
        max_length=2,
        choices=Position.choices,
        default=Position.UNSELECTED,
    )


# A drill is self explanatory
class Drill(models.Model):
    # id
    drillName = models.CharField(max_length = 255) 
    drillType = models.CharField(max_length = 255)
    coachID = models.ForeignKey(User, on_delete=models.CASCADE)
    url = models.URLField(max_length=200)
    difficultyLevel = models.CharField(max_length = 255)
    instructions = models.TextField()
    imageBackgroundColor = models.CharField(max_length = 7)
    imageText = models.CharField(max_length = 255)
    imageTextColor = models.CharField(max_length = 255)
    publicDrill = models.BooleanField(default = False)

    def __str__(self):
        return self.drillName
    
class DrillBookmark(models.Model):
    # id
    drillID = models.ForeignKey(Drill, on_delete=models.CASCADE)
    userID = models.ForeignKey(User, on_delete=models.CASCADE)
    
# A workout is a list of drills that can be assigned
class Workout(models.Model):
    workoutName = models.CharField(max_length = 255) 
    workoutType = models.CharField(max_length = 255)
    coachID = models.ForeignKey(User, on_delete=models.CASCADE)
    dueDate = models.DateTimeField(null=True, blank=True)
    imageBackgroundColor = models.CharField(max_length = 7)
    imageText = models.CharField(max_length = 255)
    imageTextColor = models.CharField(max_length = 255)
    drills = models.ManyToManyField(Drill, related_name="workouts")
    publicWorkout = models.BooleanField(default = False)

    def __str__(self):
        return self.workoutName
    
class WorkoutBookmark(models.Model):
    # id
    workoutID = models.ForeignKey(Workout, on_delete=models.CASCADE)
    userID = models.ForeignKey(User, on_delete=models.CASCADE)

# An assignment contains a workout that is due at some time
class Assignment(models.Model):
    # id
    workoutID = models.ForeignKey(Workout, on_delete=models.CASCADE)
    dueDate = models.DateTimeField(null=True, blank=True)
    imageBackgroundColor = models.CharField(max_length = 7)
    imageText = models.CharField(max_length = 255)
    imageTextColor = models.CharField(max_length = 255)

# A submission is created when a student submits to an assignment
class Submission(models.Model):
    # id
    studentID = models.ForeignKey(User, on_delete=models.CASCADE)
    assignmentID = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    grade = models.IntegerField(null=True, blank=True)
    dateGraded = models.DateTimeField(null=True, blank=True)
    dateSubmitted = models.DateTimeField(default=timezone.now)
    imageBackgroundColor = models.CharField(max_length = 7)
    imageText = models.CharField(max_length = 255)
    imageTextColor = models.CharField(max_length = 255)

# Also created when a student submits, one for each drill in the assignment
class SubmittedDrill(models.Model):
    # id
    submissionID = models.ForeignKey(Submission, on_delete=models.CASCADE)
    drillID = models.ForeignKey(Drill, on_delete=models.CASCADE)
    videoURL = models.URLField(max_length=200)
    grade = models.IntegerField(null=True, blank=True)
    touchCount = models.IntegerField(null=True, blank=True)

# A soccer class that coaches host and students can be apart of
class SoccerClass(models.Model):
    # id
    className = models.CharField(max_length = 255) 
    coachID = models.ForeignKey(User, on_delete=models.CASCADE)
    assignments = models.ManyToManyField(Assignment, related_name="soccer_classes")

# Relationship table between students and classes
class ClassMember(models.Model):
    # id
    studentID = models.ForeignKey(User, on_delete=models.CASCADE)
    classID = models.ForeignKey(SoccerClass, on_delete=models.CASCADE, related_name="members")
