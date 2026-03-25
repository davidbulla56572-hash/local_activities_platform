# SUMMARY

## 1) Vista general del proyecto

Este repositorio implementa una plataforma full-stack para actividades locales con:

- **Backend:** API REST en **FastAPI** + persistencia en **MongoDB** usando **Beanie**.
- **Frontend:** SPA en **React + TypeScript** con estilos en **Tailwind CSS**.

El dominio funcional principal es:

- Usuarios
- Actividades
- Calificaciones (ratings)

## 2) Conexión entre frontend y backend

La conexión HTTP del frontend está centralizada en:

- `local_activities_platform_frontend/src/infrastructure/http/apiClient.ts`

Detalles observables en código:

- Cliente con **Axios**.
- URL base tomada de `VITE_API_URL` o fallback a `http://localhost:4141/api`.
- Interceptor de errores que prioriza `response.data.message` y luego primer valor del body.

En backend, CORS se configura desde variables de entorno:

- `api_local_activities/app/config.py` (`CORS_ORIGINS`)
- Middleware en `api_local_activities/app/main.py`

## 3) Backend: estructura y conceptos

Estructura simple por responsabilidad:

- `app/main.py`: creación de app, middleware CORS, handlers globales, registro de rutas.
- `app/config.py`: configuración de entorno con `pydantic-settings`.
- `app/db.py`: ciclo de vida (`lifespan`), conexión a Mongo y `init_beanie`.
- `app/models.py`: documentos de Beanie (`UserDocument`, `ActivityDocument`, `RatingDocument`).
- `app/schemas.py`: DTOs de entrada/salida con alias camelCase.
- `app/helpers.py`: utilidades compartidas (ObjectId, mapeo de validación, mensajes 404, armado de actividad con rating promedio).
- `app/seed.py`: carga inicial opcional.
- `app/routes/*.py`: endpoints REST por recurso.

Conceptos de implementación:

- **REST** con separación por recurso (`/api/users`, `/api/activities`, `/api/ratings`).
- **Validación de payload** con Pydantic.
- **Manejo global de errores**:
  - `RequestValidationError` -> `400` con mapa `campo -> error`.
  - `HTTPException` normalizada a `{ "message": ... }` cuando aplica.
- **Persistencia NoSQL** con índices en colecciones (`activities`, `ratings`, y email único normalizado en `users`).
- **Seed condicional** por `SEED_DATA` y entorno (`env != test`).

## 4) Frontend: estructura y conceptos

Estructura principal:

- `src/App.tsx`: router principal de vistas.
- `src/controllers/AppController.tsx`: provider/context del estado de aplicación.
- `src/application/hooks/useLocalActivities.ts`: lógica de negocio de UI (cargas, acciones CRUD, navegación, status global).
- `src/infrastructure/http` y `src/infrastructure/services`: capa de acceso HTTP.
- `src/components`: componentes de UI (listado, detalle, formularios).
- `src/ui/pages`: páginas (`HomePage`, `ActivityDetailPage`, `RegistrationPage`).
- `src/ui/shared`: layout, navbar, banner de estado.
- `src/domain/models.ts`: tipos TypeScript del dominio.

Conceptos de implementación:

- **Composición por componentes** y props.
- **Estado local + contexto** (sin Redux ni Zustand en uso activo del flujo principal).
- **Navegación manual** con `window.history.pushState` y `popstate` (router interno simple basado en pathname).
- **Flujos principales**:
  - Home: listado, filtro por categoría, top-rated, creación.
  - Detail: detalle de actividad, rating, edición/eliminación.
  - Register: registro de usuarios y listado de usuarios.

## 5) Herramientas y empaquetado

Backend (`api_local_activities`):

- **Gestión Python:** `pyproject.toml` (estilo PEP 621).
- **Runner/entorno:** `uv` (ver `Taskfile.yml`).
- **Servidor:** `uvicorn`.

Frontend (`local_activities_platform_frontend`):

- **Gestión JS:** `npm`.
- **Bundler/dev server:** **Vite**.
- **Compilación TS:** `tsc -b` + `vite build`.
- **Estilos utility-first:** **Tailwind CSS v4** con plugin `@tailwindcss/vite`.

## 6) Variables de entorno relevantes

Backend (`api_local_activities/.env` y `.env.example`):

- `DATABASE_URL` o `MONGODB_URI`
- `MONGODB_DB` (opcional, si no, se infiere de la URI)
- `CORS_ORIGINS` (lista separada por comas)
- `APP_NAME`, `APP_PORT`, `ENV`, `SEED_DATA`

## 7) Paradigmas y estilo de diseño observados

- **API-first**: frontend consume contratos REST claros.
- **Tipado fuerte en frontend** (TypeScript) y validación fuerte en backend (Pydantic).
- **Separación por capas práctica** (no estrictamente hexagonal): config/db/modelos/schemas/rutas en backend y domain/application/infrastructure/ui en frontend.
- **Enfoque pragmático**: simplicidad en flujo de datos y legibilidad priorizada sobre abstracción excesiva.

## 8) Observaciones técnicas útiles

- El frontend usa fallback `http://localhost:4141/api`, mientras `config.py` del backend define `app_port=8080`; además `Taskfile.yml` levanta backend en `4141`. El comportamiento efectivo depende de cómo se inicie el backend.
- Existe dependencia instalada de `react-router-dom`, pero la navegación actual está implementada de forma manual en `useLocalActivities.ts`.
