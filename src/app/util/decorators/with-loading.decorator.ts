export function WithLoading() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const loadingService = (this as any).loadingService;

      if (!loadingService) {
        console.warn(
          'LoadingService não encontrado. O decorator @WithLoading requer que a classe tenha uma propriedade loadingService.'
        );
        return originalMethod.apply(this, args);
      }

      try {
        loadingService.push();

        const result = await originalMethod.apply(this, args);

        return result;
      } finally {
        loadingService.pop();
      }
    };

    return descriptor;
  };
}
