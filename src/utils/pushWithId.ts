import firebase from 'firebase'

async function pushWithId(ref: firebase.database.Reference, data: object, idKey = '_id') {
  const childRef = ref.push()
  return await ref.child(childRef.key as string).set({ ...data, [idKey]: childRef.key })
}

export default pushWithId