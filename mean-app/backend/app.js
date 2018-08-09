const express = require('express');

const app = express();

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

app.use('/api/posts', (req,res,next) => {
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
    message: 'Post fetched succesfully',
    posts: posts
  });
})

module.exports = app;
