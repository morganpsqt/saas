import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";

const SHOT_DIR = "/tmp/maya-shots";
fs.mkdirSync(SHOT_DIR, { recursive: true });

async function shot(page: Page, name: string) {
  await page.screenshot({ path: `${SHOT_DIR}/${name}.png`, fullPage: true });
}

test.describe("Maya — walkthrough complet", () => {
  test.use({
    baseURL: "http://localhost:8095",
    viewport: { width: 414, height: 900 },
    actionTimeout: 15000,
    navigationTimeout: 30000,
  });

  test("parcours end-to-end", async ({ page }) => {
    test.setTimeout(240_000);

    page.on("pageerror", (err) => console.log("[pageerror]", err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") console.log("[console.error]", msg.text());
    });

    // ----- 1. Home loads + redirects to onboarding step 1 -----
    await page.goto("/");
    await page.waitForTimeout(4000);
    await shot(page, "01-home");

    const step1Heading = page.getByText(/Faisons connaissance/i);
    await expect(step1Heading).toBeVisible({ timeout: 20_000 });
    await shot(page, "02-step1-identity");

    // ----- 2. Step 1 identity -----
    const inputs = page.locator("input");
    const count = await inputs.count();
    console.log(`[step1] ${count} inputs`);
    await inputs.nth(0).fill("Alex");
    await inputs.nth(1).fill("1995-06-15");
    await inputs.nth(2).fill("178");
    await inputs.nth(3).fill("75");
    await page.getByText(/^Homme$/i).first().click();
    await page.getByText(/^Modéré$/i).first().click();
    await page.waitForTimeout(500);
    await shot(page, "02b-step1-filled");

    await page.getByText(/^Suivant$/).last().click();
    await page.waitForTimeout(1500);

    // ----- 3. Step 2 medical -----
    await expect(page.getByText(/Dossier médical/i).first()).toBeVisible();
    await shot(page, "03-step2-medical");
    await page.getByText(/^Suivant$/).last().click();
    await page.waitForTimeout(1500);

    // ----- 4. Step 3 nutrition -----
    await expect(page.getByText(/rapport à la bouffe|Régime alimentaire/i).first()).toBeVisible();
    await shot(page, "04-step3-nutrition");
    await page.getByText(/^Omnivore$/i).first().click();
    await page.waitForTimeout(300);
    await page.getByText(/^Suivant$/).last().click();
    await page.waitForTimeout(1500);

    // ----- 5. Step 4 training -----
    await expect(page.getByText(/Ton entraînement|Expérience musculation/i).first()).toBeVisible();
    await shot(page, "05-step4-training");
    await page.getByText(/^Suivant$/).last().click();
    await page.waitForTimeout(1500);

    // ----- 6. Step 5 goals -----
    await expect(page.getByText(/Ton objectif|Type d'objectif/i).first()).toBeVisible();
    await shot(page, "06-step5-goals");
    await page.getByText(/Recompo/i).first().click();
    await page.waitForTimeout(400);
    await shot(page, "06b-goal-selected");

    await page.getByText(/^Terminer$/i).first().click();
    await page.waitForTimeout(4000);

    // ----- 7. Dashboard -----
    await shot(page, "07-dashboard");
    await expect(page.getByText(/Alex/i).first()).toBeVisible({ timeout: 10_000 });

    // ----- 8. Tracker habitudes : eau +250ml -----
    const addWater = page.getByText(/\+250 ml/i).first();
    if ((await addWater.count()) > 0) {
      for (let i = 0; i < 3; i++) {
        await addWater.click();
        await page.waitForTimeout(400);
      }
    }
    await shot(page, "08-water-added");

    // ----- 9. Exercises tab -----
    await page.getByText(/^Exercices$/i).first().click();
    await page.waitForTimeout(5000);
    await shot(page, "09-exercises");

    const exoCard = page.locator("img").nth(1);
    if ((await exoCard.count()) > 0) {
      await exoCard.click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(3000);
      await shot(page, "09b-exercise-detail");

      const askMaya = page.getByText(/Demander à Maya/i).first();
      if ((await askMaya.count()) > 0) {
        await askMaya.click();
        await page.waitForTimeout(2000);
        await shot(page, "09c-exo-ask-maya-prefilled");
        await page.goBack();
        await page.waitForTimeout(1500);
      }
    }

    // ----- 10. Recipes tab -----
    await page.getByText(/^Recettes$/i).first().click();
    await page.waitForTimeout(5000);
    await shot(page, "10-recipes");

    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(800);
    await shot(page, "10b-recipes-scroll");

    // ----- 11. Knowledge tab -----
    await page.getByText(/^Savoir$/i).first().click();
    await page.waitForTimeout(2000);
    await shot(page, "11-knowledge-list");

    const firstArticle = page.getByText(/Comment tes muscles grossissent/i).first();
    if ((await firstArticle.count()) > 0) {
      await firstArticle.click();
      await page.waitForTimeout(2000);
      await shot(page, "11b-article-detail");

      await page.mouse.wheel(0, 1500);
      await page.waitForTimeout(600);
      await shot(page, "11c-article-takeaways");

      const read = page.getByText(/^J'ai lu$/i).first();
      if ((await read.count()) > 0) {
        await read.click();
        await page.waitForTimeout(600);
        await shot(page, "11d-article-read");
      }
      await page.goBack();
      await page.waitForTimeout(1500);
      await shot(page, "11e-knowledge-with-read");
    }

    // ----- 12. Chat Maya -----
    await page.getByText(/^Maya$/i).first().click();
    await page.waitForTimeout(1500);
    await shot(page, "12-chat-empty");

    const mockBanner = page.getByText(/Mode démo/i);
    console.log(`[chat] mock banner visible: ${(await mockBanner.count()) > 0}`);

    const chatInput = page.getByPlaceholder(/Écris à Maya/i).first();
    await chatInput.fill("Salut Maya");
    await shot(page, "12b-chat-typed");

    await page.getByText(/^Envoyer$/).first().click();
    await page.waitForTimeout(3500);
    await shot(page, "13-chat-salut-response");

    await chatInput.fill("Je veux perdre 15 kg en 3 semaines");
    await page.getByText(/^Envoyer$/).first().click();
    await page.waitForTimeout(3500);
    await shot(page, "14-chat-refus-perte");

    await chatInput.fill("des fois je me fais vomir après les repas");
    await page.getByText(/^Envoyer$/).first().click();
    await page.waitForTimeout(3500);
    await shot(page, "15-chat-tca-empathy");

    await page.mouse.wheel(0, -2000);
    await page.waitForTimeout(500);
    await shot(page, "15b-chat-full-convo");

    // ----- 13. Profil -----
    await page.getByText(/^Profil$/i).first().click();
    await page.waitForTimeout(2000);
    await shot(page, "16-profile-dossier");

    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(500);
    await shot(page, "16b-profile-buttons");

    // ----- 14. Back to home -----
    await page.getByText(/^Accueil$/i).first().click();
    await page.waitForTimeout(2500);
    await shot(page, "17-dashboard-final-progression");

    console.log("✅ Walkthrough terminé — screenshots dans", SHOT_DIR);
  });
});
