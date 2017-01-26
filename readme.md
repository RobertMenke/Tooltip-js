# Why this tooltip library?

Many tooltip libraries in an effort to be simple assume static positioning and have no sense of the container they get
appended to (often the document's body). 

I wanted to build a tooltip class that could handle relative and absolute positioned
containers, could scroll with its container, could be used as a general-purpose positioning mechanism, and was dead-simple
to use.

If you like the way the library has been written, or find it useful in your own project don't forget to star it!


Use:

```javascript
const tooltip = new Tooltip(stick_to, container, jquery_tooltip);
```

The tooltip constructor accepts 3 arguments

- ```@param {HTMLElement} stick_to```          - the element you want to append the tooltip to
- ```@param {HTMLElement} container```         - the container the tooltip will get appended to. This is useful if you want your tooltip to scroll with the rest of the container
- ```@param {jQuery}      jquery_tooltip```    - a jquery object with all of your tooltip content

#Basic Cases:

- ```.above(cushion)``` - place the tooltip above the element
- ```.below(cushion)``` - place the tooltip below the element
- ```.left(cushion)``` - Places the tooltip to the left of the element
- ```.right(cushion)``` - Places the tooltip to the right of the element

#Slightly More Advanced Cases:
- ```.autoPlace(leftCushion, topCushion)``` - automatically places the tooltip based on the element's position in the window. The result is the most fitting combination of top/left, top/right, bottom/left, bottom/right.
- ```.alignLeft(cushion)``` - Aligns the left side of the tooltip with the left side of the element
- ```.alignRight(cushion)``` - Aligns the right side of the tooltip with the right side of the element
- ``.center()`` - repositions the tooltip in the exact center of the stick_to parameter and removes any css classes that have been applied by the library. This exists if you ever need to reposition the tooltip once it's already been placed in the DOM.
- ``.autoPlaceHorizontally(cushion)`` - aligns the tooltip to the left or right of the stick_to parameter depending on the side that has more room in the viewport.
- ``.autoPlaceVertically(cushion)`` - aligns the tooltip to the top or bottom of the stick_to parameter depending on the side that has more room in the viewport.
- ``.inside("top"|"left"|"right"|"bottom")`` - accepts a variable number of string arguments and will position the tooltip inside of a particular element. This is useful when, for example, adding a div as an event inside of a calendar day.
- ```.destroy()``` - remove the tooltip

Each of the methods above accept an optional parameter called cushion that specifies how much farther away the tooltip should be from the side you select. 

Each of these methods can also be chained together to produce an outcome like top & left positioned.

Based on the method you call the tooltip will automatically place a css class on your tooltip that you can use for styling.

Be sure to checkout the examples folder and the lib/scss/Tooltip.scss for examples of styling!

#Events:

The library provides a number of events that can be automatically applied to the tooltip.

- ``.removeListener()`` - automatically remove the tooltip the next time any part of the document is clicked
- ``setClickCallback(event, callback)`` - set a custom callback that happens after the tooltip has been applied the DOM. The callback is called with the parameters (/**Node|Element*/event.target, /**jQuery*/$tooltip).
- ``.scrollWith($jquery_element)`` - tell the tooltip to scroll according the scrolling of a different html element. Typically you will not need this method, but certain tricky situations may make this method useful.

#Dependencies:

-jQuery (Will look into writing this in vanilla js in the future)

#About

The library was written using ES6 and was transpiled with Babel. My intention is that the library be used as a module with webpack or another
module-bundling library.

```javascript
import Tooltip from "rm-tooltip";
```

If you're not viewing this on github, here's a link! https://github.com/RobertMenke/Tooltip-js

#TODO

- Add support for container (2nd param of constructor) position: fixed/static
- Add additional CSS classes to accommodate wider use cases
- Look into removing the reliance on jQuery
- Add additional events and positioning methods