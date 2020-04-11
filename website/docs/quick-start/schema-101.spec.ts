import { Schema } from '../../../src/'

const userSchema = {
  name: Schema.string,  // users must have a name
  age: Schema.number({ optional: true }), // age is optional
  role: Schema.enum(['admin', 'basic']), // role must be 'admin' or 'basic'
  isVerified: Schema.boolean({ default: false }) // defaults to false
}

describe('Writing a basic schema', () => {
  it('runs and compiles without any errors', () => {
    expect(userSchema).toBeDefined()
  })
})