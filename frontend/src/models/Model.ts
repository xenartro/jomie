interface ModelInterface {
  [key: string]: unknown;
}

export default class Model implements ModelInterface {
  [key: string]: unknown;
  constructor(data: Record<string, unknown>) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    }
  }
}
