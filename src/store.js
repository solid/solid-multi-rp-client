module.exports = class OIDCClientStore {
  constructor () {
    this.clients = {}
  }
  put (expressClient) {
    return Promise.resolve()
      .then(() => {
        this.clients[expressClient.client.issuer] = expressClient
      })
  }
  get (issuer) {
    return Promise.resolve()
      .then(() => {
        if (issuer in this.clients) {
          return this.clients[issuer]
        } else {
          return null
        }
      })
  }
}
