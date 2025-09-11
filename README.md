
# PRUEBA-TECNICA-FRONTEND-ABITMEDIA
PRUEBA TECNICA FRONTEND ABITMEDIA

🚨 AVISO IMPORTANTE - CONTACTO
Si considera que esta prueba técnica cumple con los criterios requeridos y desea proceder con el proceso de evaluación, por favor comuníquese únicamente a través de:

📧 Correo electrónico: mariopazmino78@gmail.com
📱 WhatsApp: +593 989508266

Nota: Debido a mi ubicación geográfica, no es posible atender llamadas telefónicas convencionales. Agradezco su comprensión y quedo atento a su contacto por los medios mencionados y muchas gracias por esta oportunidad.

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

## Estructura del Proyecto

### Arquitectura General
```
PRUEBA-TECNICA-FRONTEND-ABITMEDIA/
├── backend/
│   ├── prueba.jar              # Backend Spring Boot
│   └── README.md               # Documentación backend
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/     # Componentes standalone
│   │   │   │   ├── posts/      # Gestión de posts (CRUD)
│   │   │   │   ├── comments/   # Sistema de comentarios
│   │   │   │   ├── header/     # Navegación principal
│   │   │   │   ├── notification/ # Alertas globales
│   │   │   │   ├── not-found/  # Página 404
│   │   │   │   ├── login/      # Autenticación
│   │   │   │   └── register/   # Registro de usuarios
│   │   │   ├── services/       # Servicios Angular
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── post.service.ts
│   │   │   │   └── comment.service.ts
│   │   │   ├── signals/        # Estado reactivo (Angular 20)
│   │   │   │   ├── auth.signal.ts
│   │   │   │   ├── posts.signal.ts
│   │   │   │   ├── comments.signal.ts
│   │   │   │   └── notification.signal.ts
│   │   │   ├── models/         # Interfaces TypeScript
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── post.model.ts
│   │   │   │   └── comment.model.ts
│   │   │   ├── i18n.providers.ts # Configuración i18n
│   │   │   ├── language-selector.component.ts
│   │   │   └── app.ts          # Componente raíz
│   │   └── assets/
│   │       └── i18n/           # Archivos de traducción
│   │           ├── es.json     # Español
│   │           └── en.json     # Inglés
│   ├── coverage/               # Reportes de cobertura
│   ├── Dockerfile              # Container frontend
│   ├── tailwind.config.js      # Configuración Tailwind v4
│   ├── .postcssrc.json         # PostCSS para Tailwind
│   ├── karma.conf.js           # Configuración tests
│   └── package.json            # Dependencias npm
├── docker-compose.yml          # Orquestación completa
└── README.md                   # Esta documentación
```

### Tecnologías Implementadas

- **Frontend**: Angular 20 + Tailwind CSS v4 + TypeScript
- **Backend**: Spring Boot + Java + REST API
- **Base de Datos**: Integrada en Spring Boot
- **Contenedores**: Docker + Docker Compose
- **Testing**: Jasmine + Karma (99.7% coverage)
- **i18n**: ngx-translate v17+ (ES/EN)
- **Estado**: Angular Signals (reactivo)

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

## Gestión de Posts: CRUD Completo

### Estado actual

- Se implementó el componente Posts con funcionalidad CRUD completa usando Angular 20 y las nuevas APIs (`signal`, `inject`, `effect`).
- El diseño es completamente responsivo con enfoque mobile-first, adaptándose desde 320px hasta dispositivos desktop usando Tailwind CSS v4.
- Integración completa con backend mediante endpoints RESTful: GET, POST, PUT y DELETE con autenticación JWT.
- Sistema de notificaciones automáticas con timeout para feedback inmediato al usuario en operaciones de crear, editar y eliminar posts.
- Animaciones fluidas para entrada/salida de posts y modales usando Angular Animations con transiciones CSS3 personalizadas.
- Validaciones en tiempo real con contador de caracteres (2000 max), botones deshabilitados hasta completar validación.
- Autorización por rol: solo el autor de un post puede editarlo o eliminarlo, con controles de UI apropiados.
- Estados de carga con spinners durante operaciones async para mejorar la experiencia de usuario.
- Internacionalización (i18n) completa con ngx-translate para todos los textos y mensajes de error/éxito.

