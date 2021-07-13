/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: icxl
 * @Date: 2021-07-12 15:09:46
 * @LastEditors: icxl
 * @LastEditTime: 2021-07-12 19:20:23
 */
import express from 'express'
const app = express();
const https = require('httpolyglot')
const fs = require('fs')
import config from './configs/config';
import * as path from 'path';

import SocketImpl from './sockets/main';


const options = {
    key: fs.readFileSync(path.join(__dirname, config.sslKey), 'utf-8'),
    cert: fs.readFileSync(path.join(__dirname, config.sslCrt), 'utf-8')
}
const httpsServer = https.createServer(options, app)


httpsServer.listen(config.listenPort, () => {
    console.log('listening https ' + config.listenPort)
})

let socketImpl = new SocketImpl(httpsServer);





app.get('/', function (req, res) {

    res.send('hello world1');
});


