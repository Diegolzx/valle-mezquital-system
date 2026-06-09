# 🚀 INSTRUCCIONES DE EJECUCIÓN

## Sistema Gestor Administrativo Comunitario del Valle Mezquital

---

## ⚡ INICIO RÁPIDO

### 1️⃣ Instalar Dependencias

Desde la raíz del proyecto:

```powershell
npm install
cd backend
npm install
cd ../frontend
npm install
cd ..
```

### 2️⃣ Configurar SQL Server

1. **Asegúrate de que SQL Server esté corriendo**
2. **Edita el archivo `backend/.env`** con tus credenciales:

```env
DB_SERVER=localhost
DB_DATABASE=ValleMezquital
DB_USER=sa
DB_PASSWORD=TuPasswordDeSQLServer
```

3. La base de datos se creará automáticamente al iniciar el backend

### 3️⃣ Ejecutar el Sistema

**Opción A - Todo junto (Recomendado):**
```powershell
npm run dev
```

**Opción B - Por separado:**

Terminal 1 (Backend):
```powershell
cd backend
npm run dev
```

Terminal 2 (Frontend):
```powershell
cd frontend
npm run dev
```

### 4️⃣ Acceder al Sistema

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

---

## 🔐 CREDENCIALES DE ACCESO

### Delegado (Admin)
- **Email:** delegado@mezquital.mx
- **Password:** Delegado123*

### Habitantes
Los habitantes deben registrarse. El delegado debe aprobarlos.

---

## 📋 FUNCIONALIDADES IMPLEMENTADAS

### ✅ Delegado
- Dashboard con métricas en tiempo real
- Gráfica de recaudación (Julio - Presente)
- Gestión completa de habitantes (CRUD + Aprobar/Rechazar)
- Gestión de tareas (Crear, Programar, Cambiar estado)
- Escáner QR para registro de asistencia
- Generación automática de multas ($200 por ausencia)
- Vista de multas y deudores
- Registro de pagos
- Actualización en tiempo real (WebSockets)

### ✅ Habitante
- Registro con validación
- Dashboard personal
- Código QR único generado con CURP
- Ver tareas asignadas
- Ver multas pendientes
- Ver deuda total
- Actualización en tiempo real

### ✅ Características Técnicas
- **Responsive Design:** PC, Tablet, Mobile
- **Dark/Light Mode:** Cambio de tema
- **WebSockets:** Socket.io para actualizaciones en vivo
- **QR System:** Generación y escaneo de códigos QR
- **Autenticación:** JWT con roles
- **Base de Datos:** SQL Server con script automático
- **CSV Import:** Importación automática de habitantes
- **Gráficas:** Recharts para visualización de datos

---

## 🛠️ SOLUCIÓN DE PROBLEMAS

### ❌ Error de conexión a SQL Server

1. Verifica que SQL Server esté corriendo
2. Confirma las credenciales en `backend/.env`
3. Habilita TCP/IP en **SQL Server Configuration Manager**
4. Reinicia el servicio de SQL Server

### ❌ Error al escanear QR

1. Permite acceso a la cámara en tu navegador
2. Usa **HTTPS** o **localhost**
3. Verifica permisos del navegador

### ❌ Puerto ya en uso

Cambia los puertos en los archivos `.env`:

Backend (`backend/.env`):
```env
PORT=5001
```

Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5001
```

---

## 📂 ESTRUCTURA DEL PROYECTO

```
valle-mezquital-system/
├── backend/                    # Servidor Node.js + Express
│   ├── config/                # Configuración de BD
│   ├── controllers/           # Lógica de negocio
│   ├── routes/                # Rutas API
│   ├── middleware/            # Autenticación y validación
│   ├── scripts/               # Scripts de inicialización
│   └── server.js              # Servidor principal
│
├── frontend/                  # Aplicación React
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/            # Páginas principales
│   │   ├── context/          # Contextos (Auth, Theme, Socket)
│   │   └── App.jsx           # Componente raíz
│   └── index.html
│
├── database/                  # Scripts SQL y datos
│   ├── init_db.sql           # Script de creación de BD
│   └── habitantes.csv        # Datos de habitantes
│
└── README.md                  # Este archivo
```

---

## 🎯 ENDPOINTS PRINCIPALES

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar habitante
- `GET /api/auth/profile` - Obtener perfil

### Habitantes (Delegado)
- `GET /api/habitantes` - Listar habitantes
- `GET /api/habitantes/:id` - Ver habitante
- `PUT /api/habitantes/:id/estado` - Aprobar/Rechazar
- `DELETE /api/habitantes/:id` - Eliminar

### Tareas (Delegado)
- `POST /api/tareas` - Crear tarea
- `GET /api/tareas` - Listar tareas
- `PUT /api/tareas/:id/estado` - Cambiar estado
- `POST /api/tareas/asistencia` - Registrar asistencia
- `POST /api/tareas/:id/generar-multas` - Generar multas

### Multas y Pagos
- `GET /api/multas` - Listar multas
- `POST /api/multas/:id/pagar` - Pagar multa
- `GET /api/multas/pagos/all` - Ver todos los pagos
- `GET /api/multas/pagos/recaudacion-mensual` - Gráfica

### Dashboard
- `GET /api/dashboard/delegado` - Dashboard delegado
- `GET /api/dashboard/habitante/:id` - Dashboard habitante
- `GET /api/dashboard/estadisticas` - Estadísticas generales

---

## 📊 BASE DE DATOS

### Tablas Creadas Automáticamente

1. **Usuarios** - Delegado y habitantes
2. **Tareas** - Tareas comunitarias
3. **Asistencias** - Registro de asistencia a tareas
4. **Multas** - Multas generadas
5. **Pagos** - Registro de pagos

### Datos Precargados

- Usuario Delegado
- 10 Habitantes desde CSV
- Tareas de ejemplo
- Pagos desde Julio (para gráfica)

---

## 🎨 TECNOLOGÍAS USADAS

### Frontend
- React 18
- React Router v6
- TailwindCSS
- Lucide Icons
- QRCode.react
- Html5-qrcode (escáner)
- Recharts (gráficas)
- Socket.io-client
- Axios

### Backend
- Node.js
- Express.js
- SQL Server (mssql)
- Socket.io
- JWT
- bcryptjs
- Multer
- csv-parser

---

## 📝 NOTAS IMPORTANTES

1. **SQL Server debe estar instalado y corriendo**
2. **Actualiza las credenciales en `backend/.env`**
3. **El CSV se importa automáticamente al iniciar**
4. **WebSockets funcionan en localhost sin problemas**
5. **Para producción, actualiza las URLs en los archivos .env**

---

## 💡 TIPS

- Los habitantes registrados quedan en estado **"pendiente"** hasta que el delegado los apruebe
- Las multas se generan automáticamente al finalizar una tarea
- El QR del habitante contiene su CURP
- La gráfica muestra datos desde Julio del año actual
- Dark mode se guarda en localStorage

---

## 📧 SOPORTE

Si tienes problemas, verifica:
1. ✅ SQL Server corriendo
2. ✅ Credenciales correctas en .env
3. ✅ Node.js v18 o superior
4. ✅ Puertos 3000 y 5000 disponibles

---

¡Todo listo! 🎉 El sistema está completamente funcional.
