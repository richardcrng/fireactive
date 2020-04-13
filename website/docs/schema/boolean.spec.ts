import { ActiveClass, Schema } from '../../../src'
import { testDatabase } from '../../../src/utils/setupTestServer'

const lightbulbSchema = {
  isOn: Schema.boolean
}

class Lightbulb extends ActiveClass(lightbulbSchema) {}

// new Lightbulb()
// new Lightbulb({})
// new Lightbulb({ isOn: 'yes' })
// new Lightbulb({ isOn: null })
// new Lightbulb({ isOn: true })