## Sistema de Comentarios: Interacción Social

### Estado actual

- Se implementó el componente Comments como módulo reutilizable integrado en cada post, siguiendo las APIs modernas de Angular 20 (`signal`, `inject`).
- El diseño es completamente responsivo con UI adaptativa que funciona tanto en desktop como móvil, usando botones contextuales que cambian según el viewport.
- Funcionalidad CRUD completa para comentarios: crear, editar inline, eliminar y listar con ordenamiento dinámico (ascendente/descendente).
- Sistema de autorización granular: solo el autor de cada comentario puede editarlo o eliminarlo, con verificación de permisos en tiempo real.
- Edición inline con modo de edición activable/cancelable, incluyendo validaciones en tiempo real y contador de caracteres (300 max).
- Ordenamiento dinámico con toggle visual para cambiar entre orden cronológico ascendente y descendente de comentarios.
- Animaciones suaves de entrada/salida usando Angular Animations con transiciones personalizadas para mejorar la UX.
- Integración completa con sistema de notificaciones global para feedback inmediato en operaciones de crear, editar y eliminar.
- Internacionalización (i18n) completa con textos traducibles y mensajes de error contextuales usando ngx-translate.

## Componentes Reutilizables: Arquitectura Modular

### Estado actual

- Se desarrollaron componentes standalone reutilizables que mejoran la experiencia de usuario y mantienen consistencia en toda la aplicación.
- **Header Component**: Navegación principal con autenticación, logout seguro, selector de idioma y navegación responsiva entre secciones.
- **Notification Component**: Sistema global de alertas con animaciones CSS3, soporte para mensajes de éxito/error y timeout automático configurable.
- **Not-Found Component**: Página 404 con redirección automática, diseño atractivo y mensajes traducibles para mejorar la navegación del usuario.
- Todos los componentes siguen las nuevas APIs de Angular 20 (`signal`, `inject`) y son completamente standalone para máxima reutilización.
- Diseño consistente con Tailwind CSS v4, dark mode integrado y responsive design que se adapta desde dispositivos móviles hasta desktop.
- Integración completa con el sistema de internacionalización (i18n) para soporte multiidioma en toda la aplicación.

## Requerimientos Adicionales (Plus): Implementación Completa

### ✅ Internacionalización (i18n)

- **Implementación completa** con ngx-translate v17+ usando las nuevas APIs de Angular 20 y configuración mediante providers.
- **Archivos de traducción**: Español (es.json) e Inglés (en.json) en `/assets/i18n/` con todas las keys organizadas por módulos.
- **Language Selector Component**: Selector de idioma reutilizable y minimalista integrado en header y sidebar con persistencia de preferencia.
- **Providers configurados**: `i18n.providers.ts` con configuración optimizada para carga dinámica de traducciones.
- **Cobertura total**: Todos los textos de la aplicación (formularios, mensajes, errores, botones, etc.) están traducidos y son reactivos al cambio de idioma.

### ✅ Cobertura de Pruebas Unitarias (>80%)

- **99.7% Coverage alcanzado**: Superando ampliamente el requerimiento mínimo del 80%.
  - **99.7% Statements** (340/341)
  - **98.24% Branches** (56/57)
  - **99.12% Functions** (113/114)
  - **100% Lines** (304/304)
- **158 specs ejecutados** con 0 failures, cubriendo todos los componentes, servicios y casos edge.
- **Tests comprehensivos**: Validación de formularios, manejo de errores, signals, effects, navegación, autenticación y operaciones CRUD.
- **Configuración Karma optimizada**: Soporte multiplataforma para diferentes navegadores con reporte HTML detallado.



## Uso de APIs de angular 20

En los componentes de autenticación se han utilizado las siguientes APIs modernas de Angular 20:

