# ✅ LISTA DE VERIFICACIÓN Y TESTING

## Sistema Gestor Administrativo Comunitario del Valle Mezquital

---

## 📋 CHECKLIST DE FUNCIONALIDADES

### 🔐 Autenticación
- [ ] Login con delegado funciona
- [ ] Registro de habitante funciona
- [ ] Validación de campos en registro
- [ ] Redirección según rol
- [ ] Logout funciona
- [ ] Token JWT se guarda en localStorage
- [ ] Sesión persiste al recargar página

### 👥 Gestión de Habitantes (Delegado)
- [ ] Ver lista completa de habitantes
- [ ] Filtrar por estado (activo, pendiente, rechazado)
- [ ] Buscar por nombre, correo o CURP
- [ ] Aprobar habitante pendiente
- [ ] Rechazar habitante pendiente
- [ ] Ver detalles completos de habitante
- [ ] Descargar INE en PDF
- [ ] Eliminar habitante
- [ ] Actualización en tiempo real al aprobar

### 📋 Gestión de Tareas (Delegado)
- [ ] Crear nueva tarea
- [ ] Validación de formulario de tarea
- [ ] Ver todas las tareas
- [ ] Cambiar estado: Programada → En Curso
- [ ] Cambiar estado: En Curso → Finalizada
- [ ] Generar multas automáticas ($200)
- [ ] Ver tareas por manzana
- [ ] Eliminar tarea
- [ ] Actualización en tiempo real

### 📱 Sistema QR
- [ ] QR se genera automáticamente en dashboard habitante
- [ ] QR contiene CURP del habitante
- [ ] Escáner de cámara se activa
- [ ] Escáner detecta código QR
- [ ] Usuario se identifica correctamente
- [ ] Mostrar datos del usuario escaneado
- [ ] Seleccionar tarea para registro
- [ ] Registrar asistencia exitosamente
- [ ] Evitar duplicados de asistencia

### 💰 Multas y Pagos
- [ ] Multas se generan automáticamente
- [ ] Monto de $200 por ausencia
- [ ] Ver lista de multas
- [ ] Filtrar por estado (pendiente, pagada)
- [ ] Ver total de deuda
- [ ] Habitante puede pagar multa
- [ ] Registro de pago se guarda
- [ ] Ver historial de pagos
- [ ] Total recaudado se calcula correctamente

### 📊 Dashboards
**Delegado:**
- [ ] Muestra total de habitantes
- [ ] Muestra tareas activas
- [ ] Muestra recaudación del mes
- [ ] Muestra habitantes pendientes
- [ ] Muestra multas pendientes
- [ ] Muestra total de deudores
- [ ] Gráfica de recaudación abre al hacer clic
- [ ] Gráfica muestra datos desde Julio
- [ ] Alerta de habitantes pendientes aparece

**Habitante:**
- [ ] Muestra datos personales
- [ ] Muestra código QR único
- [ ] Muestra tareas programadas
- [ ] Muestra tareas en curso
- [ ] Muestra multas pendientes
- [ ] Muestra deuda total
- [ ] Muestra últimas tareas

### 📈 Gráficas y Reportes
- [ ] Gráfica de recaudación carga
- [ ] Datos desde Julio hasta mes actual
- [ ] Tooltips funcionan
- [ ] Responsive en móvil
- [ ] Modal se cierra correctamente

### 🎨 Interfaz de Usuario
- [ ] Diseño se ve moderno
- [ ] Dark mode funciona
- [ ] Light mode funciona
- [ ] Tema se guarda en localStorage
- [ ] Responsive en móvil
- [ ] Responsive en tablet
- [ ] Responsive en desktop
- [ ] Menú hamburguesa en móvil
- [ ] Sidebar funciona
- [ ] Animaciones son suaves
- [ ] Iconos cargan correctamente
- [ ] Colores son consistentes

### 🔄 Tiempo Real (WebSockets)
- [ ] Socket se conecta al iniciar sesión
- [ ] Nuevo registro actualiza lista
- [ ] Cambio de estado actualiza interfaz
- [ ] Asistencia registrada actualiza
- [ ] Pago realizado actualiza
- [ ] Desconexión se maneja correctamente

