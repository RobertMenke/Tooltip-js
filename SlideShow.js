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
 * Small class to manage a slide show
 *
 * @param parent - the parent element that contains the elements that will slide in and out
 * @param leftArrow - the element that if clicked will make the slide show decrement by 1
 * @param rightArrow - the element that if clicked will make the slide show increment by 1
 * @param dotsClasses - an object with {'container' : 'dotContainerClass', 'dots' : 'dotsClass', 'active' : 'dotsActiveClass'}
 * @param slideDuration - the number of milliseconds for both the slide out and slide in. slideDuration of 300 = 600 total milliseconds
 * @constructor
 */
function SlideShow(parent, leftArrow, rightArrow, dotsClasses, slideDuration){

    this.dotsClasses    = dotsClasses;
    this.parent         = parent;
    this.left           = leftArrow;
    this.right          = rightArrow;
    this.duration       = slideDuration;
    this.currentIndex   = 0;
    this.children       = $(this.parent).children();
    this.indices        = this.indexChildren();
    this.dotsArray      = [];
    this.init();
}

SlideShow.prototype.init = function(){

    this.indexChildren();
    this.addDotsToContainer();
    this.actionListeners();
};

/**
 * Creates the dot elements based on the classes passed to the class
 * and appends the markup to the parent
 */
SlideShow.prototype.addDotsToContainer = function(){

    var container = document.createElement("DIV");
    container.className = this.dotsClasses['container'];
    for(var i = 0; i < this.children.length; i++){

        var dot = document.createElement("DIV");
        dot.className = i === 0 ? this.dotsClasses['dots'] + " " + this.dotsClasses['active'] : this.dotsClasses['dots'];
        dot.childIndex = i;
        container.appendChild(dot);
    }

    this.parent.appendChild(container);
    this.dotsArray = $(container).children();
};

/**
 * Index Children by number
 */
SlideShow.prototype.indexChildren = function(){

    var output      = {};
    for(var i = 0; i < this.children.length; i++){
        output[i] = this.children[i];
    }
    return output;
};

SlideShow.prototype.moveLeft = function(index){

    var oldChild      = this.indices[this.currentIndex];
    this.dotsArray[this.currentIndex].className = this.dotsClasses['dots'];

    if(typeof index !== typeof undefined){
        this.currentIndex = index;
    } else{
        this.currentIndex = this.currentIndex === 0 ? this.children.length - 1 : this.currentIndex - 1;
    }

    var newChild      = this.indices[this.currentIndex];
    this.dotsArray[this.currentIndex].className = this.dotsClasses['dots'] + " " + this.dotsClasses['active'];


    this.tradeChildren(this.parent, false, newChild, oldChild);
};

SlideShow.prototype.moveRight = function(index){

    var oldChild      = this.indices[this.currentIndex];
    this.dotsArray[this.currentIndex].className = this.dotsClasses['dots'];

    if(typeof index !== typeof undefined){
        this.currentIndex = index;
    } else{
        this.currentIndex = this.currentIndex === this.children.length - 1 ? 0 : this.currentIndex + 1;
    }

    var newChild      = this.indices[this.currentIndex];

    this.dotsArray[this.currentIndex].className = this.dotsClasses['dots'] + " " + this.dotsClasses['active'];


    this.tradeChildren(this.parent, true, newChild, oldChild);
};

/**
 * Adds event listeners for moving through the slide show
 */
SlideShow.prototype.actionListeners = function(){

    var obj = this;

    $(this.left).click(function(){

        obj.moveLeft.bind(obj)();
    });

    $(this.right).click(function(){

        console.log("right clicked");
        obj.moveRight.bind(obj)();
    });

    $("." + this.dotsClasses['dots']).click(function(){

        if(!$(this).hasClass(obj.dotsClasses['active'])){

            var index = this.childIndex;

            if(index > obj.currentIndex){
                obj.moveRight.bind(obj)(index);
            } else{
                obj.moveLeft.bind(obj)(index);
            }
        }
    })

};

SlideShow.prototype.tradeChildren = function(parentNode, isLeft, newChild, oldChild){

    var slideIn = '', slideOut = '';
    var obj = this;

    if(isLeft){
        slideIn = 'right';
        slideOut = 'left';
    } else{
        slideIn = 'left';
        slideOut = 'right';
    }

    $(oldChild).hide("slide", {direction: slideOut, easing: 'linear'}, obj.duration, function(){

        $(newChild).show("slide", {direction: slideIn, easing: 'linear'}, obj.duration);
    });

};

SlideShow.prototype.setTransitionInterval = function(interval){

    var obj = this;
    setInterval(function(){

        obj.moveRight();
    }, interval);
};