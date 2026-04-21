import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto("/");
  });

  test("Hero contains tagline '3× plus de devis signés'", async ({ page }) => {
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toContainText(/3.{0,2}plus de devis/i);
    await expect(h1).toContainText(/signés/i);
  });

  test("Problem section with 3 cards (sans relance / manuelles / avec Relya)", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Sans relance/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Relances manuelles/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Avec Relya/i })).toBeVisible();
  });

  test("3 testimonials visible", async ({ page }) => {
    const quotes = page.locator(".lp-testimonial");
    await expect(quotes).toHaveCount(3);
  });

  test("Pricing section visible with 29€ and 19€", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Un tarif simple/i })).toBeVisible();
    await expect(page.locator(".lp-pricing")).toContainText("29");
    await expect(page.locator(".lp-pricing")).toContainText("19");
  });

  test("Nav 'Tarifs' link → /pricing", async ({ page }) => {
    await page.getByRole("link", { name: /Tarifs/i }).first().click();
    await page.waitForURL(/\/pricing/);
  });

  test("Top CTA 'Essayer gratuitement' → /signup", async ({ page }) => {
    await page
      .locator(".lp-nav")
      .getByRole("link", { name: /Essayer gratuitement/i })
      .click();
    await page.waitForURL(/\/signup/);
  });

  test("Meta title contains 'Relya'", async ({ page }) => {
    const title = await page.title();
    expect(title.toLowerCase()).toContain("relya");
  });

  test("FAQ section ('Questions fréquentes') visible", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Questions fréquentes/i })
    ).toBeVisible();
  });

  test("'Comment ça marche' section visible", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Comment ça marche/i })
    ).toBeVisible();
  });

  test("OpenGraph meta tags present", async ({ page }) => {
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
    const ogDesc = await page
      .locator('meta[property="og:description"]')
      .getAttribute("content");
    expect(ogTitle?.toLowerCase() ?? "").toContain("relya");
    expect((ogDesc ?? "").length).toBeGreaterThan(10);
  });
});

test.describe("Landing page — responsive (mobile 375×667)", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto("/");
  });

  test("Hero tagline still visible on mobile", async ({ page }) => {
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/plus de devis/i);
  });

  test("Pricing visible on mobile", async ({ page }) => {
    const pricing = page.locator(".lp-pricing");
    await pricing.scrollIntoViewIfNeeded();
    await expect(pricing).toBeVisible();
    await expect(pricing).toContainText("29");
  });

  test("CTA signup reachable on mobile", async ({ page }) => {
    const cta = page
      .getByRole("link", { name: /Essayer gratuitement/i })
      .first();
    await cta.scrollIntoViewIfNeeded();
    await cta.click();
    await page.waitForURL(/\/signup/);
  });
});

test.describe("404 page", () => {
  test("Unknown route renders custom 404 with link home", async ({ page }) => {
    const res = await page.goto("/definitely-not-a-real-page-xyz", {
      waitUntil: "domcontentloaded",
    });
    // Next.js returns 200 for the not-found UI by default in dev,
    // but the custom page content must show.
    void res;
    await expect(page.getByText(/Erreur 404/i)).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Retour à l'accueil/i })
    ).toBeVisible();
  });
});
