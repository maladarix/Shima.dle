class Profil {

  constructor(user) {
    this.id = user.user.id
    this.displayName = user.nickname ? user.nickname : user.user.globalName
    this.streak = 0
    this.bestStreak = 0
    this.nbGuess = 0
    this.score = 0
    this.multiplicator = 1
    this.isDone = false
    this.result = 0
    this.lastPlay = ""
    this.hint = 0
    this.guess = []
    this.resultEmoji = []
  }
}

module.exports = Profil