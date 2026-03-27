import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth";
import { ensureModelAllowlistEntry } from "openclaw/plugin-sdk/provider-onboard";
import { buildBytePlusCodingProvider, buildBytePlusProvider } from "./provider-catalog.js";
import { BYTEPLUS_DEFAULT_MODEL_REF, REASONING_MODEL_IDS } from "./byteplus-models.js";

const PLUGIN_ID = "@encircleacity2/byteplus-modelark";
const PROVIDER_ID = "byteplus-modelark";

export default definePluginEntry({
  id: PLUGIN_ID,
  name: "BytePlus ModelArk",
  description: "BytePlus ModelArk model provider plugin",
  register(api) {
    api.registerProvider({
      id: PROVIDER_ID,
      label: "BytePlus ModelArk",
      docsPath: "/concepts/model-providers#byteplus-international",
      envVars: ["BYTEPLUS_API_KEY"],

      auth: [
        createProviderApiKeyAuthMethod({
          providerId: PROVIDER_ID,
          methodId: "api-key",
          label: "BytePlus ModelArk API key",
          hint: "API key from your BytePlus ModelArk console",
          optionKey: "byteplusModelarkApiKey",
          flagName: "--byteplus-modelark-api-key",
          envVar: "BYTEPLUS_API_KEY",
          promptMessage: "Enter your BytePlus ModelArk API key",
          defaultModel: BYTEPLUS_DEFAULT_MODEL_REF,
          expectedProviders: [PROVIDER_ID],
          applyConfig: (cfg) =>
            ensureModelAllowlistEntry({
              cfg,
              modelRef: BYTEPLUS_DEFAULT_MODEL_REF,
            }),
          wizard: {
            choiceId: "byteplus-modelark-api-key",
            choiceLabel: "BytePlus ModelArk API key",
            groupId: PROVIDER_ID,
            groupLabel: "BytePlus ModelArk",
            groupHint: "API key",
          },
        }),
      ],

      prepareExtraParams: (ctx) => {
        const params: Record<string, unknown> = { ...ctx.extraParams };

        // Only apply Seed-specific params for models that support deep thinking
        if (!REASONING_MODEL_IDS.has(ctx.modelId)) {
          return params;
        }

        // service_tier: use TPM guarantee packages when available (Seed-specific)
        if (!params.service_tier) {
          params.service_tier = "auto";
        }

        if (ctx.thinkingLevel == null || ctx.thinkingLevel === "off") {
          // Explicitly disable thinking
          if (!params.thinking) params.thinking = { type: "disabled" };
          if (!params.reasoning_effort) params.reasoning_effort = "minimal";
        } else {
          // Map OpenClaw thinking level → Seed reasoning_effort
          const effortMap: Record<string, string> = {
            low: "low",
            medium: "medium",
            high: "high",
          };
          if (!params.thinking) params.thinking = { type: "enabled" };
          if (!params.reasoning_effort) {
            params.reasoning_effort = effortMap[ctx.thinkingLevel] ?? "medium";
          }
          // max_completion_tokens controls total output (response + CoT).
          // When set, remove max_tokens to avoid the two being sent together
          // (the API rejects requests that include both).
          if (params.max_completion_tokens) {
            delete params.max_tokens;
          }
        }

        return params;
      },

      catalog: {
        // "paired" so both byteplus-modelark and byteplus-modelark-plan are
        // registered together from a single API key resolution.
        order: "paired",
        run: async (ctx) => {
          const apiKey = ctx.resolveProviderApiKey(PROVIDER_ID).apiKey;
          if (!apiKey) {
            return null;
          }
          return {
            providers: {
              [PROVIDER_ID]: { ...buildBytePlusProvider(), apiKey },
              [`${PROVIDER_ID}-plan`]: { ...buildBytePlusCodingProvider(), apiKey },
            },
          };
        },
      },
    });
  },
});
