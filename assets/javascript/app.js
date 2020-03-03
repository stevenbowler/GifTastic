// @ts-check

/** 
 * @top
 * @function top
 * @todo how to {@link pauseAudio} onclick of youtube iframe embed, i.e. play one or the other.
 * 
 * */

/**
 * Wraps all JQuery
 * @event $documentReady
*/
$(document).ready(function () {


    /**Initial array of feelings
     * @type {Array<string>}
     */
    var feelings = ["Happy", "Sad", "Victory", "Joy", "Pain", "Middle Finger", "Indigestion", "Cut The Cheese", "Cramps", "Success", "Failure"];

    /**Has page been loaded before, if yes then use animateCSS to unload previous 
     * @type {number}
     */
    var loadCount = 0;

    /**Has page been loaded before, if yes then use animateCSS to unload previous 
     * @type {number}
     */
    var gifCount = 0;

    /**
     * div type where images are loaded then appended
     * @type {JQuery}
     */
    var feelingView = $("<div id='feeling-view'>");

    /** 
     * Generic function for capturing the feeling name from the data-attribute, called from {@link bottom}
     * @function renderButtons 
     */
    function renderButtons() {
        // Deleting the feelings prior to adding new feelings
        // (this is necessary otherwise we will have repeat buttons)
        $("#buttons-view").empty();

        // Looping through the array of feelings
        for (var i = 0; i < feelings.length; i++) {

            // Then dynamicaly generating buttons for each feeling in the array
            // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
            var a = $("<button>");
            // Adding a class
            a.addClass("feeling btn btn-outline-light");
            // Added a data-attribute
            a.attr("data-name", feelings[i]);
            // Provided the initial button text
            a.text(feelings[i]);
            // Added the button to the HTML
            $("#buttons-view").append(a);
        }
    }


    /** 
     * Onclick event when user requests to add a new feeling to {@link feelingArray}, then call {@link renderButtons}
     * @event $add-feelingOnclick
    */
    $("#add-feeling").on("click", function (event) {
        event.preventDefault();

        // This line grabs the input from the textbox
        //@ts-ignore
        var feeling = $("#feeling-input").val().trim();

        // The feeling from the textbox is then added to array
        feelings.push(feeling);

        // Calling renderButtons which handles the processing of feeling array
        renderButtons();
    });



    var lastFeeling = "";       // used if user requests 10 more of same feeling gifs then use same string

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
        console.log("Feeling name is: " + e.target.innerText + "feeling: " + feeling);
        $.ajax({ url, method: "GET" })
            .then(function (response) {
                if (gifCount === 0) {       // if new feeling empty everything then reload
                }
                console.log(response);
                var x = gifCount + 10;
                console.log("x: " + x + " gifCount " + gifCount);
                for (var i = 0; i < x; i++) {
                    var gifDiv = $("<div style='float:left;' class='animated zoomInRight'>");
                    var gif = $("<img>");
                    var pTitle = $("<p class='text-light' style='line-height:1;'>");
                    var pRating = $("<p class='text-light' style='line-height:0;'>");
                    var oldGif = $("#image" + i.toString());
                    oldGif.removeAttr("data-still");
                    oldGif.removeAttr("data-animate");
                    gif.addClass("gif");
                    console.log("i: ", i);
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
                    gifDiv.append(gif);
                    gifDiv.append(pTitle);
                    gifDiv.append(pRating);
                    feelingView.append(gifDiv);
                    // gif.appendTo("#feeling-view");
                    // p.appendTo("#feeling-view");
                    feelingView.appendTo("#base");
                    // gifCount = gifCount + 10;
                }


                /**
                 * On click class gif calls {@link gifStillAnimate} set onclick after div built
                 * @event $feelingViewOnclick
                 */
                feelingView.on("click", ".gif", gifStillAnimate);
            }).catch(function (err) {
                console.log(err);
            }
            );
    }



    /**
     * Onclick toggle between animate and still called after the feeling-view class is created
     * @function gifStillAnimate 
     * @param {object} e
     */
    const gifStillAnimate = (e) => {

        // data-name = id so set selector to #data-name to access data in event object
        var thisId = "#" + e.target.attributes.getNamedItem("data-name").textContent;
        var state = $(thisId).attr("data-state"); // could be "animate"
        // console.log("data-name: " + $(thisId).attr("data-name"));
        // console.log("127 event on click gif: state: " + state);
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
     * @event $addTenOnclick
     */
    $(document).on("click", "#add-ten-gifs", alertFeelingName);

    /**
     * On click feeling class to call {@link alertFeelingName}
     * @event $documentOnclick 
     */
    $(document).on("click", ".feeling", alertFeelingName);

    /**@bottom Calling the renderButtons function to display the intial buttons
     */
    renderButtons();

});