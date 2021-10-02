$(document).ready(function () {
    getTasks()
    $('#add-todo').on('click', createTodo);
    $('#todo-container-list').on('change', '#todo-complete', function () {
        let id = $(this).parent().parent().attr('data-id');
        if (this.checked) {
            toggleComplete('mark_complete', id);
        } else {
            toggleComplete('mark_active', id);
        }
    });
    $('#todo-container-list').on('click', '#todo-remove', function () {
        let id = $(this).parent().parent().attr('data-id');
        removeTask(id);
    });
    $('#filter-by-completed').on('click', function () {
        getTasks('completed');
    });
    $('#filter-by-active').on('click', function () {
        getTasks('active')
    });
    $('#show-all').on('click', function(){
        getTasks();
    });
});

let createTodo = function () {
    $.ajax({
        type: 'POST',
        url: `https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=158`,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            task: {
                content: $('#todo-input').val(),
            }
        }),
        success: function () {
            getTasks();
        },
        error: function () {
            window.alert('Something is Wrong');
        }
    })
}

let addTodo = function (todoText, checked, id) {
    let newTodo = $(
        `<div id="" class=" todo-item w-100 mb-2 todo p-3 d-flex justify-content-between align-items-center" data-id=${id}>
        <p class="m-0 todo-text">${todoText}</p>
        <div class="d-flex align-items-center">
            <input id="todo-complete" type="checkbox" ${(checked ? 'checked' : "")}>
            <button id="todo-remove" class="btn btn-outline-danger ml-3">remove</button>
        </div>
    </div>`
    );
    $('#todo-container-list').append(newTodo);
    $('#todo-input').val('');
}

let toggleComplete = function (type, id) {
    $.ajax({
        type: 'PUT',
        url: `https://altcademy-to-do-list-api.herokuapp.com/tasks/${id}/${type}?api_key=158`,
        dataType: 'json',

    });
}

let getTasks = function (filter = 'none') {
    $.ajax({
        type: 'GET',
        url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=158',
        dataType: 'json',
        success: function (response) {
            if (!response.tasks.length) {
                $('#todo-container-list').empty();
                $('#todo-container-list').append($('<h5 id="no-todo" class="text-muted mt-3">No TODO to Show</h5>'));
            } else {
                switch (filter) {
                    case 'active':
                        $('#todo-container-list').empty();
                        response.tasks.forEach(element => {
                            if (!element.completed) addTodo(element.content, element.completed, element.id)
                        });
                        break;
                    case 'completed':
                        $('#todo-container-list').empty();
                        response.tasks.forEach(element => {
                            if (element.completed) addTodo(element.content, element.completed, element.id)
                        });
                        break;
                    case 'none':
                        $('#todo-container-list').empty();
                        response.tasks.forEach(element => {
                            addTodo(element.content, element.completed, element.id)
                        });
                        break;
                }

            }
        },
        error: function () {
            window.alert('Something is Wrong');
        }
    });
}

let removeTask = function (id) {
    $.ajax({
        type: 'DELETE',
        url: `https://altcademy-to-do-list-api.herokuapp.com/tasks/${id}?api_key=158`,
        dataType: 'json',
        success: function () {
            getTasks();
        },
        error: function () {
            window.alert('Something is Wrong');
        }
    })
}



