-- ================================================
-- SISTEMA DE GESTIÓN DE PRESUPUESTO PERSONAL
-- Motor: SQL Server
-- ================================================

IF DB_ID('presupuesto_personal') IS NOT NULL
BEGIN
    ALTER DATABASE presupuesto_personal SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE presupuesto_personal;
END;
GO

CREATE DATABASE presupuesto_personal;
GO

USE presupuesto_personal;
GO

-- ================================================
-- TABLA: usuario
-- ================================================

CREATE TABLE usuario (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    fecha_registro DATETIME DEFAULT GETDATE(),
    reset_token VARCHAR(255) NULL,
    reset_token_expiracion DATETIME NULL
);
GO

-- ================================================
-- TABLA: categoria
-- ================================================

CREATE TABLE categoria (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    descripcion VARCHAR(255),
    activo BIT NOT NULL DEFAULT 1,
    id_usuario BIGINT NOT NULL,

    CONSTRAINT fk_categoria_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id)
);
GO

-- ================================================
-- TABLA: transaccion
-- ================================================

CREATE TABLE transaccion (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    monto DECIMAL(12,2) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    descripcion VARCHAR(255),
    fecha_transaccion DATE,
    activo BIT NOT NULL DEFAULT 1,
    id_usuario BIGINT NOT NULL,
    id_categoria BIGINT NULL,

    CONSTRAINT fk_transaccion_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id),

    CONSTRAINT fk_transaccion_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categoria(id)
);
GO

-- ================================================
-- TABLA: presupuesto
-- ================================================

CREATE TABLE presupuesto (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    monto_maximo DECIMAL(12,2) NOT NULL,
    mes INT NOT NULL,
    anio INT NOT NULL,
    alerta_activada BIT NOT NULL DEFAULT 0,
    activo BIT NOT NULL DEFAULT 1,
    id_usuario BIGINT NOT NULL,
    id_categoria BIGINT NOT NULL,

    CONSTRAINT fk_presupuesto_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id),

    CONSTRAINT fk_presupuesto_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categoria(id),

    CONSTRAINT uq_presupuesto
        UNIQUE (id_usuario, id_categoria, mes, anio)
);
GO

-- ================================================
-- TABLA: alerta
-- ================================================

CREATE TABLE alerta (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    mensaje VARCHAR(255) NOT NULL,
    monto_gastado DECIMAL(12,2) NOT NULL,
    monto_limite DECIMAL(12,2) NOT NULL,
    fecha_alerta DATETIME DEFAULT GETDATE(),
    leida BIT NOT NULL DEFAULT 0,
    id_usuario BIGINT NOT NULL,
    id_presupuesto BIGINT NOT NULL,

    CONSTRAINT fk_alerta_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id),

    CONSTRAINT fk_alerta_presupuesto
        FOREIGN KEY (id_presupuesto)
        REFERENCES presupuesto(id)
);
GO

-- ================================================
-- TABLA: bitacora
-- ================================================

CREATE TABLE bitacora (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    accion VARCHAR(20) NOT NULL,
    tabla_afectada VARCHAR(50) NOT NULL,
    id_registro_afectado BIGINT NOT NULL,
    detalle VARCHAR(MAX),
    fecha_accion DATETIME DEFAULT GETDATE(),
    id_usuario BIGINT NOT NULL,

    CONSTRAINT fk_bitacora_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id)
);
GO

-- ================================================
-- TABLA: grupo
-- ================================================

CREATE TABLE grupo (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    activo BIT NOT NULL DEFAULT 1,
    id_creador BIGINT NOT NULL,
    fecha_creacion DATETIME DEFAULT GETDATE(),

    CONSTRAINT fk_grupo_creador
        FOREIGN KEY (id_creador)
        REFERENCES usuario(id)
);
GO

-- ================================================
-- TABLA: grupo_miembro
-- ================================================

CREATE TABLE grupo_miembro (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    id_grupo BIGINT NOT NULL,
    id_usuario BIGINT NOT NULL,
    rol VARCHAR(20) NOT NULL,
    activo BIT NOT NULL DEFAULT 1,
    fecha_union DATETIME DEFAULT GETDATE(),

    CONSTRAINT fk_miembro_grupo
        FOREIGN KEY (id_grupo)
        REFERENCES grupo(id),

    CONSTRAINT fk_miembro_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id)
);
GO

