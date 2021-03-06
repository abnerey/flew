import {Injector, ModuleWithProviders, NgModule} from '@angular/core';
import {FlewDefinitionService} from './flew-definition.service';

@NgModule({
    imports: [],
    exports: [],
    declarations: []
})
export class FlewModule {
    private static injector: Injector;
    private static definition: FlewDefinitionService;

    public static getInjector(dependency: any) {
        if (FlewModule.injector) {
            return FlewModule.injector.get(dependency);
        }
    }

    public static get translate() {
        const dependency = FlewModule.getInjector(FlewModule.definition.translate);
        if (!dependency) {
            throw new Error(`Can't resolve translator dependency:
                    - Do you provided the dependency in AppModule(Angular Main Module)?`);
        }
        return dependency;
    }

    public static get notifier() {
        const dependency = FlewModule.getInjector(FlewModule.definition.notifier);
        if (!dependency) {
            throw new Error(`Can't resolve notifier dependency:
                    - Do you provided the dependency in AppModule(Angular Main Module)?`);
        }
        return dependency;
    }

    public static get transformSuccess() {
        if (!FlewModule.definition) {
            throw new Error(`Can't resolve the definition service for FlewModule
                    - Review your forRoot implementation in AppModule(Angular Main Module)`);
        }
        return FlewModule.definition.transformSuccess;
    }

    public static get transformError() {
        if (!FlewModule.definition) {
            throw new Error(`Can't resolve the definition service for FlewModule
                    - Review your forRoot implementation in AppModule(Angular Main Module)`);
        }
        return FlewModule.definition.transformError;
    }

    public static get success() {
        return FlewModule.definition.success;
    }

    static forRoot(definition): ModuleWithProviders {
        return {
            ngModule: FlewModule,
            providers: [{provide: FlewDefinitionService, useValue: definition}]
        };
    }

    constructor(injector: Injector, definition: FlewDefinitionService) {
        FlewModule.injector = injector;
        FlewModule.definition = definition;
    }
}