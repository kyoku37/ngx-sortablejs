import { NgModule } from '@angular/core';
import { GLOBALS } from './globals';
import { SortablejsDirective } from './sortablejs.directive';
import { SortablejsService } from './sortablejs.service';
import * as i0 from "@angular/core";
class SortablejsModule {
    static forRoot(globalOptions) {
        return {
            ngModule: SortablejsModule,
            providers: [
                { provide: GLOBALS, useValue: globalOptions },
                SortablejsService,
            ],
        };
    }
    /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.4", ngImport: i0, type: SortablejsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.1.4", ngImport: i0, type: SortablejsModule, declarations: [SortablejsDirective], exports: [SortablejsDirective] });
    /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.1.4", ngImport: i0, type: SortablejsModule });
}
export { SortablejsModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.4", ngImport: i0, type: SortablejsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [SortablejsDirective],
                    exports: [SortablejsDirective],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydGFibGVqcy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtc29ydGFibGVqcy9zcmMvbGliL3NvcnRhYmxlanMubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBc0IsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVELE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDbEMsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFFM0QsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7O0FBRXpELE1BSWEsZ0JBQWdCO0lBRXBCLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBc0I7UUFDMUMsT0FBTztZQUNMLFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsU0FBUyxFQUFFO2dCQUNULEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFDO2dCQUMzQyxpQkFBaUI7YUFDbEI7U0FDRixDQUFDO0lBQ0osQ0FBQzswSEFWVSxnQkFBZ0I7MkhBQWhCLGdCQUFnQixpQkFIWixtQkFBbUIsYUFDeEIsbUJBQW1COzJIQUVsQixnQkFBZ0I7O1NBQWhCLGdCQUFnQjsyRkFBaEIsZ0JBQWdCO2tCQUo1QixRQUFRO21CQUFDO29CQUNSLFlBQVksRUFBRSxDQUFDLG1CQUFtQixDQUFDO29CQUNuQyxPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztpQkFDL0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge01vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7R0xPQkFMU30gZnJvbSAnLi9nbG9iYWxzJztcbmltcG9ydCB7U29ydGFibGVqc0RpcmVjdGl2ZX0gZnJvbSAnLi9zb3J0YWJsZWpzLmRpcmVjdGl2ZSc7XG5pbXBvcnQge09wdGlvbnN9IGZyb20gJ3NvcnRhYmxlanMnO1xuaW1wb3J0IHsgU29ydGFibGVqc1NlcnZpY2UgfSBmcm9tICcuL3NvcnRhYmxlanMuc2VydmljZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1NvcnRhYmxlanNEaXJlY3RpdmVdLFxuICBleHBvcnRzOiBbU29ydGFibGVqc0RpcmVjdGl2ZV0sXG59KVxuZXhwb3J0IGNsYXNzIFNvcnRhYmxlanNNb2R1bGUge1xuXG4gIHB1YmxpYyBzdGF0aWMgZm9yUm9vdChnbG9iYWxPcHRpb25zOiBPcHRpb25zKTogTW9kdWxlV2l0aFByb3ZpZGVyczxTb3J0YWJsZWpzTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBTb3J0YWJsZWpzTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtwcm92aWRlOiBHTE9CQUxTLCB1c2VWYWx1ZTogZ2xvYmFsT3B0aW9uc30sXG4gICAgICAgIFNvcnRhYmxlanNTZXJ2aWNlLFxuICAgICAgXSxcbiAgICB9O1xuICB9XG5cbn1cbiJdfQ==