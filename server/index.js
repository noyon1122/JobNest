const express = require('express')
const cors = require('cors')
require('dotenv').config()
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

app.get('/user',async(req,res)=>{
    res.send('This is from server')
})



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

   //get all data from the db 
    app.get('/jobs',async(req,res)=>{
        console.log("This is from jobsCollection")
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
      console.log(newJob)
      const options={upsert:true}

      const updateJob={
        $set:{
          job_title:newJob.job_title,
          category:newJob.category,
          max_price:newJob.max_price,
          min_price:newJob.min_price,
          deadline:newJob.deadline,
          description:newJob.description
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

    app.get('/jobs/:email',async(req,res)=>{
      const email=req.params.email;
      console.log(email)
      const query={'buyer.email':email}
      const result=await jobsCollection.find(query).toArray()
      res.send(result)
    })

    //save bid data to mondodb bid collection
    app.post('/bid',async(req,res)=>{
      const bidData=req.body;
      console.log(bidData)
      const result=await bidsCollection.insertOne(bidData)
      res.send(result)
    })

    //save job data to mondodb bid collection
    app.post('/job',async(req,res)=>{
      const jobData=req.body;
      console.log(jobData)
      const result=await jobsCollection.insertOne(jobData)
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
