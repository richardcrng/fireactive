import { ActiveClass, Schema } from '../../../../../src'

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

const configuredSchema = {
  species: Schema.string,
  roar: Schema.string({ default: 'RAWR' }),
  name: Schema.string({ optional: true }), // or required: false,
  home: Schema.string({ optional: true, default: 'Earth' })
}

class DinosaurConfigured extends ActiveClass(configuredSchema) {}

// @dts-jest:group Configuration
{
  const dinosaur = new DinosaurConfigured({ species: 'Diplodocus' })

  // @dts-jest:fail
  dinosaur.species = undefined

  // @dts-jest:fail
  dinosaur.species = null

  // @dts-jest:fail
  dinosaur.roar = undefined

  // @dts-jest:fail
  dinosaur.roar = null

  // @dts-jest:pass
  dinosaur.name = undefined

  // @dts-jest:pass
  dinosaur.name = null

  // @dts-jest:fail
  dinosaur.home = undefined

  // @dts-jest:pass
  dinosaur.home = null
}