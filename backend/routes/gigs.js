const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all gigs
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM gigs');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Gabim ne server', details: err.message });
  }
});

// GET one gig by ID
router.get('/:id', async (req, res) => {
  const gigId = req.params.id;

  try {
    const [rows] = await db.query('SELECT * FROM gigs WHERE id = ?', [gigId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Gig nuk u gjet.' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Gabim ne server', details: err.message });
  }
});

// POST new gig
router.post('/', async (req, res) => {
  const { title, description, category, price, user_id } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO gigs (title, description, category, price, user_id) VALUES (?, ?, ?, ?, ?)',
      [title, description, category, price, user_id]
    );
    res.status(201).json({ message: 'Gig u shtua me sukses!', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Gabim ne server', details: err.message });
  }
});

// PUT update gig by ID
router.put('/:id', async (req, res) => {
  const gigId = req.params.id;
  const { title, description, category, price, user_id } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE gigs SET title = ?, description = ?, category = ?, price = ?, user_id = ? WHERE id = ?',
      [title, description, category, price, user_id, gigId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Gig nuk u gjet per perditesim.' });
    }

    res.json({ message: 'Gig u perditesua me sukses!' });
  } catch (err) {
    res.status(500).json({ error: 'Gabim ne server', details: err.message });
  }
});

// DELETE gig by ID
router.delete('/:id', async (req, res) => {
  const gigId = req.params.id;

  try {
    const [result] = await db.query('DELETE FROM gigs WHERE id = ?', [gigId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Gig nuk u gjet per fshirje.' });
    }

    res.json({ message: 'Gig u fshi me sukses!' });
  } catch (err) {
    res.status(500).json({ error: 'Gabim ne server', details: err.message });
  }
});

module.exports = router;
