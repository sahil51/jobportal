from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Job
from .serializers import JobSerializer
import json


@api_view(['GET','POST'])
def job_list_create(request):
    if request.method == 'GET':
        jobs = Job.objects.all()
        search = request.GET.get('search')
        if search:
            jobs = jobs.filter(title__icontains=search)

        status_val = request.GET.get('status')
        if status_val:
            jobs = jobs.filter(status__contains=[status_val])

        serializer = JobSerializer(jobs, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        data = request.data.copy()
        mutable = {}
        for key in data:
            mutable[key] = data[key]
        if request.FILES.get('profile_picture'):
            mutable['profile_picture'] = request.FILES['profile_picture']

        if 'status' in mutable and isinstance(mutable['status'], str):
            try:
                mutable['status'] = json.loads(mutable['status'])
            except (json.JSONDecodeError, TypeError):
                pass

        if 'category' in mutable and isinstance(mutable['category'], str):
            try:
                mutable['category'] = json.loads(mutable['category'])
            except (json.JSONDecodeError, TypeError):
                pass

        serializer = JobSerializer(data=mutable, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET','PUT','DELETE'])
def job_details_update_delete(request, pk):
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response({'error': 'job does not exist'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = JobSerializer(job, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'PUT':
        data = request.data.copy()
        mutable = {}
        for key in data:
            mutable[key] = data[key]
        if request.FILES.get('profile_picture'):
            mutable['profile_picture'] = request.FILES['profile_picture']

        if 'status' in mutable and isinstance(mutable['status'], str):
            try:
                mutable['status'] = json.loads(mutable['status'])
            except (json.JSONDecodeError, TypeError):
                pass
        if 'category' in mutable and isinstance(mutable['category'], str):
            try:
                mutable['category'] = json.loads(mutable['category'])
            except (json.JSONDecodeError, TypeError):
                pass

        serializer = JobSerializer(job, data=mutable, partial=True, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        job.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET'])
def analytics_view(request):
    jobs = Job.objects.all()
    total_jobs = jobs.count()
    status_counts = {}
    for j in jobs:
        if isinstance(j.status, list):
            for s in j.status:
                status_counts[s] = status_counts.get(s,0)+1
        elif j.status:
            status_counts[str(j.status)] = status_counts.get(str(j.status),0)+1

    status_distribution = []
    for s_name, count in status_counts.items():
        if total_jobs>0:
            pct= round((count/total_jobs)*100,1)
        else:
            pct = 0
        
        status_distribution.append({'name':s_name,'count':count,'percentage':pct})
        
    city_counts = {}
        
    for j in jobs:
        if j.city:
            city_counts[j.city] = city_counts.get(j.city,0) + 1
            
    city_breakdown = []
    
    for city_name, count in city_counts.items():
        city_breakdown.append({"name" : city_name, "count" : count})
        
    state_counts = {}
    
    for j in  jobs:
        if j.state:
            state_counts[j.state] = state_counts.get(j.state, 0) + 1
            
    state_breakdown = []
    
    for state_name, count in state_counts.items():
        state_breakdown.append({"name" : state_name, "count" : count})
        
    return Response({
        "total_jobs" : total_jobs,
        "status_distribution" : status_distribution,
        "city_breakdown" : city_breakdown,
        "state_breakdown" : state_breakdown
    },status=status.HTTP_200_OK)
    

@api_view(["POST"])

def job_duplicate(request,pk):
    
    try:
        original = Job.objects.get(pk=pk)
        
        duplicate = Job.objects.create(
            title = original.title + " (copy)",
            profile_picture=original.profile_picture,
            status=original.status,
            category=original.category,
            address=original.address,
            city=original.city,
            state=original.state,
            start_date=original.start_date,
            end_date=original.end_date,
            description=original.description
        )
        
        serializer = JobSerializer(duplicate, context={'request': request})
        
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    
    except Job.DoesNotExist:
        return Response({"error": "job is not found"}, status=status.HTTP_404_NOT_FOUND)
