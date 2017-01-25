import $ from "jquery";
import Tooltip from "./../../../lib/js/Tooltip";
//Mustache template
import example from "./../../templates/tooltip.mustache";

$(document).ready(() => {


    const container = document.getElementById('wrapper');
    let tooltip;

    $(".hover").on('mouseenter', /**@this {HTMLElement}*/function(){
        tooltip = new Tooltip(this, container, $(example({
            message : determineMessage(this)
        })));
        //10/10 offset to make the stick to the button
        determinePlacement(this, tooltip);
    }).on('mouseleave', () => tooltip.destroy());


    $(container).height($(document).height());
});

/**
 * Determine the message to display in the tooltip
 *
 * @param stick_to
 * @returns {*}
 */
function determineMessage(stick_to){
    const left  = stick_to.classList.contains('js-left');
    const right = stick_to.classList.contains('js-right');
    const above = stick_to.classList.contains('js-above');
    const below = stick_to.classList.contains('js-below');
    const align_left  = stick_to.classList.contains('js-alignleft');
    const align_right = stick_to.classList.contains('js-alignright');

    if(left){
        return "I was created using the left() method";
    }

    else if(right){
        return "I was created using the right() method";
    }

    else if(above){
        return "I was created using the above() method";
    }

    else if(below){
        return "I was created using the below() method";
    }

    else if(align_left){
        return "I was created using tooltip.alignLeft().above()";
    }

    else if(align_right){
        return "I was created using tooltip.alignRight().below()";
    }

    else{
        return "I was created using the autoPlace() method";
    }
}

/**
 * Determine the placement function to use for the tooltip
 *
 * @param {HTMLElement} stick_to
 * @param {Tooltip} tooltip
 */
function determinePlacement(stick_to, tooltip){
    const left        = stick_to.classList.contains('js-left');
    const right       = stick_to.classList.contains('js-right');
    const above       = stick_to.classList.contains('js-above');
    const below       = stick_to.classList.contains('js-below');
    const align_left  = stick_to.classList.contains('js-alignleft');
    const align_right = stick_to.classList.contains('js-alignright');

    if(left){
        tooltip.left(8);
    }

    else if(right){
        tooltip.right(8);
    }

    else if(above){
        tooltip.above(8);
    }

    else if(below){
        tooltip.below(8);
    }

    else if(align_left){
        tooltip.alignLeft().above(8);
    }

    else if(align_right){
        tooltip.alignRight().below(8);
    }

    else{
        tooltip.autoPlace(50, 10);
    }
}