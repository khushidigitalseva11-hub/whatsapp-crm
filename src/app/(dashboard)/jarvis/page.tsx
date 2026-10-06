'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Video,
  FileText,
  Layers,
  Image as ImageIcon,
  Code2,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Share2,
  MessageSquare,
  BarChart3,
  Brain,
  DollarSign,
  Copy,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  Upload,
} from 'lucide-react';
import { INITIAL_SERVICES, BUSINESS_INFO, BRAND_GUIDELINES } from '@/lib/digitalSeva';
import {
  JarvisScript,
  StoryboardShot,
  TenSecondClipSpec,
  JarvisQAResult,
  TargetAudience,
  ContentFormat,
  ApprovalState,
} from '@/types/jarvis';
import { DigitalService } from '@/types/digitalSeva';

export default function JarvisDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    | 'brain'
    | 'script'
    | 'shots'
    | 'flow10s'
    | 'image'
    | 'json'
    | 'assembly'
    | 'qa'
    | 'approval'
    | 'calendar'
    | 'social'
    | 'crm'
    | 'analytics'
    | 'memory'
    | 'budget'
  >('brain');

  // Core Project State
  const [topic, setTopic] = useState('નવું PAN Card ઓનલાઈન બનાવવા માટે સહાય (New PAN Card Assistance)');
  const [selectedServiceCode, setSelectedServiceCode] = useState('PAN');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('All Citizens (સમગ્ર જનતા)');
  const [contentFormat, setContentFormat] = useState<ContentFormat>('Instagram Reel');
  const [durationSec, setDurationSec] = useState(30);

  // Generation Loading States
  const [loadingScript, setLoadingScript] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Script & Versioning
  const [scriptV1, setScriptV1] = useState<JarvisScript | null>(null);
  const [scriptV2, setScriptV2] = useState<JarvisScript | null>(null);
  const [currentScript, setCurrentScript] = useState<JarvisScript | null>(null);

  // Shots & 10s Clips
  const [shots, setShots] = useState<StoryboardShot[]>([]);
  const [clips, setClips] = useState<TenSecondClipSpec[]>([]);

  // Video Assembly State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaySec, setCurrentPlaySec] = useState(0);
  const [selectedBgm, setSelectedBgm] = useState('Gujarati Festival Beats');
  const [showSubtitles] = useState(true);

  // QA & Approval State
  const [qaResult, setQaResult] = useState<JarvisQAResult | null>(null);
  const [approvalState, setApprovalState] = useState<ApprovalState>('Draft');
  const [reviewerNotes, setReviewerNotes] = useState('');

  // CRM Assistant State
  const [incomingMessage, setIncomingMessage] = useState('નમસ્તે ભાઈ, મારે નવું પાન કાર્ડ કઢાવવું છે, શું પુરાવા જોઈએ અને ફી કેટલી છે?');
  const [crmReplyGu, setCrmReplyGu] = useState('');
  const [crmReplyEn, setCrmReplyEn] = useState('');
  const [crmDetectedService, setCrmDetectedService] = useState<DigitalService | null>(null);

  // Budget & Usage State
  const [projectBudget] = useState(500);
  const [estimatedCost] = useState(45);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Initial Seed Generator
  useEffect(() => {
    handleGenerateScript();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerateScript = async () => {
    setLoadingScript(true);
    try {
      const res = await fetch('/api/jarvis/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-script',
          topic,
          serviceCode: selectedServiceCode,
          targetAudience,
          durationSec,
        }),
      });
      const data = await res.json();
      if (data.success && data.script) {
        if (!scriptV1) {
          setScriptV1(data.script);
        } else {
          setScriptV2(data.script);
        }
        setCurrentScript(data.script);
        showToast('✅ JARVIS: Bilingual Script generated successfully!');
        // Automatically chain shots generation
        handleGenerateShots(data.script);
      }
    } catch (e) {
      console.error(e);
      showToast('Error generating script');
    } finally {
      setLoadingScript(false);
    }
  };

  const handleGenerateShots = async (scriptObj: JarvisScript) => {
    try {
      const res = await fetch('/api/jarvis/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-shots',
          script: scriptObj,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShots(data.shots || []);
        setClips(data.clips || []);
        // Automatically run QA check
        handleRunQA(scriptObj);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunQA = async (scriptObj: JarvisScript) => {
    try {
      const res = await fetch('/api/jarvis/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'run-qa',
          script: scriptObj,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setQaResult(data.qaResult);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTestCrm = async () => {
    try {
      const res = await fetch('/api/jarvis/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'crm-suggest',
          message: incomingMessage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCrmReplyGu(data.suggestedReplyGu);
        setCrmReplyEn(data.suggestedReplyEn);
        setCrmDetectedService(data.matchedService);
        showToast('✅ JARVIS: Inbound lead detected and bilingual response ready!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Video Preview Player Tick
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentPlaySec((prev) => {
          if (prev >= durationSec) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (interval !== undefined) {
      clearInterval(interval);
    }
    return () => {
      if (interval !== undefined) clearInterval(interval);
    };
  }, [isPlaying, durationSec]);

  // Determine current active shot in player
  const activeShotIndex = Math.min(
    shots.length - 1,
    Math.floor(currentPlaySec / 10)
  );
  const currentPlayingShot = shots[activeShotIndex] || shots[0];

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-slate-900/95 px-5 py-3 text-emerald-300 shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Mode Status */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 p-6 shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/40">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  JARVIS
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                    OPERATING SYSTEM v2.0
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Just A Rather Very Intelligent System • AI Social Media & Marketing OS
                </p>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-300">
              Integrated with <span className="font-semibold text-amber-400">Shree Radhe Krishna Digital Service</span> (21 Citizen Services, Sadhli) & Private WhatsApp CRM.
            </p>
          </div>

          {/* Quick Badges */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-300 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              AI Brain Online
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-blue-300 font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              Contact Policy: Email Only
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-purple-300 font-medium">
              <MessageSquare className="h-3.5 w-3.5" />
              WhatsApp CRM Connected
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-amber-300 font-medium">
              <DollarSign className="h-3.5 w-3.5" />
              Budget: ₹{estimatedCost} / ₹{projectBudget}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Nav Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-3">
        {[
          { id: 'brain', label: '1. AI Brain & Strategy', icon: Brain },
          { id: 'script', label: '2. Script Studio', icon: FileText },
          { id: 'shots', label: '3. Shot Storyboard', icon: Layers },
          { id: 'flow10s', label: '4. Flow AI 10s Clips', icon: Video },
          { id: 'image', label: '5. Image & Text Overlay', icon: ImageIcon },
          { id: 'json', label: '6. JSON Spec', icon: Code2 },
          { id: 'assembly', label: '7. Video Assembly', icon: Play },
          { id: 'qa', label: '8. Content QA & Language', icon: ShieldCheck },
          { id: 'approval', label: '9. Approval Workflow', icon: CheckCircle2 },
          { id: 'calendar', label: '10. Content Calendar', icon: Calendar },
          { id: 'social', label: '11. Social Dispatch', icon: Share2 },
          { id: 'crm', label: '12. WhatsApp CRM Lead Bridge', icon: MessageSquare },
          { id: 'analytics', label: '13. Analytics & ROI', icon: BarChart3 },
          { id: 'memory', label: '14. Memory & Learning', icon: Sparkles },
          { id: 'budget', label: '15. Cost & Budget', icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: AI BRAIN & CONTENT STRATEGY
      ========================================================================= */}
      {activeTab === 'brain' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Input Strategy Controls */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                JARVIS Project Prompt & Strategy
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Provide an idea or select one of the 21 digital citizen services.
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Topic / Marketing Angle</label>
                  <textarea
                    rows={3}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Create a 30-second Gujarati Instagram marketing video for PAN Card"
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Target Service</label>
                    <select
                      value={selectedServiceCode}
                      onChange={(e) => {
                        setSelectedServiceCode(e.target.value);
                        const s = INITIAL_SERVICES.find(srv => srv.service_code === e.target.value);
                        if (s) setTopic(`${s.name_gu} (${s.name}) - માત્ર ₹${s.price} માં ઓનલાઈન સહાય`);
                      }}
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
                    >
                      {INITIAL_SERVICES.map((s) => (
                        <option key={s.id} value={s.service_code}>
                          {s.name_gu} (₹{s.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Target Audience</label>
                    <select
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value as TargetAudience)}
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
                    >
                      <option value="All Citizens (સમગ્ર જનતા)">All Citizens (સમગ્ર જનતા)</option>
                      <option value="Farmers (ખેડૂત મિત્રો)">Farmers (ખેડૂત મિત્રો)</option>
                      <option value="Youth & Students (વિદ્યાર્થીઓ & યુવાનો)">Youth & Students (વિદ્યાર્થીઓ)</option>
                      <option value="Senior Citizens (વરિષ્ઠ નાગરિકો)">Senior Citizens (વરિષ્ઠ નાગરિકો)</option>
                      <option value="Construction Workers (શ્રમિક / કડિયા કામ કરતા ભાઈઓ)">Construction Workers (શ્રમિક)</option>
                      <option value="Shop Owners & MSMEs (વેપારીઓ)">Shop Owners & MSMEs (વેપારીઓ)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Format</label>
                    <select
                      value={contentFormat}
                      onChange={(e) => setContentFormat(e.target.value as ContentFormat)}
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
                    >
                      <option value="Instagram Reel">Instagram Reel (9:16)</option>
                      <option value="YouTube Short">YouTube Short (9:16)</option>
                      <option value="Facebook Video">Facebook Video</option>
                      <option value="Advertisement Image">Advertisement Image (1:1)</option>
                      <option value="Educational Post">Educational Post</option>
                      <option value="Poster">Poster Design</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Duration (Seconds)</label>
                    <select
                      value={durationSec}
                      onChange={(e) => setDurationSec(Number(e.target.value))}
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
                    >
                      <option value={10}>10s (Single Viral Clip)</option>
                      <option value={20}>20s (2 × 10s Clips)</option>
                      <option value={30}>30s (3 × 10s Clips)</option>
                      <option value={60}>60s (6 × 10s Clips)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleGenerateScript}
                  disabled={loadingScript}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 transition hover:bg-primary/90 disabled:opacity-50"
                >
                  {loadingScript ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      JARVIS Brain Thinking...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Bilingual Script & Strategy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Business Knowledge Anchor */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Active Business Knowledge Anchor
              </h3>
              <div className="mt-3 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Business:</span>
                  <span className="font-semibold text-white">Shree Radhe Krishna Digital Service</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Location:</span>
                  <span>Rudra Complex, Sadhli, Vadodara</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Public Contact:</span>
                  <span className="text-emerald-400 font-mono">khushidigitalseva11@gmail.com (Email Only)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Smart Cards:</span>
                  <span>All India PVC Delivery Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Strategy Preview & Hook Recommendations */}
          <div className="space-y-6 lg:col-span-7">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  Strategy & Viral Hook Architecture
                </h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                  {contentFormat} • {durationSec} Seconds
                </span>
              </div>

              {currentScript ? (
                <div className="mt-5 space-y-4">
                  <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
                    <div className="flex items-center justify-between text-xs font-semibold text-primary">
                      <span>HOOK (0–3s) • 3-Second Retention Trigger</span>
                      <span>High Retention Pacing</span>
                    </div>
                    <p className="mt-2 text-base font-bold text-white">
                      &ldquo;{currentScript.hook.text_gu}&rdquo;
                    </p>
                    <p className="mt-1 text-xs text-slate-300">
                      EN: &ldquo;{currentScript.hook.text_en}&rdquo;
                    </p>
                    <p className="mt-2 text-xs italic text-amber-300/90">
                      💡 Visual Action: {currentScript.hook.action_note}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <span className="text-xs font-semibold text-rose-400">
                      PROBLEM AGITATION (3–{3 + currentScript.problem_agitation.duration_sec}s)
                    </span>
                    <p className="mt-1.5 text-sm text-slate-200">
                      {currentScript.problem_agitation.text_gu}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      EN: {currentScript.problem_agitation.text_en}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <span className="text-xs font-semibold text-emerald-400">
                      SOLUTION & FIXED PRICING ({3 + currentScript.problem_agitation.duration_sec}–{durationSec - 4}s)
                    </span>
                    <p className="mt-1.5 text-sm text-slate-200">
                      {currentScript.solution_explanation.text_gu}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      EN: {currentScript.solution_explanation.text_en}
                    </p>
                  </div>

                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                    <span className="text-xs font-semibold text-amber-400">
                      CALL TO ACTION & PUBLIC EMAIL ONLY ({durationSec - 4}–{durationSec}s)
                    </span>
                    <p className="mt-1.5 text-sm font-semibold text-white">
                      {currentScript.call_to_action.text_gu}
                    </p>
                    <p className="mt-1 text-xs text-slate-300">
                      EN: {currentScript.call_to_action.text_en}
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setActiveTab('script')}
                      className="flex-1 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-white transition hover:bg-slate-700 flex items-center justify-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Open Full Script Studio
                    </button>
                    <button
                      onClick={() => setActiveTab('shots')}
                      className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-white transition hover:bg-primary/90 flex items-center justify-center gap-2"
                    >
                      <Layers className="h-4 w-4" />
                      View Shot Storyboard
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-12 text-center text-slate-500">
                  <Bot className="mx-auto h-12 w-12 text-slate-600 animate-pulse" />
                  <p className="mt-2 text-sm">Click &ldquo;Generate Bilingual Script &amp; Strategy&rdquo; to start.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: SCRIPT STUDIO & VERSION CONTROL
      ========================================================================= */}
      {activeTab === 'script' && currentScript && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Bilingual Script Studio & Version Control
              </h2>
              <p className="text-xs text-slate-400">
                Preserve Script V1 & V2 versions. High accuracy Gujarati script and official English terminology.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {scriptV1 && (
                <button
                  onClick={() => setCurrentScript(scriptV1)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                    currentScript.id === scriptV1.id
                      ? 'bg-primary text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Script V1
                </button>
              )}
              {scriptV2 && (
                <button
                  onClick={() => setCurrentScript(scriptV2)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                    currentScript.id === scriptV2.id
                      ? 'bg-primary text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Script V2
                </button>
              )}
              <button
                onClick={handleGenerateScript}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Regenerate New Version
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Gujarati Script (Native Unicode) */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  ગુજરાતી સ્ક્રિપ્ટ (Gujarati Voiceover & Dialogues)
                </h3>
                <span className="text-xs text-slate-400">Unicode Verified</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Hook (૦ થી ૩ સેકન્ડ)</label>
                <textarea
                  rows={2}
                  value={currentScript.hook.text_gu}
                  onChange={(e) =>
                    setCurrentScript({
                      ...currentScript,
                      hook: { ...currentScript.hook, text_gu: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white focus:border-amber-400 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">મુશ્કેલી / પ્રશ્ન (Problem)</label>
                <textarea
                  rows={2}
                  value={currentScript.problem_agitation.text_gu}
                  onChange={(e) =>
                    setCurrentScript({
                      ...currentScript,
                      problem_agitation: { ...currentScript.problem_agitation, text_gu: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">ઉકેલ અને સેવા સહાય (Solution & Pricing)</label>
                <textarea
                  rows={3}
                  value={currentScript.solution_explanation.text_gu}
                  onChange={(e) =>
                    setCurrentScript({
                      ...currentScript,
                      solution_explanation: { ...currentScript.solution_explanation, text_gu: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">સંપર્ક અને વિનંતી (Call to Action - Email Only)</label>
                <textarea
                  rows={2}
                  value={currentScript.call_to_action.text_gu}
                  onChange={(e) =>
                    setCurrentScript({
                      ...currentScript,
                      call_to_action: { ...currentScript.call_to_action, text_gu: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white focus:border-amber-400 focus:outline-none font-semibold text-amber-300"
                />
              </div>
            </div>

            {/* English Script (Accurate Terminology) */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-blue-400 text-sm flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  English Script & International Overlays
                </h3>
                <span className="text-xs text-slate-400">Standard English</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Hook (0–3 Seconds)</label>
                <textarea
                  rows={2}
                  value={currentScript.hook.text_en}
                  onChange={(e) =>
                    setCurrentScript({
                      ...currentScript,
                      hook: { ...currentScript.hook, text_en: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Problem & Agitation</label>
                <textarea
                  rows={2}
                  value={currentScript.problem_agitation.text_en}
                  onChange={(e) =>
                    setCurrentScript({
                      ...currentScript,
                      problem_agitation: { ...currentScript.problem_agitation, text_en: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Solution & Official Pricing</label>
                <textarea
                  rows={3}
                  value={currentScript.solution_explanation.text_en}
                  onChange={(e) =>
                    setCurrentScript({
                      ...currentScript,
                      solution_explanation: { ...currentScript.solution_explanation, text_en: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Call to Action (Email Only)</label>
                <textarea
                  rows={2}
                  value={currentScript.call_to_action.text_en}
                  onChange={(e) =>
                    setCurrentScript({
                      ...currentScript,
                      call_to_action: { ...currentScript.call_to_action, text_en: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white focus:border-blue-400 focus:outline-none text-blue-300 font-semibold"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: SHOT STORYBOARD
      ========================================================================= */}
      {activeTab === 'shots' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Visual Shot Breakdown & Storyboard
              </h2>
              <p className="text-xs text-slate-400">
                Paced into exact shot timings, camera angles, on-screen text overlays, and audio cues.
              </p>
            </div>
            <button
              onClick={() => currentScript && handleGenerateShots(currentScript)}
              className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Re-derive Shots
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shots.map((shot) => (
              <div
                key={shot.shot_number}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 hover:border-primary/50 transition-all shadow-md"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs">
                      {shot.shot_number}
                    </span>
                    SHOT {shot.shot_number} ({shot.duration_sec}s)
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                    {shot.framing}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400">Visual Cue</span>
                  <p className="mt-1 text-xs text-slate-200 font-medium">{shot.visual_description}</p>
                  <p className="text-[11px] text-amber-300/90 mt-0.5">{shot.visual_description_gu}</p>
                </div>

                <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800/80">
                  <span className="text-[10px] font-semibold text-amber-400">ON-SCREEN TEXT (ગુજરાતી)</span>
                  <p className="text-xs font-bold text-white mt-0.5">{shot.on_screen_text_gu}</p>
                  <span className="text-[10px] font-semibold text-blue-400 mt-1 block">ON-SCREEN TEXT (EN)</span>
                  <p className="text-[11px] text-slate-300">{shot.on_screen_text_en}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>🎥 {shot.camera_movement}</span>
                  <span>🔊 {shot.sound_effect}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: FLOW AI 10-SECOND CLIP GENERATION RULE
      ========================================================================= */}
      {activeTab === 'flow10s' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Flow AI 10-Second Clip Rule & Video Continuity
            </h2>
            <p className="mt-1 text-xs text-slate-300">
              Flow AI generates videos strictly in <span className="font-bold text-amber-300">10-second segments</span>.
              A {durationSec}-second video is divided into {clips.length} continuous 10s clips that share identical character anchor, facial features, clothing, voice, and lighting!
            </p>
          </div>

          <div className="space-y-4">
            {clips.map((clip, idx) => (
              <div
                key={clip.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-primary border border-slate-700 font-black">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{clip.clip_name}</h4>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-amber-300 font-mono">
                        {clip.pacing}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{clip.visual_prompt}</p>
                    <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-400">
                      <span>🏷️ Tag: <strong className="text-slate-200">{clip.continuity_tag}</strong></span>
                      <span>⏱️ Breakdown: {clip.hook_sec}s Hook + {clip.core_sec}s Core + {clip.cta_sec}s CTA</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                    {clip.status}
                  </span>
                  <button
                    onClick={() => showToast(`Rendering 10s Clip ${idx + 1} with Flow AI...`)}
                    className="rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white hover:bg-primary/90"
                  >
                    Simulate Render
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: IMAGE STUDIO & SEPARATE TEXT OVERLAY
      ========================================================================= */}
      {activeTab === 'image' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Text Overlay Engine */}
          <div className="space-y-6 lg:col-span-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Crisp Text Overlay Engine (No AI Artifacts)
              </h2>
              <p className="text-xs text-slate-400">
                Rule 25: AI image generators distort Gujarati spelling. JARVIS renders the visual background and layers crisp vector Gujarati typography on top!
              </p>

              <div>
                <label className="text-xs font-semibold text-slate-300">Gujarati Headline (મુખ્ય શીર્ષક)</label>
                <input
                  type="text"
                  defaultValue="નવું પાન કાર્ડ - માત્ર ₹250 માં"
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm font-bold text-amber-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Sub-headline (વિગત)</label>
                <input
                  type="text"
                  defaultValue="ઓરિજિનલ PVC કાર્ડ હોમ ડિલિવરી સાથે • સાધલી"
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Font Family</label>
                  <select className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white">
                    <option>Noto Sans Gujarati (Bold)</option>
                    <option>Shruti (Clear)</option>
                    <option>Inter (English)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Badge Color</label>
                  <select className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white">
                    <option>Royal Blue (#3B82F6)</option>
                    <option>Gold Accent (#F59E0B)</option>
                    <option>Deep Navy (#0F172A)</option>
                  </select>
                </div>
              </div>

              {/* User Media Reference Upload */}
              <div className="rounded-xl border border-dashed border-slate-700 p-4 text-center">
                <Upload className="mx-auto h-8 w-8 text-slate-500" />
                <p className="mt-2 text-xs font-semibold text-slate-300">
                  Upload Reference Media (Photo, Screenshot, Logo)
                </p>
                <p className="text-[11px] text-slate-500">Supports JPG, PNG up to 10MB</p>
                <button
                  onClick={() => showToast('Reference Media Asset attached to Project!')}
                  className="mt-3 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                >
                  Choose Asset File
                </button>
              </div>
            </div>
          </div>

          {/* Right: Preview Canvas */}
          <div className="space-y-6 lg:col-span-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col items-center">
              <h3 className="text-sm font-bold text-white mb-4">9:16 Story / Reel Overlay Simulation</h3>
              
              <div className="relative aspect-[9/16] w-64 overflow-hidden rounded-2xl border-2 border-slate-700 bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 p-4 shadow-2xl flex flex-col justify-between">
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-black text-slate-950">
                    નવી યોજના
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">સાધલી, વડોદરા</span>
                </div>

                {/* Center Content */}
                <div className="text-center space-y-2">
                  <div className="mx-auto h-20 w-28 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-xs text-slate-300">
                    [PVC Card Graphic]
                  </div>
                  <h4 className="text-sm font-black text-white leading-snug drop-shadow-md">
                    નવું પાન કાર્ડ - માત્ર ₹250
                  </h4>
                  <p className="text-[10px] text-amber-300 font-semibold">
                    100% ઓરિજિનલ સરકારી પોર્ટલ સહાય
                  </p>
                </div>

                {/* Bottom Branded Card */}
                <div className="rounded-xl bg-slate-900/90 border border-slate-700 p-2.5 text-[9px] text-slate-300 space-y-1">
                  <p className="font-bold text-white text-[10px]">શ્રી રાધે કૃષ્ણ ડિજિટલ સેવા</p>
                  <p>રુદ્ર કોમ્પ્લેક્સ, ટિંબરવા રોડ, સાધલી</p>
                  <p className="text-amber-400 font-mono">ઈમેલ: khushidigitalseva11@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: JSON SPEC GENERATOR
      ========================================================================= */}
      {activeTab === 'json' && currentScript && (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                Structured Video JSON Specification
              </h2>
              <p className="text-xs text-slate-400">
                Machine-readable export schema for automated video rendering pipelines (Remotion / CapCut / Runway / After Effects).
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  JSON.stringify(
                    {
                      version: '2.0-jarvis',
                      projectId: currentScript.project_id,
                      durationSec: currentScript.estimated_duration_sec,
                      aspectRatio: '9:16',
                      fps: 24,
                      shots,
                      brand: BRAND_GUIDELINES,
                    },
                    null,
                    2
                  )
                );
                showToast('JSON Copied to Clipboard!');
              }}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90"
            >
              <Copy className="h-4 w-4" />
              Copy JSON
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
            <pre className="max-h-96 overflow-auto text-xs text-emerald-400 font-mono leading-relaxed">
              {JSON.stringify(
                {
                  version: '2.0-jarvis',
                  projectId: currentScript.project_id,
                  title: currentScript.title,
                  durationSec: currentScript.estimated_duration_sec,
                  aspectRatio: '9:16',
                  fps: 24,
                  voiceoverProfile: {
                    lang: 'gu-IN',
                    voice: 'Standard-Gujarati-Male-A',
                    speed: 1.05,
                  },
                  brandAnchor: {
                    shop: BUSINESS_INFO.name,
                    shop_gu: BUSINESS_INFO.name_gu,
                    emailOnly: BRAND_GUIDELINES.public_email,
                    disclaimer: BRAND_GUIDELINES.disclaimer_gu,
                    colors: {
                      primary: BRAND_GUIDELINES.primary_color,
                      gold: BRAND_GUIDELINES.gold_accent,
                    },
                  },
                  timeline: shots.map((s) => ({
                    shot: s.shot_number,
                    startSec: s.start_sec,
                    endSec: s.end_sec,
                    duration: s.duration_sec,
                    framing: s.framing,
                    camera: s.camera_movement,
                    onScreenTextGu: s.on_screen_text_gu,
                    onScreenTextEn: s.on_screen_text_en,
                    audioSfx: s.sound_effect,
                    imagePrompt: s.image_prompt,
                    videoPrompt: s.video_prompt,
                  })),
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: VIDEO ASSEMBLY & PREVIEW PLAYER
      ========================================================================= */}
      {activeTab === 'assembly' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Player Display */}
          <div className="space-y-4 lg:col-span-5 flex flex-col items-center">
            <div className="relative aspect-[9/16] w-72 overflow-hidden rounded-3xl border-4 border-slate-800 bg-slate-950 shadow-2xl flex flex-col justify-between p-4">
              {/* Header Watermark */}
              <div className="flex items-center justify-between text-[11px] text-white">
                <span className="font-bold text-amber-400">SRK DIGITAL</span>
                <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px]">
                  {currentPlaySec}s / {durationSec}s
                </span>
              </div>

              {/* Dynamic Center Simulation */}
              <div className="text-center space-y-2">
                <span className="text-[10px] text-primary uppercase font-bold tracking-wider">
                  Shot {activeShotIndex + 1} • {currentPlayingShot?.framing || 'Medium Shot'}
                </span>
                <p className="text-sm font-black text-white px-2 leading-snug drop-shadow-md">
                  {currentPlayingShot?.on_screen_text_gu || 'શ્રી રાધે કૃષ્ણ ડિજિટલ સેવા'}
                </p>
                {showSubtitles && (
                  <p className="text-[11px] text-amber-300 font-semibold px-2">
                    {currentPlayingShot?.on_screen_text_en}
                  </p>
                )}
              </div>

              {/* Bottom Card */}
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-2 text-[9px] text-slate-400 text-center">
                📧 {BRAND_GUIDELINES.public_email} • સાધલી
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 w-72 justify-center">
              <button
                onClick={() => setCurrentPlaySec(0)}
                className="rounded-full bg-slate-800 p-3 text-slate-300 hover:bg-slate-700"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="rounded-full bg-primary p-4 text-white shadow-lg hover:bg-primary/90"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </button>
              <span className="text-xs font-mono text-slate-400">
                {currentPlaySec}s / {durationSec}s
              </span>
            </div>
          </div>

          {/* Right: Assembly Timeline Settings */}
          <div className="space-y-6 lg:col-span-7">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                Assembly & Audio Mixing Engine
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Background Music (BGM)</label>
                  <select
                    value={selectedBgm}
                    onChange={(e) => setSelectedBgm(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white"
                  >
                    <option>Gujarati Festival Beats</option>
                    <option>Energetic Indian Folk</option>
                    <option>Corporate Lo-Fi Calm</option>
                    <option>Modern Tech Pulse</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Voiceover Language</label>
                  <select className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white">
                    <option>Gujarati (Clear Native Tone)</option>
                    <option>English (Neutral Indian)</option>
                    <option>Hindi (National Reach)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2 block">
                  Timeline Clip Sequence (10s Segments)
                </label>
                <div className="flex gap-2">
                  {shots.map((s, idx) => (
                    <button
                      key={s.shot_number}
                      onClick={() => setCurrentPlaySec(idx * 10)}
                      className={`flex-1 rounded-xl border p-3 text-left transition-all ${
                        activeShotIndex === idx
                          ? 'border-primary bg-primary/20 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-[11px] font-bold">Clip {idx + 1}</div>
                      <div className="text-[10px] text-slate-400">{idx * 10}s - {Math.min(durationSec, (idx + 1) * 10)}s</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 8: QUALITY ASSURANCE & LANGUAGE ACCURACY
      ========================================================================= */}
      {activeTab === 'qa' && qaResult && (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                Pre-Publishing QA & Compliance Gate
              </h2>
              <p className="text-xs text-slate-400">
                Rule 24 & 46: Validates Gujarati script, English letters, digits (0-9), government disclaimers, and contact policy.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-400">Compliance Score</span>
                <div className="text-2xl font-black text-emerald-400">{qaResult.score}%</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {qaResult.checks.map((check) => (
              <div
                key={check.rule_id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{check.title}</span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      check.status === 'PASS'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : check.status === 'WARNING'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {check.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{check.detail}</p>
                <p className="text-[11px] text-amber-300/90">{check.detail_gu}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 9: HUMAN APPROVAL WORKFLOW
      ========================================================================= */}
      {activeTab === 'approval' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Human Review & Approval Workflow
            </h2>
            <p className="text-xs text-slate-400">
              Rule 47: No external action or dispatch occurs without explicit review and approval.
            </p>

            <div className="flex items-center gap-2 border-y border-slate-800 py-4">
              {(['Draft', 'In Review', 'Approved', 'Scheduled', 'Published'] as ApprovalState[]).map(
                (st, idx) => (
                  <React.Fragment key={st}>
                    <button
                      onClick={() => setApprovalState(st)}
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                        approvalState === st
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                    {idx < 4 && <ArrowRight className="h-4 w-4 text-slate-600" />}
                  </React.Fragment>
                )
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Reviewer Notes & Feedback</label>
              <textarea
                rows={3}
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
                placeholder="Enter sign-off comments, required adjustments, or publication guidelines..."
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setApprovalState('Approved');
                  showToast('Project Approved! Ready for Social Dispatch.');
                }}
                className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-500"
              >
                Approve Project
              </button>
              <button
                onClick={() => {
                  setApprovalState('Changes Requested');
                  showToast('Changes requested sent to Script Studio.');
                }}
                className="rounded-xl bg-slate-800 px-6 py-2.5 text-xs font-bold text-rose-300 hover:bg-slate-700"
              >
                Request Revisions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 10: CONTENT CALENDAR
      ========================================================================= */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Content Calendar & Multi-Format Weekly Strategy
            </h2>
            <p className="text-xs text-slate-400">
              Rule 16 & 17: Video is not mandatory every day. Rotate formats across days of the week.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { day: 'Monday', format: 'Instagram Reel (Video)', service: 'નવું PAN Card', status: 'Scheduled' },
              { day: 'Tuesday', format: 'Advertisement Image', service: 'PVC Smart Card Delivery', status: 'Approved' },
              { day: 'Wednesday', format: 'Educational Post', service: 'આયુષ્માન ભારત યોજના (₹10 લાખ)', status: 'Draft' },
              { day: 'Thursday', format: 'YouTube Short', service: 'PM કિસાન e-KYC છેલ્લી તારીખ', status: 'Scheduled' },
              { day: 'Friday', format: 'Poster / Flyer', service: 'કુંવરબાઈનું મામેરું (લગ્ન સહાય)', status: 'Approved' },
              { day: 'Saturday', format: 'Scheme Deadline Alert', service: 'ઈ-નિર્માણ શ્રમિક કાર્ડ', status: 'Draft' },
              { day: 'Sunday', format: 'Festival Special / Q&A', service: 'સાપ્તાહિક પ્રશ્નોત્તરી', status: 'Planning' },
            ].map((slot) => (
              <div key={slot.day} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-black text-amber-400 text-sm">{slot.day}</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                    {slot.status}
                  </span>
                </div>
                <div className="text-xs font-semibold text-primary">{slot.format}</div>
                <p className="text-sm font-bold text-white">{slot.service}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 11: SOCIAL MEDIA MANAGER
      ========================================================================= */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              Social Media Distribution & Publishing Hub
            </h2>
            <p className="text-xs text-slate-400">
              Official API publishing & manual ready-to-dispatch packages for Meta, YouTube, and WhatsApp Status.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { platform: 'Instagram Reels', handle: '@srk_digitalservice', connected: true },
                { platform: 'YouTube Shorts', handle: 'Shree Radhe Krishna Digital', connected: true },
                { platform: 'WhatsApp Status', handle: 'Business Broadcast List', connected: true },
              ].map((p) => (
                <div key={p.platform} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{p.platform}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">Active</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{p.handle}</p>
                </div>
              ))}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Auto-Generated Bilingual Caption</label>
              <textarea
                rows={3}
                defaultValue={`શું તમારે નવું PAN Card કે અન્ય સરકારી યોજનામાં સહાય જોઈએ છે? 
લાંબી લાઈનોમાં ઊભા રહ્યા વગર સાધલી ખાતેથી ઓનલાઈન અરજી કરાવો.
📍 શ્રી રાધે કૃષ્ણ ડિજિટલ સેવા, રુદ્ર કોમ્પ્લેક્સ, સાધલી.
📧 khushidigitalseva11@gmail.com

#PANCard #Vadodara #Sadhli #JanSevaKendra #Gujarat #DigitalSeva`}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:outline-none"
              />
            </div>

            <button
              onClick={() => showToast('Dispatched to Social Media Queue!')}
              className="rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-primary/90"
            >
              Dispatch to Queued Platforms
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 12: WHATSAPP CRM ASSISTANT & LEAD BRIDGE
      ========================================================================= */}
      {activeTab === 'crm' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              WhatsApp CRM Assistant & Direct Lead Conversion Bridge
            </h2>
            <p className="mt-1 text-xs text-slate-300">
              When citizen inquiries arrive in the private WhatsApp CRM, JARVIS analyzes the intent, matches against the 21 services, displays pricing and documents, and generates a one-click bilingual reply!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-3">
                <h3 className="text-sm font-bold text-white">Inbound WhatsApp Citizen Inquiry</h3>
                <textarea
                  rows={4}
                  value={incomingMessage}
                  onChange={(e) => setIncomingMessage(e.target.value)}
                  placeholder="Paste or simulate an incoming WhatsApp message..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white focus:outline-none"
                />
                <button
                  onClick={handleTestCrm}
                  className="w-full rounded-xl bg-purple-600 py-2.5 text-xs font-bold text-white hover:bg-purple-500"
                >
                  Analyze with JARVIS Brain
                </button>
              </div>
            </div>

            <div className="space-y-4 lg:col-span-7">
              {crmReplyGu ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      Detected Lead: {crmDetectedService?.name_gu} ({crmDetectedService?.name})
                    </span>
                    <span className="text-xs font-black text-white bg-slate-800 px-2 py-0.5 rounded">
                      Fee: ₹{crmDetectedService?.price}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-amber-400">JARVIS Suggested Reply (ગુજરાતી)</span>
                    <pre className="mt-1 rounded-xl bg-slate-950 p-3 text-xs text-white font-sans whitespace-pre-wrap">
                      {crmReplyGu}
                    </pre>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(crmReplyGu);
                        showToast('Reply copied! Ready to send in WhatsApp CRM.');
                      }}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500"
                    >
                      Copy Gujarati Reply
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(crmReplyEn);
                        showToast('English reply copied!');
                      }}
                      className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700"
                    >
                      Copy English Reply
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-500">
                  <Bot className="mx-auto h-10 w-10 text-slate-600 mb-2" />
                  <p className="text-xs">Click &ldquo;Analyze with JARVIS Brain&rdquo; to test lead detection.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 13: MARKETING ANALYTICS & ROI
      ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Marketing Performance & Citizen Lead Conversions
            </h2>
            <p className="text-xs text-slate-400">
              Direct connection between Social Marketing Campaigns and Actual Digital Seva Applications.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <span className="text-xs font-semibold text-slate-400">Total Video Views</span>
              <div className="text-2xl font-black text-white mt-1">48,250</div>
              <span className="text-[11px] text-emerald-400 font-semibold">↑ +24% this week</span>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <span className="text-xs font-semibold text-slate-400">WhatsApp Inquiries</span>
              <div className="text-2xl font-black text-purple-400 mt-1">312 Leads</div>
              <span className="text-[11px] text-purple-300 font-semibold">From Reels & Status</span>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <span className="text-xs font-semibold text-slate-400">Applications Completed</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">184</div>
              <span className="text-[11px] text-slate-400">59% Conversion Rate</span>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <span className="text-xs font-semibold text-slate-400">Revenue Generated</span>
              <div className="text-2xl font-black text-amber-400 mt-1">₹38,500</div>
              <span className="text-[11px] text-amber-300 font-semibold">Locked service fees</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 14: MEMORY & AI LEARNING LOOP
      ========================================================================= */}
      {activeTab === 'memory' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              JARVIS Persistent Memory & Learning Feedback Loop
            </h2>
            <p className="text-xs text-slate-400">
              Rule 12 & 40: Persistent memory tracks top hooks, brand preferences, and user-approved decisions.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <span className="text-xs font-bold text-amber-400">Top-Performing Hook Pattern</span>
                <p className="text-xs text-slate-300">
                  &ldquo;શું તમારે પણ [Service] કઢાવવું છે પણ ક્યાં જવું એ ખબર નથી?&rdquo; generated the highest retention (78% 3s retention rate).
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <span className="text-xs font-bold text-blue-400">Optimal Video Duration</span>
                <p className="text-xs text-slate-300">
                  30-second videos (3 × 10s clips) achieved 3.2x higher completion rate compared to 60-second clips.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 15: COST TRACKING & BUDGET
      ========================================================================= */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-amber-400" />
              API Cost Tracking & Budget Safety
            </h2>
            <p className="text-xs text-slate-400">
              Rule 51 & 52: Tracks estimated API costs and halts generation if project limits are exceeded.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <span className="text-xs text-slate-400">Project Budget Cap</span>
                <div className="text-xl font-bold text-white mt-1">₹{projectBudget}</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <span className="text-xs text-slate-400">Current Incurred Cost</span>
                <div className="text-xl font-bold text-emerald-400 mt-1">₹{estimatedCost}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
