const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

// password: DW2P13oNJ8zzh7za

const app = express();

mongoose.connect("mongodb+srv://piotr:DW2P13oNJ8zzh7za@cluster0-pxkdh.mongodb.net/test?retryWrites=true")
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
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});


app.post("/api/posts", (req,res,next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  console.log(post);
  res.status(201).json({
    message: 'Post added successfully'
  });
});

app.get('/api/posts', (req,res,next) => {
  const posts = [
    {
      id:"p1Q23DDKa1",
      title:"First server-side post",
      content:"This is coming from server"
    },
    {
      id:"p3Z39GSPa2",
      title:"Second server-side post",
      content:"This is also coming from server"
    }
  ];
  res.json({
    message: 'Post fetched successfully',
    posts: posts
  });
})

module.exports = app;
