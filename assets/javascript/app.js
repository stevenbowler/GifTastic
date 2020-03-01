// @ts-check

/** 
 * @top
 * @function top
 * @todo how to {@link pauseAudio} onclick of youtube iframe embed, i.e. play one or the other.
 * 
 * */

/**@type {JQuery} 
 * @selector $(document).ready
*/
$(document).ready(function () {

    // Initial array of feelings
    var feelings = ["Happy", "Sad", "Victory", "Joy", "Pain", "Middle Finger", "Indigestion", "Cut The Cheese", "Cramps", "Success", "Failure"];


    /** Generic function for capturing the feeling name from the data-attribute
     * @function renderButtons called from {@link bottom}
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


    /** Event when user requests to add a new feeling to {@link feelingArray}, then call {@link renderButtons}
     * @event
     * @function $("#add-feeling") 
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


    /** called from {@link document} event listener click on feeling class
     * @function alertFeelingName 
     * @param {object} e event object
     */
    const alertFeelingName = (e) => {
        var feeling = e.target.innerText;
        var url = "https://api.giphy.com/v1/gifs/search?api_key=sGt5xc6wCkBEmaU8njjufs8ZOuKh5enL&q=" + feeling;
        console.log("Feeling name is: " + e.target.innerText + "feeling: " + feeling);
        $.ajax({ url, method: "GET" })
            .then(function (response) {
                var feelingView = $("<div id='feeling-view'>");
                feelingView.empty();
                $("#base").empty();
                for (var i = 0; i < 10; i++) {
                    var gif = $("<img>");
                    var oldGif = $("#image" + i.toString());
                    oldGif.removeAttr("data-still");
                    oldGif.removeAttr("data-animate");
                    gif.addClass("gif");
                    gif.attr("src", response.data[i].images.original.url);
                    gif.attr("data-name", "image" + i.toString());
                    gif.attr("id", "image" + i.toString());
                    gif.attr("data-still", response.data[i].images.original_still.url);
                    // console.log("response data-still" + response.data[i].images.original_still.url);
                    gif.attr("data-animate", response.data[i].images.original.url);
                    // console.log("response data-" + response.data[i].images.original.url);
                    gif.attr("data-state", "animate");
                    gif.appendTo("#feeling-view");
                    feelingView.appendTo("#base");
                }
                feelingView.on("click", ".gif", gifStillAnimate);
            }).catch(function (err) {
                console.log(err);
            }
            );
    }



    /**
     * @event $(".gif") onclick toggle between animate and still called after the feeling-view class is created
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

    $(document).on("click", ".feeling", alertFeelingName);

    /**@bottom Calling the renderButtons function to display the intial buttons
     */
    renderButtons();

});