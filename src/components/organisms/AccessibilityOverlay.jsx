import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotkeys } from 'react-hotkeys-hook';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { useKeyboardNavigation } from '@/components/providers/KeyboardNavigationProvider';
import { settingsService } from '@/services';

const shortcuts = [
  { keys: 'Tab', description: 'Navigate between elements' },
  { keys: 'Enter / Space', description: 'Activate focused element' },
  { keys: '↑ ↓ ← →', description: 'Navigate tasks and categories' },
  { keys: 'Ctrl/Cmd + Enter', description: 'Quick add task' },
  { keys: '/', description: 'Focus search' },
  { keys: 'n', description: 'New task (when not typing)' },
  { keys: 'c', description: 'Toggle task completion' },
  { keys: 'Delete', description: 'Delete focused task' },
  { keys: 'Escape', description: 'Clear focus/close dialogs' },
  { keys: '?', description: 'Show this help' }
];

const AccessibilityOverlay = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const { settings, updateSettings } = useKeyboardNavigation();

  useEffect(() => {
    checkFirstVisit();
  }, [settings]);

  const checkFirstVisit = async () => {
    if (settings && settings.showKeyboardHelp) {
      setIsFirstVisit(true);
      setShowOverlay(true);
    }
  };

  const handleClose = async () => {
    setShowOverlay(false);
    if (isFirstVisit) {
      await updateSettings({ showKeyboardHelp: false });
      setIsFirstVisit(false);
    }
  };

  const toggleKeyboard = async () => {
    await updateSettings({ 
      keyboardNavigationEnabled: !settings?.keyboardNavigationEnabled 
    });
  };

  const toggleFocusIndicators = async () => {
    await updateSettings({ 
      showFocusIndicators: !settings?.showFocusIndicators 
    });
  };

  useHotkeys('?', () => setShowOverlay(true), { preventDefault: true });
  useHotkeys('escape', () => setShowOverlay(false), { 
    preventDefault: true,
    enabled: showOverlay 
  });

  if (!settings) return null;

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ApperIcon name="Keyboard" className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Keyboard Navigation
                    </h2>
                    {isFirstVisit && (
                      <p className="text-sm text-gray-600">
                        Welcome! Here are the keyboard shortcuts available.
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Keyboard Shortcuts</h3>
                  <div className="space-y-3">
                    {shortcuts.map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {shortcut.description}
                        </span>
                        <div className="flex space-x-1">
                          {shortcut.keys.split(' / ').map((key, keyIndex) => (
                            <kbd
                              key={keyIndex}
                              className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono"
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Accessibility Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm text-gray-900">
                          Keyboard Navigation
                        </div>
                        <div className="text-xs text-gray-600">
                          Enable keyboard shortcuts and navigation
                        </div>
                      </div>
                      <button
                        onClick={toggleKeyboard}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.keyboardNavigationEnabled ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.keyboardNavigationEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm text-gray-900">
                          Focus Indicators
                        </div>
                        <div className="text-xs text-gray-600">
                          Show visual focus indicators
                        </div>
                      </div>
                      <button
                        onClick={toggleFocusIndicators}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.showFocusIndicators ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.showFocusIndicators ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                <Button variant="ghost" onClick={handleClose}>
                  {isFirstVisit ? 'Get Started' : 'Close'}
                </Button>
                <Button onClick={() => setShowOverlay(true)} className="hidden">
                  Press ? to show this help anytime
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AccessibilityOverlay;