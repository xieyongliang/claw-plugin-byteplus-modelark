import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-models";
import {
  BYTEPLUS_BASE_URL,
  BYTEPLUS_CODING_BASE_URL,
  BYTEPLUS_CODING_MODEL_CATALOG,
  BYTEPLUS_MODEL_CATALOG,
} from "./byteplus-models.js";

export function buildBytePlusProvider(): ModelProviderConfig {
  return {
    baseUrl: BYTEPLUS_BASE_URL,
    api: "openai-completions",
    models: [...BYTEPLUS_MODEL_CATALOG],
  };
}

export function buildBytePlusCodingProvider(): ModelProviderConfig {
  return {
    baseUrl: BYTEPLUS_CODING_BASE_URL,
    api: "openai-completions",
    models: [...BYTEPLUS_CODING_MODEL_CATALOG],
  };
}
