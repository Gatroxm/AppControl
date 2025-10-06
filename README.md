# 📊 App Control
*Sistema Avanzado de Control y Monitoreo de Salud*

<div align="center">

![Status](https://img.shields.io/badge/Status-Completado-brightgreen?style=for-the-badge)
![AppControl Logo](https://img.shields.io/badge/AppControl-Health%20Management-blue?style=for-the-badge&logo=healthcare)

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

</div>

---

## 📋 Descripción

**App Control** es una plataforma avanzada de monitoreo y control de salud, especializada en el seguimiento de diabetes y otras condiciones médicas. El sistema proporciona herramientas integrales para pacientes y profesionales médicos, permitiendo un control detallado de glucosa, medicamentos, dieta y ejercicio con alertas inteligentes y reportes personalizados.

> 💡 **Desarrollado con React + Node.js y MongoDB**, incluye dashboard en tiempo real, sistema de alertas automáticas y análisis predictivos para mejorar la gestión de la salud.## 🚀 Instalación y Configuración

### 📍 Prerrequisitos
- **Node.js v18+** (Recomendado: v18.17.0 o superior)
- **MongoDB** (Local v6.0+ o MongoDB Atlas)
- **npm v9+** o yarn
- **Git** para control de versiones
- **PowerShell** (Windows) o terminal compatible
- **4GB RAM mínimo** para desarrollo

### ⚡ Instalación Automática (Recomendada)

#### 1. 📥 Clonar desde GitHub
```bash
git clone https://github.com/Gatroxm/AppControl.git
cd AppControl
```

#### 2. 🎯 Ejecutar Script de Inicialización (Windows)
```powershell
# Ejecutar script automático que configura todo
.\init.ps1
```

> 🎉 **¡Eso es todo!** El script `init.ps1` automaticamente:
> - ✅ Verifica prerrequisitos (Node.js, npm, MongoDB)
> - ✅ Instala todas las dependencias (root, server, client)  
> - ✅ Copia archivos `.env` desde `.env.example`
> - ✅ Inicializa la base de datos con datos de ejemplo
> - ✅ Crea el usuario administrador
> - ✅ Levanta ambos servidores automáticamente

### 🛠️ Instalación Manual (Alternativa)ongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat&logo=swagger&logoColor=black)](https://swagger.io/)

</div>

## 📋 Descripción del Proyecto

**AppControl** es una aplicación web integral desarrollada con el stack MERN (MongoDB, Express.js, React.js, Node.js) diseñada para el control y monitoreo de la diabetes. La aplicación permite a los usuarios registrar y gestionar sus niveles de glucosa, almacenar exámenes médicos y acceder a un recetario especializado con recetas saludables.

## 🚀 Quick Start

¿Tienes prisa? Ejecuta estos comandos para tener AppControl funcionando en menos de 5 minutos:

```powershell
# 1️⃣ Clonar el repositorio
git clone https://github.com/Gatroxm/AppControl.git
cd AppControl

# 2️⃣ Ejecutar script de inicialización automática (Windows)
.\init.ps1

# 3️⃣ ¡Listo! Abre tu navegador en:
# 🌐 Frontend: http://localhost:3000
# 📚 API Docs: http://localhost:5000/api/docs
# 🔑 Login: admin@appcontrol.com / Admin123!
```

### ✨ Características Principales
- 🩸 **Monitoreo de Glucosa**: Registro y seguimiento detallado de niveles de glucosa
- 🏥 **Gestión de Exámenes**: Almacenamiento seguro de documentos médicos
- 🍽️ **Recetas Saludables**: Blog especializado con recetas para diabéticos
- 👥 **Sistema de Roles**: Admin, Editor y Usuario con permisos específicos
- 📚 **Documentación API**: Swagger UI integrado
- 📱 **Diseño Responsivo**: Optimizado para todos los dispositivos
- 🔒 **Seguridad Avanzada**: JWT, encriptación y validaciones

### 🌟 Estado Actual del Proyecto
✅ **Backend Completo**: API REST totalmente funcional  
✅ **Frontend Implementado**: Interfaz de usuario completa  
✅ **Base de Datos**: Modelos y relaciones configurados  
✅ **Autenticación**: Sistema de roles y permisos  
✅ **Documentación**: Swagger UI implementado  
✅ **Datos de Prueba**: Usuario admin y datos de ejemplo  
✅ **Scripts Automáticos**: Inicialización con un solo comando  

## 🎯 Alcance del Proyecto

### Objetivo Principal
Crear una plataforma digital completa que facilite el control diario de la diabetes mediante:
- Registro y seguimiento de niveles de glucosa
- Gestión de documentos médicos
- Acceso a recetas saludables especializadas
- Sistema de roles para diferentes tipos de usuarios

### Usuarios Objetivo
- **Pacientes diabéticos**: Control personal de su condición
- **Editores de contenido**: Creación y gestión de recetas
- **Administradores**: Gestión completa de la plataforma

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

#### Backend
- **Node.js v18+**: Entorno de ejecución para JavaScript en el servidor
- **Express.js**: Framework web robusto para Node.js
- **MongoDB**: Base de datos NoSQL para almacenamiento de datos
- **Mongoose**: ODM para MongoDB con validaciones
- **JWT (JSON Web Tokens)**: Autenticación y autorización segura
- **Swagger UI Express**: Documentación interactiva de API
- **Multer**: Manejo de archivos multipart/form-data
- **bcryptjs**: Encriptación de contraseñas
- **CORS**: Configuración de políticas de origen cruzado
- **Helmet**: Middleware de seguridad
- **Express Rate Limit**: Limitación de peticiones
- **Morgan**: Logging de peticiones HTTP
- **Compression**: Compresión de respuestas

#### Frontend
- **React.js 18**: Librería moderna para interfaces de usuario
- **React Router DOM v6**: Enrutamiento avanzado para SPA
- **Tailwind CSS**: Framework de CSS para diseño responsivo
- **Axios**: Cliente HTTP para comunicación con la API
- **React Context API**: Gestión de estado global
- **React Hooks**: useState, useEffect, useContext, custom hooks
- **Componentes Funcionales**: Arquitectura moderna de React
- **Responsive Design**: Optimizado para móvil, tablet y desktop

#### Base de Datos
- **MongoDB Atlas**: Base de datos en la nube (recomendado para producción)
- **MongoDB Local**: Para desarrollo local

### Arquitectura de la Aplicación

```
AppControl/
├── client/                    # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/           # Páginas principales
│   │   ├── context/         # Context API para estado global
│   │   ├── services/        # Servicios para API calls
│   │   ├── utils/           # Utilidades y helpers
│   │   └── styles/          # Estilos adicionales
│   ├── package.json
│   └── tailwind.config.js
├── server/                   # Backend Node.js/Express
│   ├── config/              # Configuración de BD y JWT
│   ├── controllers/         # Controladores de rutas
│   ├── middleware/          # Middlewares personalizados
│   ├── models/              # Modelos de Mongoose
│   ├── routes/              # Definición de rutas
│   ├── uploads/             # Archivos subidos (temporal)
│   ├── utils/               # Utilidades del servidor
│   ├── app.js               # Configuración principal de Express
│   └── server.js            # Punto de entrada del servidor
├── docs/                    # Documentación adicional
├── .gitignore
├── package.json             # Scripts del proyecto completo
└── README.md
```

## 👥 Sistema de Roles y Permisos

### Roles Definidos

#### 1. **Admin** (Administrador)
- **Permisos completos** en toda la plataforma
- Gestión de usuarios y cambio de roles
- Acceso a todas las funcionalidades de Editor y User
- Estadísticas y métricas de la plataforma

#### 2. **Editor** (Editor de Contenido)
- Crear, editar y eliminar recetas del blog
- Ver estadísticas de sus propias publicaciones
- Acceso a funcionalidades de User

#### 3. **User** (Usuario Final)
- Registro y gestión de niveles de glucosa
- Subida y gestión de exámenes médicos
- Visualización de recetas del blog
- Gestión de perfil personal

### Matriz de Permisos

| Funcionalidad | Admin | Editor | User |
|---------------|-------|---------|------|
| Gestión de usuarios | ✅ | ❌ | ❌ |
| Cambiar roles | ✅ | ❌ | ❌ |
| Crear recetas | ✅ | ✅ | ❌ |
| Editar recetas propias | ✅ | ✅ | ❌ |
| Eliminar cualquier receta | ✅ | ❌ | ❌ |
| Ver recetas | ✅ | ✅ | ✅ |
| Registrar glucosa | ✅ | ✅ | ✅ |
| Subir exámenes | ✅ | ✅ | ✅ |
| Ver propios datos | ✅ | ✅ | ✅ |

## 📊 Modelos de Base de Datos

### 1. User (Usuarios)
```javascript
{
  _id: ObjectId,
  username: String (requerido, único),
  email: String (requerido, único),
  password: String (requerido, hasheado),
  role: String (Admin/Editor/User, default: User),
  createdAt: Date,
  updatedAt: Date
}
```

### 2. GlucometryRecord (Registros de Glucosa)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (referencia a User),
  date: Date (requerido),
  reading: Number (requerido, mg/dL),
  notes: String (opcional),
  createdAt: Date,
  updatedAt: Date
}
```

### 3. MedicalExam (Exámenes Médicos)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (referencia a User),
  title: String (requerido),
  fileUrl: String (requerido),
  originalName: String,
  fileSize: Number,
  mimeType: String,
  uploadDate: Date (requerido),
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Recipe (Recetas del Blog)
```javascript
{
  _id: ObjectId,
  editorId: ObjectId (referencia a User con rol Editor/Admin),
  title: String (requerido),
  description: String (requerido),
  imageUrl: String (requerido),
  ingredients: [String] (array de ingredientes),
  instructions: String (opcional),
  prepTime: Number (minutos),
  servings: Number,
  tags: [String] (etiquetas para categorización),
  publishDate: Date (requerido),
  isPublished: Boolean (default: true),
  views: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 API Endpoints

### 📚 Documentación Interactiva
**Swagger UI disponible en:** [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

> 🔑 **Para endpoints protegidos, usar**: `Bearer {token}` en el header Authorization

### 🔐 Autenticación
| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/register` | Registro de usuarios | Público |
| `POST` | `/api/auth/login` | Inicio de sesión | Público |
| `GET` | `/api/auth/me` | Obtener usuario actual | Privado |
| `PUT` | `/api/auth/profile` | Actualizar perfil | Privado |

### 👥 Usuarios (Solo Admin)
| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| `GET` | `/api/users` | Listar todos los usuarios | Admin |
| `GET` | `/api/users/stats` | Estadísticas de usuarios | Admin |
| `PUT` | `/api/users/:id/role` | Cambiar rol de usuario | Admin |
| `PUT` | `/api/users/:id/status` | Activar/desactivar usuario | Admin |

### 🩸 Registros de Glucosa
| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| `POST` | `/api/records/glucometry` | Crear registro de glucosa | Privado |
| `GET` | `/api/records/glucometry` | Obtener registros del usuario | Privado |
| `GET` | `/api/records/glucometry/:id` | Obtener registro específico | Privado |
| `PUT` | `/api/records/glucometry/:id` | Editar registro | Privado |
| `DELETE` | `/api/records/glucometry/:id` | Eliminar registro | Privado |
| `GET` | `/api/records/glucometry/stats` | Estadísticas de glucosa | Privado |
| `GET` | `/api/records/glucometry/admin/all` | Todos los registros | Admin |
| `GET` | `/api/records/glucometry/admin/stats` | Estadísticas globales | Admin |

### 🏥 Exámenes Médicos
| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| `POST` | `/api/records/exams` | Subir examen médico | Privado |
| `GET` | `/api/records/exams` | Listar exámenes del usuario | Privado |
| `GET` | `/api/records/exams/:id` | Obtener examen específico | Privado |
| `GET` | `/api/records/exams/:id/download` | Descargar archivo | Privado |
| `PUT` | `/api/records/exams/:id` | Actualizar metadatos | Privado |
| `DELETE` | `/api/records/exams/:id` | Eliminar examen | Privado |
| `GET` | `/api/records/exams/stats` | Estadísticas personales | Privado |
| `GET` | `/api/records/exams/admin/all` | Todos los exámenes | Admin |
| `GET` | `/api/records/exams/admin/stats` | Estadísticas globales | Admin |

### 🍽️ Recetas (Blog)
| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| `GET` | `/api/recipes` | Listar recetas públicas | Público |
| `GET` | `/api/recipes/:id` | Obtener receta específica | Público |
| `GET` | `/api/recipes/tags` | Obtener etiquetas populares | Público |
| `GET` | `/api/recipes/my/list` | Mis recetas creadas | Editor/Admin |
| `GET` | `/api/recipes/my/stats` | Estadísticas personales | Editor/Admin |
| `POST` | `/api/recipes` | Crear nueva receta | Editor/Admin |
| `PUT` | `/api/recipes/:id` | Editar receta | Editor/Admin |
| `DELETE` | `/api/recipes/:id` | Eliminar receta | Editor/Admin |
| `GET` | `/api/recipes/admin/all` | Todas las recetas | Admin |
| `GET` | `/api/recipes/admin/stats` | Estadísticas globales | Admin |

### ℹ️ Información del Sistema
| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| `GET` | `/api` | Información general de la API | Público |
| `GET` | `/api/health` | Estado de salud del servidor | Público |
| `GET` | `/api/docs` | Documentación Swagger UI | Público |

## 🔑 Credenciales de Acceso

### 👨‍💻 Usuario Administrador (Pre-configurado)
```
Email: admin@appcontrol.com
Contraseña: Admin123!
Rol: admin
```

### 📊 Datos de Ejemplo Incluidos
- **20 registros de glucometría** con valores realistas
- **15 exámenes médicos** de ejemplo
- **12 recetas saludables** para diabeticos
- **Usuarios de prueba** con diferentes roles

> 💡 **Tip**: Usa las credenciales del admin para explorar todas las funcionalidades del sistema

## 🎨 Componentes del Frontend

### Páginas Principales
- **🏠 Home** - Página de inicio con información general del sistema
- **🔐 Login/Register** - Autenticación de usuarios con validación
- **📊 Dashboard** - Panel principal adaptado según el rol del usuario
- **🩸 Glucometry** - Formularios y historial de registros de glucosa
  - Formulario de nuevo registro
  - Historial con filtros y búsqueda
  - Estadísticas y gráficos
- **🏥 Medical Exams** - Gestión completa de exámenes médicos
  - Subida de archivos con drag & drop
  - Visualizador de documentos
  - Organización por categorías
- **🍽️ Recipes** - Blog de recetas saludables
  - Vista pública para todos los usuarios
  - Gestión de recetas (Editor/Admin)
  - Modal de detalles completos
  - Filtros por dificultad y etiquetas
- **👤 Profile** - Gestión del perfil personal
- **🚬 Admin Panel** - Panel administrativo completo (solo Admin)
  - Gestión de usuarios y roles
  - Estadísticas globales del sistema
  - Monitoreo de actividad

### Componentes Reutilizables
- **Navbar** - Barra de navegación responsiva
- **Sidebar** - Barra lateral para navegación
- **Card** - Tarjetas para mostrar información
- **Modal** - Modales para formularios y confirmaciones
- **Table** - Tablas responsivas para datos
- **Chart** - Gráficos para estadísticas (Chart.js o Recharts)
- **FileUpload** - Componente para subida de archivos
- **LoadingSpinner** - Indicador de carga
- **Alert** - Notificaciones y alertas

## 📱 Diseño Responsivo

### Breakpoints de Tailwind CSS
- **sm**: 640px - Dispositivos móviles grandes
- **md**: 768px - Tablets
- **lg**: 1024px - Laptops
- **xl**: 1280px - Desktops
- **2xl**: 1536px - Pantallas grandes

### Consideraciones de UX/UI
- Navegación táctil optimizada para móviles
- Formularios con validación en tiempo real
- Feedback visual claro para todas las acciones
- Modo oscuro/claro (opcional)
- Accesibilidad web (WCAG 2.1)

## 🔧 Configuración y Despliegue

### Variables de Entorno

#### Server (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/appcontrol
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=24h
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
CORS_ORIGIN=http://localhost:3000
```

#### Client (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_UPLOAD_URL=http://localhost:5000/uploads
```

### 📜 Scripts Disponibles

#### ⚡ Scripts de Inicialización (Windows)
```powershell
# 🎯 Configuración automática completa
.\init.ps1

# 🧹 Limpiar puertos y reiniciar servidores  
.\kill-ports-and-start.ps1

# 🔄 Inicio limpio (termina procesos previos)
.\start-clean.ps1

# � Inicio simple de ambos servidores
.\start-simple.ps1
```

#### �📦 Scripts del Proyecto (Raíz)
```bash
# Desarrollo completo (frontend + backend)
npm run dev

# Solo servidor backend
npm run server

# Solo cliente frontend  
npm run client

# Instalar todas las dependencias
npm run install-deps
```

#### 📊 Scripts de Base de Datos (server/)
```bash
# Crear usuario administrador
node createAdminData.js

# Crear 20 registros de glucometría
node createAdmin20Records.js

# Verificar estadísticas del admin
node checkAdminStats.js

# Verificar usuarios en la base de datos
node checkUsers.js
```

#### 🏠 Scripts del Frontend (client/)
```bash
# Desarrollo con hot reload
npm start

# Build para producción
npm run build

# Ejecutar tests
npm test

# Analizar bundle
npm run analyze
```

#### 🚬 Scripts del Backend (server/)
```bash
# Desarrollo con nodemon
npm run dev

# Producción
npm start

# Tests
npm test
```

## 📋 Checklist de Especificaciones Técnicas

### ✅ 1. Configuración General y Stack
- [x] Configurar estructura MERN Stack
- [x] Implementar Tailwind CSS para diseño responsivo
- [x] Configurar monorepo con directorios `/client` y `/server`
- [x] Configurar CORS en backend
- [x] Establecer variables de entorno

### ✅ 2. Base de Datos (MongoDB y Mongoose)
- [x] Modelo User con roles Admin/Editor/User
- [x] Modelo GlucometryRecord para registros de glucosa
- [x] Modelo MedicalExam para archivos médicos
- [x] Modelo Recipe para blog de recetas
- [x] Script de inicialización con usuario Admin por defecto
- [x] Validaciones y esquemas de Mongoose

### ✅ 3. Backend (Node.js / Express.js API)
#### Autenticación y Autorización
- [x] Implementar registro y login con JWT
- [x] Middleware `authenticateToken` para rutas protegidas
- [x] Middleware `authorizeRole` para control de acceso por roles
- [x] Hash de contraseñas con bcryptjs

#### Módulo de Usuarios (Admin)
- [x] Endpoint para listar usuarios
- [x] Endpoint para modificar roles
- [x] Validaciones de permisos de Admin

#### Módulo de Registros (User/Admin)
- [x] CRUD completo para registros de glucosa
- [x] Upload de exámenes médicos con Multer
- [x] Validaciones de propiedad de datos
- [x] Estadísticas de registros

#### Módulo de Recetas (Editor/Admin)
- [x] CRUD completo para recetas
- [x] Validaciones de autoría
- [x] Endpoint público para visualización
- [x] Upload de imágenes para recetas

### ✅ 4. Frontend (React)
#### Estructura Base
- [x] Configurar React Router DOM
- [x] Implementar Context API para autenticación
- [x] Configurar Tailwind CSS
- [x] Estructura de componentes modular

#### Dashboard por Roles
- [ ] Dashboard de User con glucometría y exámenes
- [ ] Dashboard de Editor con gestión de recetas
- [ ] Dashboard de Admin con gestión de usuarios
- [ ] Navegación condicional según rol

#### Módulos Específicos
- [ ] Formulario y historial de glucometría
- [ ] Gestión de exámenes médicos
- [ ] Blog de recetas con vista pública
- [ ] Panel de administración de usuarios
- [ ] Formulario de creación/edición de recetas

#### UX/UI
- [ ] Diseño responsivo completo
- [ ] Validación de formularios en tiempo real
- [ ] Manejo de estados de carga
- [ ] Notificaciones y feedback visual
- [ ] Gráficos y estadísticas

### ✅ 5. Seguridad y Validaciones
- [ ] Validación de entrada en frontend y backend
- [ ] Sanitización de datos
- [ ] Rate limiting para APIs
- [ ] Validación de tipos de archivo
- [ ] Protección contra inyecciones NoSQL

### ✅ 6. Testing y Documentación
- [ ] Tests unitarios para modelos
- [ ] Tests de integración para APIs
- [ ] Tests de componentes React
- [ ] Documentación de API con Swagger/Postman
- [ ] Guía de instalación y despliegue

### ✅ 7. Optimización y Performance
- [ ] Paginación de resultados
- [ ] Compresión de imágenes
- [ ] Lazy loading de componentes
- [ ] Caché de consultas frecuentes
- [ ] Optimización de bundle de React

## 🚀 Instalación y Configuración

### 📎 Prerrequisitos
- **Node.js v18+** (Recomendado: v18.17.0 o superior)
- **MongoDB** (Local v6.0+ o MongoDB Atlas)
- **npm v9+** o yarn
- **Git** para control de versiones
- **4GB RAM mínimo** para desarrollo

### 🛠️ Instalación Rápida

#### 1. 📎 Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/AppControl.git
cd AppControl
```

#### 2. 📦 Instalar Dependencias
```bash
# Instalar dependencias de todos los módulos
npm run install-deps

# O instalar manualmente
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

#### 3. ⚙️ Configurar Variables de Entorno

> 💡 **Nota**: Si usaste `init.ps1`, esta configuración ya está hecha automáticamente

```bash
# Copiar archivos de configuración
cp server/.env.example server/.env
cp client/.env.example client/.env

# O en Windows
copy server\.env.example server\.env
copy client\.env.example client\.env
```

**📄 Configuración `server/.env`:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/appcontrol
JWT_SECRET=AppControl_Super_Secret_Key_2024_Diabetes_Management
JWT_EXPIRE=24h
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**📄 Configuración `client/.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_UPLOAD_URL=http://localhost:5000/uploads
REACT_APP_APP_NAME=AppControl
REACT_APP_VERSION=1.0.0
```

> 🔐 **Importante**: 
> - NO subas archivos `.env` al repositorio (están en `.gitignore`)
> - Usa `.env.example` como plantilla para nuevos entornos
> - Para producción, configura variables de entorno en tu servidor

#### 4. 📊 Inicializar Base de Datos
```bash
# Crear usuario admin y datos de ejemplo
cd server
node createAdminData.js
node createAdmin20Records.js
```

#### 5. 🏃‍♂️ Ejecutar la Aplicación
```bash
# Desarrollo (ambos servidores)
npm run dev

# Solo backend
npm run server

# Solo frontend
npm run client
```

### 🌐 URLs de Acceso
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Swagger Docs**: http://localhost:5000/api/docs
- **Health Check**: http://localhost:5000/api/health

## �️ Troubleshooting

### 🚫 Problemas Comunes

#### Puerto ocupado (EADDRINUSE)
```bash
# Windows
netstat -ano | findstr :5000
taskkill /F /PID <PID>

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

#### Error de conexión a MongoDB
```bash
# Verificar que MongoDB esté ejecutándose
# Windows: Buscar "Services" -> MongoDB Server
# Linux: sudo systemctl status mongod
# Mac: brew services list | grep mongodb
```

#### Problemas de CORS
- Verificar que `CORS_ORIGIN` en `.env` coincida con la URL del frontend
- Por defecto debe ser `http://localhost:3000`

### 📊 Monitoreo y Logs
- **Backend logs**: Consola del servidor (puerto 5000)
- **Frontend logs**: DevTools del navegador (F12)
- **API Testing**: Usar Swagger UI en `/api/docs`
- **Health Check**: GET `/api/health`

## 📚 Recursos y Documentación

### 🔗 Enlaces Útiles
- **Swagger API Docs**: http://localhost:5000/api/docs
- **MongoDB Compass**: Para visualizar la base de datos
- **React DevTools**: Extensión para Chrome/Firefox
- **Tailwind CSS Docs**: https://tailwindcss.com/docs

### 📋 Estructura de Datos
- **20 registros** de glucometría (admin)
- **15 exámenes** médicos (admin) 
- **12 recetas** saludables (admin)
- **Usuario admin** preconfigurado

### 🔍 Testing
- Usar **admin@appcontrol.com** / **Admin123!** para testing completo
- Probar todas las funcionalidades desde el panel admin
- Verificar responsive design en diferentes dispositivos

## 📁 Repositorio Oficial

### 🔗 GitHub Repository
**🌟 Repositorio Principal**: https://github.com/Gatroxm/AppControl.git

```bash
# Clonar el repositorio
git clone https://github.com/Gatroxm/AppControl.git

# Agregar como remoto (si ya tienes el proyecto)
git remote add origin https://github.com/Gatroxm/AppControl.git

# Verificar remotos configurados
git remote -v
```

### 📋 Estructura del Repositorio
```
AppControl/
├── 📁 client/              # Frontend React
├── 📁 server/              # Backend Node.js/Express  
├── 📄 init.ps1            # Script de inicialización automática
├── 📄 kill-ports-and-start.ps1  # Limpiar puertos y reiniciar
├── 📄 start-clean.ps1     # Inicio limpio
├── 📄 start-simple.ps1    # Inicio simple
├── 📄 package.json        # Dependencias del proyecto
├── 📄 README.md           # Documentación completa
└── 📄 .gitignore          # Archivos ignorados por Git
```

## 🤝 Contribución

### 🌱 Cómo Contribuir
1. **Fork** el repositorio desde https://github.com/Gatroxm/AppControl
2. **Clonar** tu fork localmente
3. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
4. Hacer tus cambios y **probar** con `.\init.ps1`
5. Commit tus cambios (`git commit -m 'Add: Nueva característica increíble'`)
6. Push a tu rama (`git push origin feature/AmazingFeature`)
7. Abrir un **Pull Request** hacia el repositorio principal

### 📝 Guías de Estilo
- **Frontend**: Componentes funcionales con hooks
- **Backend**: Async/await, middlewares modulares
- **Base de Datos**: Mongoose con validaciones
- **Comentarios**: JSDoc para funciones importantes

## 📞 Contacto y Soporte

### 📬 Canales de Comunicación
- **Issues**: Para bugs y solicitudes de features
- **Discussions**: Para preguntas y sugerencias
- **Email**: appcontrol.support@example.com

### 🎆 Roadmap
- ✅ Sistema de notificaciones
- ✅ Exportación de datos a PDF/Excel
- 🔄 Modo oscuro/claro
- 🔄 Aplicación móvil (React Native)
- 🔄 Integración con dispositivos médicos

---

<div align="center">

### 🎆 **AppControl** 🎆

**Sistema integral para el control de diabetes**  
*Desarrollado con ❤️ y tecnologías modernas*

[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red)](https://github.com/Gatroxm/AppControl)
[![MERN Stack](https://img.shields.io/badge/MERN-Stack-brightgreen)](https://www.mongodb.com/mern-stack)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/Gatroxm/AppControl/blob/main/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/Gatroxm/AppControl?style=social)](https://github.com/Gatroxm/AppControl/stargazers)

**[🚀 Repositorio](https://github.com/Gatroxm/AppControl)** • **[📚 API Docs](http://localhost:5000/api/docs)** • **[🐛 Reportar Bug](https://github.com/Gatroxm/AppControl/issues)** • **[💡 Sugerir Feature](https://github.com/Gatroxm/AppControl/issues/new?template=feature_request.md)**

</div>