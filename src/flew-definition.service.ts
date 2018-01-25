export class FlewDefinitionService {
    notifier: any;
    translate?: any;
    transformError?: any;
    transformSuccess?: any;
    success?: any;

    constructor(notifier?: any,
                translate?: any,
                transformError?: any,
                transformSuccess?: any,
                success?: any) {
        this.notifier = notifier;
        this.translate = translate;
        this.transformSuccess = transformSuccess;
        this.transformError = transformError;
        this.success = success;
    }
}

