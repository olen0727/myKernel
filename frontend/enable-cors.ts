import axios from 'axios';

const COUCHDB_URL = 'http://localhost:5984';
const USER = 'admin';
const PASSWORD = 'password';

async function enableCors() {
    console.log('🔧 Configuring CORS for CouchDB...');
    const auth = { username: USER, password: PASSWORD };

    const configs = [
        { section: 'httpd', key: 'enable_cors', value: '"true"' },
        { section: 'cors', key: 'origins', value: '"*"' },
        { section: 'cors', key: 'credentials', value: '"true"' },
        { section: 'cors', key: 'methods', value: '"GET, PUT, POST, HEAD, DELETE"' },
        { section: 'cors', key: 'headers', value: '"accept, authorization, content-type, origin, referer"' }
    ];

    try {
        for (const config of configs) {
            try {
                // Check if node name varies, usually 'nonode@nohost' in default docker
                const nodeUrl = `${COUCHDB_URL}/_node/nonode@nohost/_config/${config.section}/${config.key}`;
                await axios.put(nodeUrl, config.value, { auth });
                console.log(`✅ Set ${config.section}/${config.key} = ${config.value}`);
            } catch (err: any) {
                // Try alternate node name if default fails, some images use different node names
                if (err.response?.status === 404) {
                    // Try getting node name first
                    try {
                        const membership = await axios.get(`${COUCHDB_URL}/_membership`, { auth });
                        const nodeName = membership.data.all_nodes[0];
                        const nodeUrl = `${COUCHDB_URL}/_node/${nodeName}/_config/${config.section}/${config.key}`;
                        await axios.put(nodeUrl, config.value, { auth });
                        console.log(`✅ Set (node: ${nodeName}) ${config.section}/${config.key} = ${config.value}`);
                    } catch (subErr) {
                        console.error(`❌ Failed to set ${config.key}:`, subErr.message);
                    }
                } else {
                    console.error(`❌ Failed to set ${config.key}:`, err.message);
                }
            }
        }
        console.log('✨ CORS configuration complete. Please restart your browser/app page.');
    } catch (err: any) {
        console.error('❌ General error:', err.message);
    }
}

enableCors();
