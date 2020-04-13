import { ActiveClass, Schema } from '../../../src'

const lightbulbSchema = {
  isOn: Schema.boolean
}

class Lightbulb extends ActiveClass(lightbulbSchema) {}

// @dts-jest:group Static errors
{
  // @dts-jest:fail
  new Lightbulb()

  // @dts-jest:fail
  new Lightbulb({})

  // @dts-jest:fail
  new Lightbulb({ isOn: 'yes' })

  // @dts-jest:fail
  new Lightbulb({ isOn: null })

  // @dts-jest:fail
  new Lightbulb({ isOn: true, randomProp: true })
}

// @dts-jest:group works
{
  // @dts-jest:pass
  new Lightbulb({ isOn: true })

  // @dts-jest:pass
  new Lightbulb({ isOn: false })
}