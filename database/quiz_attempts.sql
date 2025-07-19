CREATE TABLE quiz_attempts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    quiz_id INT NOT NULL,
    attempt_number INT NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    attempted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_quiz_attempts_user_quiz_attempt (user_id,quiz_id,attempt_number),
    KEY idx_quiz_attempts_user (user_id),
    KEY idx_quiz_attempts_quiz (quiz_id),
    CONSTRAINT fk_quiz_attempts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_quiz_attempts_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
