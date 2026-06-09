# UdlaEats Core (API REST)

## Descripción
Módulo central (Backend) de la plataforma UdlaEats. Proporciona una API RESTful robusta que gestiona la autenticación de usuarios, el control de roles, el procesamiento de transacciones (pedidos) y la ejecución de tareas programadas (CRON) para notificaciones predictivas.

## Entorno de Producción
La API se encuentra desplegada de forma continua en el siguiente entorno:
* **URL Base de Producción:** https://udlaeats-backend.onrender.com

## Stack Tecnológico
* **Lenguaje:** Java
* **Framework:** Spring Boot
* **Persistencia:** Spring Data JPA / Hibernate
* **Base de Datos:** PostgreSQL

## Características Principales
* **Control de Acceso Basado en Roles (RBAC):** Gestión estricta de permisos para Administradores, Restaurantes y Usuarios (Estudiantes/Personal).
* **Servicio Predictivo de Notificaciones:** Algoritmo que analiza el historial de pedidos de los usuarios y el tráfico actual de los restaurantes para emitir alertas anticipadas de consumo.
* **Gestión de Estados (CRUD):** Control total de entidades mediante endpoints protegidos, incluyendo operaciones de nivel administrador ("Modo Dios").
* **Data Seeding:** Inyección automatizada de usuarios maestros y roles al inicializar el sistema.

## Requisitos Previos para Desarrollo Local
* Java Development Kit (JDK) 17 o superior.
* PostgreSQL configurado y en ejecución.

## Configuración y Ejecución Local

1.  **Configuración de la Base de Datos:**
    Modificar el archivo `src/main/resources/application.properties` con las credenciales locales de PostgreSQL:
    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/udlaeats_db
    spring.datasource.username=TU_USUARIO
    spring.datasource.password=TU_CONTRASEÑA
    spring.jpa.hibernate.ddl-auto=update
    ```

2.  **Compilación y Ejecución:**
    Ejecutar el proyecto utilizando el wrapper de Maven integrado o a través de su entorno de desarrollo (IDE):
    ```bash
    ./mvnw spring-boot:run
    ```