- **Standalone Components:** Login, Register y el selector de idioma son componentes standalone, lo que permite mayor modularidad y reutilización sin necesidad de NgModules.
- **Signals:** Se usan signals para el manejo reactivo de estado en los formularios (ejemplo: username, password, loading, error, success), permitiendo una gestión eficiente y reactiva de los datos.
- **inject():** Se utiliza la función inject para acceder a servicios como AuthService y TranslateService, siguiendo el patrón recomendado en Angular 20 para la inyección de dependencias.
- **provideHttpClient():** El HttpClient se provee usando la nueva API de providers, facilitando la configuración global y el uso en servicios.
- **provideRouter():** El enrutamiento se configura con la nueva API, permitiendo rutas standalone y layouts desacoplados.
- **Ngx-translate v17+:** Integración con la nueva versión de ngx-translate para internacionalización, usando providers y loaders recomendados.
- **Tailwind v4:** Todo el diseño y responsividad se logra con utilidades de Tailwind v4, integradas en los componentes Angular.

Estas prácticas aseguran un código moderno, limpio y alineado con las recomendaciones actuales de Angular.


### Estado actual
- [x] Pruebas unitarias para login, register y app.
- [x] Cobertura visual disponible.
- [x] Configuración multiplataforma para navegadores.
- [x] Diseño responsivo.
- [x] Experiencia de usuario.
- [x] Código limpio y bien estructurado.
- [x] Componentes reutilizables.
- [x] Uso adecuado de las tecnologías requeridas.
- [x] Documentación clara.
- [x] Uso de Docker para levantar la aplicación.
- [x] UI/UX.
- [x] Uso de las nuevas APIs de Angular 20 (ej. `signal`).
### Plus
- [x] Implementación de internacionalización (i18n).
- [x] Cobertura de pruebas unitarias (al menos 80%).

## Pruebas unitarias y cobertura

**Tip importante:**
- Guarda siempre los cambios en `karma.conf.js` antes de ejecutar los tests para que la configuración se aplique correctamente.
- El reporte de coverage se crea en `frontend/coverage/temp-frontend/index.html` y ahí puedes ver el porcentaje de cobertura visualmente.

### Problemas y soluciones con Karma y coverage

**Problema:** Karma intenta abrir Chrome por defecto, pero si no está instalado, falla y no muestra el porcentaje de cobertura en consola.

**Solución manual y universal:**
1. Ejecuta `npx ng test --code-coverage`.
2. Si ves el mensaje "No captured browser, open http://localhost:9876/", abre esa URL manualmente en tu navegador preferido (Firefox, Edge, Brave, etc.).
3. Los tests se ejecutarán y el coverage se generará en la carpeta `coverage/`.
4. El porcentaje de cobertura se verá en el reporte HTML (`coverage/temp-frontend/index.html`).

**Solución automática:**
- Instala Firefox y deja solo 'Firefox' en la lista de browsers en `karma.conf.js`.
- O usa la variable de entorno BROWSER (solo en PowerShell):
	`$env:BROWSER="Firefox"; npx ng test --code-coverage`

**Notas:**
- El coverage es real aunque no salga el porcentaje en consola.
- El método manual funciona en cualquier entorno y navegador.
- Si editas `karma.conf.js`, guarda el archivo antes de ejecutar los tests.
- Si tienes problemas con esbuild, reinicia el proceso de tests.

Esta documentación asegura que cualquier usuario pueda ejecutar los tests y ver el coverage sin importar el navegador instalado.


Se implementaron pruebas unitarias para los componentes principales (login, register y app) usando Jasmine y Karma.

- Los tests cubren la creación de componentes, validaciones de formularios y lógica de habilitación de botones.
- La configuración de Karma permite ejecutar los tests en cualquier navegador instalado (Chrome, Brave, Firefox, Edge).
- Para ejecutar los tests y ver el reporte de cobertura, usa:

	```bash
	ng test --code-coverage
	```

- El reporte de cobertura se genera en la carpeta `coverage/` y puede visualizarse abriendo `coverage/index.html` en tu navegador.
- Todos los tests actuales pasan correctamente y la cobertura básica está asegurada.

