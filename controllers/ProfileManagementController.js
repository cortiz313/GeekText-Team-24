import mongoose from "mongoose";
import express from "express";
import { User } from "./models/userModel.js";
import { Address } from "../models/addressModel.js";


const router = express.Router();

router.post("/user", async (req, res) => {
    try {
      if (
        !req.body.username ||
        !req.body.password ||
        !req.body.name ||
        !req.body.email ||
        !req.body.street||
        !req.body.city ||
        !req.body.state ||
        !req.body.zipcode
      ) {
        return res.status(400).send("Missing required fields");
      }
  
      const newUser = {
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        email: req.body.email
      };

      const newAddress ={
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode
        
      }
      const user = await User.create(newUser);
      const address = await Address.create(newAddress);
      return res.status(201).send(user,address);
      
    } catch (error) {
      console.log(error.message);
      res.status(500).send(`Internal Server Error ${error.message}`);
    }
  });
export default ProfileManagementController;
