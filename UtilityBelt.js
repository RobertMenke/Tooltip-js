/**
 * Created by rbmenke on 7/25/15.
 *
 * In all of my javascript files I prefer to keep a namespace (object literal) at the top of the document to house all methods I think of as static.
 * I then include all constructor functions (classes) that are pertinent to a particular module underneath the namespaced code so that the class(es)
 * can be used globally.
 *
 *
 * The purpose of the UtilityBelt.js (yes, I'm a fan of batman) file is to house functions that are generic enough to be reused over and over in
 * a variety of situations. At the top of the document I include a namespace called UtilityBelt that house functions I like to think of as static.
 * After the namespace "UtilityBelt" ends I have a class called "GenericTooltip" that allows me to easily and quickly build custom tooltips for
 * virtually any purpose.
 *
 *
 * UtilityBelt.js is also unique amongst files in my projects because it is always my first linked javascript file (after jQuery and API links).
 * I do this because all additions to a built-in javascript object's prototype (for example, Array.prototype.methodName) are included at the bottom
 * of this file so that those methods can be used for any Array, Date, Function, etc. (Note that when using jQuery the object "Object" cannot be
 * extended. It will essentially break jQuery)
 *
 *
 */
UtilityBelt = {

    dayPrefix: [

        'sun',
        'mon',
        'tue',
        'wed',
        'thu',
        'fri',
        'sat'
    ],

    weekAbbreviations :["Su","M","T","W","Th","F","Sa"],


    weekday :  [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ],



        month: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
            ],

        shortMonth : [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ],

    customLoader: function(aClass){
        return '<div class="horiz_spinner '+ aClass + '">'
                        +'<div class="spinner__item1"></div>'
                        +'<div class="spinner__item2"></div>'
                        +'<div class="spinner__item3"></div>'
                        +'<div class="spinner__item4"></div>'
                    +'</div>';
    },

    circleSpinner : function(aClass){
        return '<div class="spinner '+ aClass +'">'
                    +'<div class="spinner-wrapper">'
                        +'<div class="rotator">'
                            +'<div class="inner-spin"></div>'
                            +'<div class="inner-spin"></div>'
                        +'</div>'
                    +'</div>'
                +'</div>';
    },
        /**
         * Detaches all rightbound siblings of an element
         * @param scopeElement
         */
    detachSiblings: function(scopeElement){

        var elements = $(scopeElement).siblings();
        var passedElement = false;

        if(elements.length > 1){

            for(var i = 0; i < elements.length; i++){

                if(passedElement){
                    $(elements[i]).detach();
                }

                if(elements[i] === scopeElement){
                    passedElement = true;
                }

            }
        }
    },

    /**
     * Detaches all the children of the DOM Element passed in
     * pass as many extra arguments as needed. Each extra argument will prevent a class or id from being removed from the dom
     * @param scopeElement
     */
    detachChildren: function(scopeElement){
        var extras = [].slice.call(arguments).splice(1);

        $.each($(scopeElement).children(), function(){

            var classes = this.className.split(" ");
            var elId    = this.id;
            if(classes.nothingInCommon(extras) && extras.indexOf(elId) < 0){
                $(this).detach();
            }

        });
    },

    /**
     * Shows all rightbound siblings of a given DOM Element
     * @param scopeElement
     */
    showSiblings: function(scopeElement){
        var currentNode = scopeElement.nextSibling;

        if(currentNode == null || typeof  currentNode == typeof undefined){

        } else{
            $(currentNode).show();
            UtilityBelt.showSiblings(currentNode);
        }
    },


    /**
     * Hides rightbound siblings of a given DOM Element
     * @param scopeElement
     */
    hideSiblings: function(scopeElement){
        var currentNode = scopeElement.nextSibling;

        if(currentNode == null || typeof  currentNode == typeof undefined){

        } else{
            $(currentNode).hide();
            UtilityBelt.hideSiblings(currentNode);
        }
    },

    /**
     * Capitalize the first letter in every word for presentation purposes - useful when displaying queried information
     * (There is also an extension of the String object with this same functionality at the bottom of the file)
     * @param string
     * @returns {string}
     */
    capitalizeFirstLetter: function(string){
        var newString = string.split(" ");
        var finishedString = '';
        for(var i = 0; i < string.length; i++){
            newString[i].replace(newString[i].substr(0), newString[i].substr(0).toUpperCase());
            finishedString += " "+newString[i];
        }

        return finishedString;
    },

    /**
     * This function takes an HTML canvas element and animates a checkmark. The values used are scaled proportionally so that multiple sizes
     * of checkmark can be used.
     * @param canvas
     */
    animatedCheck: function(canvas){
        var start = canvas.height / 2;
        var mid = Math.ceil(canvas.height / 2 * (200/ 145));
        var end = canvas.height * (250 / 200);
        var width = Math.floor(canvas.height * .11);
        var leftX = start;
        var leftY = start;
        var rightX = mid - (width / 2.7);
        var rightY = mid + (width / 2.7);
        var animationSpeed = 10;

        var ctx = canvas.getContext('2d'); //document.getElementsByTagName('canvas')[0].getContext('2d');
        ctx.lineWidth = width;
        ctx.strokeStyle = 'rgba(0, 150, 0, 1)';

        for (var i = start; i < mid; i++) {
            var drawLeft = window.setTimeout(function () {
                ctx.beginPath();
                ctx.moveTo(start, start);
                ctx.lineTo(leftX, leftY);
                ctx.stroke();
                leftX++;
                leftY++;
            }, 1 + (i * animationSpeed) / 3);
        }

        for (var i = mid; i < end; i++) {
            var drawRight = window.setTimeout(function () {
                ctx.beginPath();
                ctx.moveTo(leftX, leftY);
                ctx.lineTo(rightX, rightY);
                ctx.stroke();
                rightX++;
                rightY--;
            }, 1 + (i * animationSpeed) / 3);
        }
    },

    /**
     * This function simply adds classes to the sidebar and main containerForData so that the sidebar will collapse
     * and give the user more screen real estate
     * @param sidebar - the Element object associated with the sidebar
     * @param button - the Element object associated with the button
     * @param isCollapse - boolean are we expanding or collapsing?
     */

    collapseSidebar: function(sidebar, button, isCollapse){

        var $container = $("#containerForData");
        var $toolbar = $(".toolbarOptions");
        if(isCollapse){
            $(sidebar).addClass('smallSidebar');
            $container.addClass('wideContainer');
            //$("#collapseLeft").animate({left: '1px'},{duration: 800, queue: false});
            $(".linkText").hide();

        } else{

            $(sidebar).removeClass('smallSidebar');
            $container.removeClass('wideContainer');

            setTimeout(function(){
                $(".linkText").show();
            }, 500);
        }
        button.classList.toggle('bt-menu-open');

        if($toolbar.length){
            setTimeout(function(){
                $toolbar.width($(".workoutWeek").width());
            }, 500);
        }

    },

    findSibling: function(node, searchFor){

      var siblings = $(node).nextAll();

        for(var i = 0; i < siblings.length; i++){

            if(siblings[i] === searchFor){
                return true;
            }
        }

        return false;
    },

    /**
     * This function currently dims the background and displays a circle check for 1 second to confirm that a user completed
     * and action successfully. I honestly hate this and need to change to a more modern looking success confirmation
     */
    confirmSuccess: function(){
        $("body").append('<img src = "images/check.png" id = "successConfirmation">');
        $("#successConfirmation").dimBackground({darkness: 0.7});
        setTimeout(function(){
            $("#successConfirmation").undim();
            $("#successConfirmation").detach();
        }, 1000);
    },
    /**
     * Escapes string input
     * @param input - String
     * @returns {string}
     */
    addSlashes: function(input){

        var output = "";

        for(var i = 0; i < input.length; i++){

            if(input[i] === "'" || input[i] === '"'){
                output += "\\";
            }
            output += input[i];
        }

        return output;
    },

    /**
     * Remove slashes
     * @param input
     * @returns {string}
     */
    removeSlashes: function(input){

        var output = "";

        for(var i = 0; i < input.length; i++){

            if(input[i] !== "\\"){
                output += input[i];
            }

        }
        return output;
    },

    /**
     * This is a sub-namespace of UtilityBelt that governs date manipulation. I wanted all of my date manipulation functions
     * to be in the same place and be easily findable... Yes, I think it's worth the extra typing.
     */
    DateManipulation: {

        /**
         * Turns a mysql date stored in a format like 2015-08-05 into a javascript date
         * @param rawDateTime - a mysql date or datetime variable
         * @returns {Date}
         */
        parseMySQLDate: function(rawDateTime){
            // Split timestamp into [ Y, M, D, h, m, s ]
            var t = rawDateTime.split(/[- :]/);

            return new Date(t[0], t[1] - 1, t[2]);

            // -> Wed Jun 09 2010 13:12:01 GMT+0100 (GMT Daylight Time)
        },

        parseMySQLDateTime: function(rawDateTime){

            var t = rawDateTime.split(/[- :]/);
            return new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
        },

        /**
         * We need to be able to turn a value like this: "02-14-2016 12:00 am" into a mysql datetime stamp, which would look like this:
         * "02-14-2016 00:00:00"
         *
         * @param str
         * @returns {string|*|Promise}
         */
        parseDateTimePickerString: function(str){

            var arr = str.split(" ");
            var date = arr[0];
            var time = arr[1];
            var stamp = arr[2];

            var datesplit = date.split("-");
            datesplit = datesplit.move(datesplit.length - 1, 0);
            console.log("parse year",  datesplit);
            
            date = datesplit.join("-");

            var timesplit = time.split(":");
            timesplit[0] = parseInt(timesplit[0]);
            if(stamp === "am" && timesplit[0] === 12){
                timesplit[0] = "00";
            }
            if(stamp === "pm"){
                timesplit[0] -= 12;
            }
            timesplit = timesplit.join(':');
            timesplit += ":00"; //add seconds to the end of the timestamp;

            return date + " " + timesplit;
        },

        /**
         * Calculate the number of days between 2 dates - uses the UNIX timestamp as the divisor to convert the result
         * to an integer using whole days as the unit
         * @param first
         * @param second
         * @returns {Number}
         */
        daydiff: function(first, second) {
            return Math.round((second-first)/(1000*60*60*24));
        },

        /**
         * Takes javascript date object and returns a string with the month, day, and year for the purposes of displaying a date
         * @param dateObj
         * @returns {string}
         */
        parseDate: function(dateObj){
            // Split timestamp into [ Y, M, D, h, m, s ]
            var thismonth   = dateObj.getUTCMonth(); //months from 1-12
            var day         = dateObj.getUTCDate();
            var year        = dateObj.getUTCFullYear();

            var newdate     = month[thismonth]+ " " + day;// + ", " + year;

            return newdate;
            // -> Wed Jun 09 2010 13:12:01 GMT+0100 (GMT Daylight Time)
        },

        /**
         * Converts a date object to the jquery ui's datepicker format
         * @param dateObj
         * @returns {string}
         */
        toDatePickerFormat: function(dateObj){

            var thismonth   = dateObj.getUTCMonth() + 1; //months from 1-12
            var day         = dateObj.getUTCDate();
            var year        = dateObj.getUTCFullYear();

            return thismonth + "/" + day + "/" + year; // 8/31/2015
        },
        /**
         * Converts javascript date object to mysql date format
         * @param dateObj
         * @returns {string}
         */
        convertToMySQLDate: function(dateObj){
            var year, month, day;
            year = String(dateObj.getFullYear());
            month = String(dateObj.getMonth() + 1);
            if (month.length == 1) {
                month = "0" + month;
            }
            day = String(dateObj.getDate());
            if (day.length == 1) {
                day = "0" + day;
            }
            return year + "-" + month + "-" + day;
        }

    },
    /**
     * Visits every node of the DOM in HTML source order, starting from some given node.
     * It invokes a function, passing it each node in turn. walkTheDOM calls itself to process each of the child nodes.
     *
     * @param node - a DOM node to begin the traversal from
     * @param func - a function that takes a DOM node as a parameter
     */
    walkTheDOM: function(node, func){
        func(node);
        node = node.firstChild;
        while(node){
            this.walkTheDOM(node, func);
            node = node.nextSibling;
        }
    },

    /**
     * Sets a DOM nodes color and then fades it to a different color. Right now it does yellow to white, but could easily be expanded to
     * go from color X to color Y
     *
     * @param node
     */
    fadeNode: function(node){
        var level = 1;
        var step = function(){
            var hex = level.toString(16);
            node.style.backgroundColor = '#FFFF' + hex + hex;
            if(level < 15){
                level += 1;
                setTimeout(step, 100);
            }
        };
        setTimeout(step, 100);
    },

    /**
     * the purpose of this function is to slide sibling nodes (rightbound) out and new ones in
     *
     * @param node - the node that will be traded out
     * @param isForward - boolean that decides which direction the application is moving in
     * @param newMaterial - the new material that will slide in (can be an element object or raw html)
     * @param nodeArray - just pass in a blank array literal and the object will recursively fill the array with DOM nodes. When the base
     * case is met, the function will loop through the node array and slide each element right or left
     */
    tradeSiblings: function(node, isForward, newMaterial, nodeArray){

        var currentNode = node.nextSibling;
        var slideIn = '', slideOut = '';
        var parent = node.parentNode;

        if(currentNode == null || typeof currentNode === typeof undefined){
            //get a slide direction

            if(isForward){
                slideIn = 'right';
                slideOut = 'left';
            } else{
                slideIn = 'left';
                slideOut = 'right';
            }


            $.each(nodeArray, function(){
                $(this).hide("slide", {direction: slideOut}, 300);
            });

            //decide how to bring the content in

            if($(document).find($(newMaterial)).length === 0) {
                $(parent).delay(1000).append(newMaterial).show("slide", {direction: slideIn}, 500, function(){
                    $(".ui-effects-wrapper").detach();
                });
            } else {
                $(newMaterial).delay(100).show("slide", {direction: slideIn}, 500, function(){
                    $(".ui-effects-wrapper").detach();
                });
            }

        } else{

            nodeArray.push(currentNode);
            UtilityBelt.tradeSiblings(currentNode, isForward, newMaterial, nodeArray);
        }

    },

    /**
     * Reliably gets the width of the viewport - jqueries .width() function will stop at html/body min-width
     */
    getViewPortWidth : function () {
        if (self.innerHeight) {
            return self.innerWidth;
        }

        if (document.documentElement && document.documentElement.clientHeight) {
            return document.documentElement.clientWidth;
        }

        if (document.body) {
            return document.body.clientWidth;
        }
    },

    /**
     * Swap 2 array elements by index
     *
     * @param arr
     * @param indexA
     * @param indexB
     */
    swapArrayElements : function(arr, indexA, indexB) {
        var temp = arr[indexA];
        arr[indexA] = arr[indexB];
        arr[indexB] = temp;
    },

    /**
     * Similar to tradeSiblings, only with elements that don't have a top level sibling node that needs to stay
     * put in the window.
     *
     * @param parentNode - the parent node
     * @param isLeft - true if sliding right to left
     * @param newChild - the child to append
     * @param outChild - the child on its way out
     * @param deleteChild - boolean, if true delete the child that was just removed
     * @param dontAppend  - boolean, if true just show the element without appending it
     *
     */
    swapChildren: function(parentNode, isLeft, newChild, outChild, deleteChild, dontAppend){

        var slideIn = '', slideOut = '';

        if(isLeft){
            slideIn = 'right';
            slideOut = 'left';
        } else{
            slideIn = 'left';
            slideOut = 'right';
        }

        console.log("out child", outChild);

        $.when($(outChild).hide("slide", {direction: slideOut}, 150, function(){

            if(deleteChild){
                $(this).remove();
            }

            })).then( function(){

                if(dontAppend){
                    $(newChild).show("slide", {direction: slideIn}, 200)
                } else{
                    $(newChild).appendTo(parentNode).hide().show("slide", {direction: slideIn}, 200)
                }
        });

    },


    /**
     * Gets children nodes and returns 1 of them based on a particular index
     *
     * @param parent
     * @param index
     * @returns {string}
     */
    childByIndex: function(parent, index){

        var children = $(parent).children();
        var ret      = '';

        $(children).each(function(i, item){

            if(i === index){
                ret = item;
            }
        });

        return ret;
    },



    /**
     * Drag and drop function specifically for dragging photos into a div called photoHolder. Uses javascript native
     * FileReader object to read the data in
     */
    dragNDrop: function() {
        var photoHolder = document.getElementById('photoHolder');
        photoHolder.ondragover = function () {
            this.className = 'hover';
            return false;
        };
        photoHolder.ondragleave = function(){
            this.className = '';
            return false;
        };
        photoHolder.ondragend = function () {
            this.className = '';
            return false;
        };
        photoHolder.ondrop = function (e) {
            this.className = '';
            e.preventDefault();

            var file = e.dataTransfer.files[0];
            var reader = new FileReader();

            reader.onloadend = function (event) {

                photoHolder.style.background = 'url(' + event.target.result + ') no-repeat center';
                $("#imgText").detach();
                console.log(file);
                document.getElementById('photo').value = file;
            };
            reader.readAsDataURL(file);
        }
    },
    /**
     * This function will determine the strength of a password
     * based on the variety of characters and length of the password
     * @param str - a password string
     * @returns {number}
     */
    validatePassword: function(str){
        var password = str;
        var tests = {
            hasNumber: false,
            hasCapLetter: false,
            hasSpecialChar: false,
            hasLetter: false,
            numberOfCharacters: str.length
        };

        for(var i = 0; i < password.length; i++){
            if(!isNaN(password[i] * 1)){
                tests.hasNumber = true;
            } else if(/[a-zA-Z]/.test(password[i])){
                if(password[i] === password[i].toUpperCase()){
                    tests.hasCapLetter = true;
                } else{
                    tests.hasLetter = true;
                }
            } else{
                tests.hasSpecialChar = true;
            }
        }
        var keys = Object.keys(tests);
        var score = 0;
        for(var i = 0; i < keys.length; i++){
            if(tests[keys[i]] === true) score += 15;
        }
        score += (tests.numberOfCharacters * 5);
        if(score < 100){
            return score;
        } else{
            return 100;
        }

    },

    /**
     * regex for testing if a string is a valid email
     * @param str
     * @returns {boolean}
     */
    checkValidEmail : function(str){
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(str);
    },

    /**
     * Alec's function to check for a valid url - let's test this out thoroughly.
     * @returns {*}
     */
    checkValidUrl: function(text){

        return /http[s]{0,1}:\/\/[a-z\d]*\.[a-z\d]*\.{0,1}[a-z\d]*/gi.test(text);

    },

    checkIfUrlExists : function (url, callback){

        $.ajax({
            async: true,
            url : window.ForteRoot + 'php/checkUrlValidity.php',
            data: JSON.stringify({'url' : url}),
            type: "POST",
            datatype: 'json',
            success: function(){

            },
            error: function() {

            }
        }).done(function(json){

            json = JSON.parse(json);
            callback(json);
        });

    },

    /**
     * This function recursively animation sibling elements down by setting their top property
     *
     * @param element - initial node
     * @param pixelMovement
     * @param isDown
     * @returns {boolean}
     */
    repositionSite: function( element, pixelMovement, isDown){


        if(!isDown) pixelMovement = pixelMovement * -1;

        while(element != null) {

            var position = $(element).offset();
            $(element).animate({top:  pixelMovement + 'px'}, {duration: 500, queue: false});

            element = element.nextSibling;
        }
    },

    /**
     * This is a function born out of laziness. Specify a root element, whether you'd like to show or hide that element, and an array of selectors.
     * It's useful when there are several show or hide operations that need to be performed and don't want your code to look like shit because of it.
     *
     * @param root - a higher level DOM element that will be used to find elements in the array
     * @param bool - true means show, false means hide
     * @param arr - an array of selectors (e.g. '#selector' or '.selector')
     */
    toggleMultipleElements: function(root, bool, arr){

        for(var i = 0; i < arr.length; i++){

            if(bool){
                $(root).find(arr[i]).show();
            } else{
                $(root).find(arr[i]).hide();
            }

        }

    },

    /**
     * This function is a jQuery copy and paste solution.
     * If I hadn't already used this function in several places I'd rename it because it isn't truly copy and paste.
     * It swaps the two elements.
     *
     * @param copy - element to be copied
     * @param paste - element to be pasted
     */
    copyAndPaste: function(copy, paste){

        var pasted = paste.cloneNode(true),
            copied = copy.cloneNode(true);

        $(paste).replaceWith($(copied));
        $(copy).replaceWith($(pasted));
    },

    /**
     * A function for calling a function based on a string name, a context should (almost) always be "window", and an arbitrary list of arguments.
     * An example of its implementation would look like this "UtilityBelt.executeFunctionByName("Schedule."+schedule.treeNode['functionName'], window, schedule);"
     *
     * @param functionName - name of the function to be called
     * @param context - the scope that contains the function. Honestly could have just used window for almost all cases.
     * @returns {*}
     */
    executeFunctionByName: function(functionName, context /*, args */) {

        var args = [].slice.call(arguments).splice(2);
        var namespaces = functionName.split(".");
        var func = namespaces.pop();

        for(var i = 0; i < namespaces.length; i++) {

            context = context[namespaces[i]];
        }
        //console.log('execution info', context, func, args);
        return context[func].apply(this, args);
    },

    /**
     * This method returns the highest ancestor of an element that is still the child of another element.
     *
     * For example if you had a hierarchy that looked like this:
     *
     * node1
     *      node2
     *           node3
     *                node 4
     *
     * and you were to call UtilityBelt.isChildOf(node4, node2, node4) the result would be node 3
     *
     * @param child - child element
     * @param parent - parent element that you're making sure is still the parent of the element returned
     * @param result - just pass in the same variable you'd pass to child. This parameter just ensures that the return value is still
     * a child of parent, since the base case is that the child no longer is contained within the parent
     * @returns {*}
     */
    isChildOf: function(child, parent, result){

        if(!$.contains(parent, child)){

            return result;
        } else{

            result = child;
            return UtilityBelt.isChildOf(child.parentNode, parent, result)
        }
    },

    /**
     * Gets all elements with a matching attribute
     *
     * @param attribute
     * @returns {Array}
     */
    getAllElementsWithAttribute: function(attribute) {
        var matchingElements = [];
        var allElements = document.getElementsByTagName('*');
        for (var i = 0, n = allElements.length; i < n; i++)
        {
            if (allElements[i].getAttribute(attribute) !== null) {
                // Element exists with attribute. Add to array.
                matchingElements.push(allElements[i]);
            }
        }
        return matchingElements;
    },

    /**
     * Looks at a json object and finds the fields with actual values
     * @param json
     * @returns {Array}
     */
    fieldsWithValues: function(json){

        var validFields = [];
        for(var key in json){

            if(json.hasOwnProperty(key)){
                if(json[key] > 0 && json[key].length > 0){
                    validFields.push([UtilityBelt.capitalizeFirstLetter(key), key]);
                }
            }

        }
        return validFields;
    },
