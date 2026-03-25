# @encircleacity2/byteplus-modelark

An [OpenClaw](https://github.com/openclaw/openclaw) plugin that adds [BytePlus ModelArk](https://www.byteplus.com/en/product/modelark) as a model provider.

## Providers

| Provider ID | Endpoint | Description |
|---|---|---|
| `byteplus` | `ark.ap-southeast.bytepluses.com/api/v3` | General-purpose models (Seed 1.8, Kimi K2.5, GLM 4.7) |
| `byteplus-plan` | `ark.ap-southeast.bytepluses.com/api/coding/v3` | Coding plan models (Ark Code Latest) |

Both providers are registered from a single `BYTEPLUS_API_KEY`.

## Models

### `byteplus` (general)

| Model ID | Name | Input | Context | Max Tokens |
|---|---|---|---|---|
| `seed-2-0-pro-260328` | Seed 2.0 Pro | text, image | 256 000 | 8 192 |
| `seed-2-0-lite-260228` | Seed 2.0 Lite | text, image | 256 000 | 4 096 |
| `seed-1-8-251228` | Seed 1.8 | text, image | 256 000 | 4 096 |
| `kimi-k2-5` | Kimi K2.5 | text | 131 072 | 16 384 |
| `glm-4-7` | GLM 4.7 | text, image | 128 000 | 8 192 |

### `byteplus-plan` (coding)

| Model ID | Name | Input | Context | Max Tokens |
|---|---|---|---|---|
| `ark-code-latest` | Ark Code (Latest) | text | 256 000 | 8 192 |

## Setup

**Environment variable:**

```sh
export BYTEPLUS_API_KEY=your_api_key_here
```

**CLI flag:**

```sh
openclaw --byteplus-api-key <key>
```

**Onboarding wizard:**

```sh
openclaw onboard
# Select "BytePlus ModelArk API key" when prompted
```

## Default model

`byteplus/seed-2-0-pro-260328`

## Files

| File | Purpose |
|---|---|
| `index.ts` | Plugin entry point — registers the provider via `definePluginEntry` |
| `byteplus-models.ts` | Self-contained model catalog, base URLs, and cost config |
| `provider-catalog.ts` | Builds `ModelProviderConfig` objects for both endpoints |
| `openclaw.plugin.json` | Plugin manifest — provider IDs, auth env vars, CLI flags |
| `package.json` | Package definition with `openclaw.providers` metadata |
