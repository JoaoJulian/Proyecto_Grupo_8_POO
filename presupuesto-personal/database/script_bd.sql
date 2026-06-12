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
-- TABLA: alerta
CREATE TABLE alerta (
                        id               BIGINT AUTO_INCREMENT PRIMARY KEY,
                        mensaje          VARCHAR(255) NOT NULL,
                        fecha_alerta     DATETIME DEFAULT CURRENT_TIMESTAMP,
                        leida            TINYINT(1) DEFAULT 0,
                        id_usuario       BIGINT NOT NULL,
                        id_presupuesto   BIGINT NOT NULL,
                        CONSTRAINT fk_alerta_usuario     FOREIGN KEY (id_usuario)
                            REFERENCES usuario(id) ON DELETE CASCADE,
                        CONSTRAINT fk_alerta_presupuesto FOREIGN KEY (id_presupuesto)
                            REFERENCES presupuesto(id) ON DELETE CASCADE
);

-- TABLA: bitacora
CREATE TABLE bitacora (
                          id            BIGINT AUTO_INCREMENT PRIMARY KEY,
                          accion        VARCHAR(100) NOT NULL, -- 'CREAR', 'ACTUALIZAR', 'ELIMINAR'
                          entidad       VARCHAR(100) NOT NULL, -- 'Transaccion', 'Categoria', etc.
                          descripcion   VARCHAR(255),
                          fecha_accion  DATETIME DEFAULT CURRENT_TIMESTAMP,
                          id_usuario    BIGINT NOT NULL,
                          CONSTRAINT fk_bitacora_usuario FOREIGN KEY (id_usuario)
                              REFERENCES usuario(id) ON DELETE CASCADE
);
-- ================================================
-- DATOS DE PRUEBA
-- ================================================

-- Usuarios (3 registros)
INSERT INTO usuario (nombre, email, password) VALUES
                                                  ('Juan Pérez',   'juan@email.com',   '1234'),
                                                  ('Ana García',   'ana@email.com',    '1234'),
                                                  ('Luis Torres',  'luis@email.com',   '1234');

-- ------------------------------------------------
-- Categorías de Juan (id=1) — 6 registros
-- ------------------------------------------------
INSERT INTO categoria (nombre, tipo, descripcion, id_usuario) VALUES
                                                                  ('Sueldo',          'INGRESO', 'Ingreso mensual por trabajo',       1),
                                                                  ('Freelance',       'INGRESO', 'Ingresos por proyectos externos',   1),
                                                                  ('Alimentación',    'GASTO',   'Gastos en comida y mercado',        1),
                                                                  ('Transporte',      'GASTO',   'Pasajes y combustible',             1),
                                                                  ('Entretenimiento', 'GASTO',   'Cine, salidas, streaming',          1),
                                                                  ('Alquiler',        'GASTO',   'Pago mensual de vivienda',          1);

-- Categorías de Ana (id=2) — 4 registros
INSERT INTO categoria (nombre, tipo, descripcion, id_usuario) VALUES
                                                                  ('Salario',         'INGRESO', 'Sueldo mensual',                    2),
                                                                  ('Alimentación',    'GASTO',   'Gastos de comida',                  2),
                                                                  ('Salud',           'GASTO',   'Medicamentos y consultas',          2),
                                                                  ('Educación',       'GASTO',   'Cursos y libros',                   2);

