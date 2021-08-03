const Discord = require("discord.js")
const fetch = require("node-fetch")
//const keepAlive = require("./server")
const Database = require("@replit/database")
const fs = require('fs')
const { MessageEmbed } = require('discord.js');


const db = new Database()
require('discord-reply');
const client = new Discord.Client()
const COINLAYER_API_KEY = process.env['COINLAYER_API_KEY']


const triggerSad = ["sad", "sadhours", "kms", "iwannadie", "sadboi hours"]

const initialRespSad = [
  "Cheer up!",
  "Hang in there!",
  "It's probably as not as bad as you think."
]

const panlandi = [
    "(♡˙︶˙♡) I love u too baby (/ε＼*)",
    "(´｡• ᵕ •｡`) ♡ i wuv u 2 bb Owet ('｡• ᵕ •｡') ♡",
    "ヽ(♡‿♡)ノ I love u more Julia ヽ(♡‿♡)ノ",
    "nah i love u more ('｡• ω •｡') ♡ bitch ♡ ('｡• ω •｡')",
    "(',,•ω•,,)♡ ehehehehehehehe i love u too ehehehehehehe (',,•ω•,,)♡"
]
const plainIly = [
    "Thanks, who doesnt?",
    "i love you too bby ",
    "i love you more ",
    "i love you too, keep holding on okay baby? ",
    "i love you toooooo ",
    "ily too, things will be better okay? "
]

const wyd = [
    "Nothing much bb, jus thinking about u (´∩｡• ᵕ •｡∩`)",
    "Just idlinggggg, how about u baby ( ◡‿◡ *)",
    "None much, hbu? u busy? (￣ε￣＠)",
    "idk, jus daydreaming of a future wit u (*ﾉωﾉ)",
    "nothing really, just admiring u from afar (* ^ ω ^)"
]

let bonkedUsers = []

db.get("respSad").then(respSad => {
  if(!respSad || respSad.length < 1){
    db.set("respSad", initialRespSad)
  }
})

db.get("responding").then(value => {
  if(value == null){
    db.set("responding", true)
  }
})

function updateRespSad(respSadMessage){
  db.get("respSad").then(respSad => {
    respSad.push(respSadMessage)
    db.set("respSad", respSad)
  })
}

function deleteRespSad(index){
  db.get("respSad").then(respSad => {
    if(respSad.length > index){
      respSad.splice(index, 1)
    }
    db.set("respSad", respSad)
  })
}


function getQuote(){
  return fetch("https://zenquotes.io/api/random").then(res => {
    return res.json()
  }).then(data => {
    return data[0]["q"] + " -" + data[0]["a"] 
  })
}

function getCat(){
  return fetch("https://aws.random.cat/meow").then(res => {
    return res.json()
  }).then(res => {
    const embed = new MessageEmbed()
	.setColor('#E4E4DC')
	.setTitle('Here\'s your Cat!')
    .setImage(res["file"])
	.setFooter("Meow meow!")

    return embed
  })
}

function getFox(){
  return fetch("https://randomfox.ca/floof/").then(res => {
    return res.json()
  }).then(res => {
    const embed = new MessageEmbed()
	.setColor('#9C5D1F')
	.setTitle('Here\'s your Fox!')
    .setImage(res["image"])
	.setFooter("What does a fox say?")

    return embed
  })
}

function getDog(){
  return fetch("https://random.dog/woof.json?ref=apilist.fun").then(res => {
    return res.json()
  }).then(res => {
    const embed = new MessageEmbed()
	.setColor('#D1A253')
	.setTitle('Here\'s your Dog!')
    .setImage(res["url"])
	.setFooter("Woof woof!")
    
    return embed
  })
}

function getYesNo(){
  return fetch("https://yesno.wtf/api").then(res => {
    return res.json()
  }).then(data => {
    return data["answer"]
  })
}

function getShibe(n){
  return fetch("http://shibe.online/api/shibes?count=" + n + "&urls=true&httpsUrls=true").then(res => {
      return res.json()
  })
}

function getBirb(n){
  return fetch("http://shibe.online/api/birds?count=" + n + "&urls=true&httpsUrls=true").then(res => {
      return res.json()
  })
}

