import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' });
  }else{
    console.log("Found Access token in verify Token");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }else{
        console.log("Access token in verify Token matched")
    }

    req.user = user; // Store the user data from the token in the request object
    next(); // Pass the request to the next middleware or route handler
  });
};
