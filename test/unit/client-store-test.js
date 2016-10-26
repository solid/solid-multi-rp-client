'use strict'

const test = require('tape')
const { ClientStore } = require('../../src/index')
const OIDCExpressClient = require('anvil-connect-express')

test('client store and retrieve test', t => {
  let issuer = 'https://oidc.example.com'
  let store = new ClientStore()
  let expressClient = new OIDCExpressClient({ issuer })
  store.put(expressClient)
    .then((storedClient) => {
      t.equal(storedClient, expressClient,
        'store.put() should return the stored client')
      return store.get(issuer)
    })
    .then(retrievedClient => {
      t.equal(retrievedClient.client.issuer, expressClient.client.issuer,
        'Should be able to retrieve the stored client')
      t.end()
    })
    .catch(err => { t.fail(err) })
})
