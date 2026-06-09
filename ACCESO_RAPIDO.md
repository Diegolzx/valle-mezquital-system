# 🎯 ACCESO RÁPIDO AL SISTEMA

## URLs del Sistema

### Frontend (Interfaz de Usuario)
**Principal:** http://localhost:3000

#### Páginas Públicas
- **Login:** http://localhost:3000/login
- **Registro:** http://localhost:3000/register

#### Delegado (requiere login)
- **Dashboard:** http://localhost:3000/delegado/dashboard
- **Habitantes:** http://localhost:3000/delegado/habitantes
- **Tareas:** http://localhost:3000/delegado/tareas
- **Multas:** http://localhost:3000/delegado/multas
- **Pagos:** http://localhost:3000/delegado/pagos
- **Escáner QR:** http://localhost:3000/delegado/scanner

#### Habitante (requiere login)
- **Dashboard:** http://localhost:3000/habitante/dashboard

---

### Backend (API)
**Base URL:** http://localhost:5000

#### Health Check
- **GET** http://localhost:5000/api/health

#### Autenticación
- **POST** http://localhost:5000/api/auth/login
- **POST** http://localhost:5000/api/auth/register
- **GET** http://localhost:5000/api/auth/profile

#### Habitantes
- **GET** http://localhost:5000/api/habitantes
- **GET** http://localhost:5000/api/habitantes/:id
- **PUT** http://localhost:5000/api/habitantes/:id/estado
- **DELETE** http://localhost:5000/api/habitantes/:id

#### Tareas
- **POST** http://localhost:5000/api/tareas
- **GET** http://localhost:5000/api/tareas
- **PUT** http://localhost:5000/api/tareas/:id/estado
- **POST** http://localhost:5000/api/tareas/asistencia
- **POST** http://localhost:5000/api/tareas/:id/generar-multas

#### Multas y Pagos
- **GET** http://localhost:5000/api/multas
- **POST** http://localhost:5000/api/multas/:id/pagar
- **GET** http://localhost:5000/api/multas/pagos/all
- **GET** http://localhost:5000/api/multas/pagos/recaudacion-mensual

#### Dashboard
- **GET** http://localhost:5000/api/dashboard/delegado
- **GET** http://localhost:5000/api/dashboard/habitante/:id
- **GET** http://localhost:5000/api/dashboard/estadisticas

---

## 🔐 Credenciales de Prueba

### Delegado Principal
```
Email: delegado@mezquital.mx
Password: Delegado123*
```

### Habitantes (precargados desde CSV)
Los habitantes importados usan password por defecto:
```
Password: Valle2025*
```

Ejemplos de correos:
- juan.perez@mezquital.mx
- maria.lopez@mezquital.mx
- carlos.ramirez@mezquital.mx

---

## 🚀 Inicio Rápido

### Método 1: Scripts Automáticos
```powershell
# Instalar
.\setup.bat

# Iniciar
.\start.bat
```

### Método 2: NPM
```powershell
# Instalar todo
npm install

# Iniciar todo
npm run dev
```

### Método 3: Manual
```powershell
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

---

## ⚙️ Configuración Requerida

### 1. SQL Server
Edita `backend/.env`:
```env
DB_SERVER=localhost
DB_DATABASE=ValleMezquital
DB_USER=sa
DB_PASSWORD=TU_PASSWORD_AQUI
```

### 2. Verificar Puertos
- **Backend:** Puerto 5000
- **Frontend:** Puerto 3000
- **WebSocket:** Puerto 5000

---

## ✅ Checklist de Verificación

Antes de iniciar, verifica:
- [ ] SQL Server está corriendo
- [ ] Credenciales en `backend/.env` son correctas
- [ ] Puertos 3000 y 5000 están disponibles
- [ ] Node.js v18+ está instalado
- [ ] Ejecutaste `npm install` en ambas carpetas

---

## 📱 Flujo de Uso

### Como Delegado:
1. Ir a http://localhost:3000/login
2. Iniciar sesión con `delegado@mezquital.mx`
3. Ver dashboard con estadísticas
4. Aprobar habitantes pendientes en `/delegado/habitantes`
5. Crear tareas en `/delegado/tareas`
6. Escanear QR en `/delegado/scanner`
7. Ver multas y pagos

### Como Habitante:
1. Ir a http://localhost:3000/register
2. Llenar formulario de registro
3. Esperar aprobación del delegado
4. Iniciar sesión en http://localhost:3000/login
5. Ver dashboard personal
6. Ver código QR único
7. Consultar tareas y multas

---

## 🎨 Características de UI

- ✅ **Tema Claro/Oscuro:** Botón en el sidebar
- ✅ **Responsive:** Funciona en móvil, tablet y PC
- ✅ **Menú Hamburguesa:** En móvil
- ✅ **Animaciones:** Transiciones suaves
- ✅ **Notificaciones:** En tiempo real vía WebSocket

---

## 🐛 Solución Rápida de Problemas

### Error: Cannot connect to SQL Server
```powershell
# Verificar servicio
services.msc
# Buscar "SQL Server" y asegurar que está "Iniciado"
```

### Error: Port 3000/5000 already in use
```powershell
# Cambiar puerto en archivos .env
# Backend: backend/.env → PORT=5001
# Frontend: frontend/.env → VITE_API_URL=http://localhost:5001
```

### Error: No camera access
```
Permitir acceso a cámara en configuración del navegador
Usar HTTPS o localhost
```

---

## 📞 Pruebas Rápidas

### Test 1: Health Check del Backend
```powershell
curl http://localhost:5000/api/health
```

### Test 2: Login del Delegado
```powershell
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"delegado@mezquital.mx\",\"password\":\"Delegado123*\"}"
```

### Test 3: Frontend Cargando
Abrir navegador en: http://localhost:3000

---

¡Sistema listo para usar! 🎉
