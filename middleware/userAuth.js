import  jwt from 'jsonwebtoken';

export const auth = (req,res,next)=>{
    const token = req.headers.autherization;

    if(!token){
        return res.json({msg : "Token not found in headers!"});
    }
    try {
        const data = jwt.verify(token,"secret123");
        req.userId = data.id;
        next();
    } catch (error) {
        return res.json({msg : "Invalid token..."});
    }
}