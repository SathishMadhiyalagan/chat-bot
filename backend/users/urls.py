from django.urls import path
from .views import RegisterView, CustomTokenObtainPairView, LogoutView,UserInfoView,AllUsersView,update_user_role,upload_file,get_uploaded_files
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('info/', UserInfoView.as_view(), name='user_info'),
    path('allusers/', AllUsersView.as_view(), name='all_users'),
    path('<int:user_id>/role/', update_user_role, name='update_user_role'),
    path('upload/', upload_file, name='upload_file'),
    path('uploaded-files/', get_uploaded_files, name='get_uploaded_files'),
]
