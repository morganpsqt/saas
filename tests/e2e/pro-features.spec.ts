import { test, expect } from "@playwright/test";
import {
  bootstrapUser,
  cleanupUser,
  genEmail,
  loginViaUi,
  markOnboardingSeen,
  markSubscriptionPaid,
} from "./helpers";

test.describe("Pro-only feature gating", () => {
  test("Non-Pro — Export CSV button is a lock link to /subscribe", async ({ page }) => {
    const email = genEmail("nopro-csv");
    const u = await bootstrapUser(email);
    await markOnboardingSeen(u.id);
    await loginViaUi(page, email);
    const locked = page.locator("a.csv-btn.locked");
    await expect(locked).toBeVisible();
    await locked.click();
    await page.waitForURL(/\/subscribe/);
    await cleanupUser(email);
  });

  test("Pro — Export CSV downloads a file", async ({ page }) => {
    const email = genEmail("pro-csv");
    const u = await bootstrapUser(email);
    await markOnboardingSeen(u.id);
    await markSubscriptionPaid(u.id);
    await loginViaUi(page, email);
    // Create one devis so there's data
    await page.goto("/app/devis/nouveau");
    await page.locator("input[name=nom_client]").fill("CsvClient");
    await page.locator("input[name=email_client]").fill("csv@ex.com");
    await page.locator("input[name=montant]").fill("750");
    await page.getByRole("button", { name: /Enregistrer/i }).click();
    await page.waitForURL(/\/app(?!\/devis)/);

    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 10_000 }),
      page.locator("button.csv-btn").click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/relya-devis-\d{4}-\d{2}-\d{2}\.csv/);
    await cleanupUser(email);
  });

  test("Non-Pro — Emails settings page shows Pro gate", async ({ page }) => {
    const email = genEmail("nopro-emails");
    const u = await bootstrapUser(email);
    await markOnboardingSeen(u.id);
    await loginViaUi(page, email);
    await page.goto("/app/parametres/emails");
    // Expect either a paywall message or disabled editor
    await expect(
      page.locator("body").getByText(/abonn|réservé|Activer/i).first()
    ).toBeVisible();
    await cleanupUser(email);
  });

  test("Pro — Edit J+3 template, save, persist after reload", async ({ page }) => {
    const email = genEmail("pro-emails");
    const u = await bootstrapUser(email);
    await markOnboardingSeen(u.id);
    await markSubscriptionPaid(u.id);
    await loginViaUi(page, email);
    await page.goto("/app/parametres/emails");
    const subjectInput = page.locator("input.tpl-input").first();
    await expect(subjectInput).toBeVisible();
    await subjectInput.fill("Sujet custom TEST");
    await page.getByRole("button", { name: /^Enregistrer$/ }).first().click();
    await page.waitForTimeout(1500);
    await page.reload();
    await expect(page.locator("input.tpl-input").first()).toHaveValue("Sujet custom TEST");
    await cleanupUser(email);
  });
});
