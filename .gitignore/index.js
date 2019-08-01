const config = require("./config.json");
const Discord = require('discord.js');
const bot = new Discord.Client();
const moment = require("moment");
const prefix = config.prefix;

bot.on('ready', function() {
    console.log("je suis chaud")
    bot.user.setActivity("mon prefix est ?", { type: "STREAMING" })
});

bot.on('message', message => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    let messageArray = message.content.split(' ');
    let commands = messageArray[0];
    let args = messageArray.slice(1);

    if (commands === `${prefix}salut`) {
        return message.channel.send("salut tout le monde");
    }
});
bot.on("message", message => {
    if (message.content === (prefix + "membres")) {
        let embed = new Discord.RichEmbed()
            .setColor("RANDOM")
            .addField("Membres du Serveur", message.guild.memberCount, true)
        message.channel.send(embed);
    }
})

bot.on("message", message => {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLowerCase() === prefix + "purge") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(":warning: Vous n'avez pas la permission d'utiliser cette commande")
        let count = args[1]
        if (!count) return message.channel.send("Veuillez indiquer un nombre de messages supprimer")
        if (isNaN(count)) return message.channel.send("Veuillez indiquer un nombre valide")
        if (count < 1 || count > 100) return message.channel.send("Veuillez indiquer un nombre entre 1 et 100")
        message.channel.bulkDelete(parseInt(count) + 1)
        message.channel.send(`${args[0]} message on ete supprimes :v:`)
    }
});
bot.on("message", message => {
if(message.content.startsWith(prefix + "strawpoll")) {
    let args = message.content.slice(prefix.length).trim().split(' ').join(" ")
    if(!args.slice(10)) return message.channel.send("Tu n'as pas présisé de texte")
    let embed = new Discord.RichEmbed()
    .setAuthor(`${message.author.username}`, message.author.avatarURL)
    .setDescription(args.slice(10))
    .setTimestamp()
    message.channel.send(embed).then(async (message) => {await message.react("✅");await message.react("❌")})
}
})

bot.on("message", message => {
    if(message.content.startsWith(prefix + "servinfo")) {
        let embed = new Discord.RichEmbed()
      .setAuthor(message.guild.name)
      .setFooter(`${message.guild.name}`)
      .setColor("dc143c")
      .setTitle("[PHOTO DU SERVEUR]")
      .addField("**:id: ID Du Serveur**", "**" + message.guild.id + "**", true)
      .addField("**:name_badge: Nom Du Serveur**", "**" + message.guild.name + "**", true)
      .addField("**:crown: Créateur Du Serveur**", "**" + message.guild.owner.user.tag + "**", true)
      .addField("**:crown: L'ID Du Créateur**", "**" + message.guild.ownerID + "**", true)
      .addField("**:earth_africa: Région**", "**" + message.guild.region + "**", true)
      .addField('**:speech_balloon: Channels**', `**${message.guild.channels.filter(m => m.type === 'text').size}**` + ' Channels Textuels | Channels Vocaux  ' + `**${message.guild.channels.filter(m => m.type === 'voice').size}**`, true)
      .addField("**:busts_in_silhouette: Membres**", "**" + message.guild.memberCount + "**", true)
      .addField("**:boy: Humains**", message.guild.memberCount - message.guild.members.filter(m => m.user.bot).size, true)
      .addField("**:robot: Nombres de bots**", "**" + message.guild.members.filter(m => m.user.bot).size + "**", true)
      .addField("**:date: Serveur Crée Le**", `**${message.guild.createdAt.toLocaleString()}**`, true)
      .addField("**:date: Serveur Rejoint Le**", "**" + message.member.joinedAt.toLocaleString() + "**")
      .addField("**:trophy: Rôles**", "**" + message.guild.roles.size + "**", true)
      .addField("**:lock: Sécurité**", `**Niveau de sécurité : ${message.guild.verificationLevel}**`)
      .setTimestamp()
      .setFooter(bot.user.username)
      message.channel.send(embed);
      }
      }
      
        )
        bot.on('message', message => {
            if(message.content.startsWith(prefix + "ping" )) {
                    message.channel.send(new Date().getTime() - message.createdTimestamp + " ms");        
            }
        });
        bot.on('message',message =>{
            if (!message.guild) return
            let args = message.content.trim().split(/ +/g)
        
        if (args[0].toLowerCase() === prefix + 'ban'){
            if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("**Vous n'avez pas la permission d'executer cette commande !**")
            let member = message.mentions.members.first()
            if (!member) return message.channel.send('**Veuillez mentionner un utilisateur :(**')
            if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send('**Vous ne pouvez pas ban cette personnes !!**')
            if (!member.bannable) return message.channel.send('**je ne peut pas ban cet utilisateur ! **')
            message.guild.ban(member, {days: 7})
            message.channel.send(member.user.username + ' à bien été banni du serveur !');
            
            }
        
        });
        bot.on('message', message => {
            if(message.content.startsWith(prefix + "kick" )) {
              const member = message.mentions.members.first()
              
              if (!member) {
                return message.reply('Il faut que vous mentionnez une personne 😅')
              }
              if (!member.kickable) {
                return message.reply('Je ne peut pas kick ce membre,desoler🤔')
              }
              return member
                .kick()
                .then(() => message.reply(' l utilisateur a été kick avec succes'))
                .catch(error => message.reply("Une erreur s'est produite"))
            }
          })
          //invite
          bot.on('message', message => {
            if(message.content.startsWith(prefix + "invite" )) {
        message.reply("**:robot: Yo :v: ,Voici mon lien d'invitation :tada: https://discordapp.com/oauth2/authorize?bot_id=590856059447410688&scope=bot&permissions=8 :tada:")
        }
 });  

