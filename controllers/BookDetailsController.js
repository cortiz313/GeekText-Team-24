// Feature: 

import mongoose from "mongoose";
import express from "express";
import { Book } from "../models/bookModel.js";


const BookDetailsController = express.Router();

// Feature 4.1: Create Book - Given a Book’s information, add it to the system.
BookDetailsController.post('/', async (req, res) => 
{
    try 
    {
        if (!req.body.title)
        {
            return res.status(400).send("Missing field: title ");
        }
        if (!req.body.author)
        {
            return res.status(400).send("Missing field: author ");
        }
        if (!req.body.genre)
        {
            return res.status(400).send("Missing field: genre ");
        }
        if (!req.body.copiesSold)
        {
            return res.status(400).send("Missing field: copiesSold ");
        }
        if (!req.body.rating)
        {
            return res.status(400).send("Missing field: rating ");
        }
        if (!req.body.ISBN)
        {
            return res.status(400).send("Missing field: ISBN");
        }
        if (!req.body.publisher)
        {
            return res.status(400).send("Missing field: publisher");
        }
        if (!req.body.price)
        {
            return res.status(400).send("Missing field: price");
        }
        if (!req.body.description)
        {
            return res.status(400).send("Missing field: description");
        }
        if (!req.body.yearPublished)
        {
            return res.status(400).send("Missing field: yearPublished");
        }

        const newBook = 
        {
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            copiesSold: req.body.copiesSold,
            rating: req.body.rating,
            ISBN: req.body.ISBN,
            publisher: req.body.publisher,
            price: req.body.price,
            description: req.body.description,
            yearPublished: req.body.yearPublished,
          };

          const book = await Book.create(newBook);
          return res.status(201).send(book);
    }
    catch (error)
    {
        console.log(error.message);
        res.status(500).send(error.message);
    }
});

export default BookDetailsController;
