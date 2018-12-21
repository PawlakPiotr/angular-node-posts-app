const express = require('express');
const multer = require('multer');

const Post = require('../models/post');

const router = express.Router();

const UPLOAD_TYPE_MAP = {
  'image/png' : 'png',
  'image/jpeg' : 'jpg',
  'image/jpg' : 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = UPLOAD_TYPE_MAP[file.uploadtype];
    let error = new Error('Invalid upload type');
    if(isValid){
      error = null;
    }
    cb(null, 'backend/images');
  },
  filename: (req, file, cb) => {
    let title = req.body.title.toString().replace(' ','_');
    title = title.replace(/ /g, '_');
    const name ='img_' + title;
    cb(null, name + '.' + UPLOAD_TYPE_MAP["image/jpg"]);
  }
});

router.post("", multer({storage: storage}).single('image'), (req,res,next) => {
  const url = req.protocol + '://' + req.get('host');
  let title = req.body.title.toString().replace(' ','_');
  title = title.replace(/ /g, '_');
  const name ='img_' + title;
  const filename = name + '.' + UPLOAD_TYPE_MAP["image/jpg"];

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + filename
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath
      }
    });
  });

});

router.put("/:id", multer({storage: storage}).single('image'), (req, res, next) => {

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: req.body.imagePath
  });
  Post.updateOne({_id: req.params.id}, post)
    .then( result => {
      console.log(result);
      res.status(200).json({ message: 'Post updated successfully!' });
    });
});

router.get('', (req,res,next) => {
  Post.find().then(documents => {
    res.json({
      message: 'Post fetched successfully',
      posts: documents
    });
  });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then( post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: 'Post not found!'
        });
      }
    });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
    .then( result => {
      console.log(result);
      res.status(200).json({ message: 'Post deleted!' });
    });

});


module.exports = router;
