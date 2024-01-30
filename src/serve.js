if(process.env.node_env !== 'production'){
    require('dotenv').config()
}

const express = require('express');
const GNRequest = require('./apis/gerencianet');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'src/views');

const reqGNAlready = GNRequest({
    clientID: process.env.client_id,
    clientSecret: process.env.client_secret
});

app.get('/', async (req, res) => {
    const reqGN = await reqGNAlready;
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

    const cobResponse = await reqGN.post('/v2/cob', dataCob);
    const qrcodeResponse = await reqGN.get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`);

    res.render('qrcode',{ qrcodeImage: qrcodeResponse.data.imagemQrcode });
})

app.get('/cobrancas', async(req, res) => {
    const reqGN = await reqGNAlready;

    const cobResponse = await reqGN.get('/v2/cob?inicio=2024-01-28T10:00:00Z&fim=2024-01-30T14:00:00Z');
    res.send(cobResponse.data);
})

app.listen(8000, () => {
    console.log('running')
})
