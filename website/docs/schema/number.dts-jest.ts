import { ActiveClass, Schema } from '../../../src'

const simpleSchema = {
  floors: Schema.number
}

class BuildingSimple extends ActiveClass(simpleSchema) {}

// @dts-jest:group Basic creation
{
  // @dts-jest:fail
  new BuildingSimple()

  // @dts-jest:fail
  new BuildingSimple({})

  // @dts-jest:fail
  new BuildingSimple({ floors: '4' })

  // @dts-jest:fail
  new BuildingSimple({ floors: null })

  // @dts-jest:fail
  new BuildingSimple({ floors: 4, randomProp: 9 })

  // @dts-jest:pass
  new BuildingSimple({ floors: 4 })

  // @dts-jest:pass
  new BuildingSimple({ floors: 9 })
}

// // @dts-jest:group Basic assignment
// {
//   const lightbulb = new BuildingSimple({ floors: true })

//   // @dts-jest:pass
//   lightbulb.floors = false

//   // @dts-jest:fail
//   lightbulb.floors = 'true'
// }

// const configuredSchema = {
//   floors: Schema.number,
//   isEco: Schema.number({ default: false }),
//   isLED: Schema.number({ optional: true }), // or required: false,
//   isSmart: Schema.number({ optional: true, default: false })
// }

// console.log(configuredSchema.isSmart)

// class LightbulbConfigured extends ActiveClass(configuredSchema) {}

// // @dts-jest:group Configuration
// {
//   const lightbulb = new LightbulbConfigured({ floors: true })

//   // @dts-jest:fail
//   lightbulb.floors = undefined

//   // @dts-jest:fail
//   lightbulb.floors = null

//   // @dts-jest:fail
//   lightbulb.isEco = undefined

//   // @dts-jest:fail
//   lightbulb.isEco = null

//   // @dts-jest:pass
//   lightbulb.isLED = undefined

//   // @dts-jest:pass
//   lightbulb.isLED = null

//   // @dts-jest:fail
//   lightbulb.isSmart = undefined

//   // @dts-jest:pass
//   lightbulb.isSmart = null
// }