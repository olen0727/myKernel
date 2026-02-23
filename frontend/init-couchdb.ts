import axios from 'axios';

const COUCHDB_URL = process.env.VITE_COUCHDB_URL;
const USER = process.env.VITE_COUCHDB_USER;
const PASSWORD = process.env.VITE_COUCHDB_PASSWORD;

if (!COUCHDB_URL || !USER || !PASSWORD) {
    console.error('❌ Missing environment variables:');
    if (!COUCHDB_URL) console.error('   - VITE_COUCHDB_URL is undefined');
    if (!USER) console.error('   - VITE_COUCHDB_USER is undefined');
    if (!PASSWORD) console.error('   - VITE_COUCHDB_PASSWORD is undefined');
    process.exit(1);
}

// Assert variables are strings for axios usage
const url: string = COUCHDB_URL;
const user: string = USER;
const password: string = PASSWORD;

const COLLECTIONS = [
    'projects',
    'areas',
    'tasks',
    'resources',
    'habits',
    'metrics',
    'logs'
];

async function enableCors(auth: any) {
    console.log('🔓 Configuring CORS...');
    try {
        // 1. Get Node Name
        const membership = await axios.get(`${url}/_membership`, { auth });
        const nodeName = membership.data.all_nodes[0];
        console.log(`   📍 Targeting CouchDB Node: ${nodeName}`);

        const configBase = `${url}/_node/${nodeName}/_config`;

        // 2. Set Configs
        const configs = [
            { section: 'chttpd', key: 'enable_cors', value: '"true"' },
            { section: 'cors', key: 'origins', value: '"http://localhost:5173, http://127.0.0.1:5173"' },
            { section: 'cors', key: 'credentials', value: '"true"' },
            { section: 'cors', key: 'methods', value: '"GET, PUT, POST, HEAD, DELETE"' },
            { section: 'cors', key: 'headers', value: '"accept, authorization, content-type, origin, referer"' }
        ];

        for (const cfg of configs) {
            await axios.put(`${configBase}/${cfg.section}/${cfg.key}`, cfg.value, { auth });
            console.log(`   👉 Set [${cfg.section}] ${cfg.key} = ${cfg.value}`);
        }
        console.log('✅ CORS Configured Successfully');

    } catch (err: any) {
        console.error('❌ Failed to configure CORS:', err.message);
        if (err.response) {
            console.error('   Data:', err.response.data);
        }
    }
}

async function initCouchDB() {
    console.log('🔄 Checking CouchDB databases...');
    const auth = { username: user, password: password };

    try {
        // Check connection
        await axios.get(url, { auth });
        console.log('✅ Connected to CouchDB');

        // Enable CORS
        await enableCors(auth);

        for (const name of COLLECTIONS) {
            try {
                await axios.put(`${url}/${name}`, {}, { auth });
                console.log(`✅ Created database: ${name}`);
            } catch (err: any) {
                if (err.response?.status === 412) {
                    console.log(`ℹ️ Database already exists: ${name}`);
                } else {
                    console.error(`❌ Failed to create ${name}:`, err.message);
                }
            }
        }
        console.log('✨ Initialization complete!');
    } catch (err: any) {
        console.error('❌ Could not connect to CouchDB:', err.message);
        if (err.code === 'ECONNREFUSED') {
            console.error('   Please make sure Docker/CouchDB is running.');
        }
    }
}

initCouchDB();
