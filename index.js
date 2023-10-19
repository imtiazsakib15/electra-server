const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jnjhgs0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const brandCollections = client.db("myDB").collection("brands");
    const productCollections = client.db("myDB").collection("products");

    // Get brands data to database
    app.get("/brands", async (req, res) => {
      const cursor = brandCollections.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send brands data to database
    app.post("/brands", async (req, res) => {
      const brand = req.body;
      const result = await brandCollections.insertOne(brand);
      res.send(result);
    });

    // Get products data to database
    app.get("/products", async (req, res) => {
      const cursor = productCollections.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send products data to database
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productCollections.insertOne(product);
      res.send(result);
    });

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
  res.send("Electra");
});

app.listen(port, () => {
  console.log(`Port Running on ${port}`);
});
