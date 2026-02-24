import axios from 'axios';

const COUCHDB_URL = 'http://localhost:5984';
const USER = 'admin'; // Must match .env or what you are using
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

async function verifyData() {
    console.log('🔍 Verifying CouchDB Data Sync...');
    const auth = { username: USER, password: PASSWORD };

    for (const dbName of COLLECTIONS) {
        try {
            console.log(`\n📂 Checking database: [${dbName}]...`);
            const res = await axios.get(`${COUCHDB_URL}/${dbName}/_all_docs`, { auth });

            const totalRows = res.data.total_rows;
            console.log(`   ✅ Status: OK`);
            console.log(`   📊 Total Documents: ${totalRows}`);

            if (totalRows > 0) {
                console.log('   🆔 Document IDs:');
                res.data.rows.forEach((row: any) => {
                    console.log(`      - ${row.id}`);
                });
            } else {
                console.log('      (bit empty here...)');
            }

        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                console.log(`   ⚠️ Database [${dbName}] does not exist yet (RxDB might not have synced/created it yet).`);
            } else {
                console.error(`   ❌ Error accessing [${dbName}]:`, err.message);
                if (err.response?.status === 401) console.error("      ERROR: 401 Unauthorized - Check credentials inside this script.");
            }
        }
    }
    console.log('\n🏁 Verification Complete.');
}

verifyData();
