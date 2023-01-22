
const jwt = require("jsonwebtoken");
const config = require('../config')

function getTokenFromHeader(req) {
    if (
        (req.headers.authorization &&
            req.headers.authorization.split(" ")[0] === "Token") ||
        (req.headers.authorization &&
            req.headers.authorization.split(" ")[0] === "Bearer")
    ) {
        return req.headers.authorization.split(" ")[1];
    }
    return null;
}

const signAccessToken = (body) => {
    try {
        return jwt.sign(body, config.JWT_SECRET_KEY)
    } catch (e) {
        throw e;
    }
};

const signRefreshToken = async (body) => {
    const payload = {
        userId: body.userId,
        role: body.role,
    };
    const options = {
        expiresIn: "60d",
        issuer: config.DOMAIN_NAME,
        audience: body.userId,
    };
    try {
        const token = await jwt.sign(payload, config.JWT_REFRESH_SECRET_KEY, options);
        return token;
    } catch (err) {
        throw err;
    }
};

const verifyAccessToken = async (req, res, next) => {
    try {
        const token = await getTokenFromHeader(req);

        if (!token) {
            return res.json({
                status: false,
                message: "No token found in the request."
            })
        }

        jwt.verify(token, config.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                return res.json({
                    status: false,
                    message: "Invalid authentication."
                })
            }
            req.body.user = user;
            next();
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken
};
