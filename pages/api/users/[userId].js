/* eslint-disable react-hooks/rules-of-hooks */
import { MongoClient, ObjectId } from "mongodb";

const databaseURIs = [
  "mongodb+srv://admin:Admin@cluster0.pxwo6.mongodb.net/telemedic?retryWrites=true&w=majority",
  "mongodb+srv://admin:Admin@cluster0.pxwo6.mongodb.net/thera?retryWrites=true&w=majority",
  "mongodb+srv://admin:Admin@cluster0.pxwo6.mongodb.net/loan_app?retryWrites=true&w=majority",
  "mongodb+srv://admin:Admin@cluster0.pxwo6.mongodb.net/pdf_app?retryWrites=true&w=majority",
];

async function useDB(databaseURI, callback) {
  // Connect to the database
  const client = new MongoClient(databaseURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  const db = client.db();

  await callback(db);

  client.close();
}

export default async function handler(req, res) {
  const userId = req.query.userId;

  let found = false;

  for (const databaseURI of databaseURIs) {
    await useDB(databaseURI, async (db) => {
      const user = await db
        .collection("users")
        .findOne({ _id: ObjectId(userId) });

      if (user) {
        res.json(user);
        found = true;
      }
    });

    if (found) {
      break;
    }
  }

  if (!found) {
    res.sendStatus(404);
  }
}
