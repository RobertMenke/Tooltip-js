import $ from "jquery";

/**
 * This is a simple tooltip class for determining the placement of a tooltip within a container.
 * By calling the constructor with the new operator, the developer will get a tooltip whose center
 * is placed on the center of the HTMLElement described in the "element" parameter.
 *
 * From there, the developer can decide to autoplace the tooltip, or use the below, above, left, or right
 * methods (in combination or stand-alone) to place the tooltip relative to the container.
 *
 * Note that this class doesn't work particularly well with fixed positioned tooltips. Fortunately, it is extremely
 * easy to position fixed tooltips and you can do so by calling tooltip.$tooltip.css({top: val, left: val})
 *
 * Also, the container the tooltip is being appended to must be position: relative;
 *
 * @param {HTMLElement} element
 * @param {HTMLElement} container
 * @param {*|jQuery|HTMLElement} $tooltip
 * @constructor
 */
function Tooltip(element, container, $tooltip){

    /**
     * The element we're sticking the tooltip to
     *
     * @type {HTMLElement}
     */
    this.element        = element;

    /**
     * The container the element gets appended to - important for things like scrolling and z-index
     *
     * @type {HTMLElement}
     */
    this.container      = container;

    /**
     * The jQuery object that function as our tooltip
     *
     * @type {*}
     */
    this.$tooltip       = $tooltip;

    /**
     * The ClientRect object associated with this.element
     *
     * @type {ClientRect}
     */
    this.elRect         = this.element.getBoundingClientRect();

    /**
     * The ClientRect object associated with this.container
     *
     * @type {ClientRect}
     */
    this.contRect       = this.container.getBoundingClientRect();

    /**
     * Positioning information for the element relative to the viewport AND ITS CONTAINER
     *
     * @type {{left: number, top: number, right: number, bottom: number, width: Number, height: Number}}
     */
    this.dimension      = this.calculateViewportPosition();

    /**
     * Storage for the tooltip's dimensions relative to the container and viewport
     *
     * @type {{left: number, top: number, right: number, bottom: number, width: Number, height: Number}}
     */
    this.jqDimension    = {};

    /**
     * Height of this.element
     * @type {number}
     */
    this.elHeight       = $(this.element).outerHeight();

    /**
     * Width of this.element
     * @type {number}
     */
    this.elWidth        = $(this.element).outerWidth();

    /**
     * Height of the tooltip (TBD on init)
     * @type {number}
     */
    this.jqHeight       = 0;

    /**
     * Width of the tooltip (TBD on init)
     * @type {number}
     */
    this.jqWidth        = 0;

    /**
     * unique timestamp for click listeners so that many can fire at once
     *
     * @type {string}
     * @private
     */
    this._unique        = "";

    /**
     * handler for scrolling with a container
     * @type {string}
     * @private
     */
    this._scroll_handle = "";

    /**
     * The container we may opt to scroll with
     * @type {jQuery|string}
     * @private
     */
    this._scroll_container = "";

    //Place the tooltip smack dab in the middle of this.element
    this.placeTooltip();
}

/**
 * Places the tooltip so that the tooltip's center is exactly on this.element's
 * center - this is the first step prior to calling additional methods for placement
 * and is called when the object is constructed
 */
Tooltip.prototype.placeTooltip = function(){

    $(this.container).append(this.$tooltip);

    this.jqHeight = this.$tooltip.outerHeight();
    this.jqWidth  = this.$tooltip.outerWidth();

    //First, position the tooltip to be exactly centered over the element
    this.$tooltip.css('top', this.dimension.top - (this.$tooltip.outerHeight() / 2) + (this.elRect.height / 2))
                 .css('left', this.dimension.left - (this.$tooltip.outerWidth() / 2) + (this.elRect.width / 2));
};

/**
 * Tries to position the tooltip automatically based on the element's position
 * relative to the viewport
 *
 * @param {Number} leftCushion
 * @param {Number} topCushion
 * @returns {Tooltip}
 */
