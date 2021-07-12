const express = require("express")

const server = express()

server.all("/", (req, res) => {
  res.semd("Bot is running.")
})

function keepAlive(){
  server.listen(3000, () => {
    console.log("Server is running!")
  })
}

module.exports = keepAlive