const express = require('express');
const app = express();
const cookieparser = require('cookie-parser');

const jwt = require('jsonwebtoken');

const util = require('util');
const promisify = util.promisify;

const promisedJwtSign = promisify(jwt.sign);
const promisedJwtVerify = promisify(jwt.verify);

app.use(cookieparser());

const sectret_key = 'abrakadabra';

// token creation
app.get('/sign', async function (req,resp){
    const authToken = await promisedJwtSign ( {'payload': 'aasd' }, sectret_key);
    resp.cookie('jwt', authToken,{
        maxAge : 1000 * 60 * 60 * 24
    })
    resp.status(200).json({
        message: 'signed the jwt and sending it in the cookie'
    })
})
app.get('/verify', async function(req, resp){
    if (req.cookies && req.cookies.jwt){
        const authToken = req.cookies.jwt;
        const unlockedToken = await promisedJwtVerify(authToken, sectret_key);
        resp.status(200).json({
            message: 'jwt tokem is verified',
            'unlocked token': unlockedToken
        })
    }else{
        resp.status(400).json({
            message: 'no jwt token found'
        })
    }
})

app.listen(3000, function(){
    console.log('server running at port 3000');
})