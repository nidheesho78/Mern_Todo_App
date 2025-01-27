import dotenv from 'dotenv'
import { MongoClient, ServerApiVersion } from 'mongodb' 
dotenv.config()


const uri =
  process.env.MONGO_URI ||
  "mongodb+srv://nidheesho979:6tfhxicc9ZqTI922@cluster0.hoi22.mongodb.net/todosdb";

  const options = {
    ServerApi : {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
  }

  let client;

  const connectToMongoDB = async () => {
    if(!client) {
        try{
            client = await MongoClient.connect(uri, options);
            console.log('Connected to MongoDB');

        }catch(error) {
            console.error('Failed to connect to MongoDB', error);
            throw error;
        }
    }
    return client;
  }

  const getConnectedClient = () => client;

  export { connectToMongoDB, getConnectedClient };


