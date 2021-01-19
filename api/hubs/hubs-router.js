const express = require('express');

const Hubs = require('./hubs-model.js');
const Messages = require('../messages/messages-model.js');

const router = express.Router();

const validateId=(req,res,next)=>{
  const {id} = req.params
  Hubs.findById(id)
  .then(data=>{
    //tack the hub to the req for downstream
    if(data){
      req.hub=data;
      console.log('req.hub=',req.hub)
      next(); //to travel next with the hub attached to req
    }else{
      //shortcircuit everything and respond to client
      next({code: 400, message :'There is no such id ' + id});
    }
  })
  .catch(err=>{
    console.log(err.message);
    // res.status(500).json({message: 'Oops something went wrong!' + id})
    next({code: 500, message:'The Id could not be found'})
  })
 
}
router.use ((req,res,next)=>{
console.log('inside rouer');
next();
});

router.get('/', (req, res,next) => {
  Hubs.find(req.query)
    .then(hubs => {
      res.status(200).json(hubs);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      // res.status(500).json({
      //   message: 'Error retrieving the hubs',
      // });
      next('Error retrieving the hubs ')
    });
});

router.get('/:id', [validateId], (req, res) => {
  // Hubs.findById(req.params.id)
  //   .then(hub => {
  //     if (hub) {
         res.status(200).json(req.hub);
         next();
  //     } else {
  //       res.status(404).json({ message: 'Hub not found' });
  //     }
  //   })
  //   .catch(error => {
  //     // log error to server
  //     console.log(error);
  //     res.status(500).json({
  //       message: 'Error retrieving the hub',
  //     });
  //   });
});

router.post('/', (req, res) => {
  Hubs.add(req.body)
    .then(hub => {
      res.status(201).json(hub);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error adding the hub',
      });
    });
});

router.delete('/:id', (req, res) => {
  Hubs.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: 'The hub has been nuked' });
      } else {
        res.status(404).json({ message: 'The hub could not be found' });
      }
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error removing the hub',
      });
    });
});

router.put('/:id', (req, res) => {
  Hubs.update(req.params.id, req.body)
    .then(hub => {
      if (hub) {
        res.status(200).json(hub);
      } else {
        res.status(404).json({ message: 'The hub could not be found' });
      }
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error updating the hub',
      });
    });
});

router.get('/:id/messages', (req, res) => {
  Hubs.findHubMessages(req.params.id)
    .then(messages => {
      res.status(200).json(messages);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error getting the messages for the hub',
      });
    });
});

router.post('/:id/messages', (req, res) => {
  const messageInfo = { ...req.body, hub_id: req.params.id };

  Messages.add(messageInfo)
    .then(message => {
      res.status(210).json(message);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error adding message to the hub',
      });
    });
});

router.use((err,req,res,next)=>{
  res.status(err.code).json({message : err.message})
})

module.exports = router;
