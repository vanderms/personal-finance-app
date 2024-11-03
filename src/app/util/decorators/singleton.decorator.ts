export function Singleton() {
  return function <T extends { new (...args: any[]): any }>(constructor: T) {
    let instance: any;

    const newConstructor: any = function (...args: any[]) {
      if (!instance) {
        instance = new constructor(...args);

        Object.freeze(instance);
      }
      return instance;
    };

    return newConstructor;
  };
}
