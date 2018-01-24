export function execute(promise, defaultValue = null) {
    return promise.then(data => {
        return [null, data];
    }).catch(err => [err, defaultValue]);
}
