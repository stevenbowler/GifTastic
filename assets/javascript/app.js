// @ts-check

/** 
 * @top
 * @function top
 * @todo how to {@link pauseAudio} onclick of youtube iframe embed, i.e. play one or the other.
 * 
 * */


/**
 * Wraps all JQuery
 * @event documentReady
*/
$(document).ready(function () {



    /**Initial array of feelings
     * @type {Array<string>}
     */
    var feelings = ["Happy", "Sad", "Victory", "Joy", "Pain", "Middle Finger", "Indigestion", "Cut The Cheese", "Cramps", "Success", "Failure"];

    var tempFavoriteArray = [{ still: "https://media3.giphy.com/media/ctMRkUYFJaVMjLWO8U/…08626c2f3e7f2a1292123715e228fec1a&rid=giphy_s.gif", animate: "https://media3.giphy.com/media/ctMRkUYFJaVMjLWO8U/…7b08626c2f3e7f2a1292123715e228fec1a&rid=giphy.gif" }];
    /**Has page been loaded before, if yes then use animateCSS to unload previous 
     * @type {Array<object>}
     */
    console.log(localStorage.getItem("favoriteArray"));
    if (localStorage.getItem("favoriteArray") === null || localStorage.getItem("favoriteArray") === undefined) favoriteArray = [];
    else var favoriteArray = JSON.parse(localStorage.getItem("favoriteArray"));
    // console.log(localStorage.getItem("favoriteArray"), "JSON.parse: ", JSON.parse(localStorage.getItem("favoriteArray")));
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








    /** 
     * Generic function for capturing the feeling name from the data-attribute, called from {@link bottom}
     * @function renderButtons 
     */
    const renderButtons = () => {
        // Deleting the feelings prior to adding new feelings
        // (this is necessary otherwise we will have repeat buttons)
        $("#buttons-view").empty();

        // Looping through the array of feelings
        for (var i = 0; i < feelings.length; i++) {
            var a = $("<button>");
            a.addClass("feeling btn btn-outline-light");
            a.attr("data-name", feelings[i]);
            a.text(feelings[i]);
            $("#buttons-view").append(a);
        }
    }



    /**
     * Double click any favoriteGif displayed to delete from the {@link favoriteArray} and from local storage "favoriteArray"
     * @event onClickFavoriteGif
     */
    const onClickFavoriteGif = $(document.body).on("dblclick", ".favoriteGif", function (e) {
        var gifNodeId = e.target.attributes.getNamedItem("id").textContent;
        var gifNodeNumberText = gifNodeId.slice(-1);
        console.log("gifNodeNumberText: ", gifNodeNumberText);
        var gifNodeNumber = Number(gifNodeNumberText);
        console.log("gifNodeNumber: ", gifNodeNumber, " gifNodeId: ", gifNodeId);

        $("#" + gifNodeId).remove();
        $("p:first-child").remove();
        $("p:first-child").empty();
        favoriteArray.splice(gifNodeNumber, 1);
        console.log(favoriteArray);
        localStorage.setItem("favoriteArray", JSON.stringify(favoriteArray));
    });



    /**
     * Double click any gif displayed to add to the {@link favoriteArray} and in local storage "favoriteArray"
     * @event onDoubleClickGif
     */
    const onDoubleClickGif = $(document.body).on("dblclick", ".gif", function (e) {
        var gifNode = {
            still: e.target.attributes.getNamedItem("data-still").textContent,
            animate: e.target.attributes.getNamedItem("data-animate").textContent,
            // title: e.target.attributes.getNamedItem("title").textContent,
            // rating: e.target.attributes.getNamedItem("rating").textContent,
        }
        console.log("gifNode: ", gifNode, " favoriteArray: ", favoriteArray);
        favoriteArray.push(gifNode);
        localStorage.setItem("favoriteArray", JSON.stringify(favoriteArray));
        alert("just added to favorites, now " + favoriteArray.length + " favorites.");
    });



    /** 
     * Onclick event when user requests to add a new feeling to {@link feelingArray}, then call {@link renderButtons}
     * @constant
     * @event onClickAddFeeling
    */
    const onClickAddFeeling = $("#add-feeling").on("click", function (event) {
        event.preventDefault();
        //@ts-ignore
        var feeling = $("#feeling-input").val().trim();
        feelings.push(feeling);
        renderButtons();
    });



    /** called from {@link $(document).on("click")} event listener click on feeling class
     * @function alertFeelingName 
     * @param {object} e event object
     */
    const alertFeelingName = (e) => {
        if (gifCount >= 100) { alert("max 100 gifs exceeded, choose another feeling"); return; }
        var feeling = e.target.innerText;
        if (feeling === "Add 10 Gifs") {
            console.log("feeling" + feeling);
            feeling = lastFeeling;
            gifCount = gifCount + 10;
        }
        else {
            gifCount = 0;
            lastFeeling = feeling;
        }
        feelingView.empty();
        $("#base").empty();
        var url = "https://api.giphy.com/v1/gifs/search?api_key=sGt5xc6wCkBEmaU8njjufs8ZOuKh5enL&limit=100&q=" + feeling;
        // console.log("Feeling name is: " + e.target.innerText + "feeling: " + feeling);
        $.ajax({ url, method: "GET" })
            .then(function (response) {
                if (gifCount === 0) {       // if new feeling empty everything then reload
                }
                // console.log(response);
                var x = gifCount + 10;
                // console.log("x: " + x + " gifCount " + gifCount);
                for (var i = 0; i < x; i++) {
                    var gifDiv = $("<div style='float:left;' class='animated zoomInRight'>");  // holds gif, title and rating
                    var gif = $("<img>");
                    var pTitle = $("<p class='text-light' style='line-height:1;'>");
                    var pRating = $("<p class='text-light' style='line-height:0;'>");
                    var oldGif = $("#image" + i.toString());
                    oldGif.removeAttr("data-still");
                    oldGif.removeAttr("data-animate");
                    if (feeling != "Display Favorites") { // if not display of favorites just regular
                        gif.addClass("gif");
                        // console.log("i: ", i);
                        gif.attr("src", response.data[i].images.original_still.url);
                        gif.attr("rating", response.data[i].rating);
                        pTitle.text("Title: " + response.data[i].title);
                        pRating.text("Rating: " + response.data[i].rating);
                        gif.attr("data-name", "image" + i.toString());
                        gif.attr("id", "image" + i.toString());
                        gif.attr("data-still", response.data[i].images.original_still.url);
                        // console.log("response data-still" + response.data[i].images.original_still.url);
                        gif.attr("data-animate", response.data[i].images.original.url);
                        // console.log("response data-" + response.data[i].images.original.url);
                        gif.attr("data-state", "still");
                    } else if (i < favoriteArray.length) {
                        gif.addClass("favoriteGif");
                        console.log("i: ", i);
                        console.log("favoriteArray i: ", favoriteArray[i].still);
                        gif.attr("src", favoriteArray[i].still);
                        gif.attr("rating", favoriteArray[i].rating);
                        pTitle.text("Title: " + "favorite # " + i);
                        pRating.text("Rating: " + "favorite # " + i);
                        gif.attr("data-name", "image" + i.toString());
                        gif.attr("id", "image" + i.toString());
                        gif.attr("data-still", favoriteArray[i].still);
                        // console.log("response data-still" + favoriteArray[i].images.original_still.url);
                        gif.attr("data-animate", favoriteArray[i].animate);
                        // console.log("response data-" + favoriteArray[i].images.original.url);
                        gif.attr("data-state", "still");
                    }
                    gifDiv.append(gif);
                    gifDiv.append(pTitle);
                    gifDiv.append(pRating);
                    feelingView.append(gifDiv);
                    feelingView.appendTo("#base");
                }


                /**
                 * On click class gif calls {@link gifStillAnimate} set onclick after div built
                 * @event onClickFeelingView
                 */
                if (feeling != "Display Favorites") {
                    const onClickFeelingView = feelingView.on("click", ".gif", gifStillAnimate);
                } else {
                    console.log(" .favoriteGif onclick: image src " + gif.attr("src"));
                    const onClickFeelingView = feelingView.on("click", ".favoriteGif", gifStillAnimate);
                }
            }).catch(function (err) {
                console.log(err);
            }
            );
    }



    /**
     * Called from {@link onClickFeelingView} toggle between animate and still called after the feeling-view class is created
     * @function gifStillAnimate 
     * @param {object} e
     */
    const gifStillAnimate = (e) => {

        // data-name = id so set selector to #data-name to access data in event object
        var thisId = "#" + e.target.attributes.getNamedItem("data-name").textContent;
        var state = $(thisId).attr("data-state"); // could be "animate"
        console.log("data-name: " + $(thisId).attr("data-name"));
        console.log("175 event on click gif: state: " + state);
        if (state === "still") {
            var image = e.target.attributes.getNamedItem("data-animate").textContent;
            $(thisId).attr("src", image);
            $(thisId).attr("data-state", "animate");
        }
        else {
            var image = e.target.attributes.getNamedItem("data-still").textContent;
            $(thisId).attr("src", image);
            $(thisId).attr("data-state", "still");
        }
    }


    /**
     * Called from various points to animate unload load of content in divs,
     *      from GitHub animate.css library
     * @async
     * @function animateCSS
     * @param {*} element div id/class/tag to be modified
     * @param {*} animationName from list of animateCSS classes
     * @param {*} [callback] required if unloading before loading div with content, async
     */
    const animateCSS = (element, animationName, callback) => {
        const node = document.querySelector(element)
        node.classList.add('animated', animationName)

        function handleAnimationEnd() {
            node.classList.remove('animated', animationName)
            node.removeEventListener('animationend', handleAnimationEnd)

            if (typeof callback === 'function') callback()
        }

        node.addEventListener('animationend', handleAnimationEnd)
    }


    /**
     * Onclick event when user requests to add 10 gifs to {@link feelingView} then call {@link alertFeelingName} 
     * @event onClickDisplayFavorites
     */
    const onClickDisplayFavorites = $(document).on("click", "#display-favorites", alertFeelingName);



    /**
     * Onclick event when user requests to add 10 gifs to {@link feelingView} then call {@link alertFeelingName} 
     * @event onClickAddTen
     */
    const onClickAddTen = $(document).on("click", "#add-ten-gifs", alertFeelingName);


    /**
     * On click feeling class to call {@link alertFeelingName}
     * @event onClickFeeling 
     */
    const onClickFeeling = $(document).on("click", ".feeling", alertFeelingName);


    /**@bottom Calling the renderButtons function to display the intial buttons
     */
    renderButtons();

});