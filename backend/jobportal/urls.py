from django.urls import path
from . import views
urlpatterns = [
    path('jobs/',views.job_list_create,name='job-list-create'),
    path('jobs/<int:pk>/',views.job_details_update_delete,name='job-detail-updated-delete'),
    path('jobs/<int:pk>/duplicate/',views.job_duplicate,name='job-duplicate'),
    path('analytics/',views.analytics_view,name='job-analytics'),
]
