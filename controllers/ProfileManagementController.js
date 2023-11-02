import express from "express";
import {User} from "../models/userModel.js";
import { Address } from "../models/addressModel.js";
import { CreditCard } from "../models/creditCardModel.js";

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
      if(user == 0){
        return res.status(404).json({ message: `User not found!` });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.log(error.message);
      res.status(500).send(`Internal Server Error ${error.message}`);
    }

  });

  
  ProfileManagementController.put("/update/:username", async (req , res) => {
    try{
      const username = req.params.username;
      const user = await User.findOne({username: username });
      if(user == 0){
        return res.status(404).json({ message: `User not found!` });
      }

      if (req.body.username)
      {
        user.username = req.body.username;
      }
      if (req.body.password)
      {
        user.password = req.body.password;
      }
      if (req.body.confirmPassword)
      {
        user.confirmPassword = req.body.confirmPassword;
      }
      if (req.body.name)
      {
        user.name = req.body.name;
      }
      if (req.body.homeAddress)
      {
        user.homeAddress = await Address.create(req.body.homeAddress);;
      }
      await user.save();
      return res.status(201).send(user);

    }catch(error){
      console.log(error.message);
      res.status(500).send(`Internal Server Error ${error.message}`);
    }
  });

  ProfileManagementController.patch("/update/:username", async (req , res) => {
    try{
      const username = req.params.username;
      const user = await User.findOne({username: username });
      if(user == 0){
        return res.status(404).json({ message: `User not found!` });
      }

      if (req.body.username)
      {
        user.username = req.body.username;
      }
      if (req.body.password)
      {
        user.password = req.body.password;
      }
      if (req.body.confirmPassword)
      {
        user.confirmPassword = req.body.confirmPassword;
      }
      if (req.body.name)
      {
        user.name = req.body.name;
      }
      if (req.body.homeAddress)
      {
        user.homeAddress = await Address.create(req.body.homeAddress);;
      }
      await user.save();
      return res.status(201).send(user);

    }catch(error){
      console.log(error.message);
      res.status(500).send(`Internal Server Error ${error.message}`);
    }
  });

  ProfileManagementController.post('/credit', async (req, res) => {
    try {
        if (!req.body.creditCardNumber)
        {
            return res.status(400).send("Missing field: credit card number");
        }
        if (!req.body.securityCode)
        {
            return res.status(400).send("Missing field: security code");
        }
        if (!req.body.expirationDate)
        {
            return res.status(400).send("Missing field: expiration date ");
        }
        
  
      const newCard = new CreditCard({
        creditCardNumber: req.body.creditCardNumber,
        securityCode: req.body.securityCode,
        expirationDate: req.body.expirationDate
      });

    
    
      const card = await CreditCard.create(newCard);
      return res.status(201).send(card);
      
    } catch (error) {
      console.log(error.message);
      res.status(500).send(`Internal Server Error ${error.message}`);
    }
  });



  export default ProfileManagementController;