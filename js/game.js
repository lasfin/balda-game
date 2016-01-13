/**
 * @author Eugene Kopitsa
 * @date 08.10.2014
 */

(function(){
	'use strict';

	var inputField = document.getElementById('j-input-word'), // input with main word
		startButton = document.getElementById('j-start'); // start button

	// submit buttons
	var buttonAddOne = document.getElementById('j-push-world-one'),
		buttonAddTwo = document.getElementById('j-push-world-two');

	// progress bars
	var progressOne = document.getElementById('progressOne'),
		progressTwo = document.getElementById('progressTwo');

	// html nodes with words
	var textFieldOne = document.getElementById('j-arr-one'),
		textFieldTwo = document.getElementById('j-arr-two');

	// timer nodes
	var timerOne = document.getElementById('j-time-one'),
		timerTwo = document.getElementById('j-time-two');

	// object with game state
	var gameState = {
		MIN_WORLD_WIDTH: 6,
		RUNNING_TIME: 30000,
		timerOneID: 0,
		timerTwoID: 0,
		firstPlayerWords: [],
		secondPlayerWords: []
	};


	inputField.addEventListener('keyup', activateButton, false);
	startButton.addEventListener('click', startGame, false);

	buttonAddOne.addEventListener('click', addOne, false);
	buttonAddTwo.addEventListener('click', addTwo, false);

	initTimer(timerOne, gameState.RUNNING_TIME);
	initTimer(timerTwo, gameState.RUNNING_TIME);


	// activate start game button
	function activateButton(){
		var currentLength = inputField.value.length;

		// if word length in input more then minimal - make button active
		if (currentLength >= gameState.MIN_WORLD_WIDTH) {
			if( !/^[a-zA-Zа-яА-я]+$/.test(inputField.value) ) {
				alert('Допустимы только буквы');
				startButton.setAttribute('disabled', 'true');
				return false;
			}
			else {
				startButton.removeAttribute('disabled');
			}
		}
		// id word length in input less that minimal - make button disable
		if (currentLength < gameState.MIN_WORLD_WIDTH) {
			startButton.setAttribute('disabled', 'true');
		}

	}


	function startGame(){
		inputField.setAttribute('readonly', 'true');
		inputField.removeEventListener('keyup', activateButton, false);
		startButton.setAttribute('disabled', 'true');

		var currentWord = document.getElementById('j-current-world');
		currentWord.innerHTML = inputField.value.trim();

		showActions();// show block with inputs
		runTimerOne();

	}


	// show block with inputs and add buttons
	function showActions() {
		var actionsBlock = document.getElementById('j-actions');
		actionsBlock.style.opacity = 1;
	}


	function addOne(){
		var word = document.getElementById('j-input-one').value.trim();

		if(verifyInput(word, inputField.value.trim())){

			if (word.length === 0){ // skip turn
				buttonAddTwo.removeAttribute('disabled');
				buttonAddOne.setAttribute('disabled', 'true');
				document.getElementById('j-input-two').focus();
				runTimerTwo();
				return;
			}

			// if word was used already - return
			if (!(gameState.firstPlayerWords.indexOf(word) === -1 &&
				gameState.secondPlayerWords.indexOf(word) === -1))
			{
				return;
			}

			gameState.firstPlayerWords.push(word);
			buttonAddTwo.removeAttribute('disabled');
			document.getElementById('j-input-two').focus();
			buttonAddOne.setAttribute('disabled', 'true');
			textFieldOne.innerHTML += ' <span class="b-word">' + word + '</span>';

			document.getElementById('j-input-one').value = '';
			progressOne.style.width = '100%';

			var scoreNode = document.getElementById('j-score-one');
			changeScore(scoreNode, word);

			runTimerTwo();
		}

	}


	function addTwo(){

		var word = document.getElementById('j-input-two').value.trim();

		if(verifyInput(word, inputField.value.trim())){

			if (word.length === 0){// skip turn
				buttonAddOne.removeAttribute('disabled');
				buttonAddTwo.setAttribute('disabled', 'true');
				document.getElementById('j-input-one').focus();
				runTimerOne();
				return;
			}

			// if word was used already - return
			if (!(gameState.firstPlayerWords.indexOf(word) === -1 &&
				gameState.secondPlayerWords.indexOf(word) === -1)){
				return;
			}

			gameState.secondPlayerWords.push(word);
			buttonAddOne.removeAttribute('disabled');
			document.getElementById('j-input-one').focus();
			buttonAddTwo.setAttribute('disabled', 'true');
			textFieldTwo.innerHTML += ' <span class="b-word">' + word + '</span>';

			document.getElementById('j-input-two').value = '';
			progressTwo.style.width = '100%';

			var scoreNode = document.getElementById('j-score-two');
			changeScore(scoreNode, word);

			runTimerOne();
		}

	}


	function verifyInput(word, bigword){
		console.log('verify');
		word = word.toLowerCase();
		bigword = bigword.toLowerCase();

		for (var i = 0; i < word.length; ++i){
			if(bigword.indexOf(word[i])!==-1){
				console.log('word[i]: ', word[i], 'bigword: ', bigword);
				bigword = bigword.removeFrom(bigword.indexOf(word[i]));
			}
			else{
				return false;
			}
		}
		return true;
	}


	function changeScore(htmlNode, word){
		var score = parseInt(htmlNode.innerHTML);
		score += word.length;
		htmlNode.innerHTML = score;
	}


	function initTimer(timerNode, time, progressNode){
		if (!time){ //set default time
			console.log('дотикал!');
			time = gameState.RUNNING_TIME;
			progressNode.style.width = '100%';
		}
		time = new Date(time).getTime() / 1000;
		var minutes = Math.floor(time / 60);
		var seconds = time - minutes * 60;
		if (seconds < 10 && seconds > 0) {
			seconds = '0' + seconds;
		}
		else if (seconds === 0){
			seconds = '00';
		}

		timerNode.innerHTML = minutes + ':' + seconds;
	}


	function tickTimerOne(time){
		console.log('tick');
		var decrement = function(){
			time -= 1000;

			console.log((time / gameState.RUNNING_TIME) * 100);
			progressOne.style.width = time / gameState.RUNNING_TIME * 100 + '%';

			if (time <= 0) {
				runTimerTwo();
				buttonAddTwo.removeAttribute('disabled');
				document.getElementById('j-input-two').focus();
				buttonAddOne.setAttribute('disabled', 'true');
			}
			initTimer(timerOne, time, progressOne);
		};
		return decrement;
	}


	function tickTimerTwo(time){
		console.log('tick2');
		var decrement = function(){
			time -= 1000;

			console.log((time / gameState.RUNNING_TIME) * 100);
			progressTwo.style.width = time / gameState.RUNNING_TIME * 100 + '%';

			if (time <= 0) {
				runTimerOne();
				buttonAddOne.removeAttribute('disabled');
				document.getElementById('j-input-one').focus();
				buttonAddTwo.setAttribute('disabled', 'true');
			}
			initTimer(timerTwo, time, progressTwo);
		};
		return decrement;
	}


	function runTimerOne(){
		var runTimer = tickTimerOne(gameState.RUNNING_TIME);
		runTimer();
		gameState.timerOneID = setInterval(runTimer, 1000);
		clearInterval(gameState.timerTwoID);
	}


	function runTimerTwo(){
		var runTimer = tickTimerTwo(gameState.RUNNING_TIME);
		runTimer();
		gameState.timerTwoID = setInterval(runTimer, 1000);
		clearInterval(gameState.timerOneID);
	}


	/**
	 *
	 * @param index - element to remove from string
	 * @returns {string} new string
     */
	String.prototype.removeFrom = function (index) {
		return this.substr(0, index) + this.substr(index + 1, this.length);
	};

}());



// TODO:
// select game type: with/without timer
