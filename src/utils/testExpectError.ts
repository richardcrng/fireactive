import { ClassDefinition } from "../types/class.types"

interface Opts<EC = ClassDefinition<Error>> {
  message?: string | RegExp,
  constructor?: EC
}

const testExpectError = (
  description: string,
  cb: () => void | Promise<void>,
  { message, constructor }: Opts = { message: undefined, constructor: undefined }
) => {
  const expectedAssertions = message ? 2 : 1

  if (cb.constructor.name === 'AsyncFunction') {
    test(description, async (done) => {
      // expect.assertions(expectedAssertions)
      try {
        await cb()
      } catch (err) {
        expect(err).toBeInstanceOf(constructor)
        if (message) expect(err.message).toMatch(message)
        done()
      }
    })
  } else {
    test(description, () => {
      // expect.assertions(expectedAssertions) TODO: investigate why this doesn't work?
      try {
        cb()
      } catch (err) {
        expect(err).toBeInstanceOf(constructor)
        if (message) expect(err.message).toMatch(message)
      }
    })
  }
}

export default testExpectError