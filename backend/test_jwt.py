from app.utils.jwt_handler import create_access_token

token = create_access_token(
    {
        "sub": "admin@lifepulse.com"
    }
)

print(token)