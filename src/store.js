const OIDCRelyingParty = require('oidc-rp')

module.exports = class OIDCClientStore {
  constructor () {
    this.clients = {}
  }
  put (client) {
    if (!client) {
      return Promise.reject(new Error('Cannot store null client'))
    }
    return Promise.resolve()
      .then(() => {
        let issuer = client.provider.url
        this.clients[issuer] = client.serialize()
        return client
      })
  }
  get (issuer) {
    return Promise.resolve()
      .then(() => {
        if (issuer in this.clients) {
          let clientConfig = JSON.parse(this.clients[issuer])
          return OIDCRelyingParty.from(clientConfig)
        } else {
          return null
        }
      })
  }
}
