const { readData } = require("./controllerData")

function findTodayGuess(id) {
  let data = readData("shimadas")
  return data.find(user => user.id == id)
}

function isSame(guess, todayGuess, param) {
  if(guess[param] == todayGuess[param]) {
    return "🟩"
  }else{
    return "🟥"
  }
}

function checkHero(guess, todayGuess) {
  let heroes = readData("heros")
  let todayHeroes = heroes.find(hero => hero.hero == todayGuess["main"])
  let guessHeroes = heroes.find(hero => hero.hero == guess["main"])
  if(guess["main"] == todayGuess["main"]) {
    return "🟩"
  }else if(guessHeroes.role == todayHeroes.role) {
    return "🟧"
  }else{
    return "🟥"
  }
  
}

function calcDiff(guess, todayGuess, param) {
  if(parseInt(guess[param]) > parseInt(todayGuess[param])) {
    return "⬇️"
  }else if(parseInt(guess[param]) < parseInt(todayGuess[param])) {
    return "⬆️"
  }else{
    return "🟩"
  }
}

function guessResult(guess, todayGuess) {
  return `${isSame(guess, todayGuess, "sexe")} ${calcDiff(guess, todayGuess, "anciennetee")} ${checkHero(guess, todayGuess)} ${calcDiff(guess, todayGuess, "sr1")} ${calcDiff(guess, todayGuess, "sr2")} ${isSame(guess, todayGuess, "academy")}`
}

function findEmoji(guess) {
  let listeEmoji = []

  if(guess.sexe == "male") {
    listeEmoji.push("<:ma:1239466800735981569>")
  }else{
    listeEmoji.push("<:fe:1239466802443059220>")
  }

  switch (guess.anciennetee) {
    case 2017:
      listeEmoji.push("<:2017:1239450489800753203>")
      break;
  
    case 2018:
      listeEmoji.push("<:2018:1239450491008716840>")
      break

    case 2019:
      listeEmoji.push("<:2019:1239450492392833024>")
      break

    case 2020:
      listeEmoji.push("<:2020:1239450493500264448>")
      break

    case 2021:
      listeEmoji.push("<:2021:1239450484687765554>")
      break

    case 2022:
      listeEmoji.push("<:2022:1239450485941866526>")
      break

    case 2023:
      listeEmoji.push("<:2023:1239450487342759947>")
      break

    case 2024:
      listeEmoji.push("<:2024:1239450488701849671>")
      break
  }

  listeEmoji.push(readData("heros").find(hero => hero.hero == guess.main).emoji)

  switch (guess.sr1) {
    case "0":
      listeEmoji.push("❔")
      break;
  
    case "1":
      listeEmoji.push("<:bronze:1239414858277982231>")
      break

    case "2":
      listeEmoji.push("<:silver:1239414857015627858>")
      break

    case "3":
      listeEmoji.push("<:gold:1239414855405015051>")
      break
    
    case "4":
      listeEmoji.push("<:plat:1239414854746636341>")
      break

    case "5":
      listeEmoji.push("<:diamond:1239414849537314857>")
      break

    case "6":
      listeEmoji.push("<:master:1239414848132091934>")
      break

    case "7":
      listeEmoji.push("<:gm:1239414850527035393>")
      break

    case "8":
      listeEmoji.push("<:t500:1239414853400133653>")
      break
  }

  switch (guess.sr2) {
    case "0":
      listeEmoji.push("❔")
      break;
  
    case "1":
      listeEmoji.push("<:bronze:1239414858277982231>")
      break

    case "2":
      listeEmoji.push("<:silver:1239414857015627858>")
      break

    case "3":
      listeEmoji.push("<:gold:1239414855405015051>")
      break
    
    case "4":
      listeEmoji.push("<:plat:1239414854746636341>")
      break

    case "5":
      listeEmoji.push("<:diamond:1239414849537314857>")
      break

    case "6":
      listeEmoji.push("<:master:1239414848132091934>")
      break

    case "7":
      listeEmoji.push("<:gm:1239414850527035393>")
      break

    case "8":
      listeEmoji.push("<:t500:1239414853400133653>")
      break
  }

  if(guess.academy == true) {
    listeEmoji.push("<:check:1239467566066307114>")
  }else{
    listeEmoji.push("❌")
  }

  return listeEmoji.toString()
}


function calcScore(player) {
  let score = 0
  switch (player.result) {
    case 0:
      score = 10
      break;
    case 1:
      score = 8
      break
    case 2:
      score = 5
      break
    case 3:
      score = 3
      break
    case 4:
      score = 1
      break
  }

  return Math.round(score * player.multiplicator)
}

module.exports = { findTodayGuess, calcDiff, isSame, checkHero, calcScore, guessResult, findEmoji }