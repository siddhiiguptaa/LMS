const db = require('../config/db');

class LessonCompletion {
  static async markComplete(userId, lessonId, connection = null) {
    const conn = connection || db;
    const [result] = await conn.query(
      `INSERT IGNORE INTO lesson_completions (user_id, lesson_id) VALUES (?, ?)`,
      [userId, lessonId]
    );
    return result.affectedRows;
  }

  static async findByUser(userId) {
    const [rows] = await db.query(
      `SELECT * FROM lesson_completions WHERE user_id = ?`,
      [userId]
    );
    return rows;
  }

  static async isCompleted(userId, lessonId) {
    const [rows] = await db.query(
      `SELECT 1 FROM lesson_completions WHERE user_id = ? AND lesson_id = ?`,
      [userId, lessonId]
    );
    return rows.length > 0;
  }
}

module.exports = LessonCompletion; 