function getCrypto(message){
    // message.guild.channels.cache.find(channel => channel.name === "channel-name").id;
    var link = "http://api.coinlayer.com/api/live?access_key=" + COINLAYER_API_KEY + "&symbols=BTC,ETH,BNB"
    return fetch(link).then(response => {
        return response.json()
    }).then(data => {

    let currentDate = new Date();
    let cDay = currentDate.getDate()
    if (cDay < 10){
        cDay = "0" + cDay;
    }
    let cMonth = currentDate.getMonth() + 1
    if (Number(cMonth) < 10){
        cMonth = "0" + cMonth;
    }
    let cYear = currentDate.getFullYear()
    let cRightNow = cMonth + "-" + cDay + "-" + cYear

    const exampleEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Exchange rates for today')
	.setDescription('As of ' + cRightNow)
	.addFields(
		{ name: 'Bitcoin', value: '$' + data["rates"]["BTC"] },
		{ name: 'Ethereum', value: '$' + data["rates"]["ETH"]},
		{ name: 'BNB', value: '$' + data["rates"]["BNB"] },
	).setTimestamp()
	.setFooter('Happy trading! ily UwU');
        return exampleEmbed
    })
}

function getJoke(message) {
    const baseURL = "https://v2.jokeapi.dev";
    const categories = ["Any", "Dark", "Programming", "Misc", "Pun", "Spooky"];
    const params = [
        // "blacklistFlags=nsfw,religious,racist",
        // "idRange=0-100"
    ];

    return fetch(`${baseURL}/joke/${categories.join(",")}`).then(res => {
        return res.json()
    }).then(randomJoke => {
        if(randomJoke["type"] == "single"){
            // If type == "single", the joke only has the "joke" property
            message.channel.send(randomJoke["joke"])
        }else{
            // If type == "twopart", the joke has the "setup" and "delivery" properties
            message.channel.send(randomJoke["setup"])
            setTimeout(() => {
                message.channel.send(randomJoke["delivery"])
            }, 3000);
        }
    })
}  

function getAxo(){
    return fetch("https://axoltlapi.herokuapp.com/").then(res => {
        return res.json()
    }).then(res => {
    console.log(res["url"])    
    console.log(res["facts"])    
    const embed = new MessageEmbed()
	.setColor('#FF36C8')
	.setTitle('Here\'s your Axolotl!')
    .setImage(res["url"])
	.setFooter(res["facts"])

    return embed
    })
}

function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
}

/*async function traceMoe(msg){
    let messageAttachment = msg.attachments.size > 0 ? msg.attachments.array()[0].url : null;
    if (messageAttachment){
        var imageBlob = messageAttachment;
        const formData = new FormData();
        formData.append("image", imageBlob);
        return await fetch("https://api.trace.moe/search", {
        method: "POST",
        body: formData,
        }).then((e) => { 
            return e.json()
        }).then(res => {
            msg.channel.send(res["result"]["filename"]);
        }); 
    } else {
        msg.reply("`**Usage** = $trace <attach anime frame>``");
    }
} */

function logCommand(msg){
    // TODO Set Dates to local timezone
    let currentDate = new Date();
    let cDay = currentDate.getDate()
    if (cDay < 10){
        cDay = "0" + cDay;
    }
    let cMonth = currentDate.getMonth() + 1
    if (Number(cMonth) < 10){
        cMonth = "0" + cMonth;
    }
    let cYear = currentDate.getFullYear()
    let cRightNow = cMonth + "-" + cDay + "-" + cYear + ".txt"

    fs.writeFile("logs/" + cRightNow, currentDate.getHours() +":" + currentDate.getMinutes() + " -> " + msg.author.id + ": " + msg.author.username + ": " + msg.content + "\n", { flag: 'a+' }, function (err) {
        if (err) throw err;
    })

    console.log(msg.author.username + ": " + msg.author.id + ": " + msg.content);
}

client.on("ready", () => {
    let currentDate = new Date();
    let cDay = currentDate.getDate()
    if (Number(cDay) < 10){
            cDay = "0" + cDay;
        }
    let cMonth = currentDate.getMonth() + 1
    if (Number(cMonth) < 10){
            cMonth = "0" + cMonth;
        }
    let cYear = currentDate.getFullYear()
    let cRightNow = cMonth + "-" + cDay + "-" + cYear + ".txt"

  console.log(`Logged in as ${client.user.tag}!`)
  fs.writeFile("logs/" + cRightNow,` Logged in as ${client.user.tag}! \n`, { flag: 'a+' }, function (err) {
        if (err) throw err;
    });

    client.user.setActivity('$help', {type: "LISTENING"}).catch(console.error)
})

