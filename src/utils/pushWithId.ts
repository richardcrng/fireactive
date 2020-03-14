import firebase from 'firebase'

async function pushWithId(ref: firebase.database.Reference, data: object, idKey = '_id'): Promise<string> {
  const childRef = ref.push()
  if (childRef.key) {
    const dataToPush = { ...data, [idKey]: childRef.key }
    await ref.child(childRef.key as string).set(dataToPush)
    return childRef.key
  } else {
    throw new Error('Key not produced: did you connect to the database?')
  }
}

export default pushWithId