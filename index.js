const express = require("express");
const app = express();

const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
    const cartDetailsCollections = client.db("myDB").collection("cart");

    // Get brands data from database
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

    // Get products data from database
    app.get("/products", async (req, res) => {
      const cursor = productCollections.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get products data filtering by brand from database
    app.get("/:brand/products", async (req, res) => {
      const brand = req.params.brand;
      const query = { brand_name: brand };

      const products = await productCollections.find(query).toArray();
      res.send(products);
    });

    // Get product data filtering by id from database
    app.get("/:brand/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const product = await productCollections.findOne(query);
      res.send(product);
    });

    // Get product data filtering by id from database---------------------------
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const product = await productCollections.findOne(query);
      res.send(product);
    });

    // Send products data to database
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productCollections.insertOne(product);
      console.log(result);
      res.send(result);
    });

    // Update product data to database
    app.put("/products/:id/update", async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateProduct = {
        $set: {
          name: product.name,
          type: product.type,
          brand_name: product.brand_name,
          price: product.price,
          rating: product.rating,
          image: product.image,
          description: product.description,
        },
      };
      const result = await productCollections.updateOne(
        filter,
        updateProduct,
        option
      );
      console.log(result);
      res.send(result);
    });

    // Get cart data filtering by email from database
    app.get("/cart/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };

      const product = (await cartDetailsCollections.findOne(query)) || {};
      res.send(product);
    });

    // Send cart details to database
    app.patch("/cart", async (req, res) => {
      const cartDetails = req.body;
      const filter = { email: cartDetails.email };
      const option = { upsert: true };
      const updateCartDetails = {
        $set: {
          email: cartDetails.email,
          cartProducts: cartDetails.cartProducts,
        },
      };
      const result = await cartDetailsCollections.updateOne(
        filter,
        updateCartDetails,
        option
      );
      console.log(result);
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
