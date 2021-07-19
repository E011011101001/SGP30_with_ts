import { BinaryValue, Gpio } from 'onoff'
import { Buffer } from 'buffer'
import assert = require('assert')

import sleep from './utils'

const T = 0
const ACK = 0


export default class i2c {
  private _scl: Gpio
  private _sda: Gpio


  constructor (scl: Gpio, sda: Gpio) {
    this._scl = scl
    this._sda = sda

    this._scl.setDirection('out')
    this._scl.writeSync(1)
    this._sda.setDirection('out')
    this._sda.writeSync(1)
  }

  private async _S () {
    this._scl.setDirection('out')
    this._scl.writeSync(1)
    this._sda.setDirection('out')
    this._sda.writeSync(1)
    await sleep(T)

    this._sda.writeSync(0)
    await sleep(T)
    this._scl.writeSync(0)
    await sleep(T)
  }

  private async _P () {
    if (this._sda.direction() === 'in') {
      this._sda.setDirection('out')
    }

    this._sda.writeSync(0)
    this._scl.writeSync(1)
    await sleep(T)
    this._sda.writeSync(1)
    await sleep(T)
  }
  
  private async _get_ack (): Promise<BinaryValue> {
    if (this._sda.direction() !== 'in') {
      this._sda.setDirection('in')
    }

    this._scl.writeSync(1)
    await sleep(T)
    const ack = this._sda.readSync()
    this._scl.writeSync(0)
    await sleep(T)

    return ack
  }

  private async _send_byte (byte: Buffer): Promise<BinaryValue> {
    assert(byte.length === 1)

    if (this._sda.direction() !== 'out') {
      this._sda.setDirection('out')
    }

    for (let i = 7; i >= 0; --i) {
      const bitToSend = (byte[0] & (1 << i)) ? 1 : 0
      this._sda.writeSync(bitToSend)
      this._scl.writeSync(1)
      await sleep(T)
      this._scl.writeSync(0)
      await sleep(T)
    }

    return (await this._get_ack())
  }

  private async _recv_byte (): Promise<Buffer> {
    if (this._sda.direction() !== 'in') {
      this._sda.setDirection('in')
    }

    const recvByte = Buffer.alloc(1, 0)

    for (let i = 0; i < 8; ++i) {
      this._scl.writeSync(1)
      await sleep(T)
      const recvBit = this._sda.readSync()
      recvByte[0] = (recvByte[0] << 1) + recvBit
      this._scl.writeSync(0)
      await sleep(T)
    }

    // send ack
    this._sda.setDirection('out')
    this._sda.writeSync(ACK)
    this._scl.writeSync(1)
    await sleep(T)
    this._scl.writeSync(0)
    await sleep(T)

    return recvByte
  }

  public async send (addr: number, command: Buffer, justCommand = false): Promise<void> {
    assert((addr < 0b0111_1111 ), 'Address should be 7 bits')
    await this._S()
    await this._send_byte(Buffer.of((addr << 1) & 0b1111_1110))

    for (let i = 0; i < command.length; ++i) {
      await this._send_byte(Buffer.of(command[i]))
    }

    if (justCommand) {
      await this._P()
    }
  }

  public async recv (addr: number, dataBytes: number): Promise<Buffer> {
    assert((addr < 0b0111_1111 ), 'Address should be 7 bits')
    await this._S()
    await this._send_byte(Buffer.of((addr << 1) | 0b0000_0001))

    const recvData = Buffer.alloc(dataBytes)
    for (let i = 0; i < dataBytes; ++i) {
      recvData[i] = (await this._recv_byte())[0]
    }
    await this._P()
    return recvData
  }
}
