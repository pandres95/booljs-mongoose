'use strict';

module.exports = function () {

    return class CRUD {
        constructor(Model) {
            this.model = new Model();
        }

        count(f) {
            return this.model.getCount((f || {}).query);
        }

        list(f) {
            return (filter =>
                this.model.list(filter.query, filter.fields, filter.options)
            )(f || {});
        }

        find(id) {
            return this.model.findId(id);
        }

        insert(object) {
            return this.model.insert(object);
        }

        modify(id, object) {
            return this.model.modify(id, object);
        }

        delete(id) {
            return this.model.delete(id);
        }
    };

};
