export { };

const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const create = async (request, response) => {
    try {
        const { name, email, password } = request.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username: name,
            email,
            password: hashedPassword
        });

        await user.save();

        const token: string = jwt.sign({ _id: user._id }, 'shhhh_its_a_secret');
        response.cookie("t", token, { expire: Number(new Date()) + 9999 });

        return response.json({ result: 'SUCCESS' });
    } catch (error) {
        console.log(error);
        return response.status(400).json({ error });
    }
};

const update = async (request, response) => {
    try {
        const { id } = request.query;
        const user = await User.findById(id);
        console.log('editing user:', user)

        return response.json({ result: 'SUCCESS' });
    } catch (error) {
        console.log(error);
        return response.status(400).json({ error });
    }
};

const read = async (request, response) => {
    try {
        const { id } = request.query;
        const user = await User.findById(id);
        console.log('found user:', user);
        return response.json(user)
    } catch (error) {
        console.log(error);
        return response.status(400).json({ error });
    }
};

const readAll = async (request, response) => {
    try {
        const users = await User.find();
        console.log('found users:', users);
        return response.json(users);
    } catch (error) {
        console.log(error);
        return response.status(400).json({ error });
    }
};

module.exports = {
   create,
   read,
   readAll,
   update
};
