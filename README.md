# 🗺️ Roadmap y Plan de Requerimientos: Plataforma de Actividades Locales

## 📌 1. Visión General del Proyecto
Desarrollar una aplicación web colaborativa ("mini red social") que permita a los usuarios descubrir, registrar y recomendar actividades locales como eventos, restaurantes y deportes[cite: 4, 22, 23].

**Stack Tecnológico:**
* **Frontend:** React + TypeScript (Consumo vía Axios/Fetch)[cite: 25, 26, 40].
* **Backend:** FastAPI (Python) con arquitectura REST[cite: 27, 37].
* **Base de Datos:** MongoDB con Beanie ODM (Persistencia NoSQL)[cite: 28, 38, 57].

---

## 🚀 2. Roadmap de Desarrollo

### Fase 1: Infraestructura y Modelado (Cimientos)
* Configuración de la instancia de **MongoDB Atlas** o Local[cite: 38].
* Definición de modelos de datos con **Beanie** (Documentos para `Activity`, `User` y `Rating`)[cite: 14, 15].
* Configuración inicial de **FastAPI** y Middlewares (CORS para React)[cite: 10, 11].

### Fase 2: Desarrollo del Core API (Backend)
* Implementación de los 5+ Endpoints REST requeridos[cite: 37, 42]:
    * `GET /activities`: Listado completo[cite: 43].
    * `GET /activities/{id}`: Detalle específico[cite: 44].
    * `POST /activities`: Creación de actividad[cite: 44].
    * `PUT /activities/{id}`: Actualización[cite: 45].
    * `DELETE /activities/{id}`: Eliminación[cite: 45].
    * `POST /ratings`: Registro de calificaciones[cite: 45].

### Fase 3: Interfaz de Usuario (Frontend)
* Creación de componentes base en **TypeScript**[cite: 46]:
    * `Navbar`, `ListaActividades`, `DetalleActividad`[cite: 47, 48, 49].
    * `FormularioActividad` y `FormularioRating`[cite: 50, 51].
* Integración de estados globales y consumo de API con **Axios**[cite: 26, 40].

### Fase 4: Pulido y Entrega
* Implementación de filtros por categoría y visualización de "Top Rated"[cite: 31, 35].
* Documentación del proceso de **Reingeniería** (Migración conceptual de SQL a NoSQL)[cite: 64].

---

## 📝 3. Historias de Usuario (Backlog)

| ID | Historia de Usuario | Criterios de Aceptación |
| :--- | :--- | :--- |
| **HU-01** | **Registro de Actividad** | Como usuario, quiero registrar una actividad (nombre, descripción, ubicación, fecha, categoría) para que otros la vean[cite: 30]. |
| **HU-02** | **Exploración de Actividades** | Como usuario, quiero ver una lista de todas las actividades para saber qué hacer en mi ciudad[cite: 30]. |
| **HU-03** | **Búsqueda por Categoría** | Como usuario, quiero filtrar actividades por categoría para encontrar algo específico rápidamente[cite: 31]. |
| **HU-04** | **Detalle Técnico** | Como usuario, quiero ver la información detallada de una actividad al seleccionarla[cite: 32]. |
| **HU-05** | **Sistema de Feedback** | Como usuario, quiero calificar (rating) una actividad para compartir mi experiencia[cite: 33]. |
| **HU-06** | **Gestión de Usuario** | Como nuevo usuario, quiero registrarme en la plataforma para participar activamente[cite: 34, 52]. |

---

## ✅ 4. Criterios de Evaluación (Checklist)
* [ ] Los endpoints funcionan correctamente y devuelven JSON[cite: 54, 28].
* [ ] Los datos se guardan y persisten en MongoDB[cite: 57, 63].
* [ ] La interfaz en React muestra datos dinámicos del backend[cite: 41, 55].
* [ ] Se incluyen operaciones CRUD completas[cite: 39].
* [ ] El código está documentado y explicado[cite: 59, 61].

## 🗄️ Backend (FastAPI + MongoDB/Beanie)
Clean Architecture, separando el núcleo del negocio de los detalles de infraestructura.

```
/backend
├── app
│   ├── domain/              # CAPA DE DOMINIO (Entidades y Reglas de Negocio)
│   │   ├── entities/        # Clases puras de Python (Activity, User, Rating) sin dependencias externas.
│   │   ├── value_objects/   # Objetos inmutables como Email, Password o Coordenadas de Ubicación.
│   │   └── repositories/    # Interfaces (clases abstractas) que definen cómo se accede a los datos.
│   ├── application/         # CAPA DE APLICACIÓN (Casos de Uso)
│   │   ├── services/        # Orquestación de la lógica: RegistrarActividad, CalificarActividad
│   │   ├── dtos/            # Data Transfer Objects para la entrada y salida de esta capa.
│   │   └── mappers/         # Lógica para transformar Entidades a DTOs y viceversa.
│   ├── infrastructure/      # CAPA DE INFRAESTRUCTURA (Detalles Técnicos)
│   │   ├── persistence/     # Implementación de Beanie ODM y modelos de MongoDB
│   │   ├── auth/            # Implementación de seguridad: JWT, OAuth2 y Hashing.
│   │   └── config/          # Gestión de variables de entorno y conexión a la base de datos.
│   ├── adapters/            # CAPA DE ADAPTADORES (Interfaces Externas)
│   │   ├── controllers/     # Endpoints de FastAPI que reciben los Requests y envían Responses.
│   │   ├── schemas/         # Validaciones de Pydantic para la API (Request/Response models).
│   │   └── presenters/      # Lógica opcional para dar formato final a la respuesta JSON.
│   └── main.py              # Punto de entrada y configuración del servidor FastAPI.
├── tests/                   # Pruebas unitarias (Domain/Application) e integración (Adapters).
├── requirements.txt         # Dependencias del proyecto.
└── .env                     # Configuración sensible.
```

## 💻 Frontend (React + TypeScript)

Estructura modular adaptada para consumir los endpoints REST definidos.

```
/frontend
├── src/
│   ├── domain/              # Modelos e interfaces de TypeScript que reflejan las entidades del negocio[cite: 46].
│   ├── application/         # Lógica de estado y hooks personalizados para casos de uso (useActivities, useAuth).
│   ├── infrastructure/      # Adaptadores de red (Axios/Fetch) y servicios de API[cite: 26].
│   ├── adapters/            # Componentes que conectan la UI con la lógica de aplicación.
│   │   ├── controllers/     # Contextos (Context API) o manejadores de estado global.
│   │   └── presenters/      # Componentes de presentación (UI) organizados por features[cite: 46].
│   ├── ui/                  # Componentes puramente visuales, estilos (Tailwind) y Layouts[cite: 47, 58].
│   │   ├── pages/           # Vistas de página: Home, Detalle, Registro[cite: 48, 49, 52].
│   │   └── shared/          # Componentes reutilizables (Botones, Modales).
│   ├── App.tsx              # Enrutamiento y configuración de proveedores.
│   └── main.tsx             # Renderizado inicial.
├── package.json
└── tsconfig.json
```