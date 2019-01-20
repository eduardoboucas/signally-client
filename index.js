const sha1 = require('sha1')
const socket = require('socket.io-client')('http://localhost:3123')
const deviceId = sha1('0000000078a7f116')

socket
  .on('connect', () => {
    console.log('Connect')

    socket.emit('register', deviceId)
  })
  .on('disconnect', () => {
    console.log('Disconnect')
  })
  .on('event', data => {
    console.log('Data:', data)
  })
  .on('getState', requestId => {
    console.log('getState:', requestId)

    socket.emit('state', requestId, Date.now().toString())
  })
