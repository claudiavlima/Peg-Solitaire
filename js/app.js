var board = [
  [,, {value: 1}, {value: 1}, {value: 1},,],
  [,, {value: 1}, {value: 1}, {value: 1},,],
  [{value: 1}, {value: 1}, {value: 1}, {value: 1}, {value: 1}, {value: 1}, {value: 1}],
  [{value: 1}, {value: 1}, {value: 1}, {value: 0}, {value: 1}, {value: 1}, {value: 1}],
  [{value: 1}, {value: 1}, {value: 1}, {value: 1}, {value: 1}, {value: 1}, {value: 1}],
  [,, {value: 1}, {value: 1}, {value: 1},,],
  [,, {value: 1}, {value: 1}, {value: 1},,],
]

var selectedPeg = { x: undefined, y: undefined }
var suggestions = []

var resetBoard = function() {
  board = [
    [,, {value: 1}, {value: 1}, {value: 1},,],
    [,, {value: 1}, {value: 1}, {value: 1},,],
    [{value: 1}, {value: 1}, {value: 1}, {value: 1}, {value: 1}, {value: 1}, {value: 1}],
    [{value: 1}, {value: 1}, {value: 1}, {value: 0}, {value: 1}, {value: 1}, {value: 1}],
    [{value: 1}, {value: 1}, {value: 1}, {value: 1}, {value: 1}, {value: 1}, {value: 1}],
    [,, {value: 1}, {value: 1}, {value: 1},,],
    [,, {value: 1}, {value: 1}, {value: 1},,],
  ]
  score = 0
  init()
}

var score = 0

var createId = function(rowN, colN) {
  // create id with the row and the col number
  return 'peg-' + rowN + '-' + colN
};

var getPositionFromId = function(id) {
  var idParts = id && id.length ? id.split('-') : []
  if (idParts.length === 3) {
    return {
      x: parseInt(idParts[1]),
      y: parseInt(idParts[2])
    }
  }
  return {}
}

var generateCell = function(cell, rowN, colN) {
  // initial html for button with row and column position for id
  var html = '<button id=' + createId(rowN, colN) + ' class="'
  // if cell has value=1 add class "peg"
  if(cell && cell.value)
    html += 'peg'
  // if cell has value=0 add class "hole"
  else if(cell && cell.value === 0)
    html += 'hole'
  // otherwise add class hidden
  else
    html += 'hidden'
  // close html button tag
  html += '"></button>'//starts at line 48 and ends here ""
  return html
}

var generateRow = function(row, rowN) {
  var html = '<div class="row">'
  for (var j = 0; j < row.length; j++) {
    html += generateCell(row[j], rowN, j)
  }
  html += '</div>'
  return html
}

var generateBoard = function() {
  var html = '<div class="row">'
  for (var i = 0; i < board.length; i++) {
    html += generateRow(board[i], i)
  }
  html += '</div>'
  return html
}

var unselectPeg = function(id) {
  if (selectedPeg.x !== undefined && selectedPeg.y !== undefined) {
    // Generate the id of the previous selected
    var prevSelectedId = createId(selectedPeg.x, selectedPeg.y)
    document.getElementById(prevSelectedId).className = 'peg'
    // Remove the previous suggestions
    var suggestion = document.getElementsByClassName('suggestion')
    var length = suggestion.length
    for (var i = 0; i < length; i++) {
      suggestion[0].className = 'hole'
    }
  }
}

var getElement = function(id) {
  // get element if it exists
  var element = document.getElementById(id)
  return element || {}
}

var showSuggestions = function() {
  var near = {
    above: getElement(createId(selectedPeg.x - 1, selectedPeg.y)),
    left: getElement(createId(selectedPeg.x, selectedPeg.y - 1)),
    right: getElement(createId(selectedPeg.x, selectedPeg.y + 1)),
    below: getElement(createId(selectedPeg.x + 1, selectedPeg.y))
  }
  var possible = {
    above: getElement(createId(selectedPeg.x - 2, selectedPeg.y)),
    left: getElement(createId(selectedPeg.x, selectedPeg.y - 2)),
    right: getElement(createId(selectedPeg.x, selectedPeg.y + 2)),
    below: getElement(createId(selectedPeg.x + 2, selectedPeg.y))
  }
  Object.keys(near).forEach(function(side){
    // check if the positions next to it are selected
    // and check if possible positions are not selected
    if (near[side].className === 'peg' && possible[side].className === 'hole') {
      // show the possible position
      possible[side].className = 'suggestion'
      suggestions.push(possible[side].id)
    }
  })
}

