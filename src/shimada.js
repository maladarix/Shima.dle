class Shimada{

  constructor(user, img, sexe, main, sr1, sr2, academy, anciennetee) {
    this.id = user.user.id
    this.displayName = user.nickname ? user.nickname : user.user.globalName
    this.img = img
    this.sexe = sexe
    this.main = main
    this.sr1 = sr1
    this.sr2 = sr2
    this.academy = academy
    this.anciennetee = anciennetee
  }
}

module.exports = Shimada