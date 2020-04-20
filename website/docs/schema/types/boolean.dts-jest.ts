import { ActiveClass, Schema } from '../../../../src'

const simpleSchema = {
  isOn: Schema.boolean
}

class LightbulbSimple extends ActiveClass(simpleSchema) {}

// @dts-jest:group Basic creation
{
  // @dts-jest:fail
  new LightbulbSimple()

  // @dts-jest:fail
  new LightbulbSimple({})

  // @dts-jest:fail
  new LightbulbSimple({ isOn: 'yes' })

  // @dts-jest:fail
  new LightbulbSimple({ isOn: null })

  // @dts-jest:fail
  new LightbulbSimple({ isOn: true, randomProp: true })

  // @dts-jest:pass
  new LightbulbSimple({ isOn: true })

  // @dts-jest:pass
  new LightbulbSimple({ isOn: false })
}

// @dts-jest:group Basic assignment
{
  const lightbulb = new LightbulbSimple({ isOn: true })

  // @dts-jest:pass
  lightbulb.isOn = false

  // @dts-jest:fail
  lightbulb.isOn = 'true'
}

const configuredSchema = {
  isOn: Schema.boolean,
  isEco: Schema.boolean({ default: false }),
  isLED: Schema.boolean({ optional: true }), // or required: false,
  isSmart: Schema.boolean({ optional: true, default: false })
}

console.log(configuredSchema.isSmart)

class LightbulbConfigured extends ActiveClass(configuredSchema) {}

// @dts-jest:group Configuration
{
  const lightbulb = new LightbulbConfigured({ isOn: true })

  // @dts-jest:fail
  lightbulb.isOn = undefined

  // @dts-jest:fail
  lightbulb.isOn = null

  // @dts-jest:fail
  lightbulb.isEco = undefined

  // @dts-jest:fail
  lightbulb.isEco = null

  // @dts-jest:pass
  lightbulb.isLED = undefined

  // @dts-jest:pass
  lightbulb.isLED = null

  // @dts-jest:fail
  lightbulb.isSmart = undefined

  // @dts-jest:pass
  lightbulb.isSmart = null
}