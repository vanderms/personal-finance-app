export interface StateAcessor<T extends boolean | string> {
  getValue(): T;
  setValue(x: T): void;
  getErrors(): Set<string>;
}
