from django.urls import path
from .views import RegisterView, CustomTokenObtainPairView, LogoutView,UserInfoView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('info/', UserInfoView.as_view(), name='user_info'),
]