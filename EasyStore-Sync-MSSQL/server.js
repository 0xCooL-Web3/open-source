/*
    refer:
        https://sebhastian.com/node-js-redirect/
        https://www.w3schools.com/nodejs/nodejs_http.asp
*/
const bodyParser = require('body-parser');
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();
const port = 1111;


app.use(bodyParser.json({}));

app.get('/', (req, res) => {
    let client_id = 'appcbb40f5a998fbb9b';
    let scopes = 'read_orders,write_orders,read_products,write_products';
    let redirect_uri = 'http://greenstem.dyndns.org:1111/callback';
    let uri = `https://admin.easystore.co/oauth/authorize?app_id=${client_id}&scope=${scopes}&redirect_uri=${redirect_uri}`;
    
    res.writeHead(302, {
        'Location': uri
    });

    res.end();
});

app.get('/callback', (req, res) => {
    let url = `https://${req.query.shop}/api/3.0/oauth/access_token.json`;
    let client_id = 'appcbb40f5a998fbb9b';
    let client_secret = '1c34de0cea4b152aa433574ff86b85d1';

    axios
        .post(url, {
            client_id: client_id,
            client_secret: client_secret,
            code: req.query.code
        })
        .then(result => {
            console.log(`shop_domain:${req.query.shop}, access_token: ${result.data.access_token}`);

            fs.writeFileSync('setting/shop_domain.txt', req.query.shop);
            fs.writeFileSync('setting/access_token.txt', result.data.access_token);

            res.writeHead(302, {
                'Location': 'https://admin.easystore.co/apps/installed'
            });
        })
        .catch(err => console.error(err));
});

app.listen(port, () => {
	console.log(`Server running at http://greenstem.dyndns.org:${port}`);
});