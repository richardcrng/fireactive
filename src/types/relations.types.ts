import { ClassDefinition } from "./class.types";

export interface LazyHasOne<RelatingInstance, RelatedInstance> {
  (this: RelatingInstance): Promise<RelatedInstance | null>
}

export interface LazyHasMany<RelatingInstance, RelatedInstance> {
  (this: RelatingInstance): Promise<RelatedInstance[]>
}

export type Relatable<ThisClass extends ClassDefinition = ClassDefinition> = string | ThisClass