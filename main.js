$(document).ready(function () {
	$('#beginBtn').click(begin);
});
function begin () {
	$('#start').hide();
	$('#countdown').show();
	count();
}
function count () {
	var count = 5;
	var counter = window.setInterval(function () {
		if(count > 0) {
			count--;
			$('#timer').text(count);
		}
		else {
			window.clearInterval(counter);
			$('#countdown').hide();
			$('#questions').show();
			askQuestions();
		}
	}, 1000);
}
var currentQuestion = 0;
function askQuestions() {

}