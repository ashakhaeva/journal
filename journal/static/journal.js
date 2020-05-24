$(document).ready(function () {

        //pick date and time for todos
    $('input[name="todo_date_time"]').daterangepicker({
        "singleDatePicker": true,
        "showDropdowns": true,
        "minYear": 1901,
        "maxYear": 2100,
        "showWeekNumbers": true,
        "timePicker": true,
        "timePicker24Hour": true,
        "timePickerIncrement": 15,
        "locale": {
        "format": "MM/DD/YYYY hh-mm"}
    });

    // make todo type selection menu work
    $('.dropdown-item').on( 'click',function() {
        var text = $(this).html();
        $(this).closest('.input-group-prepend').find('.dropdown-toggle').html(text);
        $(this).closest('.input-group-prepend').find('.js_todo_type').val(text);
        if ($(this).attr("id") === "type_meeting"){
            $('input[name="todo_date_time"]').daterangepicker({
                "singleDatePicker": true,
                "showDropdowns": true,
                "minYear": 1901,
                "maxYear": 2100,
                "showWeekNumbers": true,
                "timePicker": true,
                "timePicker24Hour": true,
                "timePickerIncrement": 15,
                "locale": {
                "format": "MM/DD/YYYY hh-mm"}
            })
        }
        else {
            $('input[name="todo_date_time"]').daterangepicker({
                "singleDatePicker": true,
                "showDropdowns": true,
                "minYear": 1901,
                "maxYear": 2100,
                "showWeekNumbers": true,
                "timePicker": false,
                "timePicker24Hour": false,
                "locale": {
                "format": "MM/DD/YYYY"}
            })

        }
    });

    //send todo

    $("form[name='todo_create']").submit(function (e) {
        e.preventDefault();
        var form = $(this);
        $.post(form.attr("action"), form.serialize(), function (resp) {
            // console.log(resp);
            if (resp["Success"]===true){
                $('#addToDo').modal('hide');
                $('.toast').toast('show');
            //    подсосать новую тудуху из базы
            } else{
                alert("Make sure you've selected todo type and filled out all the form fields");
            }

        });

    });

     //если не ок — показать ошибку
        //если ок: 1. закрыть форму 2. Подгрузить созданное событие в нужный день





        // Check off specific todos by clicking
    var day = $("ul");
    day.on("click", ".meeting", function (){
        $(this).toggleClass("completed_meeting");
    });
    day.on("click", ".todo", function (){
        $(this).toggleClass("completed_todo");
        $(this)
            .find('[data-fa-i2svg]')
            .toggleClass('far fa-square')
            .toggleClass('fas fa-check-square');
    });
    day.on("click", ".event", function (){
        $(this).toggleClass("completed_event");
    });
    day.on("click", ".list_item", function (){
        $(this).toggleClass("completed_list_item");
        $("span", this).toggleClass("green");
    });

    var edit_ul = $(".ul_edit");
    edit_ul.on("click",function (e) {
        console.log("clicked edit");
        e.stopPropagation();
    })

    var delete_ul = $(".ul_delete");
    delete_ul.on("click",function (e) {
        console.log("clicked delete");
        e.stopPropagation();
    })

    //add todo modal
    $('#addToDo').on('show.bs.modal', function (e) {
        var h4 = $(e.relatedTarget);
        var day = h4.data('day');
        var modal = $(this);
        modal.find('.modal-title').text(day);
        e.stopPropagation();
    });

    // close todo modal on submit
    // $('.js_create_todo').click(function (e) {
    //     $('#addToDo').modal('hide');
    //
    // });

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


