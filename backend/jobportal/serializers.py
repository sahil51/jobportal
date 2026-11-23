from rest_framework import serializers
from .models import Job
import json

class JobSerializer(serializers.ModelSerializer):
    status = serializers.JSONField(required=False)
    category = serializers.JSONField(required=False)
    
    class Meta:
        model = Job
        fields = '__all__'
    
    def to_internal_value(self, data):
        clean_data = data.copy()
        
        if 'status' in clean_data:
            val = clean_data['status']
            if isinstance(val,str):
                try:
                    clean_data['status'] = json.loads(val)
                    
                except Exception:
                    clean_data['status'] = [val] if val else []
                    
        if 'category' in clean_data:
            val = clean_data['category']
            if isinstance(val,str):
                try:
                    clean_data['category'] = json.loads(val)
                
                except Exception:
                    clean_data['category'] = [val] if val else [] 
        
        if 'start_date' in clean_data and clean_data['start_date'] in ('', 'null'):
            clean_data['start_date'] = None
            
        if 'end_date' in clean_data and clean_data['end_date'] in ('', 'null'):
            clean_data['end_date'] = None
        
        if 'profile_picture' in clean_data and isinstance(clean_data['profile_picture'],str):
            clean_data.pop('profile_picture')
        
        return super().to_internal_value(clean_data)
                         
    def validate(self,data):
        start_date =  data.get('start_date')
        end_date =  data.get('end_date')
        if self.instance:
            if start_date is None and 'start_date' not in data:
                start_date = self.instance.start_date 
              
            if end_date is None and 'end_date' not in data:
                end_date = self.instance.end_date 
        
        if start_date and end_date:
            if end_date < start_date:
                raise serializers.ValidationError({'end_date':'end date connot be before start date'})
        return data