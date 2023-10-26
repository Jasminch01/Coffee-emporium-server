const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.yh8qk3b.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


const database = client.db("coffeeDB");
const coffeeCollection = database.collection("coffees");

const usersDB = client.db("usersDB");
const usersDataCollection = database.collection("users");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    app.get("/coffees", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    app.post("/coffees", async (req, res) => {
      const coffees = req.body;
      const result = await coffeeCollection.insertOne(coffees);
      res.send(result);
    });

    app.put('/coffees/:id', async(req, res) => {
      const id = req.params.id;
      const update = req.body;
      const filter = {_id : new ObjectId(id)}
      const updateCoffee = {
        $set : {
           name : update.name,
           quantity : update.quantity,
           supplier :update.supplier,
           taste :update.taste,
           category :update.category,
           details :update.details,
           photo  : update.photo

        }
      }
      const result = await coffeeCollection.updateOne(filter, updateCoffee);
      res.send(result)
    })

    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    //user


    app.get('/users', async(req, res) => {
      const cursor = usersDataCollection.find();
      const result = await cursor.toArray();
      
      res.send(result)
    })


    app.post('/users', async (req, res ) => {
      const user = req.body;
      const result = await usersDataCollection.insertOne(user);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("coffee emporium server is running");
});

app.listen(port, () => {
  console.log(`coffee emporium server running port ${port}`);
});
