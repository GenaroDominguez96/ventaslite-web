# VentasLite Web

Frontend de VentasLite construido con React 18, Vite y Tailwind CSS 4.

## Requisitos

- Node.js 20.19+ o 22.12+
- npm

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
- `npm run lint`: análisis estático.

## Configuración

- `VITE_APP_NAME`: nombre de la aplicación.
- `VITE_API_URL`: URL base de la API Laravel.

No almacenar secretos ni API keys en variables `VITE_*`; se exponen al navegador.

## Estado

El layout administrativo y las pantallas de navegación utilizan datos ilustrativos. La integración con la API y la lógica funcional se implementarán en etapas posteriores.
