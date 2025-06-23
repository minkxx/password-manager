import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
    const {token} = req.cookies;
    if (!token) {
        return res.status(401).json({ message: "Please login to access this route" });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecode.id) {
            req.userId = tokenDecode.id;
        } else {
            return res.status(401).json({ message: "Please login to access this route" });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
}

export default userAuth;