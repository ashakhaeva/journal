$(document).ready(function () {

    // make todo type selection menu work
    $('.dropdown-item').on( 'click',function() {
        var text = $(this).html();
        $(this).closest('.input-group-prepend').find('.dropdown-toggle').html(text);
        $(this).closest('.input-group-prepend').find('.js_todo_type').val(text);
    });

    //send todo

    $("form[name='todo_create']").submit(function (e) {
        e.preventDefault();
        var form = $(this);
        $.post(form.attr("action"), form.serialize(), function (resp) {
            // console.log(resp);
            if (resp["Success"]===true){
                $('#addToDo').modal('hide');
                $('.toast.create').toast('show');
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

    //     //task editing
    //     //press edit icon
    $('button.edit-todo').data('target', '#editToDo').on('click', function (e) {
        //     //open modal, modal has all info + buttons delete forever/save
        var this_li =$(this).parent()
        console.log(this_li)
        var task_id = $(this).parent().attr('id')
        var task_type = $(this).parent().attr('data-type')
        var task_text = $(this).parent().attr('data-text')
        var task_time = $(this).parent().attr('data-time')
        var task_date = $(this).parent().attr('data-day')
        var task_date_time = $(this).parent().attr('data-date_time')
        console.log(task_date_time);
        var modal = $('#editToDo')
        modal.find('input[name="todo_text"]').attr('value', task_text);
        modal.find('input[name="todo_type"]').attr('value', task_type.toLowerCase());
        modal.find('button.dropdown-toggle').html(task_type);
        modal.find('button.dropdown-toggle').attr('value', task_type.toLowerCase());
        modal.find('input[name="todo_date_time"]').attr('value', task_date_time);
        modal.find('input[name="todo_id"]').attr('value', task_id);

        $('#editToDo').modal('show');
        console.log('huevina otrabotala' + task_id + task_type + task_text + task_time + task_date + task_date_time);
        e.stopPropagation();
        $("form[name='todo_edit']").submit(function (e) {
            e.preventDefault();
            var form = $(this);
            $.post(form.attr("action"), form.serialize(), function (resp) {
                if (resp["Success"] === true) {
                    $('#editToDo').modal('hide');
                    $('.toast.edit').toast('show');
                    console.log(resp);
                    var dayOfWeek = resp.data.date_time
                    var block = $('.' + dayOfWeek)
                    // console.log(block);
                    // console.log('.'+dayOfWeek);
                    var iClass = 'far fa-square';
                    if (resp.data.type === "event") {
                        iClass = 'fas fa-birthday-cake';
                    } else if (resp.data.type === "meeting") {
                        iClass = 'fas fa-clock';
                    }
                    var meetingTime = "";
                    if (resp.data.type === "meeting") {
                        meetingTime = resp.data.time;
                    }
                    $(this_li).replaceWith("<li class =" + resp.data.type + " data-id=" + resp.data._id + "><span><i class='" + iClass + "'></i></span>" + meetingTime + " " + resp.data.text + " <span class='ul_edit'><i class='fas fa-edit'></i></span><span class='ul_delete'><i class='fas fa-trash-alt'></i></span></li>");
                } else {
                    alert("Make sure you've selected todo type and filled out all the form fields");
                }
            });
        });
    });



    // Check off specific todos by clicking
    var day = $("ul");
    day.on("click", "li", function (){
        var task_id = $(this).attr('id');
        console.log(task_id);
        $(this).toggleClass("completed_list_item");
        if  ($(this).hasClass("todo")){
            $(this)
                .find('[data-fa-i2svg]')
                .toggleClass('far fa-square')
                .toggleClass('fas fa-check-square')
        }
        if ($(this).hasClass("completed_list_item")){
            $.post("/todo/complete", {"todo_id": task_id, "completed": true}, function (resp) {
                if (resp["Success"] === true){
                    console.log("Task completed");
                }
            });
        }
        else {
            $.post("/todo/complete", {"todo_id": task_id, "completed": false}, function (resp) {
                if (resp["Success"] === true){
                    console.log("Task not completed");
                }
            });
        }
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

});

