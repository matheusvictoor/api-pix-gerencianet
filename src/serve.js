if(process.env.node_env !== 'production'){
    require('dotenv').config()
}

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { createECDH } = require('crypto');
const express = require('express');

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


const app = express();
app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.get('/', async (req, res) => {
    // raliza a autenticação e gera um cobrança pix
    const authResponse = await axios({
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

    const accessToken = authResponse.data?.access_token;

    const reqDefault = axios.create({
        baseURL: process.env.rota_base,
        httpsAgent: agent,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })

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

    const cobResponse = await reqDefault.post('/v2/cob', dataCob);
    const qrcodeResponse = await reqDefault.get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`);

    res.render('qrcode',{ qrcodeImage: qrcodeResponse.data.imagemQrcode });
})

app.listen(8000, () => {
    console.log('running')
})

