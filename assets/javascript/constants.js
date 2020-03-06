// @ts-check

/**Initial array of feelings
 * @type {Array<string>}
 */
var feelings = ["Happy", "Sad", "Victory", "Joy", "Pain", "Middle Finger", "Indigestion", "Cut The Cheese", "Cramps", "Success", "Failure"];

var tempFavoriteArray = [{ still: "https://media3.giphy.com/media/ctMRkUYFJaVMjLWO8U/…08626c2f3e7f2a1292123715e228fec1a&rid=giphy_s.gif", animate: "https://media3.giphy.com/media/ctMRkUYFJaVMjLWO8U/…7b08626c2f3e7f2a1292123715e228fec1a&rid=giphy.gif" }];
/**Has page been loaded before, if yes then use animateCSS to unload previous 
 * @type {Array<object>}
 */
console.log(localStorage.getItem("favoriteArray"), "JSON.parse: ", JSON.parse(localStorage.getItem("favoriteArray")));
if (localStorage.getItem("favoriteArray") === null) favoriteArray = [];
else var favoriteArray = JSON.parse(localStorage.getItem("favoriteArray"));
// var favoriteArray = JSON.parse(localStorage.getItem("favoriteArray") || tempFavoriteArray);
// var favoriteArray = [{still: "https://media3.giphy.com/media/ctMRkUYFJaVMjLWO8U/…08626c2f3e7f2a1292123715e228fec1a&rid=giphy_s.gif", animate: "https://media3.giphy.com/media/ctMRkUYFJaVMjLWO8U/…7b08626c2f3e7f2a1292123715e228fec1a&rid=giphy.gif"}];

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

