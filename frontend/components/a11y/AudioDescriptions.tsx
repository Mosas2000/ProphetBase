'use client';

import { Mic, Play, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Audio cue types
export interface AudioCue {
  id: string;
  name: string;
  url: string;
  volume: number;
  category: 'notification' | 'navigation' | 'interaction' | 'feedback';
}

// Audio description manager
export class AudioDescriptionManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.7;
  private listeners: Array<(enabled: boolean) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      this.loadSettings();
    }
  }

  async loadSound(id: string, url: string): Promise<void> {
    if (!this.audioContext) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.sounds.set(id, audioBuffer);
    } catch (error) {
      console.error(`Failed to load sound ${id}:`, error);
    }
  }

  playSound(id: string, volume?: number): void {
    if (!this.enabled || !this.audioContext) return;

    const buffer = this.sounds.get(id);
    if (!buffer) {
      console.warn(`Sound ${id} not found`);
      return;
    }

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    gainNode.gain.value = volume ?? this.volume;

    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    source.start(0);
  }

  // Generate synthetic beep
  playBeep(frequency: number = 440, duration: number = 200): void {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration / 1000
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration / 1000);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.saveSettings();
    this.notifyListeners();
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getVolume(): number {
    return this.volume;
  }

  private loadSettings(): void {
    const savedEnabled = localStorage.getItem('audioDescriptionsEnabled');
    const savedVolume = localStorage.getItem('audioDescriptionsVolume');

    if (savedEnabled !== null) {
      this.enabled = savedEnabled === 'true';
    }
    if (savedVolume !== null) {
      this.volume = parseFloat(savedVolume);
    }
  }

  private saveSettings(): void {
    localStorage.setItem('audioDescriptionsEnabled', this.enabled.toString());
    localStorage.setItem('audioDescriptionsVolume', this.volume.toString());
  }

  subscribe(listener: (enabled: boolean) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.enabled));
  }
}

// Voice navigation manager
export class VoiceNavigationManager {
  private recognition: any = null;
  private listening: boolean = false;
  private commands: Map<string, () => void> = new Map();
  private listeners: Array<(listening: boolean) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event: any) => {
          const transcript = event.results[
            event.results.length - 1
          ][0].transcript
            .toLowerCase()
            .trim();
          this.handleCommand(transcript);
        };

        this.recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          this.stopListening();
        };
      }
    }
  }

  registerCommand(phrase: string, action: () => void): void {
    this.commands.set(phrase.toLowerCase(), action);
  }

  unregisterCommand(phrase: string): void {
    this.commands.delete(phrase.toLowerCase());
  }

  startListening(): void {
    if (!this.recognition || this.listening) return;

    try {
      this.recognition.start();
      this.listening = true;
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
    }
  }

  stopListening(): void {
    if (!this.recognition || !this.listening) return;

    try {
      this.recognition.stop();
      this.listening = false;
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to stop voice recognition:', error);
    }
  }

  private handleCommand(transcript: string): void {
    for (const [phrase, action] of this.commands.entries()) {
      if (transcript.includes(phrase)) {
        action();
        return;
      }
    }
  }

  isListening(): boolean {
    return this.listening;
  }

  subscribe(listener: (listening: boolean) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.listening));
  }
}

// Audio descriptions hook
export function useAudioDescriptions() {
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolumeState] = useState(0.7);
  const managerRef = useRef<AudioDescriptionManager | null>(null);

  useEffect(() => {
    managerRef.current = new AudioDescriptionManager();
    setEnabled(managerRef.current.isEnabled());
    setVolumeState(managerRef.current.getVolume());

    const unsubscribe = managerRef.current.subscribe((isEnabled) => {
      setEnabled(isEnabled);
    });

    return unsubscribe;
  }, []);

  const toggleEnabled = () => {
    managerRef.current?.setEnabled(!enabled);
    setEnabled(!enabled);
  };

  const setVolume = (vol: number) => {
    managerRef.current?.setVolume(vol);
    setVolumeState(vol);
  };

  const playSound = (id: string) => {
    managerRef.current?.playSound(id);
  };

  const playBeep = (frequency?: number, duration?: number) => {
    managerRef.current?.playBeep(frequency, duration);
  };

  return {
    enabled,
    volume,
    toggleEnabled,
    setVolume,
    playSound,
    playBeep,
  };
}

