const OIDCExpressClient = require('anvil-connect-express')

module.exports = class OIDCClientStore {
  constructor () {
    this.clients = {}
  }
  put (expressClient) {
    return Promise.resolve()
      .then(() => {
        this.clients[expressClient.client.issuer] = expressClient.client.serialize()
        return expressClient
      })
  }
  get (issuer) {
    return Promise.resolve()
      .then(() => {
        if (issuer in this.clients) {
          let clientConfig = JSON.parse(this.clients[issuer])
          return new OIDCExpressClient(clientConfig)
        } else {
          return null
        }
      })
  }
}
