import axios from "axios";

class Http {
  constructor() {
    this.instance = axios.create({
      baseURL: "https://api.waifu.pics/many",
      timeout: 1000,
    });
  }
}

export default new Http();
