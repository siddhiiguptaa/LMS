# Transaction Utility

This utility provides database transaction management for the LMS backend application.

## Overview

The transaction utility ensures data consistency by wrapping multiple database operations in transactions. If any operation fails, all changes are rolled back.

## Usage

### Basic Transaction

```javascript
const { withTransaction } = require('../utils/transaction');

const result = await withTransaction(async (connection) => {
    // Perform database operations using the connection
    const userId = await User.createUser(name, email, password, connection);
    const courseId = await Course.createCourse(title, description, connection);
    
    return { userId, courseId };
});
```

### Multiple Operations

```javascript
const { executeTransaction } = require('../utils/transaction');

const operations = [
    async (connection) => await User.createUser(name, email, password, connection),
    async (connection) => await Course.createCourse(title, description, connection),
    async (connection) => await Enrollment.enroll(userId, courseId, connection)
];

const results = await executeTransaction(operations);
```

## Transaction-Safe Operations

The following operations have been updated to support transactions:

### Quiz System
- Quiz attempt submission (multiple operations)
- Quiz creation and deletion
- Question creation and deletion
- Option creation and deletion

### Course Management
- Course creation and deletion
- Course enrollment
- Course updates

### User Management
- User registration
- User profile updates
- User deletion

### Progress Tracking
- Lesson completion marking
- Quiz attempt recording

## Benefits

1. **Data Consistency**: Ensures all related operations succeed or fail together
2. **Error Recovery**: Automatic rollback on failures
3. **Connection Management**: Proper connection handling and cleanup
4. **Performance**: Efficient transaction management

## Error Handling

Transactions automatically handle:
- Connection acquisition and release
- Transaction begin/commit/rollback
- Error propagation

## Best Practices

1. Always use transactions for operations that modify multiple tables
2. Keep transactions as short as possible
3. Avoid long-running operations within transactions
4. Handle transaction errors appropriately in controllers 