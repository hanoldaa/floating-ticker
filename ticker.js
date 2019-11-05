const {app} = require('electron').remote;
const remote = require('electron').remote;
const $ = require('jQuery');
const fs = require('fs');
const path = require('path');


const appDataPath = app.getPath('appData');
const appName = 'floating-ticker';
const fileName = 'symbols.tick'
const filePath = appDataPath + path.sep + appName + path.sep + fileName;

var symbols = ["AAPL", "MSFT", "ATVI", "EA", "NVDA", "NTDOY"]
var intervals = [];

$('input').keyup(function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        confirm();
    }
});

// Hookup close button
$("#close").click(function(e) {
    var window = remote.getCurrentWindow();
    window.close();
});
// Hookup edit button
$("#edit").click(function(e) {
    edit();
});
// Hookup confirm button
$("#confirm").click(function(e) {
    confirm();
});

function edit() {
    $('input').show();
    $('#confirm').show();
    $('#edit').hide();
}

function confirm() {
    $('input').hide();
    $('#confirm').hide();
    $('#edit').show();
    saveSymbols();
}

function saveSymbols() {
    fs.writeFileSync(filePath, $('input').val());    
    symbols = $('input').val().split(',');
    clearSymbols();
    createSymbols();
}

function tick(symbol) {
    console.log('tick on ' + symbol);
    $.get('https://finance.yahoo.com/quote/'+symbol, function(response) {
        try {
            var price = $(response).find('#quote-header-info span.Fw\\(b\\)')[0].textContent;
            var change = $(response).find('#quote-header-info span.Fw\\(500\\)')[0].textContent.split(' ')[0].replace('+', '▴').replace('-','▾');
            document.getElementById(symbol).innerText = symbol + " " + price + " " + change;
            if(change.includes('▴')){
                $('#'+ symbol).removeClass("down");
                $('#'+ symbol).addClass("up");
            } else {
                $('#'+ symbol).removeClass("up");
                $('#'+ symbol).addClass("down");
            }
        } catch (error) {
            console.log('error on: ' + symbol);
            console.error(error);            
        }
    });
}
loadSymbols();
function loadSymbols() {
    try{
        fs.exists(filePath, function(exists) {
            if(exists){
                readSymbols();
            }
            else {
                createSaveFile();
            }
        });
    } catch(err){
        console.error(err);
    }
}
function readSymbols() {
    var text = fs.readFileSync(filePath, 'utf8'); 
    $('input').val(text);
    symbols = text.split(',');
    clearSymbols();
    createSymbols();
}
function createSaveFile() {
    fs.writeFile(filePath, symbols.join(','), function (err) {
        if (err) throw err;
        console.log('new save file created');
      });
    $('input').val(symbols.join(','));
    clearSymbols();
    createSymbols();
}
function clearSymbols () {
    $('.ticker__item').remove();
    intervals.forEach(x => {
        clearInterval(x);
    })
    intervals = [];
}
function createSymbols() {
    console.log(symbols);
    symbols.forEach(symbol => {
        if(symbol === "")
            return;

        // Create ticker items for each symbol and start auto ticks
        var node = document.createElement("div");
        node.className = "ticker__item";
        node.id = symbol;
        $(".ticker")[0].appendChild(node)
        tick(symbol);
        intervals.push(setInterval(() => { tick(symbol) }, 5000));
    });
}