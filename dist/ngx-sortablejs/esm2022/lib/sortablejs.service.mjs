import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
class SortablejsService {
    // original library calls the events in unnatural order
    // first the item is added, then removed from the previous array
    // this is a temporary event to work this around
    // as long as only one sortable takes place at a certain time
    // this is enough to have a single `global` event
    transfer;
    /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.4", ngImport: i0, type: SortablejsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    /** @nocollapse */ static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.1.4", ngImport: i0, type: SortablejsService });
}
export { SortablejsService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.4", ngImport: i0, type: SortablejsService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydGFibGVqcy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXNvcnRhYmxlanMvc3JjL2xpYi9zb3J0YWJsZWpzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFFM0MsTUFDYSxpQkFBaUI7SUFFNUIsdURBQXVEO0lBQ3ZELGdFQUFnRTtJQUNoRSxnREFBZ0Q7SUFDaEQsNkRBQTZEO0lBQzdELGlEQUFpRDtJQUNqRCxRQUFRLENBQXlCOzBIQVB0QixpQkFBaUI7OEhBQWpCLGlCQUFpQjs7U0FBakIsaUJBQWlCOzJGQUFqQixpQkFBaUI7a0JBRDdCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTb3J0YWJsZWpzU2VydmljZSB7XG5cbiAgLy8gb3JpZ2luYWwgbGlicmFyeSBjYWxscyB0aGUgZXZlbnRzIGluIHVubmF0dXJhbCBvcmRlclxuICAvLyBmaXJzdCB0aGUgaXRlbSBpcyBhZGRlZCwgdGhlbiByZW1vdmVkIGZyb20gdGhlIHByZXZpb3VzIGFycmF5XG4gIC8vIHRoaXMgaXMgYSB0ZW1wb3JhcnkgZXZlbnQgdG8gd29yayB0aGlzIGFyb3VuZFxuICAvLyBhcyBsb25nIGFzIG9ubHkgb25lIHNvcnRhYmxlIHRha2VzIHBsYWNlIGF0IGEgY2VydGFpbiB0aW1lXG4gIC8vIHRoaXMgaXMgZW5vdWdoIHRvIGhhdmUgYSBzaW5nbGUgYGdsb2JhbGAgZXZlbnRcbiAgdHJhbnNmZXI6IChpdGVtczogYW55W10pID0+IHZvaWQ7XG5cbn1cbiJdfQ==