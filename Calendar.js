/**
 * Created by rbmenke on 5/24/16.
 */


/**
 * GenericCalendar is sort of like an abstract class. It will never be directly used, but all calendar objects will
 * inherit from it. It's purpose is to govern the generation of a calendar based on a month, handle the process of switching
 * between months, and provide methods that allow function to be applied over certain subsets of the calendar like every day in a week,
 * or all active days, or calendar weeks.
 *
 * @constructor
 */
function GenericCalendar(){

    this.monthList          =  ["January", "February","March","April","May","June","July","August","September","October","November","December"];
    this.dayList            =  ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    this.dayAbbr            =  ["Su", "M", "T", "W", "Th", "F", "Sa"];


    this.now  = new Date();
    this.monthOffset = 0;
    this.init = function(date){ //Everything in the below function is based on the "now" variable.
        //Keeping all of these variables declared in a callable closure
        //Makes it easy to change all values at once easily just by changing
        //The value of the now variable
        this.year               = date.getFullYear();
        this.month              = date.getMonth();
        this.day                = date.getDate();
        this.weekDay            = this.now.getDay();
        this.dayOne             = new Date(this.year, this.month, 1);
        this.lastDay            = new Date(this.year, this.month + 1, 0);
        this.weekdayOfDayOne    = this.dayOne.getDay(); //Weekday of first day of month
        this.calendarDayOne     = this.dayOne.addDays(this.weekdayOfDayOne * -1); //first day on calendar
        this.weekdayofLastDay   = this.lastDay.getDay(); //Weekday of last day of month
        this.calendarLastDay    = this.lastDay.addDays(6 - this.weekdayofLastDay); //Last day on the calendar
        this.numWeeks           = Math.ceil(this.lastDay.getDate() + this.weekdayOfDayOne) / 7;
        this.calendarDays       = []; //Hold an array of calendar day objects
        this.activeCalendarDays = []; //Hold only the active calendar days, excluding any days that aren't contained in the month

    }.bind(this);

    this.init(this.now);

}

/**
 * The only reason I'm making this simple function is because I want to be able to call
 * functions that redraw the calendar from within the GenericCalendar object.
 * I actually really doubt that arguments will get passed to the func argument, but just in case
 * I'm going to apply the function with arguments.
 *
 * This function can also be passed to draw the initial calendar or redraw the calendar later
 * if that is at all relevant.
 *
 * @param func
 */
GenericCalendar.prototype.drawCalendar = function(func/*arguments*/){

    var args = [].slice.call(arguments).splice(1);
    func.apply(this, args);
};

/**
 * Draw the frame of the calendar - this should always be the highest ancestor in the calendar
 * UI element
 *
 * @param cssClass
 * @returns {Element|*}
 */
GenericCalendar.prototype.drawFrame = function(cssClass){

    var frame = document.createElement("DIV");
    frame.className = cssClass;
    return frame;
};

/**
 * append the header content of the calendar, which will just consist of the month & year display,
 * arrows for navigation, and if drawDays === true, day labels.
 *
 * @param cssClass
 * @param drawDays
 * @param dayLabelClass - a css class to give to the day labels
 * @param callback - a callback that gets passed the header prior to returning the function in case the developer wants to add anything extra
 * @returns {Element|*}
 */
GenericCalendar.prototype.drawHeader = function(cssClass, drawDays, dayLabelClass, dayNamesArr, callback){

    var header = document.createElement("DIV");
    header.className = cssClass;

    var headerContent = $('<div class = "headerContent">'
        +'<i class = "material-icons calLeft">keyboard_arrow_left</i>'
        +'<p class = "calHeaderText">'+ this.monthList[this.month] +'</p>'
        +'<i class = "material-icons calRight">keyboard_arrow_right</i>'
        +'</div>');

    header.appendChild(headerContent[0]);

    if(drawDays) {
        var headerDays = document.createElement("DIV");
        headerDays.className = dayLabelClass;
        dayNamesArr.forEach(function (el) {

            var dayLabel        = document.createElement("DIV");
            var dayLabelP       = document.createElement("P");
            var textNode        = document.createTextNode(el);
            dayLabel.className  = "calendarDayLabel";
            dayLabelP.appendChild(textNode);
            dayLabel.appendChild(dayLabelP);
            headerDays.appendChild(dayLabel);
        });
        header.appendChild(headerDays);
    }

    if(typeof callback !== typeof undefined && callback !== null){
        callback(header);
    }

    return header;
};

