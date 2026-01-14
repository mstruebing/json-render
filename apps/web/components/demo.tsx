"use client";

import { useEffect, useState, useCallback } from "react";
import { CodeBlock } from "./code-block";

const PROMPT = "Create a contact form with name, email, and message";

interface StageJson {
  key: string;
  type: string;
  props: Record<string, unknown>;
  children?: StageJson[];
}

interface Stage {
  json: StageJson;
  stream: string;
}

const STAGES: Stage[] = [
  { json: { key: "form", type: "Form", props: { title: "Contact Us" }, children: [] }, stream: '{"op":"set","path":"/form","value":{"type":"Form","props":{"title":"Contact Us"}}}' },
  { json: { key: "form", type: "Form", props: { title: "Contact Us" }, children: [{ key: "name", type: "Input", props: { label: "Name", name: "name" } }] }, stream: '{"op":"add","path":"/form/children/0","value":{"type":"Input","props":{"label":"Name"}}}' },
  { json: { key: "form", type: "Form", props: { title: "Contact Us" }, children: [{ key: "name", type: "Input", props: { label: "Name", name: "name" } }, { key: "email", type: "Input", props: { label: "Email", name: "email" } }] }, stream: '{"op":"add","path":"/form/children/1","value":{"type":"Input","props":{"label":"Email"}}}' },
  { json: { key: "form", type: "Form", props: { title: "Contact Us" }, children: [{ key: "name", type: "Input", props: { label: "Name", name: "name" } }, { key: "email", type: "Input", props: { label: "Email", name: "email" } }, { key: "message", type: "Textarea", props: { label: "Message", name: "message" } }] }, stream: '{"op":"add","path":"/form/children/2","value":{"type":"Textarea","props":{"label":"Message"}}}' },
  { json: { key: "form", type: "Form", props: { title: "Contact Us" }, children: [{ key: "name", type: "Input", props: { label: "Name", name: "name" } }, { key: "email", type: "Input", props: { label: "Email", name: "email" } }, { key: "message", type: "Textarea", props: { label: "Message", name: "message" } }, { key: "submit", type: "Button", props: { label: "Send Message", action: "submit" } }] }, stream: '{"op":"add","path":"/form/children/3","value":{"type":"Button","props":{"label":"Send Message"}}}' },
];

const CODE_EXAMPLE = `import { createCatalog } from '@json-render/core';
import { z } from 'zod';

export const catalog = createCatalog({
  components: {
    Form: {
      props: z.object({
        title: z.string(),
      }),
      hasChildren: true,
    },
    Input: {
      props: z.object({
        label: z.string(),
        name: z.string(),
      }),
    },
    Textarea: {
      props: z.object({
        label: z.string(),
        name: z.string(),
      }),
    },
    Button: {
      props: z.object({
        label: z.string(),
        action: z.string(),
      }),
    },
  },
});`;

type Phase = "typing" | "streaming" | "complete";
type Tab = "stream" | "json" | "code";

