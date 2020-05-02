import { Schema, ActiveClass } from "../../../../src"


const schema = {
  name: Schema.string,
  age: Schema.number
}

class Person extends ActiveClass(schema) { }

// @dts-jest:group Basic example
{
  // @dts-jest:pass
  Person.create({ name: 'Helen', age: 27 })

  // @dts-jest:fail
  Person.create({ name: 'Helen' })

  // @dts-jest:fail
  Person.create({ name: 'Helen', age: '27' })
}