/*
    capitalizeFirstLetter: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },*/
    /**
     * Validates that input[type=file] follow a valid extension (as specified by validExtensions
     * @param oForm - form element
     * @param validExtensions - array of valid extensions - ex: ['.csv','.xlsx']
     * @returns {boolean}
     */
    validateFileFields: function(oForm, validExtensions) {
        var arrInputs = oForm.getElementsByTagName("input");
        for (var i = 0; i < arrInputs.length; i++) {
            var oInput = arrInputs[i];
            if (oInput.type == "file") {
                var sFileName = oInput.value;
                if (sFileName.length > 0) {
                    var blnValid = false;
                    for (var j = 0; j < validExtensions.length; j++) {
                        var sCurExtension = validExtensions[j];
                        if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                            blnValid = true;
                            break;
                        }
                    }

                    if (!blnValid) {
                        alert("Sorry, " + sFileName + " is invalid, allowed extensions are: " + validExtensions.join(", "));
                        return false;
                    }
                }
            }
        }

        return true;
    },

    /**
     * Add commas to numbers with a regex
     * @param nStr
     * @returns {string}
     */
    addCommas: function(nStr){
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    },

    /**
     * marks an html select/option box value as selected
     * @param selector - a css selector like '#trainerClients'
     * @param value - value to check for
     */
    markSelected: function(selector, value){

        $(selector + " option").each(function(){
            var $this = $(this); // cache this jQuery object to avoid overhead

            if ($this.val() === value) { // if this option's value is equal to our value
                $this.prop('selected', true); // select this option
                return false; // break the loop, no need to look further
            }
        });
    },

    /**
     * Gets the text from a select/option dropdown
     * @param elementId - id of the element to search
     * @returns {*}
     */
    getSelectedText: function(elementId) {
        var elt = document.getElementById(elementId);

        if (elt.selectedIndex === -1)
            return null;

        return elt.options[elt.selectedIndex].text;
    },

    jsonArrMax: function(jsonArr, key){

        var max = 0;

        for(var i = 0; i < jsonArr.length; i++){

            if(jsonArr[i][key] > max){
                max = jsonArr[i][key];
            }
        }
        return max;
    },

    /**
     * Finds the total of of all key/values of an object where each key holds an object
     * @param obj
     * @param nestedKey
     * @returns {number}
     */
    nestedObjectMax: function(obj, nestedKey){

        var total = 0;
        for(var key in obj){

            if(obj.hasOwnProperty(key)){

                total += obj[key][nestedKey];
            }
        }
        return total;
    },

    flattenArrayTree: function(arr, index, ret){


        if(index === arr.length){

            return ret;

        } else if(typeof arr[index] === Array){

            UtilityBelt.flattenArrayTree(arr[index][0], 0, ret);

        } else{

            index++;
            UtilityBelt.flattenArrayTree(arr[index], index, ret);
            ret.push(arr[index]);

        }
    },

    materialClick : function(selector){

        $(selector).bind('mousedown', function(e){
            e.preventDefault();
            var $this = $(this),
                offset = $this.offset(),
                offsetY = (e.pageY - offset.top),
                offsetX = (e.pageX - offset.left);

            $this.addClass('clicked').append(
                $('<span class="btn-circle"></span>')
                    .css({
                        'top' : offsetY,
                        'left' : offsetX
                    })
            );
        }).bind('mouseup mouseout', function(e){
            e.preventDefault();
            var $this = $(this);

            $this.removeClass('clicked');
            $this.find('.btn-circle').fadeOut(function(){
                $(this).remove();
            });
                //.children().fadeOut(function(){
                //$(this).remove();
           // });
        });
    },

    /**
     * takes a mysql datetime and returns it in a nicely formatted date + time
     * @param mysqlDateTime - a mysql datetime string
     * @returns {*[]}
     */
    parseDateTime : function(mysqlDateTime, callback){

        var first = mysqlDateTime.split(" ");
        var date = first[0].split("-");
        var time = first[1].split(":");

        var displayDate = shortMonth[parseInt(date[1]) - 1] + ". " + date[2];

        var timeSuffix = "AM";
        var hour = parseInt(time[0]);

        if(hour > 12){

            hour = hour - 12;
            timeSuffix = "PM";
        } else if(hour === 0){

            hour = 12;
        }

        var displayTime = hour + ":" + time[1] + " " + timeSuffix;

        if(typeof callback !== typeof undefined && callback !== null){
            callback(date, time);
        }

        return [displayDate, displayTime];
    },

    treatAsUTC : function(date) {
        var result = new Date(date);
        result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
        return result;
    },

    /**
     * Basically a javascript implementation of the php preg_quote function
     *
     * @param str
     * @returns {string}
     */
    preg_quote: function( str ) {
        // http://kevin.vanzonneveld.net
        // +   original by: booeyOH
        // +   improved by: Ates Goral (http://magnetiq.com)
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   bugfixed by: Onno Marsman
        // *     example 1: preg_quote("$40");
        // *     returns 1: '\$40'
        // *     example 2: preg_quote("*RRRING* Hello?");
        // *     returns 2: '\*RRRING\* Hello\?'
        // *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
        // *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'

        return (str+'').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
    },

    highlight: function( data, search ) {
        return data.replace( new RegExp( "(" + UtilityBelt.preg_quote( search ) + ")" , 'gi' ), "<b>$1</b>" );
    },

    GoogleMapsApi : {


        initialize: function(inputEl, callback){ //For now we're restricting the options to geocode - once I figure out this api we may want more custom options

            var autocomplete = new google.maps.places.Autocomplete(inputEl, {types: ['geocode']});
            var userLocation = this.geoLocate();
            autocomplete.setBounds(userLocation);
            autocomplete.addListener('place_changed', callback);
            return autocomplete;
        },

        geoLocate: function(){
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var geolocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    var circle = new google.maps.Circle({
                        center: geolocation,
                        radius: position.coords.accuracy
                    });
                    return circle.getBounds();
                });
            }
        }
    },


    /**
     * Check for a list of valid extensions before accepting the file
     * @param files
     * @param extensions
     * @returns {boolean}
     */
    checkExtensions: function(files, extensions){

        var extension = files.name.split('.').pop().toLowerCase();

        var ret       = false; //Defaults to file is not valid

        for(var i = 0; i < extensions.length; i++){

            if(extensions[i] === extension){
                ret = true;
            }
        }

        return ret;
    },

    /**
     * Filters an object in a similar manner to the way that arrays filter data
     *
     * @param obj
     * @param func
     */
    objectFilter : function(obj, func){

        var output = {};
        for(var key in obj){
            if(obj.hasOwnProperty(key)){

                var result = func(obj, key);
                if(result === true){
                    output[key] = obj[key]
                }
            }
        }
        return output;
    },

    objectKeyByValue: function(object, value){

        for(var key in object){
            if(object.hasOwnProperty(key)){

                if(object[key] == value){
                    return key;
                }
            }
        }
        return false;
    },

    /**
     * Loops through a bunch of text separated by spaces, puts urls in an array
     * @param text
     * @returns {Array}
     */
    getLinksFromText : function(text){

        var output = [];
        var arr     = text.split(" ");

        for(var i = 0; i < arr.length; i++){

            if(UtilityBelt.checkValidUrl(arr[i])){

                output.push(arr[i]);
            }
        }
        return output;
    },

    /**
     * To work with the embedly API we need to make sure that parts of links that denote particular page
     * locations won't show up - like http://originink.com#about
     *
     * @param link
     * @returns {*|Array.<T>}
     */
    cleanLink: function(link){

        var extensions = ['.html', '.php', '.asp', '.aspx', '.jsp', '.jspx', '.htm', '.xhtml', '.py', '.xml'];

        for(var i = 0; i < extensions.length; i++){

            var index = link.indexOf(extensions[i]);
            if(index >= 0){

                if(link[index + extensions[i].length] !== '?' || link[index + extensions[i].length] !== '/'){

                    return link.slice(0, index + extensions[i].length);
                }
            }
        }
        return link;
    },

    /**
     * If a user has upvotes in excess of 1000 (fingers crossed) we need to normalize the number
     * to fit inside of the button.
     *
     * @param number
     * @returns {*}
     */
    minifyNumber : function(number){

        if(number > 999){

            var copy = (number / 1000).toFixed(1);
            return copy + "k";

        } else{
            return number;
        }
    },

    /**
     * This function is useful for any situation where you'd need to wrap particular pieces of text
     * (like a hashtag) in a div
     *
     * @param element
     * @param char
     * @returns {Array}
     */
    getWordsByCharacter : function(text, char){

        var ret = [];
        var words = text.split(" ");
        words.forEach(function(el){
            if(el.indexOf(char) === 0){
                ret.push(el);
            }
        });
        return ret;
    },

    /**
     *
     * @param obj = {
     *      type : (positive || negative || neutral),
     *      text : text,
     *      top  : px from top (will always be centered),
     *      duration : int
     * }
     */
    notification : function(obj){

        var extraClass = obj.type === 'positive'
                         ? 'notificationPositive'
                         : obj.type === 'negative'
                         ? 'notificationNegative'
                         : 'notificationNeutral';

        var $markup = $('<div class = "notification ' + extraClass + '">'
                            + '<i class = "material-icons">close</i>'
                            +'<span>'+ obj.text +'</span>'
                        +'</div>');

        $("html").append($markup);
        $markup.css('top', obj.top + 'px');
        $markup.find('i').on('click', function(){$markup.remove();});
        setTimeout(function(){$markup.remove();}, obj.duration);
    },

    makeImageTag : function(src /* extra classes */){

        var extraClasses = [].slice.call(arguments).splice(1).reduce(function(a, b){
            return a + ' ' + b;
        }, '') || '';

        if(src.trim().length === 0){
            return '<i class = "material-icons '+ extraClasses +'">account_circle</i>';
        } else if(UtilityBelt.checkValidUrl(src)){
            return '<img src = "' + src + '" class = "' + extraClasses + '" />';
        } else{
            return '<img src = "' + window.ForteRoot + src.split("").splice(1).join("") + '" class = "' + extraClasses + '" />';
        }
    }
};



