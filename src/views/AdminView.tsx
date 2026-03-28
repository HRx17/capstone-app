import { useSimulator, type ContextMode } from '../contexts/SimulatorContext';
import { Smartphone, Sun, Briefcase, Moon, Lock, Unlock, Bell, Trash2, Bot, Zap, RotateCcw } from 'lucide-react';

export function AdminView() {
    const { currentMode, setMode, isLocked, setLocked, autoPilotRunning, triggerAutoPilot, pushNotification, triggerModal, boostedApps, boostApp, resetBoosts } = useSimulator();

    const modes: { id: ContextMode; label: string; icon: any; color: string }[] = [
        { id: 'NEUTRAL', label: 'Neutral (Default)', icon: Smartphone, color: 'text-gray-400' },
        { id: 'MORNING', label: 'Morning Routine', icon: Sun, color: 'text-orange-400' },
        { id: 'WORK', label: 'Work / Focus', icon: Briefcase, color: 'text-blue-400' },
        { id: 'EVENING', label: 'Evening / Relax', icon: Moon, color: 'text-indigo-400' },
    ];

    return (
        <div className="min-h-screen bg-neutral-950 p-8 text-white font-sans">
            <div className="max-w-xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Wizard of Oz - Admin Panel</h1>
                <p className="text-neutral-400 mb-10">
                    Secretly control the prototype's state. Changes made here broadcast to all connected mobile clients instantly.
                </p>

                <section className="mb-10 bg-neutral-900 border border-neutral-800 rounded-[24px] p-6 shadow-2xl">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        ⚙️ Context State Override
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {modes.map((mode) => {
                            const isActive = currentMode === mode.id;
                            return (
                                <button
                                    key={mode.id}
                                    onClick={() => setMode(mode.id)}
                                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all border-2 ${isActive
                                        ? 'bg-neutral-800 border-white shadow-lg'
                                        : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700'
                                        }`}
                                >
                                    <div className={`p-3 rounded-full bg-neutral-800 ${mode.color}`}>
                                        <mode.icon size={24} />
                                    </div>
                                    <div className="text-left">
                                        <div className={`font-semibold ${isActive ? 'text-white' : 'text-neutral-300'}`}>
                                            {mode.label}
                                        </div>
                                        {isActive && <div className="text-xs text-green-400 mt-1">● Active State</div>}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <section className="bg-neutral-900 border border-neutral-800 rounded-[24px] p-6 shadow-2xl relative overflow-hidden mb-10">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        🔒 Device Lock State
                    </h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setLocked(true)}
                            className={`flex-1 flex flex-col items-center justify-center gap-3 py-6 rounded-2xl transition-all border-2 ${isLocked
                                ? 'bg-neutral-800 border-red-500 shadow-lg text-white'
                                : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 text-neutral-400'
                                }`}
                        >
                            <Lock size={32} className={isLocked ? 'text-red-400' : ''} />
                            <span className="font-semibold">Lock Device</span>
                        </button>

                        <button
                            onClick={() => setLocked(false)}
                            className={`flex-1 flex flex-col items-center justify-center gap-3 py-6 rounded-2xl transition-all border-2 ${!isLocked
                                ? 'bg-neutral-800 border-green-500 shadow-lg text-white'
                                : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 text-neutral-400'
                                }`}
                        >
                            <Unlock size={32} className={!isLocked ? 'text-green-400' : ''} />
                            <span className="font-semibold">Unlock Device</span>
                        </button>
                    </div>
                </section>

                <section className="bg-neutral-900 border border-neutral-800 rounded-[24px] p-6 shadow-2xl relative overflow-hidden">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-blue-400">
                        ✨ Usability Test Controls
                    </h2>

                    <div className="space-y-6">
                        {/* Auto Pilot Toggle */}
                        <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-800 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-white">
                                <Bot size={24} className={autoPilotRunning ? "text-green-400" : "text-neutral-400"} />
                                <div>
                                    <h3 className="font-medium">Auto-Pilot Mode</h3>
                                    <p className="text-xs text-neutral-400">Rotates context modes automatically</p>
                                </div>
                            </div>
                            <button
                                onClick={() => triggerAutoPilot(!autoPilotRunning)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${autoPilotRunning ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'}`}
                            >
                                {autoPilotRunning ? 'Running...' : 'Start'}
                            </button>
                        </div>

                        {/* Modal Triggers */}
                        <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-800">
                            <div className="flex items-center gap-3 text-white mb-4">
                                <Trash2 size={24} className="text-red-400" />
                                <div>
                                    <h3 className="font-medium">Storage Cleanup Modal</h3>
                                    <p className="text-xs text-neutral-400">Triggers the Ghost App recovery prompt</p>
                                </div>
                            </div>
                            <button
                                onClick={() => triggerModal('ghost-app-cleanup')}
                                className="w-full py-3 bg-red-500/20 text-red-400 font-medium rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-colors"
                            >
                                Trigger Cleanup Prompt
                            </button>
                        </div>

                        {/* Push Notifications */}
                        <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-800">
                            <div className="flex items-center gap-3 text-white mb-4">
                                <Bell size={24} className="text-yellow-400" />
                                <div>
                                    <h3 className="font-medium">AI Notifications</h3>
                                    <p className="text-xs text-neutral-400">Push contextual suggestions to the screen</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    onClick={() => pushNotification({
                                        title: 'Time to Focus',
                                        message: 'Muted 3 non-essential notifications',
                                        icon: '💼'
                                    })}
                                    className="p-3 bg-neutral-700 text-sm text-neutral-200 rounded-lg hover:bg-neutral-600 border border-neutral-600 transition-colors text-left"
                                >
                                    <strong>Work:</strong> Focus Mode
                                </button>
                                <button
                                    onClick={() => pushNotification({
                                        title: 'Music Suggestion',
                                        message: 'Playing your Evening Relax mix 🎵',
                                        icon: '🎧'
                                    })}
                                    className="p-3 bg-neutral-700 text-sm text-neutral-200 rounded-lg hover:bg-neutral-600 border border-neutral-600 transition-colors text-left"
                                >
                                    <strong>Evening:</strong> Spotify
                                </button>
                            </div>
                        </div>

                        {/* App Boosting (Scenario 6-11) */}
                        <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-800">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3 text-white">
                                    <Zap size={24} className="text-purple-400" />
                                    <div>
                                        <h3 className="font-medium">AI App Boosting (Scenarios 6-11)</h3>
                                        <p className="text-xs text-neutral-400">Force specific apps to the top to simulate learning</p>
                                    </div>
                                </div>
                                <button
                                    onClick={resetBoosts}
                                    className="p-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-neutral-300 transition-colors"
                                    title="Reset all boosts"
                                >
                                    <RotateCcw size={18} />
                                </button>
                            </div>

                            {boostedApps.length > 0 && (
                                <div className="mb-3 p-2 bg-neutral-900 rounded border border-neutral-700 text-xs text-neutral-400">
                                    Current Order: {boostedApps.join(', ')}
                                </div>
                            )}

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                                {[
                                    { id: 'health', name: 'Fitness (Scen 6)' },
                                    { id: 'messages', name: 'Messages (Scen 7)' },
                                    { id: 'news', name: 'News (Scen 8)' },
                                    { id: 'calendar', name: 'Calendar (Scen 9)' },
                                    { id: 'facetime', name: 'FaceTime (Scen 10)' },
                                    { id: 'instagram', name: 'Instagram (Scen 11)' },
                                ].map(app => (
                                    <button
                                        key={app.id}
                                        onClick={() => boostApp(app.id)}
                                        className={`p-2 text-sm rounded-lg border transition-colors text-center ${boostedApps[0] === app.id
                                            ? 'bg-purple-500/30 border-purple-500 text-purple-200'
                                            : 'bg-neutral-700 border-neutral-600 text-neutral-200 hover:bg-neutral-600'
                                            }`}
                                    >
                                        Boost {app.name}
                                    </button>
                                ))}
                            </div>

                            <div className="border-t border-neutral-700 pt-4 mt-2">
                                <h4 className="text-sm font-medium text-white mb-2">Error Handling (Scenario 5)</h4>
                                <button
                                    onClick={() => triggerModal('undo-action')}
                                    className="w-full flex items-center justify-center gap-2 p-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm text-neutral-200 border border-neutral-600 transition-colors"
                                >
                                    <RotateCcw size={16} />
                                    Trigger Undo "Revert" Toast
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
