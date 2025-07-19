# Learning Management System (LMS) Backend

A comprehensive REST API for a Learning Management System built with Node.js, Express, and MySQL.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Course Management**: Create, read, update, and delete courses with lessons and quizzes
- **Enrollment System**: Students can enroll in courses and track their progress
- **Progress Tracking**: Monitor lesson completions and quiz performance
- **Quiz System**: Multiple-choice quizzes with scoring and attempt tracking
- **Resource Management**: Add supplementary resources to lessons
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive validation for all inputs

## Tech Stack

- **Backend**: Node.js with Express
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Rate Limiting**: express-rate-limit
- **CORS**: Enabled for cross-origin requests

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lms-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
DB_NAME=lms_database
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

4. Set up the database:
   - Create a MySQL database named `lms_database`
   - Run the SQL files in the `database/` directory to create tables

5. Start the server:
```bash
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login user | Public |

### Users

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/users/me` | Get current user profile | Authenticated |
| PUT | `/api/users/me` | Update own profile | Authenticated |
| GET | `/api/users` | List all users (with pagination) | Admin |
| GET | `/api/users/:userId` | Get user by ID | Admin |
| PUT | `/api/users/:userId` | Update user | Admin |
| DELETE | `/api/users/:userId` | Delete user | Admin |

### Courses

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/courses` | List courses (with search & pagination) | Public |
| GET | `/api/courses/:courseId` | Get course details with lessons & quizzes | Public |
| POST | `/api/courses` | Create a new course | Admin |
| PUT | `/api/courses/:courseId` | Update course | Admin |
| DELETE | `/api/courses/:courseId` | Delete course | Admin |
| POST | `/api/courses/:courseId/enroll` | Enroll in course | Student |
| GET | `/api/courses/:courseId/enrollments` | List course enrollments | Admin |

### Lessons

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/courses/:courseId/lessons` | List lessons in course | Public |
| GET | `/api/courses/:courseId/lessons/:lessonId` | Get lesson details | Public |
| POST | `/api/courses/:courseId/lessons` | Create lesson | Admin |
| PUT | `/api/courses/:courseId/lessons/:lessonId` | Update lesson | Admin |
| DELETE | `/api/courses/:courseId/lessons/:lessonId` | Delete lesson | Admin |

### Lesson Resources

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/lessons/:lessonId/resources` | List lesson resources | Public |
| POST | `/api/lessons/:lessonId/resources` | Add resource | Admin |
| DELETE | `/api/lessons/:lessonId/resources/:resId` | Delete resource | Admin |

### Quizzes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/courses/:courseId/quizzes` | List quizzes in course | Public |
| GET | `/api/quizzes/:quizId` | Get quiz details with questions | Public |
| POST | `/api/courses/:courseId/quizzes` | Create quiz | Admin |
| PUT | `/api/quizzes/:quizId` | Update quiz | Admin |
| DELETE | `/api/quizzes/:quizId` | Delete quiz | Admin |

### Questions & Options

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/quizzes/:quizId/questions` | List questions in quiz | Public |
| GET | `/api/questions/:questionId` | Get question with options | Public |
| POST | `/api/quizzes/:quizId/questions` | Add question | Admin |
| PUT | `/api/questions/:questionId` | Update question | Admin |
| DELETE | `/api/questions/:questionId` | Delete question | Admin |
| POST | `/api/questions/:questionId/options` | Add option | Admin |
| PUT | `/api/options/:optionId` | Update option | Admin |
| DELETE | `/api/options/:optionId` | Delete option | Admin |

### Enrollments

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/users/me/enrollments` | List my enrollments | Student |

### Progress Tracking

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/lessons/:lessonId/complete` | Mark lesson complete | Student |
| GET | `/api/me/lessons/completions` | List completed lessons | Student |
| POST | `/api/quizzes/:quizId/attempts` | Submit quiz attempt | Student |
| GET | `/api/quizzes/:quizId/attempts` | List quiz attempts | Student |
| GET | `/api/me/attempts` | List all attempts | Student |
| GET | `/api/attempts/:attemptId` | Get attempt details | Student |
| GET | `/api/courses/:courseId/progress` | Get course progress | Student |
| GET | `/api/me/progress` | Get overall progress | Student |

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Rate Limiting

- Authentication endpoints: 5 requests per 15 minutes
- General endpoints: 100 requests per 15 minutes

## Database Schema

The system uses the following main tables:
- `users` - User accounts and authentication
- `courses` - Course information
- `lessons` - Course lessons
- `quizzes` - Course quizzes
- `questions` - Quiz questions
- `options` - Question options
- `enrollments` - Student course enrollments
- `lesson_completions` - Lesson completion tracking
- `quiz_attempts` - Quiz attempt records
- `quiz_attempt_answers` - Individual answer records

## Development

To run in development mode with auto-restart:
```bash
npm run dev
```
