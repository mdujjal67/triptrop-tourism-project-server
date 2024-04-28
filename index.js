const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())


// ------------MongoDB Start----------

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7tyfnet.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const spotCollection = client.db('tourismDB').collection('addSpots');
    const contactCollection = client.db('tourismDB').collection('contactedUser');
    const countriesSection = client.db('tourismDB').collection('countries');

      // contact data receive from client side visitor
      app.post('/contactedUser', async(req, res) => {
        const contactedUser = req.body
        console.log(contactedUser)
        const result = await contactCollection.insertOne(contactedUser)
        res.send(result)
  
      })

      app.get('/countries', async(req, res) => {
        const cursor = countriesSection.find(); // Marked: Use countries collection
        const result = await cursor.toArray();
        res.send(result);
      });

    // read data
    app.get('/addSpots', async(req, res) => {
      const cursor = spotCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })


  // data receive from client side
    app.post('/addSpots', async(req, res) => {
      const newAddedSpot = req.body
      console.log(newAddedSpot)
      const result = await spotCollection.insertOne(newAddedSpot)
      res.send(result)

    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Tourism Management server is running!')
  })
  
  app.listen(port, () => {
    console.log(`Tourism Management server is running on port ${port}`)
  })