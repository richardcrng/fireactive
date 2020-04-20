import { Schema, ActiveClass } from "../../../src"

// @dts-jest:group Basic example
{
  const userSchema = {
    name: Schema.string,
    age: Schema.number,
    role: Schema.enum(['admin', 'basic']),
    isVerified: Schema.boolean
  }

  class User extends ActiveClass(userSchema) { }

  // @dts-jest:fail
  new User({
    name: 'Joe Bloggs',
    age: 42
  })

  new User({
    name: 'Joe Blogs',
    age: 42,
    // @dts-jest:fail
    role: 'elite hacker',
    // @dts-jest:fail
    isVerified: 'true'
  })

  // @dts-jest:pass
  new User({
    name: 'Joe Bloggs',
    age: 42,
    role: 'admin',
    isVerified: true
  })
}