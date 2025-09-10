
# PRUEBA-TECNICA-FRONTEND-ABITMEDIA
PRUEBA TECNICA FRONTEND ABITMEDIA
docker-compose up --build

## ¿Cómo levantar toda la aplicación?

Puedes levantar el backend (Spring Boot) y el frontend (Angular + Tailwind v4) juntos usando Docker Compose. Solo necesitas tener Docker y Docker Compose instalados.

### Pasos rápidos

1. Clona el repositorio:

	```bash
	git clone https://github.com/Desarrollo2Abitmedia/prueba_tecnica_front.git
	cd prueba-tecnica-front
	```

2. Levanta todo con Docker Compose:

	```bash
	docker-compose up --build
	```

	Esto construirá y levantará ambos servicios:
	- Backend: Spring Boot en el puerto `8080` (API y Swagger)
	- Frontend: Angular + Tailwind v4 servido por Nginx en el puerto `4200`

3. Accede a la aplicación:
	- Frontend: [http://localhost:4200](http://localhost:4200)
	- Backend/API: [http://localhost:8080](http://localhost:8080)
	- Documentación API: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

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

## Autenticación: Login y Registro

### Estado actual

- Se implementaron los componentes de Login y Registro como componentes standalone y reutilizables, siguiendo las nuevas APIs de Angular 20 (`signal`, `inject`, etc.).
- El diseño es completamente responsivo, optimizado para desktop y móvil, usando Tailwind CSS v4.
- El espaciado, márgenes y paddings se ajustan dinámicamente para evitar que los cards se peguen a los laterales en pantallas pequeñas.
- La experiencia de usuario se ha mejorado con transiciones, feedback visual y validaciones en tiempo real.
- El selector de idioma es un componente reutilizable, minimalista y discreto, permitiendo cambiar entre ES/EN usando ngx-translate.
- La internacionalización (i18n) está integrada y funcional para los formularios de login y registro.
- El código es limpio, modular y estructurado para facilitar la extensión y el mantenimiento.
- La aplicación se levanta correctamente con Docker y Docker Compose, tanto backend como frontend.

## Uso de nuevas APIs de Angular 20 en Login y Registro

En los componentes de autenticación se han utilizado las siguientes APIs modernas de Angular 20:

- **Standalone Components:** Login, Register y el selector de idioma son componentes standalone, lo que permite mayor modularidad y reutilización sin necesidad de NgModules.
- **Signals:** Se usan signals para el manejo reactivo de estado en los formularios (ejemplo: username, password, loading, error, success), permitiendo una gestión eficiente y reactiva de los datos.
- **inject():** Se utiliza la función inject para acceder a servicios como AuthService y TranslateService, siguiendo el patrón recomendado en Angular 20 para la inyección de dependencias.
- **provideHttpClient():** El HttpClient se provee usando la nueva API de providers, facilitando la configuración global y el uso en servicios.
- **provideRouter():** El enrutamiento se configura con la nueva API, permitiendo rutas standalone y layouts desacoplados.
- **Ngx-translate v17+:** Integración con la nueva versión de ngx-translate para internacionalización, usando providers y loaders recomendados.
- **Tailwind v4:** Todo el diseño y responsividad se logra con utilidades de Tailwind v4, integradas en los componentes Angular.

Estas prácticas aseguran un código moderno, limpio y alineado con las recomendaciones actuales de Angular.

### Pendiente

- Finalizar la cobertura de pruebas unitarias (objetivo: 80%).
- Documentar el resto de los módulos y componentes CRUD.
- Mejorar la documentación técnica y de uso.

---
**Documentación en progreso.**
