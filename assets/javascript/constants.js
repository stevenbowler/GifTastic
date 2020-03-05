// @ts-check

/**Initial array of feelings
 * @type {Array<string>}
 */
var feelings = ["Happy", "Sad", "Victory", "Joy", "Pain", "Middle Finger", "Indigestion", "Cut The Cheese", "Cramps", "Success", "Failure"];


/**Has page been loaded before, if yes then use animateCSS to unload previous 
 * @type {Array<object>}
 */
var favoriteArray = JSON.parse(localStorage.getItem("favoriteArray"));

// favoriteArray favArray = new favoriteArray;

/**Has page been loaded before, if yes then use animateCSS to unload previous 
 * @type {number}
 */
var gifCount = 0;


/** Used for keeping track of previous state of "feeling to be displayed" if currentFeeling = previousFeeling add 10 more, else new
 * @type {string}
 */
var lastFeeling = "";       // used if user requests 10 more of same feeling gifs then use same string


/**
 * div type where images are loaded then appended
 * @type {JQuery}
 */
var feelingView = $("<div id='feeling-view'>");