/*
 ------------------------------------------------
 End of object literal/namespace section
 Start of constructor function/class section
 ------------------------------------------------
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
 * Removes the tooltip
 * @returns {Tooltip}
 */
Tooltip.prototype.destroy = function(){

    this.jqObject.remove();
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
    var left     = jqObject.left     - contRect.left - this.container.scrollLeft;
    var top      = jqObject.top      - contRect.top  - this.container.scrollTop;
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

    var left     = domRect.left     - contRect.left - this.container.scrollLeft;
    var top      = domRect.top      - contRect.top  - this.container.scrollTop;
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

/*
 ------------------------------------------------
 End of constructor function/class section
 Start of native object extension section
 ------------------------------------------------
 */


/**
 * moves an array element from one position to another
 * @param old_index - the array index you'd like to move
 * @param new_index - the position you'd like to move it to
 * @returns {Array}
 */
Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

Array.prototype.removeDuplicates = function(){

    var output = [];
    this.forEach(function(el){
        if(output.indexOf(el) < 0){
            output.push(el);
        }
    });
    return output;
};

/**
 * For an array of json objects
 * @returns {Array}
 */
Array.prototype.cloneObjArray = function(){

    var copy = [];
    for(var i = 0; i < this.length; i++){
        copy.push(Object.create(this[i]));
    }
    return copy;
};

/**
 * For an array of json objects
 * @param key - the key you want to toal up
 * @returns {number}
 */
Array.prototype.maxByKey = function(key){

    var total = 0;

    for(var i = 0; i < this.length; i++){
        total += this[i][key];
    }
    return total;
};

Array.prototype.pushAll = function(arr){

    for(var i = 0; i < arr.length; i++){
        this.push(arr[i]);
    }
};

Array.prototype.valByKey = function(key, value){

    for(var i = 0; i < this.length; i++){

        if(this[i][key] === value){
            return this[i];
        }
    }

    return false;
};

/**
 * Compares dates from an array of json objects - this is just a fringe case example for very specific problems
 * @param key
 * @param value
 * @returns {*}
 */
Array.prototype.jsonArrDateCompare = function( key, value){

    for(var i = 0; i < this.length; i++){
        if (this[i][key].getTime() === value.getTime()) {
            return this[i];
        }
    }
    return false;
};

/**
 * Specialized function for looking at an array of json objects and returning
 * values approximately 1/3 of the way through and 2/3 of the way through
 * @param dateKey
 * @returns {Array}
 */
Array.prototype.jsonDateArrQuantiles = function(dateKey){

    var q1 = Math.floor(this.length / 4);
    var q3 = Math.floor(this.length /  (4/3));
    console.log("q1, q3", q1, q3, dateKey, this);
    var min, max;
    var ret = [];

    for(var i = 0; i < this.length; i++){
        if (i === q1) {
            ret[0] = this[i][dateKey];
        }

        if(i === q3){
            ret[1] = this[i][dateKey];
        }

        if(i === 0){
            if(this.length < 3){
                min = this[i][dateKey];
            } else{
                min = this[1][dateKey];
            }

        }


        if(i === this.length - 1){
            if(this.length < 3){
                max = this[i][dateKey];
            } else{
                max = this[i - 1][dateKey];
            }
        }
    }

    if(typeof ret[0] !== typeof undefined && ret[0].getTime() === ret[1].getTime()){ //If we're working with a small date range, the quantile system will break down, make sure we don't suggest the same date for both
        ret = [min, max];
    }
    return ret;

};

/**
 * Checks if another array has any elements in common with it. The phrasing of the method is basically
 * an assertion. So if this array has nothing in common with that array return true.
 *
 * Example :
 *
 * [1, 2].nothingInCommon([3,4]) === true
 *
 * [1, 2].nothingInCommon([3,2]) === false
 *
 * @param anotherArray
 */
Array.prototype.nothingInCommon = function(anotherArray){

    for(var i = 0; i < this.length; i++){

        if(anotherArray.indexOf(this[i]) >= 0){
            return false;
        }
    }
    return true;
};


Array.prototype.sameArray = function(arr2){

    if(this.length !== arr2.length)
        return false;
    for(var i = this.length; i--;) {
        if(this[i] !== arr2[i])
            return false;
    }

    return true;

};


Array.prototype.removeDuplicateObjects = function(key){

    var storage = [], output = [];

    for(var i = 0; i < this.length; i++){

        if(storage.indexOf(this[key]) < 0){
            storage.push(this[key]);
            output.push(this);
        }
    }
    return output;
};

/**
 * Polyfil for findIndex method
 * @param predicate
 * @returns {number}
 */
Array.prototype.findIndex = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
};

