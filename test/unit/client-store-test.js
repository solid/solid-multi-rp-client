'use strict'

const test = require('tape')
const ClientStore = require('../../src/store')
const OIDCRelyingParty = require('oidc-rp')

test('client store test', t => {
  let issuer = 'https://oidc.example.com'
  let store = new ClientStore()
  let client = new OIDCRelyingParty({ provider: { url: issuer }})
  return store.put(client)
    .then((storedClient) => {
      t.equal(storedClient, client,
        'store.put() should return the stored client')
      t.end()
    })
    .catch(err => {
      console.log(err)
      t.fail(err)
    })
})
