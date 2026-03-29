const express = require("express");
const router = express.Router();
const db = require("../db"); // krijoje këtë file në hapin tjetër

// CREATE (nga Contact Us)
router.post("/", (req, res) => {
  const { email, phone, full_name, message } = req.body;

  if (!email || !full_name || !message) {
    return res.status(400).json({
      success: false,
      message: "Email, full_name dhe message jane te detyrueshme",
    });
  }

  const sql = `
    INSERT INTO contact_messages (full_name, email, phone, message)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [full_name, email, phone || null, message], (err, result) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({
        success: false,
        message: "Gabim ne ruajtje",
      });
    }

    res.status(201).json({
      success: true,
      id: result.insertId,
    });
  });
});

// GET ALL (Admin Dashboard)
router.get("/", (req, res) => {
  db.query("SELECT * FROM contact_messages ORDER BY created_at DESC", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Gabim ne marrje",
      });
    }

    res.json({
      success: true,
      data: results,
    });
  });
});

// UPDATE
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { full_name, email, phone, message, status } = req.body;

  const sql = `
    UPDATE contact_messages
    SET full_name=?, email=?, phone=?, message=?, status=?
    WHERE id=?
  `;

  db.query(
    sql,
    [full_name, email, phone, message, status, id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: "Gabim ne update",
        });
      }

      res.json({
        success: true,
        message: "Mesazhi u perditesua",
      });
    }
  );
});

// DELETE
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM contact_messages WHERE id=?", [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Gabim ne delete",
      });
    }

    res.json({
      success: true,
      message: "Mesazhi u fshi",
    });
  });
});

module.exports = router;