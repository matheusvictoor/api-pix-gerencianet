
# Título do Projeto

Aplicação de teste que gera cobrança, QRcode e Pix na Gerencianet


## Instalação

Instale o api-pix com npm

```bash
  cd api-pix
  npm install
```

## Para rodar

```bash
   npm run dev:start
```

## Diretório de certificado

Crie um diretório `certs` na raíz do projeto e adicione os certificados p12 e chave pública gerados na Gerencianet

## Variáveis de ambiente
| Chave | Valor |
|--|--|
|CLIENT_ID | Gerado no painel da Gerencianet|
|CLIENT_SECRET| Gerado no painel da Gerencianet|
|ROTA_BASE | https://pix-h.api.efipay.com.br (para homologação)|
|CERT|exemplo-homologacao.p12|
|NODE_ENV|production ou development|