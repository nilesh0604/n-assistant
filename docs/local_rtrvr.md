# Local rtrvr.ai‑style Browser Agent — Requirements, Architecture & Implementation Plan

**Purpose:**
Build a privacy-first, local web‑automation + AI agent (``LocalAgent``) that behaves like a human using your real Chrome profile, integrates with a local RAG/LLM stack (e.g., Ollama + local vector DB), and exposes a Chrome extension UI for controlling automation, extraction, and workflows.

This document contains:
- Product requirements (functional & non‑functional)
- High‑level and detailed architecture
- Implementation plan, milestones, and step‑by‑step instructions
- Security, privacy, and operational considerations
- Testing, validation, and rollout checklist
- Example developer notes, folder structure, and code snippets

---

## 1. Summary / Vision

Create a system that:  
• Runs entirely on the user's machine (no external cloud by default).  
• Controls the real Chrome browser via a private Chrome extension (Manifest V3).  
• Uses a local agent (Node.js) which orchestrates tasks and talks to a local LLM (Ollama) and local RAG stack for reasoning / selector inference and memory.  
• Is capable of: login‑protected data extraction, complex multi‑step workflows, natural language directives, and recorded playbacks.  

Primary users: power users, security‑conscious automation consumers, researchers, productivity professionals.

---

## 2. Requirements

### 2.1 Functional Requirements
1. **Installable Chrome Extension (unpublished)**
   - Popup UI and optional sidebar
   - Content script for DOM capture and action execution
   - Background service worker for local API calls and messaging
