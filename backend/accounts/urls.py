from django.urls import path
from .views import (
    RegisterView,
    ProfileUpdateView,
    ProfileDetailView,
    UserListView,
    UsersDetailView,
    RatingUpdateView,
    RatingStatusView,
    TopProfilesView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/update/', ProfileUpdateView.as_view(), name='profile-update'),
    path('profile/', ProfileDetailView.as_view(), name='profile-detail'),

    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:user_id>/', UsersDetailView.as_view(), name='user-detail'),

    path('profile/<int:user_id>/rating/', RatingUpdateView.as_view(), name='profile-rating-update'),
    path('profile/<int:user_id>/rating/status/', RatingStatusView.as_view(), name='profile-rating-status'),

    path('top_profiles/', TopProfilesView.as_view(), name='top-profiles'),
]
