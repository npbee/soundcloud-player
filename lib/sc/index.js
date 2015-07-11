"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.stream = stream;
exports.get = get;
exports.init = init;

function stream() {
    return SC.stream.apply(SC, arguments);
}

function get(uri) {
    var opts = arguments[1] === undefined ? {} : arguments[1];

    return new Promise(function (resolve, reject) {
        SC.get(uri, opts, function (thing, err) {
            if (err) {
                return reject(err);
            }

            resolve(thing);
        });
    });
}

function init(clientId) {
    return SC.initialize({
        client_id: clientId
    });
}

;