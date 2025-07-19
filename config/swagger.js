const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LMS API Documentation',
      version: '1.0.0',
      description: 'Learning Management System API Documentation',
      contact: {
        name: 'LMS Team',
        email: 'support@lms.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            role: {
              type: 'string',
              enum: ['student', 'admin'],
              description: 'User role'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            },
            updated_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Course: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Course ID'
            },
            title: {
              type: 'string',
              description: 'Course title'
            },
            description: {
              type: 'string',
              description: 'Course description'
            },
            instructor: {
              type: 'string',
              description: 'Course instructor'
            },
            price: {
              type: 'number',
              format: 'decimal',
              description: 'Course price'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            },
            updated_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Lesson: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Lesson ID'
            },
            course_id: {
              type: 'integer',
              description: 'Course ID'
            },
            title: {
              type: 'string',
              description: 'Lesson title'
            },
            video_url: {
              type: 'string',
              description: 'Lesson video URL'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            },
            updated_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Quiz: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Quiz ID'
            },
            course_id: {
              type: 'integer',
              description: 'Course ID'
            },
            title: {
              type: 'string',
              description: 'Quiz title'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Question: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Question ID'
            },
            quiz_id: {
              type: 'integer',
              description: 'Quiz ID'
            },
            text: {
              type: 'string',
              description: 'Question text'
            }
          }
        },
        Option: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Option ID'
            },
            question_id: {
              type: 'integer',
              description: 'Question ID'
            },
            text: {
              type: 'string',
              description: 'Option text'
            },
            is_correct: {
              type: 'boolean',
              description: 'Whether this option is correct'
            }
          }
        },
        Enrollment: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Enrollment ID'
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              description: 'User ID'
            },
            course_id: {
              type: 'integer',
              description: 'Course ID'
            },
            enrolled_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        QuizAttempt: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Attempt ID'
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              description: 'User ID'
            },
            quiz_id: {
              type: 'integer',
              description: 'Quiz ID'
            },
            attempt_number: {
              type: 'integer',
              description: 'Attempt number'
            },
            score: {
              type: 'number',
              format: 'decimal',
              description: 'Quiz score'
            },
            attempted_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs; 