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
      .then(post => res.status(400).json(post))
      .catch(err => res.status(500).json(err));
  })
  .put((req, res) => {
    
  })
  .delete((req, res) => {
    
  });

router.route('/:id/comment')
  .get((req, res) => {
    
  })
  .post((req, res) => {
    
  });



module.exports = router;

router.route('/')
  .get((req, res) => {
    Spot.find()
      .then(spots => {
        res.status(200).json(spots);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  })
  .post((req, res) => {
    const newSpot = req.body;
    const spot = new Spot(newSpot);

    spot.save()
      .then(spot => {
        res.status(201).json(spot);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  });