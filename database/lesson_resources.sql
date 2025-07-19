CREATE TABLE lesson_resources (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    lesson_id INT NOT NULL,
    resource_url TEXT NOT NULL,
    KEY idx_lesson_resources_lesson (lesson_id),
    CONSTRAINT fk_lesson_resources_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
