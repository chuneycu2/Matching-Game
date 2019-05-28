var MatchGame = {}; //creates a game object where each function is an attribute. 

/*
  Sets up a new game after HTML document has loaded.
  Renders a 4x4 board of cards.
*/

$(document).ready(function() { //sets up a jQuery object for the game board and renders card values upon page load, so that the user can click when ready
  var $game = $('#game');
  var values = MatchGame.generateCardValues();
  MatchGame.renderCards(values, $game);
});

/*
  Generates and returns an array of matching card values.
*/

MatchGame.generateCardValues = function () {
  var sequentialValues = []; //creates an empty array for use

  //adds sequential numbers to the array in pairs
  for (var value = 1; value <= 8; value++) {
    sequentialValues.push(value); //value is pushed
    sequentialValues.push(value); //value is pushed again, completing the pair
  }

  var cardValues = []; //creates an empty array for use

  //uses the sequentialValues array to add values at random to the empty cardValues array
  while (sequentialValues.length > 0) {
    var randomIndex = Math.floor(Math.random() * sequentialValues.length); //creates a value at random based on the length of the sequentialValues array, which is modifed below:
    var randomValue = sequentialValues.splice(randomIndex, 1)[0]; //creates a random number from the sequentialValues array while using splice to pull it out of that array, shortening it. Splice() returns an array with one value here, so [0] is added to make sure that randomValue is set to the number in that array, not the array itself
    cardValues.push(randomValue); //the randomValue is pushed to the empty cardValues array
  }

  return cardValues;
};

/*
  Converts card values to jQuery card objects and adds them to the supplied game object.
*/

MatchGame.renderCards = function(cardValues, $game) {
  //creates a n array of color values for the loop below to pull from
  var colors = [
    'hsl(25, 85%, 65%)',
    'hsl(55, 85%, 65%)',
    'hsl(90, 85%, 65%)',
    'hsl(160, 85%, 65%)',
    'hsl(220, 85%, 65%)',
    'hsl(265, 85%, 65%)',
    'hsl(310, 85%, 65%)',
    'hsl(360, 85%, 65%)'];

  $game.empty(); //clears all appended HTML from the game board
  $game.data('flippedCards', []); //adds an attribute to the $game object that holds data about what cards have been flipped over

  for (var valueIndex = 0; valueIndex < cardValues.length; valueIndex++) {
    //the loop first sets attributes for each card in the random array:
    var value = cardValues[valueIndex]; //sets the number value from the value set randomly in the cardValues array
    var color = colors[value - 1]; //sets each card's color using its value to reference the index in the colors array (subtracting 1, since arrays start at 0). This ensures that indentical numbers have identical colors.
    var data = { //creates a data object that is added to the card at the end of the loop. Uses variables above as values in new key-value pairs
      value: value,
      color: color,
      isFlipped: false
    };
    var $cardElement = $('<div class="col-xs-3 card"></div>'); //creates a jQuery card element for each card in the random array
    $cardElement.data(data); //adds data variable's values set in line 59 to the newly created card element
    $game.append($cardElement); //appends the card and all its data to the game, then repeats the loop for the next card until finished with the random array
  }

  //now the loop has created 8 card pairs, this event handler invokes flipCard() by passing it the card that was clicked, #(this).
  $('.card').click(function() {
    MatchGame.flipCard($(this), $('#game'));
  });
};

/*
  Flips over a given card and checks to see if two cards are flipped over.
  Updates styles on flipped cards depending whether they are a match or not.
*/

MatchGame.flipCard = function($card, $game) {
  //a failsafe if statement checks to make sure a card is not already flipped before proceeding. If it is already flipped, the function ends.
  if ($card.data('isFlipped')) {
    return;
  }
  //with the card data provided by renderCards(), the background color, HTML text and isFlipped status are changed upon click
  $card.css('background-color', $card.data('color'))
      .text($card.data('value'))
      .data('isFlipped', true);

  var flippedCards = $game.data('flippedCards');  //this variable creates a jQuery element that allows cards to be pushed to the flippedCards array set in line 54
  flippedCards.push($card); //once the card above is clicked and its values are changed, it is added to the flippedCards array

  //this control flow triggers when there are two cards in the flippedCards array
  if (flippedCards.length === 2) {
    //this if statement checks to see if the numbers on the two cards that are flipped are equal in value.
    if (flippedCards[0].data('value') === flippedCards[1].data('value')) {
      var matchCss = {
        backgroundColor: 'rgb(153, 153, 153)',
        color: 'rgb(204, 204, 204)'
      };
      //If the cards are equal in value, their CSS is changed with the variable set above. The variable is a an object with the CSS attributes set, since the colors for matched cards never changes
      flippedCards[0].css(matchCss);
      flippedCards[1].css(matchCss);
    } else { //if the values are not equal, the cards are removed from the isFlipped array.
      //Two variables are set, one for each flipped card:
      var card1 = flippedCards[0];
      var card2 = flippedCards[1];
      //After a brief timeout, a function triggers that resets the card's background-color, text (to blank) and isFlipped status to false
      window.setTimeout(function() {
        card1.css('background-color', 'rgb(32, 64, 86)')
            .text('')
            .data('isFlipped', false);
        card2.css('background-color', 'rgb(32, 64, 86)')
            .text('')
            .data('isFlipped', false);
      }, 350);
    }
    //before the control flow ends, the re-hidden cards are emptied from the flippedCards array as the data is reset
    $game.data('flippedCards', []);
  }
};
