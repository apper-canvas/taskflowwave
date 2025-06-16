import { toast } from 'react-toastify';

let accessibilitySettings = {
  keyboardNavigationEnabled: true,
  showFocusIndicators: true,
  showKeyboardHelp: true,
  screenReaderOptimized: false,
  highContrastMode: false
};

const settingsService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: ['Id', 'Name', 'default_view', 'default_priority', 'show_completed', 'sound_enabled']
      };

      const response = await apperClient.fetchRecords('setting', params);
      
      if (!response.success) {
        console.error(response.message);
        // Return default settings if fetch fails
        return {
          default_view: "today",
          default_priority: "medium", 
          show_completed: true,
          sound_enabled: true
        };
      }

      // Use first setting record or return defaults
      const settingsData = response.data?.[0] || {};
      return {
        default_view: settingsData.default_view || "today",
        default_priority: settingsData.default_priority || "medium",
        show_completed: settingsData.show_completed !== undefined ? settingsData.show_completed : true,
        sound_enabled: settingsData.sound_enabled !== undefined ? settingsData.sound_enabled : true
      };
    } catch (error) {
      console.error("Error fetching settings:", error);
      // Return default settings on error
      return {
        default_view: "today",
        default_priority: "medium",
        show_completed: true,
        sound_enabled: true
      };
    }
  },

  async getAccessibilitySettings() {
    const saved = localStorage.getItem('taskflow-accessibility-settings');
    if (saved) {
      accessibilitySettings = { ...accessibilitySettings, ...JSON.parse(saved) };
    }
    
    return { ...accessibilitySettings };
  },

  async updateAccessibilitySettings(newSettings) {
    accessibilitySettings = { ...accessibilitySettings, ...newSettings };
    localStorage.setItem('taskflow-accessibility-settings', JSON.stringify(accessibilitySettings));
    
    return { ...accessibilitySettings };
  },

  async update(newSettings) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // First get current settings to determine if we need to create or update
      const currentSettings = await this.getAll();
      
      // Try to fetch existing setting record
      const fetchParams = {
        Fields: ['Id', 'Name', 'default_view', 'default_priority', 'show_completed', 'sound_enabled'],
        PagingInfo: { Limit: 1 }
      };

      const fetchResponse = await apperClient.fetchRecords('setting', fetchParams);
      
      const updateRecord = {};
      if (newSettings.defaultView !== undefined) updateRecord.default_view = newSettings.defaultView;
      if (newSettings.defaultPriority !== undefined) updateRecord.default_priority = newSettings.defaultPriority;
      if (newSettings.showCompleted !== undefined) updateRecord.show_completed = newSettings.showCompleted;
      if (newSettings.soundEnabled !== undefined) updateRecord.sound_enabled = newSettings.soundEnabled;

      let response;
      
      if (fetchResponse.success && fetchResponse.data && fetchResponse.data.length > 0) {
        // Update existing record
        updateRecord.Id = fetchResponse.data[0].Id;
        const params = {
          records: [updateRecord]
        };
        response = await apperClient.updateRecord('setting', params);
      } else {
        // Create new record
        updateRecord.Name = "User Settings";
        const params = {
          records: [updateRecord]
        };
        response = await apperClient.createRecord('setting', params);
      }
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to save ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Settings saved successfully!');
          return { ...currentSettings, ...newSettings };
        }
      }
      
      throw new Error('Failed to save settings');
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to save settings");
      throw error;
    }
  }
};

export default settingsService;