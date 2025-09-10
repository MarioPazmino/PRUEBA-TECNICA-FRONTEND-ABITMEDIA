# PRUEBA TECNICA FRONTEND ABITMEDIA

## Instrucciones para ejecutar la aplicación

El proyecto se puede ejecutar utilizando Docker o directamente con Java si tienes el entorno configurado.

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/Desarrollo2Abitmedia/prueba_tecnica_front.git
   cd prueba-tecnica-front
   ```

2. Ejecutar con Docker:

   Asegúrate de tener Docker instalado y ejecutándose en tu máquina.

   ```bash
   docker build -t prueba-frontend .
   docker run -p 8080:8080 prueba-frontend
   ```

   La aplicación estará disponible en `http://localhost:8080`.

3. Ejecutar con Java:
    Asegúrate de tener Java instalado en tu máquina.
    
    ```bash
    java -jar prueba.jar
    ```
    
    La aplicación estará disponible en `http://localhost:8080`.

Para visualizar la documentación de la API, abre tu navegador y navega a `http://localhost:8080/swagger-ui.html`.

## Tiempo estimado

Se debe entregar la prueba 3 días posterior a la recepción de la misma.

## Requerimientos de la prueba

Se requiere desarrollar una aplicación web que permita a los usuarios:

- Registrarse y autenticarse.
- Crear, leer, actualizar y eliminar (CRUD) posts.
- Comentar en los posts.

La aplicación debe ser responsiva y funcionar correctamente en dispositivos móviles y de escritorio.

## Tecnologias requeridas

- Angular 20
- Tailwind CSS v4 o CSS puro
- Node.js v20

## Entregables

- Código fuente en un repositorio público (GitHub, GitLab, etc.).
- Instrucciones claras para ejecutar la aplicación.
- Levantar en un contenedor Docker utilizando Docker Compose.
- Documentación breve del proyecto (Estructura, componentes principales).

**Nota:** Incluir en el repositorio el archivo `prueba.jar` para facilitar la ejecución de la aplicación.

## Criterios de evaluación

- [ ] Diseño responsivo.
- [ ] Experiencia de usuario.
- [ ] Código limpio y bien estructurado.
- [ ] Componentes reutilizables.
- [ ] Uso adecuado de las tecnologías requeridas.
- [ ] Documentación clara.
- [ ] Uso de Docker para levantar la aplicación.
- [ ] UI/UX.
- [ ] Uso de las nuevas APIs de Angular 20 (ej. `signal`).

### Plus

- [ ] Implementación de internacionalización (i18n).
- [ ] Cobertura de pruebas unitarias (al menos 80%).

## Enviar la prueba al correo

- desarrollo@abitmedia.cloud
- cc: gerencia@abitmedia.cloud
- asunto: Prueba Técnica Frontend - [Tu Nombre]
- adjuntar el link del repositorio