2. **Local Agent (Node.js)**
   - REST API for extension (<code>http://localhost:PORT/</code>)
   - Task planner that translates LLM plans → browser RPCs
   - Workflow recorder & player
3. **Local LLM/RAG integration**
   - Ollama or other local model to generate step plans, infer selectors, and reason
   - Vector database for embeddings and retrieval (optional but recommended)
4. **Human‑like browser actions**
   - Controlled clicks, typing (with delays), scrolling, navigation, waits
   - Retry & error handling
5. **Session & Credential Respect**
   - Use user’s real Chrome profile cookies & sessions
   - No credentials uploaded to any remote server
6. **Storage**
   - Local storage for workflows, configuration, and encrypted secrets
7. **Security & Privacy**
   - Zero‑trust default: no outbound connections unless explicitly configured
   - Encryption of any stored secrets using a master PIN or OS keystore
8. **Export / Import**
   - Save workflows & configs as encrypted JSON for backup
9. **Optional: Streaming responses**
   - WebSocket or SSE from local LLM for live output

### 2.2 Non‑Functional Requirements
- **Latency:** planning + roundtrip should be usable (<1‑5s for typical small tasks).  
- **Reliability:** robust to SPAs; retry loops and heuristics for dynamic DOMs.  
- **Compatibility:** Chrome/Chromium browsers (Edge, Brave) on macOS, Windows, Linux.  
- **Resource limits:** works on consumer laptop with Ollama local models (quantized models for CPU is recommended).  

### 2.3 Security Requirements
- Data stored locally only (``chrome.storage.local`` or user folder).  
- Master PIN required to decrypt sensitive data; PIN not persisted.  
- No telemetry or external analytics by default.  
- Extension host permissions limited to whitelisted domains you configure.  
- Use secure CORS and restrict local API to 127.0.0.1/localhost.  

---

## 3. High‑Level Architecture

```
 +-----------------+        HTTP/WS        +-----------+      +---------+
 | Chrome Browser  | <--------------------> | Extension | <--> | Node.js |
 | (real profile)  |  extension messaging  | (popup/   |      | Agent   |
 |                 |                       | content/  |      |         |
 +-----------------+                       | background|      +----+----+
                                            +-----+-----+           |
                                                  |                 |
                                          extension RPCs            | Ollama + Vector DB
                                                  |                 |
                                            localhost:PORT         +--+--+
                                                                    |RAG |
                                                                    +----+
```

Components:
- **Chrome Extension** (Manifest V3) — UI, content scripts, messaging, local host_permissions
- **Node.js Agent** — REST API, plan executor, orchestration, persistent storage, plugin connectors
- **Ollama Local LLM** — model inference for plan generation, selector inference, prompt reasoning
- **Vector DB + Embeddings Service** — semantic memory, stored workflows, past context (SQLite/Chroma/Weaviate/Chroma)
- **Developer Tools** — CLI for onboarding, scripts for profile copy, and dev utilities

---

## 4. Implementation Plan & Timeline (milestones)

Assume a single developer or small team. Est. timeline: **6–8 weeks** for MVP; more for hardened production features.

### Phase 0 — Prep (0.5 week)
- Choose stack: Node.js (v18+), Ollama (installed), Vector DB (ChromaLite or SQLite), Chrome (user machine)
- Create repo and initial folder structure

### Phase 1 — Chrome Extension MVP (1 week)
- Build manifest v3, popup UI, background worker, content script
- Implement DOM snapshot and basic message passing to background
- Allow extension to call a local endpoint (hardcode localhost port)

Deliverables:
- Loadable unpacked extension that can send DOM snapshots to Node.js

### Phase 2 — Local Node.js Agent MVP (1 week)
- Simple Express server with endpoints:
  - POST /plan — accept DOM snapshot + user instruction, call Ollama
  - POST /execute — receive plan steps and forward to extension
- Implement a basic planner: call Ollama with prompt template

Deliverables:
- Node.js agent that returns simple plans and accepts execute requests

### Phase 3 — LLM Integration & Selector Inference (1 week)
- Build Ollama prompt templates that:
  - Parse the user instruction
  - Generate step list with selectors / heuristics
- Implement embedding + retrieval stubs

Deliverable:
- Ollama-based planning returns step JSONs consistently

### Phase 4 — Action Execution, Retries, Humanization (1 week)
- Extend extension to support actions: click, type, waitFor, scroll, screenshot, extract
- Implement human-like typing delays and randomized mouse moves
- Add retries and error handling

Deliverable:
- Executable workflows that run in-page and return results

### Phase 5 — Workflow Recording, Storage, and RAG (1 week)
- Add record/playback in extension
- Persist workflows in local vector DB or JSON
- Use embeddings to find similar workflows and suggest selectors

Deliverable:
- Reusable workflows and retrieval by similarity

### Phase 6 — Security, Packaging, UX polish (1 week)
- Implement master PIN + encryption
- Provide importer/exporter of encrypted workflows
- Improve UI, logging, and developer docs

Deliverable:
- Secure extension + agent, ready for internal use

### Phase 7 — Testing & Hardening (1 week)
- Cross-browser testing
- Memory leak fixes
- Stress test edge cases (SPAs, lazy loading, CAPTCHAs)

Deliverable:
- Test suite and production checklist

---

## 5. Detailed Implementation Steps

### 5.1 Environment & Prerequisites
- Node.js v18+ and npm/yarn
- Ollama installed locally and model(s) prepared (quantized Llama 3 or smaller)
- Chrome with Developer Mode available
- Optional: Python environment for embeddings if you choose Python tooling

### 5.2 Repo & Folder Structure

```
localagent/
├─ extension/
│  ├─ manifest.json
│  ├─ popup.html
│  ├─ popup.js
│  ├─ background.js
│  ├─ content_script.js
│  └─ assets/
├─ agent/
│  ├─ package.json
│  ├─ src/
│  │  ├─ server.js
│  │  ├─ planner.js
│  │  ├─ executor.js
│  │  ├─ ollama_client.js
│  │  └─ storage.js
│  └─ config/
├─ docs/
└─ scripts/
   ├─ copy_profile.sh
   └─ start_all.sh
```

### 5.3 Chrome Extension (core features)

**manifest.json (MV3)**
- background.service_worker
- content_scripts for whitelisted hosts
- host_permissions for <code>http://localhost:*/</code>
- permissions: ["storage","activeTab","scripting"]

**content_script.js**
- Extract minimal DOM snapshot (text + key selectors)
- Listen to messages to perform actions
- Provide helper functions: findBestSelector, scrollIntoView, clickWithDelay, typeWithDelay

**background.js**
- Bridge popup ↔ content script
- Call local agent via fetch to /plan and /execute
- Maintain ephemeral unlocked master PIN token in runtime

**popup.js / popup.html**
- UI to enter instruction, choose profile/workflow, view results
- Unlock with master PIN
- Buttons: Record, Play, Stop, Export, Import

### 5.4 Node.js Agent (core features)

**server.js**
- Express with endpoints:
  - POST /plan { instruction, domSnapshot, url }
  - POST /execute { plan, jobId }
  - POST /query { prompt } (RAG / embeddings)
  - GET /status

**planner.js**
- Prepare prompt templates for Ollama
- Call Ollama API (local) with context (DOM, url, memory)
- Parse Ollama response into normalized steps

**executor.js**
- Push plan to extension via WebSocket or push via background.fetch (extension polls)
- Manage job lifecycle (state, retries, timeouts)
- Collect results and return to caller

**ollama_client.js**
- Thin wrapper around Ollama serve endpoints (or CLI) to request generation and embeddings

**storage.js**
- Persistence for workflows and encrypted configs (SQLite or JSON files)

### 5.5 Prompting / Planner Patterns
- Use structured prompts that request JSON output only.
- Provide examples in the prompt (few-shot) of DOM input → steps output.
- Include constraints (max number retries, safe selectors, don't use <all_urls> access).

Example prompt sketch:
```
You are a browser automation planner. Input: { url, domSnapshot, userInstruction }.
Output: JSON array of steps. Each step: {action: navigate|waitFor|click|type|extract|screenshot, selector?, value?, timeout?}
Do not include any explanation outside JSON.
```

### 5.6 Embeddings & Vector DB (optional)
- Use Ollama or a separate embeddings library to compute embeddings for saved workflows, past successes, and snippets.
- Store in ChromaLite or SQLite with FAISS-like index.
- Query for similar pages when planner needs a selector suggestion.

### 5.7 Humanization & Anti‑Detection Considerations
- Use real Chrome binary via extension — biggest win.
- Within extension, simulate human timing: typing speeds, slight cursor jitter, random small delays.
- Avoid heavy request bursts; add randomized wait times between actions.

### 5.8 Native Messaging (optional advanced path)
- If you need binary-level control (file downloads, system interaction), implement Native Messaging host so extension can call local executables securely.

---

## 6. Security & Privacy Details

### 6.1 Secrets & Encryption
- Use WebCrypto API in extension background or Node to encrypt stored secrets.
- Derive key from master PIN using PBKDF2 or HKDF + salt; store salt in local storage.
- Keep master PIN only in memory; require re‑unlock after browser restart.

### 6.2 API Security
- Local agent bind only to 127.0.0.1; require a startup token (generated on first run) stored in extension config to authenticate calls.
- Reject cross‑origin calls except from extension background.

### 6.3 Permissions Hardening
- Do not request <all_urls> unless user explicitly whitelists domains.
- Limit host_permissions to necessary domains.

### 6.4 Auditability
- Keep a local immutable log (append-only) of performed actions and timestamps. Optionally encrypt.
- Provide UI to inspect and delete logs.

---

## 7. Testing & Validation

### 7.1 Unit Tests
- Planner parsing
- Ollama client responses
- Executor retry logic

### 7.2 Integration Tests
- Start local agent + extension in dev mode; run sample workflows across common sites (static login form, SPA site, multi-tab scenario).

### 7.3 Security Tests
- Ensure no outbound network traffic
- Verify encryption key handling
- Pen test extension injection points (limit DOM script exposure)

### 7.4 Usability Tests
- Time to complete common tasks (<30s for simple login + navigation)
- Failover behavior on DOM changes

---

## 8. Deployment & Developer Experience

### 8.1 Developer Setup
- `scripts/start_all.sh` to boot Ollama (if desired), start Node agent, and provide extension load instructions.
- Setup readme with step to copy Chrome profile safely and load unpacked extension.

### 8.2 User Onboarding
1. Install Ollama and models per instructions.  
2. Clone repo, `npm install` in /agent and `npm run dev`.  
3. Load extension: chrome://extensions → Developer Mode → Load unpacked → `extension/`  
4. Run `scripts/copy_profile.sh` to create automation profile copy (optional).  
5. In extension popup, configure local API port, master PIN, and whitelisted domains.

---

## 9. Example Workflow (end‑to‑end)

1. User opens page (logged in with Chrome).  
2. User clicks extension popup and types: "Download last month's invoices from Acme Portal".  
3. Extension snapshots the DOM and sends {url, snapshot, instruction} to Node agent.  
4. Node agent sends prompt to Ollama: "Plan steps to login/ navigate / export invoices".  
5. Ollama returns JSON steps (navigate, wait, click, click, download).  
6. Node agent sends execution plan back to extension (background → content script).  
7. Content script executes steps with human-like timing.  
8. Content script returns results (download path, screenshot, or extracted table) to agent which stores output locally.  
9. Extension shows success and offers to export CSV.

---

## 10. Risks & Mitigations

- **Risk:** Site changes break workflows.  
  **Mitigation:** Provide heuristics, selector fallbacks and recording UI for re‑teaching.  

- **Risk:** Extension has too many permissions (privacy concern).  
  **Mitigation:** Limit permissions; require explicit domain whitelist.  

- **Risk:** LLM hallucination suggests dangerous actions (delete posts, transfer funds).  
  **Mitigation:** Constrain planner to a safe action set; disallow destructive actions by design.

- **Risk:** Local model resource exhaustion.  
  **Mitigation:** Allow smaller models, OOM-safe configs, model swap options.

---

## 11. Deliverables Checklist

- [ ] Repo skeleton and scripts  
- [ ] Manifest v3 extension  
- [ ] Content script (action execution)  
- [ ] Background service worker (RPC & security)  
- [ ] Node.js agent (planner + executor)  
- [ ] Ollama prompt templates and integration  
- [ ] Workflow recorder & storage  
- [ ] Encryption + master PIN  
- [ ] Documentation + onboarding script  
- [ ] Test suite and sample workflows  

---

## 12. Appendix: Snippets & Examples

**manifest.json (minimal sketch)**
```json
{
  "manifest_version": 3,
  "name": "LocalAgent",
  "version": "0.1",
  "permissions": ["storage", "activeTab", "scripting"],
  "host_permissions": ["http://localhost:8000/*"],
  "background": {"service_worker": "background.js"},
  "action": {"default_popup": "popup.html"},
  "content_scripts": [{
    "matches": ["https://*/*"],
    "js": ["content_script.js"]
  }]
}
```

**background.js (message → local API example)**
```js
chrome.runtime.onMessage.addListener((msg,sender,sendResponse)=>{
  if(msg.type==='PLAN_REQUEST'){
    fetch('http://localhost:8000/plan',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(msg.payload)
    }).then(r=>r.json()).then(data=>sendResponse({ok:true,data})).catch(err=>sendResponse({ok:false,err:err.message}));
    return true; // async
  }
});
```

**Content script: simple action handler**
```js
chrome.runtime.onMessage.addListener(async (m, s, r) => {
  if(m.type === 'ACTION'){
    const step = m.step;
    if(step.action==='click'){
      const el = document.querySelector(step.selector);
      el?.click();
      r({ok:true});
    }
    // ... handle type/wait/extract
  }
});
```

**Node.js planner example (pseudo)**
```js
async function plan(req, res){
  const {instruction, dom, url} = req.body;
  const prompt = buildPrompt({instruction,dom,url});
  const planText = await ollama.generate(prompt);
  const planJson = JSON.parse(planText);
  res.json(planJson);
}
```

---

## 13. Next Steps (what I can provide instantly)
Tell me which of the following you want me to generate next, and I will produce it immediately:

- [ ] Full extension code (manifest, content script, background, popup) — ready to load unpacked
- [ ] Node.js agent skeleton (Express server, planner, executor stubs)
- [ ] Ollama prompt templates & few‑shot examples
- [ ] Workflow recorder/playback implementation
- [ ] Encryption utilities for secure storage
- [ ] A polished startup script and README for onboarding

Please pick one or more and I will generate those files/code here.

