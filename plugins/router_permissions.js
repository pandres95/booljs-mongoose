'use strict';

module.exports = function () {

    return (permissions, actions) => actions[(_
        .chain(permissions)
        .intersection(Object.keys(actions))
    ).first().value()];
};
