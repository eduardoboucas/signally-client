const {
  LED_AMBER,
  LED_GREEN,
  LED_RED,
  STATE_BLINK_1,
  STATE_ON,
  STATE_OFF
} = require('./constants')
const gpio = require('rpi-gpio')
const gpiop = gpio.promise

class Light {
  constructor(id) {
    this.id = id
    this.state = {
      [LED_AMBER]: STATE_OFF,
      [LED_GREEN]: STATE_OFF,
      [LED_RED]: STATE_OFF
    }
  }

  getState() {
    return {
      amber: this.state[LED_AMBER],
      green: this.state[LED_GREEN],
      red: this.state[LED_RED]
    }
  }

  initialise() {
    console.log('Initialising...')

    gpio.setMode(gpio.MODE_BCM)

    return Promise.all([
      gpiop.setup(LED_AMBER, gpio.DIR_OUT),
      gpiop.setup(LED_GREEN, gpio.DIR_OUT),
      gpiop.setup(LED_RED, gpio.DIR_OUT)
    ]).then(() => {
      console.log('GPIO Setup complete')

      return Promise.all([
        this.setLightState(LED_AMBER, STATE_ON),
        this.setLightState(LED_GREEN, STATE_ON),
        this.setLightState(LED_RED, STATE_ON)
      ])
    }).then(() => {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, 1000)
      })
    }).then(() => {
      return Promise.all([
        this.setLightState(LED_AMBER, STATE_OFF),
        this.setLightState(LED_GREEN, STATE_OFF),
        this.setLightState(LED_RED, STATE_OFF)
      ])      
    })
  }

  setLightState(light, state) {
    return gpiop.write(light, state)
  }

  setState({
    amber = STATE_OFF,
    green = STATE_OFF,
    red = STATE_OFF
  }) {
    const commands = [
      this.setLightState(LED_AMBER, amber),
      this.setLightState(LED_GREEN, green),
      this.setLightState(LED_RED, red)
    ]

    return Promise.all(commands).then(() => {
      this.state = {
        [LED_AMBER]: amber,
        [LED_GREEN]: green,
        [LED_RED]: red
      }

      return this.state
    })
  }
}

module.exports = Light
