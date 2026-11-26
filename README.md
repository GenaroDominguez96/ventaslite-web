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

En Windows se puede copiar el archivo desde el Explorador o con PowerShell:

```powershell
Copy-Item .env.example .env
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
│   ├── layout/
│   └── sales/
├── context/
├── data/
├── pages/
├── routes/
├── services/
└── utils/
```

## Configuración

- `VITE_APP_NAME`: nombre de la aplicación.
- `VITE_API_URL`: URL base de la API Laravel, por ejemplo `http://localhost:8000/api`.

No almacenar secretos ni API keys en variables `VITE_*`; se exponen al navegador.

## Autenticación

El login consume los endpoints de autenticación del backend:

- `POST /login`: inicia sesión y recibe un token Sanctum.
- `GET /me`: recupera al usuario cuando existe un token guardado.
- `POST /logout`: invalida el token actual.

Las rutas Dashboard, Ventas y Reportes requieren una sesión válida. El token se envía mediante el encabezado `Authorization: Bearer`.

## Ventas

La pantalla Ventas consume los catálogos y endpoints protegidos del backend:

- `GET /branches`: sucursales para filtros y registro.
- `GET /products`: productos activos con existencias.
- `GET /sellers`: vendedores para el filtro de administrador.
- `GET /sales`: listado paginado con filtros por fecha, sucursal, vendedor y estatus.
- `GET /sales/{id}`: detalle de venta.
- `POST /sales`: registra una venta.
- `POST /sales/{id}/cancel`: cancela una venta (solo administrador).

Los importes se calculan y validan en el backend; el frontend solo muestra una vista previa del subtotal, IVA y total. La autorización por vendedor también se aplica en la API.

## Estado actual

El frontend contiene login, protección de rutas, layout administrativo, dashboard demostrativo y el módulo de Ventas conectado a la API. El módulo de Reportes y el asistente de IA permanecen pendientes.

Los datos del dashboard son ficticios y no representan operaciones reales.
