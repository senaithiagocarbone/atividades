// routes/rooms.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// listar todas as salas
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT s.id, s.nome, s.codigo, s.capacidade, t.nome as tipo FROM salas s LEFT JOIN tipos_sala t ON s.tipo_id = t.id ORDER BY s.nome'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar salas' });
  }
});

// criar sala
router.post('/', async (req, res) => {
  const { nome, codigo, capacidade, tipo_id } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO salas (nome,codigo,capacidade,tipo_id) VALUES (?,?,?,?)',
      [nome, codigo, capacidade || null, tipo_id || null]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar sala' });
  }
});

module.exports = router;