export function Demo() {
  const [phase, setPhase] = useState<Phase>("typing");
  const [typedPrompt, setTypedPrompt] = useState("");
  const [stageIndex, setStageIndex] = useState(-1);
  const [streamLines, setStreamLines] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("stream");
  const [actionFired, setActionFired] = useState(false);

  const currentStage = stageIndex >= 0 ? STAGES[stageIndex] : null;

  const reset = useCallback(() => {
    setPhase("typing");
    setTypedPrompt("");
    setStageIndex(-1);
    setStreamLines([]);
    setActiveTab("stream");
    setActionFired(false);
  }, []);

  // Typing effect
  useEffect(() => {
    if (phase !== "typing") return;

    let i = 0;
    const interval = setInterval(() => {
      if (i < PROMPT.length) {
        setTypedPrompt(PROMPT.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase("streaming"), 500);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [phase]);

  // Streaming effect
  useEffect(() => {
    if (phase !== "streaming") return;

    let i = 0;
    const interval = setInterval(() => {
      if (i < STAGES.length) {
        const currentIndex = i;
        const stage = STAGES[currentIndex];
        if (stage) {
          setStageIndex(currentIndex);
          setStreamLines((prev) => [...prev, stage.stream]);
        }
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setPhase("complete");
          setActiveTab("json");
        }, 500);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [phase]);

  const handleAction = () => {
    setActionFired(true);
    setTimeout(() => setActionFired(false), 2000);
  };

  // Progressive render based on current stage
  const renderPreview = () => {
    if (!currentStage) {
      return <div className="text-muted-foreground/50 text-sm">waiting...</div>;
    }

    const { props, children = [] } = currentStage.json;
    const title = props.title as string | undefined;
    const nameField = children.find(c => c.key === "name");
    const emailField = children.find(c => c.key === "email");
    const messageField = children.find(c => c.key === "message");
    const submitBtn = children.find(c => c.key === "submit");

    return (
      <div className="text-center animate-in fade-in duration-200">
        <div className="border border-border rounded-lg p-4 bg-background inline-block text-left w-56">
          {title && (
            <h3 className="font-semibold mb-3 text-sm">{title}</h3>
          )}
          <div className="space-y-2">
            {nameField && (
              <div className="animate-in fade-in slide-in-from-bottom-1 duration-200">
                <label className="text-[10px] text-muted-foreground block mb-0.5">{nameField.props.label as string}</label>
                <div className="h-7 w-full bg-card border border-border rounded px-2 text-xs" />
              </div>
            )}
            {emailField && (
              <div className="animate-in fade-in slide-in-from-bottom-1 duration-200">
                <label className="text-[10px] text-muted-foreground block mb-0.5">{emailField.props.label as string}</label>
                <div className="h-7 w-full bg-card border border-border rounded px-2 text-xs" />
              </div>
            )}
            {messageField && (
              <div className="animate-in fade-in slide-in-from-bottom-1 duration-200">
                <label className="text-[10px] text-muted-foreground block mb-0.5">{messageField.props.label as string}</label>
                <div className="h-14 w-full bg-card border border-border rounded px-2 text-xs" />
              </div>
            )}
            {submitBtn && (
              <button
                onClick={handleAction}
                className="w-full px-3 py-1.5 bg-foreground text-background rounded text-xs font-medium hover:opacity-90 transition-opacity animate-in fade-in slide-in-from-bottom-1 duration-200"
              >
                {submitBtn.props.label as string}
              </button>
            )}
          </div>
        </div>
        {actionFired && (
          <div className="mt-3 text-xs font-mono text-muted-foreground animate-in fade-in slide-in-from-bottom-2">
            onAction(&quot;submit&quot;)
          </div>
        )}
      </div>
    );
  };

  const jsonCode = currentStage
    ? JSON.stringify(currentStage.json, null, 2)
    : "// waiting...";

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Prompt input */}
      <div className="mb-6">
        <div className="border border-border rounded p-3 bg-card font-mono text-sm min-h-[44px] flex items-center justify-between">
          <div className="flex items-center">
            <span className="inline-flex items-center h-5">{typedPrompt}</span>
            {phase === "typing" && (
              <span className="inline-block w-2 h-4 bg-foreground ml-0.5 animate-pulse" />
            )}
          </div>
          <button
            onClick={reset}
            className="ml-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Replay demo"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Tabbed code/stream/json panel */}
        <div>
          <div className="flex gap-4 mb-2">
            {(["stream", "json", "code"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-mono transition-colors ${
                  activeTab === tab ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="border border-border rounded p-3 bg-card font-mono text-xs h-96 overflow-auto text-left">
            {activeTab === "stream" && (
              <div className="space-y-1">
                {streamLines.map((line, i) => (
                  <div
                    key={i}
                    className="text-muted-foreground truncate animate-in fade-in slide-in-from-bottom-1 duration-200"
                  >
                    {line}
                  </div>
                ))}
                {phase === "streaming" && streamLines.length < STAGES.length && (
                  <div className="flex gap-1 mt-2">
                    <span className="w-1 h-1 bg-muted-foreground rounded-full animate-pulse" />
                    <span className="w-1 h-1 bg-muted-foreground rounded-full animate-pulse [animation-delay:75ms]" />
                    <span className="w-1 h-1 bg-muted-foreground rounded-full animate-pulse [animation-delay:150ms]" />
                  </div>
                )}
                {streamLines.length === 0 && phase !== "streaming" && (
                  <div className="text-muted-foreground/50">waiting...</div>
                )}
              </div>
            )}
            <div className={activeTab === "json" ? "" : "hidden"}>
              <CodeBlock code={jsonCode} lang="json" />
            </div>
            <div className={activeTab === "code" ? "" : "hidden"}>
              <CodeBlock code={CODE_EXAMPLE} lang="tsx" />
            </div>
          </div>
        </div>

        {/* Rendered output */}
        <div>
          <div className="text-xs text-muted-foreground mb-2 font-mono">render</div>
          <div className="border border-border rounded p-3 bg-card h-96 flex items-center justify-center">
            {renderPreview()}
          </div>
        </div>
      </div>
    </div>
  );
}
