// @ts-nocheck

import { ActiveClass, Schema } from '../../../src'

const lightbulbSchema = {
  isOn: Schema.boolean
}

class Lightbulb extends ActiveClass(lightbulbSchema) {}

// @dts-jest:fail
new Lightbulb()

// @dts-jest:fail
new Lightbulb({})