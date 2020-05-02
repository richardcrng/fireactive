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
  
  test(description, async (done) => {
    expect.assertions(expectedAssertions)
    try {
      await cb()
    } catch (err) {
      expect(err).toBeInstanceOf(constructor)
      if (message) expect(err.message).toMatch(message)
      done()
    }
  })
}

export default testExpectError