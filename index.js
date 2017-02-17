#!/usr/bin/env node

console.log('Started!')

const Client = require('discord.js').Client
const bot = new Client()
const spawn = require('child_process').spawn

let q = []
let busy = false

// let acros = {
//   'lol': 'licking old lips',
//   'lmao': 'laughing my ass off',
//   'lmfao': 'laughing my fucking ass off',
//   'imo': 'in my opinion',
//   'rip': 'rest in peace'
// }

// for (var acro in acros) {
//   message = name + ' says ' + content.replace(new RegExp('\s*' + acro + '\s*'), acros[acro])
// }

var name_previous = ''

bot.on('message', msg => {
  var name = msg.member.displayName
  var content = msg.cleanContent
  var message

  if (content === '') {
    message = name + ' uploaded media'
  } else if (content.indexOf('https://') === 0 || content.indexOf('http://') === 0) {
    message = name + ' posted a link'
  } else if (name === name_previous) {
    message = content
  } else {
    message = name + ' says ' + content
  }

  name_previous = name

  if (q.length < 10) q.push(message)
  if (!busy) say(q.shift())
})

function say(message) {
  busy = true
  var proc = spawn('say', [message])
  proc.on('exit', () => {
    busy = false
    if (q.length) say(q.shift())
  })
}

bot.login(require('./token'))