/**
 * Performs an insertion sort on an array of objects
 * @param key
 * @param isGreatestToLeast
 * @returns {Array}
 */
Array.prototype.insertionSort = function(key, isGreatestToLeast){

    for (var i = 1; i < this.length; i++) {

        var next = this[i];
        var j = i;

        if (isGreatestToLeast) {

            while (j > 0 && next[key] > this[j - 1][key]) {

                this[j] = this[j - 1];
                j--;
            }
        } else {

            while (j > 0 && next[key] < this[j - 1][key]) {

                this[j] = this[j - 1];
                j--;
            }
        }

        this[j] = next;
    }
    return this;
}
/**
 * Cleans an array by passing an argument that you want deleted (like undefined).
 *
 * @param deleteValue
 * @returns {Array}
 */
Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

/**
 * extends the functionality of the Date() object to include a function called addDays that adds days to
 * a javascript date based on an integer
 * @param days
 * @returns {Date}
 */
Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};

Date.prototype.daydiff =  function(second) {
    return Math.round((second-this)/(1000*60*60*24));
};

Date.prototype.daysBetween = function(endDate){

    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (UtilityBelt.treatAsUTC(endDate) - UtilityBelt.treatAsUTC(this)) / millisecondsPerDay;
};

Date.prototype.displayAsMonthCommaDay = function(){

    var month = this.getMonth();
    var day   = this.getDate();

    return UtilityBelt.month[month] + ". " + day;
};
/**
 * The ultimate date function for determining the difference between 2 dates by every useful measure
 *
 * @param endDate - if the programmer wants to compare a past date to an endDate they can provide an optional argument
 * @returns {string[]}
 */
