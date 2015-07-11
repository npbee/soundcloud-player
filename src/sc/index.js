export function stream() {
    return SC.stream.apply(SC, arguments);
}

export function get(uri, opts = {}) {
    return new Promise(function(resolve, reject) {
        SC.get(uri, opts, function(thing, err) {
            if (err) { return reject(err); }

            resolve(thing);
        });
    });
}

export function init(clientId) {
    return SC.initialize({
        client_id: clientId
    });
};
