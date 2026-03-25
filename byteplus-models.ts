/**
 * BytePlus ModelArk — model catalog and provider constants.
 *
 * Inlined from the main openclaw app's src/agents/byteplus-models.ts so this
 * plugin is fully self-contained and does not depend on any app-internal modules.
 */

// ─── Base URLs ────────────────────────────────────────────────────────────────

export const BYTEPLUS_BASE_URL =
  "https://ark.ap-southeast.bytepluses.com/api/v3";

export const BYTEPLUS_CODING_BASE_URL =
  "https://ark.ap-southeast.bytepluses.com/api/coding/v3";

// ─── Default model refs ───────────────────────────────────────────────────────

export const BYTEPLUS_DEFAULT_MODEL_ID = "seed-2-0-pro-260328";
export const BYTEPLUS_CODING_DEFAULT_MODEL_ID = "ark-code-latest";
export const BYTEPLUS_DEFAULT_MODEL_REF = `byteplus-modelark/${BYTEPLUS_DEFAULT_MODEL_ID}`;
export const BYTEPLUS_CODING_DEFAULT_MODEL_REF = `byteplus-modelark-plan/${BYTEPLUS_CODING_DEFAULT_MODEL_ID}`;

// ─── Pricing ──────────────────────────────────────────────────────────────────

/** Cost per 1 000 tokens in USD (approximate; adjust to actual BytePlus pricing). */
export const BYTEPLUS_DEFAULT_COST = {
  input: 0.0001,
  output: 0.0002,
  cacheRead: 0,
  cacheWrite: 0,
} as const;

// ─── Model catalogs ───────────────────────────────────────────────────────────

/**
 * General-purpose BytePlus ARK models served at BYTEPLUS_BASE_URL.
 *
 * Corresponds to BYTEPLUS_MODEL_CATALOG in the main app, including the shared
 * Volcengine entries (Kimi K2.5, GLM 4.7) that BytePlus ARK also exposes.
 */
export const BYTEPLUS_MODEL_CATALOG = [
  {
    id: "seed-2-0-pro-260328",
    name: "Seed 2.0 Pro",
    reasoning: false,
    input: ["text", "image"] as ["text", "image"],
    cost: BYTEPLUS_DEFAULT_COST,
    contextWindow: 256_000,
    maxTokens: 8_192,
  },
  {
    id: "seed-2-0-lite-260228",
    name: "Seed 2.0 Lite",
    reasoning: false,
    input: ["text", "image"] as ["text", "image"],
    cost: BYTEPLUS_DEFAULT_COST,
    contextWindow: 256_000,
    maxTokens: 4_096,
  },
  {
    id: "seed-1-8-251228",
    name: "Seed 1.8",
    reasoning: false,
    input: ["text", "image"] as ["text", "image"],
    cost: BYTEPLUS_DEFAULT_COST,
    contextWindow: 256_000,
    maxTokens: 4_096,
  },
  {
    // VOLC_MODEL_KIMI_K2_5
    id: "kimi-k2-5",
    name: "Kimi K2.5",
    reasoning: true,
    input: ["text"] as ["text"],
    cost: BYTEPLUS_DEFAULT_COST,
    contextWindow: 131_072,
    maxTokens: 16_384,
  },
  {
    // VOLC_MODEL_GLM_4_7
    id: "glm-4-7",
    name: "GLM 4.7",
    reasoning: false,
    input: ["text", "image"] as ["text", "image"],
    cost: BYTEPLUS_DEFAULT_COST,
    contextWindow: 128_000,
    maxTokens: 8_192,
  },
] as const;

/**
 * Coding-plan models served at BYTEPLUS_CODING_BASE_URL.
 *
 * Corresponds to BYTEPLUS_CODING_MODEL_CATALOG / VOLC_SHARED_CODING_MODEL_CATALOG
 * in the main app.
 */
export const BYTEPLUS_CODING_MODEL_CATALOG = [
  {
    id: "ark-code-latest",
    name: "Ark Code (Latest)",
    reasoning: false,
    input: ["text"] as ["text"],
    cost: BYTEPLUS_DEFAULT_COST,
    contextWindow: 256_000,
    maxTokens: 8_192,
  },
] as const;

export type BytePlusCatalogEntry = (typeof BYTEPLUS_MODEL_CATALOG)[number];
export type BytePlusCodingCatalogEntry =
  (typeof BYTEPLUS_CODING_MODEL_CATALOG)[number];
