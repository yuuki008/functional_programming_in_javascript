/**
 * カリー化関数
 * @param fn カリー化する関数
 * @returns カリー化された関数
 */
export const curry = <T extends (...args: any[]) => any>(fn: T) => {
  return function curried(...args: any[]): any {
    if (args.length >= fn.length) {
      return fn(...args);
    } else {
      return (...moreArgs: any[]) => curried(...args, ...moreArgs);
    }
  };
};
