// ── Privacy Policy URL ────────────────────────────────────────────────
// https://panosdev323.github.io/tower-eater/privacy-policy.html

export const PRIVACY_POLICY_URL = 'https://panosdev323.github.io/tower-eater/privacy-policy.html';

export function openPrivacyPolicy() {
  // Capacitor native: use the Browser plugin if it was registered
  // (works when @capacitor/browser is installed and the app runs natively)
  const CapBrowser = window?.Capacitor?.Plugins?.Browser;
  if (window.Capacitor?.isNativePlatform?.() && CapBrowser?.open) {
    CapBrowser.open({ url: PRIVACY_POLICY_URL });
  } else {
    window.open(PRIVACY_POLICY_URL, '_blank', 'noopener,noreferrer');
  }
}