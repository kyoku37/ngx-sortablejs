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
    /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.4", ngImport: i0, type: SortablejsDirective, deps: [{ token: GLOBALS, optional: true }, { token: i1.SortablejsService }, { token: i0.ElementRef }, { token: i0.NgZone }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
    /** @nocollapse */ static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.4", type: SortablejsDirective, selector: "[sortablejs]", inputs: { sortablejs: "sortablejs", sortablejsContainer: "sortablejsContainer", sortablejsOptions: "sortablejsOptions", sortablejsCloneFunction: "sortablejsCloneFunction" }, outputs: { sortablejsInit: "sortablejsInit" }, usesOnChanges: true, ngImport: i0 });
}
export { SortablejsDirective };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.4", ngImport: i0, type: SortablejsDirective, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydGFibGVqcy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtc29ydGFibGVqcy9zcmMvbGliL3NvcnRhYmxlanMuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxFQUNMLE1BQU0sRUFJTixRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsR0FHVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLFFBQW1CLE1BQU0sWUFBWSxDQUFDO0FBQzdDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDbEMsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDekQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7OztBQUl2RCxNQUFNLG1CQUFtQixHQUFHLENBQUMsS0FBb0IsRUFBRSxFQUFFO0lBQ25ELElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsRUFBRTtRQUMxRixPQUFPO1lBQ0wsR0FBRyxFQUFFLEtBQUssQ0FBQyxpQkFBaUI7WUFDNUIsR0FBRyxFQUFFLEtBQUssQ0FBQyxpQkFBaUI7U0FDN0IsQ0FBQztLQUNIO1NBQU07UUFDTCxPQUFPO1lBQ0wsR0FBRyxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ25CLEdBQUcsRUFBRSxLQUFLLENBQUMsUUFBUTtTQUNwQixDQUFDO0tBQ0g7QUFDSCxDQUFDLENBQUM7QUFFRixNQUdhLG1CQUFtQjtJQW1CUztJQUM3QjtJQUNBO0lBQ0E7SUFDQTtJQXBCVixVQUFVLENBQWUsQ0FBQyx1QkFBdUI7SUFHakQsbUJBQW1CLENBQVM7SUFHNUIsaUJBQWlCLENBQVU7SUFHM0IsdUJBQXVC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RCxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNyQyxDQUFDO1lBQ0QsUUFBUSxFQUFFLENBQUMsS0FBb0IsRUFBRSxFQUFFO2dCQUNqQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ3BDLE1BQU0sT0FBTyxHQUFHLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUUzQyxRQUFRLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUM5RSxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNyQyxDQUFDO1NBQ0YsQ0FBQztJQUNKLENBQUM7MEhBbEpVLG1CQUFtQixrQkFtQlIsT0FBTzs4R0FuQmxCLG1CQUFtQjs7U0FBbkIsbUJBQW1COzJGQUFuQixtQkFBbUI7a0JBSC9CLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGNBQWM7aUJBQ3pCOzswQkFvQkksUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxPQUFPO2tKQWhCN0IsVUFBVTtzQkFEVCxLQUFLO2dCQUlOLG1CQUFtQjtzQkFEbEIsS0FBSztnQkFJTixpQkFBaUI7c0JBRGhCLEtBQUs7Z0JBSU4sdUJBQXVCO3NCQUR0QixLQUFLO2dCQUtJLGNBQWM7c0JBQXZCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBSZW5kZXJlcjIsXG4gIFNpbXBsZUNoYW5nZSxcbiAgU2ltcGxlQ2hhbmdlcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgU29ydGFibGUsIHtPcHRpb25zfSBmcm9tICdzb3J0YWJsZWpzJztcbmltcG9ydCB7R0xPQkFMU30gZnJvbSAnLi9nbG9iYWxzJztcbmltcG9ydCB7U29ydGFibGVqc0JpbmRpbmdzfSBmcm9tICcuL3NvcnRhYmxlanMtYmluZGluZ3MnO1xuaW1wb3J0IHtTb3J0YWJsZWpzU2VydmljZX0gZnJvbSAnLi9zb3J0YWJsZWpzLnNlcnZpY2UnO1xuXG5leHBvcnQgdHlwZSBTb3J0YWJsZURhdGEgPSBhbnkgfCBhbnlbXTtcblxuY29uc3QgZ2V0SW5kZXhlc0Zyb21FdmVudCA9IChldmVudDogU29ydGFibGVFdmVudCkgPT4ge1xuICBpZiAoZXZlbnQuaGFzT3duUHJvcGVydHkoJ25ld0RyYWdnYWJsZUluZGV4JykgJiYgZXZlbnQuaGFzT3duUHJvcGVydHkoJ29sZERyYWdnYWJsZUluZGV4JykpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmV3OiBldmVudC5uZXdEcmFnZ2FibGVJbmRleCxcbiAgICAgIG9sZDogZXZlbnQub2xkRHJhZ2dhYmxlSW5kZXgsXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmV3OiBldmVudC5uZXdJbmRleCxcbiAgICAgIG9sZDogZXZlbnQub2xkSW5kZXgsXG4gICAgfTtcbiAgfVxufTtcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3NvcnRhYmxlanNdJyxcbn0pXG5leHBvcnQgY2xhc3MgU29ydGFibGVqc0RpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuXG4gIEBJbnB1dCgpXG4gIHNvcnRhYmxlanM6IFNvcnRhYmxlRGF0YTsgLy8gYXJyYXkgb3IgYSBGb3JtQXJyYXlcblxuICBASW5wdXQoKVxuICBzb3J0YWJsZWpzQ29udGFpbmVyOiBzdHJpbmc7XG5cbiAgQElucHV0KClcbiAgc29ydGFibGVqc09wdGlvbnM6IE9wdGlvbnM7XG5cbiAgQElucHV0KClcbiAgc29ydGFibGVqc0Nsb25lRnVuY3Rpb246IChpdGVtOiBhbnkpID0+IGFueTtcblxuICBwcml2YXRlIHNvcnRhYmxlSW5zdGFuY2U6IGFueTtcblxuICBAT3V0cHV0KCkgc29ydGFibGVqc0luaXQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChHTE9CQUxTKSBwcml2YXRlIGdsb2JhbENvbmZpZzogT3B0aW9ucyxcbiAgICBwcml2YXRlIHNlcnZpY2U6IFNvcnRhYmxlanNTZXJ2aWNlLFxuICAgIHByaXZhdGUgZWxlbWVudDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICkge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKFNvcnRhYmxlICYmIFNvcnRhYmxlLmNyZWF0ZSkgeyAvLyBTb3J0YWJsZSBkb2VzIG5vdCBleGlzdCBpbiBhbmd1bGFyIHVuaXZlcnNhbCAoU1NSKVxuICAgICAgdGhpcy5jcmVhdGUoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3Qgb3B0aW9uc0NoYW5nZTogU2ltcGxlQ2hhbmdlID0gY2hhbmdlcy5zb3J0YWJsZWpzT3B0aW9ucztcblxuICAgIGlmIChvcHRpb25zQ2hhbmdlICYmICFvcHRpb25zQ2hhbmdlLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgY29uc3QgcHJldmlvdXNPcHRpb25zOiBPcHRpb25zID0gb3B0aW9uc0NoYW5nZS5wcmV2aW91c1ZhbHVlO1xuICAgICAgY29uc3QgY3VycmVudE9wdGlvbnM6IE9wdGlvbnMgPSBvcHRpb25zQ2hhbmdlLmN1cnJlbnRWYWx1ZTtcblxuICAgICAgT2JqZWN0LmtleXMoY3VycmVudE9wdGlvbnMpLmZvckVhY2gob3B0aW9uTmFtZSA9PiB7XG4gICAgICAgIGlmIChjdXJyZW50T3B0aW9uc1tvcHRpb25OYW1lXSAhPT0gcHJldmlvdXNPcHRpb25zW29wdGlvbk5hbWVdKSB7XG4gICAgICAgICAgLy8gdXNlIGxvdy1sZXZlbCBvcHRpb24gc2V0dGVyXG4gICAgICAgICAgdGhpcy5zb3J0YWJsZUluc3RhbmNlLm9wdGlvbihvcHRpb25OYW1lLCB0aGlzLm9wdGlvbnNbb3B0aW9uTmFtZV0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5zb3J0YWJsZUluc3RhbmNlKSB7XG4gICAgICB0aGlzLnNvcnRhYmxlSW5zdGFuY2UuZGVzdHJveSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlKCkge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuc29ydGFibGVqc0NvbnRhaW5lciA/IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5zb3J0YWJsZWpzQ29udGFpbmVyKSA6IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnNvcnRhYmxlSW5zdGFuY2UgPSBTb3J0YWJsZS5jcmVhdGUoY29udGFpbmVyLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgdGhpcy5zb3J0YWJsZWpzSW5pdC5lbWl0KHRoaXMuc29ydGFibGVJbnN0YW5jZSk7XG4gICAgfSwgMCk7XG4gIH1cblxuICBwcml2YXRlIGdldEJpbmRpbmdzKCk6IFNvcnRhYmxlanNCaW5kaW5ncyB7XG4gICAgaWYgKCF0aGlzLnNvcnRhYmxlanMpIHtcbiAgICAgIHJldHVybiBuZXcgU29ydGFibGVqc0JpbmRpbmdzKFtdKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc29ydGFibGVqcyBpbnN0YW5jZW9mIFNvcnRhYmxlanNCaW5kaW5ncykge1xuICAgICAgcmV0dXJuIHRoaXMuc29ydGFibGVqcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBTb3J0YWJsZWpzQmluZGluZ3MoW3RoaXMuc29ydGFibGVqc10pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0IG9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHsuLi50aGlzLm9wdGlvbnNXaXRob3V0RXZlbnRzLCAuLi50aGlzLm92ZXJyaWRlbk9wdGlvbnN9O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgb3B0aW9uc1dpdGhvdXRFdmVudHMoKSB7XG4gICAgcmV0dXJuIHsuLi4odGhpcy5nbG9iYWxDb25maWcgfHwge30pLCAuLi4odGhpcy5zb3J0YWJsZWpzT3B0aW9ucyB8fCB7fSl9O1xuICB9XG5cbiAgcHJpdmF0ZSBwcm94eUV2ZW50KGV2ZW50TmFtZTogc3RyaW5nLCAuLi5wYXJhbXM6IGFueVtdKSB7XG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB7IC8vIHJlLWVudGVyaW5nIHpvbmUsIHNlZSBodHRwczovL2dpdGh1Yi5jb20vU29ydGFibGVKUy9hbmd1bGFyLXNvcnRhYmxlanMvaXNzdWVzLzExMCNpc3N1ZWNvbW1lbnQtNDA4ODc0NjAwXG4gICAgICBpZiAodGhpcy5vcHRpb25zV2l0aG91dEV2ZW50cyAmJiB0aGlzLm9wdGlvbnNXaXRob3V0RXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgdGhpcy5vcHRpb25zV2l0aG91dEV2ZW50c1tldmVudE5hbWVdKC4uLnBhcmFtcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGdldCBpc0Nsb25pbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuc29ydGFibGVJbnN0YW5jZS5vcHRpb25zLmdyb3VwLmNoZWNrUHVsbCh0aGlzLnNvcnRhYmxlSW5zdGFuY2UsIHRoaXMuc29ydGFibGVJbnN0YW5jZSkgPT09ICdjbG9uZSc7XG4gIH1cblxuICBwcml2YXRlIGNsb25lPFQ+KGl0ZW06IFQpOiBUIHtcbiAgICAvLyBieSBkZWZhdWx0IHBhc3MgdGhlIGl0ZW0gdGhyb3VnaCwgbm8gY2xvbmluZyBwZXJmb3JtZWRcbiAgICByZXR1cm4gKHRoaXMuc29ydGFibGVqc0Nsb25lRnVuY3Rpb24gfHwgKHN1Yml0ZW0gPT4gc3ViaXRlbSkpKGl0ZW0pO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgb3ZlcnJpZGVuT3B0aW9ucygpOiBPcHRpb25zIHtcbiAgICAvLyBhbHdheXMgaW50ZXJjZXB0IHN0YW5kYXJkIGV2ZW50cyBidXQgYWN0IG9ubHkgaW4gY2FzZSBpdGVtcyBhcmUgc2V0IChiaW5kaW5nRW5hYmxlZClcbiAgICAvLyBhbGxvd3MgdG8gZm9yZ2V0IGFib3V0IHRyYWNraW5nIHRoaXMuaXRlbXMgY2hhbmdlc1xuICAgIHJldHVybiB7XG4gICAgICBvbkFkZDogKGV2ZW50OiBTb3J0YWJsZUV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuc2VydmljZS50cmFuc2ZlciA9IChpdGVtczogYW55W10pID0+IHtcbiAgICAgICAgICB0aGlzLmdldEJpbmRpbmdzKCkuaW5qZWN0SW50b0V2ZXJ5KGV2ZW50Lm5ld0luZGV4LCBpdGVtcyk7XG4gICAgICAgICAgdGhpcy5wcm94eUV2ZW50KCdvbkFkZCcsIGV2ZW50KTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnByb3h5RXZlbnQoJ29uQWRkT3JpZ2luYWwnLCBldmVudCk7XG4gICAgICB9LFxuICAgICAgb25SZW1vdmU6IChldmVudDogU29ydGFibGVFdmVudCkgPT4ge1xuICAgICAgICBjb25zdCBiaW5kaW5ncyA9IHRoaXMuZ2V0QmluZGluZ3MoKTtcblxuICAgICAgICBpZiAoYmluZGluZ3MucHJvdmlkZWQpIHtcbiAgICAgICAgICBpZiAodGhpcy5pc0Nsb25pbmcpIHtcbiAgICAgICAgICAgIHRoaXMuc2VydmljZS50cmFuc2ZlcihiaW5kaW5ncy5nZXRGcm9tRXZlcnkoZXZlbnQub2xkSW5kZXgpLm1hcChpdGVtID0+IHRoaXMuY2xvbmUoaXRlbSkpKTtcblxuICAgICAgICAgICAgLy8gZ3JlYXQgdGhhbmtzIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS90YXV1XG4gICAgICAgICAgICAvLyBldmVudC5pdGVtIGlzIHRoZSBvcmlnaW5hbCBpdGVtIGZyb20gdGhlIHNvdXJjZSBsaXN0IHdoaWNoIGlzIG1vdmVkIHRvIHRoZSB0YXJnZXQgbGlzdFxuICAgICAgICAgICAgLy8gZXZlbnQuY2xvbmUgaXMgYSBjbG9uZSBvZiB0aGUgb3JpZ2luYWwgaXRlbSBhbmQgd2lsbCBiZSBhZGRlZCB0byBzb3VyY2UgbGlzdFxuICAgICAgICAgICAgLy8gSWYgYmluZGluZ3MgYXJlIHByb3ZpZGVkLCBhZGRpbmcgdGhlIGl0ZW0gZG9tIGVsZW1lbnQgdG8gdGhlIHRhcmdldCBsaXN0IGNhdXNlcyBhcnRpZmFjdHNcbiAgICAgICAgICAgIC8vIGFzIGl0IGludGVyZmVyZXMgd2l0aCB0aGUgcmVuZGVyaW5nIHBlcmZvcm1lZCBieSB0aGUgYW5ndWxhciB0ZW1wbGF0ZS5cbiAgICAgICAgICAgIC8vIFRoZXJlZm9yZSB3ZSByZW1vdmUgaXQgaW1tZWRpYXRlbHkgYW5kIGFsc28gbW92ZSB0aGUgb3JpZ2luYWwgaXRlbSBiYWNrIHRvIHRoZSBzb3VyY2UgbGlzdC5cbiAgICAgICAgICAgIC8vIChldmVudCBoYW5kbGVyIG1heSBiZSBhdHRhY2hlZCB0byB0aGUgb3JpZ2luYWwgaXRlbSBhbmQgbm90IGl0cyBjbG9uZSwgdGhlcmVmb3JlIGtlZXBpbmdcbiAgICAgICAgICAgIC8vIHRoZSBvcmlnaW5hbCBkb20gbm9kZSwgY2lyY3VtdmVudHMgc2lkZSBlZmZlY3RzIClcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2hpbGQoZXZlbnQuaXRlbS5wYXJlbnROb2RlLCBldmVudC5pdGVtKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuaW5zZXJ0QmVmb3JlKGV2ZW50LmNsb25lLnBhcmVudE5vZGUsIGV2ZW50Lml0ZW0sIGV2ZW50LmNsb25lKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2hpbGQoZXZlbnQuY2xvbmUucGFyZW50Tm9kZSwgZXZlbnQuY2xvbmUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNlcnZpY2UudHJhbnNmZXIoYmluZGluZ3MuZXh0cmFjdEZyb21FdmVyeShldmVudC5vbGRJbmRleCkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuc2VydmljZS50cmFuc2ZlciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnByb3h5RXZlbnQoJ29uUmVtb3ZlJywgZXZlbnQpO1xuICAgICAgfSxcbiAgICAgIG9uVXBkYXRlOiAoZXZlbnQ6IFNvcnRhYmxlRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgYmluZGluZ3MgPSB0aGlzLmdldEJpbmRpbmdzKCk7XG4gICAgICAgIGNvbnN0IGluZGV4ZXMgPSBnZXRJbmRleGVzRnJvbUV2ZW50KGV2ZW50KTtcblxuICAgICAgICBiaW5kaW5ncy5pbmplY3RJbnRvRXZlcnkoaW5kZXhlcy5uZXcsIGJpbmRpbmdzLmV4dHJhY3RGcm9tRXZlcnkoaW5kZXhlcy5vbGQpKTtcbiAgICAgICAgdGhpcy5wcm94eUV2ZW50KCdvblVwZGF0ZScsIGV2ZW50KTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG59XG5cbmludGVyZmFjZSBTb3J0YWJsZUV2ZW50IHtcbiAgb2xkSW5kZXg6IG51bWJlcjtcbiAgbmV3SW5kZXg6IG51bWJlcjtcbiAgb2xkRHJhZ2dhYmxlSW5kZXg/OiBudW1iZXI7XG4gIG5ld0RyYWdnYWJsZUluZGV4PzogbnVtYmVyO1xuICBpdGVtOiBIVE1MRWxlbWVudDtcbiAgY2xvbmU6IEhUTUxFbGVtZW50O1xufVxuIl19