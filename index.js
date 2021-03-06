
const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000; 



// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xdgiu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('travel_assignment');
        const servicesCollection = database.collection('place');
        const orderCollection = database.collection('orders');

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            // console.log(result);
            res.json(result)
        });

         // Add Orders API
         app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })

        // my order get
        app.get("/myOrders/:email", async(req, res) => {
            const email = req.params.email;
            const result = await orderCollection.find({email}).toArray();
           res.send(result);
        })

        // delete Order
        app.delete("/cancel/:id", async(req, res) => {
            const id = req.params.id;
            const result = await orderCollection.deleteOne({_id:ObjectId(id)});
            res.send(result);
        })

        // manage orders get 
        app.get("/allOrders", async(req, res) => {
            const result = await orderCollection.find({}).toArray();
           res.send(result);
        })

        // manage order delete
        app.delete("/allOrders/:id", async(req, res) => {
            const id = req.params.id;
            const result = await orderCollection.deleteOne({_id:ObjectId(id)});
            res.send(result);
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running travel Server');
});

app.listen(port, () => {
    console.log('Running travel Server on port', port);
})