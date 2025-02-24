const WebSocket = require('ws');
const https = require('https');
const fs = require('fs');

// Configuração do servidor HTTPS com certificados (substitua pelos seus caminhos de certificado)
const server = https.createServer({
    cert: fs.readFileSync('/caminho/para/seu/fullchain.pem'), // Ex.: Let’s Encrypt
    key: fs.readFileSync('/caminho/para/seu/privkey.pem')
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Cliente conectado ao proxy');
    const client = new WebSocket('ws://nearfish.ddns.net:1890');

    client.on('open', () => {
        console.log('Conectado ao broker original');
    });

    client.on('message', (data) => {
        ws.send(data); // Repassa mensagens do broker para o cliente
    });

    ws.on('message', (data) => {
        client.send(data); // Repassa mensagens do cliente para o broker
    });

    client.on('close', () => {
        ws.close();
        console.log('Conexão com o broker fechada');
    });

    ws.on('close', () => {
        client.close();
        console.log('Cliente desconectado do proxy');
    });
});

server.listen(1891, () => { // Porta WSS, por exemplo, 1891
    console.log('Proxy WSS rodando na porta 1891');
});