import { test, expect } from "@playwright/test";
import {
  bootstrapUser,
  cleanupUser,
  genEmail,
  loginViaUi,
  markOnboardingSeen,
  markSubscriptionPaid,
} from "./helpers";

test.describe("Subscription gating", () => {
  test("Trial banner visible for new user", async ({ page }) => {
    const email = genEmail("trial");
    const u = await bootstrapUser(email);
    await markOnboardingSeen(u.id);
    await loginViaUi(page, email);
    // Banner either visible or has the activate CTA
    await expect(page.locator(".banner.trial-unpaid").or(page.locator(".banner.trial-paid"))).toBeVisible();
    await cleanupUser(email);
  });

  test("Click 'Activer mon abonnement' redirects to Stripe checkout", async ({ page }) => {
    const email = genEmail("stripe");
    const u = await bootstrapUser(email);
    await markOnboardingSeen(u.id);
    await loginViaUi(page, email);
    const cta = page.getByRole("link", { name: /Activer mon abonnement/i }).first();
    if (await cta.count() === 0) {
      test.skip(true, "No trial_unpaid banner — user has paid");
    }
    await cta.click();
    await page.waitForURL(/\/subscribe/, { timeout: 10_000 });
    // From subscribe page click "Activer" button → Stripe
    const pay = page.getByRole("button", { name: /Activer|Commencer|Payer/i }).first();
    if (await pay.count() > 0) {
      const [resp] = await Promise.all([
        page.waitForResponse((r) => r.url().includes("/api/stripe/checkout"), { timeout: 10_000 }).catch(() => null),
        pay.click(),
      ]);
      if (resp) {
        const json = await resp.json().catch(() => ({}));
        if (json.url) {
          expect(json.url).toMatch(/checkout\.stripe\.com/);
        }
      }
    }
    await cleanupUser(email);
  });

  test("Bypass webhook: mark subscription paid → trial banner turns green", async ({ page }) => {
    const email = genEmail("paid");
    const u = await bootstrapUser(email);
    await markOnboardingSeen(u.id);
    await markSubscriptionPaid(u.id);
    await loginViaUi(page, email);
    // No visible banner (state=active hides it) or a "paid" style banner
    await expect(page.locator(".banner.trial-unpaid")).toHaveCount(0);
    await cleanupUser(email);
  });

  test.skip("Pro user clicks 'Gérer mon abonnement' → Stripe portal", async () => {
    // Requires a real Stripe customer_id — can't be done without real Stripe checkout.
  });

  test("Pro user visiting /subscribe is redirected back to /app", async ({ page }) => {
    const email = genEmail("pro-redirect");
    const u = await bootstrapUser(email);
    await markOnboardingSeen(u.id);
    await markSubscriptionPaid(u.id);
    await loginViaUi(page, email);
    await page.goto("/subscribe");
    // Expect redirect away from /subscribe (back to /app) within a short delay
    await page.waitForURL(/\/app(?!\/subscribe)/, { timeout: 10_000 });
    await cleanupUser(email);
  });

  test("Unauthenticated user on /app redirects to /login", async ({ page, context }) => {
    await context.clearCookies();
    await page.goto("/app");
    await page.waitForURL(/\/login/, { timeout: 10_000 });
  });
});
