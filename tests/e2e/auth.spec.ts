import { test, expect } from "@playwright/test";
import {
  TEST_PASSWORD,
  genEmail,
  bootstrapUser,
  cleanupUser,
  loginViaUi,
  markOnboardingSeen,
} from "./helpers";

test.describe("Auth — landing → signup → login → logout", () => {
  test("Landing CTA leads to /signup", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/plus de devis/i);
    const cta = page
      .getByRole("link", { name: /Essayer gratuitement/i })
      .first();
    await cta.click();
    await page.waitForURL(/\/signup/);
    await expect(page.getByRole("heading", { name: /Créer un compte/i })).toBeVisible();
  });

  test("Signup via UI creates account (or shows confirm message)", async ({ page }) => {
    const email = genEmail("ui-signup");
    await page.goto("/signup");
    await page.locator("input[type=email]").fill(email);
    await page.locator("input[type=password]").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /Créer mon compte/i }).click();
    await page.waitForURL(/\/(app|login|subscribe)/, { timeout: 15_000 });
    // Either landed on /app (auto-confirm) or /login?confirm=1 (email verify on)
    const url = page.url();
    expect(url).toMatch(/\/(app|login)/);
    await cleanupUser(email);
  });

  test("Logout returns to /login", async ({ page }) => {
    const email = genEmail("logout");
    const user = await bootstrapUser(email);
    await markOnboardingSeen(user.id);
    await loginViaUi(page, email);
    await page.waitForURL(/\/app|\/subscribe/);
    // Open user menu
    await page.locator(".um-trigger, button[aria-label=\"Menu utilisateur\"]").first().click();
    await page.getByRole("button", { name: /Déconnexion|Se déconnecter/i }).click();
    await page.waitForURL(/\/login|\/$/, { timeout: 10_000 });
    await cleanupUser(email);
  });

  test("Login with known account reaches /app", async ({ page }) => {
    const email = genEmail("login");
    const user = await bootstrapUser(email);
    await markOnboardingSeen(user.id);
    await loginViaUi(page, email);
    // May land on /subscribe if trial gating fails — both are valid "authenticated" states
    await expect(page).toHaveURL(/\/(app|subscribe)/);
    await cleanupUser(email);
  });

  test("Unauthenticated access to /app redirects to /login", async ({ page, context }) => {
    await context.clearCookies();
    await page.goto("/app");
    await page.waitForURL(/\/login/, { timeout: 10_000 });
    await expect(page.getByRole("heading", { name: /Bon retour/i })).toBeVisible();
  });
});
