import { ActiveClass, Schema } from '../../../src'

const simpleSchema = {
  species: Schema.string
}

class DinosaurSimple extends ActiveClass(simpleSchema) {}

// @dts-jest:group Basic creation
{
  // @dts-jest:fail
  new DinosaurSimple()

  // @dts-jest:fail
  new DinosaurSimple({})

  // @dts-jest:fail
  new DinosaurSimple({ species: true })

  // @dts-jest:fail
  new DinosaurSimple({ species: null })

  // @dts-jest:fail
  new DinosaurSimple({ species: 'Diplodocus', randomProp: 'Triceratops' })

  // @dts-jest:pass
  new DinosaurSimple({ species: 'Diplodocus' })

  // @dts-jest:pass
  new DinosaurSimple({ species: 'Triceratops' })
}

// // @dts-jest:group Basic assignment
// {
//   const building = new DinosaurSimple({ species: 4 })

//   // @dts-jest:pass
//   building.species = 5

//   // @dts-jest:fail
//   building.species = '5'
// }

// const configuredSchema = {
//   species: Schema.number,
//   doors: Schema.number({ default: 1 }),
//   rooms: Schema.number({ optional: true }), // or required: false,
//   chimneys: Schema.number({ optional: true, default: 2 })
// }

// class LightbulbConfigured extends ActiveClass(configuredSchema) {}

// // @dts-jest:group Configuration
// {
//   const building = new LightbulbConfigured({ species: 4 })

//   // @dts-jest:fail
//   building.species = undefined

//   // @dts-jest:fail
//   building.species = null

//   // @dts-jest:fail
//   building.doors = undefined

//   // @dts-jest:fail
//   building.doors = null

//   // @dts-jest:pass
//   building.rooms = undefined

//   // @dts-jest:pass
//   building.rooms = null

//   // @dts-jest:fail
//   building.chimneys = undefined

//   // @dts-jest:pass
//   building.chimneys = null
// }