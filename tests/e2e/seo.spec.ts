import { test, expect } from "@playwright/test";

test.describe("SEO — robots & sitemap", () => {
  test("GET /robots.txt returns a text document", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body.toLowerCase()).toContain("user-agent");
    expect(body.toLowerCase()).toMatch(/sitemap/);
  });

  test("GET /sitemap.xml returns valid XML with homepage", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("<urlset");
    expect(body).toMatch(/<loc>[^<]+<\/loc>/);
  });

  test("Icon route served (app/icon.tsx)", async ({ page }) => {
    await page.goto("/");
    const icon = page.locator('link[rel="icon"]');
    // With app/icon.tsx, Next.js should auto-inject a <link rel="icon">
    const count = await icon.count();
    expect(count).toBeGreaterThan(0);
    const href = await icon.first().getAttribute("href");
    expect(href).toBeTruthy();
    const res = await page.request.get(href!);
    expect([200, 304]).toContain(res.status());
  });
});
