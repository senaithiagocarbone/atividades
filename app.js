// server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// conexão MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // ajuste se tiver senha
  database: "reserva_salas"
});

db.connect(err => {
  if (err) {
    console.error("Erro ao conectar no MySQL:", err);
    return;
  }
  console.log("Conectado ao banco MySQL");
});

// rota de teste
app.get("/api", (req, res) => {
  res.send("API funcionando! 🚀");
});

// 🔹 LISTAR salas
app.get("/api/rooms", (req, res) => {
  db.query("SELECT * FROM salas", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 🔹 CRIAR sala
app.post("/api/rooms", (req, res) => {
  const { nome, codigo, capacidade, tipo_id } = req.body;
  db.query(
    "INSERT INTO salas (nome, codigo, capacidade, tipo_id) VALUES (?, ?, ?, ?)",
    [nome, codigo, capacidade, tipo_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId });
    }
  );
});

// 🔹 CRIAR reserva
app.post("/api/reservations", (req, res) => {
  const { usuario_id, sala_id, data_inicio, data_fim, finalidade } = req.body;
  db.query(
    "INSERT INTO reservas (usuario_id, sala_id, data_inicio, data_fim, finalidade) VALUES (?, ?, ?, ?, ?)",
    [usuario_id, sala_id, data_inicio, data_fim, finalidade],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId });
    }
  );
});

// 🔹 RELATÓRIO por curso
app.get("/api/reports/by-curso", (req, res) => {
  const { data_inicio, data_fim } = req.query;
  const sql = `
    SELECT c.nome AS curso_nome,
           COUNT(r.id) AS total_reservas,
           SUM(TIMESTAMPDIFF(HOUR, r.data_inicio, r.data_fim)) AS horas_reservadas
    FROM reservas r
    JOIN usuarios u ON r.usuario_id = u.id
    JOIN cursos c ON u.curso_id = c.id
    WHERE r.data_inicio >= ? AND r.data_fim <= ?
    GROUP BY c.nome
  `;
  db.query(sql, [data_inicio, data_fim], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