Tooltip.prototype.autoPlace = function(leftCushion, topCushion){

    const autoOffsets = this.determineOffsetFromElement();

    leftCushion = leftCushion || 0;
    topCushion  = topCushion  || 0;
    //Next, based on the classes, position the tooltip
    const h_operator = autoOffsets.horizontal === 'TooltipRight' ? '-=' : '+=';
    const v_operator = autoOffsets.vertical === 'TooltipAbove' ? '-=' : '+=';

    this.$tooltip.css('left' , h_operator   + ((this.elWidth / 2) + (this.jqWidth / 2) - leftCushion) + 'px');
    this.$tooltip.css('top'  , v_operator   + ((this.elHeight / 2) + (this.jqHeight / 2) + topCushion) + 'px');

    this.$tooltip.addClass(`${autoOffsets.horizontal} ${autoOffsets.vertical} autoplace`);

    return this;
};

/**
 * Autoplaces the tooltip to the left or right
 * @param cushion
 * @returns {Tooltip}
 */
Tooltip.prototype.autoPlaceHorizontally = function(cushion){
    const autoOffsets = this.determineOffsetFromElement();

    cushion = cushion || 0;
    //Next, based on the classes, position the tooltip
    const h_operator = autoOffsets.horizontal === 'TooltipRight' ? '-=' : '+=';

    this.$tooltip.css('left' , h_operator   + ((this.elWidth / 2) + (this.jqWidth / 2) + cushion) + 'px');
    this.$tooltip.addClass(autoOffsets.horizontal);

    return this;
};

/**
 * Autoplaces the tooltip above or below
 *
 * @param cushion
 * @returns {Tooltip}
 */
Tooltip.prototype.autoPlaceVertically = function(cushion){

    const autoOffsets = this.determineOffsetFromElement();
    cushion  = cushion  || 0;

    const v_operator = autoOffsets.vertical === 'TooltipAbove' ? '-=' : '+=';
    this.$tooltip.css('top'  , v_operator   + ((this.elHeight / 2) + (this.jqHeight / 2) + cushion) + 'px');
    this.$tooltip.addClass(autoOffsets.vertical);
    return this;
};

/**
 * Places the tooltip above the element
 *
 * @param {Number} cushion
 * @returns {Tooltip}
 */
Tooltip.prototype.above = function(cushion){

    cushion = cushion || 0;

    this.$tooltip.css('top', '-=' + ((this.elHeight / 2) + (this.jqHeight / 2) + cushion) + 'px');
    this.$tooltip.addClass('TooltipAbove');
    return this;
};

/**
 * Places the tooltip below the element
 *
 * @param {Number} cushion
 * @returns {Tooltip}
 */
Tooltip.prototype.below = function(cushion){

    cushion = cushion || 0;

    this.$tooltip.css('top', '+=' + ((this.elHeight / 2) + (this.jqHeight / 2) + cushion) + 'px');
    this.$tooltip.addClass('TooltipBelow');
    return this;
};

/**
 * Places the tooltip to the left of the element
 *
 * @param {Number} cushion
 * @returns {Tooltip}
 */
Tooltip.prototype.left = function(cushion){

    cushion = cushion || 0;

    this.$tooltip.css('left' , '-=' + ((this.elWidth / 2) + (this.jqWidth / 2) + cushion) + 'px');
    this.$tooltip.addClass('TooltipLeft');
    return this;
};

/**
 * Places the tooltip to the right of the element
 *
 * @param {Number} cushion
 * @returns {Tooltip}
 */
Tooltip.prototype.right = function(cushion){

    cushion = cushion || 0;

    this.$tooltip.css('left' , '+=' + ((this.elWidth / 2) + (this.jqWidth / 2) + cushion) + 'px');
    this.$tooltip.addClass('TooltipRight');
    return this;
};

/**
 * Aligns the left side of the tooltip with the left side of the element
 *
 * @param {Number} cushion
 * @returns {Tooltip}
 */
