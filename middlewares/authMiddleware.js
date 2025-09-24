exports.authenticate = (req, res, next) => { next(); } // Stub
exports.authorize = (role) => { return (req, res, next) => { next(); }; };
