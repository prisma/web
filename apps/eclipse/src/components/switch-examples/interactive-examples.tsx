"use client";

import { useState } from "react";
import { Switch } from "@prisma/eclipse";

export function ControlledSwitchExample() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Switch
          id="controlled"
          checked={enabled}
          onCheckedChange={setEnabled}
        />
        <label htmlFor="controlled" className="text-sm font-medium cursor-pointer">
          Feature enabled
        </label>
      </div>
      <p className="text-sm text-foreground-neutral-weak">
        Status: {enabled ? "On" : "Off"}
      </p>
    </div>
  );
}

export function SwitchFormExample() {
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    analytics: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Settings:", settings);
    alert(`Settings saved:\nDark Mode: ${settings.darkMode}\nNotifications: ${settings.notifications}\nAnalytics: ${settings.analytics}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <h3 className="text-lg font-semibold">App Settings</h3>

      <div className="flex items-center justify-between">
        <label htmlFor="dark-mode" className="text-sm font-medium cursor-pointer">
          Dark Mode
        </label>
        <Switch
          id="dark-mode"
          checked={settings.darkMode}
          onCheckedChange={(checked) =>
            setSettings({ ...settings, darkMode: checked })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="notifications-form" className="text-sm font-medium cursor-pointer">
          Enable Notifications
        </label>
        <Switch
          id="notifications-form"
          checked={settings.notifications}
          onCheckedChange={(checked) =>
            setSettings({ ...settings, notifications: checked })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="analytics-form" className="text-sm font-medium cursor-pointer">
          Analytics
        </label>
        <Switch
          id="analytics-form"
          checked={settings.analytics}
          onCheckedChange={(checked) =>
            setSettings({ ...settings, analytics: checked })
          }
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Save Settings
      </button>
    </form>
  );
}
