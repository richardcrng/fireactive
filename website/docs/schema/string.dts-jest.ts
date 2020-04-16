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

// @dts-jest:group Basic assignment
{
  const dinosaur = new DinosaurSimple({ species: 'Diplodocus' })

  // @dts-jest:pass
  dinosaur.species = 'T-Rex'

  // @dts-jest:fail
  dinosaur.species = 7
}

// const configuredSchema = {
//   species: Schema.number,
//   doors: Schema.number({ default: 1 }),
//   rooms: Schema.number({ optional: true }), // or required: false,
//   chimneys: Schema.number({ optional: true, default: 2 })
// }

// class LightbulbConfigured extends ActiveClass(configuredSchema) {}

// // @dts-jest:group Configuration
// {
//   const dinosaur = new LightbulbConfigured({ species: 4 })

//   // @dts-jest:fail
//   dinosaur.species = undefined

//   // @dts-jest:fail
//   dinosaur.species = null

//   // @dts-jest:fail
//   dinosaur.doors = undefined

//   // @dts-jest:fail
//   dinosaur.doors = null

//   // @dts-jest:pass
//   dinosaur.rooms = undefined

//   // @dts-jest:pass
//   dinosaur.rooms = null

//   // @dts-jest:fail
//   dinosaur.chimneys = undefined

//   // @dts-jest:pass
//   dinosaur.chimneys = null
// }