-- ================================================
-- DATOS DE PRUEBA
-- ================================================
-- Todas las contraseñas de prueba son: 1234
-- Hash BCrypt generado con factor de costo 10

-- Usuarios (6 usuarios)
INSERT INTO usuario (nombre, email, password, estado, fecha_registro)
VALUES
('Juan Pérez', 'juan@email.com', '$2b$10$wNALHPRS6bQctIuTta7ny.Th429u1LJs0EX.mlrZpwB6p.mxbn.FW', 'ACTIVO', GETDATE()),
('Ana García', 'ana@email.com', '$2b$10$wNALHPRS6bQctIuTta7ny.Th429u1LJs0EX.mlrZpwB6p.mxbn.FW', 'ACTIVO', GETDATE()),
('Luis Torres', 'luis@email.com', '$2b$10$wNALHPRS6bQctIuTta7ny.Th429u1LJs0EX.mlrZpwB6p.mxbn.FW', 'ACTIVO', GETDATE()),
('Carla Méndez', 'carla@email.com', '$2b$10$wNALHPRS6bQctIuTta7ny.Th429u1LJs0EX.mlrZpwB6p.mxbn.FW', 'ACTIVO', GETDATE()),
('Pedro Salas', 'pedro@email.com', '$2b$10$wNALHPRS6bQctIuTta7ny.Th429u1LJs0EX.mlrZpwB6p.mxbn.FW', 'ACTIVO', GETDATE()),
('Maria Quispe', 'maria@email.com', '$2b$10$wNALHPRS6bQctIuTta7ny.Th429u1LJs0EX.mlrZpwB6p.mxbn.FW', 'INACTIVO', GETDATE());
GO

-- Categorías de Juan (id_usuario = 1)
INSERT INTO categoria (nombre, tipo, descripcion, id_usuario, activo)
VALUES
('Sueldo', 'INGRESO', 'Ingreso mensual por trabajo', 1, 1),
('Freelance', 'INGRESO', 'Ingresos por proyectos externos', 1, 1),
('Alimentación', 'GASTO', 'Gastos en comida y mercado', 1, 1),
('Transporte', 'GASTO', 'Pasajes y combustible', 1, 1),
('Entretenimiento', 'GASTO', 'Cine, salidas, streaming', 1, 1),
('Alquiler', 'GASTO', 'Pago mensual de vivienda', 1, 1);
GO

-- Categorías de Ana (id_usuario = 2)
INSERT INTO categoria (nombre, tipo, descripcion, id_usuario, activo)
VALUES
('Salario', 'INGRESO', 'Sueldo mensual', 2, 1),
('Alimentación', 'GASTO', 'Gastos de comida', 2, 1),
('Salud', 'GASTO', 'Medicamentos y consultas', 2, 1),
('Educación', 'GASTO', 'Cursos y libros', 2, 1);
GO

-- Categorías de Luis (id_usuario = 3)
INSERT INTO categoria (nombre, tipo, descripcion, id_usuario, activo)
VALUES
('Sueldo', 'INGRESO', 'Pago mensual fijo', 3, 1),
('Alimentación', 'GASTO', 'Comida diaria', 3, 1),
('Transporte', 'GASTO', 'Movilidad', 3, 1);
GO

-- Categorías de Carla (id_usuario = 4)
INSERT INTO categoria (nombre, tipo, descripcion, id_usuario, activo)
VALUES
('Sueldo', 'INGRESO', 'Ingreso laboral', 4, 1),
('Alimentación', 'GASTO', 'Mercado y comida', 4, 1),
('Entretenimiento', 'GASTO', 'Ocio y salidas', 4, 1);
GO

-- Categorías de Pedro (id_usuario = 5)
INSERT INTO categoria (nombre, tipo, descripcion, id_usuario, activo)
VALUES
('Sueldo', 'INGRESO', 'Sueldo fijo mensual', 5, 1),
('Alquiler', 'GASTO', 'Renta departamento', 5, 1);
GO

