# Local Activities API

Backend REST construido con FastAPI y MongoDB/Beanie para gestionar usuarios, actividades y ratings.

## Objetivo

Permitir registro de usuarios, CRUD de actividades, filtro por categoria, ranking top-rated y persistencia real en MongoDB.

## Endpoints

- `GET /api/activities`
- `GET /api/activities/{id}`
- `GET /api/activities/top-rated`
- `POST /api/activities`
- `PUT /api/activities/{id}`
- `DELETE /api/activities/{id}`
- `GET /api/users`
- `POST /api/users`
- `POST /api/ratings`

## Setup

1. Copia `.env.example` a `.env`.
2. Ajusta `MONGODB_URI` y `MONGODB_DB` segun tu entorno.
3. Instala dependencias con `uv sync` o `pip install -r requirements.txt`.

## Ejecucion

1. Inicia MongoDB local.
2. Desde `api_local_activities`, ejecuta `uv run uvicorn app.main:app --host 0.0.0.0 --port 4141 --reload`.
3. Abre `http://localhost:4141/dev-docs`.

## Evidencia de persistencia

La API usa colecciones `users`, `activities` y `ratings`, con documentos Beanie respaldados por MongoDB real. Los IDs internos son ObjectId y se exponen como string en responses JSON.

## Reingenieria SQL -> NoSQL

- Las relaciones fuertes del modelo relacional fueron reemplazadas por referencias ligeras usando ObjectId.
- El promedio y conteo de ratings se calculan por agregacion en la capa de aplicacion.
- Se conservan contratos JSON camelCase para no romper el frontend.
- Se normaliza `email` en lowercase y se aplica unicidad en persistencia.
