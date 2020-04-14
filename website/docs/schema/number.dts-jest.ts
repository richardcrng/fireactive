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

const configuredSchema = {
  floors: Schema.number,
  doors: Schema.number({ default: 1 }),
  rooms: Schema.number({ optional: true }), // or required: false,
  chimneys: Schema.number({ optional: true, default: 2 })
}

class LightbulbConfigured extends ActiveClass(configuredSchema) {}

// @dts-jest:group Configuration
{
  const building = new LightbulbConfigured({ floors: 4 })

  // @dts-jest:fail
  building.floors = undefined

  // @dts-jest:fail
  building.floors = null

  // @dts-jest:fail
  building.doors = undefined

  // @dts-jest:fail
  building.doors = null

  // @dts-jest:pass
  building.rooms = undefined

  // @dts-jest:pass
  building.rooms = null

  // @dts-jest:fail
  building.chimneys = undefined

  // @dts-jest:pass
  building.chimneys = null
}