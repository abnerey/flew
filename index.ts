import {Injector, ModuleWithProviders, NgModule} from "@angular/core";

export * from './src/flew.util';
export * from './src/flew.decorators';
export * from './src/flew.default-types';
export * from './src/flew.error';
export * from './src/flew.mixin';

@NgModule({
    imports: [],
    exports: [],
    providers: []
})
export class FlewModule {
    private static injector: Injector;
    private static notifierService: any;
    private static translateService: any;
    private static providedSuccess: any;

    public static transformError: any;
    public static transformSuccess: any;

    public static getInjector(dependency: any) {
        if(FlewModule.injector) {
            return FlewModule.injector.get(dependency);
        }
    }

    public static get translate() {
        const dependency = FlewModule.getInjector(FlewModule.translateService);
        if (!dependency) {
            throw `Can't resolve translator dependency:
                    - Do you provided the dependency in AppModule(Angular Main Module)?`;
        }
        return dependency;
    }

    public static get notifier() {
        const dependency = FlewModule.getInjector(FlewModule.notifierService);
        if (!dependency) {
           throw `Can't resolve notifier dependency:
                    - Do you provided the dependency in AppModule(Angular Main Module)?`;
        }
        return dependency;
    }

    public static get success() {
        return FlewModule.providedSuccess;
    }

    static forRoot(definition): ModuleWithProviders{
        const {notifier, translate, transformError, transformSuccess, success} = definition;
        FlewModule.transformError = FlewModule.transformError || transformError;
        FlewModule.transformSuccess = FlewModule.transformSuccess || transformSuccess;
        FlewModule.notifierService = FlewModule.notifierService || notifier;
        FlewModule.translateService = FlewModule.translateService || translate;
        FlewModule.providedSuccess = FlewModule.providedSuccess || success;
        return {
            ngModule: FlewModule
        }
    }

    constructor(private injector: Injector) {
        FlewModule.injector = injector;
    }
}