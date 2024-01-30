const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');

// busca o certificado
const cert = fs.readFileSync(
    path.resolve(__dirname, `../../certs/${process.env.CERT}`)
);

// para carregar o certifado https
const agent = new https.Agent({
    pfx: cert,
    passphrase: ''
});

const authenticate = ({clientID, clientSecret}) => {
    // converte as credenciais em ums string na base64
    const credentials = Buffer.from(
        `${clientID}:${clientSecret}`
    ).toString('base64');

    // realiza a autenticação e gera um cobrança pix
    return axios({
        method: 'POST',
        url: `${process.env.ROTA_BASE}/oauth/token`,
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

const GNRequest = async (credentials) => {
    const authResponse = await authenticate(credentials);
    const accessToken = authResponse.data?.access_token;

    return axios.create({
        baseURL: process.env.ROTA_BASE,
        httpsAgent: agent,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        } 
    })
}

module.exports = GNRequest;