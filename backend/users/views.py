from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view

from rest_framework.parsers import MultiPartParser, FormParser

from .models import UserRole,AuthUserExt,File


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
    



class AllUsersView(APIView):
    permission_classes = [IsAuthenticated]  # Restrict access to authenticated users

    def get(self, request):
        # Fetch all users and their associated roles
        users = User.objects.all()
        user_data = []

        for user in users:
            # try:
            #     user_role = AuthUserExt.objects.get(user_id=user).user_role_id.name
            # except AuthUserExt.DoesNotExist:
            #     user_role = "No Role"
            try:
                auth_user_ext = AuthUserExt.objects.get(user_id=user) # Fetch the AuthUserExt record
                # print(auth_user_ext.user_role_id)
                role_name = auth_user_ext.user_role_id.name if auth_user_ext.user_role_id else "No Role"
                role_id = auth_user_ext.user_role_id.id if auth_user_ext.user_role_id else None  # Get the role ID
            except AuthUserExt.DoesNotExist:
                auth_user_ext = None
                role_name = "No Role"
                role_id = None  # If no AuthUserExt is found, set role_id to None

            user_data.append({
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
            })

        return Response(
            {
                "message": "All users fetched successfully",
                "users": user_data,
            },
            status=status.HTTP_200_OK
        )
    

@api_view(['PUT'])
def update_user_role(request, user_id):
    """
    Update the role of a user by their ID.
    If the user doesn't have an AuthUserExt entry, create one.
    """
    try:
        new_role_id = request.data.get('role_id')
        if not new_role_id:
            return Response({"error": "Role ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the new role from the UserRole model
        try:
            new_role = UserRole.objects.get(id=new_role_id)
        except UserRole.DoesNotExist:
            return Response({"error": "Role not found."}, status=status.HTTP_404_NOT_FOUND)

        # Try to fetch the user's AuthUserExt record
        try:
            auth_user_ext = AuthUserExt.objects.get(user_id=user_id)
        except AuthUserExt.DoesNotExist:
            # If AuthUserExt doesn't exist, create a new one
            try:
                user = User.objects.get(id=user_id)  # Check if the user exists
                auth_user_ext = AuthUserExt.objects.create(user_id=user, user_role_id=new_role)
            except User.DoesNotExist:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
         # Check if the current role is Admin (role_id = 1) and do not change it
        if auth_user_ext.user_role_id.id == 1:
            return Response({"message": "User already has the Admin role. Role cannot be changed."}, status=status.HTTP_400_BAD_REQUEST)

        # Update the role
        auth_user_ext.user_role_id = new_role
        auth_user_ext.save()

        return Response({"message": "Role updated successfully!"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


@api_view(['POST'])
def upload_file(request):
    """
    Upload an image file to the server.
    """
    if request.method == 'POST':
        file = request.FILES.get('file')  # Access the uploaded file
        file_caption = request.data.get('file_caption')  # Optionally, get the file caption
        print(file_caption)
        if not file:
            return Response({"error": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Assuming the user is already authenticated
        user = request.user
        
        # Create a new file record
        new_file = File.objects.create(
            file=file,
            file_caption=file_caption,
            user_id=user,
            raged=False  # Set raged to False by default
        )
        
        return Response({"message": "File uploaded successfully!"}, status=status.HTTP_201_CREATED)
    
@api_view(['GET'])
def get_uploaded_files(request):
    """
    Fetch a list of uploaded files for the authenticated user.
    """
    try:
        # Ensure the user is authenticated
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Filter files by the current user
        files = File.objects.filter(user_id=request.user)
        
        # Build the response data
        file_data = []
        for file in files:
            file_data.append({
                'id': file.id,
                'file_name': file.file.url if file.file else None,  # Use .url for file path
                'file_caption': file.file_caption,
                'uploaded_by': file.user_id.username,  # Ensure User model has 'username'
                'uploaded_at': file.id,  # Replace with actual `created_at` if available
                'rag':bool(file.raged)
            })
        
        return Response(file_data, status=status.HTTP_200_OK)
    except Exception as e:
        # Log and return a generic error
        print(f"Error in get_uploaded_files: {str(e)}")
        return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
