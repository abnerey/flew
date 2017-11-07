import {BusyMixin} from "./flew.mixin";
import {FlewMessage} from "./flew.error";
import {execute} from "./flew.util";
import {Type} from "./flew.default-types";
import {FlewModule} from "../index";
import "reflect-metadata";

export function FlewException(value: Type) {
    return function (target, key, descriptor) {
        descriptor = descriptor || Object.getOwnPropertyDescriptor(target, key);
        const {value: originalMethod} = descriptor;

        descriptor.value = function (...args: any[]) {
            try {
                return originalMethod.apply(this, args);
            } catch (error) {
                if(error instanceof FlewMessage) {
                    notify('error', error.header, error.body, error.translatable)
                }
                console.log('An error happens');
                console.log(error);
            }
            return value;
        };

        return descriptor;
    }
}

export function FlewComponent() {
    return Mixes([BusyMixin]);
}

export function FlewPromise(type: Type, clazz = null) {
    return function (target, key, descriptor) {
        descriptor = descriptor || Object.getOwnPropertyDescriptor(target, key);
        const {value: originalMethod} = descriptor;

        descriptor.value = function (...args: any[]) {
            let defaultValue = type;
            if(type === Type.CLASS) {
                defaultValue = new clazz()
            }
            return execute(originalMethod.apply(this, args), defaultValue);
        };

        return descriptor;
    }
}

/*
    Note: An async function always returns a promise in result
 */
type Definition = {success?: any, transformSuccess?: any, transformError?: any}

export function FlewHandler(definition: Definition = {}) {
    let {success: decoratorSuccess, transformSuccess, transformError} = definition;
    return function (target, key, descriptor) {
        descriptor = descriptor || Object.getOwnPropertyDescriptor(target, key);
        const {value: originalMethod} = descriptor;

        descriptor.value = function (...args: any[]) {
            const promiseResult = originalMethod.apply(this, args)
                .then(() => {
                    try {
                        let success = decoratorSuccess || FlewModule.success;
                        if (success) {
                            let transformer = transformSuccess || FlewModule.transformSuccess;
                            success = (transformer ? transformer(success) : success) as FlewMessage;
                            notify('info', success.header, success.body, success.translatable);
                        }
                    } catch (err) {
                        console.log('Unable to notify on success, review success message and transformers.');
                        console.log(err);
                    }
                })
                .catch(error => {
                    try {
                        let transformer = transformError || FlewModule.transformError;
                        error = (transformer ? transformer(error) : error) as FlewMessage;
                        if (error && error.body) {
                            notify('error', error.header, error.body, error.translatable);
                            console.log(error);
                        } else {
                            console.log('Error doesn\'t has the correct definition');
                        }
                    } catch(innError) {
                        console.log('Unable to notify, check Notifier and Translator Decorators');
                        console.log(innError);
                    }
                });
            if (this.busy === null) {
                this.busy = promiseResult;
            }
            return promiseResult;
        };

        return descriptor;
    }
}

function notify(type: string, titleMessage: string, bodyMessage: string, translate = true) {
    if (translate) {
        FlewModule.translate.get(titleMessage).subscribe(title => {
            FlewModule.translate.get(bodyMessage).subscribe(value => {
                FlewModule.notifier[type](title, value);
            });
        });
    } else {
        FlewModule.notifier[type](titleMessage, bodyMessage);
    }
}

/*
*
* Note: Generic/Abstract decorators
*
* */
export function Autowired(target: any, key: string) {
    Object.defineProperty(target, key, {
        configurable: false,
        get: () => FlewModule.getInjector(Reflect.getMetadata("design:type", target, key))
    });
}

export function Mixes(mixins: Function[]) {
    return function (constructor: Function) {
        mixins.forEach((mixin) => {
            const fieldCollector = {};
            mixin.apply(fieldCollector);
            Object.getOwnPropertyNames(fieldCollector).forEach((name) => {
                constructor.prototype[name] = fieldCollector[name];
            });

            Object.getOwnPropertyNames(mixin.prototype).forEach((name) => {
                if (name !== 'constructor') {
                    constructor.prototype[name] = mixin.prototype[name];
                }
            });
        });
    };
}

/*function instanceOfErrorSafety(object: any): object is ErrorSafety {
    return ('notify' in object);
}*/

/*
function instanceOfErrorSafety(object: any): object is ErrorSafety {
    return ('notify' in object && 'busy' in object);
}*/


/*export function Notifier() {
    return Autowired(NotificationsService);
}*/

/*export function Translator() {
    return Autowired(TranslateService);
}*/

/*export function Autowired(dependency: any) {
    return function(target: any, key: string) {
        console.log("key: "+key);
        Reflect.defineMetadata("design:hola", 'hola', target);
        //console.log(Reflect.hasOwnMetadata(key, target, key));
        //console.log(Reflect.getOwnMetadataKeys(target, key));
        console.log(Reflect.getMetadata("design:type", target, key) === dependency);
        console.log(Reflect.getMetadata("design:hola", target, key));
        Object.defineProperty(target, key, {
           configurable: false,
           get: () => FlewModule.get(dependency)
        });
    }
}*/
