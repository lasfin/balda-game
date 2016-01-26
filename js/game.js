/**
 * @author Eugene Kopitsa
 * @date 08.10.2014
 */

(function(){
	'use strict';

	var DOMNodes = {
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
		inputTwo: document.getElementById('j-input-two'),

		scoreOne: document.getElementById('j-score-one'),
		scoreTwo: document.getElementById('j-score-two'),

		currentWord: document.getElementById('j-current-world')
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
	function activateButton() {
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


	function startGame() {
		DOMNodes.inputField.setAttribute('readonly', 'true');
		DOMNodes.inputField.removeEventListener('keyup', activateButton, false);
		DOMNodes.startButton.setAttribute('disabled', 'true');
		DOMNodes.currentWord.innerHTML = DOMNodes.inputField.value.trim();

		showActions();// show block with inputs
		runTimerOne();
	}


	// show block with inputs and add buttons
	function showActions() {
		document.getElementById('j-actions').style.opacity = 1;
	}


	function addOne() {
		var word = DOMNodes.inputOne.value.trim();

		if(verifyInput(word, DOMNodes.inputField.value.trim())) {

			if (word.length === 0){ // skip turn
				switchButtonsAttrs(DOMNodes.buttonAddOne, DOMNodes.buttonAddTwo, DOMNodes.inputTwo);
				runTimerTwo();
				return;
			}

			if (wordAlreadyUsed(word)) { return; }

			switchButtonsAttrs(DOMNodes.buttonAddOne, DOMNodes.buttonAddTwo, DOMNodes.inputTwo);
			addWordToState(word, DOMNodes.textFieldOne, DOMNodes.inputOne, DOMNodes.progressOne);
			changeScore(DOMNodes.scoreOne, word);
			runTimerTwo();
		}

	}


	function addTwo() {
		var word = DOMNodes.inputTwo.value.trim();

		if(verifyInput(word, DOMNodes.inputField.value.trim())) {

			if (word.length === 0){// skip turn
				switchButtonsAttrs(DOMNodes.buttonAddTwo, DOMNodes.buttonAddOne, DOMNodes.inputOne);
				runTimerOne();
				return;
			}

			if (wordAlreadyUsed(word)) { return; }

			switchButtonsAttrs(DOMNodes.buttonAddTwo, DOMNodes.buttonAddOne, DOMNodes.inputOne);
			addWordToState(word, DOMNodes.textFieldTwo, DOMNodes.inputTwo, DOMNodes.progressTwo);
			changeScore(DOMNodes.scoreTwo, word);
			runTimerOne();
		}

	}


	function addWordToState(word, textFieldToAdd, inputToClear, progressToFill) {
		gameState.secondPlayerWords.push(word);
		textFieldToAdd.innerHTML += ' <span class="b-word">' + word + '</span>';
		inputToClear.value = '';
		progressToFill.style.width = '100%';
	}


	function switchButtonsAttrs(button, newActiveButton, inputToFocus) {
		button.setAttribute('disabled', 'true');
		newActiveButton.removeAttribute('disabled');
		inputToFocus.focus();
	}


	function wordAlreadyUsed(word) {
		return (!(gameState.firstPlayerWords.indexOf(word) === -1 && gameState.secondPlayerWords.indexOf(word) === -1));
	}


	function verifyInput(word, bigWord) {
		word = word.toLowerCase();
		bigWord = bigWord.toLowerCase();

		for (var i = 0; i < word.length; ++i) {
			if(bigWord.indexOf(word[i])!==-1) {
				bigWord = bigWord.removeFrom(bigWord.indexOf(word[i]));
			}
			else{
				return false;
			}
		}
		return true;
	}


	function changeScore(htmlNode, word) {
		var score = parseInt(htmlNode.innerHTML, 10);
		score += word.length;
		htmlNode.innerHTML = score;
	}


	function initTimer(timerNode, time, progressNode) {
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


	function tickTimerOne(time) {
		return function() {
			time -= 1000;

			DOMNodes.progressOne.style.width = time / gameState.RUNNING_TIME * 100 + '%';

			if (time <= 0) {
				runTimerTwo();
				switchButtonsAttrs(DOMNodes.buttonAddOne, DOMNodes.buttonAddTwo, DOMNodes.inputTwo);
			}
			initTimer(DOMNodes.timerOne, time, DOMNodes.progressOne);
		};
	}


	function tickTimerTwo(time) {
		return function() {
			time -= 1000;

			DOMNodes.progressTwo.style.width = time / gameState.RUNNING_TIME * 100 + '%';

			if (time <= 0) {
				runTimerOne();
				switchButtonsAttrs(DOMNodes.buttonAddTwo, DOMNodes.buttonAddOne, DOMNodes.inputOne);
			}
			initTimer(DOMNodes.timerTwo, time, DOMNodes.progressTwo);
		};
	}


	function runTimerOne() {
		var runTimer = tickTimerOne(gameState.RUNNING_TIME);
		runTimer();
		gameState.timerOneID = setInterval(runTimer, 1000);
		clearInterval(gameState.timerTwoID);
	}


	function runTimerTwo() {
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
