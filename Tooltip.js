/**
 * Created by rbmenke on 5/24/16.
 *
 * The MIT License (MIT)

 Copyright (c) 2016 Robert Menke

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

/**
 * This is a simple tooltip class for determining the placement of a tooltip within a container.
 * By calling the constructor with the new operator, the developer will get a tooltip whose center
 * is placed on the center of the HTMLElement described in the "element" parameter.
 *
 * From there, the developer can decide to autoplace the tooltip, or use the below, above, left, or right
 * methods (in combination or stand-alone) to place the tooltip relative to the container.
 *
 * Note that this class doesn't work particularly well with fixed positioned tooltips. Fortunately, it is extremely
 * easy to position fixed tooltips and you can do so by calling tooltip.jqObject.css({top: val, left: val})
 *
 * @param {HTMLElement} element
 * @param {HTMLElement} container
 * @param {*|jQuery|HTMLElement} jqObject
 * @constructor
 */
function Tooltip(element, container, jqObject){

    this.element        = element;
    this.container      = container;
    this.jqObject       = jqObject;

    this.elRect         = this.element.getBoundingClientRect();
    this.contRect       = this.container.getBoundingClientRect();
    this.dimension      = this.calculateViewportPosition();
    this.jqDimension    = {};

    this.elHeight       = $(this.element).outerHeight();
    this.elWidth        = $(this.element).outerWidth();
    this.jqHeight       = 0;
    this.jqWidth        = 0;

    /**
     * unique timestamp for click listeners so that many can fire at once
     *
     * @type {string}
     * @private
     */
    this._unique        = "";

    this.placeTooltip();
}

/**
 * Places the tooltip so that the tooltip's center is exactly on this.element's
 * center - this is the first step prior to calling additional methods for placement
 * and is called when the object is constructed
 */
Tooltip.prototype.placeTooltip = function(){

    $(this.container).append(this.jqObject);

    this.jqHeight = this.jqObject.outerHeight();
    this.jqWidth  = this.jqObject.outerWidth();

    //First, position the tooltip to be exactly centered over the element
    this.jqObject.css('top', this.dimension.top - (this.jqObject.outerHeight() / 2) + (this.elRect.height / 2))
                 .css('left', this.dimension.left - (this.jqObject.outerWidth() / 2) + (this.elRect.width / 2));
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

    var autoOffsets = this.determineOffsetFromElement();

    leftCushion = leftCushion || 0;
    topCushion  = topCushion  || 0;
    //Next, based on the classes, position the tooltip
    var h_operator          = autoOffsets.horizontal === 'GenericTooltipRight' ? '-=' : '+=';
    var v_operator          = autoOffsets.vertical   === 'GenericTooltipAbove' ? '-=' : '+=';

    this.jqObject.css('left' , h_operator   + ((this.elWidth / 2) + (this.jqWidth / 2) - leftCushion) + 'px');
    this.jqObject.css('top'  , v_operator   + ((this.elHeight / 2) + (this.jqHeight / 2) + topCushion) + 'px');

    this.jqObject.addClass(autoOffsets.horizontal).addClass(autoOffsets.vertical);

    return this;
};

/**
 * Autoplaces the tooltip to the left or right
 * @param cushion
 * @returns {Tooltip}
 */
Tooltip.prototype.autoPlaceHorizontally = function(cushion){
    var autoOffsets = this.determineOffsetFromElement();

    cushion = cushion || 0;
    //Next, based on the classes, position the tooltip
    var h_operator          = autoOffsets.horizontal === 'GenericTooltipRight' ? '-=' : '+=';

    this.jqObject.css('left' , h_operator   + ((this.elWidth / 2) + (this.jqWidth / 2) + cushion) + 'px');
    this.jqObject.addClass(autoOffsets.horizontal);

    return this;
};

/**
 * Autoplaces the tooltip above or below
 *
 * @param cushion
 * @returns {Tooltip}
 */
