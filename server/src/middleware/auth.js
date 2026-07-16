import jwt from 'jsonwebtoken';
export const verifyToken = async(req,res,next) => {
    try{
        // Browser requests can be authenticated by the secure session cookie.
        // Keep JWT support for API clients and existing localStorage sessions.
        if (req.session?.user?.id) {
            req.user = { id: req.session.user.id };
            return next();
        }

        let token = req.header("Authorization");

        if(!token) {
            return res.status(401).json({ error: "Please log in to continue." });
        }

        if(token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trim();
        }

        const verified = jwt.verify(
            token,
            process.env.JWT_SECRET || 'programmingforlife'
        );
        req.user = verified
        next();

    } catch(err){
        res.status(401).json({ error: 'Invalid or expired access token' })
    }
}
