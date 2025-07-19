const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }

       const userRole = req.user.role;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ 
                message: 'Access denied. Insufficient permissions.',
                required: allowedRoles,
                current: userRole
            });
        }

        req.userRole = userRole;
        next();
    };
};

const requireAdmin = requireRole(['admin']);
const requireStudent = requireRole(['student']);
const requireAnyRole = requireRole(['student', 'admin']);

module.exports = {
    requireRole,
    requireAdmin,
    requireStudent,
    requireAnyRole,
}; 