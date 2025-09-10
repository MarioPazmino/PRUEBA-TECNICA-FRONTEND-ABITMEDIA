
# PRUEBA-TECNICA-FRONTEND-ABITMEDIA
PRUEBA TECNICA FRONTEND ABITMEDIA

## Integración Angular + Tailwind CSS v4

### Dificultades encontradas
- Tailwind CSS v4 no es compatible de forma nativa con Angular CLI, ya que el sistema de plugins cambió y ahora requiere configuración CSS-first o el uso explícito de la directiva `@config` para cargar el archivo `tailwind.config.js`.
- El plugin tradicional de Tailwind para PostCSS (`tailwindcss`) fue reemplazado por `@tailwindcss/postcss`, lo que requiere ajustes en la configuración de PostCSS.
- La carpeta de salida del build de Angular (`dist/temp-frontend/browser`) debe ser copiada correctamente al contenedor Nginx para servir la aplicación.
- La documentación oficial de Tailwind v4 y Angular aún está en proceso de actualización, por lo que se requiere investigar y adaptar la configuración manualmente.

### Solución aplicada
- Se instaló Tailwind CSS v4 y sus dependencias usando npm.
- Se creó el archivo `.postcssrc.json` con el plugin `@tailwindcss/postcss`.
- Se creó y configuró manualmente el archivo `tailwind.config.js` y se importó en `styles.css` usando la directiva `@config`.
- Se ajustó el Dockerfile para copiar la carpeta correcta de salida del build Angular (`dist/temp-frontend/browser`) a `/usr/share/nginx/html` en Nginx.
- Se corrigió el mapeo de puertos en `docker-compose.yml` para que el frontend sea accesible en `localhost:4200`.

### Estado actual
- El backend (Spring Boot) se levanta correctamente y expone la API en el puerto 8080.
- El frontend (Angular + Tailwind v4) se construye y se sirve mediante Nginx en el puerto 4200.
- Se está validando que Nginx sirva correctamente los archivos generados por Angular.

---
**Documentación en progreso.**
