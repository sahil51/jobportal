from django.contrib import admin
from .models import Job
# Register your models here.



@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('id','title','state','created_at')
    
    search_fields = ('id','title','state','created_at','description')
    list_filter = ('city','state')
    
    ordering = ('-created_at',)