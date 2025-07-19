const db = require('../config/db');

class LessonResource {
  static async add(lessonId, resourceUrl) {
    const [result] = await db.query(
      `INSERT INTO lesson_resources (lesson_id, resource_url) VALUES (?, ?)`,
      [lessonId, resourceUrl]
    );
    return result.insertId;
  }

  static async findByLesson(lessonId) {
    const [rows] = await db.query(
      `SELECT * FROM lesson_resources WHERE lesson_id = ?`,
      [lessonId]
    );
    return rows;
  }

  static async delete(resourceId) {
    const [result] = await db.query(
      `DELETE FROM lesson_resources WHERE id = ?`,
      [resourceId]
    );
    return result.affectedRows;
  }
}

module.exports = LessonResource; 