const db = require('../config/db');

class Lesson {
  static async create(courseId, title, videoUrl) {
    const [result] = await db.query(
      `INSERT INTO lessons (course_id, title, video_url) VALUES (?, ?, ?)`,
      [courseId, title, videoUrl]
    );
    return result.insertId;
  }

  static async findByCourse(courseId, { page=1, limit=50 } = {}) {
    const offset = (page - 1) * limit;
    const [rows] = await db.query(
      `SELECT * FROM lessons WHERE course_id = ?
       ORDER BY created_at
       LIMIT ? OFFSET ?`,
      [courseId, limit, offset]
    );
    return rows;
  }

  static async findById(lessonId) {
    const [rows] = await db.query(
      `SELECT * FROM lessons WHERE id = ?`,
      [lessonId]
    );
    return rows[0];
  }

  static async update(lessonId, { title, videoUrl } = {}) {
    const fields = [];
    const params = [];
    if (title != null) {
      fields.push(`title = ?`);
      params.push(title);
    }
    if (videoUrl != null) {
      fields.push(`video_url = ?`);
      params.push(videoUrl);
    }
    if (!fields.length) return 0;
    params.push(lessonId);

    const [result] = await db.query(
      `UPDATE lessons SET ${fields.join(', ')} WHERE id = ?`,
      params
    );
    return result.affectedRows;
  }

  static async delete(lessonId) {
    const [result] = await db.query(
      `DELETE FROM lessons WHERE id = ?`,
      [lessonId]
    );
    return result.affectedRows;
  }
}

module.exports = Lesson; 