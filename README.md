# OtakuShelf

Tracker personal de anime y manga: biblioteca, progreso por episodio/capítulo, historial, notas y estadísticas. Full-stack con Next.js, PostgreSQL y Prisma.

> **Estado: en desarrollo.** El núcleo (autenticación, biblioteca, progreso, notas, estadísticas) ya funciona. Hay funcionalidades planificadas que todavía no están; ver [Estado del proyecto](#estado-del-proyecto).

## Screenshots

<!-- Agregá capturas en docs/screenshots/ y descomentá:
![Dashboard](docs/screenshots/dashboard.png)
![Biblioteca](docs/screenshots/library.png)
![Detalle](docs/screenshots/title.png)
![Estadísticas](docs/screenshots/stats.png)
-->

*Próximamente.*

## Funcionalidades

**Disponibles**

- Autenticación con email y contraseña (NextAuth, sesión JWT, contraseñas con bcrypt).
- Dashboard con resumen personal.
- Biblioteca con filtros, búsqueda, ordenamiento y paginación.
- Página de detalle por título: datos externos junto a datos personales (estado, puntuación, favorito).
- Registro de progreso: `+1`, valor manual y auto-completado al alcanzar el total.
- Historial de progreso por título.
- Notas personales por título.
- Página de estadísticas con gráficos (Recharts).
- Seed con usuario demo, títulos de ejemplo e historial.

**Implementado pero aún sin conectar a la interfaz**

- Motor de recomendaciones basado en reglas, con tests (`src/services/recommendation.service.ts`).
- Cliente de la API Jikan con mapeo a nuestro modelo (`src/lib/jikan.ts`).

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS |
| Backend | API Routes de Next.js, Zod para validación |
| Base de datos | PostgreSQL 16 + Prisma 5 |
| Autenticación | NextAuth (credentials, JWT) + bcryptjs |
| Estado remoto | TanStack Query |
| Gráficos | Recharts |
| Datos externos | [Jikan](https://jikan.moe/) (API no oficial de MyAnimeList, sin API key) |
| Tests | Vitest |

## Arquitectura

Aplicación full-stack en un solo proyecto Next.js, con la lógica de negocio separada de las rutas:

```
Componentes / páginas  →  hooks (TanStack Query)  →  API routes  →  services  →  Prisma  →  PostgreSQL
```

- **Rutas API**: validan la entrada con Zod, comprueban la sesión y delegan en un servicio. Responden con códigos HTTP coherentes (400, 401, 404, 500).
- **Servicios** (`src/services/`): contienen la lógica de negocio. Las partes críticas (`computeProgressUpdate`, recomendaciones) son funciones puras, sin dependencia de Prisma ni de Next, por lo que se testean sin mocks.
- **Hooks** (`src/hooks/`): encapsulan las llamadas al servidor y la caché con TanStack Query.

### Modelo de datos

Los datos externos y los personales están separados:

- `Title`: información cacheada de Jikan, compartida entre usuarios (portada, sinopsis, géneros, totales).
- `UserLibraryEntry`: lo específico de cada usuario (estado, progreso, puntuación, favorito, fechas).
- `ProgressHistory`: registro de cada cambio de progreso.
- `Note`: notas del usuario sobre una entrada.
- `User`: credenciales y perfil.

### Estructura del proyecto

```
otakushelf/
├── prisma/            # schema.prisma, migraciones y seed
├── src/
│   ├── app/           # páginas: (auth) para login, (app) para la app, api/ para endpoints
│   ├── components/    # ui/, layout/, dashboard/, library/, title/
│   ├── hooks/         # hooks de TanStack Query
│   ├── lib/           # prisma, auth, cliente de Jikan
│   ├── schemas/       # esquemas Zod
│   ├── services/      # lógica de negocio
│   └── types/
├── tests/             # tests con Vitest
└── docker-compose.yml # PostgreSQL local
```

## Instalación

Requisitos: Node.js 18.17 o superior, Docker (o una instancia de PostgreSQL propia).

```bash
git clone https://github.com/<tu-usuario>/otakushelf.git
cd otakushelf

docker compose up -d        # levanta PostgreSQL
cp .env.example .env        # y completá NEXTAUTH_SECRET
npm install
npm run db:migrate          # crea las tablas
npm run db:seed             # carga datos de ejemplo
npm run dev
```

La app queda en http://localhost:3000.

**Usuario demo:** `demo@otakushelf.dev` / `demo1234`

### Variables de entorno

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL |
| `NEXTAUTH_SECRET` | Secreto para firmar los JWT (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | URL base de la aplicación |

### Scripts

| Comando | Acción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` / `npm start` | Build y ejecución en producción |
| `npm test` | Tests con Vitest |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Migraciones de Prisma |
| `npm run db:seed` | Datos de ejemplo |
| `npm run db:studio` | Prisma Studio |

## Decisiones técnicas

- **Next.js full-stack en lugar de frontend y backend separados.** Comparte tipos entre cliente y servidor y simplifica el despliegue. La separación de capas se mantiene con `services/`.
- **Sesión JWT.** El provider de credenciales de NextAuth solo admite sesiones JWT, y además es una estrategia que ya conocía de otros proyectos.
- **Datos externos cacheados aparte de los personales.** Evita duplicar sinopsis y portadas por usuario y evita volver a consultar la API externa.
- **Historial append-only.** `ProgressHistory` nunca se sobrescribe, así la actividad se obtiene con una consulta ordenada por fecha.
- **Lógica crítica en funciones puras.** Facilita los tests y la lectura del código.
- **Recomendaciones basadas en reglas.** Son explicables (se puede mostrar por qué se recomienda un título) y no requieren datos de entrenamiento.

## Estado del proyecto

- [x] Modelo de datos, migraciones y seed
- [x] Autenticación (login)
- [x] Biblioteca con filtros y paginación
- [x] Detalle de título, progreso, historial y notas
- [x] Estadísticas
- [ ] Búsqueda de títulos en Jikan y alta en la biblioteca
- [ ] Registro de usuarios y protección de rutas con middleware
- [ ] Mostrar recomendaciones en el dashboard ("¿Qué veo ahora?")
- [ ] Mood Picker
- [ ] Página de historial con filtros por tipo y fecha
- [ ] Página de favoritos
- [ ] Perfil de usuario
- [ ] Tests de endpoints, validaciones y componentes
- [ ] Prettier y CI

## Posibles mejoras futuras

- Recomendaciones más sofisticadas (por ejemplo, similitud de sinopsis).
- Avisos de nuevos episodios a partir del calendario de emisión.
- Listas compartidas entre usuarios.
- Importar y exportar la biblioteca (formato XML de MyAnimeList).