interface WhyWhatError {
  /**
   * **What** operation/update failed
   */
  what: string

  /**
   * **Why** the operation/update failed
   */
  why: string
}

class ActiveClassError extends Error {
  /**
   * **What** operation/update failed
   */
  what: string

  /**
   * **Why** the operation/update failed
   */
  why?: string

  /**
   * 
   * @param param0.what - What operation failed
   * @param param0.why - Why the operation failed 
   */
  constructor({ what = 'Operation failed', why } : Partial<WhyWhatError>) {
    const message = why ? [what, why].join('. ') : what
    super(message)
    this.name = 'ActiveClassError'
    this.what = what
    this.why = why
  }

  static from(err: Error, details: Partial<WhyWhatError>) {
    const why = err instanceof ActiveClassError
      ? err.why
      : err.message

    return new ActiveClassError({ why, ...details })
  }
}

export default ActiveClassError