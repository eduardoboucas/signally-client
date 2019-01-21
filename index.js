const deviceId = require('./lib/device-id')
const Light = require('./lib/light')
//const socket = require('socket.io-client')('http://macbook.local:3123')
const socket = require('socket.io-client')('https://tlights.herokuapp.com')

const light = new Light(deviceId)

socket
  .on('connect', () => {
    console.log('Connect')

    light.initialise().then(() => {
      socket.emit('register', deviceId)
    })
  })
  .on('disconnect', () => {
    console.log('Disconnect')
  })
  .on('event', data => {
    console.log('Data:', data)
  })
  .on('getState', requestId => {
    console.log('getState:', requestId)

    const state = light.getState()

    console.log(state)

    socket.emit('state', requestId, JSON.stringify(state))
  })
  .on('setState', (requestId, state) => {
    console.log('setState:', requestId, state)

    light.setState({
      amber: state.amber,
      green: state.green,
      red: state.red
    })
  })
