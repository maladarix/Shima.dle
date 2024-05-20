const Discord = require("discord.js")
const bot = new Discord.Client({intents: 3276799})
const loadCommands = require('./src/loaders/loadCommands')
const loadSlashCommands = require('./src/loaders/loadSlashCommands')
const autocomplete = require('./src/commandHandler')

const { DateTime } = require("luxon")
const { readData, writeData, newDayCheck, checkResult, searchBestStreak } = require("./src/controller/controllerData")
const { findTodayGuess } = require("./src/controller/controllerGuess")
require("dotenv").config()

bot.commands = new Discord.Collection()

loadCommands(bot)

setInterval(() => {
  let date = DateTime.now().setZone("Europe/Paris").toLocaleString()
  let history = readData("history")

  if(history[4].date != date) {
    
    let goodPlayers = checkResult()
    let bestStreakPlayer = searchBestStreak()
    let todayGuess = findTodayGuess(readData("history")[4].guessId)
    bot.channels.cache.get(process.env.channelId).send({embeds: [new Discord.EmbedBuilder()
      .setTitle(`Le Shimada du jour était: **${todayGuess.displayName}**`)
      .setDescription(`Bravo à ceux qui ont trouvé en 3 coups et moins:\n${goodPlayers}\n\n**${bestStreakPlayer.displayName}** est en streak de **${bestStreakPlayer.streak}** 🔥`)
      .setFooter({text: "Le Shimada du jour a été réinitialisé"})
      .setThumbnail(todayGuess.img)
      .setColor("Gold")
    ]})

    newDayCheck()

    let shimadas = readData("shimadas")
    let guessId = null

    do {
      guessId = shimadas[Math.floor(Math.random() * shimadas.length)].id
    } while (history.find(day => day.guessId === guessId));

    history.shift()
    history.push({"date": date, "guessId": guessId})

    writeData("history", history)
  }
}, 1000);
a
setInterval(() => {
  let topic = "Classement:\n"
  let listeJoueurs = readData("players")
  let number = listeJoueurs.length > 10 ? 10 : listeJoueurs.length

  listeJoueurs.sort((a, b) => a.score < b.score ? 1 : -1).slice(0, 10)

  for (let i = 0; i < number; i++) {
    topic += `${listeJoueurs[i].displayName} : ${listeJoueurs[i].score} (**${listeJoueurs[i].streak}** 🔥)<:VOID:1239419351547777095>\n`
  }

  bot.channels.cache.get(process.env.channelId).setTopic(topic)
}, 300000);


bot.on("ready", async () =>{
  console.log("Bot Online")
  console.log(new Date().toLocaleString())
  await loadSlashCommands(bot)
})

bot.on("interactionCreate", async (interaction) => {
  autocomplete.commandHandler(bot, interaction)
})

bot.login(process.env.BOT_TOKEN)