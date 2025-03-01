from django.urls import path
from .views import (
    WebsiteListCreateView,
    WebsiteRetrieveUpdateDestroyView,
    WebsiteSharedRetrieveView,
    WebsiteViewTrackingView,
    UserPublishedWebsitesView,
    WebsitePublishToggleView,
)

urlpatterns = [
    path('', WebsiteListCreateView.as_view(), name='website-list-create'),

    path('profile/<int:profile_id>/', UserPublishedWebsitesView.as_view(), name='user-published-websites'),
    path('publish/<str:unique_id>/', WebsitePublishToggleView.as_view(), name='website-publish-toggle'),

    path('<str:username>/<str:unique_id>/', WebsiteRetrieveUpdateDestroyView.as_view(), name='website-detail'),
    path('<str:username>/<str:unique_id>/', WebsiteSharedRetrieveView.as_view(), name='website-shared-detail'),

    path('<str:username>/<str:unique_id>/view/', WebsiteViewTrackingView.as_view(), name='website-view-tracking'),

]
