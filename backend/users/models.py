from django.db import models
from django.contrib.auth.models import User  # Default User model

# UserRole model to define different roles
class UserRole(models.Model):
    name = models.CharField(max_length=50, unique=True)  # Name of the role (e.g., Admin, Editor, Viewer)

    def __str__(self):
        return self.name


# Extending the User model with the AuthUserExt model
class AuthUserExt(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)  # Linking to the User model
    user_role_id = models.ForeignKey(UserRole, on_delete=models.SET_NULL, null=True, blank=True)  # Linking to UserRole model
    # You can add any additional fields specific to the user extension here
    # For example, you could store more details about the user if needed

    def __str__(self):
        return f"{self.user_id.username} - {self.user_role_id.name if self.user_role_id else 'No Role'}"
