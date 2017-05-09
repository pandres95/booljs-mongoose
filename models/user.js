'use strict';

module.exports = function (app, Schema, connection) {
    const AppError      = new app.plugins.Error();
    const PrivatePaths  = app.utilities['mongoose-private-paths'];
    const DeepPopulate  = app.utilities['mongoose-deep-populate'];
    const Bcrypt        = app.utilities.bcryptjs;

    const userSchema = new Schema({
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String
        },
        mail: {
            type: String,
            required: true,
            index: { unique: true }
        },
        password: {
            type: String,
            required: true,
            private: true
        },
        roles: [{
            type: String,
            ref: 'Role'
        }],
        address: {
            type: Schema.Types.Mixed,
            ref: 'Address'
        },
        phone: String,
        mobile: String
    }, { timestamps: true });

    userSchema.plugin(DeepPopulate(app.utilities.mongoose));
    userSchema.plugin(PrivatePaths);
    userSchema.plugin(new app.plugins.CrudMongoose());

    userSchema.path('mail').set(function (value) {
        return value.toLowerCase();
    });

    userSchema.statics.list = function (query, fields, options) {
        return (this
            .find(query, fields, options)
            .deepPopulate('roles address')
        ).exec();
    };

    userSchema.statics.__find = async function (id, mail) {
        let query = this.findOne({
            $or: [ { _id: id }, { mail: mail } ]
        }).populate('roles address');

        let result = await query.exec();

        if(!result) {
            throw new AppError(404, 'E_NOT_FOUND');
        }
        return result;
    };

    userSchema.statics.findId = function (id) {
        return this.__find(id);
    };

    userSchema.statics.findMail = function (mail) {
        return this.__find(null, mail.toLowerCase());
    };

    userSchema.methods.login = async function (password) {
        return new Promise((res, rej) => Bcrypt.compare(password, this.password,
            (err, match) => err === null && match ? res(this) : rej(err)
        ));
    };

    userSchema.methods.hashPassword = async function () {
        let salt = await new Promise((resolve, reject) => Bcrypt.genSalt(
            (err, salt) => err == null ? resolve(salt) : reject(err)
        ));
        let hash = await new Promise((res, rej) => Bcrypt.hash(
            this.password, salt, (err, s) => err == null ? res(s) : rej(err)
        ));
        this.password = hash;
    };

    userSchema.pre('validate', async function (next) {
        const User          = connection.models.User;
        const Address       = connection.models.Address;
        const Attachment    = connection.models.Attachment;

        let _user;

        try {
            _user = await User.__find(this.id, this.mail);
        } catch(e) { _user = undefined; }

        try {
            let address;

            if(this.isNew) {
                if(_user !== undefined && this.mail === _user.mail) {
                    throw new AppError(400, 'E_DUPLICATED_MAIL');
                }

                if(this.isModified('address') && _.isObject(this.address)) {
                    this.address = (await Address.insert(this.address))._id;
                }
            } else {
                if(_user === undefined) {
                    throw new AppError(404, 'E_NOT_FOUND');
                }

                if(this.isModified('address') && _.isObject(this.address)) {
                    this.address = (_user.address &&
                        await Address.modify(_user.address, this.address)
                    ) || await Address.insert(this.address);
                }
            }

            if(this.isModified('password')) {
                await this.hashPassword();
            }
        } catch(error) {
            return next(error);
        } finally {

            return next();
        }
    });

    return userSchema;

};
