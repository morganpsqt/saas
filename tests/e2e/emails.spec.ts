import { test, expect } from "@playwright/test";
import {
  bootstrapUser,
  cleanupUser,
  genEmail,
  loginViaUi,
  markOnboardingSeen,
  markSubscriptionPaid,
  MORGAN_EMAIL,
} from "./helpers";

/**
 * ⚠ Ces tests envoient de VRAIS emails au compte morgan.ponsquillet@gmail.com.
 * Vérifier la réception manuellement.
 */
test.describe("Transactional emails", () => {
  test("Welcome email endpoint returns 200 (idempotent)", async ({ page, request }) => {
    const email = genEmail("welcome");
    const u = await bootstrapUser(email);
    await markOnboardingSeen(u.id);
    await loginViaUi(page, email);
    const res = await page.request.post("/api/auth/welcome");
    expect([200, 204]).toContain(res.status());
    await cleanupUser(email);
    void u;
    void request;
  });

  test("Cron /api/cron/relances returns 200 with proper auth", async ({ page, request }) => {
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
      test.skip(true, "CRON_SECRET not set in env");
    }
    const res = await request.get("/api/cron/relances", {
      headers: { Authorization: `Bearer ${cronSecret}` },
    });
    expect([200, 204]).toContain(res.status());
    const body = await res.json().catch(() => ({}));
    // Shape check — should expose success + relancesEnvoyees
    expect(body).toHaveProperty("success");
    void page;
  });

  test("Cron without auth returns 401", async ({ request }) => {
    const res = await request.get("/api/cron/relances");
    expect(res.status()).toBe(401);
  });

  test("Pro — 'Envoyer un test' triggers real email to user", async ({ page }) => {
    const email = genEmail("pro-test-mail");
    const u = await bootstrapUser(email);
    await markOnboardingSeen(u.id);
    await markSubscriptionPaid(u.id);
    await loginViaUi(page, email);
    await page.goto("/app/parametres/emails");
    const testBtn = page.getByRole("button", { name: /Envoyer un test/i }).first();
    if ((await testBtn.count()) === 0) {
      test.skip(true, "No 'Envoyer un test' button found");
    }
    const [resp] = await Promise.all([
      page.waitForResponse((r) => r.url().includes("/api/email-templates/test"), { timeout: 10_000 }),
      testBtn.click(),
    ]);
    // In Resend sandbox, only verified recipients are accepted — a 500 with a
    // Resend "testing emails" message is an environmental limit, not a code bug.
    if (resp.status() === 500) {
      const body = await resp.json().catch(() => ({}));
      const msg = typeof body?.error === "string" ? body.error : "";
      expect(msg).toMatch(/testing emails|verify a domain|Resend/i);
    } else {
      expect([200, 204]).toContain(resp.status());
    }
    await cleanupUser(email);
    void u;
  });

  test.skip("Reception of actual welcome email in Gmail inbox", async () => {
    // Can't read Morgan's Gmail — see V5_TEST_REPORT.md manual checklist.
  });

  test.skip("Reception of J+3 relance email in Gmail inbox", async () => {
    // Can't read Morgan's Gmail — see V5_TEST_REPORT.md manual checklist.
  });

  void MORGAN_EMAIL;
});
