'use strict'

const test = require('tape')
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
