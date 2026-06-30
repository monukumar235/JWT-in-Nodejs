import { signin,signup,authentication } from "../controller/usersController.js";
import express  from 'express'
import { auth } from "../middleware/userAuth.js";

const route = express.Router();

route.post("/signup",signup);
route.post("/login",signin);
route.get("/profile",auth,authentication);

export default route;