Tooltip.prototype.autoPlaceVertically = function(cushion){

    var autoOffsets = this.determineOffsetFromElement();
    cushion  = cushion  || 0;

    var v_operator          = autoOffsets.vertical   === 'GenericTooltipAbove' ? '-=' : '+=';
    this.jqObject.css('top'  , v_operator   + ((this.elHeight / 2) + (this.jqHeight / 2) + cushion) + 'px');
    this.jqObject.addClass(autoOffsets.vertical);
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

    this.jqObject.css('top', '-=' + ((this.elHeight / 2) + (this.jqHeight / 2) + cushion) + 'px');
    this.jqObject.addClass('GenericTooltipAbove');
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

    this.jqObject.css('top', '+=' + ((this.elHeight / 2) + (this.jqHeight / 2) + cushion) + 'px');
    this.jqObject.addClass('GenericTooltipBelow');
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

    this.jqObject.css('left' , '-=' + ((this.elWidth / 2) + (this.jqWidth / 2) + cushion) + 'px');
    this.jqObject.addClass('GenericTooltipLeft');
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

    this.jqObject.css('left' , '+=' + ((this.elWidth / 2) + (this.jqWidth / 2) + cushion) + 'px');
    this.jqObject.addClass('GenericTooltipRight');
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
    var operator = this.jqDimension.left > this.dimension.left ? '-=' : '+=';
    this.jqObject.css('left', operator + (Math.abs((this.jqDimension.left - this.dimension.left)) + cushion) + 'px');
    this.jqObject.addClass('GenericTooltipAlignLeft');
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
    var operator = this.jqDimension.right > this.dimension.right ? '-=' : '+=';
    this.jqObject.css('left', operator + (Math.abs((this.jqDimension.right - this.dimension.right)) + cushion) + 'px');
    this.jqObject.addClass('GenericTooltipAlignRight');
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

    this.jqObject.css('top', '-=' + (this.elHeight / 4));
    return this;
};

/**
 * Places the tooltip on the bottom of the element
 *
 * @returns {Tooltip}
 * @private
 */
Tooltip.prototype._insideBottom = function(){
    this.jqObject.css('top', '+=' + (this.elHeight / 2));
    return this;
};

/**
 * Removes the tooltip
 * @returns {Tooltip}
 */
Tooltip.prototype.destroy = function(){

    this.jqObject.remove();
    return this;
};

/**
 *
 * @returns {Tooltip}
 */
Tooltip.prototype.removeListener = function(){

    var obj = this;
    setTimeout(function(){
        $("html").on('click.tooltip', function(){
            obj.jqObject.remove();
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

    $("html").on(this._unique, function(e){
        func.call(this, e.target, this.jqObject);
    }.bind(this));
};

/**
 *
 * @returns {Tooltip}
 */
Tooltip.prototype.offCallback = function(){
    $("html").off(this._unique);
    return this;
};

/**
 * Gets the viewport dimensions of the element offset by the container's viewport dimensions
 *
 * @returns {{left: number, top: number, right: number, bottom: number, width: Number, height: Number}}
 */
Tooltip.prototype.jqViewportDimension = function(){

    var jqObject = this.jqObject[0].getBoundingClientRect();
    var contRect = this.contRect;
    var left     = jqObject.left     - contRect.left + this.container.scrollLeft;
    var top      = jqObject.top      - contRect.top  + this.container.scrollTop;
    var right    = jqObject.right    - contRect.right;
    var bottom   = jqObject.bottom   - contRect.bottom;

    return {
        left    : left,
        top     : top,
        right   : right,
        bottom  : bottom,
        width   : jqObject.width,
        height  : jqObject.height
    }
};

/**
 * Gets the element's position relative to the viewport so that we can decide
 * the best alignment for the tooltip
 *
 * @returns {{left: number, top: number, right: number, bottom: number, width: Number, height: Number}}
 */
Tooltip.prototype.calculateViewportPosition = function(){

    var domRect  = this.elRect;
    var contRect = this.contRect;

    var left     = domRect.left     - contRect.left + this.container.scrollLeft;
    var top      = domRect.top      - contRect.top  + this.container.scrollTop;
    var right    = domRect.right    - contRect.right;
    var bottom   = domRect.bottom   - contRect.bottom;

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

    var halfWindowHeight = window.innerHeight / 2;
    var halfWindowWidth  = window.innerWidth / 2;

    var horizontalClass = this.elRect.left > halfWindowWidth ? 'GenericTooltipRight' : 'GenericTooltipLeft';
    var verticalClass   = this.elRect.top > halfWindowHeight ? 'GenericTooltipAbove' : 'GenericTooltipBelow';
    return {horizontal: horizontalClass, vertical : verticalClass};
};