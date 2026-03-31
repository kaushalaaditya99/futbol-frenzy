from django.contrib import admin
from .models import Notification, Settings, Drill, DrillBookmark, Workout, WorkoutBookmark, WorkoutDrill, Assignment, Submission, SubmittedDrill, SoccerClass, ClassMember

class WorkoutDrillInline(admin.TabularInline):
    model = WorkoutDrill
    extra = 1

class WorkoutAdmin(admin.ModelAdmin):
    inlines = [WorkoutDrillInline]

# Register your models here.
admin.site.register(Notification)
admin.site.register(Settings)
admin.site.register(Drill)
admin.site.register(DrillBookmark)
admin.site.register(Workout, WorkoutAdmin)
admin.site.register(WorkoutBookmark)
admin.site.register(WorkoutDrill)
admin.site.register(Assignment)
admin.site.register(Submission)
admin.site.register(SubmittedDrill)
admin.site.register(SoccerClass)
admin.site.register(ClassMember)

