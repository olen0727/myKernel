import axios from 'axios';

const COUCHDB_URL = 'http://localhost:5984';
const DB_NAME = 'projects';
const USER = 'admin';
const PASSWORD = 'password';

async function testReadWrite() {
    console.log(`🧪 Testing direct Read/Write to CouchDB [${DB_NAME}]...`);
    const auth = { username: USER, password: PASSWORD };

    try {
        // 1. Write a test document
        const testDoc = {
            _id: `test-doc-${Date.now()}`,
            name: "Direct API Test Project",
            description: "Created via script to verify write permissions",
            createdAt: new Date().toISOString()
        };

        console.log(`📝 Attempting to write doc: ${testDoc._id}`);
        const writeRes = await axios.put(`${COUCHDB_URL}/${DB_NAME}/${testDoc._id}`, testDoc, { auth });
        console.log('✅ Write Successful!', writeRes.status, writeRes.statusText);

        // 2. Read it back
        console.log(`📖 Attempting to read doc: ${testDoc._id}`);
        const readRes = await axios.get(`${COUCHDB_URL}/${DB_NAME}/${testDoc._id}`, { auth });
        console.log('✅ Read Successful!');
        console.log('📄 Document Content:', JSON.stringify(readRes.data, null, 2));

        // 3. Clean up (Delete)
        console.log('🧹 Cleaning up...');
        await axios.delete(`${COUCHDB_URL}/${DB_NAME}/${testDoc._id}?rev=${readRes.data._rev}`, { auth });
        console.log('✅ Delete Successful!');

    } catch (err: any) {
        console.error('❌ Operation Failed:', err.message);
        if (err.response) {
            console.error('   Status:', err.response.status);
            console.error('   Data:', err.response.data);
        }
    }
}

testReadWrite();
