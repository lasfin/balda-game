/**
 * @author Eugene Kopitsa
 * @date 08.10.2014
 */

(function(){
	'use strict';

	var move = {
		inputField: document.getElementById('j-input-word'), // input with main word
		startButton: document.getElementById('j-start'), // start button
		// submit buttons
		buttonAddOne: document.getElementById('j-push-world-one'),
		buttonAddTwo: document.getElementById('j-push-world-two'),
		// progress bars
		progressOne: document.getElementById('j-progressOne'),
		progressTwo: document.getElementById('j-progressTwo'),
		// html nodes with words
	 	textFieldOne: document.getElementById('j-arr-one'),
		textFieldTwo: document.getElementById('j-arr-two'),
		// timer nodes
		timerOne: document.getElementById('j-time-one'),
		timerTwo: document.getElementById('j-time-two'),
		// inputs with text
		inputOne: document.getElementById('j-input-one'),
		inputTwo: document.getElementById('j-input-two')
	};

	// object with game state
	var gameState = {
		MIN_WORLD_WIDTH: 6,
		RUNNING_TIME: 40000,
		timerOneID: 0,
		timerTwoID: 0,
		firstPlayerWords: [],
		secondPlayerWords: []
	};


	DOMNodes.inputField.addEventListener('keyup', activateButton, false);
	DOMNodes.startButton.addEventListener('click', startGame, false);
	DOMNodes.buttonAddOne.addEventListener('click', addOne, false);
	DOMNodes.buttonAddTwo.addEventListener('click', addTwo, false);

	initTimer(DOMNodes.timerOne, gameState.RUNNING_TIME);
	initTimer(DOMNodes.timerTwo, gameState.RUNNING_TIME);


	// activate start game button
	function activateButton(){
		var currentLength = DOMNodes.inputField.value.length;

		// if word length in input more then minimal - make button active
		if (currentLength >= gameState.MIN_WORLD_WIDTH) {
			if( !/^[a-zA-Zа-яА-я]+$/.test(DOMNodes.inputField.value) ) {
				alert('Допустимы только буквы');
				DOMNodes.startButton.setAttribute('disabled', 'true');
				return false;
			}
			else {
				DOMNodes.startButton.removeAttribute('disabled');
			}
		}
		// id word length in input less that minimal - make button disable
		if (currentLength < gameState.MIN_WORLD_WIDTH) {
			DOMNodes.startButton.setAttribute('disabled', 'true');
		}

	}


	function startGame(){
		DOMNodes.inputField.setAttribute('readonly', 'true');
		DOMNodes.inputField.removeEventListener('keyup', activateButton, false);
		DOMNodes.startButton.setAttribute('disabled', 'true');

		var currentWord = document.getElementById('j-current-world');
		currentWord.innerHTML = DOMNodes.inputField.value.trim();

		showActions();// show block with inputs
		runTimerOne();

	}


	// show block with inputs and add buttons
	function showActions() {
		var actionsBlock = document.getElementById('j-actions');
		actionsBlock.style.opacity = 1;
	}


	function addOne(){
		var word = DOMNodes.inputOne.value.trim();

		if(verifyInput(word, DOMNodes.inputField.value.trim())){

			if (word.length === 0){ // skip turn
				DOMNodes.buttonAddTwo.removeAttribute('disabled');
				DOMNodes.buttonAddOne.setAttribute('disabled', 'true');
				DOMNodes.inputTwo.focus();
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
			DOMNodes.buttonAddTwo.removeAttribute('disabled');
			DOMNodes.inputTwo.focus();
			DOMNodes.buttonAddOne.setAttribute('disabled', 'true');
			DOMNodes.textFieldOne.innerHTML += ' <span class="b-word">' + word + '</span>';
			DOMNodes.inputOne.value = '';
			DOMNodes.progressOne.style.width = '100%';

			var scoreNode = document.getElementById('j-score-one');
			changeScore(scoreNode, word);

			runTimerTwo();
		}

	}


	function addTwo(){

		var word = DOMNodes.inputTwo.value.trim();

		if(verifyInput(word, DOMNodes.inputField.value.trim())){

			if (word.length === 0){// skip turn
				DOMNodes.buttonAddOne.removeAttribute('disabled');
				DOMNodes.buttonAddTwo.setAttribute('disabled', 'true');
				DOMNodes.inputOne.focus();
				runTimerOne();
				return;
			}

			// if word was used already - return
			if (!(gameState.firstPlayerWords.indexOf(word) === -1 &&
				gameState.secondPlayerWords.indexOf(word) === -1)){
				return;
			}

			gameState.secondPlayerWords.push(word);
			DOMNodes.buttonAddOne.removeAttribute('disabled');
			DOMNodes.inputOne.focus();
			DOMNodes.buttonAddTwo.setAttribute('disabled', 'true');
			DOMNodes.textFieldTwo.innerHTML += ' <span class="b-word">' + word + '</span>';
			DOMNodes.inputTwo.value = '';
			DOMNodes.progressTwo.style.width = '100%';

			var scoreNode = document.getElementById('j-score-two');
			changeScore(scoreNode, word);

			runTimerOne();
		}

	}


	function verifyInput(word, bigword){
		word = word.toLowerCase();
		bigword = bigword.toLowerCase();

		for (var i = 0; i < word.length; ++i){
			if(bigword.indexOf(word[i])!==-1){
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
		var decrement = function(){
			time -= 1000;

			DOMNodes.progressOne.style.width = time / gameState.RUNNING_TIME * 100 + '%';

			if (time <= 0) {
				runTimerTwo();
				DOMNodes.buttonAddTwo.removeAttribute('disabled');
				DOMNodes.inputTwo.focus();
				DOMNodes.buttonAddOne.setAttribute('disabled', 'true');
			}
			initTimer(DOMNodes.timerOne, time, DOMNodes.progressOne);
		};
		return decrement;
	}


	function tickTimerTwo(time){
		var decrement = function(){
			time -= 1000;

			DOMNodes.progressTwo.style.width = time / gameState.RUNNING_TIME * 100 + '%';

			if (time <= 0) {
				runTimerOne();
				DOMNodes.buttonAddOne.removeAttribute('disabled');
				DOMNodes.inputOne.focus();
				DOMNodes.buttonAddTwo.setAttribute('disabled', 'true');
			}
			initTimer(DOMNodes.timerTwo, time, DOMNodes.progressTwo);
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
