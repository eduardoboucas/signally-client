const fs = require('fs')
const sha1 = require('sha1')

const data = fs.readFileSync('/proc/cpuinfo', 'utf8')
const lines = data.split('\n')

module.exports = sha1(lines[12].split(':')[1].trim())
