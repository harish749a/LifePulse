from itsdangerous import URLSafeTimedSerializer

from app.core.config import settings

serializer = URLSafeTimedSerializer(
    settings.SECRET_KEY
)


def generate_reset_token(email: str):

    return serializer.dumps(
        email,
        salt="password-reset"
    )


def verify_reset_token(token: str):

    return serializer.loads(
        token,
        salt="password-reset",
        max_age=1800
    )