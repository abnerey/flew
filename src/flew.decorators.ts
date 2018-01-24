import {BusyMixin, PrefixMixin} from './flew.mixin';
import {FlewMessage} from "./flew.error";
import {execute} from "./flew.util";
import {Type} from "./flew.default-types";
import {FlewModule} from "../index";
import {ComponentDefinition, Definition, Mixin} from './flew.types';

export function FlewException(value: Type) {
    return function (target, key, descriptor) {
        descriptor = descriptor || Object.getOwnPropertyDescriptor(target, key);
        const {value: originalMethod} = descriptor;

        descriptor.value = function (...args: any[]) {
            try {
                return originalMethod.apply(this, args);
            } catch (error) {
                if (fakeInstanceOf(error)) {
                    notify('error', error.body, error.header, error.translatable, this['prefix']);
                }
                console.log('===> FLEW EXCEPTION: ');
                console.log(error);
            }
            return value;
        };

        return descriptor;
    };
}

export function FlewComponent(definition: ComponentDefinition = {}) {
    const {prefix, busy = true} = definition;
    const toMix: Mixin[] = [];
    if (busy) {
        toMix.push({mixin: BusyMixin} as Mixin);
    }
    if (prefix) {
        toMix.push({mixin: PrefixMixin, value: {prefix}} as Mixin);
    }
    return Mixes(toMix);
}

export function FlewPromise(type?: Type, payload: any = null) {
    return function (target, key, descriptor) {
        descriptor = descriptor || Object.getOwnPropertyDescriptor(target, key);
        const {value: originalMethod} = descriptor;

        descriptor.value = function(...args: any[]) {
            let defaultValue = type;
            if (type === Type.CLASS) {
                defaultValue = new payload();
            } else if (type === Type.CUSTOM) {
                defaultValue = payload;
            }
            return execute(originalMethod.apply(this, args), defaultValue);
        };

        return descriptor;
    };
}

export function FlewHandler(definition: Definition = {}) {
    const {success: decoratorSuccess, transformSuccess, transformError, handleError} = definition;
    return function (target, key, descriptor) {
        descriptor = descriptor || Object.getOwnPropertyDescriptor(target, key);
        const {value: originalMethod} = descriptor;

        descriptor.value = function (...args: any[]) {
            const promiseResult = originalMethod.apply(this, args)
                .then((result) => {
                    try {
                        let success = decoratorSuccess || FlewModule.success || result;

                        if (success) {
                            success.header = success.congruent || success.header;
                            success.body = success.congruent || success.body;
                            const transformer = transformSuccess || FlewModule.transformSuccess;
                            success = (transformer && !fakeInstanceOf(success) ? transformer(success) : success) as FlewMessage;
                            notify('info', success.header, success.body, success.translatable, (success.congruent && this['prefix']));
                        }
                    } catch (err) {
                        console.log('Unable to notify on success, review success message and transformers.');
                        console.log(err);
                    }
                })
                .catch(error => {
                    if (handleError) {
                        handleError.apply(this, error);
                    } else {
                        try {
                            const transformer = transformError || FlewModule.transformError;
                            error = (transformer && !fakeInstanceOf(error) ? transformer(error) : error) as FlewMessage;
                            if (error && error.body) {
                                notify('error', error.header, error.body, error.translatable, (error.congruent && this['prefix']));
                            } else {
                                console.log('Error hasn\'t the correct definition.');
                                console.log(error);
                            }
                        } catch (innError) {
                            console.log('Unable to notify, check Notifier and Translator Decorators.');
                        }
                    }
                });
            this['busy'] = promiseResult;
            return promiseResult;
        };

        return descriptor;
    };
}

function notify(type: string, titleMessage: string, bodyMessage: string, translate = true, prefix?: string) {
    if (translate) {
        titleMessage = prefix ? `${prefix}.header.${titleMessage}` : titleMessage;
        bodyMessage = prefix ? `${prefix}.body.${bodyMessage}` : bodyMessage;
        FlewModule.translate.get(titleMessage).subscribe(title => {
            FlewModule.translate.get(bodyMessage).subscribe(value => {
                FlewModule.notifier[type](title, value);
            });
        });
    } else {
        FlewModule.notifier[type](titleMessage, bodyMessage);
    }
}

function fakeInstanceOf(error): boolean {
    return error && (error.hasOwnProperty('header') && error.hasOwnProperty('body') && error.hasOwnProperty('translatable') || error.hasOwnProperty('congruent'));
}

/*
*
* Note: Generic/Abstract decorators
*
* */
export function Mixes(mixins: Mixin[]) {
    return function (constructor) {
        mixins.forEach(({mixin, value}) => {
            const fieldCollector = {};
            mixin.apply(fieldCollector);
            if (value) {
                for (const val in fieldCollector) {
                    if (fieldCollector.hasOwnProperty(val)) {
                        fieldCollector[val] = value[val];
                    }
                }
            }
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
