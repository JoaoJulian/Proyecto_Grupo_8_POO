-- SISTEMA DE GESTIÓN DE PRESUPUESTO PERSONAL
-- Base de datos: presupuesto_personal

DROP DATABASE IF EXISTS presupuesto_personal;
CREATE DATABASE presupuesto_personal
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE presupuesto_personal;

-- TABLA: usuario

CREATE TABLE usuario (
                         id               BIGINT AUTO_INCREMENT PRIMARY KEY,
                         nombre           VARCHAR(100) NOT NULL,
                         email            VARCHAR(150) NOT NULL UNIQUE,
                         password         VARCHAR(255) NOT NULL,
                         fecha_registro   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: categoria
CREATE TABLE categoria (
                           id          BIGINT AUTO_INCREMENT PRIMARY KEY,
                           nombre      VARCHAR(100) NOT NULL,
                           tipo        VARCHAR(20)  NOT NULL, -- 'INGRESO' o 'GASTO'
                           descripcion VARCHAR(255),
                           id_usuario  BIGINT NOT NULL,
                           CONSTRAINT fk_categoria_usuario FOREIGN KEY (id_usuario)
                               REFERENCES usuario(id) ON DELETE CASCADE
);

-- TABLA: transaccion
CREATE TABLE transaccion (
                             id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
                             monto              DECIMAL(12,2) NOT NULL,
                             tipo               VARCHAR(20)   NOT NULL, -- 'INGRESO' o 'GASTO'
                             descripcion        VARCHAR(255),
                             fecha_transaccion  DATE,
                             id_usuario         BIGINT NOT NULL,
                             id_categoria       BIGINT,
                             CONSTRAINT fk_transaccion_usuario   FOREIGN KEY (id_usuario)
                                 REFERENCES usuario(id) ON DELETE CASCADE,
                             CONSTRAINT fk_transaccion_categoria FOREIGN KEY (id_categoria)
                                 REFERENCES categoria(id) ON DELETE SET NULL
);

-- TABLA: presupuesto
CREATE TABLE presupuesto (
                             id               BIGINT AUTO_INCREMENT PRIMARY KEY,
                             monto_maximo     DECIMAL(12,2) NOT NULL,
                             mes              INT NOT NULL,  -- 1 a 12
                             anio             INT NOT NULL,
                             alerta_activada  TINYINT(1) DEFAULT 0,
                             id_usuario       BIGINT NOT NULL,
                             id_categoria     BIGINT NOT NULL,
                             CONSTRAINT fk_presupuesto_usuario   FOREIGN KEY (id_usuario)
                                 REFERENCES usuario(id) ON DELETE CASCADE,
                             CONSTRAINT fk_presupuesto_categoria FOREIGN KEY (id_categoria)
                                 REFERENCES categoria(id) ON DELETE CASCADE
);

-- DATOS DE PRUEBA

-- Usuarios
INSERT INTO usuario (nombre, email, password) VALUES
                                                  ('Juan Pérez',   'juan@email.com',  '1234'),
                                                  ('Ana García',   'ana@email.com',   '1234'),
                                                  ('Luis Torres',  'luis@email.com',  '1234');

-- Categorías de Juan (id=1)
INSERT INTO categoria (nombre, tipo, descripcion, id_usuario) VALUES
                                                                  ('Sueldo',          'INGRESO', 'Ingreso mensual por trabajo',       1),
                                                                  ('Freelance',       'INGRESO', 'Ingresos por proyectos externos',   1),
                                                                  ('Alimentación',    'GASTO',   'Gastos en comida y mercado',        1),
                                                                  ('Transporte',      'GASTO',   'Pasajes y combustible',             1),
                                                                  ('Entretenimiento', 'GASTO',   'Cine, salidas, streaming',          1),
                                                                  ('Alquiler',        'GASTO',   'Pago mensual de vivienda',          1);

-- Transacciones de Juan (id=1) — Junio 2025
INSERT INTO transaccion (monto, tipo, descripcion, fecha_transaccion, id_usuario, id_categoria) VALUES
                                                                                                    (3500.00, 'INGRESO', 'Sueldo Junio',              '2025-06-01', 1, 1),
                                                                                                    (800.00,  'INGRESO', 'Proyecto web freelance',    '2025-06-05', 1, 2),
                                                                                                    (250.00,  'GASTO',   'Supermercado semana 1',     '2025-06-03', 1, 3),
                                                                                                    (280.00,  'GASTO',   'Supermercado semana 2',     '2025-06-10', 1, 3),
                                                                                                    (45.00,   'GASTO',   'Pasajes semanales',         '2025-06-07', 1, 4),
                                                                                                    (120.00,  'GASTO',   'Cena con amigos',           '2025-06-08', 1, 5),
                                                                                                    (1200.00, 'GASTO',   'Alquiler Junio',            '2025-06-01', 1, 6);

-- Presupuestos de Juan para Junio 2025
INSERT INTO presupuesto (monto_maximo, mes, anio, alerta_activada, id_usuario, id_categoria) VALUES
                                                                                                 (500.00,  6, 2025, 0, 1, 3),  -- Alimentación: máx S/.500
                                                                                                 (100.00,  6, 2025, 0, 1, 4),  -- Transporte: máx S/.100
                                                                                                 (150.00,  6, 2025, 0, 1, 5),  -- Entretenimiento: máx S/.150
                                                                                                 (1200.00, 6, 2025, 0, 1, 6);  -- Alquiler: máx S/.1200