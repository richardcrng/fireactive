import { ClassDefinition } from "./class.types";

export interface LazyHasOne<RelatingClass extends ClassDefinition, RelatedClass extends ClassDefinition> {
  (this: InstanceType<RelatingClass>): Promise<InstanceType<RelatedClass> | null>
}

export interface LazyHasMany<RelatingClass extends ClassDefinition, RelatedClass extends ClassDefinition> {
  (this: InstanceType<RelatingClass>): Promise<InstanceType<RelatedClass>[]>
}

export type Relatable<ThisClass extends ClassDefinition = ClassDefinition> = string | ThisClass