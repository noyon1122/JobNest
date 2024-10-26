const express = require('express')
const cors = require('cors')
require('dotenv').config()
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port =process.env.PORT || 5000;

const app=express();
const corsOptions={
    origin:['http://localhost:5173',"http://localhost:5174"],
    credentials:true,
    optionSuccessStatus:200,
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.get('/user',async(req,res)=>{
    res.send('This is from server')
})

//verify token using custom function

const verifyToken=(req,res,next)=>{
  const token=req.cookies?.token
    if(!token) return res.status(401).send({message:'UnAuthorized Access'})
    if(token)
      {
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
       
          if(err){
            return res.status(401).send({message:'UnAuthorized Access'})
          }
          console.log(decoded)
          req.user=decoded
          next()
        })
      }  
   
      

}



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gjamq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const jobsCollection=client.db('jobPortal').collection('jobs')
    const bidsCollection=client.db('jobPortal').collection('bids')


    //==========JWT=============

    //generate token
    app.post('/jwt',async(req,res)=>{
      const email=req.body
      const token=jwt.sign(email,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'365d'})
      res
      .cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite:process.env.NODE_ENV==='production'? 'none':'strict'
      })
      .send({success:true})
    })

    //Clear / remove token after logout
  app.get('/logout',(req,res)=>{
    res
    .clearCookie('token',{
      httpOnly:true,
      secure:process.env.NODE_ENV==='production',
      sameSite:process.env.NODE_ENV==='production'? 'none':'strict',
      maxAge:0
    })
    .send({success:true})
  })


   //get all data from the db 
    app.get('/jobs',async(req,res)=>{
       // console.log("This is from jobsCollection")
        const result=await jobsCollection.find().toArray()
        res.send(result)
    })

    //get a single data from db using id
    app.get('/job/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:new ObjectId(id)}
        const result=await jobsCollection.findOne(query)
        res.send(result)
    })

    //update job by id

    app.put('/job/:id',async(req,res)=>{
      const id=req.params.id
      const query={_id:new ObjectId(id)}
      const newJob=req.body
      //console.log(newJob)
      const options={upsert:true}

      const updateJob={
        $set:{
          job_title:newJob.job_title,
          category:newJob.category,
          max_price:newJob.max_price,
          min_price:newJob.min_price,
          deadline:newJob.deadline,
          description:newJob.description
          //all data set by useing this command: ...newJob
        }
      }

      const result=await jobsCollection.updateOne(query,updateJob,options)
      res.send(result)
    })

    //delete job from the database by id
    app.delete('/job/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await jobsCollection.deleteOne(query)
      res.send(result)
  })

    //get all the jobs data for a sepcific user by email

    app.get('/jobs/:email',verifyToken,async(req,res)=>{
      const email=req.params.email;
      const tokenEmail=req.user.email
      if(tokenEmail !==email)
      {
       return res.status(403).send({message:'Forbidden Access'})
      }
      //console.log(token)
      //console.log(email)
      const query={'buyer.email':email}
      const result=await jobsCollection.find(query).toArray()
      res.send(result)
    })
    //save job data to mondodb bid collection
    app.post('/job',async(req,res)=>{
      const jobData=req.body;
     // console.log(jobData)
      const result=await jobsCollection.insertOne(jobData)
      res.send(result)
    })

  //=======================================
  //=======================================
  //Bids get,post,delete section

   //save bid data to mondodb bid collection
   app.post('/bid',async(req,res)=>{
    const bidData=req.body;
    //console.log(bidData)
    const result=await bidsCollection.insertOne(bidData)
    res.send(result)
  })
  
  //get bid from the db and send to the client
  app.get('/my-bids/:email',async(req,res)=>{
    const email=req.params.email;
    //console.log(email)
    const query={email}
    const result=await bidsCollection.find(query).toArray()
    res.send(result)
  })

  //get bid from the db and for owner from the client user
  app.get('/bid-requests/:email',async(req,res)=>{
    const email=req.params.email;
   // console.log(email)
    const query={buyer_email:email}
    const result=await bidsCollection.find(query).toArray()
    res.send(result)
  })

  //update status bid in the db 
  app.patch('/bid/:id',async(req,res)=>{
    const id=req.params.id
    const status=req.body;
   // console.log(status)
    const query={_id:new ObjectId(id)}
   const updateDoc={
    $set:status
   }
    const result=await bidsCollection.updateOne(query,updateDoc)
    res.send(result)
  })

    // Connect the client to the server	(optional starting in v4.7)
   // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);


app.listen(port , ()=> {
    console.log(`Server is running from the port : ${port}`);
  })
