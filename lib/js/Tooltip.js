'use strict'

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
 * Also, the container the tooltip is being appended to must be position: relative
 *
 * @param {HTMLElement} element
 * @param {HTMLElement} container
 * @param {string|HTMLElement} tooltip
 * @constructor
 */

type ViewportDimension = {
    left: number, 
    top: number, 
    right: number, 
    bottom: number, 
    width: number, 
    height: number
}

type Coordinate = {
    top : number,
    left : number
}

export default class Tooltip {
    
    element : HTMLElement
    container : HTMLElement
    tooltip : HTMLElement
    element_rect : ClientRect
    container_rect : ClientRect
    container_dimension : ViewportDimension
    tooltip_dimension : ViewportDimension
    element_height : number
    element_width : number
    tooltip_height : number
    tooltip_width : number
    centered_coordinate : ?Coordinate
    
    constructor(element : HTMLElement, container : HTMLElement, tooltip : HTMLElement|string){
        
        if(!(tooltip instanceof Element) && typeof tooltip !== "string") {
            throw new TypeError("The tooltip passed to the constructor must be either an html string or an instance of HTMLElement")
        }
        
        /**
         * The element we're sticking the tooltip to
         *
         * @type {HTMLElement}
         */
        this.element        = element
    
        /**
         * The container the element gets appended to - important for things like scrolling and z-index
         *
         * @type {HTMLElement}
         */
        this.container      = container
    
        /**
         * The jQuery object that function as our tooltip
         *
         * @type {*}
         */
        this.tooltip       = tooltip instanceof Element ? tooltip : parseHtml(tooltip).firstChild

        /**
         * The ClientRect object associated with this.element
         *
         * @type {ClientRect}
         */
        this.element_rect         = this.element.getBoundingClientRect()
    
        /**
         * The ClientRect object associated with this.container
         *
         * @type {ClientRect}
         */
        this.container_rect       = this.container.getBoundingClientRect()
    
        /**
         * Positioning information for the element relative to the viewport AND ITS CONTAINER
         *
         * @type {{left: number, top: number, right: number, bottom: number, width: Number, height: Number}}
         */
        this.container_dimension      = this.calculateViewportPosition()
    
        /**
         * Storage for the tooltip's dimensions relative to the container and viewport
         *
         * @type {{left: number, top: number, right: number, bottom: number, width: Number, height: Number}}
         */
        this.tooltip_dimension    = {}
    
        /**
         * Height of this.element
         * @type {number}
         */
        this.element_height      = this.element.offsetHeight
    
        /**
         * Width of this.element
         * @type {number}
         */
        this.element_width        = this.element.offsetWidth
    
        /**
         * Height of the tooltip (TBD on init)
         * @type {number}
         */
        this.tooltip_height       = 0
    
        /**
         * Width of the tooltip (TBD on init)
         * @type {number}
         */
        this.tooltip_width        = 0

        /**
         *
         * @type {undefined}
         */
        this.centered_coordinate  = undefined

        this.last_coordinate      = undefined
    
        //Place the tooltip smack dab in the middle of this.element
        this.placeTooltip()
    }
    
    /**
     * Places the tooltip so that the tooltip's center is exactly on this.element's
     * center - this is the first step prior to calling additional methods for placement
     * and is called when the object is constructed
     */
    placeTooltip (){
        this.container.appendChild(this.tooltip)

        this.tooltip_height = this.tooltip.offsetHeight
        this.tooltip_width  = this.tooltip.offsetWidth

        //First, position the tooltip to be exactly centered over the element
        this.centered_coordinate = this.getCenteredStyles()
        this._applyPosition(this.centered_coordinate)
    }

    _applyPosition (coordinate : Coordinate) : (class_names : Array<string>|string) => void {
        coordinate = this._composeCoordinates(coordinate)
        this.tooltip.style.top  = `${coordinate.top}px`
        this.tooltip.style.left = `${coordinate.left}px`

        return (class_names)  => {
            if(class_names) {
                Array.isArray(class_names)
                ? this.tooltip.classList.add(...class_names)
                : this.tooltip.classList.add(class_names)
            }
        }
    }

