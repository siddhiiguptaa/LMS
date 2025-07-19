const db = require('../config/db');

class Option {
  static async create(questionId, text, isCorrect = false, connection = null) {
    const conn = connection || db;
    const [result] = await conn.query(
      `INSERT INTO options (question_id, text, is_correct) VALUES (?, ?, ?)`,
      [questionId, text, isCorrect]
    );
    return result.insertId;
  }

  static async findByQuestion(questionId) {
    const [rows] = await db.query(
      `SELECT * FROM options WHERE question_id = ?`,
      [questionId]
    );
    return rows;
  }

  static async update(optionId, { text, isCorrect } = {}) {
    const fields = [];
    const params = [];
    if (text != null) {
      fields.push(`text = ?`);
      params.push(text);
    }
    if (isCorrect != null) {
      fields.push(`is_correct = ?`);
      params.push(isCorrect);
    }
    if (!fields.length) return 0;
    params.push(optionId);

    const [result] = await db.query(
      `UPDATE options SET ${fields.join(', ')} WHERE id = ?`,
      params
    );
    return result.affectedRows;
  }

  static async delete(optionId, connection = null) {
    const conn = connection || db;
    const [result] = await conn.query(
      `DELETE FROM options WHERE id = ?`,
      [optionId]
    );
    return result.affectedRows;
  }
}

module.exports = Option; 