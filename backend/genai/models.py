from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User  # Assuming you're using Django's built-in User model

class UserMessage(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages')
    user_question = models.TextField()  # To store the user's query/question
    bot_reply = models.TextField()  # To store the bot's reply
    timestamp = models.DateTimeField(auto_now_add=True)  # To track when the message was created

    def __str__(self):
        return f"Message by {self.user.username} at {self.timestamp}"
