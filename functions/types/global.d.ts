declare global {
  interface ErrorConstructor {
    captureStackTrace(targetObject: any, constructorOpt?: Function): void;
  }
}

export {};
