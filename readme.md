# Tooltip

This repo contains a few useful files. They can all act independently of one another I just put them here with an open source license so I could use them whenever I wanted.


  - Tooltip.js - a very flexible tooltip class
  - UtilityBelt.js - some nice utility functions and some that may no longer be useful
  - Calendar.js - create a working, functional calendar to create things like date pickers

At the moment I'm just going to explain how to use the tooltip class

Step 1:
```javascript
var tooltip = new Tooltip(appendTo, parentContainer, jqueryTooltip);
```

The tooltip constructor accepts 3 arguments

- appendTo - the element you want to append the tooltip to
- parentContainer - the container the tooltip will get appended to. This is useful if you want your tooltip to scroll with the rest of the container
- jqueryTooltip - a jquery object with all of your tooltip content

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

Here's an example of a css configuration that will create an error tooltip

```css

.genericToolTip{
    position: absolute;
    display: block;
    background-color: #fff; /*#B0BEC5;*/
    color: #000;
    border: 1px solid #B24345;
    height: auto;
    width: auto;
    padding: 10px;
    overflow: visible;

    border-radius: 5px;
    -webkit-box-shadow: 0px 0px 3px 0px rgba(50, 50, 50, 0.4);
    -moz-box-shadow:    0px 0px 3px 0px rgba(50, 50, 50, 0.4);
    box-shadow:         0px 0px 3px 0px rgba(50, 50, 50, 0.4);
}

.genericToolTip:after{
    position: absolute;
    display: block;
    content: "";
}

.genericToolTip.GenericTooltipAbove:after{
    bottom: -7px;
    height: 14px;
    width: 14px;
    left: calc(50% - 7px);
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    background: #fff;
    border-right: 1px solid #b24345;
    border-bottom: 1px solid #b24345;
    -webkit-box-shadow: 2px 2px 2px 0px rgba(50, 50, 50, 0.3);
    -moz-box-shadow:    2px 2px 2px 0px rgba(50, 50, 50, 0.3);
    box-shadow:         2px 2px 2px 0px rgba(50, 50, 50, 0.3);
}

.genericToolTip.GenericTooltipBelow:after{
    top: -7px;
    height: 14px;
    width: 14px;
    left: calc(50% - 7px);
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    border-left: 1px solid #b24345;
    border-top: 1px solid #b24345;
    background: #fff;
    -webkit-box-shadow: -1px -1px 2px -1px rgba(50, 50, 50, 0.4);
    -moz-box-shadow:    -1px -1px 2px -1px rgba(50, 50, 50, 0.4);
    box-shadow:         -1px -1px 2px -1px rgba(50, 50, 50, 0.4);
}


.genericToolTip.GenericTooltipLeft:after{
    right: -7px;
    height: 14px;
    width: 14px;
    top: calc(50% - 7px);
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    border-right: 1px solid #b24345;
    border-top: 1px solid #b24345;
    background: #fff;
    -webkit-box-shadow: 2px -1px 2px -2px rgba(50, 50, 50, 0.4);
    -moz-box-shadow:    2px -1px 2px -2px rgba(50, 50, 50, 0.4);
    box-shadow:         2px -1px 2px -2px rgba(50, 50, 50, 0.4);
}

.genericToolTip.GenericTooltipRight:after{
    left: -7px;
    height: 14px;
    width: 14px;
    top: calc(50% - 7px);
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    border-left: 1px solid #b24345;
    border-bottom: 1px solid #b24345;
    background: #fff;
    -webkit-box-shadow: -2px -1px 2px -2px rgba(50, 50, 50, 0.4);
    -moz-box-shadow:    -2px -1px 2px -2px rgba(50, 50, 50, 0.4);
    box-shadow:         -2px -1px 2px -2px rgba(50, 50, 50, 0.4);
}

.genericToolTip.GenericTooltipAlignRight:after{
    right: 30px;
}

.genericToolTip.GenericTooltipAlignLeft:after{
    left: 30px;
}
```

