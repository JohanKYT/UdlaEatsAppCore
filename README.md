# UdlaEats - Sistema de Gestión de Pedidos Universitarios

## Descripción General
UdlaEats es una plataforma integral diseñada para optimizar la gestión de pedidos de alimentos dentro de los campus de la Universidad de las Américas (UDLA). El sistema conecta a estudiantes y personal administrativo con los locales comerciales internos, centralizando la toma de pedidos, el control de stock en tiempo real y la predicción de tráfico.

## Despliegue en la Nube (Producción)
La plataforma se encuentra completamente desplegada y operativa en la infraestructura de Render bajo los siguientes entornos:

* **Interfaz de Usuario (Frontend):** https://udlaeats-frontend.onrender.com
* **Servicio de API (Backend):** https://udlaeats-backend.onrender.com

## Arquitectura del Sistema
El proyecto está construido bajo una arquitectura cliente-servidor, separando las responsabilidades entre el frontend y el backend para garantizar escalabilidad, portabilidad y un desacoplamiento óptimo.

* **Frontend (`udlaeats-frontend/`):** Aplicación de Página Única (SPA) desarrollada con React y Vite.
* **Backend (`udlaeats-core/`):** API RESTful desarrollada con Spring Boot y Java.
* **Base de Datos:** PostgreSQL para el almacenamiento relacional de usuarios, órdenes, notificaciones y logs de tráfico.

## Estructura del Repositorio
* `/udlaeats-core`: Contiene el código fuente del servidor, lógica de negocio y algoritmos predictivos.
* `/udlaeats-frontend`: Contiene la interfaz de usuario, gestión de estado y enrutamiento del lado del cliente.

## Contexto Académico
* **Institución:** Universidad de las Américas (UDLA)
* **Estado del Proyecto:** MVP Funcional Desplegado
