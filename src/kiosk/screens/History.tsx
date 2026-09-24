import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowRight, Bot, Mic, Pointer, Send, Volume2 } from 'lucide-react';
import { Button, Card, useTypewriter } from '../../ui';
import { DEMO_CONVO, FOLLOW_UPS, QUICK_ANSWERS } from '../../demo';
import type { ChatTurn } from '../../demo';
import { useKioskCtx } from '../KioskContext';
import { useToasts } from '../../toast';

export function History() {
  const navigate = useNavigate();
  const { setRedFlag, setTriage } = useKioskCtx();
  const { toast } = useToasts();

  const [count, setCount] = useState(1); // how many turns are visible
  const [recording, setRecording] = useState(false);
  const [typed, setTyped] = useState('');
  const [typingTurn, setTypingTurn] = useState<number>(-1); // AI turn index being typed
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const visible = DEMO_CONVO.slice(0, count);
  const last = visible[visible.length - 1];
  const isLastAI = last?.role === 'ai';
  const aiTurnsTotal = DEMO_CONVO.filter((t) => t.role === 'ai').length;
  const progress = Math.min(95, Math.round((count / DEMO_CONVO.length) * 100));

  /* Type out AI messages one at a time */
  useEffect(() => {
    const current = visible[visible.length - 1];
    if (current && current.role === 'ai') {
      setTypingTurn(count - 1);
    }
  }, [count]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [count]);

  /* Simulated recording indicator, then auto-advance with patient answer */
  const simulateRecording = (answerIndex?: number) => {
    if (recording) return;
    setRecording(true);
    const t = window.setTimeout(() => {
      setRecording(false);
      advance(answerIndex);
    }, 1600);
    timers.current.push(t);
  };

  const advance = (answerIndex?: number) => {
    setCount((c) => {
      const next = c + 1;
      // patient turn should appear then next AI turn appears on next action
      return Math.min(next, DEMO_CONVO.length);
    });
    if (answerIndex !== undefined) {
      // If we jumped to a patient answer, schedule the following AI question
      const t = window.setTimeout(() => {
        setCount((c) => Math.min(c + 1, DEMO_CONVO.length));
      }, 900);
      timers.current.push(t);
    }
  };

  /* Free-typed answer just shows a toast in demo and advances */
  const onSendTyped = () => {
    if (!typed.trim()) return;
    setTyped('');
    advance();
  };

  /* When conversation completes, offer to continue */
  const convoComplete = count >= DEMO_CONVO.length;

  const proceed = () => {
    // Demo patient path: chest pain + worse on walking + breathlessness => red flag
    setRedFlag(true);
    setTriage('Priority Triage');
    navigate('/kiosk/redflag');
  };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_340px]">
      {/* Chat column */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800">Tell us what brings you here</h1>
        <p className="mt-1 text-slate-500">Speak or tap. MediKiosk listens and asks simple follow-up questions.</p>

        <Card className="mt-5 flex h-[480px] flex-col overflow-hidden">
          {/* AI avatar bar */}
          <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-teal-50 to-white px-5 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">MediKiosk Assistant</p>
              <p className="text-xs text-slate-400">
                {recording ? 'Listening…' : 'Asking about your health · Hindi & English'}
              </p>
            </div>
            <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-teal-700">
              <span className="h-2 w-2 animate-blink rounded-full bg-teal-500" /> Live
            </span>
          </div>

          {/* Transcript */}
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
            {visible.map((turn: ChatTurn, i) => (
              <Turn key={i} turn={turn} typing={typingTurn === i} />
            ))}
            {recording && (
              <div className="flex items-center gap-3 pl-10 pt-2">
                <span className="relative flex h-10 w-10 items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-rose-400/40 animate-pulse-ring" />
                  <span className="h-3 w-3 rounded-full bg-rose-500" />
                </span>
                <div className="flex items-end gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 rounded-full bg-rose-400"
                      style={{ height: 8 + (i % 3) * 8, animation: `bounceDot 1s ease-in-out ${i * 0.12}s infinite` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input row */}
          <div className="border-t border-slate-100 bg-slate-50/60 p-4">
            <div className="flex items-center gap-3">
              <input
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSendTyped()}
                placeholder="Type your answer (optional)…"
                className="h-12 flex-1 rounded-xl border-2 border-slate-200 bg-white px-4 text-base focus:border-teal-500 focus:outline-none"
              />
              <Button variant="primary" onClick={onSendTyped} aria-label="Send typed answer">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Side controls */}
      <div className="space-y-4">
        <Card className="p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Answer by voice or touch</p>
          <div className="mt-4 grid gap-3">
            <Button
              size="lg"
              variant={recording ? 'danger' : 'teal'}
              className="w-full"
              onClick={() => simulateRecording()}
            >
              <Mic className="h-6 w-6" />
              {recording ? 'Listening… (tap to stop)' : 'Speak'}
            </Button>
            <Button size="lg" variant="outline" className="w-full" onClick={() => simulateRecording()}>
              <Pointer className="h-6 w-6" /> Tap Answer
            </Button>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="text-slate-500">Clinical history</span>
              <span className="text-teal-700">{progress}%</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Common answers</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {QUICK_ANSWERS.map((a) => (
              <button
                key={a}
                onClick={() => {
                  toast('info', `Answer captured: “${a}”`);
                  advance();
                }}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-teal-50 hover:text-teal-700"
              >
                {a}
              </button>
            ))}
          </div>
        </Card>

        {!convoComplete && (
          <Card className="p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Assistant may ask</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              {(FOLLOW_UPS.chest ?? []).slice(0, 3).map((q) => (
                <li key={q} className="flex gap-2">
                  <Volume2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
                  {q}
                </li>
              ))}
            </ul>
          </Card>
        )}

        <Button
          size="lg"
          variant={convoComplete ? 'teal' : 'outline'}
          className="w-full"
          onClick={() => (convoComplete ? proceed() : simulateRecording())}
        >
          {convoComplete ? (
            <>
              Continue <ArrowRight className="h-5 w-5" />
            </>
          ) : (
            'Next answer'
          )}
        </Button>
      </div>
    </div>
  );
}

/* ---------------- single chat bubble with typewriter for AI --------- */
function Turn({ turn, typing }: { turn: ChatTurn; typing: boolean }) {
  const typed = useTypewriter(typing ? turn.text : '', 24);
  const done = !typing || typed.length >= turn.text.length;

  if (turn.role === 'ai') {
    return (
      <div className="flex items-start gap-3 animate-fade-up">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white">
          <Bot className="h-5 w-5" />
        </div>
        <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3">
          <p className="text-base text-slate-700">
            {typing ? typed : turn.text}
            {typing && !done && <span className="ml-0.5 inline-block h-4 w-0.5 animate-blink bg-teal-600 align-middle" />}
          </p>
          {turn.textHi && done && <p className="mt-1 text-sm text-slate-400">{turn.textHi}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-end gap-3 animate-fade-up">
      <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-teal-600 px-4 py-3 text-white">
        <p className="text-base">{turn.text}</p>
        {turn.textHi && <p className="mt-1 text-sm text-teal-100">{turn.textHi}</p>}
      </div>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
        RK
      </div>
    </div>
  );
}
