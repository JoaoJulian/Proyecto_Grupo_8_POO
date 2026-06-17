-- ================================================
-- ELIMINAR Y CREAR BASE DE DATOS
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
    fecha_registro DATETIME DEFAULT GETDATE()
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
    id_usuario BIGINT NOT NULL,

    CONSTRAINT fk_categoria_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id)
        ON DELETE CASCADE
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
    id_usuario BIGINT NOT NULL,
    id_categoria BIGINT NULL,

    CONSTRAINT fk_transaccion_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_transaccion_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categoria(id)
        ON DELETE SET NULL
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
    alerta_activada BIT DEFAULT 0,
    id_usuario BIGINT NOT NULL,
    id_categoria BIGINT NOT NULL,

    CONSTRAINT fk_presupuesto_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_presupuesto_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categoria(id)
        ON DELETE CASCADE
);
GO

-- ================================================
-- TABLA: alerta
-- ================================================

CREATE TABLE alerta (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    mensaje VARCHAR(255) NOT NULL,
    fecha_alerta DATETIME DEFAULT GETDATE(),
    leida BIT DEFAULT 0,
    id_usuario BIGINT NOT NULL,
    id_presupuesto BIGINT NOT NULL,

    CONSTRAINT fk_alerta_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_alerta_presupuesto
        FOREIGN KEY (id_presupuesto)
        REFERENCES presupuesto(id)
        ON DELETE CASCADE
);
GO

-- ================================================
-- TABLA: bitacora
-- ================================================

CREATE TABLE bitacora (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    accion VARCHAR(100) NOT NULL,
    entidad VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    fecha_accion DATETIME DEFAULT GETDATE(),
    id_usuario BIGINT NOT NULL,

    CONSTRAINT fk_bitacora_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id)
        ON DELETE CASCADE
);
GO

-- ================================================
-- DATOS DE PRUEBA
-- ================================================

-- Usuarios
INSERT INTO usuario (nombre, email, password)
VALUES
('Juan Pérez', 'juan@email.com', '1234'),
('Ana García', 'ana@email.com', '1234'),
('Luis Torres', 'luis@email.com', '1234');
GO

-- Categorías de Juan (id = 1)
INSERT INTO categoria (nombre, tipo, descripcion, id_usuario)
VALUES
('Sueldo', 'INGRESO', 'Ingreso mensual por trabajo', 1),
('Freelance', 'INGRESO', 'Ingresos por proyectos externos', 1),
('Alimentación', 'GASTO', 'Gastos en comida y mercado', 1),
('Transporte', 'GASTO', 'Pasajes y combustible', 1),
('Entretenimiento', 'GASTO', 'Cine, salidas, streaming', 1),
('Alquiler', 'GASTO', 'Pago mensual de vivienda', 1);
GO

-- Categorías de Ana (id = 2)
INSERT INTO categoria (nombre, tipo, descripcion, id_usuario)
VALUES
('Salario', 'INGRESO', 'Sueldo mensual', 2),
('Alimentación', 'GASTO', 'Gastos de comida', 2),
('Salud', 'GASTO', 'Medicamentos y consultas', 2),
('Educación', 'GASTO', 'Cursos y libros', 2);
GO

-- Transacciones de Juan
INSERT INTO transaccion
(monto, tipo, descripcion, fecha_transaccion, id_usuario, id_categoria)
VALUES
(3500.00, 'INGRESO', 'Sueldo Junio', '2025-06-01', 1, 1),
(800.00, 'INGRESO', 'Proyecto web freelance', '2025-06-05', 1, 2),
(250.00, 'GASTO', 'Supermercado semana 1', '2025-06-03', 1, 3),
(280.00, 'GASTO', 'Supermercado semana 2', '2025-06-10', 1, 3),
(45.00, 'GASTO', 'Pasajes semanales', '2025-06-07', 1, 4),
(120.00, 'GASTO', 'Cena con amigos', '2025-06-08', 1, 5),
(1200.00, 'GASTO', 'Alquiler Junio', '2025-06-01', 1, 6),
(3500.00, 'INGRESO', 'Sueldo Mayo', '2025-05-01', 1, 1),
(300.00, 'GASTO', 'Supermercado Mayo', '2025-05-10', 1, 3),
(60.00, 'GASTO', 'Netflix y Spotify', '2025-05-15', 1, 5);
GO

-- Transacciones de Ana
INSERT INTO transaccion
(monto, tipo, descripcion, fecha_transaccion, id_usuario, id_categoria)
VALUES
(2800.00, 'INGRESO', 'Salario Junio', '2025-06-01', 2, 7),
(180.00, 'GASTO', 'Compras supermercado', '2025-06-05', 2, 8),
(95.00, 'GASTO', 'Consulta médica', '2025-06-12', 2, 9),
(150.00, 'GASTO', 'Curso de inglés', '2025-06-15', 2, 10),
(2800.00, 'INGRESO', 'Salario Mayo', '2025-05-01', 2, 7);
GO

-- Presupuestos de Juan
INSERT INTO presupuesto
(monto_maximo, mes, anio, alerta_activada, id_usuario, id_categoria)
VALUES
(500.00, 6, 2025, 0, 1, 3),
(100.00, 6, 2025, 0, 1, 4),
(150.00, 6, 2025, 0, 1, 5),
(1200.00, 6, 2025, 0, 1, 6);
GO

-- Presupuestos de Ana
INSERT INTO presupuesto
(monto_maximo, mes, anio, alerta_activada, id_usuario, id_categoria)
VALUES
(200.00, 6, 2025, 0, 2, 8),
(100.00, 6, 2025, 0, 2, 9),
(200.00, 6, 2025, 0, 2, 10);
GO

-- Alertas
INSERT INTO alerta
(mensaje, leida, id_usuario, id_presupuesto)
VALUES
('Superaste tu presupuesto de Entretenimiento en Junio 2025', 0, 1, 3),
('Superaste tu presupuesto de Transporte en Junio 2025', 0, 1, 2),
('Superaste tu presupuesto de Alimentación en Junio 2025', 1, 2, 5);
GO

-- Bitácora
INSERT INTO bitacora
(accion, entidad, descripcion, id_usuario)
VALUES
('CREAR', 'Transaccion', 'Registro de ingreso por sueldo Junio', 1),
('CREAR', 'Transaccion', 'Registro de gasto en supermercado', 1),
('ACTUALIZAR', 'Presupuesto', 'Ajuste de presupuesto de Alimentación', 1),
('CREAR', 'Categoria', 'Nueva categoría Salud creada', 2),
('ELIMINAR', 'Transaccion', 'Transacción duplicada eliminada', 2);
GO

-- ================================================
-- CONSULTAS DE PRUEBA
-- ================================================

SELECT * FROM usuario;
SELECT * FROM categoria;
SELECT * FROM transaccion;
SELECT * FROM presupuesto;
SELECT * FROM alerta;
SELECT * FROM bitacora;
GO
