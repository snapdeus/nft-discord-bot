
require('dotenv').config()
const fetch = require('node-fetch');
const { openseaAssetUrl } = require('../config.json');

const Discord = require('discord.js');

// module.exports = function createTokenCommands(tokenCommand, contractAddress) {
//   return {
//     name: tokenCommand || "token",
//     execute(message, args) {
//       if (!args.length) {
//         return message.channel.send(`You didn't provide a token id, ${ message.author }!`);
//       }

//       if (isNaN(parseInt(args[0]))) {
//         return message.channel.send(`Token id must be a number!`);
//       }

//       if (tokenCommand === 'showmecgk') {
//         args[0] = '44000' + args[0]
//       };


//       let url = `${ openseaAssetUrl }/${ contractAddress }/${ args[0] }`;
//       let settings = {
//         method: "GET",
//         headers: process.env.OPEN_SEA_API_KEY == null ? {} : {
//           "X-API-KEY": process.env.OPEN_SEA_API_KEY
//         }
//       };

//       fetch(url, settings)
//         .then(res => {
//           if (res.status == 404 || res.status == 400) {
//             throw new Error("Token id doesn't exist.");
//           }
//           if (res.status != 200) {
//             throw new Error(`Couldn't retrieve metadata: ${ res.statusText }`);
//           }
//           return res.json();
//         })
//         .then((metadata) => {
//           const embedMsg = new Discord.MessageEmbed()
//             .setColor('#0099ff')
//             .setTitle(metadata.name)
//             .setURL(metadata.permalink)
//             .addField("Owner", metadata.owner.user?.username || metadata.owner.address.slice(0, 8))
//             .setImage(metadata.image_url);

//           metadata.traits.forEach(function (trait) {
//             embedMsg.addField(trait.trait_type, `${ trait.value } (${ Number(trait.trait_count / metadata.collection.stats.count).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 }) })`, true)
//             //embedMsg.addField(trait.trait_type, `${trait.value}`, true)
//           });

//           message.channel.send(embedMsg);
//         })
//         .catch(error => message.channel.send(error.message));
//     },
//   }
// };


module.exports = {
  name: 'show' || "token",
  execute(message, args) {
    if (!args.length) {
      return message.channel.send(`You didn't provide a token id, ${ message.author }!`);
    }

    switch (args[0].toLowerCase()) {
      case 'cgk':
        contractAddress = process.env.CONTRACT_ADDRESS_AB
        break
      case 'isid':
        contractAddress = process.env.CONTRACT_ADDRESS_AB
        break
      case 'fim':
        contractAddress = process.env.CONTRACT_ADDRESS_AB
        break
      case 'nf':
        contractAddress = process.env.CONTRACT_ADDRESS_NF
        break
      case 'nvc':
        contractAddress = process.env.CONTRACT_ADDRESS_NVC
        break
      case 'ious':
        contractAddress = process.env.CONTRACT_ADDRESS_IOUS
        break
      case 'cosj':
        contractAddress = process.env.CONTRACT_ADDRESS_COSJ
        break

    }

    if (isNaN(parseInt(args[1]))) {
      return message.channel.send(`Token id must be a number!`);
    }

    if (args[0].toLowerCase() === 'cgk') {
      args[1] = '44000' + args[1]
    } else if (args[0].toLowerCase() === 'fim') {
      args[1] = '152000' + args[1]
    } else if (args[0].toLowerCase() === 'isid') {
      if (parseInt(args[1]) > 999) {
        args[1] = '10200' + args[1]
      } else {
        args[1] = '102000' + args[1]
      }
    }


    let url = `${ openseaAssetUrl }/${ contractAddress }/${ args[1] }`;
    let settings = {
      method: "GET",
      headers: process.env.OPEN_SEA_API_KEY == null ? {} : {
        "X-API-KEY": process.env.OPEN_SEA_API_KEY
      }
    };

    fetch(url, settings)
      .then(res => {
        if (res.status == 404 || res.status == 400) {
          throw new Error("Token id doesn't exist.");
        }
        if (res.status != 200) {
          throw new Error(`Couldn't retrieve metadata: ${ res.statusText }`);
        }
        return res.json();
      })
      .then((metadata) => {
        const embedMsg = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle(metadata.name)
          .setURL(metadata.permalink)
          .addField("Owner", metadata.owner.user?.username || metadata.owner.address.slice(0, 8))
          .setImage(metadata.image_url);

        metadata.traits.forEach(function (trait) {
          embedMsg.addField(trait.trait_type, `${ trait.value } (${ Number(trait.trait_count / metadata.collection.stats.count).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 }) })`, true)
          //embedMsg.addField(trait.trait_type, `${trait.value}`, true)
        });

        message.channel.send(embedMsg);
      })
      .catch(error => message.channel.send(error.message));
  },

};