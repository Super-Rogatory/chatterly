const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const PRIV_KEY =
	process.env.NODE_ENV === 'production'
		? process.env.PRIV_KEY
		: fs.readFileSync(path.resolve(__dirname, '../keys/id_rsa_priv.pem'), 'utf8');
const PUB_KEY = fs.readFileSync(path.resolve(__dirname, '../keys/id_rsa_pub.pem'), 'utf8');

function issueJWT(user) {
	const id = user.id;
	const expiresIn = 86400;

	const payload = {
		sub: id,
		name: user.name,
		iat: Date.now(),
	};

	const signedToken = jwt.sign(payload, PRIV_KEY, {
		expiresIn,
		algorithm: 'RS256',
	});

	return {
		token: 'Bearer ' + signedToken,
		expires: expiresIn,
	};
}

function authMiddleware(req, res, next) {
	const [bearer, jsonToken] = req.headers.authorization
		? req.headers.authorization.split(' ')
		: ['no bearer', 'no token'];
	if (bearer === 'Bearer' && jsonToken.match(/\S+\.\S+\.\S+/) !== null) {
		try {
			const verification = jwt.verify(jsonToken, PUB_KEY, { algorithms: ['RS256'] });
			req.jwt = verification;
			next();
		} catch (err) {
			res.status(401).json({ msg: 'you are not authorized to visit this route' });
		}
	} else {
		res.status(401).json({ msg: 'you are not authorized to visit this route' });
	}
}

module.exports = { issueJWT, authMiddleware };
