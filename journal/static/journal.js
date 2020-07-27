$(document).ready(function () {

        //pick date and time for todos
    // $('input[name="todo_date_time"]').daterangepicker({
    //     "singleDatePicker": true,
    //     "showDropdowns": true,
    //     "minYear": 1901,
    //     "maxYear": 2100,
    //     "showWeekNumbers": true,
    //     "timePicker": true,
    //     "timePicker24Hour": true,
    //     "timePickerIncrement": 15,
    //     "locale": {
    //     "format": "MM/DD/YYYY hh-mm"}
    // });




    // make todo type selection menu work
    $('.dropdown-item').on( 'click',function() {
        var text = $(this).html();
        $(this).closest('.input-group-prepend').find('.dropdown-toggle').html(text);
        $(this).closest('.input-group-prepend').find('.js_todo_type').val(text);
        if ($(this).attr("id") === "type_meeting"){
            // $('input[name="todo_date_time"]').daterangepicker({
            //     "singleDatePicker": true,
            //     "showDropdowns": true,
            //     "minYear": 1901,
            //     "maxYear": 2100,
            //     "showWeekNumbers": true,
            //     "timePicker": true,
            //     "timePicker24Hour": true,
            //     "timePickerIncrement": 15,
            //     "locale": {
            //     "format": "MM/DD/YYYY hh-mm"}
            // })
        }
        else {
            // $('input[name="todo_date_time"]').daterangepicker({
            //     "singleDatePicker": true,
            //     "showDropdowns": true,
            //     "minYear": 1901,
            //     "maxYear": 2100,
            //     "showWeekNumbers": true,
            //     "timePicker": false,
            //     "timePicker24Hour": false,
            //     "locale": {
            //     "format": "MM/DD/YYYY"}
            // })

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
                console.log(resp);
                var dayOfWeek = resp.data.date_time
                var block = $('.'+dayOfWeek)
                    // console.log(block);
                    // console.log('.'+dayOfWeek);
                var iClass ='far fa-square';
                if (resp.data.type === "event"){
                    iClass = 'fas fa-birthday-cake';
                } else if (resp.data.type === "meeting"){
                    iClass = 'fas fa-clock';
                }
                var meetingTime = "";
                if (resp.data.type === "meeting"){
                    meetingTime = resp.data.time;
                }
                    block.find('ul').prepend("<li class ="+ resp.data.type +" data-id="+resp.data._id+"><span><i class='" + iClass+"'></i></span>" + meetingTime + " " + resp.data.text + " <span class='ul_edit'><i class='fas fa-edit'></i></span><span class='ul_delete'><i class='fas fa-trash-alt'></i></span></li>");
            } else{
                alert("Make sure you've selected todo type and filled out all the form fields");
            }

        });

    });

    //     //task editing and deletion
    //     //press edit icon
    $('button.edit-todo').data('target', '#editToDo').on('click', function (e) {
    //     //open modal, modal has all info + buttons delete forever/save
        var task_id = $(this).parent().attr('id')
        var task_type = $(this).parent().attr('class')
        var task_text = $(this).parent().attr('data-text')
        var task_time = $(this).parent().attr('data-time')
        var task_date = $(this).parent().attr('data-day')
        var task_date_time = $(this).parent().attr('data-date_time')
        console.log(task_date_time);
        var modal = $('#editToDo')
        modal.find('input[name="todo_text"]').attr('value', task_text);
        modal.find('button.dropdown-toggle').html(task_type);
        modal.find('input[name="todo_date_time"]').attr('value', task_date_time);

        $('#editToDo').modal('show');
        console.log('huevina otrabotala'+ task_id + task_type + task_text + task_time + task_date + task_date_time);
        e.stopPropagation();
    })

        //close modal when saved/deleted




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

    var delete_ul = $(".ul_delete");
    delete_ul.on("click",function (e) {
        console.log("clicked delete");
        e.stopPropagation();
    })

    //add todo modal
    $('button.add-todo').on('click', function (e) {
        var task_date_time = $(this).parent().attr('data-day');
        var modal = $('#addToDo');
        modal.find('input[name="todo_date_time"]').attr('value', task_date_time);
        $('#addToDo').modal('show');
        e.stopPropagation();

    });

    // $('#addToDo').on('shown.bs.modal', function(e) {
    //     $('#datetimepicker1').datetimepicker({
    //         // Formats
    //         // follow MomentJS docs: https://momentjs.com/docs/#/displaying/format/
    //         // inline: true,
    //         sideBySide: true,
    //         stepping: 5,
    //         useCurrent: true,
    //         allowInputToggle: true,
    //         // widgetPositioning: {
    //         //     horizontal: 'left',
    //         //     vertical: 'bottom'
    //         // },
    //         // calendarWeeks: true,
    //         // toolbarPlacement: 'bottom',
    //         // showTodayButton: true,
    //         // format: 'DD-MM-YYYY hh:mm A',
    //         // 'z-index': 2048,
    //         // Your Icons
    //         // as Bootstrap 4 is not using Glyphicons anymore
    //         icons: {
    //             time: 'fas fa-clock',
    //             date: 'fas fa-calendar-alt',
    //             up: 'fas fa-chevron-up',
    //             down: 'fas fa-chevron-down',
    //             previous: 'fas fa-chevron-left',
    //             next: 'fas fa-chevron-right',
    //             today: 'fas fa-check',
    //             clear: 'fas fa-trash',
    //             close: 'fas fa-times'
    //         }
    //     });
    // });


    //add new todos
    // $("div.container > input").keyup(function(event){
    //     if(event.which === 13) {
    //         // grab text of new todo from input
    //         var todoText = $(this).val();
    //         $(this).val("");
    //         // create new li and add to ul
    //         $(this).siblings('ul').prepend("<li class = todo ><span><i class='far fa-square'></i></span> " + todoText + "</li>");
    //         // $("div.tuesday > ul").prepend("<li class = todo ><span><i class='far fa-square'></i></span> " + todoText + "</li>");
    //     }});
});


