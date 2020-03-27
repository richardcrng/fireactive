class ActiveClassError extends Error {
  what: string
  why: string

  constructor({ what, why } : { what: string, why: string }) {
    super([what, why].join('. '))
    this.name = 'ActiveClassError'
    this.what = what
    this.why = why
  }
}

export default ActiveClassError