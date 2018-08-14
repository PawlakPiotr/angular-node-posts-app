const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRouter = require('./routes/posts');

// password: DW2P13oNJ8zzh7za

const app = express();

mongoose.connect("mongodb+srv://piotr:DW2P13oNJ8zzh7za@cluster0-pxkdh.mongodb.net/node-angular?retryWrites=true")
  .then(() => {
    console.log('Connected to database');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postRouter);

module.exports = app;
