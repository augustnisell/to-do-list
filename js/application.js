var activeToDoItems = function () {
	var activeToDos = $('.toDoItem').length - $('.toDoItem.completed').length;
  $('#activeToDoCount').first().html('<div>' + activeToDos + ' items left</div>');
}

$(document).ready(function () {
  activeToDoItems();

  $('#newTaskForm').on('submit', function(event) {
  	event.preventDefault();
  	var newToDo = $(this).children('[id=newTask]').val();
	  $('#toDoList').append(
	  	'<div class="toDoItem">' +
	  		'<span class="checkCompleteButton"></span>' +
	      '<p>' + newToDo + '</p>' +
	      '<span class="removeButton">x</span>' +
	    '</div>');
	  $(this).children('[id=newTask]').val('');
	  activeToDoItems();
  });

  $(document).on('click', '.checkCompleteButton', function (event) {
    $(this).closest('div').toggleClass('completed');
    activeToDoItems();
  });

  $(document).on('click', '.removeButton', function (event) {
    $(this).closest('div').remove();
    activeToDoItems();
  });
});