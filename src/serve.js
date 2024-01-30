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

// raliza a autenticação e gera um cobrança pix
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
}).then((response) => {
    const accessToken = response.data?.access_token;

    const endpoint = `${process.env.rota_base}/v2/cob`;

    const dataCob = {
        calendario: {
            expiracao: 3600
        },
        valor: {
            original: '100.00'
        },
        chave: '71cdf9ba-c695-4e3c-b010-abb521a3f1be',
        solicitacaoPagador: 'Cobrança dos serviços prestados.'
    }

    const config = {
        httpsAgent:agent,
        headers:{
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    };

    axios.post(endpoint, dataCob, config).then((response) => console.log(response.data))
})