$(document).ready(function () {
	$('#beginBtn').click(begin);
	$('#lowerButtons').hide();
	$(document).keypress(function (evt) {
		if(evt.key != lastKey && (evt.key == 'a' || evt.key == 'd' || evt.key == 'j')) {
			handleInput(evt.key);
			lastKey = evt.key;
		}
	});
	$(document).keyup(function () {
		lastKey = '';
	});
	$('#Abtn').click(function () {
		handleInput('a');
	});
	$('#Dbtn').click(function () {
		handleInput('d');
	});
	$('#Jbtn').click(function () {
		handleInput('j');
	});
});
var lastKey = '';
function begin () {
	$('#start').hide();
	$('#countdown').show();
	count();
}
function count () {
	var count = 5;
	var counter = window.setInterval(function () {
		if(count > 1) {
			count--;
			$('#timer').text(count);
		}
		else {
			window.clearInterval(counter);
			$('#countdown').hide();
			$('#questions').show();
			
			askQuestion(currentQuestion);
		}
	}, 1000);
}
function isMobile () {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent);
}
var currentQuestion = 0;
var acceptingInput = false;
var perfectTime = -1;
var correctAns = '';
var printer;
//questions are stored globallly from questions.js
function askQuestion() {
	if(printer) {
		window.clearInterval(printer);
	}
	if(currentQuestion < questions.length) {
		$('#qNum').text('Question '+(currentQuestion+1)+'/'+questions.length+': ');
		//tokenize the question
		var tokenized = [];
		var tmp = '';
		var qObj = questions[currentQuestion];
		var q = qObj.question + ' ';
		correctAns = qObj.response;
		for(var i = 0; i < q.length; i++) {
			if(q[i] != ' ') {
				tmp += q[i];
			}
			else {
				tokenized.push(tmp);
				tmp = '';
			}
		}
		var triggerIndex = $.inArray(qObj.trigger, tokenized);
		perfectTime = Date.now()/1000+triggerIndex*0.3;
		var currentWord = 1; //keep track of word printed
		$('#question').text(tokenized[0]+' ');
		acceptingInput = true; //set to allow inputs to be registered
		if(isMobile()) {
			$('#lowerButtons').show();
		}
		printer = window.setInterval(function () {
			if(currentWord < tokenized.length) {
				var originalTxt = $('#question').text();
				$('#question').text(originalTxt+tokenized[currentWord]+' ');
				currentWord++;
			}
			else {
				window.clearInterval(printer);
			}
		}, 300);
	}
	else {
		console.log(score);//game over
		var isRobot = score > 1.2*questions.length ? 'android' : 'human';
		alert(
			'Your score is: '+score.toFixed(2)+'\n'+
			'You are a(n): '+isRobot+'\n'+
			'Get a '+(1.2*questions.length).toFixed(2)+' or lower to qualify as human'
		);
	}
}
var score = 0;
function handleInput(ch) {
	if(acceptingInput) {
		var nowTime = Date.now()/1000;
		var deltaTime = Math.abs(nowTime - perfectTime);
		if(correctAns != ch) {
			score += deltaTime*1.5;
			console.log('added '+deltaTime*1.5);
		}
		else {
			score += deltaTime*0.5;
			console.log('added '+deltaTime*0.5);
		}
		currentQuestion++;
		acceptingInput = false;
		askQuestion();
	}
}
