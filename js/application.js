var apiKey = 71;

var loadToDos = function() {
	$.ajax({
	  type: 'GET',
	  url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=' + apiKey,
	  dataType: 'json',
	  success: function (response, textStatus) {
	    response.tasks.forEach(function (task) {
	    	if (task['completed']) {
	    		var completionStatus = ' completed';
	    	} else {
	    		var completionStatus = ''
	    	}
		    $('#toDoList').append(
			  	'<div class="toDoItem' + completionStatus + '" id="' + task['id'] +'">' +
			  		'<span class="checkCompleteButton"></span>' +
			      '<p>' + task['content'] + '</p>' +
			      '<span class="removeButton">x</span>' +
			    '</div>');
			});
			activeToDoItems();
	  },
	  error: function (request, textStatus, errorMessage) {
	    console.log(errorMessage);
	  }
	});
}

var activeToDoItems = function () {
	var activeToDos = $('.toDoItem').length - $('.toDoItem.completed').length;
  $('#activeToDoCount').first().html('<div>' + activeToDos + ' items left</div>');
}

$(document).ready(function () {
  activeToDoItems();
  loadToDos();

  $('#newTaskForm').on('submit', function(event) {
  	event.preventDefault();
  	var newToDo = $(this).children('[id=newTask]').val();

  	$.ajax({
		  type: 'POST',
		  url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=' + apiKey,
		  contentType: 'application/json',
		  dataType: 'json',
		  data: JSON.stringify({
		    task: {
		      content: newToDo
		    }
		  }),
		  success: function (response, textStatus) {
        $('#toDoList').append(
			  	'<div class="toDoItem" id="' + response.task['id'] + '">' +
			  		'<span class="checkCompleteButton"></span>' +
			      '<p>' + newToDo + '</p>' +
			      '<span class="removeButton">x</span>' +
			    '</div>');
			  $('#newTask').val('');
			  activeToDoItems();
		  },
		  error: function (request, textStatus, errorMessage) {
		    console.log(errorMessage);
		  }
		});
  });

  $(document).on('click', '.checkCompleteButton', function (event) {
  	var taskId = $(this).closest('.toDoItem').attr('id');
  	if ($('#' + taskId).hasClass('completed')) {
  		$.ajax({
			  type: 'PUT',
			  url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + taskId + '/mark_active?api_key=' + apiKey,
			  contentType: 'application/json',
			  dataType: 'json',
			  data: JSON.stringify({
			    task: {
			      completed: false
			    }
			  }),
			  success: function (response, textStatus) {
	        $('#' + taskId).toggleClass('completed');
	    		activeToDoItems();
			  },
			  error: function (request, textStatus, errorMessage) {
			    console.log(errorMessage);
			  }
			});
  	} else {
  		$.ajax({
			  type: 'PUT',
			  url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + taskId + '/mark_complete?api_key=' + apiKey,
			  contentType: 'application/json',
			  dataType: 'json',
			  data: JSON.stringify({
			    task: {
			      completed: true
			    }
			  }),
			  success: function (response, textStatus) {
	        $('#' + taskId).toggleClass('completed');
	    		activeToDoItems();
			  },
			  error: function (request, textStatus, errorMessage) {
			    console.log(errorMessage);
			  }
			});
  	}
  });

  $(document).on('click', '.removeButton', function (event) {
  	var taskId = $(this).closest('.toDoItem').attr('id');
  	$.ajax({
		  type: 'DELETE',
		  url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + taskId + '?api_key=' + apiKey,
		  success: function (response, textStatus) {
        $('#' + taskId).remove();
    		activeToDoItems();
		  },
		  error: function (request, textStatus, errorMessage) {
		    console.log(errorMessage);
		  }
		});
  });
});