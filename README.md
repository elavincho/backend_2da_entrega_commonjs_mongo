# TodoStock S.A. - Sistema de Gestión de Inventario

## Proyecto: Desarrollo de Sistemas Web (Back End)

**Tecnicatura Superior en Desarrollo de Software**
**Instituto de Formación Técnica Superior N° 29 (IFTS 29)**

---

## Descripción del Proyecto

Este proyecto es la **Primer Entrega** de la materia de Desarrollo de Sistemas Web - Back End. Consiste en el desarrollo del Back End diseñado para la distribuidora de productos de limpieza "TodoStock S.A.". La plataforma permite gestionar el ciclo de vida completo de los productos (CRUD), asegurando la persistencia de datos mediante archivos JSON y ofreciendo una interfaz dinámica.

## Funcionalidades Principales

- **CRUD Completo:** Creación, Lectura, Actualización y Eliminación de productos de limpieza.
- **Validación de Id:** Control de duplicados en la carga manual de IDs.Esto se aplica, hasta que comencemos a utilizar base de datos.
- **Control de Stock:** Sistema de alertas visuales (color rojo) para productos por debajo del stock mínimo.
- **Persistencia:** Almacenamiento de datos en formato JSON utilizando el módulo nativo `fs` de Node.js.
- **Interfaz Dinámica:** Motor de plantillas **Pug** con Layouts reutilizables y estilos CSS personalizados.

## Tecnologías Utilizadas

- **Node.js** (Entorno de ejecución)
- **Express.js** (Framework web)
- **Pug** (Motor de plantillas)
- **CSS3** (Diseño y estilos)
- **JavaScript (ES6+)** (Lógica de negocio y POO)

## Estructura del Proyecto

BE-Primer-Entrega/
├── data/           # Archivos JSON (Persistencia)
├── models/         # Clases y lógica de datos (POO)
├── controllers/    # Controladores de rutas
├── routes/         # Definición de endpoints
├── public/         # Archivos estáticos (CSS, imágenes)
├── views/          # Plantillas Pug
└── app.js          # Punto de entrada del servidor