    _composeCoordinates (coordinate : Coordinate, previous : Coordinate = this.last_coordinate) {
        if(previous) {
            return this.last_coordinate = {
                left: coordinate.left === this.centered_coordinate.left ? previous.left : coordinate.left,
                top : coordinate.top === this.centered_coordinate.top ? previous.top : coordinate.top
            }
        }

        return this.last_coordinate = coordinate
    }
    /**
     * Figure out what the top and left properties look like if we want the tooltip
     * to be dead center of the element we're sticking it to.
     *
     * @returns {Coordinate}
     */
    getCenteredStyles () : Coordinate {
        return {
            top : this.container_dimension.top - (this.tooltip_height / 2) + (this.element_rect.height / 2),
            left: this.container_dimension.left - (this.tooltip_width / 2) + (this.element_rect.width / 2)
        }
    }
    /**
     * Tries to position the tooltip automatically based on the element's position
     * relative to the viewport
     *
     * @param {Number} left_cushion
     * @param {Number} top_cushion
     * @returns {Tooltip}
     */
    autoPlace (left_cushion : number = 0, top_cushion : number = 0){

        const auto_offsets    = this.determineOffsetFromElement()
        const left_coordinate = this._autoPlaceHorizontallyStyles( auto_offsets, left_cushion )
        const top_coordinate  = this._autoplaceVerticallyStyles( auto_offsets, top_cushion )
        const coordinate      = this._composeCoordinates(left_coordinate, top_coordinate)
        this._applyPosition( coordinate )( [ auto_offsets.vertical, auto_offsets.horizontal, "autoplace" ] )
    
        return this
    }
    
    /**
     * Autoplaces the tooltip to the left or right
     * @param cushion
     * @returns {Tooltip}
     */
    autoPlaceHorizontally (cushion : number = 0) : Tooltip {
        const auto_offsets = this.determineOffsetFromElement()
        const coordinate = this._autoPlaceHorizontallyStyles(auto_offsets, cushion)
        this._applyPosition(coordinate)(auto_offsets.horizontal)

        return this
    }

    _autoPlaceHorizontallyStyles (offsets, cushion : number = 0) : Coordinate {
        const is_left = offsets.horizontal === 'TooltipLeft'
        const movement = (this.element_width / 2) + (this.tooltip_width / 2) - cushion
        return {
            left : is_left ? this.centered_coordinate.left + movement : this.centered_coordinate.left - movement,
            top : this.centered_coordinate.top
        }
    }

    /**
     * Autoplaces the tooltip above or below
     *
     * @param cushion
     * @returns {Tooltip}
     */
    autoPlaceVertically (cushion : number = 0) : Tooltip {

        const auto_offsets = this.determineOffsetFromElement()
        const coordinate = this._autoplaceVerticallyStyles(auto_offsets, cushion)
        this._applyPosition(coordinate)(auto_offsets.vertical)

        return this
    }

    _autoplaceVerticallyStyles (offsets, cushion : number = 0) : Coordinate {
        const is_top = offsets.vertical === "TooltipAbove"
        const movement = (this.element_height / 2) + (this.tooltip_height / 2) + cushion
        return {
            top : is_top ? this.centered_coordinate.top - movement : this.centered_coordinate.top + movement,
            left: this.centered_coordinate.left
        }
    }
    
    /**
     * Places the tooltip above the element
     *
     * @param {Number} cushion
     * @returns {Tooltip}
     */
    above (cushion){
    
        const coordinate = this._aboveStyles(cushion)
        this._applyPosition(coordinate)('TooltipAbove')

        return this
    }

    _aboveStyles (cushion : number = 0) : Coordinate {
        return {
            top : this.centered_coordinate.top - ((this.element_height/ 2) + (this.tooltip_height / 2) + cushion),
            left: this.centered_coordinate.left
        }
    }
    
    /**
     * Places the tooltip below the element
     *
     * @param {Number} cushion
     * @returns {Tooltip}
     */
    below (cushion: number = 0) : Tooltip {
    
        const coordinate = this._belowStyles(cushion)
        this._applyPosition(coordinate)('TooltipBelow')

        return this
    }

