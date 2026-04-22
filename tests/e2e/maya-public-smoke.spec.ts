import { test, expect } from "@playwright/test";

const PUBLIC_URL = "https://task-executed-burlington-competitions.trycloudflare.com";

test.describe("Maya — smoke test URL publique", () => {
  test.use({
    viewport: { width: 414, height: 900 },
    actionTimeout: 20000,
    navigationTimeout: 45000,
  });

  test("L'URL publique charge + onboarding visible", async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto(PUBLIC_URL);
    await page.waitForTimeout(6000); // bundle + SQLite init
    await page.screenshot({
      path: "/tmp/maya-public-home.png",
      fullPage: true,
    });

    const h1 = page.getByText(/Faisons connaissance|Maya/i).first();
    await expect(h1).toBeVisible({ timeout: 30_000 });
  });

  test("Onboarding step 1 — on peut remplir un champ", async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto(`${PUBLIC_URL}/(onboarding)/step-1-identity`);
    await page.waitForTimeout(5000);
    const firstInput = page.locator("input").first();
    await firstInput.fill("Test");
    await page.waitForTimeout(500);
    await expect(firstInput).toHaveValue("Test");
    await page.screenshot({
      path: "/tmp/maya-public-onboarding.png",
      fullPage: true,
    });
  });
});