Date.prototype.displayTimeDifference = function(endDate){

    var now         = typeof endDate === typeof undefined || endDate === null ? new Date() : endDate;
    var DAYS        = 1000 * 60 * 60 * 24;
    var HOURS       = 1000 * 60 * 60;
    var MINUTES     = 1000 * 60;
    var SECONDS     = 1000;

    var utc1 = Date.UTC(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds());
    var utc2 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

    var yearDiff        = now.getFullYear() - this.getFullYear();
    var monthDiff       = now.getMonth() - this.getMonth();
    var dayDiff         = Math.floor((utc2 - utc1) / DAYS);
    var hourDiff        = Math.floor((utc2 - utc1) / HOURS);
    var minuteDiff      = Math.floor((utc2 - utc1) / MINUTES);
    var secondDiff      = Math.floor((utc2 - utc1) / SECONDS);

    if(yearDiff > 0){

        return [yearDiff, "Y"];

    } else if(monthDiff > 0){

        return [monthDiff, "M"]

    } else if(dayDiff > 0){

        return [dayDiff, "D"];

    } else if(hourDiff > 0){

        return [hourDiff, "H"];

    } else if(minuteDiff > 0){

        return [minuteDiff, "M"]

    } else if(secondDiff > 0){

        return [secondDiff, "S"];

    }

};

