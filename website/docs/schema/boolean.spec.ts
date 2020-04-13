import { ActiveClass, Schema } from '../../../src'

const lightbulbSchema = {
  isOn: Schema.boolean
}

class Lightbulb extends ActiveClass(lightbulbSchema) {}

test('Runtime errors', () => {
  // @ts-ignore
  expect(() => new Lightbulb()).toThrow(`Could not construct Lightbulb. The required property 'isOn' is missing`)

  // @ts-ignore
  expect(() => new Lightbulb({})).toThrow(`Could not construct Lightbulb. The required property 'isOn' is missing`)

  // @ts-ignore
  expect(() => new Lightbulb({ isOn: 'yes' })).toThrow(`Could not construct Lightbulb. The property 'isOn' is of the wrong type`)

  // @ts-ignore
  expect(() => new Lightbulb({ isOn: null })).toThrow(`Could not construct Lightbulb. The property 'isOn' is of the wrong type`)
})

test('Runtime passes', () => {
  expect(() => new Lightbulb({ isOn: true })).not.toThrow()
  expect(() => new Lightbulb({ isOn: false })).not.toThrow()
})