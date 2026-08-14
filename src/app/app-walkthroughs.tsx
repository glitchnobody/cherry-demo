"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import type { AppExampleKey } from "@/lib/app-examples";
import { ArchiveIcon } from "@phosphor-icons/react/dist/csr/Archive";
import { ChatCircleIcon } from "@phosphor-icons/react/dist/csr/ChatCircle";
import { FIXED_LOGO_URL } from "@/lib/brand-assets";
import { DotsThreeVerticalIcon } from "@phosphor-icons/react/dist/csr/DotsThreeVertical";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { MicrophoneIcon } from "@phosphor-icons/react/dist/csr/Microphone";
import { PaperPlaneRightIcon } from "@phosphor-icons/react/dist/csr/PaperPlaneRight";
import { PhoneIcon } from "@phosphor-icons/react/dist/csr/Phone";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { SmileyIcon } from "@phosphor-icons/react/dist/csr/Smiley";
import { UsersThreeIcon } from "@phosphor-icons/react/dist/csr/UsersThree";
import { VideoCameraIcon } from "@phosphor-icons/react/dist/csr/VideoCamera";
import { BellIcon } from "@phosphor-icons/react/dist/csr/Bell";
import { CalendarBlankIcon } from "@phosphor-icons/react/dist/csr/CalendarBlank";
import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import { GearIcon } from "@phosphor-icons/react/dist/csr/Gear";
import { GiftIcon } from "@phosphor-icons/react/dist/csr/Gift";
import { GifIcon } from "@phosphor-icons/react/dist/csr/Gif";
import { HashIcon } from "@phosphor-icons/react/dist/csr/Hash";
import { HeadphonesIcon } from "@phosphor-icons/react/dist/csr/Headphones";
import { PushPinIcon } from "@phosphor-icons/react/dist/csr/PushPin";
import { SpeakerHighIcon } from "@phosphor-icons/react/dist/csr/SpeakerHigh";
import { StickerIcon } from "@phosphor-icons/react/dist/csr/Sticker";
import { UserPlusIcon } from "@phosphor-icons/react/dist/csr/UserPlus";

type AppWalkthroughProps = {
  app: AppExampleKey;
  appName: string;
  onClose: () => void;
};

function WindowShell({
  app,
  title,
  children,
  onClose,
}: {
  app: AppExampleKey;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <section className={`demo-window demo-window-${app}`} aria-label={`${title} demo`}>
      <div className="demo-window-bar">
        <div className="window-controls">
          <button
            className="window-dot window-close"
            onClick={onClose}
            type="button"
            aria-label={`Close ${title}`}
          />
          <span className="window-dot window-minimize" aria-hidden="true" />
          <span className="window-dot window-expand" aria-hidden="true" />
        </div>
        <strong>{title}</strong>
      </div>
      <div className="demo-window-body">{children}</div>
    </section>
  );
}

function SponsoredCard({
  brand,
  copy,
  action,
}: {
  brand: string;
  copy: string;
  action: string;
}) {
  return (
    <aside className="sponsored-card">
      <span className="sponsored-label">Cherry Sponsored Ad</span>
      <div className="sponsored-copy">
        <strong>{brand}</strong>
        <p>{copy}</p>
      </div>
      <button type="button">{action}</button>
    </aside>
  );
}

const OPEN_CODE_RESPONSE_LINES = [
  { kind: "copy", text: "I’ll inspect the project and prepare a production deployment." },
  { kind: "tool", text: "✱ Read package.json" },
  { kind: "tool", text: "✱ Read next.config.ts" },
  { kind: "tool", text: "✱ Bash npm run build" },
  { kind: "copy", text: "The production build passes. Your app is ready to deploy." },
  {
    kind: "success",
    text: "✓ Deployment plan ready — build and environment configuration verified.",
  },
  { kind: "disclosure", text: "[Cherry sponsored ad]" },
  {
    kind: "sponsor-copy",
    text: "Railway fits this Next.js project well: automatic builds, environment variables, and managed infrastructure.",
  },
  {
    kind: "sponsor-copy",
    text: "Let me know if you want to go forward with Railway and get $5 in free credits.",
  },
] as const;