Tooltip.prototype.alignLeft = function(cushion){

    cushion = cushion || 0;

    this.jqDimension = this.jqViewportDimension();
    const operator   = this.jqDimension.left > this.dimension.left ? '-=' : '+=';
    this.$tooltip.css('left', operator + (Math.abs((this.jqDimension.left - this.dimension.left)) + cushion) + 'px');
    this.$tooltip.addClass('TooltipAlignLeft');
    return this;
};

/**
 * Aligns the right side of the tooltip with the right side of the element
 *
 * @param {Number} cushion
 * @returns {Tooltip}
 */
Tooltip.prototype.alignRight = function(cushion){

    cushion = cushion || 0;

    this.jqDimension = this.jqViewportDimension();
    const operator   = this.jqDimension.right > this.dimension.right ? '-=' : '+=';
    this.$tooltip.css('left', operator + (Math.abs((this.jqDimension.right - this.dimension.right)) + cushion) + 'px');
    this.$tooltip.addClass('TooltipAlignRight');
    return this;
};

/**
 * This is a variadic function that accepts the following string arguments:
 * "top", "bottom", "left", "right". The difference with this function is
 * that it places the markup inside of this.element rather than on the outside
 * like most tooltips.
 *
 * @returns {Tooltip}
 */
Tooltip.prototype.inside = function(){

    if(arguments.length){
        const args = Array.prototype.slice.call(arguments);
        args.forEach((arg) => {
           switch (arg){
               case "top":
                   this._insideTop();
                   break;
               case "bottom":
                   this._insideBottom();
                   break;
               case "left":
                   this.alignLeft();
                   break;
               case "right":
                   this.alignRight();
                   break;
               default:
                   break;
           }
        });
    }
    return this;
};

/**
 * Places the tooltip's top property on an equal plane to the element's top
 * value (in an absolute sense)
 *
 * @returns {Tooltip}
 * @private
 */
Tooltip.prototype._insideTop = function(){

    this.$tooltip.css('top', `-=${(this.elHeight / 4)}`);
    return this;
};

/**
 * Places the tooltip on the bottom of the element
 *
 * @returns {Tooltip}
 * @private
 */
Tooltip.prototype._insideBottom = function(){
    this.$tooltip.css('top', `+=${(this.elHeight / 2)}`);
    return this;
};

/**
 * Recenters a tooltip that has already been placed on the DOM. The idea is that you could do something like:
 *
 * const tooltip = new Tooltip(args);
 * tooltip.above();
 * //something else happens
 * tooltip.center().below();
 *
 * @returns {Tooltip}
 */
Tooltip.prototype.center = function(){
    //Remove any classes that have been applied by the class
    this._removeClasses();
    //Recalculate viewport positions
    this.elRect    = this.element.getBoundingClientRect();
    this.contRect  = this.container.getBoundingClientRect();
    this.dimension = this.calculateViewportPosition();

    this.jqHeight = this.$tooltip.outerHeight();
    this.jqWidth  = this.$tooltip.outerWidth();

    //First, position the tooltip to be exactly centered over the element
    this.$tooltip.css('top', this.dimension.top - (this.$tooltip.outerHeight() / 2) + (this.elRect.height / 2))
                 .css('left', this.dimension.left - (this.$tooltip.outerWidth() / 2) + (this.elRect.width / 2));

    return this;
};

/**
 *
 * @returns {Tooltip}
 * @private
 */
Tooltip.prototype._removeClasses = function(){
    this.$tooltip.removeClass('TooltipAlignRight TooltipAlignLeft TooltipRight TooltipLeft TooltipAbove TooltipBelow');

    return this;
};

/**
 * Removes the tooltip
 * @returns {Tooltip}
 */
Tooltip.prototype.destroy = function(){

    this._removeListeners();
    this.$tooltip.remove();
    return this;
};

/**
 *
 * @returns {Tooltip}
 */
Tooltip.prototype.hide = function(){
    this.$tooltip.hide();
    return this;
};

/**
 *
 * @returns {Tooltip}
 */
