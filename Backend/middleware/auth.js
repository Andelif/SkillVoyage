import jwt from "jsonwebtoken";

async function authToken(req, res, next) {
    try {
        const accessToken = req.cookies?.accessToken;
        const refreshToken = req.cookies?.refreshToken;

        console.log("Refresh Token -> ", refreshToken);
        console.log("Access Token -> ", accessToken);

        if (!accessToken && !refreshToken) {
            return res.status(401).json({
                message: "Please log in",
                error: true,
                success: false,
            });
        }

        jwt.verify(accessToken, process.env.JWT_SECRET, async function (err, decoded) {
            if (err) {
                console.log("Access Token verification error: ", err);

                if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError' && refreshToken) {
                    try {
                        const refreshDecoded = jwt.verify(refreshToken, process.env.TOKEN_SECRET_REF_KEY);
                        const newAccessTokenData = {
                            _id: refreshDecoded._id,
                            email: refreshDecoded.email,
                        };
                        const accessToken = jwt.sign(newAccessTokenData, process.env.JWT_SECRET, { expiresIn: "15m" });
                        console.log("New Access Token after re-generation -> ", accessToken);

                        const tokenOption = {
                            httpOnly: true,
                            secure:  true,
                            sameSite: 'None',
                        };

                        res.cookie("accessToken", accessToken, { ...tokenOption, expires: new Date(Date.now() + 15 * 60 * 1000) });
                        console.log("token from cookie after gen -> ",req.cookies?.accessToken)


                        req.userId = newAccessTokenData._id;
                        return next();

                    } catch (refreshErr) {
                        const tokenOption = {
                            httpOnly : true,
                            secure : true,
                            sameSite : 'None'
                        }
                        res.clearCookie("refreshToken",tokenOption)
                        res.clearCookie("accessToken",tokenOption)

                        console.log("Refresh token error: ", refreshErr);
                        return res.status(401).json({
                            message: "Invalid refresh token. Please log in again.",
                            error: true,
                            success: false,
                        });
                    }
                } else {
                    return res.status(401).json({
                        message: "Invalid access token. Please log in again.",
                        error: true,
                        success: false,
                    });
                }
            } else {
                req.userId = decoded?._id;
                next();
            }
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            data: [],
            error: true,
            success: false,
        });
    }
}

export default authToken;
