const express = require('express');
const cors = require('cors');

const app = express();
const MongoClient = require("mongodb").MongoClient;
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const ObjectId = require('mongodb').ObjectId;
const fileUpload = require('express-fileupload');



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.10dvn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)
async function run() {

    try {
        await client.connect();
        const database = client.db("profileForm");
        const profileCollection = database.collection("profile");

        app.post('/profile', async (req, res) => {
            const profile = req.body;
            const result = await profileCollection.insertOne(profile);
            console.log(result)
            res.json(result);
        })


        app.get('/profile', async (req, res) => {
            const cursor = profileCollection.find({});
            const details = await cursor.toArray();
            res.send(details)
        });

        app.post('/users', async (req, res) => {
            const name = req.body.name;
            const email = req.body.email;
            const pic = req.files.image;
            const picData = pic.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const user = {
                name,
                email,
                image: imageBuffer
            }
            const result = await profileCollection.insertOne(user);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Run the server');
});


app.listen(port, () => {
    console.log('Running on', port);
})