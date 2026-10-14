"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { GuideId } from "@/data/pulse/guides";
import { DEFAULT_DRAFT } from "@/data/pulse/product";
import { getSources, type ServiceId, type SourceRecord } from "@/data/pulse/sources";
import { PulsePanels } from "./PulsePanels";

// Site-wide PULSE state. Everything here lives in page memory only: it survives moving
// between pages of the site, and disappears on refresh or when the tab closes.
// Nothing is written to browser storage.

export type PanelName = "draft" | "journey" | "evidence" | "how" | "sources";
export type SourcesBack = "journey" | "evidence" | null;

export type StartStage = "options" | "guides" | "unsure";

type ProcessState = { step: number; all: boolean; opened: boolean };

type Ctx = {
  draft: string;
  setDraft: (v: string) => void;
  service: ServiceId;
  setService: (s: ServiceId) => void;
  process: ProcessState;
  setProcess: (p: Partial<ProcessState>) => void;
  panel: PanelName | null;
  openPanel: (p: PanelName) => void;
  closePanel: () => void;
  sources: SourceRecord[];
  sourcesBack: SourcesBack;
  openSources: (idsOrRecords: string[] | SourceRecord[], back?: SourcesBack) => void;
  /** A starter question waiting to be placed (editable) in the next chat. */
  chatSeed: string;
  takeChatSeed: () => string;
  startChat: (guide: GuideId, seed?: string) => void;
  /** Where the guided start (/start) should open, and the starter question to carry into a chat. */
  startStage: StartStage;
  openStart: (stage?: StartStage, seed?: string) => void;
  consumeStartStage: () => StartStage;
  /** Bumped by Clear so the open chat resets too. */
  sessionKey: number;
  clearSession: () => void;
};

const PulseCtx = createContext<Ctx | null>(null);

export function PulseProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [draft, setDraft] = useState(DEFAULT_DRAFT);
  const [service, setServiceState] = useState<ServiceId>("childline");
  const [process, setProcessState] = useState<ProcessState>({ step: 0, all: false, opened: false });
  const [panel, setPanel] = useState<PanelName | null>(null);
  const [sources, setSources] = useState<SourceRecord[]>([]);
  const [sourcesBack, setSourcesBack] = useState<SourcesBack>(null);
  const [chatSeed, setChatSeed] = useState("");
  const [sessionKey, setSessionKey] = useState(0);
  const [startStage, setStartStage] = useState<StartStage>("options");

  const setService = useCallback((s: ServiceId) => {
    setServiceState(s);
    setProcessState({ step: 0, all: false, opened: false });
  }, []);
  const setProcess = useCallback((p: Partial<ProcessState>) => setProcessState((cur) => ({ ...cur, ...p })), []);
  const openPanel = useCallback((p: PanelName) => setPanel(p), []);
  const closePanel = useCallback(() => setPanel(null), []);

  const openSources = useCallback((list: string[] | SourceRecord[], back: SourcesBack = null) => {
    const records = list.length && typeof list[0] === "string" ? getSources(list as string[]) : (list as SourceRecord[]);
    setSources(records);
    setSourcesBack(back);
    setPanel("sources");
  }, []);

  const takeChatSeed = useCallback(() => {
    const s = chatSeed;
    setChatSeed("");
    return s;
  }, [chatSeed]);

  const startChat = useCallback(
    (guide: GuideId, seed = "") => {
      setChatSeed(seed);
      setPanel(null);
      router.push(`/chat/${guide}`);
    },
    [router],
  );

  const openStart = useCallback(
    (stage: StartStage = "options", seed = "") => {
      setStartStage(stage);
      setChatSeed(seed);
      setPanel(null);
      router.push("/start");
    },
    [router],
  );

  const consumeStartStage = useCallback(() => {
    const s = startStage;
    setStartStage("options");
    return s;
  }, [startStage]);

  const clearSession = useCallback(() => {
    setDraft(DEFAULT_DRAFT);
    setChatSeed("");
    setSessionKey((k) => k + 1);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      draft,
      setDraft,
      service,
      setService,
      process,
      setProcess,
      panel,
      openPanel,
      closePanel,
      sources,
      sourcesBack,
      openSources,
      chatSeed,
      takeChatSeed,
      startChat,
      startStage,
      openStart,
      consumeStartStage,
      sessionKey,
      clearSession,
    }),
    [draft, service, setService, process, setProcess, panel, openPanel, closePanel, sources, sourcesBack, openSources, chatSeed, takeChatSeed, startChat, startStage, openStart, consumeStartStage, sessionKey, clearSession],
  );

  return (
    <PulseCtx.Provider value={value}>
      {children}
      <PulsePanels />
    </PulseCtx.Provider>
  );
}

export function usePulse() {
  const ctx = useContext(PulseCtx);
  if (!ctx) throw new Error("usePulse must be used inside PulseProvider");
  return ctx;
}
