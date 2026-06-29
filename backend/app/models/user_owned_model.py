from sqlalchemy import Column, ForeignKey, Integer


class UserOwnedModel:

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )