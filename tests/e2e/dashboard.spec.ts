import { test, expect } from "@playwright/test";
import {
  bootstrapUser,
  cleanupUser,
  genEmail,
  loginViaUi,
  markOnboardingSeen,
  markSubscriptionPaid,
} from "./helpers";

test.describe("Dashboard UI", () => {
  test("Greeting 'Bonjour/Bonsoir ... 👋' visible", async ({ page }) => {
    const email = genEmail("greet");
    const u = await bootstrapUser(email);
    await markOnboardingSeen(u.id);
    await loginViaUi(page, email);
    await expect(page.locator(".dash-greeting")).toBeVisible();
    await expect(page.locator(".dash-greeting")).toContainText(/👋/);
    await cleanupUser(email);
  });

  test("Stats cards visible (4 stats)", async ({ page }) => {
    const email = genEmail("stats");
    const u = await bootstrapUser(email);
    await markOnboardingSeen(u.id);
    await loginViaUi(page, email);
    const cards = page.locator(".stat-card");
    await expect(cards).toHaveCount(4);
    await expect(page.locator("body")).toContainText(/Devis envoyés/);
    await expect(page.locator("body")).toContainText(/Devis gagnés/);
    await expect(page.locator("body")).toContainText(/Taux de conversion/);
    await expect(page.locator("body")).toContainText(/CA récupéré/);
    await cleanupUser(email);
  });

  test("Tip of the day visible", async ({ page }) => {
    const email = genEmail("tip");
    const u = await bootstrapUser(email);
    await markOnboardingSeen(u.id);
    await loginViaUi(page, email);
    const tip = page.locator("text=/Conseil du jour|💡/i").first();
    await expect(tip).toBeVisible();
    await cleanupUser(email);
  });

  test("Activity feed visible (with 1 devis)", async ({ page }) => {
    const email = genEmail("activity");
    const u = await bootstrapUser(email);
    await markOnboardingSeen(u.id);
    await loginViaUi(page, email);
    await page.goto("/app/devis/nouveau");
    await page.locator("input[name=nom_client]").fill("ActivityTest");
    await page.locator("input[name=email_client]").fill("act@ex.com");
    await page.locator("input[name=montant]").fill("200");
    await page.getByRole("button", { name: /Enregistrer/i }).click();
    await page.waitForURL(/\/app(?!\/devis)/);
    await expect(page.locator("body")).toContainText(/Activité|Activité récente|Activity/i);
    await cleanupUser(email);
  });

  test("Revenue chart visible for Pro user", async ({ page }) => {
    const email = genEmail("chart");
    const u = await bootstrapUser(email);
    await markOnboardingSeen(u.id);
    await markSubscriptionPaid(u.id);
    await loginViaUi(page, email);
    // Chart card is rendered (either with recharts SVG if data, or empty state text)
    await expect(page.locator(".rev-card")).toBeVisible();
    await cleanupUser(email);
  });

  test("Non-Pro sees locked chart (blurred/overlay)", async ({ page }) => {
    const email = genEmail("chart-npro");
    const u = await bootstrapUser(email);
    await markOnboardingSeen(u.id);
    await loginViaUi(page, email);
    // Look for subscribe link near chart, or a blurred class
    await expect(
      page.getByRole("link", { name: /Activer mon abonnement/i }).first()
    ).toBeVisible();
    await cleanupUser(email);
  });
});
