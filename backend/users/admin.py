from django.contrib import admin
from .models import UserRole, AuthUserExt

# Register UserRole model
admin.site.register(UserRole)

admin.site.register(AuthUserExt)
