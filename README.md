# eshop-react

Frontend React/Vite para ecommerce con Catalog.API, Basket.API, Identity.API y Orders.API.

## Identidad Visual

La interfaz usa una identidad `Neo Commerce / Digital Store`: superficies oscuras, paneles elevados, acentos violeta/indigo/cyan, bordes redondeados, sombras suaves, jerarquia tipografica clara y estados semanticos visibles.

React Bits utilizados localmente:

- `AuroraBackground`: fondo sutil en hero y autenticacion.
- `SpotlightCard`: iluminacion ligera en cards.
- `AnimatedContent`: entrada suave en confirmacion.

Los efectos respetan `prefers-reduced-motion` y no se aplican en formularios ni tablas.

## Rutas

```text
/
/productos
/productos/:id
/login
/registro
/carrito
/compra/confirmacion/:orderId
/ordenes/:id
/mis-compras
/admin
/admin/productos
/admin/productos/nuevo
/admin/productos/:id/editar
/admin/ordenes
```

Rutas de cliente usan `RoleRoute roles={['Cliente']}`. Rutas admin usan `RoleRoute roles={['Admin']}`.

## Flujo Cliente

```text
Catálogo
-> Login
-> Carrito
-> Compra
-> Confirmación
-> Orden
-> PDF
-> Mis compras
```

El boton `Realizar compra` envia `POST /api/orders` con `Idempotency-Key`. La clave se conserva para reintentos de la misma operacion y se descarta solo despues de `201 Created`. El carrito no se limpia visualmente antes del exito; despues se refresca `BasketContext`.

`/compra/confirmacion/:orderId` muestra la compra confirmada y consulta `GET /api/orders/{id}` si faltan datos en la respuesta inicial.

`/ordenes/:id` siempre consulta `GET /api/orders/{id}` como fuente de verdad.

`/mis-compras` usa `GET /api/orders/customer/{customerId}`. El `customerId` se toma de la sesion si existe como `customerId`, `id`, `userId`, `sub` o `nameIdentifier`. Si la sesion no lo expone, la UI muestra un error controlado y no inventa datos.

## Flujo Admin

```text
Admin
-> Gestión de órdenes
-> Detalle
-> Confirmar/Cancelar
-> PDF
```

`/admin/ordenes` intenta cargar ordenes reales con `GET /api/orders`. Si Orders.API no expone ese endpoint, se muestra el error controlado devuelto por el servicio.

Confirmar y cancelar llaman `PATCH /api/orders/{id}/status`. La UI solo muestra esas acciones cuando la orden esta `Pending`; el backend sigue siendo la autoridad final y puede responder `409`.

## PDF

React no genera el reporte PDF; unicamente solicita el archivo a Orders.API.

```text
React
-> GET /api/orders/{id}/report
-> Blob application/pdf
-> descarga
```

No se usa `jsPDF`, `html2canvas`, `PDFKit` ni impresion HTML como sustitucion. El filename se toma de `Content-Disposition` cuando existe.

## Variables De Entorno

Solo URLs publicas en variables `VITE_`:

```env
VITE_CATALOG_API_URL=http://localhost:6002
VITE_BASKET_API_URL=http://localhost:6001
VITE_IDENTITY_API_URL=http://localhost:6003
VITE_ORDERS_API_URL=http://localhost:6004
```

En Netlify usar URLs HTTPS reales:

```env
VITE_CATALOG_API_URL=https://TU-CATALOG-API.azurecontainerapps.io
VITE_BASKET_API_URL=https://TU-BASKET-API.azurecontainerapps.io
VITE_IDENTITY_API_URL=https://TU-IDENTITY-API.azurecontainerapps.io
VITE_ORDERS_API_URL=https://TU-ORDERS-API.azurecontainerapps.io
```

No colocar secretos, tokens ni credenciales en variables `VITE_`.

## Ejecucion

```bash
npm install
npm run dev
```

## Validacion

```bash
npm test
npm run build
```

No modificar el backend desde este repositorio. No usar `localhost` en produccion.
