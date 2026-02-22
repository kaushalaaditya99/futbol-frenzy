from django.contrib import admin
from .models import Drill
from .models import Enrollment

# Register your models here.
admin.site.register(Drill)
admin.site.register(Enrollment)