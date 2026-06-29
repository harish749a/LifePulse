from sqlalchemy.orm import Session

from app.models.token_blacklist import TokenBlacklist


class TokenRepository:

    @staticmethod
    def blacklist(db: Session, token: str):
        obj = TokenBlacklist(token=token)
        db.add(obj)
        db.commit()

    @staticmethod
    def is_blacklisted(db: Session, token: str):
        return (
            db.query(TokenBlacklist)
            .filter(TokenBlacklist.token == token)
            .first()
        )