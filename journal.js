$(document).ready(function () {

    // Check off specific todos by clicking
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

    //add new todos
    $("div.container > input").keyup(function(event){
        if(event.which === 13) {
            // grab text of new todo from input
            var todoText = $(this).val();
            $(this).val("");
            // create new li and add to ul
            $(this).siblings('ul').prepend("<li class = todo ><span><i class='far fa-square'></i></span> " + todoText + "</li>");
            // $("div.tuesday > ul").prepend("<li class = todo ><span><i class='far fa-square'></i></span> " + todoText + "</li>");
        }});
});


