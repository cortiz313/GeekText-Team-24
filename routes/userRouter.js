import express from "express";
import {User} from "../models/userModel.js";

const router = express.Router();
//router for new user
router.post("/", async (req, res) => {
    try {
      if (
        !req.body.username ||
        !req.body.password ||
        !req.body.confirmedPassword ||
        !req.body.name ||
        !req.body.email ||
        !req.body.homeAddress
      ) {
        return res.status(400).send("Missing required fields");
      }
  
      const newUser = {
        username: req.body.username,
        password: req.body.password,
        confirmpassword : req.body.confirmedpassword,
        name: req.body.name,
        email: req.body.email,
        address: req.body.homeAddress
      };

      const user = await User.create(newUser);
      return res.status(201).send(user);
      
    } catch (error) {
      console.log(error.message);
      res.status(500).send(`Internal Server Error ${error.message}`);
    }
  });

  export default router;