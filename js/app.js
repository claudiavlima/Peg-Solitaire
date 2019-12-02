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
    if(cell && cell.value) html += 'peg'
    // if cell has value=0 add class "hole"
    else if(cell && cell.value === 0) html += 'hole'
    // otherwise add class hidden
    else html += 'hidden'
    // close html button tag
    html += '"></button>'
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
      for (var i = 0; i < suggestion.length; i++) {
        suggestion[i].className = 'hole'
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
      } else {
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

  var init = function() {    
    var boardElement = document.getElementById('board')//board es el tablero, document es toda la pagina
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
  }

  window.onload = init
  