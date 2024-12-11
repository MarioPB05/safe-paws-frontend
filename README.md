![Safe Paws Logo](/public/Banner%20SP%20Front.png)

# Safe Paws (Frontend)

¡Bienvenido a Safe Paws! 🐾

SafePaws es una aplicación web que te permite encontrar a tu nuevo mejor amigo. En SafePaws podrás encontrar perros en adopción, conocer sus características y solicitar su adopción.

## Características
- **Catálogo de animales**: Explora la lista de mascotas en adopción.
- **Mapa interactivo**: Visualiza la ubicación de las mascotas en adopción en un mapa en tiempo real.
- **Sube tus propias mascotas**: Si tienes una mascota que deseas dar en adopción, puedes subirla a la plataforma.
- **Solicita la adopción de una mascota**: Si encuentras una mascota que te interesa, puedes solicitar su adopción.

## Instrucciones de instalación y uso

### Requisitos previos
- Tener instalado Node.js en tu dispositivo.
- Tener el backend de SafePaws configurado y corriendo en tu dispositivo. `https://github.com/MarioPB05/safe-paws-backend.git`

### Instalación
1. Clona este repositorio en tu dispositivo.
```
git clone https://github.com/MarioPB05/safe-paws-frontend.git
```
2. Instala las dependencias del proyecto.
```
npm install
```

3. Ejecuta el servidor
```
ng serve --proxy-config proxy.conf.json
```

6. Accede a la aplicación en tu navegador:<br>
Abre tu navegador web y visita `http://127.0.0.1:8000`

## Estructura del Proyecto

## Estructura General
```
/src/app
├───core
│   ├───guards
│   ├───interceptors
│   ├───models
│   └───services
├───features
│   ├───adoption-form
│   │   └───services
│   ├───adoption-tracking
│   ├───auth
│   │   └───services
│   ├───chat
│   ├───create-adoption
│   │   ├───pages
│   │   └───services
│   ├───dashboard
│   │   ├───components
│   │   │   ├───adoption-card
│   │   │   ├───details-card
│   │   │   ├───header
│   │   │   ├───navbar
│   │   │   ├───pet-card
│   │   │   └───request-card
│   │   ├───pages
│   │   │   ├───adoption-requests
│   │   │   ├───adoptions
│   │   │   ├───map
│   │   │   └───user
│   │   └───services
│   └───home
└───shared
    ├───components
    │   ├───chat
    │   ├───image-uploader
    │   ├───loading
    │   ├───map
    │   ├───signature-pad
    │   └───stepper
    │       ├───stepper-component
    │       ├───stepper-footer
    │       └───stepper-header
    └───services
```

## Descripción de Carpetas

### **Core**
Contiene las funcionalidades centrales y compartidas del proyecto.
- **guards**: Implementa guardias de ruta para proteger las secciones de la aplicación.
- **interceptors**: Define interceptores para manejar solicitudes HTTP, como autenticación o manejo de errores.
- **models**: Modelos de datos utilizados en la aplicación.
- **services**: Servicios generales reutilizables a lo largo de la aplicación.

### **Features**
Incluye las funcionalidades principales organizadas por módulos independientes.
- **adoption-form**: Lógica relacionada con el formulario de adopción.
  - **services**: Servicios específicos del formulario.
- **adoption-tracking**: Seguimiento de adopciones.
- **auth**: Módulo de autenticación de usuarios.
  - **services**: Servicios relacionados con la autenticación.
- **chat**: Funcionalidad de mensajería entre usuarios.
- **create-adoption**: Módulo para crear nuevas adopciones.
  - **pages**: Páginas específicas del flujo.
  - **services**: Servicios relacionados.
- **dashboard**: Panel de control de la aplicación.
  - **components**: Componentes específicos del dashboard, como:
    - **adoption-card**: Tarjeta para mostrar adopciones.
    - **details-card**: Tarjeta con detalles específicos.
    - **header**: Encabezado del dashboard.
    - **navbar**: Barra de navegación.
    - **pet-card**: Tarjeta para mostrar mascotas.
    - **request-card**: Tarjeta de solicitudes.
  - **pages**: Páginas específicas del dashboard, como:
    - **adoption-requests**: Página de solicitudes de adopción.
    - **adoptions**: Página para listar adopciones.
    - **map**: Página con un mapa interactivo.
    - **user**: Página de perfil de usuario.
  - **services**: Servicios específicos del dashboard.
- **home**: Página de inicio de la aplicación.

### **Shared**
Componentes y servicios reutilizables en diferentes partes de la aplicación.
- **components**: Componentes genéricos, como:
  - **chat**: Componente de chat.
  - **image-uploader**: Subida de imágenes.
  - **loading**: Indicador de carga.
  - **map**: Componente de mapa.
  - **signature-pad**: Panel para capturar firmas.
  - **stepper**: Componente para flujos de pasos:
    - **stepper-component**: Lógica principal del stepper.
    - **stepper-footer**: Pie de página del stepper.
    - **stepper-header**: Encabezado del stepper.
- **services**: Servicios genéricos y reutilizables.

## Autores
- [@marioperdiguero](https://github.com/marioperdiguero)
- [@mricofer](https://github.com/mricofer)
- [@raulcruzadodelgado1](https://github.com/raulcruzadodelgado1)
- [@jzayassanroman](https://github.com/jzayassanroman)