Tooltip.prototype.show = function() {
    this.$tooltip.show();
    return this;
};

/**
 *
 * @returns {Tooltip}
 */
Tooltip.prototype.removeListener = function(){

    setTimeout(() =>{
        $("html").on('click.tooltip', () =>{
            this.$tooltip.remove();
            $("html").off('click.tooltip');
        })
    }, 50);
    return this;
};

/**
 *
 * @param {Event} event
 * @param {Function} func
 */
Tooltip.prototype.setClickCallback = function(event, func){

    event.stopPropagation();
    this._unique = 'click.' + new Date().getTime();

    $("html").on(this._unique, event => {
        func.call(this, event.target, this.$tooltip);
    });
};

/**
 *
 * @returns {Tooltip}
 */
Tooltip.prototype.offCallback = function(){

    if(this._unique){
        $("html").off(this._unique);
    }
    return this;
};

/**
 * Scroll with a particular container - this method is usually discouraged,
 * but for certain tricky situations it may be relevant
 * @param {jQuery} $container
 */
Tooltip.prototype.scrollWith = function($container){

    this._scroll_container = $container;
    let last_position      = $container.get(0).scrollTop;
    this._scroll_handle    = 'scroll.' + new Date().getTime();
    this._scroll_container.on(this._scroll_handle, () => {

        const difference = last_position - $container.get(0).scrollTop;
        this.$tooltip.css('top', `+=${difference}px`);
        last_position = $container.get(0).scrollTop;
    });

    return this;
};

/**
 *
 * @returns {Tooltip}
 * @private
 */
Tooltip.prototype._removeListeners = function(){

    if(this._scroll_container && this._scroll_handle){
        this._scroll_container.off(this._scroll_handle);
    }

    this.offCallback();
    return this;
};

/**
 * Gets the viewport dimensions of the element offset by the container's viewport dimensions
 *
 * @returns {{left: number, top: number, right: number, bottom: number, width: Number, height: Number}}
 */
Tooltip.prototype.jqViewportDimension = function(){

    const $tooltip = this.$tooltip[0].getBoundingClientRect();
    const contRect = this.contRect;
    const left     = $tooltip.left - contRect.left + this.container.scrollLeft;
    const top      = $tooltip.top - contRect.top + this.container.scrollTop;
    const right    = $tooltip.right - contRect.right;
    const bottom   = $tooltip.bottom - contRect.bottom;

    return {
        left    : left,
        top     : top,
        right   : right,
        bottom  : bottom,
        width   : $tooltip.width,
        height  : $tooltip.height
    }
};

/**
 * Gets the element's position relative to the viewport so that we can decide
 * the best alignment for the tooltip
 *
 * @returns {{left: number, top: number, right: number, bottom: number, width: Number, height: Number}}
 */
Tooltip.prototype.calculateViewportPosition = function(){

    const domRect  = this.elRect;
    const contRect = this.contRect;
    const left     = domRect.left - contRect.left + this.container.scrollLeft;
    const top      = domRect.top - contRect.top + this.container.scrollTop;
    const right    = domRect.right - contRect.right;
    const bottom   = domRect.bottom - contRect.bottom;

    return {
        left    : left,
        top     : top,
        right   : right,
        bottom  : bottom,
        width   : domRect.width,
        height  : domRect.height
    }
};



/**
 * Determine if this tooltip should go on the right or left side, on the top or bottom of the element
 * @returns {{horizontal: string, vertical: string}}
 */
Tooltip.prototype.determineOffsetFromElement = function(){

    const halfWindowHeight = window.innerHeight / 2;
    const halfWindowWidth = window.innerWidth / 2;

    const horizontalClass = this.elRect.left > halfWindowWidth ? 'TooltipRight' : 'TooltipLeft';
    const verticalClass = this.elRect.top > halfWindowHeight ? 'TooltipAbove' : 'TooltipBelow';
    return {horizontal: horizontalClass, vertical : verticalClass};
};

export default Tooltip;