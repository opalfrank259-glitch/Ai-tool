import React, { useState, useEffect } from 'react';
import {
  X,
  Sliders,
  Globe,
  SlidersHorizontal,
  Monitor,
  ShieldCheck,
  Download,
  Check,
} from 'lucide-react';
import { UserProfile, Language, SkillLevel, AppName } from '../types';
import { api } from '../services/api';

interface SettingsModalProps {
  onClose: () => void;
  onLanguageChange: (lang: Language) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  onLanguageChange,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getProfile().then(setProfile);
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    await api.updateProfile(profile);
    onLanguageChange(profile.language);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const handleExportAll = () => {
    const data = {
      profile,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_Design_Tutor_Account_Data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSignOut = async () => {
    const { error } = await (await import('../lib/supabase')).requireSupabase().auth.signOut();
    if (error) {
      alert(error.message);
      return;
    }
    window.location.reload();
  };

  const [activeTab, setActiveTab] = useState<'preferences' | 'brandKit'>('preferences');

  if (!profile) return null;

  const currentBrandKit = profile.brandKit || {
    id: 'bk-default',
    name: 'Karachi Biryani Co.',
    colors: [
      { name: 'Crimson', hex: '#450A0A' },
      { name: 'Amber Gold', hex: '#F59E0B' },
      { name: 'Charcoal', hex: '#1C1917' },
      { name: 'White', hex: '#FFFFFF' },
    ],
    primaryFont: 'Montserrat Black',
    secondaryFont: 'Inter Regular',
    tagline: 'Zaiqa Jo Dil Jeet Le',
    contactNumber: '0300-1234567',
    address: 'Main Clifton Road, Karachi',
    rules: [
      'Maintain at least 4.5:1 contrast for all text over food images',
      'Never stretch or distort brand logo without holding Shift',
    ],
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sliders className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">App & Brand Settings</h2>
          </div>
          <p className="text-xs text-slate-400">
            Tune lesson depth, interface language, and reusable brand kit assets.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              activeTab === 'preferences'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            User Preferences
          </button>
          <button
            onClick={() => setActiveTab('brandKit')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              activeTab === 'brandKit'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Brand Kit (Colors & Assets)
          </button>
        </div>

        {activeTab === 'preferences' ? (
          <div className="space-y-4 text-xs">
            {/* Language */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                Interface & AI Tutor Language:
              </label>
              <select
                value={profile.language}
                onChange={(e) =>
                  setProfile({ ...profile, language: e.target.value as Language })
                }
                className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="ur-roman">Roman Urdu (Main target)</option>
                <option value="en">English</option>
                <option value="ur">اردو (Urdu with RTL)</option>
              </select>
            </div>

            {/* Skill Level */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
                Your Skill Level:
              </label>
              <select
                value={profile.skillLevel}
                onChange={(e) =>
                  setProfile({ ...profile, skillLevel: e.target.value as SkillLevel })
                }
                className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="beginner">Beginner (Step-by-step guidance & simplified terms)</option>
                <option value="basic">Basic (Comfortable with Move & Type tools)</option>
                <option value="intermediate">Intermediate (Familiar with masks & adjustments)</option>
                <option value="advanced">Advanced (Fast shortcuts & minimal theory)</option>
              </select>
            </div>

            {/* Target Application */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                Primary Design Application:
              </label>
              <select
                value={profile.appName}
                onChange={(e) =>
                  setProfile({ ...profile, appName: e.target.value as AppName })
                }
                className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="photoshop">Adobe Photoshop (Desktop)</option>
                <option value="photopea">Photopea (Browser Editor)</option>
                <option value="other">Other / General Design</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400">Brand Name:</label>
                <input
                  type="text"
                  value={currentBrandKit.name}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      brandKit: { ...currentBrandKit, name: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 text-slate-200 p-2 rounded-lg border border-slate-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400">Tagline:</label>
                <input
                  type="text"
                  value={currentBrandKit.tagline}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      brandKit: { ...currentBrandKit, tagline: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 text-slate-200 p-2 rounded-lg border border-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400">Primary Headline Font:</label>
                <input
                  type="text"
                  value={currentBrandKit.primaryFont}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      brandKit: { ...currentBrandKit, primaryFont: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 text-slate-200 p-2 rounded-lg border border-slate-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400">Secondary Font:</label>
                <input
                  type="text"
                  value={currentBrandKit.secondaryFont}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      brandKit: { ...currentBrandKit, secondaryFont: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 text-slate-200 p-2 rounded-lg border border-slate-800"
                />
              </div>
            </div>

            {/* Brand Colors */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-semibold block">Brand Swatches (Hex):</label>
              <div className="grid grid-cols-2 gap-2">
                {currentBrandKit.colors.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="w-5 h-5 rounded-md border border-white/20 shrink-0" style={{ backgroundColor: c.hex }} />
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => {
                        const newColors = [...currentBrandKit.colors];
                        newColors[i].name = e.target.value;
                        setProfile({
                          ...profile,
                          brandKit: { ...currentBrandKit, colors: newColors },
                        });
                      }}
                      className="bg-transparent text-slate-200 text-xs w-20 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={c.hex}
                      onChange={(e) => {
                        const newColors = [...currentBrandKit.colors];
                        newColors[i].hex = e.target.value;
                        setProfile({
                          ...profile,
                          brandKit: { ...currentBrandKit, colors: newColors },
                        });
                      }}
                      className="bg-transparent font-mono text-slate-400 text-[11px] w-20 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

          {/* Privacy & Account Actions */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
              Privacy & Account Actions:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleExportAll}
                className="flex-1 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export My Data</span>
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-semibold flex items-center gap-1.5 transition"
                title="Sign out of this account"
              >
                
                <span>Sign Out</span>
              </button>
            </div>
          </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{saved ? 'Saved!' : 'Save Preferences'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