/**
 * Parses a javascript date and returns a nicely formatted string for display
*
 * @returns {string}
 */
Date.prototype.correctDisplay = function(){


    var now         = new Date();
    var DAYS        = 1000 * 60 * 60 * 24;
    var HOURS       = 1000 * 60 * 60;
    var MINUTES     = 1000 * 60;
    var SECONDS     = 1000;

    var utc1 = Date.UTC(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds());
    var utc2 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

    var yearDiff        = now.getFullYear() - this.getFullYear();
    var monthDiff       = now.getMonth() - this.getMonth();
    var dayDiff         = Math.floor((utc2 - utc1) / DAYS);

    if(yearDiff > 0){

        return UtilityBelt.shortMonth[this.getMonth()] + ". " + this.getFullYear();

    } else if(monthDiff > 0){

        return UtilityBelt.shortMonth[this.getMonth()] + ". " + this.getDate();

    } else if(dayDiff > 0){

        return UtilityBelt.dayPrefix[this.getDay()].capitalizeFirstLetter() + " " + this.prettyPrintTime();

    } else {

        return this.prettyPrintTime();
    }
};


Date.prototype.prettyPrintTime = function(){

    // Create an array with the current hour, minute and second
    var time = [ this.getHours(), this.getMinutes() ];

    // Determine AM or PM suffix based on the hour
    var suffix = ( time[0] < 12 ) ? "AM" : "PM";

    // Convert hour from military time
    time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;

    // If hour is 0, set it to 12
    time[0] = time[0] || 12;

    // If seconds and minutes are less than 10, add a zero
    for ( var i = 1; i < 3; i++ ) {
        if ( time[i] < 10 ) {
            time[i] = "0" + time[i];
        }
    }

    // Return the formatted string
    return time.join(":") + " " + suffix;
};