### 💾 Base de Datos
- [ ] Base de datos se crea automáticamente
- [ ] Tablas se crean correctamente
- [ ] Usuario delegado se crea
- [ ] CSV se importa correctamente
- [ ] Datos de ejemplo se cargan
- [ ] Pagos desde Julio se crean
- [ ] Relaciones entre tablas funcionan

---

## 🧪 CASOS DE PRUEBA

### Test 1: Flujo Completo del Delegado
```
1. Iniciar sesión como delegado
2. Ver dashboard con estadísticas
3. Ir a Habitantes
4. Aprobar un habitante pendiente
5. Ir a Tareas
6. Crear nueva tarea
7. Cambiar estado a "En Curso"
8. Ir a Escáner QR
9. Escanear código de habitante
10. Registrar asistencia
11. Finalizar tarea
12. Generar multas
13. Ir a Multas
14. Ver multas generadas
15. Ir a Pagos
16. Ver historial de pagos
17. Hacer clic en "Recaudación del Mes"
18. Ver gráfica
19. Cerrar sesión
```

### Test 2: Flujo Completo del Habitante
```
1. Ir a Registro
2. Llenar formulario completo
3. Subir PDF de INE
4. Enviar registro
5. Ver mensaje de "pendiente de aprobación"
6. (Delegado aprueba)
7. Iniciar sesión como habitante
8. Ver dashboard personal
9. Ver código QR
10. Ver tareas asignadas
11. Ver multas (si hay)
12. Ver deuda total
13. Cambiar a modo oscuro
14. Verificar responsive en móvil
15. Cerrar sesión
```

### Test 3: Sistema de QR Completo
```
1. Login como habitante
2. Abrir dashboard
3. Ver y copiar CURP del QR
4. Cerrar sesión
5. Login como delegado
6. Crear tarea nueva
7. Cambiar estado a "En Curso"
8. Ir a Escáner QR
9. Activar cámara
10. Escanear QR (o simular con CURP)
11. Verificar datos del habitante
12. Seleccionar tarea
13. Registrar asistencia
14. Verificar mensaje de éxito
15. Intentar registrar de nuevo (debe fallar)
```

### Test 4: Multas Automáticas
```
1. Login como delegado
2. Crear tarea para "todas las manzanas"
3. Cambiar estado a "En Curso"
4. Registrar asistencia de solo 2 habitantes
5. Finalizar tarea
6. Generar multas
7. Ir a Multas
8. Verificar que los ausentes tienen multa de $200
9. Verificar que los asistentes NO tienen multa
10. Ver total de deuda
```

### Test 5: Gráfica de Recaudación
```
1. Login como delegado
2. Ver dashboard
3. Hacer clic en "Recaudación del Mes"
4. Verificar que se abre modal
5. Verificar que gráfica carga
6. Verificar meses desde Julio
7. Verificar total recaudado
8. Verificar tooltips al pasar mouse
9. Cerrar modal
```

### Test 6: WebSockets en Tiempo Real
```
1. Abrir 2 navegadores
2. Login como delegado en ambos
3. En navegador 1: Ir a Habitantes
4. En navegador 2: Aprobar un habitante
5. Verificar que navegador 1 se actualiza automáticamente
6. En navegador 1: Ir a Tareas
7. En navegador 2: Crear tarea
8. Verificar actualización en tiempo real
```

### Test 7: Dark/Light Mode
```
1. Login (cualquier rol)
2. Verificar modo inicial (light por defecto)
3. Hacer clic en botón de tema
4. Verificar cambio a modo oscuro
5. Navegar por diferentes páginas
6. Verificar consistencia del tema
7. Recargar página
8. Verificar que tema persiste
```

