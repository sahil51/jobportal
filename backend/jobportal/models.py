from django.db import models

# Create your models here.

STATUS_CHOICES = [('Draft','draft'),
                  ('Requested','requested'),
                  ('Posetd','posted'),
                  ('Filled','Filled')]

CATEGOERY_CHOICES = [
    ('Full-time','Full-time'),
    ('Part-time','Part-time'),
    ('Intern','Intern'),
    ('Contract','Contract'),
    ('Remote','Remote')
]
class Job(models.Model):
    title = models.CharField(max_length=255,help_text='Frontend Engineer or Backedend Engineer')
    profile_picture = models.ImageField(upload_to="job_pictures/", null=True, blank=True, help_text='upload image')
    status = models.JSONField(default=list,blank=True,help_text="['Draft','Published]",choices=STATUS_CHOICES)
    category = models.JSONField(default=list,blank=True,help_text="['Full_Time','remote]",choices=CATEGOERY_CHOICES)
    address = models.CharField(max_length=150,blank=True,default="")
    city = models.CharField(max_length=100,blank=True,default='')
    state = models.CharField(max_length=100,blank=True,default='')
    start_date = models.DateField(null=True,blank=True)
    end_date = models.DateField(null=True,blank=True)
    description = models.TextField(blank=True,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f'{self.title} ({self.city},{self.state})'