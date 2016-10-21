'use strict'
const ClientStore = require('./store')

class MultiRpClient {
  constructor (options = {}) {
    this.store = options.store || new ClientStore()
    this.localConfig = options.localConfig || {}
    this.debug = options.debug || console.log.bind(console)
  }

  /**
   * @method clientRegistrationConfig
   * @static
   * @param issuer {String} URL of the OIDC Provider / issuer.
   * @param redirectUris {Array<String>} List of allowed URIs to which the
   *   provider will redirect users after login etc.
   * @param [postLogoutUris] {Array<String>}
   * @return {Object} OIDC Client registration config options
   */
  static clientRegistrationConfig (issuer, redirectUris, postLogoutUris) {
    let clientName = `Solid OIDC Client for ${issuer}`
    let config = {
      client_name: clientName,
      // client_uri: 'https://github.com/solid/node-solid-server',
      // logo_uri: 'solid logo',
      // post_logout_redirect_uris: [ '...' ],
      default_max_age: 86400, // one day in seconds
      // trusted: true,
      // Type of token requests that this client is gonna make
      grant_types: ['authorization_code', 'implicit',
        'refresh_token', 'client_credentials'],
      issuer: issuer,
      redirect_uris: redirectUris,
      response_types: ['code', 'id_token token', 'code id_token token'],
      scope: 'openid profile'
    }
    if (postLogoutUris) {
      config.post_logout_redirect_uris = postLogoutUris
    }
    return config
  }

  clientForIssuer (issuer) {
    let debug = this.debug
    // var trustedClient = this.trustedClient.client
    // var baseRedirectUri = trustedClient.redirect_uri
    // var isTrustedClient = issuer === trustedClient.issuer
    return this.store.get(issuer)
      .then((client) => {
        debug('Client fetched for issuer.')
        if (client) {
          return client
        }
        debug('Client not present, initializing new client.')
        // client not already in store, create and register it
        // let redirectUri = this.redirectUriForIssuer(issuer,
        //   baseRedirectUri, isTrustedClient)
        // let clientConfig = {
        //   issuer: issuer,
        //   redirect_uri: redirectUri
        // }
        // return this.initClient(clientConfig, isTrustedClient)
      })
  }

  get localIssuer () {
    return this.localConfig.issuer
  }
}
module.exports = MultiRpClient
