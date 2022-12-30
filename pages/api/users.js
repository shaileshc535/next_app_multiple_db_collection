/* eslint-disable react-hooks/rules-of-hooks */
import { MongoClient } from "mongodb";

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

export default async function GetUserList(req, res) {
  const allUsers = [];

  for (const databaseURI of databaseURIs) {
    await useDB(databaseURI, async (db) => {
      const users = await db.collection("users").find({}).toArray();

      allUsers.push(users);
    });
  }

  res.json(allUsers);
}
