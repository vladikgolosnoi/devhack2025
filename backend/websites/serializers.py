from rest_framework import serializers
from .models import Website

class WebsiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Website
        fields = ("id", "name", "site_type", "unique_id", "data", "created_at", "views", "show_in_profile")
        read_only_fields = ("id", "unique_id", "created_at")