-- Transacciones de Juan (id_usuario = 1)
INSERT INTO transaccion
(monto, tipo, descripcion, fecha_transaccion, id_usuario, id_categoria, activo)
VALUES
(3500.00, 'INGRESO', 'Sueldo Junio', '2025-06-01', 1, 1, 1),
(800.00, 'INGRESO', 'Proyecto web freelance', '2025-06-05', 1, 2, 1),
(250.00, 'GASTO', 'Supermercado semana 1', '2025-06-03', 1, 3, 1),
(280.00, 'GASTO', 'Supermercado semana 2', '2025-06-10', 1, 3, 1),
(45.00, 'GASTO', 'Pasajes semanales', '2025-06-07', 1, 4, 1),
(120.00, 'GASTO', 'Cena con amigos', '2025-06-08', 1, 5, 1),
(1200.00, 'GASTO', 'Alquiler Junio', '2025-06-01', 1, 6, 1),
(3500.00, 'INGRESO', 'Sueldo Mayo', '2025-05-01', 1, 1, 1),
(300.00, 'GASTO', 'Supermercado Mayo', '2025-05-10', 1, 3, 1),
(60.00, 'GASTO', 'Netflix y Spotify', '2025-05-15', 1, 5, 1);
GO

-- Transacciones de Ana (id_usuario = 2)
INSERT INTO transaccion
(monto, tipo, descripcion, fecha_transaccion, id_usuario, id_categoria, activo)
VALUES
(2800.00, 'INGRESO', 'Salario Junio', '2025-06-01', 2, 7, 1),
(180.00, 'GASTO', 'Compras supermercado', '2025-06-05', 2, 8, 1),
(95.00, 'GASTO', 'Consulta médica', '2025-06-12', 2, 9, 1),
(150.00, 'GASTO', 'Curso de inglés', '2025-06-15', 2, 10, 1),
(2800.00, 'INGRESO', 'Salario Mayo', '2025-05-01', 2, 7, 1);
GO

-- Transacciones de Luis (id_usuario = 3)
INSERT INTO transaccion
(monto, tipo, descripcion, fecha_transaccion, id_usuario, id_categoria, activo)
VALUES
(2500.00, 'INGRESO', 'Sueldo Junio', '2025-06-01', 3, 11, 1),
(220.00, 'GASTO', 'Mercado mensual', '2025-06-04', 3, 12, 1),
(80.00, 'GASTO', 'Pasajes', '2025-06-06', 3, 13, 1);
GO

-- Transacciones de Carla (id_usuario = 4)
INSERT INTO transaccion
(monto, tipo, descripcion, fecha_transaccion, id_usuario, id_categoria, activo)
VALUES
(3000.00, 'INGRESO', 'Sueldo Junio', '2025-06-01', 4, 14, 1),
(310.00, 'GASTO', 'Compras del mes', '2025-06-09', 4, 15, 1),
(140.00, 'GASTO', 'Cine y salidas', '2025-06-14', 4, 16, 1);
GO

-- Transacciones de Pedro (id_usuario = 5)
INSERT INTO transaccion
(monto, tipo, descripcion, fecha_transaccion, id_usuario, id_categoria, activo)
VALUES
(2200.00, 'INGRESO', 'Sueldo Junio', '2025-06-01', 5, 17, 1),
(900.00, 'GASTO', 'Renta Junio', '2025-06-01', 5, 18, 1);
GO

-- Presupuestos de Juan
INSERT INTO presupuesto
(monto_maximo, mes, anio, alerta_activada, id_usuario, id_categoria, activo)
VALUES
(500.00, 6, 2025, 0, 1, 3, 1),
(100.00, 6, 2025, 1, 1, 4, 1),
(150.00, 6, 2025, 1, 1, 5, 1),
(1200.00, 6, 2025, 0, 1, 6, 1);
GO

-- Presupuestos de Ana
INSERT INTO presupuesto
(monto_maximo, mes, anio, alerta_activada, id_usuario, id_categoria, activo)
VALUES
(200.00, 6, 2025, 0, 2, 8, 1),
(100.00, 6, 2025, 0, 2, 9, 1),
(200.00, 6, 2025, 1, 2, 10, 1);
GO