client.on("message", msg => {
  if(msg.author.bot) return

  if(msg.content === "$ping"){
    logCommand(msg);
    msg.lineReplyNoMention("pong")
  }
  
  if(msg.content === "$inspire"){
    logCommand(msg);
    getQuote().then(quote => msg.channel.send(quote))
  }

  if(msg.content === "$rate"){
    logCommand(msg);
    getCrypto(msg).then(response => msg.channel.send(response))
  }

  if(msg.content === "$joke"){
    logCommand(msg);
    getJoke(msg)
  }

  if(msg.content === "$cat" || msg.content === "$Cat"){
    logCommand(msg);
    getCat().then(cat => msg.channel.send(cat))
  }

  if(msg.content === "$fox" || msg.content === "$Fox"){
    logCommand(msg);
    getFox().then(fox => msg.channel.send(fox))
  }

  if(msg.content === "$dog" || msg.content === "$Dog"){
    logCommand(msg);
    getDog().then(dog => msg.channel.send(dog))
  }

  if(msg.content === "$axo" || msg.content === "$Axo"){
    logCommand(msg);
    getAxo().then(axo => msg.channel.send(axo))
  }

  if(msg.content.startsWith("$shiba") || msg.content.startsWith("$Shiba")){
    logCommand(msg);
    msg.content.toLowerCase()
    n = parseInt(msg.content.split("$shiba ")[1])
    if (typeof n === 'number' && n <= 10 && n > 0){
        getShibe(n).then(res =>{
            for(var i = 0; i < res.length; i++){
                msg.channel.send(res[i])
            }
        })
    } else {
        msg.channel.send("`Usage: $shiba <number of dogs u want [1-10]>`")
        msg.channel.send("`Ex: $shiba 3`")
    } 
  }

  if(msg.content.startsWith("$birb") || msg.content.startsWith("$Birb")){
    logCommand(msg);
    msg.content.toLowerCase()
    n = parseInt(msg.content.split("$birb ")[1])
    if (typeof n === 'number' && n <= 10 && n > 0){
        getBirb(n).then(res =>{
            for(var i = 0; i < res.length; i++){
                msg.channel.send(res[i])
            }
        })
    } else {
        msg.channel.send("`Usage: $birb <number of birbs u want [1-10]>`")
        msg.channel.send("`Ex: $birb 3`")
    } 
  }

  if(msg.content === "ily" || msg.content === "Ily" || msg.content === "i love you"){
      logCommand(msg);
      if(msg.author.id == "748392260990795826" || msg.author.id == "820977885603037216"){ //Olet 
        var randomElement = panlandi[Math.floor(Math.random() * (panlandi.length - 0 + 1) + 0)]; //rand num between 0 and arrsize, inclusive
          msg.lineReplyNoMention(randomElement);
      } else {
          var randomElement = Math.floor(Math.random() * (plainIly.length - 0 + 1) + 0) //rand num between 0 and arrsize, inclusive
          if (randomElement == 0){
                msg.lineReplyNoMention(plainIly[randomElement]);
                sleep(3000).then(() => {
                msg.lineReplyNoMention("Jk, of course i love you too stupid ♡( ◡‿◡ )");
                })
          } else {
            msg.lineReplyNoMention(plainIly[randomElement] + "<333");              
          }
      }
  }

  if(msg.content === "hi"){
    logCommand(msg);
    msg.lineReplyNoMention("hi");
  }
  
  if(msg.content === "$olet"){
    logCommand(msg);
    msg.lineReplyNoMention("Hi babyyyyy!")
  }

  if(msg.content.startsWith("Wyd") || msg.content.startsWith("wyd") || msg.content === "gawa nyo"){
    logCommand(msg);
    var randomElement = wyd[Math.floor(Math.random() * wyd.length)];
          msg.lineReplyNoMention(randomElement);
  }

  db.get("responding").then(responding =>{
      msg.content = msg.content.toLowerCase()
      if(responding && triggerSad.some(word => msg.content.includes(word))){
      db.get("respSad").then(respSad => {
        const response = respSad[Math.floor(Math.random()*respSad.length)]

      logCommand(msg);
      msg.lineReplyNoMention(response)
      })
    }
  })
  
  if(msg.content.startsWith("$bonk")){
    logCommand(msg);
    msg.channel.send("`Unfortunately, this feature is still in development.`")
   /*var toBonk = msg.content.split(' ')
    for (var bonker in toBonk) {
        if (bonker.startsWith("<@!") && bonker.endsWith(">")) {
            bonkedUsers.push(toBonk.slice(3, -1))
            msg.channel.send(bonker + " has been bonked!")
        }
    } */
  } 
  if(msg.content.startsWith("$status")){
    if(msg.author.id == "616261191614070795") {//Jiro
      status = msg.content.split("$status ")[1]
      client.user.setActivity(status, {type: "LISTENING"}).catch(console.error)
      msg.lineReplyNoMention("`Command successful.`")
    } else {
        msg.lineReplyNoMention("`Error: This command is only available to my creator. $contact for info.`")
    }
  }

  if(msg.content.startsWith("$ask")){
    logCommand(msg);
    question = msg.content.split("$ask ")[1]
    if (question){    
        msg.channel.send("Question: *" + question + "?*\n")
        getYesNo().then(res => {
            msg.channel.send("Answer: _**" + res + "!**_")
        })
    } else {
        msg.channel.send("`Usage: $ask <question>`")
    }
  }

  if(msg.content.startsWith("$trace")){
    logCommand(msg);
    msg.channel.send("`Unfortunately, this feature is still in development.`")
    /*traceMoe(msg);*/
  }
  
  if(msg.content.startsWith("$new")){
    logCommand(msg);
    respSadMessage = msg.content.split("$new ")[1]
    updateRespSad(respSadMessage)
    msg.channel.send("Entry added!")
  }

  if(msg.content.startsWith("$del")){
    logCommand(msg);
    index = parseInt(msg.content.split("$del ")[1])
    deleteRespSad(index)
    msg.channel.send("Entry deleted!")
  }

  if(msg.content.startsWith("$list")){
    logCommand(msg);
    db.get("respSad").then(respSad => {
      msg.channel.send(respSad)
    })
  }


  
  if(msg.content === "juliet"){
    logCommand(msg);
    msg.lineReplyNoMention("haha juliet titi");
  }

  if(msg.content === "$contact"){
    logCommand(msg);
    let contact = [
        "**Twitter** https://www.twitter.com/xreoji",
        "**GitHub** https://www.github.com/JirroReo",
        "**Source Code** https://www.github.com/JirroReo/BebetimeBotJS"
    ]
    msg.channel.send(contact);
  }

  if(msg.content === "$help"){
   let help = [
   "Prefix is `$`",
   "**help** = Sends this message.",
   "**contact** = Author contact information.",
   "**cat** = Sends a random picture, gif, or video of a cat.",
   "**dog** = Like **cat** but dog.",
   "**shiba** = Like **dog** but *犬*.",
   "**fox** = Like **dog** but smaller and dont bark.",
   "**birb** = Like **fox** but with tiny wings.",
   "**new [message]** = Adds message to responses for sad messages.",
   "**list** = Lists all responses for sad messages",
   "**del [index]** = Deletes message at index from sad message reponses.",
   "**responding [on/off]** = Sets wether the bot responds to sad messages.",
   "**ping** = Checks for server availability, bot will reply `pong` if yes.",
   "**inspire** = Gives a random inspirational quote.",
   "**joke** = Gives a random - sometimes dark - joke.",
   "**ask** = Answers questions with a random yes or no.",
   "**rate** = Sends the latest rates for Bitcoin, Ethereum, and BNB.",
   "**trace <anime frame>** = searches a database of anime for the given frame.",
   "**bonk <@user>** = Bonks user, blocking them from nsfw commands."
  ];
    msg.channel.send(help)
  }

  if(msg.content.startsWith("$responding")){
    logCommand(msg);
    value = msg.content.split("$responding ")[1]

    if(value.toLowerCase() == "on"){
      db.set("responding", true)
      msg.channel.send("*Sad hours responding mode on.*")
    }else if(value.toLowerCase() == "off"){
      db.set("responding", false)
      msg.channel.send("*Sad hours responding mode off.*")
    }else{
      msg.channel.send("I'm sorry, I couldn't get that. `Syntax: $responding on/off`")
    }
  }
})

//keepAlive()
client.login(process.env.TOKEN)