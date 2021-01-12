class ImagesCache {
  constructor(images = []) {
    this.images = images;
  }

  hasImages(type, category) {
    if (!this.images) return false;

    const key = this.getKey(type, category);
    return !!(this.images[key] && this.images[key].length);
  }

  getImage(type, category) {
    const key = this.getKey(type, category);
    const images = this.images[key];

    if (!images || !images.length) return "";

    return images.pop();
  }

  setImages(type, category, images) {
    const key = this.getKey(type, category);
    this.images[key] = [...images];
  }

  getKey(type, category) {
    return `${type}-${category}`;
  }
}

export default new ImagesCache();
