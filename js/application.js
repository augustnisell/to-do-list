var apiKey = 71;

var loadToDos = function() {
	$.ajax({
	  type: 'GET',
	  url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=' + apiKey,
	  dataType: 'json',
	  success: function (response, textStatus) {
	  	$('#toDoList').html('');
	    response.tasks.forEach(function (task) {
	    	if (task['completed']) {
	    		var completionStatus = ' completed';
	    	} else {
	    		var completionStatus = ' active'
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

var addTask = function (newToDo) {
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
	  	loadToDos();
		  $('#newTask').val('');
		  activeToDoItems();
	  },
	  error: function (request, textStatus, errorMessage) {
	    console.log(errorMessage);
	  }
	});
}

var toggleComplete = function (taskId) {
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
        $('#' + taskId).toggleClass('active');
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
        $('#' + taskId).toggleClass('active');
    		activeToDoItems();
		  },
		  error: function (request, textStatus, errorMessage) {
		    console.log(errorMessage);
		  }
		});
	}
}

var removeTask = function (taskId) {
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
}

$(document).ready(function () {
  activeToDoItems();
  loadToDos();

  $(document).on('submit', '#newTaskForm', function(event) {
  	event.preventDefault();
  	var newToDo = $(this).children('[id=newTask]').val();
  	addTask(newToDo);
  });

  $(document).on('click', '.checkCompleteButton', function (event) {
  	var taskId = $(this).closest('.toDoItem').attr('id');
  	toggleComplete(taskId);
  });

  $(document).on('click', '.removeButton', function (event) {
  	var taskId = $(this).closest('.toDoItem').attr('id');
  	removeTask(taskId);
  });

  $(document).on('click', '#allToDos', function (event) {
  	$('.toDoItem').removeClass('hidden');

  	$('#allToDos').addClass('selected');
  	$('#activeToDos').removeClass('selected');
  	$('#completedToDos').removeClass('selected');
  });

  $(document).on('click', '#activeToDos', function (event) {
  	$('.completed').addClass('hidden');
  	$('.active').removeClass('hidden');

  	$('#allToDos').removeClass('selected');
  	$('#activeToDos').addClass('selected');
  	$('#completedToDos').removeClass('selected');
  });

  $(document).on('click', '#completedToDos', function (event) {
  	$('.active').addClass('hidden');
  	$('.completed').removeClass('hidden');

  	$('#allToDos').removeClass('selected');
  	$('#activeToDos').removeClass('selected');
  	$('#completedToDos').addClass('selected');
  });
});