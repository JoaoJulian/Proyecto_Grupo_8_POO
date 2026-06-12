-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: db_presupuesto_personal
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alerta`
--

DROP TABLE IF EXISTS `alerta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alerta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_presupuesto` int NOT NULL,
  `mensaje` text NOT NULL,
  `monto_gastado` decimal(10,2) NOT NULL,
  `monto_limite` decimal(10,2) NOT NULL,
  `fecha_alerta` datetime NOT NULL,
  `leida` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_alerta_usuario` (`id_usuario`),
  KEY `fk_alerta_presupuesto` (`id_presupuesto`),
  CONSTRAINT `fk_alerta_presupuesto` FOREIGN KEY (`id_presupuesto`) REFERENCES `presupuesto` (`id`),
  CONSTRAINT `fk_alerta_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alerta`
--

LOCK TABLES `alerta` WRITE;
/*!40000 ALTER TABLE `alerta` DISABLE KEYS */;
INSERT INTO `alerta` VALUES (1,1,3,'Alerta: Se ha superado el presupuesto de Entretenimiento para el mes de junio.',120.00,100.00,'2025-06-08 21:00:00',0),(2,1,3,'Recordatorio de exceso continuo en categoría Entretenimiento.',120.00,100.00,'2025-06-09 08:00:00',1);
/*!40000 ALTER TABLE `alerta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bitacora`
--

DROP TABLE IF EXISTS `bitacora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bitacora` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `accion` varchar(20) NOT NULL,
  `tabla_afectada` varchar(50) NOT NULL,
  `id_registro_afectado` int NOT NULL,
  `detalle` text,
  `fecha_accion` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_bitacora_usuario` (`id_usuario`),
  CONSTRAINT `fk_bitacora_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bitacora`
--

LOCK TABLES `bitacora` WRITE;
/*!40000 ALTER TABLE `bitacora` DISABLE KEYS */;
INSERT INTO `bitacora` VALUES (1,1,'CREAR','transaccion',5,'Inserción inicial de gasto recreativo','2025-06-08 23:45:00'),(2,1,'EDITAR','categoria',5,'Modificación de la descripción opcional','2025-06-09 10:22:00'),(3,1,'CREAR','transaccion',10,'Registro de servicio de transporte privado','2025-06-20 22:15:00');
/*!40000 ALTER TABLE `bitacora` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `tipo` varchar(10) NOT NULL,
  `descripcion` text,
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_categoria_usuario` (`id_usuario`),
  CONSTRAINT `fk_categoria_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,1,'Salario','INGRESO','Pago mensual de nómina principal','2025-01-02 00:00:00'),(2,1,'Freelance','INGRESO','Proyectos externos de desarrollo','2025-01-15 00:00:00'),(3,1,'Alimentación','GASTO','Supermercados y restaurantes','2025-01-02 00:00:00'),(4,1,'Transporte','GASTO','Gastos de pasajes y servicios de taxi corporativos','2025-01-02 00:00:00'),(5,1,'Entretenimiento','GASTO','Salidas, cine, suscripciones de streaming','2025-02-01 00:00:00'),(6,1,'Alquiler','GASTO','Pago mensual de vivienda','2025-01-02 00:00:00'),(7,1,'Servicios','GASTO','Servicios esenciales (Luz, agua, internet)','2025-01-02 00:00:00');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `presupuesto`
--

DROP TABLE IF EXISTS `presupuesto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `presupuesto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_categoria` int NOT NULL,
  `monto_limite` decimal(10,2) NOT NULL,
  `mes` int NOT NULL,
  `anio` int NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_presupuesto_periodo` (`id_usuario`,`id_categoria`,`mes`,`anio`),
  KEY `fk_presupuesto_categoria` (`id_categoria`),
  CONSTRAINT `fk_presupuesto_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id`),
  CONSTRAINT `fk_presupuesto_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`),
  CONSTRAINT `chk_presupuesto_limite` CHECK ((`monto_limite` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `presupuesto`
--

LOCK TABLES `presupuesto` WRITE;
/*!40000 ALTER TABLE `presupuesto` DISABLE KEYS */;
INSERT INTO `presupuesto` VALUES (1,1,3,400.00,6,2025,'2025-05-28 08:00:00'),(2,1,4,150.00,6,2025,'2025-05-28 08:00:00'),(3,1,5,100.00,6,2025,'2025-05-28 08:00:00'),(4,1,7,200.00,6,2025,'2025-05-28 08:00:00');
/*!40000 ALTER TABLE `presupuesto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaccion`
--

DROP TABLE IF EXISTS `transaccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaccion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_categoria` int NOT NULL,
  `tipo` varchar(10) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `descripcion` text,
  `fecha_transaccion` datetime NOT NULL,
  `fecha_registro` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_transaccion_usuario` (`id_usuario`),
  KEY `fk_transaccion_categoria` (`id_categoria`),
  CONSTRAINT `fk_transaccion_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_transaccion_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`),
  CONSTRAINT `chk_transaccion_monto` CHECK ((`monto` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaccion`
--

LOCK TABLES `transaccion` WRITE;
/*!40000 ALTER TABLE `transaccion` DISABLE KEYS */;
INSERT INTO `transaccion` VALUES (1,1,1,'INGRESO',3500.00,'Sueldo mensual','2025-06-01 08:30:00','2025-06-01 08:30:00'),(2,1,2,'INGRESO',800.00,'Proyecto web cliente A','2025-06-03 14:15:00','2025-06-03 14:20:00'),(3,1,3,'GASTO',250.00,'Supermercado Wong','2025-06-05 19:00:00','2025-06-05 19:12:00'),(4,1,4,'GASTO',45.00,'Pasajes semana','2025-06-06 07:00:00','2025-06-06 18:30:00'),(5,1,5,'GASTO',120.00,'Cine y cena','2025-06-08 21:00:00','2025-06-08 23:45:00'),(6,1,6,'GASTO',1200.00,'Alquiler departamento','2025-06-10 10:00:00','2025-06-10 10:05:00'),(7,1,7,'GASTO',180.00,'Luz, agua e internet','2025-06-12 11:30:00','2025-06-12 11:30:00'),(8,1,3,'GASTO',90.00,'Almuerzo fuera x5','2025-06-15 13:00:00','2025-06-15 13:15:00'),(9,1,2,'INGRESO',500.00,'Proyecto web cliente B','2025-06-18 16:00:00','2025-06-18 16:05:00'),(10,1,4,'GASTO',60.00,'Uber semanal','2025-06-20 22:00:00','2025-06-20 22:15:00');
/*!40000 ALTER TABLE `transaccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `fecha_registro` datetime NOT NULL,
  `ultimo_acceso` datetime DEFAULT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'ACTIVO',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_usuario_correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Juan Pérez','juan.perez@email.com','1234','2025-01-01 09:00:00','2025-06-11 18:00:00','ACTIVO');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-11 19:45:05
