import { ActiveClass, SomeClass } from "../../types/class.types";
import { RecordSchema } from "../../types/schema.types";


const classes: { [className: string]: SomeClass } = {}

const retrieve = (className: string): ActiveClass<RecordSchema> => {
  if (classes[className]) {
    return classes[className] as ActiveClass<RecordSchema>
  } else {
    throw new Error('Could not find class')
  }
}

export const store = (ActiveClass: SomeClass, key?: string): void => {
  classes[key || ActiveClass.name] = ActiveClass
}

export const findById = (
  className: string,
  cb: () => string
) => async () => {
  return await retrieve(className).findById(cb())
}

export const findByIds = (
  className: string,
  cb: () => string[]
) => async () => {
  const targetClass = retrieve(className)
  const promises = cb().map(id => targetClass.findById(id))
  // @ts-ignore
  const results = await Promise.all(promises) as (InstanceType<typeof targetClass> | null)[]
  return results.filter((result: any) => result) as InstanceType<typeof targetClass>[]
}


