'use strict'

const test = require('tape')
const OIDCExpressClient = require('anvil-connect-express')
const { ClientStore, MultiRpClient } = require('../../src/index')

test('MultiRpClient constructor test', t => {
  let store = new ClientStore()
  let localIssuer = 'https://oidc.example.com'
  let localConfig = {
    issuer: localIssuer
  }
  let options = { store, localConfig }
  let multiClient = new MultiRpClient(options)
  t.equal(multiClient.store, store)
  t.equal(multiClient.localConfig, localConfig)
  t.equal(multiClient.localIssuer, localIssuer)
  t.end()
})

test('MultiRpClient.clientRegistrationConfig() test', t => {
  let issuer = 'https://oidc.example.com'
  let redirectUris = [ 'https://localhost:8443/callback' ]
  let postLogoutUris = [ 'https://localhost:8443/signed_out.html' ]
  let regConfig =
    MultiRpClient.clientRegistrationConfig(issuer, redirectUris, postLogoutUris)
  t.ok(regConfig.client_name)
  // Check for other claims here...
  t.equal(regConfig.issuer, issuer)
  t.equal(regConfig.redirect_uris, redirectUris)
  t.equal(regConfig.post_logout_redirect_uris, postLogoutUris)
  t.end()
})

test('MultiRpClient.clientForIssuer() - client exists in store test', t => {
  let issuer = 'https://oidc.example.com'
  let store = new ClientStore()
  let expressClient = new OIDCExpressClient({ issuer })
  let multiClient
  store.put(expressClient)
    .then(() => {
      multiClient = new MultiRpClient({ store })
      return multiClient.clientForIssuer(issuer)
    })
    .then(retrievedClient => {
      t.equal(retrievedClient, expressClient,
        'If client exists in store, clientForIssuer() should retrieve it')
      t.end()
    })
    .catch(err => { t.fail(err) })
})
