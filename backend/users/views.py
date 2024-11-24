from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import make_password

from .models import UserRole,AuthUserExt


# Custom Token Serializer
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        # Validate required fields
        if not username or not email or not password:
            return Response(
                {"detail": "All fields are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check for existing username and email
        if User.objects.filter(username=username).exists():
            return Response(
                {"detail": "Username already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {"detail": "Email already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create the User instance
        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()  # Save the user instance

        # print(user.id)  # Debugging print to check user ID

        # Retrieve the UserRole instance
        try:
            user_role = UserRole.objects.get(id=3)  # Ensure the role with ID 3 exists
        except UserRole.DoesNotExist:
            return Response(
                {"detail": "UserRole with ID 3 does not exist."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Check if AuthUserExt already exists for the user
        if AuthUserExt.objects.filter(user_id=user).exists():
            return Response(
                {"detail": "AuthUserExt record already exists for this user."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create the AuthUserExt instance
        user_ext = AuthUserExt()
        user_ext.user_id = user  # Assign the User instance
        user_ext.user_role_id = user_role  # Assign the UserRole instance
        user_ext.save()  # Save the AuthUserExt instance
        return Response({"detail": "User registered successfully."}, status=status.HTTP_201_CREATED)

# Logout
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful!"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]  # Only authenticated users can access this view

    def get(self, request):
        user = request.user  # Get the currently authenticated user

        # Fetch related data from AuthUserExt and UserRole
        try:
            auth_user_ext = AuthUserExt.objects.get(user_id=user.id)  # Fetch the AuthUserExt record
            # print(auth_user_ext.user_role_id)
            role_name = auth_user_ext.user_role_id.name if auth_user_ext.user_role_id else "No Role"
            role_id = auth_user_ext.user_role_id.id if auth_user_ext.user_role_id else None  # Get the role ID
        except AuthUserExt.DoesNotExist:
            auth_user_ext = None
            role_name = "No Role"
            role_id = None  # If no AuthUserExt is found, set role_id to None

        # Compile all relevant user data into a dictionary
        user_data = {
            "id": user.id,  # User ID (Primary Key)
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "full_name": f"{user.first_name} {user.last_name}",  # Full name
            "email": user.email,
            "role_name": role_name,  # User role as a string (name of the role)
            "role_id": role_id,  # User role ID (ID of the UserRole)
            "is_staff": user.is_staff,  # If the user is a staff member
            "is_active": user.is_active,  # If the account is active
            "date_joined": user.date_joined,  # When the user joined
            "last_login": user.last_login,  # Last login time
        }

        # Add any additional data from AuthUserExt, if available
        if auth_user_ext:
            user_data.update({
                "auth_user_ext_id": auth_user_ext.id,  # ID of the AuthUserExt record
            })

        return Response(
            {
                "message": "User info fetched successfully",
                "user": user_data
            },
            status=status.HTTP_200_OK
        )
