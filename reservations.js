// routes/reservations.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// checar sobreposição básica
async function hasOverlap(sala_id, data_inicio, data_fim, excludeId = null) {
  let sql = 'SELECT 1 FROM reservas WHERE sala_id = ? AND NOT (? <= data_inicio OR ? >= data_fim)';
  const params = [sala_id, data_fim, data_inicio];
  if (excludeId) {
    sql += ' AND id <> ?';
    params.push(excludeId);
  }
  const [rows] = await db.query(sql, params);
  return rows.length > 0;
}

// criar reserva
router.post('/', async (req, res) => {
  const { usuario_id, sala_id, curso_id, turma_id, professor_id, data_inicio, data_fim, finalidade } = req.body;
  try {
    if (!usuario_id || !sala_id || !data_inicio || !data_fim) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    }
    if (new Date(data_inicio) >= new Date(data_fim)) {
      return res.status(400).json({ error: 'data_inicio deve ser anterior a data_fim' });
    }

    const overlap = await hasOverlap(sala_id, data_inicio, data_fim);
    if (overlap) {
      return res.status(409).json({ error: 'Conflito de horario: já existe uma reserva nesse periodo para essa sala' });
    }

    const [result] = await db.query(
      'INSERT INTO reservas (usuario_id, sala_id, curso_id, turma_id, professor_id, data_inicio, data_fim, finalidade, status) VALUES (?,?,?,?,?,?,?,?,?)',
      [usuario_id, sala_id, curso_id || null, turma_id || null, professor_id || null, data_inicio, data_fim, finalidade || null, 'pendente']
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar reserva' });
  }
});

// listar reservas (opcional filtro por sala/curso/professor)
router.get('/', async (req, res) => {
  const { sala_id, curso_id, professor_id } = req.query;
  let sql = `SELECT r.*, u.nome as solicitante_nome, s.nome as sala_nome
             FROM reservas r
             LEFT JOIN usuarios u ON r.usuario_id = u.id
             LEFT JOIN salas s ON r.sala_id = s.id
             WHERE 1=1`;
  const params = [];
  if (sala_id) { sql += ' AND r.sala_id = ?'; params.push(sala_id); }
  if (curso_id) { sql += ' AND r.curso_id = ?'; params.push(curso_id); }
  if (professor_id) { sql += ' AND r.professor_id = ?'; params.push(professor_id); }
  sql += ' ORDER BY r.data_inicio DESC';
  try {
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar reservas' });
  }
});

module.exports = router;
