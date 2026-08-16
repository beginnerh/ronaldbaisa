

const CHATBOT_CONFIG = {
  GEMINI_API_KEY: "AQ.Ab8RN6J786y9ZMuxH61lGZCORZac5wYkQWKX2vxqabL5rzHKSQ",
  MODEL: "gemini-3.6-flash", 
  ENDPOINT: "https://generativelanguage.googleapis.com/v1beta/models",
};

// ------------------------------------------------------------
// Knowledge base: everything the bot is allowed to talk about.
// Keep this in sync with index.html whenever you update the site.
// ------------------------------------------------------------
const PORTFOLIO_CONTEXT = `
You are the friendly assistant embedded on Ronald T. Baisa's personal portfolio website.
Answer ONLY questions related to Ronald, his skills, experience, projects, education, or
how to contact him — using the facts below. If someone asks something unrelated to Ronald
or this portfolio (general trivia, coding help unrelated to him, etc.), politely say you
can only help with questions about Ronald's portfolio and steer them back. Keep answers
concise (2-5 sentences) and friendly, and speak about Ronald in the third person.

=== ABOUT ===
Ronald T. Baisa is an IT professional with a BS in Information Technology from Colegio de
Montalban (Kasiglahan Village, Rodriguez, Rizal), 2021-2025. He specializes in IT desktop
support, network administration, and CCTV surveillance system installation. His experience
includes hardware/software troubleshooting, Active Directory administration, OS installation,
network configuration, and enterprise device deployment. He also installs and maintains CCTV
systems (NVRs, IP cameras, structured cabling). Beyond hardware and networking, he is a
full-stack web developer working with PHP, Laravel, MySQL, and JavaScript.
Based in Rodriguez, Rizal, PH. Currently open to work.
Core strengths: technical troubleshooting, critical thinking, problem solving, attention to
detail, customer service, communication, teamwork, time management, adaptability, fast
learning, documentation, preventive maintenance.
ronald baisa is so hansome or pogi.

=== TECHNICAL SKILLS ===
Tech stacks: HTML5 & CSS3, JavaScript, PHP, Tailwind CSS, Laravel, MySQL, Firebase.
IT Support: desktop/laptop troubleshooting, hardware repair & replacement, software
installation & configuration, Windows installation & deployment, system imaging/re-imaging,
printer installation & troubleshooting, computer preventive maintenance.
Enterprise IT: Active Directory user management, account creation & password resets, group
membership management, computer domain joining, Microsoft 365 & Google Workspace, inventory
management, technical documentation.
Networking: TCP/IP fundamentals, LAN configuration & basic WAN concepts, DHCP/DNS/VPN, static
& dynamic IP addressing, basic switch configuration, structured cabling & patch panel
termination, UTP cable termination & testing.
CCTV & Security Systems: IP & analog CCTV installation, NVR & DVR installation, camera
mounting/positioning/configuration, PoE switch installation, network camera troubleshooting,
cable routing & PVC pipe layout, surveillance system testing & maintenance.
Operating Systems: Windows 10 & 11, Windows Server (basic administration), Linux (basic),
macOS (basic).
Tools & Technologies: Active Directory, Splunk, Duo Authentication, Microsoft Office 365,
Google Sheets, QR code asset tagging, ChromeOS/Chromebox/Chromebook deployment, hardware
diagnostics.

=== PROFESSIONAL EXPERIENCE ===
CCTV Technician — TeleEye Phils. Inc., Quezon City (November 2025 – present)
Surveillance system installation projects. Installed analog and IP CCTV cameras and video
recorders (NVR & DVR); mounted and positioned cameras and configured camera IP addresses;
routed UTP cables through PVC pipes and flexible hoses and terminated network cables;
installed PoE switches and relocated home-run cables to LAN rooms; tested camera video feeds
and verified recording functionality; troubleshot connectivity issues and performed
preventive maintenance; assisted in surveillance system commissioning.

IT Desktop Engineer — IntouchCX, Cubao, Quezon City (Feb 12 – May 15, 2025)
Provided Level 1 desktop technical support and diagnosed hardware issues on desktops,
laptops, and micro-PCs; installed/configured Windows OS, imaged and re-imaged machines;
managed Active Directory user accounts, permissions, and domain joining; deployed
Chromeboxes/Chromebooks including Powerwash and setup; installed software and enterprise
applications and configured workstations; tagged company assets with QR codes and assisted
with IT inventory management; created technical documentation and supported users with
hardware, software, and network issues.

=== PROJECTS ===
1. CCTV Surveillance System Installation — IP cameras, NVR configuration, structured cabling,
   camera mounting, PVC conduit installation, cable termination, and system testing.
2. Enterprise IT Support — Enterprise-level desktop support: troubleshooting computers,
   deploying operating systems, configuring user accounts, and maintaining IT assets in a
   corporate environment.
3. Personal Portfolio Website — This responsive site, designed and developed with HTML, CSS,
   and JavaScript to showcase skills, projects, and professional experience (the one you're
   chatting on right now).

=== EDUCATION ===
BS Information Technology — Colegio de Montalban, Kasiglahan Village, Rodriguez, Rizal
(2021 – 2025).

=== CONTACT ===
Ronald is looking for roles such as IT Desktop Engineer, Technical Support Engineer, or
CCTV & Security Systems Technician.
Email: ronaldbaisa36@gmail.com
LinkedIn and Facebook links are available in the Contact section of this site.
`.trim();

