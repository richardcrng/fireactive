// https://medium.com/@andrei.pfeiffer/jest-matching-objects-in-array-50fe2f4d6b98
// https://medium.com/javascript-in-plain-english/jest-how-to-use-extend-with-typescript-4011582a2217

export { };
declare global {
  namespace jest {
    interface Matchers<R, T> {
      toContainObject(object: any): R;
    }
  }
}

expect.extend({
  toContainObject(received, argument) {

    const pass = this.equals(received,
      expect.arrayContaining([
        expect.objectContaining(argument)
      ])
    )

    if (pass) {
      return {
        message: () => (`expected ${this.utils.printReceived(received)} not to contain object ${this.utils.printExpected(argument)}`),
        pass: true
      }
    } else {
      return {
        message: () => (`expected ${this.utils.printReceived(received)} to contain object ${this.utils.printExpected(argument)}`),
        pass: false
      }
    }
  }
})