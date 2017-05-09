'use strict';

module.exports = function (app) {
    const AppError  = new app.plugins.Error();

    return function (Schema, options) {

        Schema.statics.__findById = async function(id) {
            let object = await this.findOne({ _id: id }).exec();

            if(object === undefined || object === null) {
                throw new AppError(404, 'E_NOT_FOUND');
            }

            return object;
        };

        Schema.statics.getCount = function (filter) {
            return this.count(filter).exec();
        };

        Schema.statics.list = function (query, fields, projection) {
            return this.find(query, fields, projection).exec();
        };

        Schema.statics.findId = function (id) {
            return this.__findById(id);
        };

        Schema.statics.insert = async function (object) {
            if(object._id !== undefined && options.customId === undefined) {
                throw new AppError(400, 'E_INVALID_ID_FIELD');
            }

            let response = await this.create(object);
            return this.findId(response._id);
        };

        Schema.statics.modify = async function (id, data) {
            let object = await this.__findById(id);

            _.chain(data).omit([
                '__v', '_id'
            ]).mapObject((value, key) => (object[key] = value));

            await object.save();
            return this.findId(id);
        };

        Schema.statics.delete = async function (id) {
            return (await this.__findById(id)).remove();
        };

    };
};
