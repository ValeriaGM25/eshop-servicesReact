# eshop-react

## Despliegue en Netlify

Repositorio: ValeriaGM25/eshop-servicesReact

Configuracion del sitio en Netlify:

- Rama: main
- Base directory: vacio
- Build command: npm run build
- Publish directory: dist
- Node.js: 24

Variables necesarias en Netlify:

```env
VITE_CATALOG_API_URL
VITE_BASKET_API_URL
VITE_IDENTITY_API_URL
```

Ruta dentro de Netlify:

```text
Project configuration
-> Environment variables
```

No usar localhost en produccion. Las tres variables deben apuntar a URLs HTTPS de Azure Container Apps. Despues de cambiar variables se debe ejecutar un nuevo deploy.

El frontend no debe almacenar secretos. Todo valor `VITE_` queda visible en el JavaScript generado, por lo que solo debe contener URLs publicas. El access token permanece en memoria. El refresh token se administra desde Identity.API mediante cookie HttpOnly.

Cuando se conozca el dominio final de Netlify, las tres APIs deben aceptar ese origen en CORS. Identity.API tambien necesita cookies de produccion compatibles con HTTPS y comunicacion entre dominios.

No modificar el backend desde este proyecto.
