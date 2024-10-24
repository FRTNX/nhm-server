export { };

// const { config } = require('./../../config/config');
const User = require('../models/user.model');

const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const bcrypt = require('bcrypt');
const secretKey = 'sabela-uyabizwa';

// import { IRequest, IResponse } from './controller.types';

const signin = async (request, response) => {
    try {
        const { email, password } = request.body;

        let user = await User.findOne({ email });

        if (!user) {
            return response.status('401').json({ error: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return response.status('401').send({
                error: "Email and password don't match."
            });
        }

        const token = jwt.sign({ _id: user._id }, secretKey, {
            expiresIn: '1h'
        });

        response.cookie("t", token, { expire: Number(new Date()) + 9999 });

        return response.json({ token, user: { _id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.log(err);
        return response.status('401').json({ error: "Could not sign in" });
    }
};

const signout = (request, response) => {
    response.clearCookie("t");
    return response.status('200').json({
        message: "signed out"
    });
};

const authorise = async (request, response, next) => {
    try {
        const token = request.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, secretKey);
        request.userData = {
            userId: decodedToken.userId,
            email: decodedToken.email
        };
        next();
    } catch (error) {
        console.log(error);
        return response.status(400).json({ error: 'AUTHORIZATION_FAILED' });
    }
}

const requireSignin = expressJwt({
    secret: secretKey,
    userProperty: 'auth'
});

const hasAuthorization = (request, response, next) => {
    const authorized = request.profile && request.auth && request.profile._id == request.auth._id;
    if (!(authorized)) {
        return response.status('403').json({
            error: "User is not authorized"
        })
    };
    next();
};

module.exports = {
    signin,
    signout,
    requireSignin,
    hasAuthorization
};
