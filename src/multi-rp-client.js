'use strict'
const ClientStore = require('./store')
const OIDCExpressClient = require('anvil-connect-express')
const DEFAULT_MAX_AGE = 86400

class MultiRpClient {
  constructor (options = {}) {
    this.store = options.store || new ClientStore()
    this.localConfig = options.localConfig || {}
    this.debug = options.debug || console.log.bind(console)
  }

  /**
   * @method clientForIssuer
   * @param issuerUri {string}
   * @returns {Promise<OIDCExpressClient>}
   */
  clientForIssuer (issuerUri) {
    let debug = this.debug
    return this.loadClient(issuerUri)
      .then(client => {
        debug('Client fetched for issuer.')
        if (client) {
          return client
        }
        debug('Client not present, initializing new client.')
        // client not already in store, create and register it
        let registrationConfig = this.registrationConfigFor(issuerUri)
        return this.registerClient(registrationConfig)
          .then(registeredClient => {
            // Store and return the newly registered client
            return this.persistClient(registeredClient)
          })
      })
  }

  /**
   * @method loadClient
   * @param issuerUri {string}
   * @returns {Promise<OIDCExpressClient>}
   */
  loadClient (issuerUri) {
    return this.store.get(issuerUri)
  }

  get localIssuer () {
    return this.localConfig.issuer
  }

  /**
   * @method persistClient
   * @param expressClient {OIDCExpressClient}
   * @return {Promise<OIDCExpressClient>}
   */
  persistClient (expressClient) {
    return this.store.put(expressClient)
  }

  /**
   * @method redirectUriForIssuer
   * @param issuer {string} Issuer URI
   * @param baseUri {string}
   * @returns {string}
   */
  redirectUriForIssuer (issuerUri, baseUri = this.localConfig.redirect_uri) {
    let issuerId = encodeURIComponent(issuerUri)
    return `${baseUri}/${issuerId}`
  }

  registerClient (config) {
    let debug = this.debug
    let oidcExpress = new OIDCExpressClient(config)
    debug.oidc('Running client.initProvider()...')
    return oidcExpress.client.initProvider()
      .then(() => {
        debug.oidc('Client discovered, JWKs retrieved')
        if (!oidcExpress.client.client_id) {
          // Register if you haven't already.
          debug.oidc('Registering client')
          return oidcExpress.client.register(config)
        } else {
          // Already registered.
          return oidcExpress
        }
      })
  }

  /**
   * @param issuer {string} URL of the OIDC Provider / issuer.
   * @param [config={}] {Object}
   */
  registrationConfigFor (issuer, config = {}) {
    let redirectUri = config.redirect_uri || this.redirectUriForIssuer(issuer)
    let defaultClientName = `Solid OIDC RP for ${issuer}`

    config.client_name = config.client_name || defaultClientName
    config.default_max_age = config.default_max_age || DEFAULT_MAX_AGE
    config.issuer = issuer
    config.grant_types = config.grant_types ||
      ['authorization_code', 'implicit', 'refresh_token', 'client_credentials']
    config.redirect_uris = config.redirect_uris || [ redirectUri ]
    config.response_types = config.response_types ||
      ['code', 'id_token token', 'code id_token token']
    config.scope = config.scope || 'openid profile'
    // client_uri: 'https://github.com/solid/node-solid-server',
    // logo_uri: 'solid logo',
    // post_logout_redirect_uris: [ '...' ],
    return config
  }
}
module.exports = MultiRpClient
