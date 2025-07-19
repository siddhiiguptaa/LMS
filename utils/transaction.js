const db = require('../config/db');

/**
 * Execute a function within a database transaction
 * @param {Function} callback - The function to execute within the transaction
 * @returns {Promise} - The result of the callback function
 */
const withTransaction = async (callback) => {
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();
        const result = await callback(connection);
        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

/**
 * Execute multiple database operations within a transaction
 * @param {Array} operations - Array of async functions to execute
 * @returns {Promise<Array>} - Array of results from all operations
 */
const executeTransaction = async (operations) => {
    return withTransaction(async (connection) => {
        const results = [];
        for (const operation of operations) {
            const result = await operation(connection);
            results.push(result);
        }
        return results;
    });
};

module.exports = {
    withTransaction,
    executeTransaction
}; 