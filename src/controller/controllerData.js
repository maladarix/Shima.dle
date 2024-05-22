const fs = require('fs');
const path = require('path');
const { DateTime } = require("luxon")

function readData(file) {
  return JSON.parse(fs.readFileSync(`${__dirname, "./"}/data/${file}.json`, "utf8"))
}

function writeData(file, data) {
  fs.writeFileSync(`${path.join(__dirname, "../../")}/data/${file}.json`, JSON.stringify(data), "utf8", function(err) {
  if(err) throw err;})
}

function daysBetween(date_1, date_2) {
  let difference = date_1.getTime() - date_2.getTime();
  let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
  return TotalDays;
}

function newDayCheck() {
  let playerList = readData("players")
  playerList.forEach(player => {
    if(daysBetween(new Date(DateTime.now().setZone("Europe/Paris").toLocaleString()), new Date(player.lastPlay)) >= 2) {
      player.streak = 0
      player.multiplicator = 1
    }
    player.result = 0
    player.isDone = false
    player.guess = []
    player.resultEmoji = []
    writeData("players", playerList)
  });
}

function checkResult() {
  let listeJoueurs = readData("players")
  let listeGoodPlayers = ""

  listeJoueurs.forEach(player => {
    if(player.guess.length <= 3) {
      listeGoodPlayers += `${player.displayName}\n`
    }
  });

  return listeGoodPlayers
}

function searchBestStreak() {
  let listeJoueurs = readData("players")
  let bestStreak = listeJoueurs.sort((a, b) => a.streak < b.streak ? 1 : -1)[0].streak
  let listeBestPlayers = []

  listeJoueurs.forEach(joueur => {
    if(joueur.streak == bestStreak) {
      listeBestPlayers.push(joueur)
    }
  });

  return listeBestPlayers[Math.floor(Math.random() * listeBestPlayers.length)]
}

module.exports = {readData, writeData, newDayCheck, checkResult, searchBestStreak}