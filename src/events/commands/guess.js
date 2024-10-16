const { EmbedBuilder } = require("discord.js")
const { readData, writeData } = require("../../controller/controllerData")
const Profil = require("../../profil")
const { DateTime } = require("luxon")
const { findTodayGuess, calcDiff, isSame, checkHero, calcScore, guessResult, findEmoji } = require("../../controller/controllerGuess")

module.exports = {
  name: "guess",
  description: "Faire ton guess du jour",
  options: [
    {
      name: "joueur",
      description: "Ton guess",
      required: true,
      type: "User"
    }
  ],
  async run (bot, interaction) {

    let playerList = readData("players")
    let player = playerList.find(player => player.id === interaction.member.id)

    if(!player) {
      playerList.push(new Profil(interaction.member))
      writeData("players", playerList)
    }

    let data = readData("shimadas")
    let guess = data.find(user => user.id == interaction.options._hoistedOptions[0].value)

    if(!guess) return interaction.reply({embeds: [new EmbedBuilder()
      .setTitle("Ce joueur n'est pas dans les Shimadas")
      .setColor("Red")
    ],
    fetchReply: true,}).then(sent => {
      setTimeout(() => {
        sent.delete()
      }, 3000);
    })

    let todayGuess = readData("history")[4]
    todayGuess = findTodayGuess(todayGuess.guessId)
    player = playerList.find(player => player.id === interaction.member.id)

    if(player.isDone == true) return interaction.reply({embeds: [new EmbedBuilder()
      .setTitle("Tu as déjà fait ton guess aujourd'hui")
      .setColor("Red")
    ],
    fetchReply: true,}).then(sent => {
      setTimeout(() => {
        sent.delete()
      }, 3000);
    })



    let resultGuess = guessResult(guess, todayGuess)
    let emojiResult = findEmoji(guess)

    player.guess.push({"name": guess.displayName, "result": resultGuess})
    player.resultEmoji.push(emojiResult)

    if(guess.id == todayGuess.id) { //FOUND
      let score = calcScore(player)
      player.score = Math.round(player.score + score)
      player.streak = Math.round(player.streak + 1)
      if(player.bestStreak <= player.streak) {
        player.bestStreak = player.streak
      }
      player.nbGuess = Math.round(player.nbGuess + 1)
      if(player.multiplicator < 3) {
        player.multiplicator += 0.1
      }else if(player.multiplicator > 3) {
        player.multiplicator = 3
      }
      player.isDone = true
      player.result = true
      player.lastPlay = DateTime.now().setZone("Europe/Paris").toLocaleString()


      playerList.forEach(joueur => {
        if(joueur.id == player.id) {
          joueur = player
        }
      });

      writeData("players", playerList)


      let reply = new EmbedBuilder()
        .setTitle(`Bravo ! Tu as trouvé le Shimada en ${player.guess.length} ${player.guess.length == 1 ? "seul essai !!!" : "essais !"}`)
        .setColor("Green")
        .setFooter({text: `${player.guess.length}/5 guess`})
        .setThumbnail(guess.img)

      player.guess.reverse()
      player.resultEmoji.reverse()

      let i = 0
      player.guess.forEach(guess => {
        reply.addFields(
          {name: `__**${guess.name}**__`, value: `<:VOID:1239419351547777095> ${player.resultEmoji[i].replaceAll(",", "ᅟ ᅟ ")}
          <:VOID:1239419351547777095> ${guess.result.replaceAll(" ", "ᅟ ᅟ ")}`}
        ) 
        i ++
      });

      interaction.reply({embeds: [reply], ephemeral: true})

      let msgDescription = `Score: **+ ${score}**\nScore Total: **${player.score}**\n\nStreak: **${player.streak}** 🔥 _(x${player.multiplicator.toFixed(1)})_\nBest Streak: **${player.bestStreak}** 🔥\n\n`
      player.guess.forEach(guess => {
        msgDescription += `${guess.result}\n`
      });

      interaction.channel.send({embeds: [new EmbedBuilder()
        .setTitle(`${player.displayName} a trouvé le Shimada du jour en ${player.guess.length} ${player.guess.length == 1 ? "seul essai !!!" : "essais !"}`)
        .setDescription(msgDescription)
        .setAuthor({name: player.displayName, iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.id}/${interaction.member.user.avatar}.png`})
        .setFooter({text: `${player.guess.length}/5 guess`})
        .setColor("Green")
    ]})

    }else{
      player.result ++

      let resultMsg = `<:VOID:1239419351547777095> ${resultGuess.replaceAll(" ", "ᅟ ᅟ ")}`
      let emojiMsg = `<:VOID:1239419351547777095> ${emojiResult.replaceAll(",", "ᅟ ᅟ ")}`

      let msgDescription = `ᅟGenreᅟJoinedᅟMain <:VOID:1239419351547777095> Ow 1 <:VOID:1239419351547777095> Ow 2ᅟAcademy
      ${emojiMsg}
      ${resultMsg}\n<:VOID:1239419351547777095>`

      if(player.guess.length > 1) {
        msgDescription += `\n\n _Historique:_`
      }

      let reply = new EmbedBuilder()
      .setTitle(`__**${guess.displayName}**__`)
      .setDescription(msgDescription)
      .setFooter({text: `${player.guess.length}/5 guess`})
      .setThumbnail(guess.img)

      if(player.result >= 5) { // A VOIR
        player.isDone = true
        player.result = false
        player.streak = 0
        player.multiplicator = 1
      }

      playerList.forEach(joueur => {
        if(joueur.id == player.id) {
          joueur = player
        }
      });

      writeData("players", playerList)

      if(player.result == false) {
        let statsTodayGuess = findEmoji(todayGuess)
        return interaction.reply({embeds: [new EmbedBuilder()
          .setTitle("Tu n'as pas réussi à trouver le Shimada en 5 essais !")
          .setDescription(`_La réponse était..._\n\n||**__${todayGuess.displayName}__**||\n\nᅟGenreᅟJoinedᅟMain <:VOID:1239419351547777095> Ow 1 <:VOID:1239419351547777095> Ow 2ᅟAcademy\n<:VOID:1239419351547777095> ${statsTodayGuess.replaceAll(",", "ᅟ ᅟ ")}`)
          .setColor("Red")
          .setThumbnail(todayGuess.img)
        ],ephemeral: true})
      }

      player.guess.reverse()
      player.resultEmoji.reverse()

      let i = 0
      player.guess.forEach(guess => {
        if(guess != player.guess[0]) {
          reply.addFields(
            {name: `__**${guess.name}**__`, value: `<:VOID:1239419351547777095> ${player.resultEmoji[i].replaceAll(",", "ᅟ ᅟ ")}
            <:VOID:1239419351547777095> ${guess.result.replaceAll(" ", "ᅟ ᅟ ")}`}
          ) 
        }
        i++
      });
          
      interaction.reply({embeds: [reply], ephemeral: true})
      
    }
  }
}

