import {expect , test} from '@playwright/test'
import { MongoClient } from 'mongodb';

test("mongodb",async() => {

    const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB URI
    const client = new MongoClient(uri);
    try{
    const database = await client.db('crm'); // Replace with your database name
    const collection = await database.collection('flats'); // Replace with your collection name

    const cursor = await collection.find().toArray();
    cursor.forEach(document => {
            let statusOfFLat : string = String(document['saleDetails']['status'])

        });
    }
    catch (error) {
        console.error('Error printing MongoDB collection data:', error);
    } finally {
        // Close the MongoDB connection when done
        await client.close();
    }
})