var selectPeg = function(evt) {
  // Get selected html element from event
  var peg = evt.target
  // Parse row and column from element id
  var position = getPositionFromId(peg.id)
  if (position.x !== undefined && position.y !== undefined) {
    unselectPeg();
    if (selectedPeg.x === position.x && selectedPeg.y === position.y) {
      selectedPeg.x = undefined
      selectedPeg.y = undefined
    }
    else {
      selectedPeg.x = position.x
      selectedPeg.y = position.y
      peg.className = 'selected'
      showSuggestions()
    }
  }
}

var addPegsEventHandlers = function(pegs) {
  for (var i = 0; i < pegs.length; i++) {
    pegs[i].onclick = selectPeg
  }
}

var movePeg = function(evt) {
  var holeId = evt.target.id
  var pos = getPositionFromId(holeId)
  //if selected hole is in sugestions list, move selected peg
  if (pos.x !== undefined && pos.y !== undefined && suggestions.includes(holeId)) {
    var idParts = holeId && holeId.length ? holeId.split('-') : []
    if (idParts.length === 3) {
      var oldRow = selectedPeg.x
      var oldCol = selectedPeg.y
      var newRow = parseInt(idParts[1])
      var newCol = parseInt(idParts[2])
      var midRow = oldRow + ((newRow - oldRow) / 2)
      var midCol = oldCol + ((newCol - oldCol) / 2)
      board[oldRow][oldCol] = board[midRow][midCol] = {value: 0}
      board[newRow][newCol] = {value: 1}
      // cleanup selected peg
      selectedPeg = { x: undefined, y: undefined }
      score += 10
      init()
    }
  }
}

var addHolesEventHandlers = function(holes) {
  for (var i = 0; i < holes.length; i++) {
    holes[i].onclick = movePeg
  }
}

var saveBoard = function() {
  localStorage.setItem('pegBoard',JSON.stringify(board))//el tablero es un array, se convierte en string y luego se guarda en localstorage del navegador
  localStorage.setItem('pegScore', score)
}

var loadBoard = function() {
  board = JSON.parse(localStorage.getItem('pegBoard'))
  score = parseInt(localStorage.getItem('pegScore'))
  init()
}

var gameOver = function(over) {
  document.getElementById('overlay').className = 'overlay-active flex-col'
  document.getElementById('save-score').className = 'pop-up-active'
  document.getElementById('total-score').textContent = over + ' Your total is: ' + score + '.'
}

var endGame = function() {
  var pegs = document.getElementsByClassName('peg')//esta en la linea 50 //obtengo todos los pges
  var peg    
  if (pegs.length === 1) { //si hay uno solo
    peg = getPositionFromId(pegs[0].id)//obtengo su id, ahora se su posicion
    if (peg.x === 3 && peg.y === 3)
    {
      gameOver('You won!')
    }
    else {
      gameOver('No more moves. Try again.')
    }
  }
  else {
    var b = true     
    for (var i = 0; i < pegs.length; i++) {
      peg = getPositionFromId(pegs[i].id)//obtengo su id, ahora se su posicion
      if(countSuggestions(peg)>0) {
        b = false
      }
    }
    if(b === true){
      gameOver('No more moves. Try again.')
      resetBoard//con parentesis ejecuta la funcion y devuleve resultado o vuelve aca, sin () termina y sigue con el resetboard sin volver aca
    }
  }
}

var countSuggestions =  function(peg) {
  var pegSuggestions = 0
  var near = {
    above: getElement(createId(peg.x - 1, peg.y)),
    left: getElement(createId(peg.x, peg.y - 1)),
    right: getElement(createId(peg.x, peg.y + 1)),
    below: getElement(createId(peg.x + 1, peg.y))
  }
  var possible = {
    above: getElement(createId(peg.x - 2, peg.y)),
    left: getElement(createId(peg.x, peg.y - 2)),
    right: getElement(createId(peg.x, peg.y + 2)),
    below: getElement(createId(peg.x + 2, peg.y))
  }
  Object.keys(near).forEach(function(side){
    // check if the positions next to it are selected
    // and check if possible positions are not selected
    if (near[side].className === 'peg' && possible[side].className === 'hole') {
      pegSuggestions++
    }
  })
  return pegSuggestions
}

