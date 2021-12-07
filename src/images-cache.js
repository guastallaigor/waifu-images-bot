class ImagesCache {
  constructor() {
    this.keys = new Map();
    this.images = new WeakMap();
  }

  addKey(payload) {
    const key = this.composeKey(payload);
    this.keys.set(key, payload);
    return payload;
  }

  hasImages(key) {
    return !!(this.images.has(key) && this.images.get(key)?.length);
  }

  getImage(key) {
    const images = this.images.get(key);
    if (!images || !images.length) return "";
    return images.pop();
  }

  setImages(key, images) {
    this.images.set(key, [...images]);
  }

  composeKey(payload) {
    if (!payload.type || !payload.category) return "";
    return `${payload.type}-${payload.category}`;
  }
}

export default new ImagesCache();
