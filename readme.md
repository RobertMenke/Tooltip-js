# Why this tooltip library?

Many tooltip libraries in an effort to be simple assume static positioning and have no sense of the container they get
appended to (often the document's body). 

I wanted to build a tooltip class that could handle relative and absolute positioned
containers, could scroll with its container, could be used as a general-purpose positioning mechanism, and was dead-simple
to use.



Use:

```javascript
const tooltip = new Tooltip(stick_to, container, jquery_tooltip);
```

The tooltip constructor accepts 3 arguments

- @param {HTMLElement} stick_to         - the element you want to append the tooltip to
- @param {HTMLElement} parentContainer  - the container the tooltip will get appended to. This is useful if you want your tooltip to scroll with the rest of the container
- @param {jQuery}      jqueryTooltip    - a jquery object with all of your tooltip content

When you construct the tooltip your jquery object will be placed in the dead center of the appendTo parameter. We'll then use any number of methods to place the tooltip. Each of the methods below accept an optional parameter called cushion that specifies how much farther away the tooltip should be from the side you select. Each of these methods can also be chained together to produce an outcome like top & left positioned.

- ```.autoPlace(leftCushion, topCushion)``` - automatically places the tooltip based on the element's position in the window
- ```.above(cushion)``` - place the tooltip above the element
- ```below(cushion)``` - place the tooltip below the element
- ```.left(cushion)``` - Places the tooltip to the left of the element
- ```.right(cushion)``` - Places the tooltip to the right of the element
- ```.alignLeft(cushion)``` - Aligns the left side of the tooltip with the left side of the element
- ```.alignRight(cushion)``` - Aligns the right side of the tooltip with the right side of the element
- ```.destroy()``` - remove the tooltip

Based on the method you call the tooltip will automatically place a css class on your tooltip that you can use for styling.

Be sure to checkout the examples folder and the lib/scss/Tooltip.scss for examples of styling!