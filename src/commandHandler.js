function commandHandler(bot, interaction) {
  if(!interaction.isCommand() && !interaction.isButton() && !interaction.isStringSelectMenu() && !interaction.isAutocomplete()) {
    return
  }

  const { commandName } = interaction
  switch (commandName? commandName: interaction.customId.split("/")[0]) {
    case "add":
      bot.commands.get("add").run(bot, interaction)
      break

    case "guess":
      bot.commands.get("guess").run(bot, interaction)
      break
  }
}

module.exports = { commandHandler }