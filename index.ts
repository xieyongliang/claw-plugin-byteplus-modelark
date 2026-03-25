import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth";
import { ensureModelAllowlistEntry } from "openclaw/plugin-sdk/provider-onboard";
import { buildBytePlusCodingProvider, buildBytePlusProvider } from "./provider-catalog.js";
import { BYTEPLUS_DEFAULT_MODEL_REF } from "./byteplus-models.js";

const PROVIDER_ID = "byteplus-modelark";

export default definePluginEntry({
  id: PROVIDER_ID,
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
          flagName: "--byteplus-api-key",
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