// Voice navigation hook
export function useVoiceNavigation() {
  const [listening, setListening] = useState(false);
  const managerRef = useRef<VoiceNavigationManager | null>(null);

  useEffect(() => {
    managerRef.current = new VoiceNavigationManager();
    setListening(managerRef.current.isListening());

    const unsubscribe = managerRef.current.subscribe((isListening) => {
      setListening(isListening);
    });

    return () => {
      unsubscribe();
      managerRef.current?.stopListening();
    };
  }, []);

  const registerCommand = (phrase: string, action: () => void) => {
    managerRef.current?.registerCommand(phrase, action);
  };

  const startListening = () => {
    managerRef.current?.startListening();
  };

  const stopListening = () => {
    managerRef.current?.stopListening();
  };

  return {
    listening,
    registerCommand,
    startListening,
    stopListening,
  };
}

// Audio descriptions dashboard
export function AudioDescriptionsDashboard() {
  const { enabled, volume, toggleEnabled, setVolume, playBeep } =
    useAudioDescriptions();
  const { listening, startListening, stopListening, registerCommand } =
    useVoiceNavigation();
  const [feedback, setFeedback] = useState<string[]>([]);

  useEffect(() => {
    registerCommand('test sound', () => {
      playBeep(440, 200);
      setFeedback((prev) => [...prev, 'Voice command: test sound']);
    });

    registerCommand('navigate home', () => {
      setFeedback((prev) => [...prev, 'Voice command: navigate home']);
    });
  }, []);

  const testBeeps = [
    { frequency: 262, label: 'Low (C4)', color: 'bg-blue-600' },
    { frequency: 440, label: 'Medium (A4)', color: 'bg-green-600' },
    { frequency: 880, label: 'High (A5)', color: 'bg-purple-600' },
  ];

  return (
    <div
      className="p-6 bg-slate-800 rounded-xl"
      role="region"
      aria-label="Audio Descriptions Settings"
    >
      <div className="flex items-center gap-3 mb-6">
        <Volume2 className="w-6 h-6 text-orange-400" />
        <h2 className="text-2xl font-bold">Audio Descriptions</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 bg-slate-700 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Audio Feedback</h3>
              <button
                onClick={toggleEnabled}
                className={`p-2 rounded ${
                  enabled ? 'bg-green-600' : 'bg-red-600'
                }`}
                aria-label={enabled ? 'Disable audio' : 'Enable audio'}
              >
                {enabled ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-2">
                  Volume: {Math.round(volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full"
                  disabled={!enabled}
                  aria-label="Audio volume"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Test Sounds</label>
                <div className="grid grid-cols-3 gap-2">
                  {testBeeps.map((beep) => (
                    <button
                      key={beep.frequency}
                      onClick={() => playBeep(beep.frequency, 200)}
                      className={`p-2 ${beep.color} hover:opacity-80 rounded text-xs`}
                      disabled={!enabled}
                    >
                      {beep.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-700 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-red-400" />
                <h3 className="font-bold">Voice Navigation</h3>
              </div>
              <button
                onClick={listening ? stopListening : startListening}
                className={`px-4 py-2 rounded ${
                  listening ? 'bg-red-600 animate-pulse' : 'bg-blue-600'
                }`}
              >
                {listening ? 'Stop' : 'Start'}
              </button>
            </div>

            <div className="text-sm text-slate-300 space-y-2">
              <p>Available commands:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>&quot;test sound&quot; - Play test beep</li>
                <li>&quot;navigate home&quot; - Go to home</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-700 rounded-lg">
            <h3 className="font-bold mb-4">Audio Cue Types</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <div>
                  <div className="font-medium">Notifications</div>
                  <div className="text-slate-400">New messages, alerts</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <div>
                  <div className="font-medium">Navigation</div>
                  <div className="text-slate-400">Page changes, menu opens</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full" />
                <div>
                  <div className="font-medium">Interactions</div>
                  <div className="text-slate-400">
                    Button clicks, form submission
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full" />
                <div>
                  <div className="font-medium">Feedback</div>
                  <div className="text-slate-400">Success, error messages</div>
                </div>
              </div>
            </div>
          </div>

          {feedback.length > 0 && (
            <div className="p-4 bg-slate-700 rounded-lg">
              <h3 className="font-bold mb-3">Activity Log</h3>
              <div className="space-y-1 text-sm text-slate-300 max-h-40 overflow-y-auto">
                {feedback.slice(-10).map((msg, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Play className="w-3 h-3" />
                    <span>{msg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Export singletons
export const audioManager =
  typeof window !== 'undefined' ? new AudioDescriptionManager() : null;
export const voiceManager =
  typeof window !== 'undefined' ? new VoiceNavigationManager() : null;
