from fastapi_mail import ConnectionConfig, FastMail, MessageSchema

from app.core.config import settings


conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=True
)


async def send_reset_email(email: str, link: str):

    message = MessageSchema(
        subject="LifePulse Password Reset",
        recipients=[email],
        body=f"""
Click below to reset your password

{link}
""",
        subtype="plain"
    )

    fm = FastMail(conf)

    await fm.send_message(message)