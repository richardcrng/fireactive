import { ActiveClass, Schema } from '../../../src'

const lightbulbSchema = {
  isOn: Schema.boolean
}

class Lightbulb extends ActiveClass(lightbulbSchema) {}

// @dts-jest:group Basic creation
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

  // @dts-jest:pass
  new Lightbulb({ isOn: true })

  // @dts-jest:pass
  new Lightbulb({ isOn: false })
}

// @dts-jest:group Basic assignment
{
  const lightbulb = new Lightbulb({ isOn: true })

  // @dts-jest:pass
  lightbulb.isOn = false

  // @dts-jest:fail
  lightbulb.isOn = 'true'
}