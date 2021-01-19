const express = require('express'); // importing a CommonJS module

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();
const helmet = require('helmet');
const morgan = require('morgan');

// adding global middlewares with server.use
//req and res objects travel thru them
//middlewares are functions! that take req,res and next!
server.use(express.json()); // req now has body obj!!!, coz by default express cannot find body of request. so we need this json() to get to the body of req.

server.use(helmet()); // req now has better headers
server.use(morgan('dev'));

//create your own middleware
const myAwesomeMiddleware=(adj)=>(req,res,next)=>{
  console.log(`Hello from my ${adj} middleware`)
  res.append('X-Lambda', 'Hellow from Kav')
  req.lambda='hellows from starry'
  next();
}

// 
const moodyGateKeeper=(req,res,next)=>{
//get seconds 
let timeInSec= new Date().getSeconds();
console.log('timeInSec=',timeInSec)
if(timeInSec % 33 === 0){
  res.status(403).json({message: "Not Allowed!"})
}else next();
}


server.use(myAwesomeMiddleware('fantabulous'));
server.use(moodyGateKeeper);
//the router itself is a group of middlewares!
server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
  `);
});

// server.use((err,req,res,next)=>{
//   res.status(500).json({message : err})
// })

module.exports = server;
