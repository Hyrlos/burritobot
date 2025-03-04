const { BURRITAL, BURRITOEL } = require("./emoji")
const { fetchGif } = require("./external")

TYPE_REACT = 'react'
TYPE_WRITE = 'write'
// TYPE_RESPOND = 'respond'

class Reaction {
    patterns = []
    type = TYPE_WRITE
    responseGetter = async () => ''

    constructor(patterns, type, responseGetter) {
        this.patterns = patterns
        this.responseGetter = responseGetter
        this.type = type
    }

    async sendResponse(message) {
      const channel = message.channel
      const response = await this.responseGetter()

      switch (this.type) {
        case TYPE_WRITE:
          channel.send(response)
          break;
        case TYPE_REACT: {
          message.react(response)
          break;
        }
      }
    }

    matches(text) {
      return this.patterns.some(pattern => text.includes(pattern))
    }
}

const REACTIONS = [
    new Reaction(['burrito', 'burrital'], TYPE_REACT, () => BURRITAL.id),
    new Reaction(['noel'], TYPE_REACT, () => BURRITOEL.id),
    new Reaction(['itk'], TYPE_WRITE, () => fetchGif('cow')),
    new Reaction(['jpp'], TYPE_WRITE, () => fetchGif('jean-pierre polnareff')),
    new Reaction(['omg'], TYPE_WRITE, () => fetchGif('oh my god jojo', 10))
]

function react(message) {
    const content = message.content.toLowerCase()

    REACTIONS.filter(reaction => reaction.matches(content))
      .forEach(reaction => reaction.sendResponse(message))
}

module.exports = { react }
