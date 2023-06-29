import { Directive, ElementRef, EventEmitter, Inject, Input, NgZone, Optional, Output, Renderer2, } from '@angular/core';
import Sortable from 'sortablejs';
import { GLOBALS } from './globals';
import { SortablejsBindings } from './sortablejs-bindings';
import { SortablejsService } from './sortablejs.service';
import * as i0 from "@angular/core";
import * as i1 from "./sortablejs.service";
const getIndexesFromEvent = (event) => {
    if (event.hasOwnProperty('newDraggableIndex') && event.hasOwnProperty('oldDraggableIndex')) {
        return {
            new: event.newDraggableIndex,
            old: event.oldDraggableIndex,
        };
    }
    else {
        return {
            new: event.newIndex,
            old: event.oldIndex,
        };
    }
};
class SortablejsDirective {
    globalConfig;
    service;
    element;
    zone;
    renderer;
    sortablejs; // array or a FormArray
    sortablejsContainer;
    sortablejsOptions;
    sortablejsCloneFunction;
    sortableInstance;
    sortablejsInit = new EventEmitter();
    constructor(globalConfig, service, element, zone, renderer) {
        this.globalConfig = globalConfig;
        this.service = service;
        this.element = element;
        this.zone = zone;
        this.renderer = renderer;
    }
    ngOnInit() {
        if (Sortable && Sortable.create) { // Sortable does not exist in angular universal (SSR)
            this.create();
        }
    }
    ngOnChanges(changes) {
        const optionsChange = changes.sortablejsOptions;
        if (optionsChange && !optionsChange.isFirstChange()) {
            const previousOptions = optionsChange.previousValue;
            const currentOptions = optionsChange.currentValue;
            Object.keys(currentOptions).forEach(optionName => {
                if (currentOptions[optionName] !== previousOptions[optionName]) {
                    // use low-level option setter
                    this.sortableInstance.option(optionName, this.options[optionName]);
                }
            });
        }
    }
    ngOnDestroy() {
        if (this.sortableInstance) {
            this.sortableInstance.destroy();
        }
    }
    create() {
        const container = this.sortablejsContainer ? this.element.nativeElement.querySelector(this.sortablejsContainer) : this.element.nativeElement;
        setTimeout(() => {
            this.sortableInstance = Sortable.create(container, this.options);
            this.sortablejsInit.emit(this.sortableInstance);
        }, 0);
    }
    getBindings() {
        if (!this.sortablejs) {
            return new SortablejsBindings([]);
        }
        else if (this.sortablejs instanceof SortablejsBindings) {
            return this.sortablejs;
        }
        else {
            return new SortablejsBindings([this.sortablejs]);
        }
    }
    get options() {
        return { ...this.optionsWithoutEvents, ...this.overridenOptions };
    }
    get optionsWithoutEvents() {
        return { ...(this.globalConfig || {}), ...(this.sortablejsOptions || {}) };
    }
    proxyEvent(eventName, ...params) {
        this.zone.run(() => {
            if (this.optionsWithoutEvents && this.optionsWithoutEvents[eventName]) {
                this.optionsWithoutEvents[eventName](...params);
            }
        });
    }
    get isCloning() {
        return this.sortableInstance.options.group.checkPull(this.sortableInstance, this.sortableInstance) === 'clone';
    }
    clone(item) {
        // by default pass the item through, no cloning performed
        return (this.sortablejsCloneFunction || (subitem => subitem))(item);
    }
    get overridenOptions() {
        // always intercept standard events but act only in case items are set (bindingEnabled)
        // allows to forget about tracking this.items changes
        return {
            onAdd: (event) => {
                this.service.transfer = (items) => {
                    this.getBindings().injectIntoEvery(event.newIndex, items);
                    this.proxyEvent('onAdd', event);
                };
                this.proxyEvent('onAddOriginal', event);
            },
            onRemove: (event) => {
                const bindings = this.getBindings();
                if (bindings.provided) {
                    if (this.isCloning) {
                        this.service.transfer(bindings.getFromEvery(event.oldIndex).map(item => this.clone(item)));
                        // great thanks to https://github.com/tauu
                        // event.item is the original item from the source list which is moved to the target list
                        // event.clone is a clone of the original item and will be added to source list
                        // If bindings are provided, adding the item dom element to the target list causes artifacts
                        // as it interferes with the rendering performed by the angular template.
                        // Therefore we remove it immediately and also move the original item back to the source list.
                        // (event handler may be attached to the original item and not its clone, therefore keeping
                        // the original dom node, circumvents side effects )
                        this.renderer.removeChild(event.item.parentNode, event.item);
                        this.renderer.insertBefore(event.clone.parentNode, event.item, event.clone);
                        this.renderer.removeChild(event.clone.parentNode, event.clone);
                    }
                    else {
                        this.service.transfer(bindings.extractFromEvery(event.oldIndex));
                    }
                    this.service.transfer = null;
                }
                this.proxyEvent('onRemove', event);
            },
            onUpdate: (event) => {
                const bindings = this.getBindings();
                const indexes = getIndexesFromEvent(event);
                bindings.injectIntoEvery(indexes.new, bindings.extractFromEvery(indexes.old));
                this.proxyEvent('onUpdate', event);
            },
        };
    }
    /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.2", ngImport: i0, type: SortablejsDirective, deps: [{ token: GLOBALS, optional: true }, { token: i1.SortablejsService }, { token: i0.ElementRef }, { token: i0.NgZone }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
    /** @nocollapse */ static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.2", type: SortablejsDirective, selector: "[sortablejs]", inputs: { sortablejs: "sortablejs", sortablejsContainer: "sortablejsContainer", sortablejsOptions: "sortablejsOptions", sortablejsCloneFunction: "sortablejsCloneFunction" }, outputs: { sortablejsInit: "sortablejsInit" }, usesOnChanges: true, ngImport: i0 });
}
export { SortablejsDirective };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.2", ngImport: i0, type: SortablejsDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[sortablejs]',
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [GLOBALS]
                }] }, { type: i1.SortablejsService }, { type: i0.ElementRef }, { type: i0.NgZone }, { type: i0.Renderer2 }]; }, propDecorators: { sortablejs: [{
                type: Input
            }], sortablejsContainer: [{
                type: Input
            }], sortablejsOptions: [{
                type: Input
            }], sortablejsCloneFunction: [{
                type: Input
            }], sortablejsInit: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydGFibGVqcy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtc29ydGFibGVqcy9zcmMvbGliL3NvcnRhYmxlanMuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxFQUNMLE1BQU0sRUFJTixRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsR0FFVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLFFBQW1CLE1BQU0sWUFBWSxDQUFDO0FBQzdDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDbEMsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDekQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7OztBQUl2RCxNQUFNLG1CQUFtQixHQUFHLENBQUMsS0FBb0IsRUFBRSxFQUFFO0lBQ25ELElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsRUFBRTtRQUMxRixPQUFPO1lBQ0wsR0FBRyxFQUFFLEtBQUssQ0FBQyxpQkFBaUI7WUFDNUIsR0FBRyxFQUFFLEtBQUssQ0FBQyxpQkFBaUI7U0FDN0IsQ0FBQztLQUNIO1NBQU07UUFDTCxPQUFPO1lBQ0wsR0FBRyxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ25CLEdBQUcsRUFBRSxLQUFLLENBQUMsUUFBUTtTQUNwQixDQUFDO0tBQ0g7QUFDSCxDQUFDLENBQUM7QUFFRixNQUdhLG1CQUFtQjtJQW1CUztJQUM3QjtJQUNBO0lBQ0E7SUFDQTtJQXBCVixVQUFVLENBQWUsQ0FBQyx1QkFBdUI7SUFHakQsbUJBQW1CLENBQVM7SUFHNUIsaUJBQWlCLENBQVU7SUFHM0IsdUJBQXVC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RCxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNyQyxDQUFDO1lBQ0QsUUFBUSxFQUFFLENBQUMsS0FBb0IsRUFBRSxFQUFFO2dCQUNqQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ3BDLE1BQU0sT0FBTyxHQUFHLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUUzQyxRQUFRLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUM5RSxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNyQyxDQUFDO1NBQ0YsQ0FBQztJQUNKLENBQUM7MEhBbEpVLG1CQUFtQixrQkFtQlIsT0FBTzs4R0FuQmxCLG1CQUFtQjs7U0FBbkIsbUJBQW1COzJGQUFuQixtQkFBbUI7a0JBSC9CLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGNBQWM7aUJBQ3pCOzswQkFvQkksUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxPQUFPO2tKQWhCN0IsVUFBVTtzQkFEVCxLQUFLO2dCQUlOLG1CQUFtQjtzQkFEbEIsS0FBSztnQkFJTixpQkFBaUI7c0JBRGhCLEtBQUs7Z0JBSU4sdUJBQXVCO3NCQUR0QixLQUFLO2dCQUtJLGNBQWM7c0JBQXZCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBSZW5kZXJlcjIsXG4gIFNpbXBsZUNoYW5nZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgU29ydGFibGUsIHtPcHRpb25zfSBmcm9tICdzb3J0YWJsZWpzJztcbmltcG9ydCB7R0xPQkFMU30gZnJvbSAnLi9nbG9iYWxzJztcbmltcG9ydCB7U29ydGFibGVqc0JpbmRpbmdzfSBmcm9tICcuL3NvcnRhYmxlanMtYmluZGluZ3MnO1xuaW1wb3J0IHtTb3J0YWJsZWpzU2VydmljZX0gZnJvbSAnLi9zb3J0YWJsZWpzLnNlcnZpY2UnO1xuXG5leHBvcnQgdHlwZSBTb3J0YWJsZURhdGEgPSBhbnkgfCBhbnlbXTtcblxuY29uc3QgZ2V0SW5kZXhlc0Zyb21FdmVudCA9IChldmVudDogU29ydGFibGVFdmVudCkgPT4ge1xuICBpZiAoZXZlbnQuaGFzT3duUHJvcGVydHkoJ25ld0RyYWdnYWJsZUluZGV4JykgJiYgZXZlbnQuaGFzT3duUHJvcGVydHkoJ29sZERyYWdnYWJsZUluZGV4JykpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmV3OiBldmVudC5uZXdEcmFnZ2FibGVJbmRleCxcbiAgICAgIG9sZDogZXZlbnQub2xkRHJhZ2dhYmxlSW5kZXgsXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmV3OiBldmVudC5uZXdJbmRleCxcbiAgICAgIG9sZDogZXZlbnQub2xkSW5kZXgsXG4gICAgfTtcbiAgfVxufTtcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3NvcnRhYmxlanNdJyxcbn0pXG5leHBvcnQgY2xhc3MgU29ydGFibGVqc0RpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuXG4gIEBJbnB1dCgpXG4gIHNvcnRhYmxlanM6IFNvcnRhYmxlRGF0YTsgLy8gYXJyYXkgb3IgYSBGb3JtQXJyYXlcblxuICBASW5wdXQoKVxuICBzb3J0YWJsZWpzQ29udGFpbmVyOiBzdHJpbmc7XG5cbiAgQElucHV0KClcbiAgc29ydGFibGVqc09wdGlvbnM6IE9wdGlvbnM7XG5cbiAgQElucHV0KClcbiAgc29ydGFibGVqc0Nsb25lRnVuY3Rpb246IChpdGVtOiBhbnkpID0+IGFueTtcblxuICBwcml2YXRlIHNvcnRhYmxlSW5zdGFuY2U6IGFueTtcblxuICBAT3V0cHV0KCkgc29ydGFibGVqc0luaXQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChHTE9CQUxTKSBwcml2YXRlIGdsb2JhbENvbmZpZzogT3B0aW9ucyxcbiAgICBwcml2YXRlIHNlcnZpY2U6IFNvcnRhYmxlanNTZXJ2aWNlLFxuICAgIHByaXZhdGUgZWxlbWVudDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICkge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKFNvcnRhYmxlICYmIFNvcnRhYmxlLmNyZWF0ZSkgeyAvLyBTb3J0YWJsZSBkb2VzIG5vdCBleGlzdCBpbiBhbmd1bGFyIHVuaXZlcnNhbCAoU1NSKVxuICAgICAgdGhpcy5jcmVhdGUoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiB7IFtwcm9wIGluIGtleW9mIFNvcnRhYmxlanNEaXJlY3RpdmVdOiBTaW1wbGVDaGFuZ2UgfSkge1xuICAgIGNvbnN0IG9wdGlvbnNDaGFuZ2U6IFNpbXBsZUNoYW5nZSA9IGNoYW5nZXMuc29ydGFibGVqc09wdGlvbnM7XG5cbiAgICBpZiAob3B0aW9uc0NoYW5nZSAmJiAhb3B0aW9uc0NoYW5nZS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgIGNvbnN0IHByZXZpb3VzT3B0aW9uczogT3B0aW9ucyA9IG9wdGlvbnNDaGFuZ2UucHJldmlvdXNWYWx1ZTtcbiAgICAgIGNvbnN0IGN1cnJlbnRPcHRpb25zOiBPcHRpb25zID0gb3B0aW9uc0NoYW5nZS5jdXJyZW50VmFsdWU7XG5cbiAgICAgIE9iamVjdC5rZXlzKGN1cnJlbnRPcHRpb25zKS5mb3JFYWNoKG9wdGlvbk5hbWUgPT4ge1xuICAgICAgICBpZiAoY3VycmVudE9wdGlvbnNbb3B0aW9uTmFtZV0gIT09IHByZXZpb3VzT3B0aW9uc1tvcHRpb25OYW1lXSkge1xuICAgICAgICAgIC8vIHVzZSBsb3ctbGV2ZWwgb3B0aW9uIHNldHRlclxuICAgICAgICAgIHRoaXMuc29ydGFibGVJbnN0YW5jZS5vcHRpb24ob3B0aW9uTmFtZSwgdGhpcy5vcHRpb25zW29wdGlvbk5hbWVdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuc29ydGFibGVJbnN0YW5jZSkge1xuICAgICAgdGhpcy5zb3J0YWJsZUluc3RhbmNlLmRlc3Ryb3koKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZSgpIHtcbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLnNvcnRhYmxlanNDb250YWluZXIgPyB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuc29ydGFibGVqc0NvbnRhaW5lcikgOiB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudDtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zb3J0YWJsZUluc3RhbmNlID0gU29ydGFibGUuY3JlYXRlKGNvbnRhaW5lciwgdGhpcy5vcHRpb25zKTtcbiAgICAgIHRoaXMuc29ydGFibGVqc0luaXQuZW1pdCh0aGlzLnNvcnRhYmxlSW5zdGFuY2UpO1xuICAgIH0sIDApO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRCaW5kaW5ncygpOiBTb3J0YWJsZWpzQmluZGluZ3Mge1xuICAgIGlmICghdGhpcy5zb3J0YWJsZWpzKSB7XG4gICAgICByZXR1cm4gbmV3IFNvcnRhYmxlanNCaW5kaW5ncyhbXSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnNvcnRhYmxlanMgaW5zdGFuY2VvZiBTb3J0YWJsZWpzQmluZGluZ3MpIHtcbiAgICAgIHJldHVybiB0aGlzLnNvcnRhYmxlanM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgU29ydGFibGVqc0JpbmRpbmdzKFt0aGlzLnNvcnRhYmxlanNdKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldCBvcHRpb25zKCkge1xuICAgIHJldHVybiB7Li4udGhpcy5vcHRpb25zV2l0aG91dEV2ZW50cywgLi4udGhpcy5vdmVycmlkZW5PcHRpb25zfTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0IG9wdGlvbnNXaXRob3V0RXZlbnRzKCkge1xuICAgIHJldHVybiB7Li4uKHRoaXMuZ2xvYmFsQ29uZmlnIHx8IHt9KSwgLi4uKHRoaXMuc29ydGFibGVqc09wdGlvbnMgfHwge30pfTtcbiAgfVxuXG4gIHByaXZhdGUgcHJveHlFdmVudChldmVudE5hbWU6IHN0cmluZywgLi4ucGFyYW1zOiBhbnlbXSkge1xuICAgIHRoaXMuem9uZS5ydW4oKCkgPT4geyAvLyByZS1lbnRlcmluZyB6b25lLCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1NvcnRhYmxlSlMvYW5ndWxhci1zb3J0YWJsZWpzL2lzc3Vlcy8xMTAjaXNzdWVjb21tZW50LTQwODg3NDYwMFxuICAgICAgaWYgKHRoaXMub3B0aW9uc1dpdGhvdXRFdmVudHMgJiYgdGhpcy5vcHRpb25zV2l0aG91dEV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICAgIHRoaXMub3B0aW9uc1dpdGhvdXRFdmVudHNbZXZlbnROYW1lXSguLi5wYXJhbXMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgaXNDbG9uaW5nKCkge1xuICAgIHJldHVybiB0aGlzLnNvcnRhYmxlSW5zdGFuY2Uub3B0aW9ucy5ncm91cC5jaGVja1B1bGwodGhpcy5zb3J0YWJsZUluc3RhbmNlLCB0aGlzLnNvcnRhYmxlSW5zdGFuY2UpID09PSAnY2xvbmUnO1xuICB9XG5cbiAgcHJpdmF0ZSBjbG9uZTxUPihpdGVtOiBUKTogVCB7XG4gICAgLy8gYnkgZGVmYXVsdCBwYXNzIHRoZSBpdGVtIHRocm91Z2gsIG5vIGNsb25pbmcgcGVyZm9ybWVkXG4gICAgcmV0dXJuICh0aGlzLnNvcnRhYmxlanNDbG9uZUZ1bmN0aW9uIHx8IChzdWJpdGVtID0+IHN1Yml0ZW0pKShpdGVtKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0IG92ZXJyaWRlbk9wdGlvbnMoKTogT3B0aW9ucyB7XG4gICAgLy8gYWx3YXlzIGludGVyY2VwdCBzdGFuZGFyZCBldmVudHMgYnV0IGFjdCBvbmx5IGluIGNhc2UgaXRlbXMgYXJlIHNldCAoYmluZGluZ0VuYWJsZWQpXG4gICAgLy8gYWxsb3dzIHRvIGZvcmdldCBhYm91dCB0cmFja2luZyB0aGlzLml0ZW1zIGNoYW5nZXNcbiAgICByZXR1cm4ge1xuICAgICAgb25BZGQ6IChldmVudDogU29ydGFibGVFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLnNlcnZpY2UudHJhbnNmZXIgPSAoaXRlbXM6IGFueVtdKSA9PiB7XG4gICAgICAgICAgdGhpcy5nZXRCaW5kaW5ncygpLmluamVjdEludG9FdmVyeShldmVudC5uZXdJbmRleCwgaXRlbXMpO1xuICAgICAgICAgIHRoaXMucHJveHlFdmVudCgnb25BZGQnLCBldmVudCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5wcm94eUV2ZW50KCdvbkFkZE9yaWdpbmFsJywgZXZlbnQpO1xuICAgICAgfSxcbiAgICAgIG9uUmVtb3ZlOiAoZXZlbnQ6IFNvcnRhYmxlRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgYmluZGluZ3MgPSB0aGlzLmdldEJpbmRpbmdzKCk7XG5cbiAgICAgICAgaWYgKGJpbmRpbmdzLnByb3ZpZGVkKSB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNDbG9uaW5nKSB7XG4gICAgICAgICAgICB0aGlzLnNlcnZpY2UudHJhbnNmZXIoYmluZGluZ3MuZ2V0RnJvbUV2ZXJ5KGV2ZW50Lm9sZEluZGV4KS5tYXAoaXRlbSA9PiB0aGlzLmNsb25lKGl0ZW0pKSk7XG5cbiAgICAgICAgICAgIC8vIGdyZWF0IHRoYW5rcyB0byBodHRwczovL2dpdGh1Yi5jb20vdGF1dVxuICAgICAgICAgICAgLy8gZXZlbnQuaXRlbSBpcyB0aGUgb3JpZ2luYWwgaXRlbSBmcm9tIHRoZSBzb3VyY2UgbGlzdCB3aGljaCBpcyBtb3ZlZCB0byB0aGUgdGFyZ2V0IGxpc3RcbiAgICAgICAgICAgIC8vIGV2ZW50LmNsb25lIGlzIGEgY2xvbmUgb2YgdGhlIG9yaWdpbmFsIGl0ZW0gYW5kIHdpbGwgYmUgYWRkZWQgdG8gc291cmNlIGxpc3RcbiAgICAgICAgICAgIC8vIElmIGJpbmRpbmdzIGFyZSBwcm92aWRlZCwgYWRkaW5nIHRoZSBpdGVtIGRvbSBlbGVtZW50IHRvIHRoZSB0YXJnZXQgbGlzdCBjYXVzZXMgYXJ0aWZhY3RzXG4gICAgICAgICAgICAvLyBhcyBpdCBpbnRlcmZlcmVzIHdpdGggdGhlIHJlbmRlcmluZyBwZXJmb3JtZWQgYnkgdGhlIGFuZ3VsYXIgdGVtcGxhdGUuXG4gICAgICAgICAgICAvLyBUaGVyZWZvcmUgd2UgcmVtb3ZlIGl0IGltbWVkaWF0ZWx5IGFuZCBhbHNvIG1vdmUgdGhlIG9yaWdpbmFsIGl0ZW0gYmFjayB0byB0aGUgc291cmNlIGxpc3QuXG4gICAgICAgICAgICAvLyAoZXZlbnQgaGFuZGxlciBtYXkgYmUgYXR0YWNoZWQgdG8gdGhlIG9yaWdpbmFsIGl0ZW0gYW5kIG5vdCBpdHMgY2xvbmUsIHRoZXJlZm9yZSBrZWVwaW5nXG4gICAgICAgICAgICAvLyB0aGUgb3JpZ2luYWwgZG9tIG5vZGUsIGNpcmN1bXZlbnRzIHNpZGUgZWZmZWN0cyApXG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNoaWxkKGV2ZW50Lml0ZW0ucGFyZW50Tm9kZSwgZXZlbnQuaXRlbSk7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmluc2VydEJlZm9yZShldmVudC5jbG9uZS5wYXJlbnROb2RlLCBldmVudC5pdGVtLCBldmVudC5jbG9uZSk7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNoaWxkKGV2ZW50LmNsb25lLnBhcmVudE5vZGUsIGV2ZW50LmNsb25lKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXJ2aWNlLnRyYW5zZmVyKGJpbmRpbmdzLmV4dHJhY3RGcm9tRXZlcnkoZXZlbnQub2xkSW5kZXgpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnNlcnZpY2UudHJhbnNmZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wcm94eUV2ZW50KCdvblJlbW92ZScsIGV2ZW50KTtcbiAgICAgIH0sXG4gICAgICBvblVwZGF0ZTogKGV2ZW50OiBTb3J0YWJsZUV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGJpbmRpbmdzID0gdGhpcy5nZXRCaW5kaW5ncygpO1xuICAgICAgICBjb25zdCBpbmRleGVzID0gZ2V0SW5kZXhlc0Zyb21FdmVudChldmVudCk7XG5cbiAgICAgICAgYmluZGluZ3MuaW5qZWN0SW50b0V2ZXJ5KGluZGV4ZXMubmV3LCBiaW5kaW5ncy5leHRyYWN0RnJvbUV2ZXJ5KGluZGV4ZXMub2xkKSk7XG4gICAgICAgIHRoaXMucHJveHlFdmVudCgnb25VcGRhdGUnLCBldmVudCk7XG4gICAgICB9LFxuICAgIH07XG4gIH1cblxufVxuXG5pbnRlcmZhY2UgU29ydGFibGVFdmVudCB7XG4gIG9sZEluZGV4OiBudW1iZXI7XG4gIG5ld0luZGV4OiBudW1iZXI7XG4gIG9sZERyYWdnYWJsZUluZGV4PzogbnVtYmVyO1xuICBuZXdEcmFnZ2FibGVJbmRleD86IG51bWJlcjtcbiAgaXRlbTogSFRNTEVsZW1lbnQ7XG4gIGNsb25lOiBIVE1MRWxlbWVudDtcbn1cbiJdfQ==