### Test 8: Responsive Design
```
1. Abrir en navegador
2. Reducir ventana a tamaño móvil (375px)
3. Verificar menú hamburguesa aparece
4. Abrir menú lateral
5. Navegar por todas las páginas
6. Verificar que todo se ve bien
7. Aumentar a tamaño tablet (768px)
8. Verificar adaptación
9. Aumentar a desktop (1920px)
10. Verificar diseño completo
```

---

## 🔍 VALIDACIONES IMPORTANTES

### Base de Datos
```sql
-- Verificar que existen las tablas
SELECT name FROM sys.tables WHERE name IN ('Usuarios', 'Tareas', 'Asistencias', 'Multas', 'Pagos')

-- Verificar usuario delegado
SELECT * FROM Usuarios WHERE correo = 'delegado@mezquital.mx'

-- Verificar habitantes importados
SELECT COUNT(*) as total FROM Usuarios WHERE rol = 'habitante'

-- Verificar datos de ejemplo
SELECT COUNT(*) as total FROM Pagos
```

### Backend
```powershell
# Health check
curl http://localhost:5000/api/health

# Listar habitantes (requiere token)
curl http://localhost:5000/api/habitantes -H "Authorization: Bearer TOKEN_AQUI"
```

### Frontend
```javascript
// Verificar localStorage
localStorage.getItem('token')
localStorage.getItem('theme')

// Verificar conexión WebSocket
// En consola del navegador
socket.connected
```

---

## ⚠️ PROBLEMAS COMUNES Y SOLUCIONES

### ❌ No carga la página
**Solución:**
```powershell
# Verificar que ambos servidores estén corriendo
# Backend debe estar en puerto 5000
# Frontend debe estar en puerto 3000
```

### ❌ Error de conexión a BD
**Solución:**
```
1. Abrir SQL Server Management Studio
2. Verificar que servidor está activo
3. Verificar credenciales en backend/.env
4. Reiniciar backend
```

### ❌ QR no escanea
**Solución:**
```
1. Permitir acceso a cámara en navegador
2. Usar HTTPS o localhost
3. Verificar que cámara funciona
4. Probar con otro navegador
```

### ❌ WebSocket no conecta
**Solución:**
```
1. Verificar que backend está corriendo
2. Verificar URL en frontend/.env
3. Limpiar caché del navegador
4. Revisar consola por errores
```

### ❌ Gráfica no muestra datos
**Solución:**
```
1. Verificar que hay pagos en BD
2. Reiniciar backend
3. Verificar endpoint /api/multas/pagos/recaudacion-mensual
4. Revisar consola del navegador
```

---

## ✅ CHECKLIST FINAL ANTES DE ENTREGAR

- [ ] Backend arranca sin errores
- [ ] Frontend arranca sin errores
- [ ] Base de datos se crea automáticamente
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Dashboard delegado carga
- [ ] Dashboard habitante carga
- [ ] QR se genera
- [ ] Escáner funciona
- [ ] Multas se generan
- [ ] Gráfica se muestra
- [ ] Dark mode funciona
- [ ] Responsive funciona
- [ ] WebSockets funcionan
- [ ] Documentación está completa
- [ ] Scripts .bat funcionan
- [ ] No hay errores en consola
- [ ] No hay warnings críticos
- [ ] Código está organizado
- [ ] Archivos .env están configurados

---

## 📝 NOTAS DE TESTING

### Datos de Prueba Recomendados

**Nuevo Habitante:**
```
Nombre: Test Usuario
Teléfono: 7771111111
Email: test@mezquital.mx
CURP: TEST900101HMCRLS00
Manzana: 1
Password: Test1234*
```

**Nueva Tarea:**
```
Título: Limpieza de Prueba
Descripción: Tarea de testing
Fecha: (Fecha actual + 1 día)
Hora: 10:00
Manzanas: todas
```

---

## 🎯 RESULTADO ESPERADO

Al completar todas las pruebas:
- ✅ 100% de funcionalidades operativas
- ✅ Sin errores críticos
- ✅ UI consistente en todos los dispositivos
- ✅ Tiempo real funcionando
- ✅ Base de datos operativa
- ✅ Documentación clara

---

**¡Sistema completamente funcional y testeado! 🚀**
