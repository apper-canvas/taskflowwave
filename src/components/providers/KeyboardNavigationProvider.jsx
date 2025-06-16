import { createContext, useContext, useState, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { settingsService } from '@/services';

const KeyboardNavigationContext = createContext();

export const useKeyboardNavigation = () => {
  const context = useContext(KeyboardNavigationContext);
  if (!context) {
    throw new Error('useKeyboardNavigation must be used within KeyboardNavigationProvider');
  }
  return context;
};

const KeyboardNavigationProvider = ({ children }) => {
  const [focusedElement, setFocusedElement] = useState(null);
  const [keyboardEnabled, setKeyboardEnabled] = useState(true);
  const [showFocusIndicators, setShowFocusIndicators] = useState(true);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settingsData = await settingsService.getAccessibilitySettings();
      setSettings(settingsData);
      setKeyboardEnabled(settingsData.keyboardNavigationEnabled);
      setShowFocusIndicators(settingsData.showFocusIndicators);
    } catch (error) {
      console.warn('Failed to load accessibility settings:', error);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const updatedSettings = await settingsService.updateAccessibilitySettings(newSettings);
      setSettings(updatedSettings);
      setKeyboardEnabled(updatedSettings.keyboardNavigationEnabled);
      setShowFocusIndicators(updatedSettings.showFocusIndicators);
    } catch (error) {
      console.warn('Failed to update accessibility settings:', error);
    }
  };

  const registerFocusableElement = (element, id) => {
    if (element && keyboardEnabled) {
      element.setAttribute('data-keyboard-id', id);
      element.setAttribute('tabindex', '0');
      
      if (showFocusIndicators) {
        element.style.outline = 'none';
        element.addEventListener('focus', () => {
          element.style.boxShadow = '0 0 0 2px #3B82F6';
          setFocusedElement(id);
        });
        element.addEventListener('blur', () => {
          element.style.boxShadow = '';
          setFocusedElement(null);
        });
      }
    }
  };

  const focusElement = (id) => {
    const element = document.querySelector(`[data-keyboard-id="${id}"]`);
    if (element) {
      element.focus();
      setFocusedElement(id);
    }
  };

  const getNextFocusableElement = (currentId, direction = 'next') => {
    const focusableElements = Array.from(document.querySelectorAll('[data-keyboard-id]'));
    const currentIndex = focusableElements.findIndex(el => el.getAttribute('data-keyboard-id') === currentId);
    
    if (currentIndex === -1) return null;
    
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % focusableElements.length;
    } else {
      nextIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
    }
    
    return focusableElements[nextIndex]?.getAttribute('data-keyboard-id');
  };

  const value = {
    focusedElement,
    keyboardEnabled,
    showFocusIndicators,
    settings,
    registerFocusableElement,
    focusElement,
    getNextFocusableElement,
    updateSettings,
    setFocusedElement
  };

  return (
    <KeyboardNavigationContext.Provider value={value}>
      {children}
    </KeyboardNavigationContext.Provider>
  );
};

export default KeyboardNavigationProvider;