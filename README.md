<div align=""center"">

# 🏘️ Sistema Gestor Administrativo Comunitario del Valle del Mezquital

![Versión](https://img.shields.io/badge/Versión-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg?logo=nodedotjs)
![SQL Server](https://img.shields.io/badge/SQL_Server-Local-CC2927.svg?logo=microsoftsqlserver)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?logo=tailwind-css)

Un sistema integral y moderno desarrollado para la gestión administrativa de comunidades, automatizando tareas, pago de multas, registro de asistencias mediante QR y visualización de datos en tiempo real.

[Características](#-funcionalidades-principales) • [Tecnologías](#-tecnologías-utilizadas) • [Instalación](#%EF%B8%8F-instalación-local) • [Despliegue](#-despliegue)

</div>

---

## 🌟 Sobre el Proyecto

Este sistema nace con la intención de modernizar la administración de comunidades en el **Valle del Mezquital**, facilitando la comunicación entre el **Delegado** (Administrador) y los **Habitantes**. Permite un control estricto de cooperaciones, faenas, asistencias a asambleas, y generación automática de multas, sustituyendo las anticuadas libretas de registro por una plataforma web accesible desde cualquier dispositivo.

---

## 📱 Funcionalidades Principales

### 👑 Módulo del Delegado (Administrador)
- **Gestión de Habitantes:** Aprobación de registros, altas, bajas y control de documentos (PDF del INE).
- **Asistencias por QR:** Escáner integrado con la cámara del dispositivo para registrar asistencias a juntas o faenas al instante.
- **Multas Automatizadas:** Sistema inteligente que detecta ausencias y genera automáticamente multas (ej.  MXN) asociadas al perfil del habitante.
- **Gráficas y Métricas:** Dashboard con indicadores en tiempo real y gráficas interactivas sobre cobros y deudores.
- **Organización de Tareas:** Creación y seguimiento de faenas, asambleas y proyectos de la comunidad.

### 👤 Módulo del Habitante
- **Código QR Personal:** Cada habitante tiene un código QR único para registro de asistencia.
- **Portal de Pagos:** Visualización de multas pendientes y opción para registrar pagos.
- **Dashboard Personal:** Resumen de tareas asignadas, estatus y su historial de participación.
- **Registro Seguro:** Proceso de registro con validación antes de ingresar al padrón de la comunidad.

---

## 🛠️ Tecnologías Utilizadas

| Frontend | Backend | Base de Datos & Extras |
|----------|---------|------------------------|
| **React 18** (Vite) | **Node.js** | **SQL Server** (mssql) |
| **TailwindCSS** (Estilos) | **Express.js** | **Socket.io** (Tiempo real) |
| **React Router v6** | **JWT** (Autenticación) | **Bcrypt.js** (Cifrado) |
| **Lucide Icons** | **Multer** (Subida de archivos) | **Recharts** (Gráficas) |

---

## ⚙️ Instalación Local

### 1. Clonar el repositorio
`ash
git clone git@github.com:Diegolzx/valle-mezquital-system.git
cd valle-mezquital-system
`

### 2. Configurar la Base de Datos
1. Abre tu instancia local de **SQL Server**.
2. Crea una base de datos o permite que el sistema la inicialice.

### 3. Configuración del Backend (.env en la carpeta backend)
`nv
PORT=5000
DB_SERVER=localhost
DB_DATABASE=ValleMezquital
DB_USER=sa
DB_PASSWORD=TuContraseñaLocal
JWT_SECRET=tu_secreto_seguro
`
*Instala dependencias y corre el servidor:*
`ash
cd backend
npm install
npm run dev
`

### 4. Configuración del Frontend (.env en la carpeta frontend)
`nv
VITE_API_URL=http://localhost:5000
VITE_WS_URL=http://localhost:5000
`
*Instala dependencias y arranca:*
`ash
cd frontend
npm install
npm run dev
`

---

## ☁️ Despliegue en Producción

### 🌐 Frontend (Cloudflare Pages / Vercel)
El frontend web (React) está optimizado para su despliegue en entornos *Serverless* como **Cloudflare Pages**.
1. Enlaza tu repositorio de GitHub con Cloudflare.
2. Selecciona la carpeta \rontend/\.
3. Comando de build: \
pm run build\.
4. Directorio de salida: \dist\.
5. Asegúrate de añadir las variables de entorno (\VITE_API_URL\).

### 🖥️ Backend (Render / Railway / VPS)
Para el backend (Express + SQL Server), se recomienda desplegar en una **VPS** o en plataformas compatibles con Docker/Node, permitiendo conexión a tu instancia principal de SQL Server.

---

<div align=""center"">
  <b>Desarrollado con ❤️ para las comunidades del Valle del Mezquital</b>
</div>
