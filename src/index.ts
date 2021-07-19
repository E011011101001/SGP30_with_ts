import * as fs from 'fs'
import { Gpio } from 'onoff'

import sleep from './utils'
import I2C from './i2c'

const GPIO_OFFSET = 458
const GPIO_SCL = 5
const GPIO_SDA = 6
const ADDR = 0x58

const
  INIT_AIR_QUALITY = Buffer.from('2003', 'hex'),
  MEASURE_AIR_QUALITY = Buffer.from('2008', 'hex'),
  MEASURE_TEST = Buffer.from('2032', 'hex')

async function main () {
  const scl = new Gpio(GPIO_OFFSET + GPIO_SCL, 'high')
  const sda = new Gpio(GPIO_OFFSET + GPIO_SDA, 'high')
  const i2c = new I2C(scl, sda)

  await i2c.send(ADDR, INIT_AIR_QUALITY, true)
  await sleep(1000)

  for (;;) {
    await i2c.send(ADDR, MEASURE_AIR_QUALITY)
    await sleep(12)
    const measureData = await i2c.recv(ADDR, 6)
    const co2 = (measureData[0] << 8) + measureData[1]
    fs.writeFileSync('/run/co2', co2.toString() + ' ppm')
    await sleep(1000)
  }
}

main()
