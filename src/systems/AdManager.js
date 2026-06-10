import { Capacitor } from '@capacitor/core';
import { AdMob, RewardAdPluginEvents } from '@capacitor-community/admob';

// ── Ad Unit IDs ────────────────────────────────────────────────────────
const AD_IDS = {
  rewarded: {
    real:  'ca-app-pub-XXXXXXXX/XXXXXXXXXX', // ← βάλε το δικό σου
    test:  'ca-app-pub-3940256099942544/5224354917', // Google test ID
  }
};

const COOLDOWN_KEY   = 'te_ad_cooldown';
const COOLDOWN_MS    = 2 * 60 * 60 * 1000; // 2 ώρες

// ── Dev mode: true όταν δεν είμαστε σε native build ────────────────────
const IS_NATIVE = Capacitor.getPlatform() !== 'web';
const IS_TESTING = true;
const IS_DEV    = !IS_NATIVE;

export const AdManager = {

  async initialize() {
    if (!IS_NATIVE) return;
    try {
      await AdMob.initialize({
        requestTrackingAuthorization: true,
        testingDevices: [],
        initializeForTesting: IS_TESTING,
      });
    } catch(e) {
      console.warn('AdMob init error:', e);
    }
  },

  // ── Cooldown helpers ──────────────────────────────────────────────────

  isOnCooldown() {
    const ts = localStorage.getItem(COOLDOWN_KEY);
    if (!ts) return false;
    return Date.now() < parseInt(ts, 10);
  },

  setCooldown() {
    localStorage.setItem(COOLDOWN_KEY, String(Date.now() + COOLDOWN_MS));
  },

  clearCooldown() {
    localStorage.removeItem(COOLDOWN_KEY);
  },

  // Returns seconds remaining, or 0
  cooldownRemaining() {
    const ts = localStorage.getItem(COOLDOWN_KEY);
    if (!ts) return 0;
    const remaining = parseInt(ts, 10) - Date.now();
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
  },

  // ── Main: show rewarded ad ────────────────────────────────────────────
  // Returns: 'rewarded' | 'no_fill' | 'cooldown' | 'web' | 'error'

  async showContinueAd() {
    // Web fallback
    if (!IS_NATIVE) return 'web';

    // Cooldown check
    if (this.isOnCooldown()) return 'cooldown';

    let rewardEarned    = false;
    let onLoaded        = null;
    let onFailedToLoad  = null;
    let onReward        = null;
    let onDismiss       = null;
    let onFailedToShow  = null;

    const cleanup = () => {
      onLoaded?.remove();
      onFailedToLoad?.remove();
      onReward?.remove();
      onDismiss?.remove();
      onFailedToShow?.remove();
    };

    try {
      onLoaded = await AdMob.addListener(
        RewardAdPluginEvents.Loaded, (info) => {
          console.log('Ad loaded:', info);
        }
      );

      onFailedToLoad = await AdMob.addListener(
        RewardAdPluginEvents.FailedToLoad, (error) => {
          console.error('Ad FailedToLoad:', error?.code, error?.message);
        }
      );

      onReward = await AdMob.addListener(
        RewardAdPluginEvents.Rewarded, (reward) => {
          rewardEarned = true;
          console.log('Reward earned:', reward);
        }
      );

      onDismiss = await AdMob.addListener(
        RewardAdPluginEvents.Dismissed, () => {
          console.log('Ad dismissed');
        }
      );

      onFailedToShow = await AdMob.addListener(
        RewardAdPluginEvents.FailedToShow, (error) => {
          console.error('Ad FailedToShow:', error?.code, error?.message);
        }
      );

      const adId = IS_TESTING
        ? AD_IDS.rewarded.test
        : AD_IDS.rewarded.real;

      await AdMob.prepareRewardVideoAd({ adId });
      await AdMob.showRewardVideoAd();

      if (rewardEarned) {
        this.clearCooldown();
        return 'rewarded';
      } else {
        // Watched but no reward (skipped)
        this.setCooldown();
        return 'no_reward';
      }

    } catch(error) {
      console.error('Ad error:', error);

      const isNoFill =
        error?.code === 3 ||
        error?.message?.toLowerCase?.().includes('no fill');

      if (isNoFill) {
        this.setCooldown();
        return 'no_fill';
      }

      return 'error';

    } finally {
      cleanup();
    }
  }
};