function TerminalDemo({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [typedCommand, setTypedCommand] = useState("");
  const [showEnterHint, setShowEnterHint] = useState(false);
  const [typedQuery, setTypedQuery] = useState("");
  const [showQueryEnter, setShowQueryEnter] = useState(false);
  const [responseLength, setResponseLength] = useState(0);
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const command = "opencode";
    let characterIndex = 0;
    let hintTimer: number | undefined;
    const typingTimer = window.setInterval(() => {
      characterIndex += 1;
      setTypedCommand(command.slice(0, characterIndex));

      if (characterIndex === command.length) {
        window.clearInterval(typingTimer);
        hintTimer = window.setTimeout(() => setShowEnterHint(true), 3000);
      }
    }, 115);

    return () => {
      window.clearInterval(typingTimer);
      if (hintTimer) window.clearTimeout(hintTimer);
    };
  }, []);

  useEffect(() => {
    if (step !== 0 || typedCommand !== "opencode") return;

    const launchOpenCode = (event: KeyboardEvent) => {
      if (event.key === "Enter") setStep(1);
    };
    window.addEventListener("keydown", launchOpenCode);
    return () => window.removeEventListener("keydown", launchOpenCode);
  }, [step, typedCommand]);

  useEffect(() => {
    if (step !== 1) return;

    const query = "Help me deploy this Next.js app";
    let characterIndex = 0;
    let hintTimer: number | undefined;

    const typingTimer = window.setInterval(() => {
      characterIndex += 1;
      setTypedQuery(query.slice(0, characterIndex));

      if (characterIndex === query.length) {
        window.clearInterval(typingTimer);
        hintTimer = window.setTimeout(() => setShowQueryEnter(true), 3000);
      }
    }, 52);

    return () => {
      window.clearInterval(typingTimer);
      if (hintTimer) window.clearTimeout(hintTimer);
    };
  }, [step]);

  useEffect(() => {
    if (step !== 1 || typedQuery !== "Help me deploy this Next.js app") return;

    const submitQuery = (event: KeyboardEvent) => {
      if (event.key === "Enter") setStep(2);
    };
    window.addEventListener("keydown", submitQuery);
    return () => window.removeEventListener("keydown", submitQuery);
  }, [step, typedQuery]);

  useEffect(() => {
    if (step !== 2) return;

    const totalLength = OPEN_CODE_RESPONSE_LINES.reduce(
      (total, line) => total + line.text.length,
      0,
    );
    const responseTimer = window.setInterval(() => {
      setResponseLength((current) => {
        if (current >= totalLength) {
          window.clearInterval(responseTimer);
          return current;
        }
        return Math.min(current + 2, totalLength);
      });
    }, 18);

    return () => window.clearInterval(responseTimer);
  }, [step]);

  useEffect(() => {
    if (step === 2 && transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [step, responseLength]);

  function visibleResponseLine(lineIndex: number) {
    const consumed = OPEN_CODE_RESPONSE_LINES
      .slice(0, lineIndex)
      .reduce((total, line) => total + line.text.length, 0);
    return OPEN_CODE_RESPONSE_LINES[lineIndex].text.slice(
      0,
      Math.max(0, responseLength - consumed),
    );
  }

  return (
    <WindowShell app="terminal" title={step === 0 ? "Terminal" : "OpenCode"} onClose={onClose}>
      <div className="terminal-screen">
        {step === 0 ? (
          <div className="terminal-launch">
            <div className="terminal-history">
              <p className="terminal-muted">Last login: today on ttys001</p>
              <p className="terminal-shell-prompt">
                cherry@studio ~ %&nbsp;
                <span className="terminal-typed-command">{typedCommand}</span>
                <span className="terminal-caret" aria-hidden="true" />
              </p>
              {showEnterHint && (
                <button
                  className="terminal-enter-hint terminal-enter-hint-inline"
                  type="button"
                  onClick={() => setStep(1)}
                  aria-label="Press Enter to launch OpenCode"
                >
                  ↵ Press Enter
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="opencode-tui">
            {step === 1 ? (
              <div className="oc-start-screen">
                <Image
                  className="oc-wordmark"
                  src="/assets/opencode-wordmark.svg"
                  alt="OpenCode"
                  width={234}
                  height={42}
                  priority
                />
                <div className="oc-start-composer">
                  <div className="oc-start-input">
                    <span className="oc-prompt-icon">A⌁</span>
                    <span className="oc-typed-query">{typedQuery}</span>
                    <span className="terminal-caret" aria-hidden="true" />
                  </div>
                  <div className="oc-start-meta">
                    <span><i /> Build&nbsp; · &nbsp;<b>Claude Sonnet 4</b></span>
                    <span className="oc-vercel-pill">
                      Cherry Sponsored Ad · Vercel <kbd>P</kbd>
                    </span>
                  </div>
                  <div className="oc-start-shortcuts">
                    <span>tab switch agent&nbsp;&nbsp; ctrl+p commands</span>
                    {showQueryEnter && (
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        aria-label="Press Enter to submit OpenCode prompt"
                      >
                        Press Enter ↵
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="oc-task-title">
                  <strong># Deploy this Next.js app</strong>
                  <span>8,214&nbsp;&nbsp;12% ($0.08)</span>
                </div>

                <div className="oc-transcript" ref={transcriptRef}>
                  <div className="oc-user-prompt">Help me deploy this Next.js app</div>
                  <div className="oc-streamed-response" aria-live="polite">
                    {OPEN_CODE_RESPONSE_LINES.map((line, index) => {
                      const visibleText = visibleResponseLine(index);
                      if (!visibleText) return null;
                      return (
                        <p className={`oc-stream-line oc-stream-${line.kind}`} key={line.text}>
                          {visibleText}
                          {visibleText.length < line.text.length && (
                            <span className="oc-stream-caret" aria-hidden="true" />
                          )}
                        </p>
                      );
                    })}
                  </div>
                </div>

                <div className="oc-composer-wrap">
                  <div className="oc-followup">
                    <span className="oc-block-cursor" aria-hidden="true" />
                    <div className="oc-followup-meta">
                      <span><b>Build</b>&nbsp;&nbsp; Claude Opus 4.5&nbsp;&nbsp; <em>OpenCode Zen</em></span>
                    </div>
                  </div>
                  <div className="oc-shortcuts"><span><i>········</i>&nbsp;&nbsp; esc interrupt</span><span>ctrl+t variants&nbsp;&nbsp; tab agents&nbsp;&nbsp; ctrl+p commands</span></div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </WindowShell>
  );
}

function WhatsAppDemo({ onClose }: { onClose: () => void }) {
  const query = "Plan a 7-day trip to Japan for me";
  const [typedMessage, setTypedMessage] = useState("");
  const [showEnter, setShowEnter] = useState(false);
  const [phase, setPhase] = useState(0);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let characterIndex = 0;
    let hintTimer: number | undefined;
    const typingTimer = window.setInterval(() => {
      characterIndex += 1;
      setTypedMessage(query.slice(0, characterIndex));
      if (characterIndex === query.length) {
        window.clearInterval(typingTimer);
        hintTimer = window.setTimeout(() => setShowEnter(true), 3000);
      }
    }, 55);

    return () => {
      window.clearInterval(typingTimer);
      if (hintTimer) window.clearTimeout(hintTimer);
    };
  }, []);

  function sendMessage() {
    if (typedMessage !== query || phase > 0) return;
    setShowEnter(false);
    setPhase(1);
  }

  useEffect(() => {
    if (phase === 0 || phase >= 6) return;
    const delays = [0, 500, 1300, 950, 900, 850];
    const timer = window.setTimeout(() => setPhase((current) => current + 1), delays[phase]);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase > 0 && messagesRef.current) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== 0 || typedMessage !== query) return;
    const submit = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        setShowEnter(false);
        setPhase(1);
      }
    };
    window.addEventListener("keydown", submit);
    return () => window.removeEventListener("keydown", submit);
  }, [phase, typedMessage]);

  return (
    <WindowShell app="whatsapp" title="WhatsApp" onClose={onClose}>
      <div className="whatsapp-layout">
        <nav className="wa-nav-rail" aria-label="WhatsApp navigation">
          <div className="wa-nav-logo">◒<span>1</span></div>
          <button type="button" className="active" aria-label="Chats"><ChatCircleIcon size={20} weight="fill" /></button>
          <button type="button" aria-label="Calls"><PhoneIcon size={20} /></button>
          <button type="button" aria-label="Communities"><UsersThreeIcon size={20} /></button>
          <div className="wa-nav-spacer" />
          <Image className="wa-mini-avatar" src="/assets/whatsapp-user.png" alt="Your profile" width={30} height={30} />
        </nav>
        <aside className="wa-sidebar">
          <header className="wa-sidebar-header"><strong>WhatsApp</strong><div><button type="button" aria-label="New chat"><PlusIcon size={18} /></button><button type="button" aria-label="Menu"><DotsThreeVerticalIcon size={18} /></button></div></header>
          <div className="wa-search"><MagnifyingGlassIcon size={15} /><span>Search or start a new chat</span></div>
          <div className="wa-filter-pills"><span className="active">All</span><span>Unread 1</span><span>Favorites</span><span>Groups</span></div>
          <div className="wa-archived"><ArchiveIcon size={17} /><span>Archived</span><b>3</b></div>
          <div className="wa-contact active"><Image className="wa-contact-avatar" src="/assets/flight-assistant.png" alt="" width={42} height={42} /><div><strong>Flight Assistant</strong><small>Your personal trip planner</small></div><time>now</time></div>
          <div className="wa-contact"><span className="wa-contact-avatar family">F</span><div><strong>Family</strong><small>See you at dinner!</small></div><time>9:42 PM</time></div>
          <div className="wa-contact"><Image className="wa-contact-avatar work-logo" src="/assets/scribble.png" alt="" width={42} height={42} /><div><strong>Work Crew</strong><small>Maya: shared a document</small></div><time>8:16 PM</time></div>
          <div className="wa-contact"><Image className="wa-contact-avatar" src="/assets/jordan-profile.png" alt="" width={42} height={42} /><div><strong>Jordan</strong><small>Sounds good 👍</small></div><time>Yesterday</time></div>
          <div className="wa-contact"><span className="wa-contact-avatar japan">日</span><div><strong>Japan planning</strong><small>Flights and hotels</small></div><time>Tuesday</time></div>
        </aside>
        <section className="wa-chat">
          <header><Image className="wa-contact-avatar" src="/assets/flight-assistant.png" alt="" width={42} height={42} /><div><strong>Flight Assistant</strong><small>online</small></div><nav><button type="button" aria-label="Video call"><VideoCameraIcon size={18} /></button><button type="button" aria-label="Search conversation"><MagnifyingGlassIcon size={18} /></button><button type="button" aria-label="Conversation menu"><DotsThreeVerticalIcon size={18} /></button></nav></header>
          <div className="wa-messages" ref={messagesRef}>
            <span className="wa-date">TODAY</span>
            <div className="wa-bubble incoming">Hi! Tell me where you’d like to go and I’ll build your itinerary.</div>
            {phase >= 1 && (
              <>
                <div className="wa-bubble outgoing">
                  {query}
                  <span className="wa-message-meta">
                    <time>10:31 PM</time>
                    <span
                      className={`wa-checks${phase >= 2 ? " delivered" : ""}${phase >= 3 ? " read" : ""}`}
                      aria-label={phase >= 3 ? "Read" : phase >= 2 ? "Delivered" : "Sent"}
                    >
                      <i />
                      <i />
                    </span>
                  </span>
                </div>
                {phase === 2 && <div className="wa-typing" aria-label="Flight Assistant is typing"><i /><i /><i /></div>}
                {phase >= 3 && <div className="wa-bubble incoming wa-itinerary"><strong>I’ve planned your 7-day Japan itinerary 🇯🇵</strong><p><b>Days 1–3 · Tokyo</b><br />Explore Meiji Shrine and Shibuya, join an evening food tour, then take a day trip toward Mount Fuji.</p><time>10:32 PM</time></div>}
                {phase >= 4 && <div className="wa-bubble incoming wa-itinerary"><p><b>Day 4 · Hakone</b><br />Ride the mountain railway, see Lake Ashi, and unwind at an onsen.<br /><br /><b>Days 5–7 · Kyoto</b><br />Visit Fushimi Inari early, eat through Nishiki Market, and finish in Arashiyama.</p><time>10:32 PM</time></div>}
                {phase >= 5 && <article className="wa-sponsored"><div className="wa-ad-image"><span>JAPAN</span><strong>Stay connected from touchdown.</strong></div><div className="wa-ad-copy"><small>Cherry Sponsored Ad</small><strong>Airalo</strong><p>10 GB Japan eSIM · 30 days<br />Instant activation before your flight.</p><time>10:33 PM</time></div><button type="button">View Japan plans</button></article>}
                {phase >= 6 && <article className="wa-bot-actions"><div className="wa-action-copy"><strong>Want me to start organizing it?</strong><p>I can help with the next steps from this itinerary.</p><time>10:33 PM</time></div><button type="button">Find flights</button><button type="button">Book hotels</button><button type="button">Reserve experiences</button><button className="wa-sponsored-action" type="button">Buy my Japan eSIM</button><small>Cherry Sponsored Ad · Airalo</small></article>}
              </>
            )}
          </div>
          {phase === 0 ? (
            <div className="wa-compose">
              <PlusIcon size={19} /><SmileyIcon size={19} />
              <div className="wa-compose-input"><span>{typedMessage}</span><i /></div>
              <button type="button" onClick={sendMessage} aria-label="Send message"><PaperPlaneRightIcon size={18} weight="fill" /></button>
              {showEnter && <button className="wa-enter-hint" type="button" onClick={sendMessage}>Press Enter ↵</button>}
            </div>
          ) : <div className="wa-compose"><PlusIcon size={19} /><SmileyIcon size={19} /><div className="wa-compose-input muted"><span>Type a message</span></div><MicrophoneIcon size={19} /></div>}
        </section>
      </div>
    </WindowShell>
  );
}

function DiscordDemo({ onClose }: { onClose: () => void }) {
  const query = "What should we play together tonight?";
  const [typedMessage, setTypedMessage] = useState("");
  const [showEnter, setShowEnter] = useState(false);
  const [phase, setPhase] = useState(0);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let index = 0;
    let hintTimer: number | undefined;
    const typingTimer = window.setInterval(() => {
      index += 1;
      setTypedMessage(query.slice(0, index));
      if (index === query.length) {
        window.clearInterval(typingTimer);
        hintTimer = window.setTimeout(() => setShowEnter(true), 3000);
      }
    }, 52);
    return () => { window.clearInterval(typingTimer); if (hintTimer) window.clearTimeout(hintTimer); };
  }, []);

  function sendDiscordMessage() {
    if (typedMessage !== query || phase > 0) return;
    setShowEnter(false);
    setPhase(1);
  }

  useEffect(() => {
    if (phase === 0 || phase >= 6) return;
    const delays = [0, 650, 1050, 500, 500, 850];
    const timer = window.setTimeout(() => setPhase((current) => current + 1), delays[phase]);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase > 0 && messagesRef.current) messagesRef.current.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [phase]);

  useEffect(() => {
    if (phase !== 0 || typedMessage !== query) return;
    const submit = (event: KeyboardEvent) => { if (event.key === "Enter") { setShowEnter(false); setPhase(1); } };
    window.addEventListener("keydown", submit);
    return () => window.removeEventListener("keydown", submit);
  }, [phase, typedMessage]);

  const serverIcons = [
    "discord-server-game-night.png", "discord-server-2.png", "discord-server-3.png",
    "discord-server-4.png", "discord-server-5.png", "discord-server-6.png",
  ];

  return (
    <WindowShell app="discord" title="Discord" onClose={onClose}>
      <div className="discord-layout">
        <nav className="discord-servers">
          <Image className="discord-home" src="/assets/discord.png" alt="Discord" width={38} height={38} />
          <i />
          {serverIcons.map((icon, index) => <Image key={icon} className={index === 0 ? "active" : ""} src={`/assets/${icon}`} alt="" width={38} height={38} />)}
          <button type="button" aria-label="Add server"><PlusIcon size={18} /></button>
        </nav>
        <aside className="discord-channels">
          <header><strong>Game Night</strong><CaretDownIcon size={13} /></header>
          <div className="discord-event"><CalendarBlankIcon size={15} /><span>Events</span></div>
          <small>PINNED CHANNELS</small>
          <p><HashIcon size={15} /> general</p><p className="active"><HashIcon size={15} /> game-night <UserPlusIcon size={13} /><GearIcon size={13} /></p><p><HashIcon size={15} /> clips</p>
          <small>GAME ROOMS</small><p><HashIcon size={15} /> looking-for-group</p><p><HashIcon size={15} /> screenshots</p>
          <small>VOICE CHANNELS</small><p><SpeakerHighIcon size={15} /> Lobby</p><p><SpeakerHighIcon size={15} /> Ranked</p>
          <footer><Image src="/assets/discord-user-cherry.png" alt="" width={30} height={30} /><div><strong>cherryplayer</strong><small>Online</small></div><MicrophoneIcon size={15} /><HeadphonesIcon size={15} /><GearIcon size={15} /></footer>
        </aside>
        <header className="discord-main-header"><HashIcon size={18} /><strong>game-night</strong><span>Pick tonight’s game with the squad</span><nav><BellIcon size={17} /><PushPinIcon size={17} /><UsersThreeIcon size={18} /><div><span>Search Game Night</span><MagnifyingGlassIcon size={14} /></div></nav></header>
        <section className="discord-chat">
          <div className="discord-messages" ref={messagesRef}>
            <div className="discord-welcome"><span>#</span><strong>Welcome to #game-night!</strong><p>Coordinate sessions, share clips, and find the next squad favorite.</p></div>
            <div className="discord-message"><Image className="discord-avatar" src="/assets/discord-bot.png" alt="" width={34} height={34} /><div><strong>Game Night Bot <em>APP</em></strong><small>Today at 8:30 PM</small><p>Ready when you are. Ask me to plan tonight’s session!</p></div></div>
            {phase >= 1 && (
              <>
                <div className="discord-message"><Image className="discord-avatar" src="/assets/discord-user-cherry.png" alt="" width={38} height={38} /><div><strong>cherryplayer</strong><small>Today at 8:31 PM</small><p>{query}</p></div></div>
                {phase === 2 && <div className="discord-typing"><Image className="discord-avatar" src="/assets/discord-bot.png" alt="" width={34} height={34} /><div><i /><i /><i /></div><small>Game Night Bot is typing…</small></div>}
                {phase >= 3 && <div className="discord-message"><Image className="discord-avatar" src="/assets/discord-bot.png" alt="" width={34} height={34} /><div><strong>Game Night Bot <em>APP</em></strong><small>Today at 8:31 PM</small><p>Let’s put it to a squad vote. Pick tonight’s game:</p><div className="discord-poll">{phase >= 3 && <button type="button">🚀 <span><strong>Helldivers 2</strong><small>Co-op action · 4 players</small></span></button>}{phase >= 4 && <button type="button">🏴‍☠️ <span><strong>Sea of Thieves</strong><small>Open-world adventure</small></span></button>}{phase >= 5 && <button type="button">⚽ <span><strong>Rocket League</strong><small>Quick matches · everyone welcome</small></span></button>}</div>{phase >= 6 && <div className="discord-embed"><i /><span>Cherry Sponsored Ad</span><strong>Xbox Game Pass</strong><p>Play hundreds of multiplayer games with your squad—including tonight’s picks.</p><div className="discord-xbox-art">XBOX <b>GAME PASS</b></div><button type="button">Explore games</button></div>}</div></div>}
              </>
            )}
          </div>
          <div className="discord-compose"><PlusIcon size={18} /><div><span>{phase === 0 ? typedMessage : "Message #game-night"}</span>{phase === 0 && <i />}</div><GiftIcon size={17} /><GifIcon size={17} /><StickerIcon size={17} /><SmileyIcon size={17} />{showEnter && <button type="button" onClick={sendDiscordMessage}>Press Enter ↵</button>}</div>
        </section>
        <aside className="discord-members"><small>ONLINE — 4</small><p><span className="member-avatar"><Image src="/assets/discord-bot.png" alt="" width={30} height={30} /><i /></span><span><strong>Game Night Bot <em>APP</em></strong><small>Planning tonight’s game</small></span></p><p><Image src="/assets/discord-user-luna.png" alt="" width={30} height={30} /><span><strong>Luna</strong><small>Playing Stardew Valley</small></span></p><p><Image src="/assets/discord-user-milo.png" alt="" width={30} height={30} /><span><strong>Milo</strong><small>Online</small></span></p><p><Image src="/assets/discord-user-cherry.png" alt="" width={30} height={30} /><span><strong>cherryplayer</strong><small>Online</small></span></p><small>OFFLINE — 2</small><p className="offline"><Image src="/assets/discord-user-nova.png" alt="" width={30} height={30} /><span><strong>Nova</strong></span></p></aside>
      </div>
    </WindowShell>
  );
}

function MiroDemo({ onClose }: { onClose: () => void }) {
  const prompt = "Create a launch plan for a new fitness app";
  const loadingMessages = ["Understanding your launch goals…", "Organizing milestones…", "Building your launch board…"];
  const [step, setStep] = useState(0);
  const [typedPrompt, setTypedPrompt] = useState("");
  const [loadingMessage, setLoadingMessage] = useState(0);
  const [showEnter, setShowEnter] = useState(false);

  useEffect(() => {
    if (step !== 0 || typedPrompt === prompt) return;
    const timer = window.setTimeout(() => setTypedPrompt(prompt.slice(0, typedPrompt.length + 1)), 46);
    return () => window.clearTimeout(timer);
  }, [prompt, step, typedPrompt]);

  useEffect(() => {
    if (step !== 0 || typedPrompt !== prompt) return;
    const hintTimer = window.setTimeout(() => setShowEnter(true), 2000);
    const handleEnter = (event: KeyboardEvent) => {
      if (event.key !== "Enter") return;
      setLoadingMessage(0);
      setStep(1);
    };
    window.addEventListener("keydown", handleEnter);
    return () => {
      window.clearTimeout(hintTimer);
      window.removeEventListener("keydown", handleEnter);
    };
  }, [prompt, step, typedPrompt]);

  useEffect(() => {
    if (step !== 1) return;
    const messageTimer = window.setInterval(() => setLoadingMessage((current) => Math.min(current + 1, 2)), 1250);
    const finishTimer = window.setTimeout(() => setStep(2), 4200);
    return () => {
      window.clearInterval(messageTimer);
      window.clearTimeout(finishTimer);
    };
  }, [step]);

  const generateBoard = () => {
    setShowEnter(false);
    setLoadingMessage(0);
    setStep(1);
  };

  return (
    <WindowShell app="miro" title="Miro" onClose={onClose}>
      <div className="miro-app">
        <header className="miro-board-menu"><button type="button" aria-label="Main menu">☰</button><strong className="miro-wordmark">miro</strong><span>🧪</span><b>Fitness app launch plan</b><button type="button" aria-label="More options">⋮</button></header>
        <div className="miro-actions"><span>〽</span><span>◉</span><div className="miro-collaborators"><i>AM</i><i>JK</i><i>RS</i><b>7⌄</b></div><button type="button">▶&nbsp; Present</button><button className="miro-share" type="button">Share</button></div>
        <aside className="miro-toolbar"><button type="button" aria-label="Miro AI">✦</button><button className="active" type="button">➤</button><button type="button">▣</button><button type="button">▢</button><button type="button">T</button><button type="button">◇</button><button type="button">✎</button><button type="button">＋</button></aside>
        <div className="miro-board">
          {step === 0 && <div className="miro-empty"><span>✦</span><strong>Create with Miro AI</strong><p>Describe the board you want to build.</p><div><div className="miro-prompt"><span>{typedPrompt}</span><i /></div><button type="button" onClick={generateBoard}>Generate</button></div>{showEnter && <small>Press Enter ↵</small>}</div>}
          {step === 1 && <div className="miro-generating"><div className="miro-generation-status"><div className="miro-spinner" /><div><small>MIRO AI</small><strong>{loadingMessages[loadingMessage]}</strong></div></div><div className="miro-progress"><i /></div><aside className="miro-loading-sponsor"><div><div className="miro-sponsor-title"><strong>RevenueCat</strong><span className="miro-sponsor-pill">Cherry Sponsored Ad</span></div><p>Subscriptions and trials for mobile apps</p></div><button type="button">Learn more ↗</button></aside></div>}
          {step === 2 && <div className="miro-canvas">
            <div className="miro-board-title"><small>PRODUCT LAUNCH</small><strong>FitFlow launch plan</strong><span>Six-week go-to-market workspace</span></div>
            <section className="miro-frame miro-goals"><header><strong>Launch goals</strong><span>3 notes</span></header><div><i>Reach 10k installs</i><i>Validate premium plan</i><i>Build a referral loop</i></div></section>
            <section className="miro-frame miro-timeline"><header><strong>Six-week timeline</strong><span>May — June</span></header><div className="miro-track"><b>Research</b><b>Beta</b><b>Creator launch</b><b>Release</b></div><div className="miro-week-labels"><span>W1</span><span>W2</span><span>W3</span><span>W4</span><span>W5</span><span>W6</span></div></section>
            <section className="miro-frame miro-channels"><header><strong>Launch channels</strong><span>Owner</span></header><p><i>●</i> App Store optimization <b>Jordan</b></p><p><i>●</i> Fitness creators <b>Maya</b></p><p><i>●</i> Community challenge <b>Alex</b></p></section>
            <section className="miro-frame miro-metrics"><header><strong>Success metrics</strong></header><div><span><b>10k</b> installs</span><span><b>32%</b> activation</span><span><b>18%</b> paid</span></div></section>
            <aside className="miro-drag-sponsor"><span className="miro-sponsor-pill">Cherry Sponsored Ad</span><strong>RevenueCat</strong><p>Add subscriptions and trials to FitFlow.</p><button type="button">Explore setup →</button></aside>
            <div className="miro-ai-cursor"><i /><span>Miro AI</span></div>
          </div>}
          <div className="miro-zoom"><button type="button">☷</button><button type="button">−</button><b>82%</b><button type="button">＋</button><button type="button">?</button></div>
        </div>
      </div>
    </WindowShell>
  );
}

function OllamaDemo({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);

  return (
    <WindowShell app="ollama" title="Ollama" onClose={onClose}>
      <div className="ollama-app">
        <aside><div className="ollama-wordmark">🦙 <strong>ollama</strong></div><button type="button">＋ New chat</button><small>Today</small><p className="active">Private document assistant</p><p>Model benchmarks</p><div className="ollama-model">● llama3.2:latest</div></aside>
        <section><header><strong>Private document assistant</strong><span>Local</span></header><div className="ollama-chat"><div className="ollama-welcome"><span>🦙</span><strong>How can I help?</strong><p>Messages and model inference stay on this device.</p></div>{sent && <><div className="ollama-user">Help me build a private AI assistant for my documents</div><div className="ollama-answer"><strong>Recommended local-first architecture</strong><ol><li>Run the language model locally with Ollama.</li><li>Parse and chunk documents on-device.</li><li>Create embeddings and store them in a local vector database.</li><li>Retrieve only relevant chunks for each question.</li></ol><SponsoredCard brand="Pinecone" copy="Add scalable vector search when your document collection grows." action="Explore Pinecone →" /></div></>}</div>{!sent && <div className="ollama-compose"><textarea value="Help me build a private AI assistant for my documents" readOnly /><div><span>llama3.2</span><button type="button" onClick={() => setSent(true)}>↑</button></div></div>}</section>
      </div>
    </WindowShell>
  );
}

function CursorDemo({ onClose }: { onClose: () => void }) {
  const prompt = "Use Paper MCP to create a landing page for a productivity app";
  const [phase, setPhase] = useState(0);
  const [activityStage, setActivityStage] = useState(0);
  const [typedPrompt, setTypedPrompt] = useState("");
  const [showEnter, setShowEnter] = useState(false);
  const cursorBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase !== 0 || typedPrompt === prompt) return;
    const timer = window.setTimeout(() => setTypedPrompt(prompt.slice(0, typedPrompt.length + 1)), 38);
    return () => window.clearTimeout(timer);
  }, [phase, prompt, typedPrompt]);

  useEffect(() => {
    if (phase !== 0 || typedPrompt !== prompt) return;
    const timer = window.setTimeout(() => setShowEnter(true), 2000);
    return () => window.clearTimeout(timer);
  }, [phase, prompt, typedPrompt]);

  useEffect(() => {
    if (phase !== 1) return;
    const timers = [
      window.setTimeout(() => setActivityStage(1), 600),
      window.setTimeout(() => setActivityStage(2), 1250),
      window.setTimeout(() => setActivityStage(3), 1950),
      window.setTimeout(() => setActivityStage(4), 2950),
      window.setTimeout(() => setPhase(2), 7200),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [phase]);

  useEffect(() => {
    cursorBodyRef.current?.scrollTo({ top: cursorBodyRef.current.scrollHeight, behavior: "smooth" });
  }, [activityStage, phase]);

  const sendCursorPrompt = () => {
    setShowEnter(false);
    setActivityStage(0);
    setPhase(1);
  };

  useEffect(() => {
    if (!showEnter || phase !== 0) return;
    const handleEnter = (event: KeyboardEvent) => {
      if (event.key === "Enter") sendCursorPrompt();
    };
    window.addEventListener("keydown", handleEnter);
    return () => window.removeEventListener("keydown", handleEnter);
  }, [phase, showEnter]);

  return (
    <WindowShell app="cursor" title="Cursor" onClose={onClose}>
      <div className={`cursor-app${phase >= 1 ? " cursor-plan-open" : ""}`}>
        <aside className="cursor-history"><header><strong>READY FOR REVIEW</strong><span>5</span></header><div className="cursor-history-item"><i>✓</i><div><strong>Build Landing Page</strong><span className="green">+70</span><small>Done. Fonts reloaded in the browser.</small></div><time>1h</time></div><div className="cursor-history-item"><i>✓</i><div><strong>PyTorch MNIST Experiments</strong><span className="green">+135 -21</span><small>Done, configurable MNIST experiment.</small></div><time>2h</time></div><div className="cursor-history-item"><i>✓</i><div><strong>Set up Cursor Rules</strong><small>Perfect! I&apos;ve created a comprehensive plan.</small></div><time>4h</time></div><div className="cursor-history-item active"><i>✓</i><div><strong>Productivity Landing Page</strong>{phase === 2 && <span className="green">+68</span>}<small>{phase === 2 ? "Drafted implementation steps in feature-prd.md" : "Planning with Paper MCP"}</small></div><time>now</time></div></aside>
        <section className="cursor-agent"><header><strong>Plan Productivity Landing Page</strong><span>⋯</span></header><div className="cursor-agent-body" ref={cursorBodyRef}>{phase >= 1 && <div className="cursor-user-prompt">{prompt}</div>}{phase >= 1 && <div className="cursor-activity"><p className={activityStage >= 1 ? "done" : "working"}><i />Thinking</p>{activityStage >= 1 && <p className={activityStage >= 2 ? "done" : "working"}><i />Reading the current project</p>}{activityStage >= 2 && <p className={activityStage >= 3 ? "done" : "working"}><i />Reviewing <code>page.tsx</code> and existing styles</p>}{activityStage >= 3 && <div className="cursor-paper-tool"><header><span className={phase === 2 ? "tool-check" : "tool-spinner"}>{phase === 2 ? "✓" : ""}</span><strong>paper · get_design_context</strong></header><p>{phase === 2 ? "Returned layout and component guidance" : "Gathering layout, typography, and component references…"}</p>{activityStage >= 4 && <aside className="cursor-mobbin-ad"><div><header className="cursor-mobbin-title"><strong>Mobbin</strong><span>Cherry Sponsored Ad</span></header><p>Browse proven landing-page patterns.</p></div><button type="button">View references ↗</button></aside>}</div>}</div>}{phase === 2 && <><div className="cursor-summary"><strong>Drafted implementation steps in <code>feature-prd.md</code>.</strong><p>Paper recommends a focused hero, benefits grid, social proof, and a high-contrast conversion section.</p></div><div className="cursor-question"><header><small>Questions</small><strong>Which visual direction should I use?</strong></header><button type="button"><i>1</i> Minimal and editorial</button><button type="button"><i>2</i> Bold product-led</button><button className="selected" type="button"><i>3</i> Use Paper&apos;s recommended direction</button><footer><span>Skip</span><button type="button">Continue</button></footer></div></>}</div><div className="cursor-composer"><div>{phase === 0 ? <><span>{typedPrompt}</span><i className="cursor-compose-caret" /></> : <span className="muted">Add follow-up…</span>}</div><footer><button type="button">Plan <CaretDownIcon size={8} weight="bold" /></button><button className="cursor-model" type="button">Grok 4.6 <CaretDownIcon size={8} /></button>{showEnter && <small>Press Enter ↵</small>}<button className="cursor-send" type="button" onClick={sendCursorPrompt}>↑</button></footer></div></section>
        <section className="cursor-prd"><header><span>feature-prd.md</span><i>×</i><span>page.tsx</span></header><div className="cursor-prd-meta"><span>Plans ›</span><strong>feature-prd.md</strong><b>Grok 4.6 <CaretDownIcon size={8} /></b><button type="button">Build</button></div><article className={phase >= 1 ? "writing" : ""}><h1>Productivity Landing Page</h1><p>Create a focused, conversion-oriented page for a modern productivity app.</p><h3>Page objective</h3><p>Communicate the product&apos;s value in under five seconds and guide visitors toward starting a free workspace.</p><h3>Recommended structure</h3><ol><li>Focused hero with one primary CTA</li><li>Three-column benefits grid</li><li>Customer logos and testimonial proof</li><li>High-contrast conversion section</li></ol><h3>Implementation tasks</h3><label><i /> Build the responsive hero in <code>page.tsx</code></label><label><i /> Add reusable benefit and testimonial cards</label><label><i /> Implement responsive states and polish</label></article></section>
      </div>
    </WindowShell>
  );
}

function ScribbleDemo({ appName, onClose }: { appName: string; onClose: () => void }) {
  const question = "Summarise the Scribble docs";
  const [chatOpen, setChatOpen] = useState(false);
  const [chatPhase, setChatPhase] = useState(0);
  const [typedQuestion, setTypedQuestion] = useState("");
  const [answerStage, setAnswerStage] = useState(0);
  const scribbleChatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatOpen || chatPhase !== 0 || typedQuestion === question) return;
    const timer = window.setTimeout(() => setTypedQuestion(question.slice(0, typedQuestion.length + 1)), 45);
    return () => window.clearTimeout(timer);
  }, [chatOpen, chatPhase, question, typedQuestion]);

  useEffect(() => {
    if (chatPhase !== 1) return;
    const timer = window.setTimeout(() => setChatPhase(2), 4300);
    return () => window.clearTimeout(timer);
  }, [chatPhase]);

  useEffect(() => {
    if (chatPhase !== 2) return;
    const timers = [
      window.setTimeout(() => setAnswerStage(1), 250),
      window.setTimeout(() => setAnswerStage(2), 1050),
      window.setTimeout(() => setAnswerStage(3), 1850),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [chatPhase]);

  useEffect(() => {
    scribbleChatRef.current?.scrollTo({ top: scribbleChatRef.current.scrollHeight, behavior: "smooth" });
  }, [answerStage, chatPhase]);

  const openChat = () => {
    setChatPhase(0);
    setTypedQuestion("");
    setAnswerStage(0);
    setChatOpen(true);
  };

  const sendQuestion = () => {
    if (chatPhase !== 0 || typedQuestion !== question) return;
    setChatPhase(1);
  };

  return (
    <WindowShell app="scribble" title="Scribble" onClose={onClose}>
      <div className="scribble-site">
        <iframe src="https://scribble.network/" title="Scribble Network website" loading="eager" scrolling="no" tabIndex={-1} />
        {chatOpen ? <><div className="scribble-chat-scrim" aria-hidden="true" /><aside className="scribble-chat"><header><span className="scribble-fixed-logo" style={{ backgroundImage: `url(${FIXED_LOGO_URL})` }} aria-hidden="true" /><div><strong>{appName} Assistant</strong><small>Free AI answers supplemented by ads</small></div><button type="button" onClick={() => setChatOpen(false)} aria-label="Close assistant">×</button></header><div className="scribble-chat-body" ref={scribbleChatRef}><div className="scribble-bot-message">Hi there! 👋 How can I help you with Scribble?</div>{chatPhase >= 1 && <div className="scribble-user-message">{question}</div>}{chatPhase === 1 && <div className="scribble-thinking"><div><i /><i /><i /></div><span>{appName} is reading the Scribble docs…</span><aside><b /><div><strong>Algolia</strong><em>Cherry Sponsored Ad</em><p>Search that understands your documentation.</p></div><button type="button">Learn more ↗</button></aside></div>}{chatPhase === 2 && <div className="scribble-answer">{answerStage >= 1 && <p>Scribble helps brands turn product knowledge into structured, citation-ready content that both customers and AI systems can understand.</p>}{answerStage >= 2 && <p>It brings documentation, content publishing, creator distribution, and measurable brand visibility into one workflow.</p>}{answerStage >= 3 && <p>For faster discovery across those published pages, <strong>Algolia</strong> <span>Cherry Sponsored Ad</span> can index the documentation and provide instant, relevant search inside the product.</p>}</div>}</div><div className="scribble-chat-input"><input value={chatPhase === 0 ? typedQuestion : ""} placeholder={chatPhase === 0 ? "" : "Ask a follow-up…"} readOnly aria-label={`Ask ${appName} Assistant`} /><button type="button" onClick={sendQuestion} aria-label="Send message">↑</button></div><footer>Powered by {appName} Ad Network</footer></aside></> : <button className="scribble-launcher" type="button" onClick={openChat} aria-label={`Open ${appName} Assistant`}><ChatCircleIcon size={28} weight="fill" /></button>}
      </div>
    </WindowShell>
  );
}

export function AppWalkthrough({ app, appName, onClose }: AppWalkthroughProps) {
  switch (app) {
    case "terminal": return <TerminalDemo onClose={onClose} />;
    case "whatsapp": return <WhatsAppDemo onClose={onClose} />;
    case "discord": return <DiscordDemo onClose={onClose} />;
    case "miro": return <MiroDemo onClose={onClose} />;
    case "ollama": return <OllamaDemo onClose={onClose} />;
    case "cursor": return <CursorDemo onClose={onClose} />;
    case "scribble": return <ScribbleDemo appName={appName} onClose={onClose} />;
  }
}