/**
 * Generate markup & objects for each week
 *
 * @param frame - the frame we're appending markup to
 * @param weeksClass - a css class to add to each week
 * @param dayConstructorFunc
 * @param callback
 */
GenericCalendar.prototype.drawWeeks = function(frame, weeksClass, dayConstructorFunc, callback){

    var x, currentDay = this.calendarDayOne, activeDay = false, markup; //Active day decides if we're adding an active vs inactive class to the object

    //Empty out any calendar day object arrays
    this.calendarDays = [];
    this.activeCalendarDays = [];

    for(var i = 0; i < this.numWeeks; i++){ //Loop through the number of weeks in a month

        markup = document.createElement("DIV");
        markup.className = "genericWeek " + weeksClass;

        for(x = 0; x < 7; x++){ //Now, loop through each day in the week

            //Check to see if this is an active day or not - some calendars may want to do different things to inactive days
            activeDay = currentDay.getTime() >= this.dayOne.getTime() && currentDay.getTime() <= this.lastDay.getTime();

            //Create a new day object of whatever function type gets passed to the method.
            //Pass the constructor the date and whether or not it's an active day.
            var goodDay = new dayConstructorFunc(currentDay, activeDay, this);
            this.calendarDays.push({'isActiveDay' : activeDay, 'dayObject' : goodDay});

            //All day objects must implement a method called getMarkup
            markup.appendChild(goodDay.getMarkup());
            currentDay = currentDay.addDays(1);
        }

        frame.appendChild(markup);
    }

    this.filterActiveDays();
    if(typeof callback !== typeof undefined && callback !== null){
        callback();
    }

};

/**
 * sets the active days array with only values marked as active in the calendarDays array
 */
GenericCalendar.prototype.filterActiveDays = function(){

    this.activeCalendarDays = this.calendarDays.filter(function(el){
        return el.isActiveDay === true;
    });
};


/**
 *
 * @param applyToAll - boolean value stating if we're applying this function to all days
 *                     or just active days
 * @param func
 */
GenericCalendar.prototype.applyFunctionToDays = function(applyToAll, func){

    var arr = applyToAll ? this.calendarDays : this.activeCalendarDays;
    arr.forEach(function(el){
        func(el.dayObject);
    });
};

/**
 * Takes a day an a function and applies that function to every day in that week
 *
 * @param aDayObject
 * @param func
 */
GenericCalendar.prototype.applyFunctionToWeek = function(aDayObject, func){

    var dayOfWeek = aDayObject.date.getDay(); //All day objects must have the date stored in a property called date
    var index     = this.calendarDays.indexOf(aDayObject);
    var start     = index - dayOfWeek;

    for(var i = start; i < start + 7; i++){

        func(this.calendarDays[i].dayObject);
    }
};

/**
 * Retrieve a calendar day based on a date
 * @param date
 * @returns {Array.<T>}
 */
GenericCalendar.prototype.getDayByDate = function(date){

    return this.calendarDays.filter(function(el){
        return el.dayObject.date === date;
    });
};

/**
 * Increment the month by 1 - making sure to call a redraw function & incrementing year/resetting month
 * if we're switching from Dec to Jan
 *
 * @param calendarRedrawFunc
 */
GenericCalendar.prototype.incrementMonth = function(calendarRedrawFunc /*arguments*/){

    var args = [].slice.call(arguments).splice(1);
    var month = this.now.getMonth(), day = 1;
    if(month === 11){
        this.month = 0;
        this.year++;
    } else{
        this.month++;
    }
    var current = new Date();
    if(current.getFullYear() === this.year && current.getMonth() === month){
        day = current.getDate();
    }
    this.monthOffset++;
    this.now = new Date(this.year, this.month, day);
    this.init(this.now);
    calendarRedrawFunc.apply(this, args);

};

/**
 * Decrement the month by 1 - making sure to call a redraw function & incrementing year/resetting month
 * if we're switching from Dec to Jan
 *
 * @param calendarRedrawFunc
 */
GenericCalendar.prototype.decrementMonth = function(calendarRedrawFunc /*arguments*/){

    var args = [].slice.call(arguments).splice(1);
    var month = this.now.getMonth(), day = 1;

    if(month === 0){
        this.month = 11;
        this.year--;
    } else{
        this.month--;
    }
    var current = new Date();
    if(current.getFullYear() === this.year && current.getMonth() === month){
        day = current.getDate();
    }
    this.monthOffset--;
    this.now = new Date(this.year, this.month, day);
    this.init(this.now);
    calendarRedrawFunc.apply(this, args);

};
