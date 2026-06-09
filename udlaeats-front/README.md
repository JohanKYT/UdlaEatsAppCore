# UdlaEats Frontend (Cliente Web)

## Descripción
Interfaz de usuario de la plataforma UdlaEats. Es una SPA (Single Page Application) reactiva que consume la API REST de `udlaeats-core`. Está modularizada en distintos paneles de control (Dashboards) adaptados a cada rol del sistema.

## Entorno de Producción
La interfaz web se encuentra desplegada y accesible públicamente en:
* **URL de Producción:** https://udlaeats-frontend.onrender.com

## Stack Tecnológico
* **Librería Principal:** React
* **Herramienta de Construcción:** Vite
* **Gestor de Paquetes:** pnpm
* **Enrutamiento:** React Router Dom
* **Estilos:** CSS Modules

## Características Principales
* **Dashboards Dedicados:** Vistas independientes y protegidas para Administrador General, Locales Comerciales y Usuarios Finales.
* **Gestión de Estado Optimizada:** Implementación de *Lazy Initialization* para la lectura eficiente de memoria local (localStorage) y reducción de renderizados innecesarios.
* **Diseño Responsivo:** Interfaz adaptable a dispositivos móviles mediante el uso de menús *Off-Canvas* y arquitecturas Grid/Flexbox.
* **Comunicación con API:** Uso de instancias configuradas (Axios/Fetch) que apuntan dinámicamente al entorno local o de producción en Render.

## Requisitos Previos para Desarrollo Local
* Node.js (Versión LTS recomendada).
* pnpm instalado globalmente (`npm install -g pnpm`).

## Instalación y Ejecución Local

1.  **Instalar dependencias:**
    Situarse en el directorio raíz del frontend y ejecutar:
    ```bash
    pnpm install
    ```

2.  **Ejecutar el servidor de desarrollo:**
    ```bash
    pnpm dev
    ```

## Estructura de Directorios Principal
* `/src/components`: Componentes reutilizables de la interfaz.
* `/src/pages`: Componentes principales que representan las rutas (Dashboards, Login, Registro).
* `/src/services`: Configuración de conexión con el backend (API endpoints).
