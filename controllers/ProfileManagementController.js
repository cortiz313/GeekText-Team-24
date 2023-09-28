import express from "express";
import {User} from "../models/userModel.js";

const ProfileManagementController = express.Router();
//router for new user
ProfileManagementController.post('/', async (req, res) => {
    try {
        if (!req.body.username)
        {
            return res.status(400).send("Missing field: username ");
        }
        if (!req.body.password)
        {
            return res.status(400).send("Missing field: password");
        }
        if (!req.body.confirmedpassword)
        {
            return res.status(400).send("Missing field: confirmpassword ");
        }
        if (!req.body.name)
        {
            return res.status(400).send("Missing field: name ");
        }
        if (!req.body.email)
        {
            return res.status(400).send("Missing field: email ");
        }
        if (!req.body.address)
        {
            return res.status(400).send("Missing field: address");
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

  export default ProfileManagementController;