    _belowStyles (cushion : number = 0) : Coordinate {
        return {
            top : this.centered_coordinate.top + ((this.element_height/ 2) + (this.tooltip_height / 2) + cushion),
            left: this.centered_coordinate.left
        }
    }
    
    /**
     * Places the tooltip to the left of the element
     *
     * @param {Number} cushion
     * @returns {Tooltip}
     */
    left (cushion : number = 0){
    
        const coordinate = this._leftStyles(cushion)
        this._applyPosition(coordinate)('TooltipLeft')

        return this
    }

    _leftStyles (cushion : number = 0)  : Coordinate{
        return {
            top : this.centered_coordinate.top,
            left : this.centered_coordinate.left - ((this.element_width / 2) + (this.tooltip_width / 2) + cushion)
        }
    }
    
    /**
     * Places the tooltip to the right of the element
     *
     * @param {Number} cushion
     * @returns {Tooltip}
     */
    right (cushion : number = 0) : Tooltip {
    
        const coordinate = this._rightStyles(cushion)
        this._applyPosition(coordinate)('TooltipRight')

        return this
    }

    _rightStyles (cushion : number = 0) : Coordinate {
        return {
            top : this.centered_coordinate.top,
            left: this.centered_coordinate.left + ((this.element_width/ 2) + (this.tooltip_width / 2) + cushion)
        }
    }
    
    /**
     * Aligns the left side of the tooltip with the left side of the element
     *
     * @param {Number} cushion
     * @returns {Tooltip}
     */
    alignLeft (cushion : number = 0) : Tooltip {

        const coordinate = this._alignLeftStyles(cushion)
        this._applyPosition(coordinate)('TooltipAlignLeft')

        return this
    }

    _alignLeftStyles (cushion : number = 0) : Coordinate {
        const difference = (this.element_width - this.tooltip_width) / 2

        return {
            top : this.centered_coordinate.top,
            left: this.centered_coordinate.left - difference - cushion,
        }
    }
    
    /**
     * Aligns the right side of the tooltip with the right side of the element
     *
     * @param {Number} cushion
     * @returns {Tooltip}
     */
    alignRight (cushion : number = 0) : Tooltip {

        const coordinate = this._alignRightStyles(cushion)
        this._applyPosition(coordinate)('TooltipAlignRight')

        return this
    }

    _alignRightStyles (cushion : number = 0) : Coordinate {
        const difference = (this.element_width - this.tooltip_width) / 2

        return {
            top : this.centered_coordinate.top,
            left: this.centered_coordinate.left + difference + cushion,
        }
    }
    
    /**
     * This is a variadic function that accepts the following string arguments:
     * "top", "bottom", "left", "right". The difference with this function is
     * that it places the markup inside of this.element rather than on the outside
     * like most tooltips.
     *
     * @returns {Tooltip}
     */
    inside (){
    
        if(arguments.length){
            const args = Array.prototype.slice.call(arguments)
            args.forEach((arg) => {
               switch (arg){
                   case "top":
                       this._insideTop()
                       break
                   case "bottom":
                       this._insideBottom()
                       break
                   case "left":
                       this.alignLeft()
                       break
                   case "right":
                       this.alignRight()
                       break
                   default:
                       break
               }
            })
        }
        return this
    }
    
    /**
     * Places the tooltip's top property on an equal plane to the element's top
     * value (in an absolute sense)
     *
     * @returns {Tooltip}
     * @private
     */
    _insideTop (){
        this._applyPosition({
            ...this.centered_coordinate,
            top : this.centered_coordinate.top - this.centered_coordinate.top / 4
        })

        return this
    }
    
    /**
     * Places the tooltip on the bottom of the element
     *
     * @returns {Tooltip}
     * @private
     */
    _insideBottom (){
        this._applyPosition({
            ...this.centered_coordinate,
            top : this.centered_coordinate.top + this.centered_coordinate.top / 2
        })

        return this
    }
    