-- ------------------------------------------------
-- Transacciones de Juan (id=1) — 10 registros
-- ------------------------------------------------
INSERT INTO transaccion (monto, tipo, descripcion, fecha_transaccion, id_usuario, id_categoria) VALUES
                                                                                                    (3500.00, 'INGRESO', 'Sueldo Junio',               '2025-06-01', 1, 1),
                                                                                                    (800.00,  'INGRESO', 'Proyecto web freelance',     '2025-06-05', 1, 2),
                                                                                                    (250.00,  'GASTO',   'Supermercado semana 1',      '2025-06-03', 1, 3),
                                                                                                    (280.00,  'GASTO',   'Supermercado semana 2',      '2025-06-10', 1, 3),
                                                                                                    (45.00,   'GASTO',   'Pasajes semanales',          '2025-06-07', 1, 4),
                                                                                                    (120.00,  'GASTO',   'Cena con amigos',            '2025-06-08', 1, 5),
                                                                                                    (1200.00, 'GASTO',   'Alquiler Junio',             '2025-06-01', 1, 6),
                                                                                                    (3500.00, 'INGRESO', 'Sueldo Mayo',                '2025-05-01', 1, 1),
                                                                                                    (300.00,  'GASTO',   'Supermercado Mayo',          '2025-05-10', 1, 3),
                                                                                                    (60.00,   'GASTO',   'Netflix y Spotify',          '2025-05-15', 1, 5);

-- Transacciones de Ana (id=2) — 5 registros
INSERT INTO transaccion (monto, tipo, descripcion, fecha_transaccion, id_usuario, id_categoria) VALUES
                                                                                                    (2800.00, 'INGRESO', 'Salario Junio',              '2025-06-01', 2, 7),
                                                                                                    (180.00,  'GASTO',   'Compras supermercado',       '2025-06-05', 2, 8),
                                                                                                    (95.00,   'GASTO',   'Consulta médica',            '2025-06-12', 2, 9),
                                                                                                    (150.00,  'GASTO',   'Curso de inglés',            '2025-06-15', 2, 10),
                                                                                                    (2800.00, 'INGRESO', 'Salario Mayo',               '2025-05-01', 2, 7);

-- ------------------------------------------------
-- Presupuestos de Juan — 4 registros
-- ------------------------------------------------
INSERT INTO presupuesto (monto_maximo, mes, anio, alerta_activada, id_usuario, id_categoria) VALUES
                                                                                                 (500.00,  6, 2025, 0, 1, 3),   -- Alimentación: máx S/.500
                                                                                                 (100.00,  6, 2025, 0, 1, 4),   -- Transporte: máx S/.100
                                                                                                 (150.00,  6, 2025, 0, 1, 5),   -- Entretenimiento: máx S/.150 (será superado)
                                                                                                 (1200.00, 6, 2025, 0, 1, 6);   -- Alquiler: máx S/.1200

-- Presupuestos de Ana — 3 registros
INSERT INTO presupuesto (monto_maximo, mes, anio, alerta_activada, id_usuario, id_categoria) VALUES
                                                                                                 (200.00, 6, 2025, 0, 2, 8),    -- Alimentación Ana: máx S/.200
                                                                                                 (100.00, 6, 2025, 0, 2, 9),    -- Salud Ana: máx S/.100
                                                                                                 (200.00, 6, 2025, 0, 2, 10);   -- Educación Ana: máx S/.200

-- ------------------------------------------------
-- Alertas — 3 registros
-- ------------------------------------------------
INSERT INTO alerta (mensaje, leida, id_usuario, id_presupuesto) VALUES
                                                                    ('Superaste tu presupuesto de Entretenimiento en Junio 2025', 0, 1, 3),
                                                                    ('Superaste tu presupuesto de Transporte en Junio 2025',      0, 1, 2),
                                                                    ('Superaste tu presupuesto de Alimentación en Junio 2025',    1, 2, 5);

-- ------------------------------------------------
-- Bitácora — 5 registros
-- ------------------------------------------------
INSERT INTO bitacora (accion, entidad, descripcion, id_usuario) VALUES
                                                                    ('CREAR',      'Transaccion', 'Registro de ingreso por sueldo Junio',     1),
                                                                    ('CREAR',      'Transaccion', 'Registro de gasto en supermercado',        1),
                                                                    ('ACTUALIZAR', 'Presupuesto', 'Ajuste de presupuesto de Alimentación',    1),
                                                                    ('CREAR',      'Categoria',   'Nueva categoría Salud creada',             2),
                                                                    ('ELIMINAR',   'Transaccion', 'Transacción duplicada eliminada',          2);                                                                                         (1200.00, 6, 2025, 0, 1, 6);  -- Alquiler: máx S/.1200