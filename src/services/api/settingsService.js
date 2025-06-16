let settings = null;
let accessibilitySettings = {
  keyboardNavigationEnabled: true,
  showFocusIndicators: true,
  showKeyboardHelp: true,
  screenReaderOptimized: false,
  highContrastMode: false
};

const settingsService = {
  async getAll() {
    if (!settings) {
      // Import the mock data
      const mockSettings = await import('../mockData/settings.json');
      settings = { ...mockSettings.default };
      
      // Load from localStorage if exists
      const saved = localStorage.getItem('taskflow-settings');
      if (saved) {
        settings = { ...settings, ...JSON.parse(saved) };
      }
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return { ...settings };
  },

  async getAccessibilitySettings() {
    const saved = localStorage.getItem('taskflow-accessibility-settings');
    if (saved) {
      accessibilitySettings = { ...accessibilitySettings, ...JSON.parse(saved) };
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
    return { ...accessibilitySettings };
  },

  async updateAccessibilitySettings(newSettings) {
    accessibilitySettings = { ...accessibilitySettings, ...newSettings };
    localStorage.setItem('taskflow-accessibility-settings', JSON.stringify(accessibilitySettings));
    
    await new Promise(resolve => setTimeout(resolve, 100));
    return { ...accessibilitySettings };
  },

async update(newSettings) {
    settings = { ...settings, ...newSettings };
    localStorage.setItem('taskflow-settings', JSON.stringify(settings));
    
    await new Promise(resolve => setTimeout(resolve, 100));
    return { ...settings };
  }
};

export default settingsService;