'use strict'

const test = require('tape')
const { ClientStore } = require('../../src/index')


test('client store and retrieve test', t => {
  let issuerUrl = 'https://oidc.example.com'
  let store = new ClientStore()
  let expressClient = {
    client: {
      issuer: issuerUrl
    }
  }
  store.put(expressClient)
    .then((storedClient) => {
      t.equal(storedClient, expressClient,
        'store.put() should return the stored client')
      return store.get(issuerUrl)
    })
    .then(retrievedClient => {
      t.equals(retrievedClient, expressClient,
        'Should be able to retrieve the stored client')
      t.end()
    })
})
