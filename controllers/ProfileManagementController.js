import express from "express";
import {User} from "../models/userModel.js";
import { Address } from "../models/addressModel.js";

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
        if (!req.body.confirmPassword)
        {
            return res.status(400).send("Missing field: confirmPassword ");
        }
        if (!req.body.name)
        {
            return res.status(400).send("Missing field: name ");
        }
        if (!req.body.email)
        {
            return res.status(400).send("Missing field: email ");
        }
        if (!req.body.homeAddress)
        {
            return res.status(400).send("Missing field: address");
        }
    
  
      const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        confirmPassword : req.body.confirmPassword,
        name: req.body.name,
        email: req.body.email,
        homeAddress: await Address.create(req.body.homeAddress)
      });

    
    
      const user = await User.create(newUser);
      return res.status(201).send(user);
      
    } catch (error) {
      console.log(error.message);
      res.status(500).send(`Internal Server Error ${error.message}`);
    }
  });


  ProfileManagementController.get("/userID/:username", async (req, res) => {
    try {
      const username = req.params.username;
      const user = await User.find({username: username });
      return res.status(200).json(user);
    } catch (error) {
      console.log(error.message);
      res.status(500).send(`Internal Server Error ${error.message}`);
    }
  });

  export default ProfileManagementController;