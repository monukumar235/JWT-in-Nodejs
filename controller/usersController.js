
import userModel from "../model/usersModel.js";
import bcrypt from "bcryptjs";
import  jwt from 'jsonwebtoken';
import { auth } from "../middleware/userAuth.js";


export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exist = await userModel.findOne({ email });

        if (exist) {
            return res.json({ msg: "user already loged in.." });
        }
        const hashed =await bcrypt.hash(password, 10);

        const newUser = new userModel({ name, email, password: hashed });
        newUser.save();

        return res.json({ msg: "user created successfully.." });
    } catch (error) {
        return res.json({ msg: "Error while creating new user..." });
    }
}

export const signin = async (req,res)=>{
    try {

        const {email,password} = req.body;
        const user = await userModel.findOne({email});

        if(!user){
            return res.json("user not found");
        }

        const match =await bcrypt.compare(password,user.password);

        if(!match){
            return res.json({msg : "Invalid Credential.."});
        }

        const token = jwt.sign({id: user._id},"secret123",{
            expiresIn : '1h'
        });
        return res.json({msg : "loged in..",token : token});
    } catch (error) {
        return res.json({msg : "error while login..."})
    }
}

export const authentication = async (req,res)=>{
    const user = await userModel.findById(req.userId).select("-password");
    return res.json({msg : "profile loaded",data : user});
}