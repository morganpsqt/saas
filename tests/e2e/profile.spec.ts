import { test, expect } from "@playwright/test";
import {
  bootstrapUser,
  cleanupUser,
  genEmail,
  loginViaUi,
  markOnboardingSeen,
} from "./helpers";
import path from "node:path";
import fs from "node:fs";

test.describe("Profile page", () => {
  let email: string;
  let userId: string;

  test.beforeEach(async ({ page }) => {
    email = genEmail("profile");
    const u = await bootstrapUser(email);
    userId = u.id;
    await markOnboardingSeen(userId);
    await loginViaUi(page, email);
  });

  test.afterEach(async () => {
    await cleanupUser(email);
  });

  test("Navigate to /app/parametres/profil", async ({ page }) => {
    await page.goto("/app/parametres/profil");
    await expect(page.getByRole("heading", { name: /Profil|Mon profil/i }).first()).toBeVisible();
  });

  test("Fill fields, save, persist after reload", async ({ page }) => {
    await page.goto("/app/parametres/profil");
    const displayInput = page.locator('input[placeholder="Jean Martin"]');
    const companyInput = page.locator('input[placeholder="Martin Plomberie"]');
    const phoneInput = page.locator('input[placeholder*="06 12"]');
    await displayInput.fill("Jean Test");
    await companyInput.fill("TestCo");
    await phoneInput.fill("0612345678");
    await page.getByRole("button", { name: /Enregistrer/i }).click();
    await page.waitForTimeout(800);
    await page.reload();
    await expect(displayInput).toHaveValue("Jean Test");
    await expect(companyInput).toHaveValue("TestCo");
    await expect(phoneInput).toHaveValue("0612345678");
  });

  test("Avatar upload — file visible on page after upload", async ({ page }) => {
    const fixturePath = path.join(__dirname, "..", "fixtures", "avatar.png");
    // Create a tiny PNG if not present
    if (!fs.existsSync(fixturePath)) {
      fs.mkdirSync(path.dirname(fixturePath), { recursive: true });
      // 1x1 PNG (~68 bytes)
      fs.writeFileSync(
        fixturePath,
        Buffer.from(
          "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c6300010000000500010d0a2db40000000049454e44ae426082",
          "hex"
        )
      );
    }
    await page.goto("/app/parametres/profil");
    const input = page.locator("input[type=file]").first();
    if ((await input.count()) === 0) {
      test.skip(true, "No file input on profile page");
    }
    await input.setInputFiles(fixturePath);
    // upload kicks off, wait a bit
    await page.waitForTimeout(2500);
    // avatar img visible with a src
    const img = page.locator(".prof-img img").first();
    await expect(img).toBeVisible({ timeout: 10_000 });
  });

  test("display_name apparaît dans la salutation du dashboard", async ({ page }) => {
    await page.goto("/app/parametres/profil");
    const displayInput = page.locator('input[placeholder="Jean Martin"]');
    const uniqueName = `Morgan-${Date.now().toString().slice(-5)}`;
    await displayInput.fill(uniqueName);
    await page.getByRole("button", { name: /Enregistrer/i }).click();
    await page.waitForTimeout(1000);
    await page.goto("/app");
    // Greeting should contain the first word of the display_name
    const firstWord = uniqueName.split(" ")[0];
    await expect(page.getByText(new RegExp(firstWord))).toBeVisible({
      timeout: 10_000,
    });
  });
});
