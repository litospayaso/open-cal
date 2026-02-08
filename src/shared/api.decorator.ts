/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

export const api = function PluginDecorator(apis: { [key: string]: any }) {
  return (ctor: Function) => {
    ctor.prototype.api = {};
    Object.entries(apis).forEach(([key, value]) => (ctor.prototype.api[key] = value));
  };
};