//serveur support
bot.on('message', message => {
    if(message.content.startsWith(prefix + "support" )) {
        message.reply("**:robot: Salut :grin: , Voici mon serveur :tada: support :tada: Viens pour plus d aide et des suggestions :wink: https://discord.gg/3uBdmps**")
 }
});        
bot.on('message', message => {
    if(message.content.startsWith(prefix + "is" )) {
     	
    let embed = new Discord.RichEmbed()
    .setColor("#1a819b")
    .setTitle("Je suis sur " + bot.guilds.size + " serveurs" )
    .setDescription(bot.guilds.map(c => c.name))
    .setFooter("MoodLand  | 2019 "+ bot.users.size + " utilisateurs")
    .setTimestamp()
    message.channel.send(embed)
 }
})
bot.on('message', message => {
if (message.content.startsWith(prefix + 'hug')){
    message.delete()
    
    var facts = [
    "https://cdn.discordapp.com/attachments/576038287303507978/576045960468234270/tenor_gif786099605.gif", 
    "https://cdn.discordapp.com/attachments/576038287303507978/576046075610398721/tenor_gif2097919235.gif", 
    "https://cdn.discordapp.com/attachments/576038287303507978/576046234284851229/tenor_gif1409569625.gif", 
    "https://cdn.discordapp.com/attachments/576038287303507978/576046457661161472/tenor_gif-145660273.gif", 
    "https://cdn.discordapp.com/attachments/576038287303507978/576046544164487198/tenor_gif-2084372537.gif", 
    "VIENS ME FAIRE UN CÂLIN TOI ", "https://cdn.discordapp.com/attachments/576038287303507978/576046708518158355/tenor_gif-461437040.gif", 
    "https://cdn.discordapp.com/attachments/576038287303507978/576046640054534144/tenor_gif-1531899666.gif", 
    "https://cdn.discordapp.com/attachments/576038287303507978/576046811744305163/tenor_gif289693878.gif", 
    "https://cdn.discordapp.com/attachments/576038287303507978/576047026052005901/tenor_gif-1132435972.gif", 
    "https://cdn.discordapp.com/attachments/576038287303507978/576047160718786610/tenor_gif1218076412.gif", 
    "https://cdn.weeb.sh/images/BkBs2uk_b.gif", 
    "https://cdn.weeb.sh/images/rk_6GyncG.gif", 
    "https://cdn.weeb.sh/images/ry6o__7D-.gif", 
    "https://cdn.weeb.sh/images/Sk2gmRZZG.gif", 
    "https://cdn.weeb.sh/images/BkZngAYtb.gif", 
    "https://cdn.weeb.sh/images/ByuHsvu8z.gif", 
    "https://cdn.weeb.sh/images/Hk3ox0tYW.gif", 
    "https://cdn.weeb.sh/images/BkHA_O7v-.gif",   
    "https://cdn.weeb.sh/images/S1gUsu_Qw-.gif"];
    var fact = Math.floor(Math.random() * facts.length);
    
    
        
    const hugembed = new Discord.RichEmbed()
      .setColor('#1a819b')
      .setImage(facts[fact])
      message.channel.send(hugembed);
        
  }
})
bot.on('message', message => {
    if (message.content.startsWith(prefix + 'pub')){
    return message.channel.send("```voici la pub du serveur : Bienvenue dans MultiSupport ! Caractéristique du serveur : 📌Ajouter ton bot, tester ton bot et aussi ceux des autres, donner tes avis ou des conseils ! 🔍Discutez, rigolez et te faire plein d'amis ! 🔭Des salons uniques, et varié ! 📣Des giveways et événements pour rendre le serveur encore plus amusant ! 🎖Des nouveautés rêgulièrement pour animé le serveur ! Voici l'entrée vers notre univers multisupport :[https://discord.gg/3uBdmps]Nous tattendons impatiemment !```");
}
})
bot.on('message', message => {
    if(message.content.startsWith(prefix + 'salut')){
    return message.channel.send("**salut a vous jeunes membres**")
    }
    })

