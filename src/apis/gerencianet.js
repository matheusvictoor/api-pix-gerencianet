const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { builtinModules } = require('module');

// busca o certificado
const cert = fs.readFileSync(
    path.resolve(__dirname, `../../certs/${process.env.CERT}`)
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

const authenticate = () => {
    // realiza a autenticação e gera um cobrança pix
    return axios({
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
    });
};

const GNRequest = async () => {
    const authResponse = await authenticate();
    const accessToken = authResponse.data?.access_token;

    return axios.create({
        baseURL: process.env.rota_base,
        httpsAgent: agent,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        } 
    })
}

module.exports = GNRequest;