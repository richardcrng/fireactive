export { };
declare global {
  namespace jest {
    interface Matchers<R, T> {
      /**
       * Used when you want to check that two objects
       * serialize to equivalent JSON. This matcher
       * converts with `JSON.stringify` and parses
       * again with `JSON.parse`.
       */
      toEqSerialize(expected: any): R;
    }
  }
}

const JSONify = (target: any) => JSON.parse(JSON.stringify(target))

expect.extend({
  toEqSerialize(received, argument) {

    try {
      expect(JSONify(received)).toEqual(JSONify(argument))
      return {
        message: () => (`expected ${this.utils.printReceived(received)} not to equivalently serialize like ${this.utils.printExpected(argument)}`),
        pass: true
      }
    } catch (err) {
      return {
        message: () => (`expected ${this.utils.printReceived(received)} to equally serialize like ${this.utils.printExpected(argument)}`),
        pass: false
      }
    }

    // if (pass) {
    //   return {
    //     message: () => (`expected ${this.utils.printReceived(received)} not to equally serialize as ${this.utils.printExpected(argument)}`),
    //     pass: true
    //   }
    // } else {
    //   return {
    //     message: () => (`expected ${this.utils.printReceived(received)} to equally serialize as ${this.utils.printExpected(argument)}`),
    //     pass: false
    //   }
    // }
  }
})