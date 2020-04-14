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

// @dts-jest:group Basic assignment
{
  const building = new BuildingSimple({ floors: 4 })

  // @dts-jest:pass
  building.floors = 5

  // @dts-jest:fail
  building.floors = '5'
}

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
//   const building = new LightbulbConfigured({ floors: true })

//   // @dts-jest:fail
//   building.floors = undefined

//   // @dts-jest:fail
//   building.floors = null

//   // @dts-jest:fail
//   building.isEco = undefined

//   // @dts-jest:fail
//   building.isEco = null

//   // @dts-jest:pass
//   building.isLED = undefined

//   // @dts-jest:pass
//   building.isLED = null

//   // @dts-jest:fail
//   building.isSmart = undefined

//   // @dts-jest:pass
//   building.isSmart = null
// }