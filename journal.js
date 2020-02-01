$(document).ready(function () {
    var day = $("ul");
    day.on("click", ".meeting", function (){
        $(this).toggleClass("completed_meeting");
    });
    day.on("click", ".todo", function (){
        $(this).toggleClass("completed_todo");
        $("i", this).toggleClass("far fa-square far fa-check-square");
    });
    day.on("click", ".event", function (){
        $(this).toggleClass("completed_event");
    });
    day.on("click", ".list_item", function (){
        $(this).toggleClass("completed_list_item");
        $("span", this).toggleClass("green");
    });
});


