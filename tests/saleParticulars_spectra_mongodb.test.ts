import {expect , test} from '@playwright/test'
const { MongoClient } = require('mongodb');

test ("mongodb connection" , async () => {
    const url = 'mongodb://readOnlyUser:readOnlyUser%40123@3.109.173.45:27017/?authMechanism=DEFAULT';
    const client = new MongoClient(url);
    await client.connect();
    const collection = client.db('crm').collection('banks');
    const cursor = await collection.findOne({});
}); 