import { EventEmitter } from 'events'
import tune from '../assets/sound/ph2.m4a'
import * as c from './constants'
let allBeatCount = 1
let beatCount = 1
let barCount = 1
let qBeatCount = 1
let allQBeatCount = 1

const beatTime = c.beatTime / 1000

class Events {
  constructor () {
    this.audio = new Audio(tune)
    this.audio.play()

    this.delta = this.audio.currentTime - beatTime
    this.emitter = new EventEmitter()
  }

  update () {
    const time = this.audio.currentTime
    const currentQBeat = Math.floor(time / (beatTime / 4)) + 4
    const currentBeat = Math.floor(time / beatTime) + 1

    if (currentQBeat > allQBeatCount) {
      qBeatCount++
      allQBeatCount++

      if (qBeatCount > 16) {
        qBeatCount = 1
      }

      this.emitter.emit('quarter-beat')

      if (qBeatCount % 2 === 0) {
        this.emitter.emit('half-beat')

        if (barCount >= 23 && qBeatCount !== 2 && qBeatCount !== 10) {
          this.emitter.emit('funky-hat')
        }
      }
    }
    if (currentBeat > allBeatCount) {
      allBeatCount = currentBeat
      this.emitter.emit('beat')
      beatCount++

      if (beatCount > 4) {
        beatCount = 1
      }

      if (beatCount % 2 === 0) {
        this.emitter.emit('half-bar')
      }

      if (beatCount === 1) {
        barCount++
        this.emitter.emit('bar')

        if (barCount % 2 === 0) {
          this.emitter.emit('bar-2')
        }

        if (barCount === 16) {
          this.emitter.emit('prog-1')
        }

        if (barCount === 23) {
          this.emitter.emit('prog-2')
        }
      }

      if (allBeatCount === 34) {
        this.emitter.emit('clap')
      }
      if (barCount > 8) {
        if (beatCount === 2 || beatCount === 4) {
          this.emitter.emit('clap')
        }
      }

      // console.log(beatCount, allBeatCount, barCount)
    }
  }
}

export default new Events()