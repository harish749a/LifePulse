from app.db.database import Base, engine

# Import all models
from app.models.user import User

print("Creating database tables...")

Base.metadata.create_all(bind=engine)

print("Database tables created successfully!")