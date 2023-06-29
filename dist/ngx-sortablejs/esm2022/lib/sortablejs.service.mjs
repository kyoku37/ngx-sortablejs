import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
class SortablejsService {
    // original library calls the events in unnatural order
    // first the item is added, then removed from the previous array
    // this is a temporary event to work this around
    // as long as only one sortable takes place at a certain time
    // this is enough to have a single `global` event
    transfer;
    /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.2", ngImport: i0, type: SortablejsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    /** @nocollapse */ static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.1.2", ngImport: i0, type: SortablejsService, providedIn: 'root' });
}
export { SortablejsService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.2", ngImport: i0, type: SortablejsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydGFibGVqcy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXNvcnRhYmxlanMvc3JjL2xpYi9zb3J0YWJsZWpzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFFM0MsTUFHYSxpQkFBaUI7SUFFNUIsdURBQXVEO0lBQ3ZELGdFQUFnRTtJQUNoRSxnREFBZ0Q7SUFDaEQsNkRBQTZEO0lBQzdELGlEQUFpRDtJQUNqRCxRQUFRLENBQXlCOzBIQVB0QixpQkFBaUI7OEhBQWpCLGlCQUFpQixjQUZoQixNQUFNOztTQUVQLGlCQUFpQjsyRkFBakIsaUJBQWlCO2tCQUg3QixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIFNvcnRhYmxlanNTZXJ2aWNlIHtcblxuICAvLyBvcmlnaW5hbCBsaWJyYXJ5IGNhbGxzIHRoZSBldmVudHMgaW4gdW5uYXR1cmFsIG9yZGVyXG4gIC8vIGZpcnN0IHRoZSBpdGVtIGlzIGFkZGVkLCB0aGVuIHJlbW92ZWQgZnJvbSB0aGUgcHJldmlvdXMgYXJyYXlcbiAgLy8gdGhpcyBpcyBhIHRlbXBvcmFyeSBldmVudCB0byB3b3JrIHRoaXMgYXJvdW5kXG4gIC8vIGFzIGxvbmcgYXMgb25seSBvbmUgc29ydGFibGUgdGFrZXMgcGxhY2UgYXQgYSBjZXJ0YWluIHRpbWVcbiAgLy8gdGhpcyBpcyBlbm91Z2ggdG8gaGF2ZSBhIHNpbmdsZSBgZ2xvYmFsYCBldmVudFxuICB0cmFuc2ZlcjogKGl0ZW1zOiBhbnlbXSkgPT4gdm9pZDtcblxufVxuIl19