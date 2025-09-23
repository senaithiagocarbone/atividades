const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o banco
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "reserva_salas"
});

db.connect(err => {
  if (err) {
    console.error("Erro ao conectar no MySQL:", err);
    return;
  }
  console.log("Conectado ao banco de dados MySQL");
});

// Rota de teste
app.get("/api", (req, res) => {
  res.send("API funcionando! 🚀");
});

// Exemplo de rota de reservas
app.get("/api/reservas", (req, res) => {
  db.query("SELECT * FROM reservas", (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
