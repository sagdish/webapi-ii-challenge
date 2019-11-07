const router = require('express').Router();
// bring the database:
const db = require('./data/db');

router.route('/')
  .get((req, res) => {
    db.find()
      .then(posts => {
        res.status(200).json(posts);
      })
      .catch(err => res.status(500).json(err));
  })
  .post((req, res) => {
    const newPost = req.body;
    if (!newPost.title || !newPost.contents) {
      console.log('please provide title and content');
      res.status(404).json('you messed up!')
    }
    db.insert(newPost)
      .then(post => {
        res.status(201).json({message: `new post created`, newPost});
      })
      .catch(err => res.status(500).json(err));
  });

router.route('/:id')
  .get((req, res) => {
    const { id } = req.params;
    db.findById(id)
      .then(post => {
        if (post.length < 1) {
          res.status(404).json({message: "this post doesn't exist"})
        } else {
          res.status(400).json(post)
        }
      })
      .catch(err => res.status(500).json(err));
  })

  .put((req, res) => {
    const { id } = req.params;
    const editedPost = req.body;
    if (!editedPost.title && !editedPost.contents) {
      res.status(404).json('please provide details');
    }

    db.update(id, editedPost)
    .then(response => {
      if (response > 0) {
        db.findById(id)
          .then(post => res.status(400).json(post))
      }
    })
    .catch(err => res.status(500).json(err));
  })

  .delete((req, res) => {
    const { id } = req.params;

    // variable to store post for deletion
    let postForDeletion;

    db.findById(id)
      .then(post => {
        if (post.length < 1) {
          res.json({message: "this post doesn't exist"})
        } else {
          postForDeletion = post[0];
          db.remove(id)
          .then(post => {
            res.status(200).json({deleted: postForDeletion})
          })
          .catch(err => res.status(500).json(err));
        }
      })
      .catch(err => res.status(500).json(err));

  });

router.route('/:id/comments')
  .get((req, res) => {
    const { id } = req.params;
    db.findPostComments(id)
      .then(comments => {
        if (comments.length < 1) {
          res.status(404).json({message: "there are no comments on that post"})
        } else {
          res.status(400).json(comments)
        }
      })
      .catch(err => res.status(500).json(err));
  })
  .post((req, res) => {
    const { id } = req.params;
    const newComment = { ...req.body, post_id: id }
    if (!newComment.text) {
      res.status(404).json({error: 'Please provide text field'})
    }

    db.insertComment(newComment)
      .then(newId => {
        console.log(newId);
        db.findCommentById(JSON.stringify(newId.id))
          .then(comment=> res.status(200).json(comment));
      })
      .catch(err => res.status(500).json(err));

  });

router.get('/getcomment/:id', (req, res) => {
  const { id } = req.params;
  console.log( typeof id )
  db.findCommentById(id)
    .then(comment=> res.status(200).json(comment));
})


module.exports = router;