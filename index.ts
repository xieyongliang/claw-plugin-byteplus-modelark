import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth";
import { ensureModelAllowlistEntry } from "openclaw/plugin-sdk/provider-onboard";
import { buildBytePlusCodingProvider, buildBytePlusProvider } from "./provider-catalog.js";
import { BYTEPLUS_CODING_DEFAULT_MODEL_REF } from "./byteplus-models.js";

/** Plugin identity — the unique name of this installable plugin. */
const PLUGIN_ID = "byteplus-modelark";

/**
 * The provider ID used inside openclaw's provider registry.
 * "byteplus" owns the API key; "byteplus-plan" is the paired coding endpoint.
 */
const PROVIDER_ID = "byteplus";

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
          optionKey: "byteplusApiKey",
          flagName: "--byteplus-api-key",
          envVar: "BYTEPLUS_API_KEY",
          promptMessage: "Enter your BytePlus ModelArk API key",
          defaultModel: BYTEPLUS_CODING_DEFAULT_MODEL_REF,
          expectedProviders: [PROVIDER_ID],
          applyConfig: (cfg) =>
            ensureModelAllowlistEntry({
              cfg,
              modelRef: BYTEPLUS_CODING_DEFAULT_MODEL_REF,
            }),
          wizard: {
            choiceId: "byteplus-modelark-api-key",
            choiceLabel: "BytePlus ModelArk API key",
            groupId: "byteplus-modelark",
            groupLabel: "BytePlus ModelArk",
            groupHint: "API key",
          },
        }),
      ],

      catalog: {
        // "paired" so both byteplus and byteplus-plan are registered together
        // from a single API key resolution.
        order: "paired",
        run: async (ctx) => {
          const apiKey = ctx.resolveProviderApiKey(PROVIDER_ID).apiKey;
          if (!apiKey) {
            return null;
          }
          return {
            providers: {
              byteplus: { ...buildBytePlusProvider(), apiKey },
              "byteplus-plan": { ...buildBytePlusCodingProvider(), apiKey },
            },
          };
        },
      },
    });
  },
});
