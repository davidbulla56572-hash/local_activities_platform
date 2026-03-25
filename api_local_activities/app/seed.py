from __future__ import annotations

from datetime import date, datetime, timedelta, timezone

from app.models import ActivityDocument, RatingDocument, UserDocument


async def seed_if_empty() -> None:
    if await UserDocument.count() > 0:
        return
    if await ActivityDocument.count() > 0:
        return
    if await RatingDocument.count() > 0:
        return

    users = await UserDocument.insert_many(
        [
            UserDocument(
                name="Laura Perez",
                email="laura@example.com",
                email_normalized="laura@example.com",
                password="secret123",
            ),
            UserDocument(
                name="Mateo Rojas",
                email="mateo@example.com",
                email_normalized="mateo@example.com",
                password="secret123",
            ),
            UserDocument(
                name="Sara Gomez",
                email="sara@example.com",
                email_normalized="sara@example.com",
                password="secret123",
            ),
        ]
    )

    today = date.today()
    activities = await ActivityDocument.insert_many(
        [
            ActivityDocument(
                name="Ruta de Cafes del Centro",
                description="Recorrido guiado por cafeterias del centro historico.",
                location="Centro Historico",
                event_date=today + timedelta(days=4),
                category="Gastronomia",
                creator_id=users[0].id,
            ),
            ActivityDocument(
                name="Caminata al Mirador Verde",
                description="Salida grupal de baja dificultad por senderos locales.",
                location="Reserva Bosque Alto",
                event_date=today + timedelta(days=8),
                category="Naturaleza",
                creator_id=users[1].id,
            ),
            ActivityDocument(
                name="Noche de Museos Locales",
                description="Circuito cultural con entradas reducidas.",
                location="Distrito Cultural",
                event_date=today + timedelta(days=12),
                category="Cultura",
                creator_id=users[2].id,
            ),
        ]
    )

    now = datetime.now(timezone.utc)
    await RatingDocument.insert_many(
        [
            RatingDocument(
                activity_id=activities[0].id,
                user_id=users[1].id,
                score=5,
                comment="Muy buena seleccion de lugares.",
                created_at=now,
            ),
            RatingDocument(
                activity_id=activities[0].id,
                user_id=users[2].id,
                score=4,
                comment="Buen ritmo y cafe excelente.",
                created_at=now,
            ),
            RatingDocument(
                activity_id=activities[1].id,
                user_id=users[0].id,
                score=5,
                comment="Paisajes hermosos y guia atento.",
                created_at=now,
            ),
            RatingDocument(
                activity_id=activities[2].id,
                user_id=users[0].id,
                score=4,
                comment="Actividad bien organizada.",
                created_at=now,
            ),
            RatingDocument(
                activity_id=activities[2].id,
                user_id=users[1].id,
                score=5,
                comment="Excelente experiencia cultural.",
                created_at=now,
            ),
        ]
    )
