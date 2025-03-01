from django.contrib import admin
from .models import Website

@admin.register(Website)
class WebsiteAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "site_type", "unique_id", "created_at")
    search_fields = ("name", "owner__username", "unique_id")
    readonly_fields = ("unique_id", "created_at")
