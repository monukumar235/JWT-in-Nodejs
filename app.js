import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import  jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

const connect = async()=>{
    try {
        await mongoose.connect('mongodb://localhost:27017/jwtdemo');
        console.log("Connected to server...");
    } catch (error) {
        console.log("error while connecting to server..")
    }
}
connect();

const userSchema = new mongoose.Schema({
    name : String,
    email : {type : String ,unique : true},
    password : String
});

const User = mongoose.model('users',userSchema);

// Signup api
app.post("/signup",async(req ,res)=>{

    const {name,email,password} = req.body;

    const exist = await User.findOne({email});

    if(exist){
        res.json({mes : "User alrady exists..."});
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user = new User({name ,email,password : hashedPassword});
    await user.save();
    res.json({msg : "user created successfully...."});
});

// login 
app.post("/login",async (req,res)=>{
    const {email,password} = req.body;
    
    const user = await User.findOne({email});

    if(!user){
        return res.json({msg : "User Not Found"});
    }

    const match = await bcrypt.compare(password,user.password);

    if(!match){
        return res.json({msg : "Invalid Credential"});
    }

    const token = jwt.sign({id : user._id},"secret123",{
        expiresIn :'1h'
    });

    res.json({msg : "Successfully loged in..","token":token});
});


// middleWare 
const auth = (req,res,next)=>{
    const token = req.headers.authorization;
    
    if(!token){
        return res.json({msg : "token not found in header!"});
    }

    try {
      const data =  jwt.verify(token,"secret123");
      req.userId = data.id;
      next();    
    } catch (error) {
        return res.json({msg : "Invalid token"});
    }
}

app.get("/profile",auth,async(req,res)=>{
    const user = await User.findById(req.userId).select("-password");
    return res.json({msg : "profile load",user});
})



app.listen(80,()=>{
    console.log(`server is running on http://localhost:80`);
})