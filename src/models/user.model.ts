export { };

const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: 'User name already exists.',
        required: 'User name is required.'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists.',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'User email is required.'
    },
    hashed_password: String,
    salt: String,
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date
});

UserSchema.path('hashed_password').validate(function(v) {
    if (this._password && this._password.length < 6) {
        this.invalidate('password', 'Password must be at least 6 characters.')
    }
    if (this.isNew && !this._password) {
        this.invalidate('password', 'Password is required')
    }
}, null);

UserSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword: function(password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    }
};

module.exports = mongoose.model('User', UserSchema);
