-- Schema minimal para reserva_salas
CREATE DATABASE IF NOT EXISTS reserva_salas
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE reserva_salas;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('admin','professor','aluno','tecnico') NOT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  codigo VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS turmas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  curso_id INT NOT NULL,
  codigo VARCHAR(50) NOT NULL,
  ano SMALLINT NOT NULL,
  semestre TINYINT NOT NULL,
  FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

CREATE TABLE IF NOT EXISTS tipos_sala (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS salas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  capacidade INT,
  tipo_id INT,
  FOREIGN KEY (tipo_id) REFERENCES tipos_sala(id)
);

CREATE TABLE IF NOT EXISTS reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  sala_id INT NOT NULL,
  curso_id INT NULL,
  turma_id INT NULL,
  professor_id INT NULL,
  data_inicio DATETIME NOT NULL,
  data_fim DATETIME NOT NULL,
  finalidade VARCHAR(255),
  status ENUM('pendente','confirmado','cancelado','concluido') DEFAULT 'pendente',
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (sala_id) REFERENCES salas(id),
  FOREIGN KEY (curso_id) REFERENCES cursos(id),
  FOREIGN KEY (turma_id) REFERENCES turmas(id),
  FOREIGN KEY (professor_id) REFERENCES usuarios(id)
);

CREATE INDEX idx_reservas_sala_periodo ON reservas (sala_id, data_inicio, data_fim);
