import settingsData from '../mockData/settings.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let settings = { ...settingsData };

const settingsService = {
  async get() {
    await delay(100);
    return { ...settings };
  },

  async update(updateData) {
    await delay(150);
    settings = {
      ...settings,
      ...updateData
    };
    return { ...settings };
  }
};

export default settingsService;