    /**
     * Re-centers a tooltip that has already been placed on the DOM. The idea is that you could do something like:
     *
     * const tooltip = new Tooltip(args)
     * tooltip.above()
     * //something else happens
     * tooltip.center().below()
     *
     * @returns {Tooltip}
     */
    center (){
        //Remove any classes that have been applied by the class
        this._removeClasses()
        //Recalculate viewport positions
        this.element_rect        = this.element.getBoundingClientRect()
        this.container_rect      = this.container.getBoundingClientRect()
        this.container_dimension = this.calculateViewportPosition()
        this.tooltip_height      = this.tooltip.offsetHeight
        this.tooltip_width       = this.tooltip.offsetWidth
        //Next apply the centered styles to the tooltip
        this.centered_coordinate = this.getCenteredStyles()
        this.tooltip.style.top   = `${this.centered_coordinate.top}px`
        this.tooltip.style.left  = `${this.centered_coordinate.left}px`
    
        return this
    }
    
    /**
     *
     * @returns {Tooltip}
     * @private
     */
    _removeClasses (){
        this.tooltip.classList.remove(...['TooltipAlignRight', 'TooltipAlignLeft', 'TooltipRight', 'TooltipLeft', ',TooltipAbove', 'TooltipBelow'])
    
        return this
    }
    
    /**
     * Removes the tooltip
     * @returns {Tooltip}
     */
    destroy (){
        document.body.removeEventListener('click', this.destroy)
        if(this.tooltip.parentNode) {
            this.tooltip.parentNode.removeChild(this.tooltip)
        }

        return this
    }
    
    /**
     *
     * @returns {Tooltip}
     */
    hide (){
        this.tooltip.style.display = "none"
        return this
    }
    
    /**
     *
     * @returns {Tooltip}
     */
    show () {
        this.tooltip.style.display = "block"
        return this
    }
    
    /**
     *
     * @returns {Tooltip}
     */
    removeListener (){
        setTimeout(() => {
            document.body.addEventListener('click', this.destroy.bind(this))
        }, 50)
        return this
    }
    
    /**
     *
     * @param {Event} event
     * @param {Function} func
     */
    setClickCallback (event : MouseEvent, func : Function) : Tooltip {
    
        event.stopPropagation()
        document.body.addEventListener(event, () => {
            func.call(this, event.target, this.tooltip)
        })

        return this
    }
    

    /**
     * Scroll with a particular container - this method is usually discouraged,
     * but for certain tricky situations it may be relevant
     */
    scrollWith (container : HTMLElement) {

        let last_position = container.scrollTop
        container.addEventListener('scroll', () => {
            const difference = last_position - container.scrollTop
            this.tooltip.style.top = this.tooltip.style.top + difference
            last_position = container.scrollTop
        })
    
        return this
    }

    
    /**
     * Gets the element's position relative to the viewport so that we can decide
     * the best alignment for the tooltip
     *
     * @returns {{left: number, top: number, right: number, bottom: number, width: Number, height: Number}}
     */
    calculateViewportPosition () {

        const dom_rect  = this.element_rect
        const cont_rect = this.container_rect
        const left      = dom_rect.left - cont_rect.left + this.container.scrollLeft
        const top       = dom_rect.top - cont_rect.top + this.container.scrollTop
        const right     = dom_rect.right - cont_rect.right
        const bottom    = dom_rect.bottom - cont_rect.bottom
    
        return {
            left    : left,
            top     : top,
            right   : right,
            bottom  : bottom,
            width   : dom_rect.width,
            height  : dom_rect.height
        }
    }
    
    
    
    /**
     * Determine if this tooltip should go on the right or left side, on the top or bottom of the element
     * @returns {{horizontal: string, vertical: string}}
     */
    determineOffsetFromElement () {
    
        const halfWindowHeight = window.innerHeight / 2
        const halfWindowWidth = window.innerWidth / 2
    
        const horizontalClass = this.element_rect.left > halfWindowWidth ? 'TooltipRight' : 'TooltipLeft'
        const verticalClass = this.element_rect.top > halfWindowHeight ? 'TooltipAbove' : 'TooltipBelow'
        return {horizontal: horizontalClass, vertical : verticalClass}
    }
}


const parseHtml = (html : string) : DocumentFragment => {
    const fragment = document.createDocumentFragment()
    const temp = document.createElement('div')
    temp.innerHTML = html
    let child
    while (child = temp.firstElementChild) {
        fragment.appendChild(child)
    }

    return fragment
}