/**
 * This is actually a bit of a specialized case, but I want to make this more generic eventually with a callback instead of a return statement
 *
 * @param endDate - if the programmer wants to compare a past date to an endDate they can provide an optional argument
 * @returns {string}
 */
Date.prototype.displayTimeRelativeUnits = function(endDate){

    var now         = typeof endDate === typeof undefined || endDate === null ? new Date() : endDate;
    var DAYS        = 1000 * 60 * 60 * 24;
    var HOURS       = 1000 * 60 * 60;
    var MINUTES     = 1000 * 60;
    var SECONDS     = 1000;

    var utc1 = Date.UTC(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds());
    var utc2 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

    var yearDiff        = now.getFullYear() - this.getFullYear();
    var monthDiff       = now.getMonth() - this.getMonth();
    var dayDiff         = Math.floor((utc2 - utc1) / DAYS);
    var hourDiff        = Math.floor((utc2 - utc1) / HOURS);
    var minuteDiff      = Math.floor((utc2 - utc1) / MINUTES);
    var secondDiff      = Math.floor((utc2 - utc1) / SECONDS);

    if(yearDiff > 0){

        return this.getFullYear();

    } else if(monthDiff > 0){

        return UtilityBelt.shortMonth[this.getMonth()].capitalizeFirstLetter() + " " + this.getDate();

    } else if(dayDiff > 0){

        return UtilityBelt.shortMonth[this.getMonth()].capitalizeFirstLetter() + " " + this.getDate();

    } else if(hourDiff > 0){

        return [hourDiff, "H"];

    } else if(minuteDiff > 0){

        return [minuteDiff, "M"]

    } else if(secondDiff > 0){

        return [secondDiff, "S"];

    } else {
        return "Just now";
    }

};


