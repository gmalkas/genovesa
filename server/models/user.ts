/// <reference path="../definitions/references.d.ts"/>
/// <reference path="../errors/application.ts"/>

module Genovesa.Models {
    var mongoose = require('mongoose');

    /**
     * MongoDB Schema for users. Provides a basic authentication
     * scheme.
     *
     * @class
     * @author Gabriel Malkas
     */
    var userSchema = new mongoose.Schema({
        /**
         * Display name of this User.
         */
        name: { type: String, required: true },

        /**
         * Email of this User.
         */
        email: { type: String, required: true, unique: true },

        /**
         * Hashed password of this User.
         */
        passwordHash: { type: String, required: true },

        /**
         * Salt used during password hashing for this User.
         */
        passwordSalt: { type: String, required: true },

        /**
         * Must be set to true during authentication.
         */
        validated: { type: Boolean },

        /**
         * User's bookmarks.
         */
        bookmarks: []
    });

    /*
     *  Validate user's name during his account creation.
     */
    userSchema.path('name').validate(function (name) {
        return /^\w{5,30}$/g.test(name);
    }, 'Invalid name');

    /*
     *  Validate user's email during his account creation.
     */
    userSchema.path('email').validate(function (email) {
        var email_regexp = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", "g");

        return email_regexp.test(email);
    }, 'Invalid email');

    /**
    * Defines a virtual setter for a password field. This allows us to
    * transparently deal with password hashing even though there is no
    * password attribute defined in the schema.
    *
    * Passwords are hashed with SHA256 and a 32-bytes salt.
    *
    * @author Gabriel Malkas
    */
    userSchema.virtual('password').set(function (password) {
        var crypto = require('crypto');

        this._password = password;
        this.passwordSalt = crypto.randomBytes(32);
        this.passwordHash = hashPassword(password, this.passwordSalt);
    });

    /**
     * Defines a virtual setter for a password confirmation field.
     */
    userSchema.virtual('passwordConfirmation').set(function (password) {
        this._passwordConfirmation = password;
    });

    /**
     * Custom middleware to check password confirmation.
     * We can't use validators since we check two virtual
     * fields.
     */
    userSchema.pre('save', function (next) {
        if (this._password == this._passwordConfirmation) {
            next();
        } else {
            var error = new mongoose.Error.ValidationError(this);
            error.errors['password'] = { type: 'confirmation' };
            next(error);
        }
    });

    userSchema.method.annotationGroups = function (callback) {
        this.model('AnnotationGroup').find({ user_id: this._id }, callback);
    };

    /**
     * Removes the sensitive information from the user object.
     *
     * @author Gabriel Malkas
     */
    userSchema.set('toJSON', {
        transform: function (doc, ret, options) {
            delete ret.passwordHash;
            delete ret.passwordSalt;
        }
    });

    /**
     * Tries to authentify the given user.
     * 
     * @param [String] email
     * @param [String] password
     * @param [Function] callback
     * @author Gabriel Malkas
     */
    userSchema.statics.authenticate = function (email, password, callback) {
        this.findOne({ email: email }, null, function (err, user) {
            if (err) {
                callback(err);
                return;
            }

            if (user) {
                if (user.passwordHash == hashPassword(password, user.passwordSalt)) {
                    if (user.validated) {
                        callback(undefined, user);
                    } else {
                        callback(new Errors.Application("Votre compte n'est pas encore valide", "unvalidatedAccount"));
                    }
                } else {
                    callback(new Errors.Application("Mot de passe incorrect", "wrongPassword"));
                }
            } else {
                callback(new Errors.Application("Utilisateur inexistant", "unknownUser"));
            }
        });
    };

    /**
     * Hash the given password.
     */
    function hashPassword(password, salt) {
        var crypto = require('crypto');

        var sha = crypto.createHash('sha256');
        sha.update(salt + password);
        return sha.digest();
    };

    export var User = mongoose.model('User', userSchema);
}
