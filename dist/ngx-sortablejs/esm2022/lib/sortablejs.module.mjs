import { NgModule } from '@angular/core';
import { GLOBALS } from './globals';
import { SortablejsDirective } from './sortablejs.directive';
import * as i0 from "@angular/core";
class SortablejsModule {
    static forRoot(globalOptions) {
        return {
            ngModule: SortablejsModule,
            providers: [
                { provide: GLOBALS, useValue: globalOptions },
            ],
        };
    }
    /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.2", ngImport: i0, type: SortablejsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.1.2", ngImport: i0, type: SortablejsModule, declarations: [SortablejsDirective], exports: [SortablejsDirective] });
    /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.1.2", ngImport: i0, type: SortablejsModule });
}
export { SortablejsModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.2", ngImport: i0, type: SortablejsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [SortablejsDirective],
                    exports: [SortablejsDirective],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydGFibGVqcy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtc29ydGFibGVqcy9zcmMvbGliL3NvcnRhYmxlanMubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBc0IsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVELE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDbEMsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7O0FBRzNELE1BSWEsZ0JBQWdCO0lBRXBCLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBc0I7UUFDMUMsT0FBTztZQUNMLFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsU0FBUyxFQUFFO2dCQUNULEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFDO2FBQzVDO1NBQ0YsQ0FBQztJQUNKLENBQUM7MEhBVFUsZ0JBQWdCOzJIQUFoQixnQkFBZ0IsaUJBSFosbUJBQW1CLGFBQ3hCLG1CQUFtQjsySEFFbEIsZ0JBQWdCOztTQUFoQixnQkFBZ0I7MkZBQWhCLGdCQUFnQjtrQkFKNUIsUUFBUTttQkFBQztvQkFDUixZQUFZLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztvQkFDbkMsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUM7aUJBQy9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0dMT0JBTFN9IGZyb20gJy4vZ2xvYmFscyc7XG5pbXBvcnQge1NvcnRhYmxlanNEaXJlY3RpdmV9IGZyb20gJy4vc29ydGFibGVqcy5kaXJlY3RpdmUnO1xuaW1wb3J0IHtPcHRpb25zfSBmcm9tICdzb3J0YWJsZWpzJztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbU29ydGFibGVqc0RpcmVjdGl2ZV0sXG4gIGV4cG9ydHM6IFtTb3J0YWJsZWpzRGlyZWN0aXZlXSxcbn0pXG5leHBvcnQgY2xhc3MgU29ydGFibGVqc01vZHVsZSB7XG5cbiAgcHVibGljIHN0YXRpYyBmb3JSb290KGdsb2JhbE9wdGlvbnM6IE9wdGlvbnMpOiBNb2R1bGVXaXRoUHJvdmlkZXJzPFNvcnRhYmxlanNNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFNvcnRhYmxlanNNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge3Byb3ZpZGU6IEdMT0JBTFMsIHVzZVZhbHVlOiBnbG9iYWxPcHRpb25zfSxcbiAgICAgIF0sXG4gICAgfTtcbiAgfVxuXG59XG4iXX0=