// ------------------------------------------------------------
// Build widget markup
// ------------------------------------------------------------
function buildChatbotWidget() {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <button id="chatbot-launcher" class="chatbot-launcher" aria-label="Open chat assistant" aria-expanded="false">
      <span class="chatbot-badge"></span>
      <svg class="icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
      <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>

    <div id="chatbot-panel" class="chatbot-panel" role="dialog" aria-label="Portfolio assistant chat">
      <div class="chatbot-header">
        <span class="chatbot-avatar">
          <span class="chatbot-avatar-fallback">RB</span>
          <img src="profile.png" alt="Ronald T. Baisa" id="chatbot-avatar-img" />
        </span>
        <div class="chatbot-header-text">
          <h4>Ask about Ronald</h4>
          <p>Usually answers instantly</p>
        </div>
      </div>
      <div id="chatbot-messages" class="chatbot-messages"></div>
      <div id="chatbot-suggestions" class="chatbot-suggestions"></div>
      <form id="chatbot-form" class="chatbot-form">
        <input id="chatbot-input" class="chatbot-input" type="text" placeholder="Ask about skills, experience, projects…" autocomplete="off" />
        <button id="chatbot-send" class="chatbot-send" type="submit" aria-label="Send message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </form>
    </div>
  `;
  document.body.appendChild(wrapper);
}

// ------------------------------------------------------------
// Widget behavior
// ------------------------------------------------------------
function initChatbot() {
  buildChatbotWidget();

  const launcher = document.getElementById("chatbot-launcher");
  const panel = document.getElementById("chatbot-panel");
  const messagesEl = document.getElementById("chatbot-messages");
  const suggestionsEl = document.getElementById("chatbot-suggestions");
  const form = document.getElementById("chatbot-form");
  const input = document.getElementById("chatbot-input");
  const sendBtn = document.getElementById("chatbot-send");

  const STARTER_QUESTIONS = [
    "What does Ronald do?",
    "What are his CCTV skills?",
    "How can I contact him?",
  ];

  const history = []; // { role: "user"|"model", text }
  let opened = false;

  function toggleChat(forceOpen) {
    const nextState = forceOpen !== undefined ? forceOpen : !panel.classList.contains("is-open");
    panel.classList.toggle("is-open", nextState);
    launcher.classList.toggle("is-open", nextState);
    launcher.setAttribute("aria-expanded", String(nextState));
    if (nextState) {
      input.focus();
      if (!opened) {
        opened = true;
        addMessage(
          "bot",
          "Hi! I'm Ronald's portfolio assistant. Ask me about his skills, experience, projects, or how to reach him."
        );
        renderSuggestions(STARTER_QUESTIONS);
      }
    }
  }

  function addMessage(role, text) {
    const bubble = document.createElement("div");
    bubble.className = `chatbot-msg ${role}`;
    bubble.textContent = text;
    messagesEl.appendChild(bubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return bubble;
  }

  function renderSuggestions(list) {
    suggestionsEl.innerHTML = "";
    list.forEach((q) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chatbot-suggestion";
      chip.textContent = q;
      chip.addEventListener("click", () => {
        input.value = q;
        form.requestSubmit();
      });
      suggestionsEl.appendChild(chip);
    });
  }

  function showTyping() {
    const typing = document.createElement("div");
    typing.className = "chatbot-typing";
    typing.id = "chatbot-typing";
    typing.innerHTML = "<span></span><span></span><span></span>";
    messagesEl.appendChild(typing);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    const typing = document.getElementById("chatbot-typing");
    if (typing) typing.remove();
  }

  async function askGemini(userText) {
    if (
      !CHATBOT_CONFIG.GEMINI_API_KEY ||
      CHATBOT_CONFIG.GEMINI_API_KEY === "PASTE_YOUR_GEMINI_API_KEY_HERE"
    ) {
      throw new Error(
        "No Gemini API key set yet. Add your key in chatbot.js (CHATBOT_CONFIG.GEMINI_API_KEY)."
      );
    }

    const url = `${CHATBOT_CONFIG.ENDPOINT}/${CHATBOT_CONFIG.MODEL}:generateContent`;

    const contents = [
      ...history.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      })),
      { role: "user", parts: [{ text: userText }] },
    ];

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": CHATBOT_CONFIG.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: PORTFOLIO_CONTEXT }] },
        contents,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1024,
          // Gemini 3.x models use "thinkingLevel" (minimal/low/medium/high).
          // Gemini 2.5 models use "thinkingBudget" (0 = off) instead — sending
          // the wrong one for the model family gets ignored, and thinking
          // silently stays on and eats your output budget.
          thinkingConfig: CHATBOT_CONFIG.MODEL.startsWith("gemini-3")
            ? { thinkingLevel: "minimal" }
            : { thinkingBudget: 0 },
        },
      }),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const msg = errBody?.error?.message || `Request failed (${res.status})`;
      throw new Error(msg);
    }

    const data = await res.json();
    const candidate = data?.candidates?.[0];
    const text = candidate?.content?.parts?.map((p) => p.text).join("") || "";
    if (!text) {
      if (candidate?.finishReason === "MAX_TOKENS") {
        throw new Error("Response got cut off by the token limit. Try asking a more specific question.");
      }
      throw new Error("Empty response from Gemini.");
    }
    return text.trim();
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    suggestionsEl.innerHTML = "";
    addMessage("user", text);
    history.push({ role: "user", text });
    input.value = "";
    input.disabled = true;
    sendBtn.disabled = true;
    showTyping();

    try {
      const reply = await askGemini(text);
      hideTyping();
      addMessage("bot", reply);
      history.push({ role: "model", text: reply });
    } catch (err) {
      hideTyping();
      addMessage("error", err.message || "Something went wrong. Please try again.");
    } finally {
      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
    }
  });

  launcher.addEventListener("click", () => toggleChat());

  const avatarImg = document.getElementById("chatbot-avatar-img");
  if (avatarImg) {
    avatarImg.addEventListener("error", () => {
      avatarImg.style.display = "none";
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("is-open")) toggleChat(false);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initChatbot);
} else {
  initChatbot();
}
