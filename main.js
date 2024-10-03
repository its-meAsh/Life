var onColor = "#30D2C5"
var offColor = "#151818"
var simulationRunning = false;
var populationValue = 0;
var generationValue = 0;
var interval;
const generationSpan = document.querySelector("#generationSpan");
const populationSpan = document.querySelector("#populationSpan");

function refreshValueSpans() {
  populationValue = 0
  for (let i = 0; i < l; i++) {
    for (let j = 0; j < h; j++) {
      populationValue += lifeBoard.grid[i][j][0].value
    }
  }
  populationSpan.innerHTML = populationValue;
  generationSpan.innerHTML = generationValue;
}


class Cell {
  constructor(value, coords) {
    this.coords = coords
    this.value = value;
    this.nextGenValue = value;
    this.htmlElem = document.createElement("div");
    this.htmlElem.setAttribute('class', 'cell');
    this.htmlElem.style.background = this.value == 1 ? onColor : offColor;
    this.htmlElem.addEventListener('click', () => {
      if (!simulationRunning) {
        this.value = this.value == 1 ? 0 : 1;
        this.htmlElem.style.background = this.value == 1 ? onColor : offColor;
        this.nextGenValue = this.value
        if (this.value == 1) {
          populationValue++;
        }
        else {
          populationValue--;
        }
        refreshValueSpans()
      }
    })
  }
  toggle() {
    this.nextGenValue = this.value == 0 ? 1 : 0;
  }
  genMove() {
    this.value = this.nextGenValue;
    this.htmlElem.style.background = this.value == 1 ? onColor : offColor;
    if (this.value == 1) {
      populationValue++;
    }
    refreshValueSpans()
  }
}

function replicate(str, num) {
  text = ""
  for (let i = 0; i < num; i++) {
    text += `${str} `
  }
  return text
}


class LifeBoard {
  constructor(l, h) {
    this.grid = []
    this.htmlElem = document.createElement('div');
    this.htmlElem.style.gridTemplateRows = replicate("1fr", l);
    this.htmlElem.style.gridTemplateColumns = replicate("1fr", h)
    this.htmlElem.style.width = `${(5.25*h)}vh`
    for (let i = 0; i < l; i++) {
      this.grid.push([])
      for (let j = 0; j < h; j++) {
        let cell = new Cell(0, [i, j]);
        this.grid[i].push([cell]);
        this.htmlElem.appendChild(cell.htmlElem)
      }
    }
  }
}


var l = 15
var h = 15
var lifeBoard = new LifeBoard(l, h)
const universe = document.querySelector("#universe")


function loadLifeBoard() {
  universe.innerHTML = ""
  universe.appendChild(lifeBoard.htmlElem)
}

loadLifeBoard()

const startStop = document.querySelector("#startStop")
var refreshRate = 1000

startStop.addEventListener('click', () => {
  simulationRunning = !simulationRunning
  if (simulationRunning){
    startStop.innerHTML = "<img src='resources/pause.svg'>"
  }
  else{
    startStop.innerHTML = "<img src='resources/play.svg'>"
  }
  if (!simulationRunning) {
    clearInterval(interval);
  }
  else {
    interval = setInterval(() => {
      progressGeneration()
    }, refreshRate)
  }
})

const nextGeneration = document.querySelector("#nextGeneration")
nextGeneration.addEventListener('click', () => { progressGeneration() })

var underpopulation = 2
var overpopulation = 3
var reproduction = 3
var live = 2

function getAdj(y, x) {
  adj = []
  if (y > 0) {
    adj.push(lifeBoard.grid[y - 1][x][0])
    if (x > 0) {
      adj.push(lifeBoard.grid[y - 1][x - 1][0])
    }
    if (x < h - 1) {
      adj.push(lifeBoard.grid[y - 1][x + 1][0])
    }
  }
  if (y < l - 1) {
    adj.push(lifeBoard.grid[y + 1][x][0])
    if (x > 0) {
      adj.push(lifeBoard.grid[y + 1][x - 1][0])
    }
    if (x < h - 1) {
      adj.push(lifeBoard.grid[y + 1][x + 1][0])
    }
  }
  if (x < h - 1) {
    adj.push(lifeBoard.grid[y][x + 1][0])
  }
  if (x > 0) {
    adj.push(lifeBoard.grid[y][x - 1][0])
  }
  return adj
}

function progressGeneration() {
  generationValue++;
  refreshValueSpans()
  for (let i = 0; i < l; i++) {
    for (let j = 0; j < l; j++) {
      cell = lifeBoard.grid[i][j][0]
      neighbours = 0;
      adj = getAdj(i, j)
      for (let n of adj) {
        if (n.value == 1) {
          neighbours++;
        }
      }
      if (cell.value == 1) {
        if (neighbours < underpopulation || neighbours > overpopulation) {
          console.log(i, j, neighbours)
          cell.toggle()
          populationValue--;
          refreshValueSpans()
        }
      }
      else {
        if (neighbours == reproduction) {
          cell.toggle()
        }
      }
    }
  }

  for (let i = 0; i < l; i++) {
    for (let j = 0; j < l; j++) {
      lifeBoard.grid[i][j][0].genMove()
    }
  }
}


const gridSizeSpan = document.querySelector("#gridSizeSpan")
const underpopulationSpan = document.querySelector("#underpopulationSpan")
const overpopulationSpan = document.querySelector("#overpopulationSpan")
const liveSpan = document.querySelector("#liveSpan")
const reproductionSpan = document.querySelector("#reproductionSpan")
const refreshRateSpan = document.querySelector("#refreshRateSpan")

function refreshOtherSpans() {
  gridSizeSpan.innerHTML = `${l}x${h}`
  overpopulationSpan.innerHTML = overpopulation;
  liveSpan.innerHTML = live;
  underpopulationSpan.innerHTML = underpopulation;
  reproductionSpan.innerHTML = reproduction;
  refreshRateSpan.innerHTML = refreshRate;
}

refreshOtherSpans()
const settings = document.querySelector("#settings");
settings.style.display = "none"
const editButton = document.querySelector("#editButton")
editButton.addEventListener('click',()=>{
  document.querySelector("#universe").style.display = "none";
  simulationRunning = false
  startStop.innerHTML = "<img src='resources/play.svg'>"
  document.querySelector("#box3").style.display = "none"
  document.querySelector("#universeStats").style.display = "none"
  settings.style.display = "flex"
})

const gridHeightInput = document.querySelector("#gridHeightInput")
const gridWidthInput = document.querySelector("#gridWidthInput")
const refreshRateInput = document.querySelector("#refreshRateInput")
const runButton = document.querySelector("#runButton")

runButton.addEventListener('click',()=>{
  if (gridHeightInput == "" || gridWidthInput == "" || refreshRateInput == ""){
    alert("One or more fields are empty");
  }
  else{
    if (gridHeightInput == 0 || gridWidthInput == 0 || refreshRateInput == 0){
      alert("Neither of the inputs can be zero");
    }
    else{
      refreshRate = refreshRateInput.value;
      h = gridHeightInput.value;
      l = gridWidthInput.value;
      refreshOtherSpans()
      settings.style.display = "none";
      document.querySelector("#universe").style.display = "flex";
      document.querySelector("#box3").style.display = "block"
      document.querySelector("#universeStats").style.display = "block";
      lifeBoard = new LifeBoard(l,h)
      loadLifeBoard()
      generationValue = 0;
      populationValue = 0;
      refreshValueSpans()
    }
  }
})