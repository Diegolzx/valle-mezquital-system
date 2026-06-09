-- Script de inicialización de base de datos Valle Mezquital
-- Este script se ejecuta automáticamente desde Node.js

USE master;
GO

-- Crear base de datos si no existe
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ValleMezquital')
BEGIN
    CREATE DATABASE ValleMezquital;
    PRINT 'Base de datos ValleMezquital creada';
END
GO

USE ValleMezquital;
GO

-- Tabla de Usuarios (Delegado y Habitantes)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Usuarios' AND xtype='U')
BEGIN
    CREATE TABLE Usuarios (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre_completo NVARCHAR(200) NOT NULL,
        telefono NVARCHAR(20),
        correo NVARCHAR(100) UNIQUE NOT NULL,
        curp NVARCHAR(18) UNIQUE,
        manzana NVARCHAR(10),
        password NVARCHAR(255) NOT NULL,
        ine_pdf NVARCHAR(MAX),
        rol NVARCHAR(20) DEFAULT 'habitante',
        estado NVARCHAR(20) DEFAULT 'pendiente',
        fecha_registro DATETIME DEFAULT GETDATE()
    );
    PRINT 'Tabla Usuarios creada';
END
GO

-- Tabla de Tareas
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tareas' AND xtype='U')
BEGIN
    CREATE TABLE Tareas (
        id INT IDENTITY(1,1) PRIMARY KEY,
        titulo NVARCHAR(200) NOT NULL,
        descripcion NVARCHAR(MAX),
        fecha DATE NOT NULL,
        hora TIME NOT NULL,
        manzanas NVARCHAR(50),
        estado NVARCHAR(20) DEFAULT 'programada',
        creador_id INT,
        fecha_creacion DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (creador_id) REFERENCES Usuarios(id)
    );
    PRINT 'Tabla Tareas creada';
END
GO

-- Tabla de Asistencias
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Asistencias' AND xtype='U')
BEGIN
    CREATE TABLE Asistencias (
        id INT IDENTITY(1,1) PRIMARY KEY,
        tarea_id INT NOT NULL,
        usuario_id INT NOT NULL,
        fecha_registro DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (tarea_id) REFERENCES Tareas(id) ON DELETE CASCADE,
        FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE
    );
    PRINT 'Tabla Asistencias creada';
END
GO

-- Tabla de Multas
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Multas' AND xtype='U')
BEGIN
    CREATE TABLE Multas (
        id INT IDENTITY(1,1) PRIMARY KEY,
        usuario_id INT NOT NULL,
        tarea_id INT,
        monto DECIMAL(10,2) NOT NULL,
        estado NVARCHAR(20) DEFAULT 'pendiente',
        fecha_creacion DATETIME DEFAULT GETDATE(),
        fecha_pago DATETIME,
        FOREIGN KEY (usuario_id) REFERENCES Usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (tarea_id) REFERENCES Tareas(id)
    );
    PRINT 'Tabla Multas creada';
END
GO

-- Tabla de Pagos
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Pagos' AND xtype='U')
BEGIN
    CREATE TABLE Pagos (
        id INT IDENTITY(1,1) PRIMARY KEY,
        multa_id INT NOT NULL,
        usuario_id INT NOT NULL,
        monto DECIMAL(10,2) NOT NULL,
        metodo_pago NVARCHAR(50) DEFAULT 'efectivo',
        fecha_pago DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (multa_id) REFERENCES Multas(id),
        FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
    );
    PRINT 'Tabla Pagos creada';
END
GO

PRINT 'Script de inicialización completado';
