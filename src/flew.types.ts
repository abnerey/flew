export type Definition = {
    success?: FlewDefinition,
    transformSuccess?: any,
    transformError?: any,
    fromResult?: boolean,
    handleError?: any
};

export type FlewDefinition = {
    body?: string,
    header?: string,
    translatable?: boolean,
    congruent?: string
};

export type ComponentDefinition = {
    prefix?: string,
    busy?: boolean
};

export type Mixin = {
    mixin: any,
    value?: any
};

export type FlewMessageDefinition = {
    body?: string,
    header?: string,
    congruent?: string,
    translatable?: boolean
};