var quitNewScore = function() {
  document.getElementById('overlay').className = 'overlay-inactive flex-col'
  document.getElementById('save-score').className = 'pop-up-inactive'
}

var getTodayDate = function() {
  var date = new Date()
  return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
}

var compareDate =  function(a,b) {
  var x = createDate(a)
  var y = createDate(b)
  var year = compareNumbers(x.y, y.y)
  if(year != 0) {
    return year
  }
  else {
    var month = compareNumbers(x.m, y.m)
    if (month != 0) {
      return month
    }
    else {
      return compareNumbers(x.d, y.d)
    }
  }
}

var compareNumbers = function(x,y) {
  if (x > y) {
    return -1
  }
  else if (x < y) {
    return 1
  }
  else {
    return 0
  }
}

var createDate = function(day) {
  var dayParts = day && day.length ? day.split('-') : []
  if (dayParts.length === 3) {
    return {
      d: parseInt(dayParts[0]),
      m: parseInt(dayParts[1]),
      y: parseInt(dayParts[2]),
    }
  }
  return {}
}

var saveNewScore = function() {
  document.getElementById('name-label').hidden = true
  var name = document.getElementById('player-name').value
  if (name.length < 3) {
    document.getElementById('name-label').hidden = false
    return {}
  }
  var ranking
  if (!localStorage.getItem('Rank')) {
    ranking = []
  }
  else {
    ranking = JSON.parse(localStorage.getItem('Rank'))
  }
  var saveScore = {
    date: getTodayDate(),
    name: name,
    score: score
  }
  ranking.push(saveScore)
  ranking.sort(function(a, b){
    if (a.score > b.score) {
      return -1
    }
    else if (a.score < b.score) {
      return 1
    }
    else {
      return compareDate(a, b)
    }
  })
  if (ranking.length > 5) {
    ranking.length = 5
  }
  localStorage.setItem('Rank', JSON.stringify(ranking))
  document.getElementById('overlay').className = 'overlay-inactive flex-col'
  document.getElementById('save-score').className = 'pop-up-inactive'
}

var closeRanking = function() {
  document.getElementById('overlay').className = 'overlay-inactive flex-col'
  document.getElementById('best-players').className = 'pop-up-inactive'
}

var showRanking = function(){
  document.getElementById('overlay').className = 'overlay-active flex-col'
  document.getElementById('best-players').className = 'pop-up-active'
  var highscores = document.getElementById('scoresTable')
  var ranking
  if (!localStorage.getItem('Rank')) {
    ranking = []
  }
  else {
    ranking = JSON.parse(localStorage.getItem('Rank'))
  }
  var html = '<table>'
  html += '<tr><th>Date</th><th>Name</th><th>Score</th></tr>'
  for (let i = 0; i < ranking.length; i++) {
    html += '<tr><td>' + ranking[i].date + '</td><td>' + ranking[i].name + '</td><td>' + ranking[i].score + '</td></tr>'
  }
  html += '</table>'
  highscores.innerHTML = html
}

var init = function() {
  var boardElement = document.getElementById('board')//document is the whole page
  boardElement.innerHTML = generateBoard()
  var totalScore = document.getElementById('your-score')
  totalScore.textContent = 'Your total score is: ' + score
  var pegs = boardElement.getElementsByClassName('peg')
  addPegsEventHandlers(pegs)
  var holes = boardElement.getElementsByClassName('hole')
  addHolesEventHandlers(holes)
  var newGame = document.getElementById('new-game')
  newGame.onclick = resetBoard
  var saveGame = document.getElementById('save-game')
  saveGame.onclick = saveBoard
  var loadGame = document.getElementById('load-game')
  loadGame.onclick = loadBoard
  var topPlayers = document.getElementById('top-players')
  topPlayers.onclick = showRanking
  var saveScore = document.getElementById('save-score')
  saveScore.onclick = saveNewScore
  var quit = document.getElementById('quit-score')
  quit.onclick = quitNewScore
  var cancelScore = document.getElementById('close-score')
  cancelScore.onclick = closeRanking
  endGame()
}

window.onload = init