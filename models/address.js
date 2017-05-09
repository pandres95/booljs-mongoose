'use strict';

module.exports = function (app, Schema) {
    let addressSchema = new Schema({
        line1: {
            type: String,
            required: true
        },
        line2: String,
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        geolocation: {
            'type': {
                type: String,
                enum: ['Point'],
                default: 'Point',
                required: true
            },
            coordinates: [{ type: Number }]
        }
    });

    addressSchema.index({ geolocation: '2dsphere' });
    addressSchema.plugin(new app.plugins.CrudMongoose());

    return addressSchema;
};
