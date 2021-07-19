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

const scl = new Gpio(GPIO_OFFSET + GPIO_SCL, 'high')
const sda = new Gpio(GPIO_OFFSET + GPIO_SDA, 'high')

const i2c = new I2C(scl, sda)

async function main () {
  await i2c.send(ADDR, INIT_AIR_QUALITY)
  await sleep(10)
  await i2c.send(ADDR, MEASURE_TEST)
  console.log(await i2c.recv(ADDR, 3))
}

