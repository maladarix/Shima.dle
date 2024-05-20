const { EmbedBuilder } = require("discord.js")
const { readData, writeData } = require("../../controller/controllerData")
const Shimada = require("../../shimada")

module.exports = {
  name: "add",
  description: "Ajouter un nouveau Shimada à la database",
  options: [
    {
      name: "user",
      description: "Le compte du Shimada",
      required: true,
      type: "User"
    },{
      name: "imgurl",
      description: "L'image du Shimada",
      required: true,
      type: "String"
    },
    {
      name: "sexe",
      description: "Le sexe du Shimada",
      required: true,
      type: "String",
      choices: [
        {
          name: "homme",
          value: "male",
        },
        {
          name: "femme",
          value: "female",
        },
        {
          name: "autre",
          value: "other",
        }
      ]
    },
    {
      name: "main-ow",
      description: "Le main du Shimada",
      required: true,
      type: "String",
    },
    {
      name: "rank-ow1",
      description: "Le rank du Shimada sur Ow1",
      autoComplete: true,
      required: true,
      type: "String",
      choices: [
        {
          name: "Unranked",
          value: "0"
        },
        {
          name: "Bronze",
          value: "1"
        },
        {
          name: "Silver",
          value: "2"
        },
        {
          name: "Gold",
          value: "3"
        },
        {
          name: "Platinum",
          value: "4"
        },
        {
          name: "Diamond",
          value: "5"
        },
        {
          name: "Master",
          value: "6"
        },
        {
          name: "Grand-Master",
          value: "7"
        },
        {
          name: "Top 500",
          value: "8"
        }
      ]
    },
    {
      name: "rank-ow2",
      description: "Le rank du Shimada sur Ow2",
      autoComplete: true,
      required: true,
      type: "String",
      choices: [
        {
          name: "Unranked",
          value: "0"
        },
        {
          name: "Bronze",
          value: "1"
        },
        {
          name: "Silver",
          value: "2"
        },
        {
          name: "Gold",
          value: "3"
        },
        {
          name: "Platinum",
          value: "4"
        },
        {
          name: "Diamond",
          value: "5"
        },
        {
          name: "Master",
          value: "6"
        },
        {
          name: "Grand-Master",
          value: "7"
        },
        {
          name: "Top 500",
          value: "8"
        }
      ]
    },
    {
      name: "academy",
      description: "Rôle dans l'academy",
      required: true,
      type: "Boolean",
    },
    {
      name: "anciennetée",
      description: "Anciennetée dans le MadaMada",
      required: true,
      type: "Integer",
    }
  ],
  async run (bot, interaction) {

    let data = readData("shimadas")
    data.push(new Shimada(interaction.options._hoistedOptions[0], interaction.options._hoistedOptions[1].value, interaction.options._hoistedOptions[2].value, interaction.options._hoistedOptions[3].value,interaction.options._hoistedOptions[4].value,interaction.options._hoistedOptions[5].value,interaction.options._hoistedOptions[6].value,interaction.options._hoistedOptions[7].value))

    writeData("shimadas", data)

    interaction.reply({embeds: [new EmbedBuilder()
      .setTitle(`${interaction.options._hoistedOptions[0].member.nickname ? interaction.options._hoistedOptions[0].member.nickname : interaction.options._hoistedOptions[0].user.globalName } a été ajouté à la dataBase`)
      .setColor("Green")
    ],


    ephemeral: true,})
  }
}