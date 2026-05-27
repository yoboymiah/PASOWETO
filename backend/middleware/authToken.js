const jwt = require('jsonwebtoken')

async function authToken(req, res, next) {
    try {
        // 🌟 FIXED: Read the token from cookies, custom header, OR standard Authorization header
        let token = req.cookies?.token || req.header("token");

        // If the frontend used standard "Authorization: Bearer <token>", extract just the token part
        if (!token && req.headers['authorization']) {
            const authHeader = req.headers['authorization'];
            if (authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }

        console.log("Extracted token:", token)

        if (!token) {
            return res.status(200).json({ // Keeping your 200 status convention for UI handling
                message: "Please Login...!",
                error: true,
                success: false
            })
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, function(err, decoded) {
            
            // 🌟 FIXED: If token is expired, modified, or invalid, stop the request here!
            if (err) {
                console.log("error auth", err)
                return res.status(401).json({
                    message: "Session expired or invalid token. Please log in again.",
                    error: true,
                    success: false
                });
            }

            console.log("decoded payload:", decoded)
            
            // Assign the user ID from the verified token payload to the request object
            req.userId = decoded?._id

            // Move safely to your controller
            next()
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            data: [],
            error: true,
            success: false
        })
    }
}

module.exports = authToken