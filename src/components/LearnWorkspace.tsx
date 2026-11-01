import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Send,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  Check,
  Brain,
  MessageSquare,
  Upload,
  Keyboard,
  ShieldAlert,
  Loader2,
  Volume2,
} from 'lucide-react';
import { Project, LessonStep, Language } from '../types';
import { translations } from '../i18n/translations';
import { InteractiveCanvasSimulator } from './InteractiveCanvasSimulator';
import { api } from '../services/api';

interface LearnWorkspaceProps {
  project: Project;
  language: Language;
  onUpdateStep: (updatedProject: Project) => void;
  onOpenVerification: (stepId: string) => void;
  onProceedToQA: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  highThinking?: boolean;
}

export const LearnWorkspace: React.FC<LearnWorkspaceProps> = ({
  project,
  language,
  onUpdateStep,
  onOpenVerification,
  onProceedToQA,
}) => {
  const t = translations[language];
  const steps = project.steps || [];

  const currentStep =
    steps.find((s) => s.id === project.currentStepId) || steps[0] || null;

  const [simplerMode, setSimplerMode] = useState(false);
  const [mismatchReported, setMismatchReported] = useState(false);

  // Mentor Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'tutor',
      text:
        language === 'ur-roman'
          ? 'Salam! Main aap ka AI Design Ustaad hoon. Is step par Photoshop ya Photopea ke kisi bhi tool ya setting ka sawal pochein!'
          : 'Welcome to your workshop! Ask me anything about tools, shortcuts, or design hierarchy for this step.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [highThinking, setHighThinking] = useState(false);

  // Tab switcher for mobile
  const [mobileTab, setMobileTab] = useState<'canvas' | 'instructions' | 'mentor'>('instructions');

  const currentIndex = steps.findIndex((s) => s.id === currentStep?.id);
  const completedCount = steps.filter((s) => s.status === 'done').length;
  const progressPercent = Math.round((completedCount / (steps.length || 1)) * 100);

  const handleStepSelect = (stepId: string) => {
    const updated = { ...project, currentStepId: stepId };
    api.updateProject(updated).then(onUpdateStep);
  };

  const handleToggleComplete = async () => {
    if (!currentStep) return;
    const newStatus = currentStep.status === 'done' ? 'in_progress' : 'done';
    const updated = await api.updateStepStatus(project.id, currentStep.id, newStatus);
    onUpdateStep(updated);
  };

  const handleNextStep = () => {
    if (currentIndex < steps.length - 1) {
      handleStepSelect(steps[currentIndex + 1].id);
    }
  };

  const handlePrevStep = () => {
    if (currentIndex > 0) {
      handleStepSelect(steps[currentIndex - 1].id);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim() || chatLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend,
    };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!customText) setChatInput('');
    setChatLoading(true);

    try {
      const res = await api.askMentor(
        textToSend,
        project.brief,
        currentStep,
        language,
        highThinking
      );
      const tutorMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'tutor',
        text: res.reply,
        highThinking: res.highThinkingEnabled,
      };
      setChatMessages((prev) => [...prev, tutorMsg]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          id: 'msg-' + Date.now(),
          sender: 'tutor',
          text: 'Shukriya! Apne step ke actions ko ghor se parhein aur canvas me apply karein.',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleReportMismatch = () => {
    setMismatchReported(true);
    setTimeout(() => setMismatchReported(false), 4000);
  };

  if (!currentStep) {
    return <div className="p-8 text-center text-slate-400">Loading lessons...</div>;
  }

  return (
    <div className="max-w-[1500px] mx-auto space-y-4">
      {/* Top Bar with Step Navigator & Progress Bar */}
      <div className="bg-slate-900 px-6 py-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
              Step {currentStep.position} of {steps.length}
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {language === 'ur' && currentStep.titleUrdu ? currentStep.titleUrdu : currentStep.title}
            </h1>
          </div>
          <p className="text-xs text-slate-400">{currentStep.objective}</p>
        </div>

        {/* Progress and QA proceed */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-3">
            <div className="w-32 bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-slate-300">
              {progressPercent}%
            </span>
          </div>

          {progressPercent >= 50 && (
            <button
              onClick={onProceedToQA}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-purple-900/30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Proceed to QA Rubric</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex lg:hidden bg-slate-900 rounded-xl p-1 border border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setMobileTab('instructions')}
          className={`flex-1 py-2 rounded-lg transition ${
            mobileTab === 'instructions'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-slate-400'
          }`}
        >
          Instructions
        </button>
        <button
          onClick={() => setMobileTab('canvas')}
          className={`flex-1 py-2 rounded-lg transition ${
            mobileTab === 'canvas'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-slate-400'
          }`}
        >
          Canvas Studio
        </button>
        <button
          onClick={() => setMobileTab('mentor')}
          className={`flex-1 py-2 rounded-lg transition ${
            mobileTab === 'mentor'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'text-slate-400'
          }`}
        >
          AI Mentor
        </button>
      </div>

      {/* Flagship 3-Panel Grid (Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[680px]">
        {/* Left Panel: Step Checklist (3 Columns on Desktop) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {t.learn.stepsChecklist}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {completedCount}/{steps.length} done
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 max-h-[640px] scrollbar-thin scrollbar-thumb-slate-800">
            {steps.map((step) => {
              const isCurrent = step.id === currentStep.id;
              const isDone = step.status === 'done';

              return (
                <div
                  key={step.id}
                  onClick={() => handleStepSelect(step.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-sm ring-1 ring-amber-500/20'
                      : isDone
                      ? 'bg-slate-950/60 border-emerald-950/40 text-slate-300 hover:bg-slate-800/60'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        api.updateStepStatus(
                          project.id,
                          step.id,
                          isDone ? 'in_progress' : 'done'
                        ).then(onUpdateStep);
                      }}
                      className="mt-0.5 shrink-0 hover:scale-110 transition"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                      ) : isCurrent ? (
                        <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold truncate">
                          {step.position}. {step.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {step.toolName}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Panel: Interactive Canvas Studio Simulator (5 Columns on Desktop) */}
        <div
          className={`lg:col-span-5 flex flex-col gap-4 ${
            mobileTab === 'canvas' ? 'block' : 'hidden lg:flex'
          }`}
        >
          <div className="flex-1">
            <InteractiveCanvasSimulator project={project} />
          </div>

          {/* Quick Submission & Verification Trigger */}
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">Ready to check your work?</span>
                <span className="text-slate-400 text-[11px]">
                  Runs automated contrast, blur, safe margins, and palette adherence.
                </span>
              </div>
            </div>
            <button
              onClick={() => onOpenVerification(currentStep.id)}
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shrink-0 transition shadow-md shadow-sky-500/20"
            >
              Verify Step Preview
            </button>
          </div>
        </div>

        {/* Right Panel: Step Instruction Card & AI Mentor (4 Columns on Desktop) */}
        <div
          className={`lg:col-span-4 flex flex-col gap-4 ${
            mobileTab === 'instructions' || mobileTab === 'mentor'
              ? 'block'
              : 'hidden lg:flex'
          }`}
        >
          {/* Main Instruction Card */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-lg flex-1 overflow-y-auto max-h-[460px] scrollbar-thin scrollbar-thumb-slate-800">
            {/* Tool & Shortcut Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
                  {currentStep.toolName}
                </span>
                {currentStep.shortcut && (
                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700 flex items-center gap-1">
                    <Keyboard className="w-3 h-3 text-slate-400" />
                    {currentStep.shortcut.windows}
                  </span>
                )}
              </div>

              <button
                onClick={() => setSimplerMode(!simplerMode)}
                className={`text-[11px] font-semibold px-2 py-0.5 rounded transition ${
                  simplerMode
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.learn.explainSimpler}
              </button>
            </div>

            {/* Menu Path Fallback */}
            <div className="text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Menu Path: </span>
              <span className="font-mono text-amber-400/90">{currentStep.menuPath}</span>
            </div>

            {/* Simpler Mode Explanation Banner (Roman Urdu) */}
            {simplerMode ? (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs space-y-1">
                <span className="font-bold flex items-center gap-1 text-emerald-300">
                  <Lightbulb className="w-3.5 h-3.5" />
                  Asaan Alfaaz me Samjhein:
                </span>
                <p className="text-[12px] leading-relaxed">
                  Is step me aap ko sirf <strong>{currentStep.toolName}</strong> use karna hai. Ghabrayein mat! Pehle step 1 follow karein, phir canvas pe click karke expected result check karein.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-bold text-slate-300 block mb-0.5">
                    {t.learn.whatItDoes}:
                  </span>
                  <p className="text-slate-400 text-[11px]">{currentStep.whatItDoes}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-bold text-slate-300 block mb-0.5">
                    {t.learn.whyUsedHere}:
                  </span>
                  <p className="text-slate-400 text-[11px]">{currentStep.whyHere}</p>
                </div>
              </div>
            )}

            {/* Ordered Actions (≤ 5 Steps) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                {t.learn.actions} (Follow in Order):
              </span>
              <ol className="space-y-1.5 text-xs text-slate-200">
                {currentStep.actions.map((act, i) => (
                  <li key={i} className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/80 border border-slate-800/80">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold font-mono text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-[12px] leading-relaxed">{act}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Settings Reference */}
            {currentStep.settings?.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <span className="font-semibold text-slate-400 text-[11px]">Recommended Settings:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  {currentStep.settings.map((s, idx) => (
                    <div key={idx} className="flex justify-between border-b border-slate-900 pb-1">
                      <span className="text-slate-400">{s.name}:</span>
                      <span className="text-slate-200 font-mono font-semibold">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expected Result & Common Mistakes */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <span className="font-bold block mb-0.5">{t.learn.expectedResult}:</span>
                <p className="text-[11px]">{currentStep.expectedResult}</p>
              </div>

              {currentStep.commonMistakes?.length > 0 && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  <span className="font-bold block mb-0.5">{t.learn.commonMistakes}:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    {currentStep.commonMistakes.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bottom Controls in Instruction Card */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={handlePrevStep}
                  disabled={currentIndex === 0}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold flex items-center gap-1 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t.learn.previous}</span>
                </button>

                <button
                  onClick={handleToggleComplete}
                  className={`px-4 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition ${
                    currentStep.status === 'done'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{currentStep.status === 'done' ? 'Completed' : t.learn.markDone}</span>
                </button>

                <button
                  onClick={handleNextStep}
                  disabled={currentIndex === steps.length - 1}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 text-xs font-bold flex items-center gap-1 transition"
                >
                  <span>{t.learn.next}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Mismatch Feedback button */}
              <div className="flex justify-between items-center pt-1 text-[11px]">
                <button
                  onClick={handleReportMismatch}
                  className="text-slate-500 hover:text-slate-300 flex items-center gap-1"
                >
                  <ShieldAlert className="w-3 h-3 text-amber-500" />
                  <span>{mismatchReported ? 'Report Logged! Thank you.' : t.learn.stepMismatch}</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Mentor Chat with High Thinking Toggle */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3 flex-1 flex flex-col shadow-lg max-h-[360px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                {t.learn.mentor}
              </span>

              {/* High Thinking Mode Toggle (from User Requirement!) */}
              <button
                onClick={() => setHighThinking(!highThinking)}
                title="Enable deep design reasoning using gemini-4-argon with High Thinking level"
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition ${
                  highThinking
                    ? 'bg-purple-500 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Brain className="w-3 h-3" />
                <span>High Thinking {highThinking ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-44 text-xs scrollbar-thin scrollbar-thumb-slate-800">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded-xl ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium ml-6'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 mr-4'
                  }`}
                >
                  {msg.highThinking && (
                    <span className="inline-block text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold mb-1">
                      🧠 Deep Reasoning Result
                    </span>
                  )}
                  <p className="text-[11px] leading-relaxed">{msg.text}</p>
                </div>
              ))}
              {chatLoading && (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>
                    {highThinking
                      ? 'AI Ustaad is thinking deeply with gemini-4-argon (High Reasoning)...'
                      : 'AI Ustaad is typing answer...'}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                onClick={() => handleSendMessage('Why is my text blurry in Photoshop?')}
                className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] border border-slate-800"
              >
                Why is text blurry?
              </button>
              <button
                onClick={() => handleSendMessage('Show me essential shortcut keys')}
                className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] border border-slate-800"
              >
                Shortcuts?
              </button>
              <button
                onClick={() => handleSendMessage('Explain this step simpler in Roman Urdu')}
                className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] border border-slate-800"
              >
                Asaan Roman Urdu
              </button>
            </div>

            {/* Input Bar */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t.learn.askMentorPlaceholder}
                className="flex-1 bg-slate-950 text-slate-100 placeholder-slate-600 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={chatLoading || !chatInput.trim()}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
