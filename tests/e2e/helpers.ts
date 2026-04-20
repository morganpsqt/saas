import { expect, type Page } from "@playwright/test";

export const TEST_PASSWORD = "Test123456!";
export const MORGAN_EMAIL = "morgan.ponsquillet@gmail.com";

export function genEmail(prefix = "test") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}@relya-test.local`;
}

/**
 * Signs a user up via the signup form. If the Supabase project requires email
 * confirmation we get redirected to /login?confirm=1 — in that case the caller
 * should use `bootstrapUser` instead (which uses service-role admin API).
 */
export async function signupViaUi(page: Page, email: string, password = TEST_PASSWORD) {
  await page.goto("/signup");
  await page.locator("input[type=email]").fill(email);
  await page.locator("input[type=password]").fill(password);
  await page.getByRole("button", { name: /Créer mon compte/i }).click();
  await page.waitForURL(/\/(app|login|subscribe)/, { timeout: 15_000 });
}

/**
 * Creates a user with the service-role key and confirms their email. This
 * bypasses the (optional) email-confirmation requirement of the Supabase
 * project so the tests can log in immediately.
 */
export async function bootstrapUser(
  email: string,
  password = TEST_PASSWORD
): Promise<{ id: string; email: string }> {
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !serviceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !data.user) {
    throw new Error(`Admin createUser failed: ${error?.message ?? "unknown"}`);
  }
  return { id: data.user.id, email: data.user.email! };
}

export async function cleanupUser(email: string) {
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    if (!url || !serviceKey) return;
    const admin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const u = data?.users.find((x) => x.email === email);
    if (u) await admin.auth.admin.deleteUser(u.id);
  } catch {
    /* best effort */
  }
}

export async function loginViaUi(page: Page, email: string, password = TEST_PASSWORD) {
  await page.goto("/login");
  await page.locator("input[type=email]").fill(email);
  await page.locator("input[type=password]").fill(password);
  await page.getByRole("button", { name: /Se connecter/i }).click();
  await page.waitForURL(/\/(app|subscribe)/, { timeout: 15_000 });
}

export async function markOnboardingSeen(userId: string) {
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  await admin
    .from("profiles")
    .upsert({ user_id: userId, has_seen_onboarding: true }, { onConflict: "user_id" });
}

export async function markSubscriptionPaid(userId: string) {
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  await admin
    .from("subscriptions")
    .update({
      status: "active",
      setup_paid: true,
      current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
    })
    .eq("user_id", userId);
}

export async function expectOnDashboard(page: Page) {
  await page.waitForURL(/\/app(?!\/)/, { timeout: 10_000 });
  await expect(page.getByRole("heading", { name: /Mes devis/i }).first()).toBeVisible();
}
