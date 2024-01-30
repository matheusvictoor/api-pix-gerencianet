if(process.env.node_env !== 'production'){
    require('dotenv').config()
}

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https')

// busca o certificado
const cert = fs.readFileSync(
    path.resolve(__dirname, `../certs/${process.env.CERT}`)
);

// para carregar o certifado https
const agent = new https.Agent({
    pfx: cert,
    passphrase: ''
});

// converte as credenciais em ums string na base64
const credentials = Buffer.from(
    `${process.env.client_id}:${process.env.client_secret}`
).toString('base64');

// requisão https do tipo POST 
axios({
    method: 'POST',
    url: `${process.env.rota_base}/oauth/token`,
    headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json'
    },
    httpsAgent: agent, // Passando o certificado https
    data: {
        grant_type: 'client_credentials'
    }
}).then((response) => console.log(response.data))