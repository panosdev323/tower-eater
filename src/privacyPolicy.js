// ── Privacy Policy URL ────────────────────────────────────────────────
// https://panosdev323.github.io/tower-eater/privacy-policy.html

export const PRIVACY_POLICY_URL = 'https://panosdev323.github.io/tower-eater/privacy-policy.html';

export function openPrivacyPolicy() {
  // Capacitor: ανοίγει στον default browser του device
  if (window.Capacitor?.isNativePlatform?.()) {
    import('@capacitor/browser').then(({ Browser }) => {
      Browser.open({ url: PRIVACY_POLICY_URL });
    }).catch(() => {
      window.open(PRIVACY_POLICY_URL, '_blank');
    });
  } else {
    window.open(PRIVACY_POLICY_URL, '_blank');
  }
}