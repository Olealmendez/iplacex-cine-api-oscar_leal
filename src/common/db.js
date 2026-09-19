import { MongoClient, ServerApiVersion } from 'mongodb';


const URI = 'mongodb+srv://eva3_express:cwSwez22C43veKzw@cluster-express.hncgkbk.mongodb.net/?appName=cluster-express';
const client = new MongoClient(URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export default client