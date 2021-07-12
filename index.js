const Discord = require("discord.js")
const fetch = require("node-fetch")
//const keepAlive = require("./server")
const Database = require("@replit/database")
const fs = require('fs')


const db = new Database()
const client = new Discord.Client()

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
    "i love you too baby ",
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
  }).then(data => {
    return data["file"]
  })
}

function getFox(){
  return fetch("https://randomfox.ca/floof/").then(res => {
    return res.json()
  }).then(data => {
    return data["image"]
  })
}


client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", msg => {
  if(msg.author.bot) return

    let currentDate = new Date();
    let cDay = currentDate.getDate()
    let cMonth = currentDate.getMonth() + 1
    let cYear = currentDate.getFullYear()
    let cRightNow = cDay + "-" + cMonth + "-" + cYear + ".txt"

  fs.writeFile("logs/" + cRightNow, + currentDate.getHours() +":" + currentDate.getMinutes() + "->" + msg.author.username + ": " + msg.author.id + "\n " + msg.content, (err) => {

    // In case of a error throw err.
    if (err) throw err;
    })

  if(msg.content.startsWith('$') || msg.content === "ily" || msg.content === "Ily" || msg.content === "i love you" || msg.content === "juliet"){
      console.log(msg.author.username + ": " + msg.author.id + "\n " + msg.content);
  }

  
  if(msg.content === "$ping"){
    msg.reply("pong")
  }
  
  if(msg.content === "$inspire"){
    getQuote().then(quote => msg.channel.send(quote))
  }

  if(msg.content === "$cat" || msg.content === "$Cat"){
    getCat().then(cat => msg.channel.send(cat))
  }

  if(msg.content === "$fox" || msg.content === "$Fox"){
    getFox().then(fox => msg.channel.send(fox))
  }

  if(msg.content === "ily" || msg.content === "Ily" || msg.content === "i love you"){
      console.log(msg.author.username + ": " + msg.author.id);
      if(msg.author.id == "748392260990795826" || msg.author.id == "820977885603037216"){ //Olet 
        var randomElement = panlandi[Math.floor(Math.random() * panlandi.length)];
          msg.reply(randomElement);
      } else {
          var randomElement = plainIly[Math.floor(Math.random() * plainIly.length)];
          msg.reply(randomElement + "<333");
      }
  }
  if(msg.content === "hi"){
    msg.reply("hi");
  }
  
  if(msg.content === "$olet"){
    msg.reply("Hi babyyyyy!")
  }
  if(msg.content === "Wyd" || msg.content === "wyd" || msg.content === "gawa nyo"){
    var randomElement = wyd[Math.floor(Math.random() * wyd.length)];
          msg.reply(randomElement);
  }
  db.get("responding").then(responding =>{
      if(responding && triggerSad.some(word => msg.content.includes(word))){
      db.get("respSad").then(respSad => {
        const response = respSad[Math.floor(Math.random()*respSad.length)]
      msg.reply(response)
      })
    }
  })
  
  if(msg.content.startsWith("$new")){
    respSadMessage = msg.content.split("$new ")[1]
    updateRespSad(respSadMessage)
    msg.channel.send("Entry added!")
  }

  if(msg.content.startsWith("$del")){
    index = parseInt(msg.content.split("$del ")[1])
    deleteRespSad(index)
    msg.channel.send("Entry deleted!")
  }

  if(msg.content.startsWith("$list")){
    db.get("respSad").then(respSad => {
      msg.channel.send(respSad)
    })
  }


  
  if(msg.content === "juliet"){
    msg.reply("titi");
  }

  if(msg.content.startsWith("$responding")){
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