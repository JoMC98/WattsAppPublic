var JWT = require('jsonwebtoken')
const SECRET = "patataUltraSecretaCovid-19"

async function createToken(identifier) {
    return await new Promise((resolve, reject) => {
        let payload = {
            sub: identifier
        };
        let options = {
            expiresIn: '1d',
            algorithm: 'HS256'
        }
        resolve(JWT.sign(payload, SECRET, options))
    });
}

async function checkToken(req, res) {
    return await new Promise((resolve, reject) => {
        if (!req.headers.authorization) {
            res.send({result: 'Token Not Found'})
        } else {
            var token = req.headers.authorization.split(" ")[1];
            try {
                let options = {
                    algorithm: 'HS256'
                }
                var payload = JWT.verify(token, SECRET, options);

                var response = {identifier: payload.sub};
                resolve(response) 
            } catch(error) {
                res.send({result: 'Token Not Valid'})
            }
        }
    });
}

module.exports = {
    createToken : createToken,
    checkToken : checkToken
};