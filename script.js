// ============================
// Theme handling
// ============================
const root = document.documentElement;
const toggleBtn = document.getElementById("theme-toggle");
const STORAGE_KEY = "site-theme";

function getPreferredTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  toggleBtn.setAttribute("aria-pressed", theme === "dark");
}

applyTheme(getPreferredTheme());

toggleBtn.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem(STORAGE_KEY, next);
});

// Keep in sync if the user changes their OS-level theme
// and hasn't explicitly chosen one on this site yet.
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    applyTheme(e.matches ? "dark" : "light");
  }
});

// ============================
// Footer year
// ============================
document.getElementById("year").textContent = new Date().getFullYear();

// ============================
// Profile photo fallback
// If profile.jpg hasn't been added yet, keep showing the initials
// placeholder instead of a broken image icon.
// ============================
const profileImg = document.getElementById("profile-img");
if (profileImg) {
  profileImg.addEventListener("error", () => {
    profileImg.style.display = "none";
  });
}