bot.on('message', message => {
if(message.content.startsWith(prefix + 'qui est le plus beau')){
return message.channel.send("** Mon propriétaire est le plus beau**")
}
})

bot.on('message', message => {
    if(message.content.startsWith(prefix + 'deconnexion')){
        message.channel.search('**au revoir :sad: ...**')
        message.delete().then(bot.destroy())
    }
})
bot.on('guildMemberAdd', member =>{
member.guild.channels.get('605690341240340480').send('**:tada: bienvenue sur le serveur**' + member.user + '**:smile: Nous sommes **' + member.guild.memberCount);
console.log('+1')
})

bot.on('guildMemberRemove', member =>{
    member.guild.channels.get('605690341240340480').send('**:cry: aurevoir **' + member.user + '**:cry: Nous sommes **' + member.guild.memberCount);
    console.log('-1')
})
bot.on('message', message => {
    if(message.content.startsWith(prefix + 'reboot')) {
       let embed = new Discord.RichEmbed()
   
       if(message.author.id !== "449295211265392641")  return;
       bot.destroy()
       bot.login(config.token)
   embed.setTitle("MoodLand redémmaré avec succés !")
   .setFooter(message.author.username, message.author.avatarURL)
   .setTimestamp()
   .setColor("BLUE");
   message.channel.send(embed)
   }
   })
bot.on('message', message => {
    if(message.content.startsWith(prefix + 'avatar')) {

   let member = message.mentions.members.first();

    if (member) {
        let avatarembed1 = new Discord.RichEmbed()
            .setTitle(`voici ton avatar **${member.user.username}**`)
            .setDescription(`_ l'avatar ne s'affiche pas ?_ **> [click ici](${member.user.avatarURL}) <**`)
            .setImage(member.user.avatarURL)
            .setTimestamp();
        message.channel.send(avatarembed1)
    }
    if (!member) {

        let avatarembed2 = new Discord.RichEmbed()
            .setTitle(`voici ton avatar **${message.author.username}**`)
            .setDescription(`_l'avatar ne s'affiche pas ?_ **> [click ici](${message.author.avatarURL}) <**`)
            .setImage(message.author.avatarURL)
            .setTimestamp();
        message.channel.send(avatarembed2)
    }
}
})

bot.on('message', message => {
    if(message.content.startsWith(prefix + 'info')) {
        let botIcon = bot.user.displayAvatarURL;
        var Embed = new Discord.RichEmbed()
.setDescription('informations sur le bot')
.setColor("dc143c")
.setThumbnail(botIcon)
.addField('nom du bot', bot.user.username);
return message.channel.send(embed);
    }
})
bot.login(config.token);