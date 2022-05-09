require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 5000;

const fs = require('fs');
const { prefix } = require('./config.json');
const Discord = require('discord.js');

const createSalesBot = require('./cronjobs/sales')
const createListingsBot = require('./cronjobs/listing')

const createTokenCommands = require('./commands/token')

const projectConfigs = [
  { id: process.env.FIM_ID, slug: process.env.COLLECTION_SLUG_FIM, },
  { id: process.env.IOUS_ID, slug: process.env.COLLECTION_SLUG_IOUS },
  { id: process.env.CGK_ID, slug: process.env.COLLECTION_SLUG_CGK, },
  { id: process.env.ISID_ID, slug: process.env.COLLECTION_SLUG_ISID, },
  { id: process.env.COSJ_ID, slug: process.env.COLLECTION_SLUG_COSJ, },
  { id: process.env.NF_ID, slug: process.env.COLLECTION_SLUG_NF, },
  { id: process.env.NVC_ID, slug: process.env.COLLECTION_SLUG_NVC, },
  { id: process.env.UFIM_ID, slug: process.env.COLLECTION_SLUG_UFIM, },
];

// const tokenCommandsConfig = [
//   { tokenCommand: process.env.DISCORD_TOKEN_COMMAND_IOU, contractAddress: process.env.CONTRACT_ADDRESS_IOUS },
//   { tokenCommand: process.env.DISCORD_TOKEN_COMMAND_NF, contractAddress: process.env.CONTRACT_ADDRESS_NF },
//   { tokenCommand: process.env.DISCORD_TOKEN_COMMAND_COSJ, contractAddress: process.env.CONTRACT_ADDRESS_COSJ },
//   { tokenCommand: process.env.DISCORD_TOKEN_COMMAND_NVC, contractAddress: process.env.CONTRACT_ADDRESS_NVC },
//   { tokenCommand: process.env.DISCORD_TOKEN_COMMAND_ISID, contractAddress: process.env.CONTRACT_ADDRESS_AB },
//   { tokenCommand: process.env.DISCORD_TOKEN_COMMAND_CGK, contractAddress: process.env.CONTRACT_ADDRESS_AB },
//   { tokenCommand: process.env.DISCORD_TOKEN_COMMAND_FIM, contractAddress: process.env.CONTRACT_ADDRESS_AB },
//   { tokenCommand: process.env.DISCORD_TOKEN_COMMAND_UFIM, contractAddress: process.env.CONTRACT_ADDRESS_UFIM },
// ];

const client = new Discord.Client();
client.commands = new Discord.Collection();
// client.salesJobs = projectConfigs.map(config => createSalesBot(config.id, config.slug))

// const tokenCommands = tokenCommandsConfig.map(config => createTokenCommands(config.tokenCommand, config.contractAddress))
// for (const command of tokenCommands) {
//   client.commands.set(command.name, command);
// }


const salesJobs = projectConfigs.map(config => createSalesBot(config.id, config.slug))
const listingsJobs = projectConfigs.map(config => createListingsBot(config.id, config.slug))
client.jobs = salesJobs.concat(listingsJobs)

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${ file }`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

// const cronFiles = fs.readdirSync('./cronjobs').filter(file => file.endsWith('.js'));
// for (const file of cronFiles) {
//   const job = require(`./cronjobs/${file}`);
//   // set a new item in the Collection
//   // with the key as the job name and the value as the exported module
//   if (job.enabled) {
//     console.log(`enabling ${job.description}`)
//     client.cronjobs.set(job.name, job);
//   }
// }



// client.on('ready', () => {
//   console.log(`Logged in as ${ client.user.tag }!`);
//   client.jobs.forEach(job => {
//     setInterval(() => job.execute(client), job.interval);
//   });



client.on('ready', () => {
  console.log(`Logged in as ${ client.user.tag }`);
  client.jobs.forEach((job, i) => {
    setTimeout(() => {
      setInterval(() => job.execute(client), job.interval)
    }, i * 6000
    )
  })
})


client.on('message', msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  const args = msg.content.slice(prefix.length).trim().split(' ');
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  try {
    command.execute(msg, args);
  } catch (error) {
    console.error(error);
    msg.reply('there was an error trying to execute that command!');
  }
})

client.login(process.env.DISCORD_BOT_TOKEN);

app.get('/', (req, res) => {
  res.send('The bot is running')
})

app.listen(port, () => {
  console.log(`Discord Bot app listening at http://localhost:${ port }`)
})