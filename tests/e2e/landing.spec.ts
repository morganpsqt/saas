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
});
