var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Container, DOM, LogManager, ViewCompiler, ViewResources, ViewSlot, bindable, createOverrideContext, customElement, noView } from 'aurelia-framework';
import { icon, parse } from '@fortawesome/fontawesome-svg-core';
import { objectWithKey } from './utils';
import convert from './converter';
function normalizeIconArgs(icon) {
    if (icon == null) {
        return null;
    }
    if (typeof icon === 'object' && icon.prefix && icon.iconName) {
        return icon;
    }
    if (Array.isArray(icon) && icon.length === 2) {
        return { prefix: icon[0], iconName: icon[1] };
    }
    if (typeof icon === 'string') {
        return { prefix: 'fas', iconName: icon };
    }
    return null;
}
var FontAwesomeIconCustomElement = /** @class */ (function () {
    function FontAwesomeIconCustomElement($element, container, viewCompiler, resources) {
        this.$element = $element;
        this.container = container;
        this.viewCompiler = viewCompiler;
        this.resources = resources;
        /**
         * {@link https://fontawesome.com/how-to-use/on-the-web/styling/bordered-pulled-icons}
         */
        this.border = false;
        /**
         * Your own class name that will be added to the SVGElement
         */
        this.className = '';
        /**
         * {@link https://fontawesome.com/how-to-use/on-the-web/styling/fixed-width-icons}
         */
        this.fixedWidth = false;
        this.inverse = false;
        /**
         * {@link https://fontawesome.com/how-to-use/on-the-web/styling/icons-in-a-list}
         */
        this.listItem = false;
        /**
         * {@link https://fontawesome.com/how-to-use/on-the-web/styling/animating-icons}
         */
        this.pulse = false;
        /**
         * {@link https://fontawesome.com/how-to-use/on-the-web/styling/animating-icons}
         */
        this.spin = false;
        this.style = {};
        /**
         * {@link https://fontawesome.com/how-to-use/on-the-web/advanced/svg-symbols}
         */
        this.symbol = false;
        this.title = '';
        /**
         * {@link https://fontawesome.com/how-to-use/on-the-web/styling/power-transforms}
         */
        this.transform = '';
        this.classes = {};
        this.logger = LogManager.getLogger('aurelia-fontawesome');
    }
    FontAwesomeIconCustomElement.inject = function () { return [Element, Container, ViewCompiler, ViewResources]; };
    FontAwesomeIconCustomElement.prototype.bind = function (bindingContext, overrideContext) {
        var _a;
        this.bindingContext = bindingContext;
        this.overrideContext = createOverrideContext(bindingContext, overrideContext);
        this.classes = (_a = {
                'fa-border': this.border,
                'fa-flip-horizontal': this.flip === 'horizontal' || this.flip === 'both',
                'fa-flip-vertical': this.flip === 'vertical' || this.flip === 'both',
                'fa-fw': this.fixedWidth,
                'fa-inverse': this.inverse,
                'fa-li': this.listItem,
                'fa-pulse': this.pulse,
                'fa-spin': this.spin
            },
            _a["fa-" + this.size] = !!this.size,
            _a["fa-pull-" + this.pull] = !!this.pull,
            _a["fa-rotate-" + this.rotation] = !!this.rotation,
            _a);
    };
    FontAwesomeIconCustomElement.prototype.attached = function () {
        var _this = this;
        this.slot = new ViewSlot(this.$element, true);
        var iconLookup = normalizeIconArgs(this.icon);
        if (iconLookup === null) {
            this.logger.error('Bound icon prop is either unsupported or null', this.icon);
            return;
        }
        var classes = objectWithKey('classes', Object.keys(this.classes).filter(function (key) { return _this.classes[key]; }).concat(this.className.split(' ')));
        var transform = objectWithKey('transform', typeof this.transform === 'string'
            ? parse.transform(this.transform)
            : this.transform);
        var mask = objectWithKey('mask', normalizeIconArgs(this.mask));
        var renderedIcon = icon(iconLookup, __assign({}, classes, transform, mask, { attributes: this.getOtherAttributes(), styles: this.style, symbol: this.symbol, title: this.title }));
        if (!renderedIcon) {
            this.logger.error('Could not find icon', iconLookup);
        }
        else {
            this.compile(renderedIcon.abstract[0]);
        }
    };
    FontAwesomeIconCustomElement.prototype.detached = function () {
        this.slot.detached();
        this.slot.unbind();
        this.slot.removeAll();
    };
    FontAwesomeIconCustomElement.prototype.compile = function (abstract) {
        var $icon = convert(DOM.createElement.bind(DOM), abstract);
        var $template = DOM.createElement('template');
        $template.innerHTML = $icon.outerHTML;
        var factory = this.viewCompiler.compile($template, this.resources);
        var view = factory.create(this.container, this.bindingContext);
        this.slot.add(view);
        this.slot.bind(this.bindingContext, this.overrideContext);
        this.slot.attached();
    };
    /**
     * Get all non aurelia and non bound attributes and pass it to the
     * font awesome svg element
     */
    FontAwesomeIconCustomElement.prototype.getOtherAttributes = function () {
        var attrs = this.$element.attributes;
        var otherAttrs = {};
        var ignore = ['class', 'style'];
        for (var i = attrs.length - 1; i >= 0; i--) {
            if (attrs[i].name.indexOf('au-') === -1 &&
                ignore.indexOf(attrs[i].name) === -1 &&
                attrs[i].name.indexOf('.') === -1 &&
                !(attrs[i].name in this)) {
                otherAttrs[attrs[i].name] = attrs[i].value;
            }
        }
        return otherAttrs;
    };
    __decorate([
        bindable
    ], FontAwesomeIconCustomElement.prototype, "border", void 0);
    __decorate([
        bindable
    ], FontAwesomeIconCustomElement.prototype, "className", void 0);
    __decorate([
        bindable
    ], FontAwesomeIconCustomElement.prototype, "fixedWidth", void 0);
    __decorate([
        bindable
    ], FontAwesomeIconCustomElement.prototype, "flip", void 0);
    __decorate([
        bindable
    ], FontAwesomeIconCustomElement.prototype, "icon", void 0);
    __decorate([
        bindable
    ], FontAwesomeIconCustomElement.prototype, "inverse", void 0);
    __decorate([
        bindable
    ], FontAwesomeIconCustomElement.prototype, "listItem", void 0);
    __decorate([
        bindable
    ], FontAwesomeIconCustomElement.prototype, "mask", void 0);
    __decorate([
        bindable
    ], FontAwesomeIconCustomElement.prototype, "pull", void 0);
    __decorate([
        bindable
    ], FontAwesomeIconCustomElement.prototype, "pulse", void 0);
    __decorate([
        bindable
    ], FontAwesomeIconCustomElement.prototype, "rotation", void 0);
    __decorate([
        bindable
    ], FontAwesomeIconCustomElement.prototype, "size", void 0);
    __decorate([
        bindable
    ], FontAwesomeIconCustomElement.prototype, "spin", void 0);
    __decorate([
        bindable
    ], FontAwesomeIconCustomElement.prototype, "style", void 0);
    __decorate([
        bindable
    ], FontAwesomeIconCustomElement.prototype, "symbol", void 0);
    __decorate([
        bindable
    ], FontAwesomeIconCustomElement.prototype, "title", void 0);
    __decorate([
        bindable
    ], FontAwesomeIconCustomElement.prototype, "transform", void 0);
    FontAwesomeIconCustomElement = __decorate([
        customElement('font-awesome-icon'),
        noView()
    ], FontAwesomeIconCustomElement);
    return FontAwesomeIconCustomElement;
}());
export { FontAwesomeIconCustomElement };
//# sourceMappingURL=font-awesome-icon.js.map