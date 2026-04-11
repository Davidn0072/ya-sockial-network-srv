import jwt from 'jsonwebtoken';

function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).json('No token provided');
    }
    const SECRET_KEY = process.env.SECRET_KEY;
    jwt.verify(token, SECRET_KEY, (err, data) => {
        if (err) {
            return res.status(403).json('Failed to authenticate token');
        }

        req.user = data; // save the data to the request
        next(); // continue to the router
    });
}

export default verifyToken;