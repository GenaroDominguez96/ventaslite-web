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

## Estado actual

El frontend contiene el layout administrativo, navegación, dashboard demostrativo y pantallas placeholder. El cliente Axios está preparado, pero no ejecuta solicitudes automáticamente. La autenticación y la integración funcional con Laravel se implementarán en etapas posteriores.

Los datos del dashboard son ficticios y no representan operaciones reales.
