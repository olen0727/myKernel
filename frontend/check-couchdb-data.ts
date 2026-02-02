import axios from 'axios';

const COUCHDB_URL = 'http://localhost:5984';
const USER = 'admin';
const PASSWORD = 'password';

const COLLECTIONS = [
    'projects',
    'areas',
    'tasks',
    'resources',
    'habits',
    'metrics',
    'logs'
];

async function checkData() {
    console.log('🔍 Checking CouchDB data...');
    const auth = { username: USER, password: PASSWORD };

    for (const name of COLLECTIONS) {
        try {
            const response = await axios.get(`${COUCHDB_URL}/${name}/_all_docs`, { auth });
            const count = response.data.total_rows;
            console.log(`📂 ${name}: ${count} documents`);

            if (count > 0) {
                // Show first doc details
                const firstDoc = await axios.get(`${COUCHDB_URL}/${name}/${response.data.rows[0].id}`, { auth });
                console.log(`   Sample: ${JSON.stringify(firstDoc.data).substring(0, 100)}...`);
            }
        } catch (err: any) {
            console.log(`❌ ${name}: Error ${err.message}`);
        }
    }
}

checkData();
