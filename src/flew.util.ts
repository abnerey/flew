import {FlewMessage} from "./flew.error";

export function execute(promise, defaultValue = null) {
    return promise.then(data => {
        return [null, data];
    }).catch(err => [err, defaultValue]);
}

export function transformError(error: any): FlewMessage {
    let parsedError = (typeof error._body === "string") ? JSON.parse(error._body) : error._body;
    return new FlewMessage(parsedError.code, "error-handling.error-default");
}

export function transformSuccess(info: any) {
    return info;
}