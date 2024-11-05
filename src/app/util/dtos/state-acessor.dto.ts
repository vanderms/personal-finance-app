export interface StateFormAdapter<T extends boolean | string> {
  getValue(): T;
  setValue(x: T): void;
}
