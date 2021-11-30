export const applyDecorators = (decorators: any[]): any => {
  return (target: any, ...params: any[]): any => {
    return decorators.reduce((result, decorator): any => {
      return decorator.apply(null, [result, ...(params || [])]);
    }, target);
  };
};