-- Presupuestos de Luis
INSERT INTO presupuesto
(monto_maximo, mes, anio, alerta_activada, id_usuario, id_categoria, activo)
VALUES
(200.00, 6, 2025, 1, 3, 12, 1),
(60.00, 6, 2025, 1, 3, 13, 1);
GO

-- Presupuestos de Carla
INSERT INTO presupuesto
(monto_maximo, mes, anio, alerta_activada, id_usuario, id_categoria, activo)
VALUES
(280.00, 6, 2025, 1, 4, 15, 1),
(100.00, 6, 2025, 1, 4, 16, 1);
GO

-- Alertas (vinculadas a los presupuestos marcados con alerta_activada = 1)
INSERT INTO alerta
(mensaje, monto_gastado, monto_limite, leida, fecha_alerta, id_usuario, id_presupuesto)
VALUES
('Superaste el presupuesto de Transporte', 45.00, 100.00, 0, GETDATE(), 1, 2),
('Superaste el presupuesto de Entretenimiento', 120.00, 150.00, 0, GETDATE(), 1, 3),
('Superaste el presupuesto de Educación', 150.00, 200.00, 1, GETDATE(), 2, 7),
('Superaste el presupuesto de Alimentación', 220.00, 200.00, 0, GETDATE(), 3, 8),
('Superaste el presupuesto de Transporte', 80.00, 60.00, 0, GETDATE(), 3, 9),
('Superaste el presupuesto de Alimentación', 310.00, 280.00, 0, GETDATE(), 4, 10),
('Superaste el presupuesto de Entretenimiento', 140.00, 100.00, 1, GETDATE(), 4, 11);
GO

-- Bitácora
INSERT INTO bitacora
(accion, tabla_afectada, id_registro_afectado, detalle, id_usuario, fecha_accion)
VALUES
('CREAR', 'transaccion', 1, 'Se registró una transacción de INGRESO por S/.3500.00', 1, GETDATE()),
('CREAR', 'transaccion', 3, 'Se registró una transacción de GASTO por S/.250.00', 1, GETDATE()),
('EDITAR', 'presupuesto', 1, 'Se actualizó el presupuesto de Alimentación', 1, GETDATE()),
('CREAR', 'categoria', 9, 'Se creó la categoría Salud', 2, GETDATE()),
('ELIMINAR', 'transaccion', 6, 'Se eliminó una transacción duplicada', 2, GETDATE()),
('CREAR', 'transaccion', 11, 'Se registró una transacción de INGRESO por S/.2500.00', 3, GETDATE()),
('CREAR', 'transaccion', 14, 'Se registró una transacción de INGRESO por S/.3000.00', 4, GETDATE());
GO

-- Grupos compartidos
INSERT INTO grupo (nombre, descripcion, id_creador, fecha_creacion, activo)
VALUES
('Familia Pérez', 'Presupuesto compartido del hogar', 1, GETDATE(), 1),
('Roomies Departamento', 'Gastos compartidos del departamento', 4, GETDATE(), 1);
GO

-- Miembros de grupo
-- Grupo 1 "Familia Pérez": Juan (creador/ADMIN) + Ana (MIEMBRO)
-- Grupo 2 "Roomies Departamento": Carla (creadora/ADMIN) + Luis (MIEMBRO) + Pedro (MIEMBRO)
INSERT INTO grupo_miembro (id_grupo, id_usuario, rol, fecha_union, activo)
VALUES
(1, 1, 'ADMIN', GETDATE(), 1),
(1, 2, 'MIEMBRO', GETDATE(), 1),
(2, 4, 'ADMIN', GETDATE(), 1),
(2, 3, 'MIEMBRO', GETDATE(), 1),
(2, 5, 'MIEMBRO', GETDATE(), 1);
GO

-- ================================================
-- CONSULTAS DE VERIFICACIÓN
-- ================================================

SELECT * FROM usuario;
SELECT * FROM categoria;
SELECT * FROM transaccion;
SELECT * FROM presupuesto;
SELECT * FROM alerta;
SELECT * FROM bitacora;
SELECT * FROM grupo;
SELECT * FROM grupo_miembro;
GO