Date.prototype.toMysqlDate = function() {
    var year, month, day;
    year    = String(this.getFullYear());
    month   = String(this.getMonth() + 1);
    if (month.length == 1) {
        month = "0" + month;
    }
    day = String(this.getDate());
    if (day.length == 1) {
        day = "0" + day;
    }
    return year + "-" + month + "-" + day;
};

Date.prototype.toMysqlDatetime = function(){

    return this.toISOString().slice(0, 19).replace('T', ' ');
};

Date.prototype.previousSunday = function(){

    var dayInt      = this.getDay();
    var daysToAdd   = dayInt === 0 ? 0 : dayInt * -1;
    return this.addDays(daysToAdd); // returns the previous sunday
};

Date.prototype.nextSunday = function(){

    var dayInt      = this.getDay();
    var daysToAdd   = dayInt === 0 ? 0 : 7 - dayInt;
    return this.addDays(daysToAdd);
};

/**
 * converts a javascript Date into something like 03/16 where
 * 03 = month and 16 equals day
 * @returns {string}
 */
Date.prototype.monthSlashDay = function(){
    return this.toMysqlDate().toString().substring(5).replace('-','/');
};

Date.prototype.monthSlashDaySlashYear = function(){

    return this.toMysqlDate().toString().replace(/-/g,'/');
};

/**
 * REPLACE A CHARACTER INSIDE OF A STRING WITH A DIFFERENT INDEX
 * @param index
 * @param character
 * @returns {string}
 */
String.prototype.replaceAt = function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
};

/**
 * Capitalize the first letter of a string
 * @returns {string}
 */
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.stripHtml = function(){
    return this.replace(/(<([^>]+)>)/ig, "");
};