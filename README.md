# VentasLite Web

Frontend de VentasLite construido con React 18, Vite 8 y Tailwind CSS 4.

## Requisitos

- Node.js 20.19+ (Node 24 recomendado para este entorno).
- npm.

## Instalación local

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Crear el archivo de variables locales:

   ```bash
   cp .env.example .env
   ```

3. Iniciar Vite:

   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev`: servidor local.
- `npm run build`: compilación de producción.
- `npm run preview`: vista previa de la compilación.
- `npm run lint`: análisis estático con Oxlint.

## Estructura principal

```text
src/
├── components/
│   ├── common/
│   └── layout/
├── data/
├── pages/
├── routes/
├── services/
└── utils/
```

## Configuración

- `VITE_APP_NAME`: nombre de la aplicación.
- `VITE_API_URL`: URL base de la API Laravel.

No almacenar secretos ni API keys en variables `VITE_*`; se exponen al navegador.

## Autenticación

El login consume los endpoints de autenticación del backend:

- `POST /login`: inicia sesión y recibe un token Sanctum.
- `GET /me`: recupera al usuario cuando existe un token guardado.
- `POST /logout`: invalida el token actual.

Las rutas Dashboard, Ventas y Reportes requieren una sesión válida. El token se envía mediante el encabezado `Authorization: Bearer`.

## Estado actual

El frontend contiene la pantalla de login, protección de rutas, layout administrativo y dashboard demostrativo. Los módulos Ventas y Reportes conservan únicamente su estructura visual.

Los datos del dashboard son ficticios y no representan operaciones reales.
