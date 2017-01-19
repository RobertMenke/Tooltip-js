import $ from "jquery";
import Tooltip from "./../../../lib/js/Tooltip";
//Mustache template
import example from "./../../templates/tooltip.mustache";

$(document).ready(() => {

    const container = document.getElementById('wrapper');
    let tooltip;

    $(".hover").on('mouseenter', function(){
        tooltip = new Tooltip(this, container, $(example({
            message : "I was created using the autoplace function"
        })));
        //10/10 offset to make the stick to the button
        tooltip.autoPlace(10, 10);
    }).on('mouseleave', () => tooltip.destroy());
});