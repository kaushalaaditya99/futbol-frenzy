from django.contrib import admin
from .models import Notification, Settings, Drill, Workout, Assignment, Submission, SubmittedDrill, SoccerClass, ClassMember

# Register your models here.
admin.site.register(Notification)
admin.site.register(Settings)
admin.site.register(Drill)
admin.site.register(Workout)
admin.site.register(Assignment)
admin.site.register(Submission)
admin.site.register(SubmittedDrill)
admin.site.register(SoccerClass)
admin.site.register(ClassMember)

