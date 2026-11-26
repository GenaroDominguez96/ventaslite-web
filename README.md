# VentasLite Web

Frontend de VentasLite construido con React 18, Vite 8 y Tailwind CSS 4.

## URLs públicas

- **Frontend:** https://ventaslite-web-production.up.railway.app
- **Backend API:** https://ventaslite-api-production.up.railway.app/

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

## Reportes

Dashboard y Reportes consultan los datos agregados de la API. El rango de fechas inicial cubre los últimos 12 meses y se puede modificar junto con la sucursal.

- Dashboard: ventas totales, número de ventas, ticket promedio, cambio contra el periodo anterior y ventas por mes.
- Reportes: top 10 de productos por unidades o importe, ranking de vendedores, tabla cruzada de sucursal por categoría y margen bruto por categoría.
- Cada reporte tiene exportación CSV.
- El backend aplica el alcance por rol y excluye las ventas canceladas; el frontend no suma el detalle de las ventas para construir indicadores.

## Asistente de IA

En la pantalla Reportes se puede enviar una pregunta en español o solicitar el resumen ejecutivo. Ambas acciones utilizan el rango de fechas y la sucursal aplicados en los filtros. La respuesta se muestra en la misma pantalla; si falta la configuración de OpenAI o el servicio no responde, se presenta un mensaje y los reportes siguen funcionando.

La API key se configura exclusivamente en el backend mediante `OPENAI_API_KEY`. No debe agregarse al frontend ni a variables `VITE_*`.

Entregables de documentación:
- [Bitácora de uso de IA](./AI_LOG.md).
- [Wireframe de Login, Dashboard y Ventas](./docs/wireframe/wireframe-login-dashboard-ventas.svg).

## Estado actual

El frontend contiene login, protección de rutas, layout administrativo, dashboard, ventas y reportes conectados a la API, incluido el asistente de IA y el resumen ejecutivo. El sistema está publicado en las URLs indicadas arriba; las capturas y el video demostrativo permanecen pendientes.
