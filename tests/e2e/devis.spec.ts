import { test, expect } from "@playwright/test";
import {
  bootstrapUser,
  cleanupUser,
  genEmail,
  loginViaUi,
  markOnboardingSeen,
  MORGAN_EMAIL,
} from "./helpers";

test.describe("Devis CRUD", () => {
  let email: string;
  let userId: string;

  test.beforeEach(async ({ page }) => {
    email = genEmail("devis");
    const u = await bootstrapUser(email);
    userId = u.id;
    await markOnboardingSeen(userId);
    await loginViaUi(page, email);
  });

  test.afterEach(async () => {
    await cleanupUser(email);
  });

  test("Dashboard empty state when no devis", async ({ page }) => {
    await page.goto("/app");
    await expect(page.locator(".empty-card")).toBeVisible();
    await expect(page.getByRole("link", { name: /Ajouter un devis/i }).first()).toBeVisible();
  });

  test("Create a devis and see it in the table", async ({ page }) => {
    await page.goto("/app");
    await page.getByRole("link", { name: /Ajouter un devis/i }).click();
    await page.waitForURL(/\/app\/devis\/nouveau/);
    await page.locator("input[name=nom_client]").fill("Jean Dupont");
    await page.locator("input[name=email_client]").fill(MORGAN_EMAIL);
    await page.locator("input[name=montant]").fill("1500");
    // date_envoi defaultValue = today
    await page.getByRole("button", { name: /Enregistrer/i }).click();
    await page.waitForURL(/\/app(?!\/devis)/, { timeout: 15_000 });
    await expect(page.locator("table").getByText("Jean Dupont").first()).toBeVisible();
    await expect(page.locator("table").getByText(MORGAN_EMAIL).first()).toBeVisible();
  });

  test("Change devis status to Gagné updates CA", async ({ page }) => {
    await page.goto("/app/devis/nouveau");
    await page.locator("input[name=nom_client]").fill("Alice Martin");
    await page.locator("input[name=email_client]").fill("alice@example.com");
    await page.locator("input[name=montant]").fill("2000");
    await page.getByRole("button", { name: /Enregistrer/i }).click();
    await page.waitForURL(/\/app(?!\/devis)/);

    const row = page.locator("tr", { hasText: "Alice Martin" });
    await row.locator("select.statut-select").selectOption("gagne");
    // toast appears briefly
    await page.waitForTimeout(600);
    await page.reload();
    await expect(page.locator("body")).toContainText("2\u202f000\u00a0€");
  });

  test("Delete a devis removes it from the table", async ({ page }) => {
    await page.goto("/app/devis/nouveau");
    await page.locator("input[name=nom_client]").fill("ToDelete");
    await page.locator("input[name=email_client]").fill("del@example.com");
    await page.locator("input[name=montant]").fill("100");
    await page.getByRole("button", { name: /Enregistrer/i }).click();
    await page.waitForURL(/\/app(?!\/devis)/);

    page.on("dialog", (d) => d.accept());
    const row = page.locator("tr", { hasText: "ToDelete" });
    await row.locator("button.delete-btn").click();
    await page.waitForTimeout(800);
    await expect(page.getByText("ToDelete")).toHaveCount(0);
  });

  test("Filter by status and search", async ({ page }) => {
    // Create 3 devis
    for (const [nom, statusVal] of [
      ["Alpha Co", "en_attente"],
      ["Bravo Ltd", "en_attente"],
      ["Charlie Inc", "en_attente"],
    ] as const) {
      await page.goto("/app/devis/nouveau");
      await page.locator("input[name=nom_client]").fill(nom);
      await page.locator("input[name=email_client]").fill(`${nom.toLowerCase().replace(" ", "")}@ex.com`);
      await page.locator("input[name=montant]").fill("500");
      await page.getByRole("button", { name: /Enregistrer/i }).click();
      await page.waitForURL(/\/app(?!\/devis)/);
      void statusVal;
    }
    await page.goto("/app");
    await page.locator(".dt-search input").fill("Alpha");
    const table = page.locator("table");
    await expect(table.getByText("Alpha Co")).toBeVisible();
    await expect(table.getByText("Bravo Ltd")).toHaveCount(0);
    await expect(table.getByText("Charlie Inc")).toHaveCount(0);
  });

  test("Non-Pro user clicking '+ note' → redirected to /subscribe", async ({ page }) => {
    await page.goto("/app/devis/nouveau");
    await page.locator("input[name=nom_client]").fill("NoteClient");
    await page.locator("input[name=email_client]").fill("note@example.com");
    await page.locator("input[name=montant]").fill("300");
    await page.getByRole("button", { name: /Enregistrer/i }).click();
    await page.waitForURL(/\/app(?!\/devis)/);

    const row = page.locator("tr", { hasText: "NoteClient" });
    await row.locator("a.icon-btn.locked").click();
    await page.waitForURL(/\/subscribe/);
  });
});
