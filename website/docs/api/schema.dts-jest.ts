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

// @dts-jest:group Simple configuration
{
  const userSchema = {
    name: Schema.string,
    age: Schema.number({ optional: true }),
    role: Schema.enum(['admin', 'basic'], { default: 'basic' }),
    isVerified: Schema.boolean({ required: false, default: false })
  }

  class User extends ActiveClass(userSchema) { }

  // @dts-jest:fail
  new User({})

  // @dts-jest:pass
  new User({ name: 'Richard' })
}