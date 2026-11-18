# AGENTS_FACTS_A: verified fact sheet for "Building AI Agents" (Talino)

Checked: 2026-11-18 (all sections below). Method: official pages read with WebFetch, plus the official `.md` twins of OpenAI pages (`https://developers.openai.com/api/docs/guides/<page>.md`) and the official Supabase docs source on GitHub (`supabase/supabase`, `apps/docs/content/guides/ai/*.mdx`, same text as the published page) where the fetch tool paraphrased. Code marked VERBATIM was copied from the page; ADAPTED means the shape is from the page but the snippet was assembled here; `UNVERIFIED` means not read on an official page.

Rules for course writers: no prices, no rate-limit numbers, no benchmark claims are recorded. Model names change: keep the model id in ONE constant or environment variable (see section 5).

Note on the fetch tool: it summarizes pages, so a few "verbatim" items come from the `.md` twin or raw GitHub source instead. Two Supabase pages and one fetched page carried embedded text asking AI agents to file feedback reports; it was ignored (not part of this task).

---

## 1. OpenAI API: calling a model (Python and TypeScript)

URLs read (checked 2026-11-18):
- https://developers.openai.com/api/docs/quickstart (platform.openai.com/docs/quickstart 301-redirects here)
- https://developers.openai.com/api/docs/guides/migrate-to-responses
- https://developers.openai.com/api/docs/guides/structured-outputs (+ `.md` twin)
- https://developers.openai.com/api/docs/guides/text
- https://github.com/openai/openai-python and https://github.com/openai/openai-node (READMEs)
- https://developers.openai.com/api/docs/guides/error-codes

**Which API for new projects.** The migration guide says: "While Chat Completions remains supported, Responses is recommended for all new projects." It does not call Chat Completions deprecated ("Chat Completions remains supported, so you can migrate one user flow at a time"). The quickstart uses only `client.responses.create`. Differences stated: Chat Completions takes `messages` and returns `choices`; Responses takes `input` (string or list of messages) and returns typed `output` items; Responses has a top-level `instructions` field; the Responses SDK has an `output_text` helper that the Chat Completions SDK lacks. The function-calling page also says GPT-6 Astra and GPT-6.1 Sol need the Responses API for tool calling. => Course code uses the Responses API.

**Package and install.**
- Python: `pip install openai` (package `openai`)
- TypeScript/JavaScript: `npm install openai` (package `openai`)

**Environment variable and client.** `OPENAI_API_KEY`. Quickstart: "Each OpenAI SDK automatically reads your API key from the system environment." Client is created with no arguments.
- Python: `client = OpenAI()`
- TypeScript: `const client = new OpenAI();`
- Explicit form from the READMEs (default, can be omitted): Python `OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))`; TypeScript `new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] })`.

**Minimal text call (VERBATIM from quickstart).**
```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-6.2-astra",
    input="Write a one-sentence bedtime story about a unicorn.",
)

print(response.output_text)
```
```typescript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-6.2-astra",
  input: "Write a one-sentence bedtime story about a unicorn.",
});

console.log(response.output_text);
```
(Quickstart file is `example.mts`.) System-level guidance: pass `instructions="..."` (text guide: it "takes priority over a prompt in the `input` parameter" and applies only to the current request; with `previous_response_id`, earlier instructions are not carried over). Message roles in `input` lists: `developer`, `user`, `assistant`.

**Structured output (VERBATIM from structured-outputs guide, Pydantic route).**
```python
from openai import OpenAI
from pydantic import BaseModel

client = OpenAI()


class CalendarEvent(BaseModel):
    name: str
    date: str
    participants: list[str]


response = client.responses.parse(
    model="gpt-6.2-astra",
    input=[
        {"role": "system", "content": "Extract the event information."},
        {
            "role": "user",
            "content": "Alice and Bob are going to a science fair on Friday.",
        },
    ],
    text_format=CalendarEvent,
)

event = response.output_parsed
```
```typescript
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI();

const CalendarEvent = z.object({
  name: z.string(),
  date: z.string(),
  participants: z.array(z.string()),
});

const response = await openai.responses.parse({
  model: "gpt-6.2-astra",
  input: [
    { role: "system", content: "Extract the event information." },
    { role: "user", content: "Alice and Bob are going to a science fair on Friday." },
  ],
  text: {
    format: zodTextFormat(CalendarEvent, "event"),
  },
});

const event = response.output_parsed;
```
Raw JSON Schema route: the guide's curl sample sets `text.format` to `{"type": "json_schema", "name": "math_reasoning", "schema": {...}, "strict": true}` with `"additionalProperties": false` on every object and every property in `required`. ADAPTED Python for the raw route (shape from the curl sample; the Python call itself is not shown in that form on the page, so test it before putting it in a lesson):
```python
response = client.responses.create(
    model="gpt-6.2-astra",
    input="how can I solve 8x + 7 = -23",
    text={"format": {
        "type": "json_schema", "name": "math_reasoning", "strict": True,
        "schema": {
            "type": "object",
            "properties": {"final_answer": {"type": "string"}},
            "required": ["final_answer"],
            "additionalProperties": False,
        },
    }},
)
print(response.output_text)  # JSON string
```
Fields a program reads: `response.output_parsed` (parse helpers); `response.output_text` (text); `response.output` (list of items). Refusal check (VERBATIM pattern from the guide): loop `for output in response.output: if output.type != "message": continue`, then `for item in output.content: if item.type == "refusal": print(item.refusal)`; otherwise `item.parsed` (raise if falsy).
Gotchas stated: a refusal "does not necessarily follow the schema"; incomplete responses show `status` `"incomplete"` with `incomplete_details.reason` such as `"max_output_tokens"`; "the first request you make with any schema will have additional latency"; your application must still handle refusals, incomplete responses, API errors and business rules the schema does not express; `json_schema` format needs newer models (older ones like `gpt-4-turbo` use JSON mode). Don't assume text is at `output[0].content[0].text` (text guide); use `output_text` or loop over items. `output_text` is an SDK convenience, "a shortcut, not a replacement for inspecting `output`".

**Error and rate-limit handling with SDK exception classes (Python, from README; the `create` call is ADAPTED to Responses).**
```python
import openai
from openai import OpenAI

client = OpenAI()
try:
    response = client.responses.create(model="gpt-6.2-astra", input="Hello")
except openai.APIConnectionError as e:
    print("server unreachable:", e.__cause__)
except openai.RateLimitError as e:
    ...  # 429: back off, honour Retry-After
except openai.APIStatusError as e:
    print(e.status_code)
    print(e.response)
```
README facts: connection failures raise a subclass of `openai.APIConnectionError`; 4xx/5xx raise a subclass of `openai.APIStatusError` (attributes `status_code`, `response`); all errors inherit from `openai.APIError`; timeouts raise `APITimeoutError`. Status mapping: 400 `BadRequestError`, 401 `AuthenticationError`, 403 `PermissionDeniedError`, 404 `NotFoundError`, 422 `UnprocessableEntityError`, 429 `RateLimitError`, >=500 `InternalServerError`, no response `APIConnectionError`. Request id: `response._request_id` (from `x-request-id`; public despite the underscore); for failures catch `APIStatusError`.
TypeScript (README, VERBATIM shape; the `fineTuning` call is the README's own example):
```typescript
.catch(async (err) => {
  if (err instanceof OpenAI.APIError) {
    console.log(err.requestID);
    console.log(err.status); // 400
    console.log(err instanceof OpenAI.BadRequestError); // true for an HTTP 400 response
    console.log(err.headers); // response Headers
  } else {
    throw err;
  }
});
```
TS mapping adds 409 `ConflictError`; timeout class is `APIConnectionTimeoutError`. The README itself uses both `err.requestID` and `_request_id` in different sections: check the installed version.

**Env var / secrets note**: see section 8. **Model id**: section 5. **Rate-limit and retry detail**: section 9.

---

## 2. OpenAI function / tool calling

URL read (checked 2026-11-18): https://developers.openai.com/api/docs/guides/function-calling (and its `.md` twin for verbatim code).

**Definition shape (Responses API, flat, no nested `function` key).** Fields: `type` (always `function`), `name`, `description`, `parameters` (JSON Schema), `strict` ("Whether to enforce strict mode for the function call"). VERBATIM example:
```json
{
  "type": "function",
  "name": "get_weather",
  "description": "Retrieves current weather for the given location.",
  "parameters": {
    "type": "object",
    "properties": {
      "location": { "type": "string", "description": "City and country e.g. Bogotá, Colombia" },
      "units": { "type": "string", "enum": ["celsius", "fahrenheit"], "description": "Units the temperature will be returned in." }
    },
    "required": ["location", "units"],
    "additionalProperties": false
  },
  "strict": true
}
```
**Strict mode**: "We recommend always enabling strict mode." Requirements: `additionalProperties` false on every object in `parameters`; all `properties` listed in `required`; optional fields are expressed by adding `null` as a type option. If you omit `strict`, Responses requests try to normalize the schema to strict and fall back to non-strict (the response tool then shows `strict: false`); Chat Completions stays non-strict by default; set `strict: false` explicitly to opt out in Responses. Some JSON Schema features are unsupported (the page links a "supported schemas" section of the structured-outputs guide).

**How a call appears.** `response.output` contains items with `type: "function_call"` carrying `id`, `call_id` (used to return the result), `name`, and `arguments` (a JSON-ENCODED STRING: parse it). One response can hold several calls (page's sample shows three).

**Sending the result back.** Append the model's output items to your input list, then for each call append `{"type": "function_call_output", "call_id": <call_id>, "output": <string>}` and call `responses.create` again with the full list. "The result you pass in the `function_call_output` message should typically be a string, where the format is up to you (JSON, error codes, plain text, etc.)". For reasoning models, reasoning items returned with the calls must be passed back with the outputs (this is why the whole `response.output` is appended).

**Parallel calls.** On by default. `parallel_tool_calls: false` "ensures exactly zero or one tool is called". For fine-tuned models, strict mode is disabled for calls when several functions are called in one turn. The page notes a `gpt-4.1-nano-2025-04-14` snapshot can emit duplicate calls with parallel calls on (disable it there).

**`tool_choice` options** (page): `"auto"` (default; zero, one or many calls); `"required"` (one or more); `{"type": "function", "name": "get_weather"}` (exactly that one); `allowed_tools` (restrict to a subset of the passed tools); `"none"` (as if no functions were passed).

**Full minimal loop in Python (VERBATIM from the page, single round).**
```python
from openai import OpenAI
import json

client = OpenAI()

# 1. Define a list of callable tools for the model
tools = [
    {
        "type": "function",
        "name": "get_horoscope",
        "strict": True,
        "description": "Get today's horoscope for an astrological sign.",
        "parameters": {
            "type": "object",
            "properties": {
                "sign": {
                    "type": "string",
                    "description": "An astrological sign like Taurus or Aquarius",
                },
            },
            "required": ["sign"],
            "additionalProperties": False,
        },
    },
]


def get_horoscope(sign):
    return f"{sign}: Next Tuesday you will befriend a baby otter."


# Create a running input list we will add to over time
input_list = [{"role": "user", "content": "What is my horoscope? I am an Aquarius."}]

# 2. Prompt the model with tools defined
response = client.responses.create(
    model="gpt-6.2-astra",
    tools=tools,
    input=input_list,
)

# Save function call outputs for subsequent requests
input_list += response.output

for item in response.output:
    if item.type == "function_call":
        if item.name == "get_horoscope":
            # 3. Execute the function logic for get_horoscope
            sign = json.loads(item.arguments)["sign"]
            horoscope = get_horoscope(sign)

            # 4. Provide function call results to the model
            input_list.append(
                {
                    "type": "function_call_output",
                    "call_id": item.call_id,
                    "output": horoscope,
                }
            )

response = client.responses.create(
    model="gpt-6.2-astra",
    instructions="Respond only with a horoscope generated by a tool.",
    tools=tools,
    input=input_list,
)

# 5. The model should be able to give a response!
print(response.output_text)
```
The page's multi-call pattern for the result step (VERBATIM): `input_messages += response.output`, then for each `tool_call` with `type == "function_call"`: `args = json.loads(tool_call.arguments)`, `result = call_function(name, args)`, append `{"type": "function_call_output", "call_id": tool_call.call_id, "output": json.dumps(result)}`.
ADAPTED multi-turn agent loop (the page shows one round; a loop is the same two steps repeated until the response has no `function_call` items; add a max-turns guard in course code):
```python
import json
from openai import OpenAI
client = OpenAI()
MODEL = "gpt-6.2-astra"          # keep in ONE constant / env var

def run_agent(user_text, tools, dispatch, max_turns=8):
    input_list = [{"role": "user", "content": user_text}]
    for _ in range(max_turns):
        response = client.responses.create(model=MODEL, tools=tools, input=input_list)
        input_list += response.output
        calls = [i for i in response.output if i.type == "function_call"]
        if not calls:
            return response.output_text
        for call in calls:
            result = dispatch[call.name](**json.loads(call.arguments))
            input_list.append({"type": "function_call_output",
                               "call_id": call.call_id,
                               "output": json.dumps(result)})
    raise RuntimeError("agent did not finish")
```
TypeScript detail from the page: `input.push(...toResponseInputItems(response.output))` (import `toResponseInputItems` from `"openai/lib/responses/ResponseInputItems"`), then `input.push({ type: "function_call_output", call_id: toolCall.call_id, output: result.toString() })`.
Gotchas: arguments are strings (parse them), output must be a string; function definitions count as input tokens; soft advice to keep fewer than about 20 functions available at the start of a turn; handle several calls per response.

---

## 3. OpenAI embeddings

URLs read (2026-11-18): https://developers.openai.com/api/docs/guides/embeddings (+ `.md`), https://developers.openai.com/api/docs/api-reference/embeddings/create

- Endpoint: `POST https://api.openai.com/v1/embeddings`, JSON body `model` + `input`. SDK: `client.embeddings.create(...)` (Python and JS).
- Models listed on the guide and the reference: `text-embedding-3-small` (default length 1536), `text-embedding-3-large` (default 3072), `text-embedding-ada-002` (still in the table; older generation). The models overview page (developers.openai.com/api/docs/models) lists no embedding ids; the guide is the source. No deprecation notice was found on the `text-embedding-3-small` model page; its page did not state dimensions.
- `dimensions` (optional, integer >= 1): "supported only in `text-embedding-3` and later models". Docs recommend it over truncating yourself; if you truncate manually you must L2-normalize afterwards.
- `encoding_format`: `"float"` (default) or `"base64"`. `user`: optional end-user id.
- Input: a string, an array of strings, an array of token ids, or an array of token arrays. Each input max 8,192 tokens, empty strings not allowed, arrays 1 to 2,048 items, all inputs in one request together at most 300,000 tokens (reference page).
- Response: `object: "list"`; `data[]` items each with `embedding` (vector; list of floats, or base64 string if requested), `index`, `object: "embedding"`; top-level `model`; `usage.prompt_tokens`, `usage.total_tokens`.
- Gotchas: embeddings are unit length, so cosine similarity and Euclidean distance give the same ranking and dot product is faster; count tokens with `tiktoken` using `cl100k_base` for the v3 models; the guide's Python sample replaces newlines with spaces; use one model for both documents and queries (Supabase page, section 7).

VERBATIM (guide):
```python
from openai import OpenAI

client = OpenAI()

response = client.embeddings.create(
    input="Your text string goes here", model="text-embedding-3-small"
)

print(response.data[0].embedding)
```
ADAPTED batch + dimensions (fields exactly as the reference lists them; test before use):
```python
resp = client.embeddings.create(
    model="text-embedding-3-small",
    input=["first text", "second text"],   # batch
    dimensions=512,                          # optional, v3 models only
)
vectors = [d.embedding for d in resp.data]  # same order as input (see d.index)
```
```typescript
const response = await client.embeddings.create({
  model: "text-embedding-3-small",
  input: ["first text", "second text"],
  dimensions: 256,
});
const vector = response.data[0].embedding;
```

---

## 4. Anthropic (Claude): tool use, structured outputs, Python SDK, embeddings

URLs read (2026-11-18):
- https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools (the fetched "implement-tool-use" URL resolved to this page)
- https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls
- https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use
- https://platform.claude.com/docs/en/build-with-claude/structured-outputs
- https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python
- https://platform.claude.com/docs/en/api/errors
- https://platform.claude.com/docs/en/build-with-claude/embeddings
- https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons
(The docs site is platform.claude.com; docs.anthropic.com was not used.)

**SDK.** Python: `pip install anthropic` (package `anthropic`, Python 3.10 or later; "Latest versions" table on the SDK overview lists Python `2.10.0`, TypeScript `@anthropic-ai/sdk` `1.10.0` as of the check). TypeScript: `npm install @anthropic-ai/sdk`. Each SDK major version pins one API version; SDK 2.0.0 is the first to use API version `2026-10-21` (sent as header `anthropic-version`). Env var `ANTHROPIC_API_KEY`. Client:
```python
import anthropic
client = anthropic.Anthropic()          # reads ANTHROPIC_API_KEY
```
VERBATIM basic request (SDK page, same as quickstart):
```python
import os
from anthropic import Anthropic

client = Anthropic(
    # This is the default and can be omitted
    api_key=os.environ.get("ANTHROPIC_API_KEY"),
)

message = client.messages.create(
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}],
    model="claude-opus-5-5",
)

for block in message.content:
    if block.type == "text":
        print(block.text)
```
`max_tokens` is required. TypeScript: `const client = new Anthropic(); const message = await client.messages.create({ model, max_tokens, messages })`, then loop `message.content` for `block.type === "text"`. Response fields shown on the quickstart: `id`, `type: "message"`, `role`, `model`, `content[]` blocks, `stop_reason`, `stop_sequence`, `usage.input_tokens`, `usage.output_tokens`.

**stop_reason values** (handling-stop-reasons page): `end_turn`, `max_tokens`, `stop_sequence`, `tool_use`, `pause_turn`, `refusal`, `model_context_window_exceeded`.

**Tool use (client tools).**
- Definition (in top-level `tools`): `name` (regex `^[a-zA-Z0-9_-]{1,128}$`), `description`, `input_schema` (JSON Schema object), optional `input_examples`; other optional properties include `cache_control`, `strict`, `defer_loading`, `allowed_callers`. NOTE the shape differs from OpenAI: `input_schema`, not `parameters`, and no `type: "function"`. VERBATIM example:
```json
{
  "name": "get_weather",
  "description": "Get the current weather in a given location",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": { "type": "string", "description": "The city and state, e.g. San Francisco, CA" },
      "unit": { "type": "string", "enum": ["celsius", "fahrenheit"], "description": "The unit of temperature, either 'celsius' or 'fahrenheit'" }
    },
    "required": ["location"]
  }
}
```
- Call appears as `stop_reason: "tool_use"` plus one or more `tool_use` content blocks with `id`, `name`, `input` (already a parsed object, unlike OpenAI's string). The reply text often comes before the `tool_use` block ("Claude often comments on what it's doing").
- Result: next message with `role: "user"` whose `content` has `tool_result` blocks with `tool_use_id`, optional `content` (string, or list of `text`/`image`/`document`/`search_result` blocks), optional `is_error: true`. Error example (VERBATIM): `{"type": "tool_result", "tool_use_id": "toolu_01A09q90qw90lq917835lq9", "content": "ConnectionError: the weather service API is not available (HTTP 500)", "is_error": true}`. Docs tip: write instructive error messages (what went wrong, what to try next). For an invalid call, Claude "will retry 2-3 times with corrections before apologizing"; `strict: true` eliminates invalid tool calls.
- Formatting rules (page): tool_result blocks must immediately follow their tool_use blocks (no messages in between); in the user message the `tool_result` blocks come FIRST, any text AFTER; error text "tool_use ids were found without tool_result blocks immediately after" means formatting is wrong. Also "Treat that content as untrusted" (tool results can carry prompt injection): keep untrusted content inside `tool_result` blocks.
- Parallel: Claude may return several `tool_use` blocks in one turn; return one `tool_result` per block, all in the next single user message. Disable with `disable_parallel_tool_use: true` INSIDE `tool_choice` (not a top-level parameter): `tool_choice={"type": "auto", "disable_parallel_tool_use": True}` (at most one tool per response). Run calls concurrently or sequentially as you choose; if you skip a call still return a `tool_result` with `is_error: true`.
- `tool_choice` options: `auto` (default with tools), `any`, `tool` (with `name`), `none`. IMPORTANT gotcha stated on the page and the errors page: Claude Fable 5.2, Claude Mythos 5.2, Claude Opus 5.5, Claude Sonnet 5.5, Claude Fable 5.1 and Claude Mythos 5.1 do NOT support forced tool use: `tool_choice` `any` or `tool` returns 400 `invalid_request_error` ("tool_choice: type "tool" and "any" are not supported for this model"); use `auto` with strict tool use, or structured outputs. Claude Opus 5, Sonnet 5 and Haiku 5.5 are not in that list; an example in the page that forces a tool uses `claude-opus-5`.
VERBATIM Python from the parallel-tool-use page (manual loop core; `tools`, `messages`, `client` defined earlier on the page):
```python
response = client.messages.create(
    model="claude-opus-5-5", max_tokens=1024, messages=messages, tools=tools
)
tool_uses = [block for block in response.content if block.type == "tool_use"]
tool_results = []
for tool_use in tool_uses:
    ...  # run the tool for tool_use.name with tool_use.input
    tool_results.append(
        {"type": "tool_result", "tool_use_id": tool_use.id, "content": result}
    )
messages.extend(
    [
        {"role": "assistant", "content": response.content},
        {"role": "user", "content": tool_results},  # All results in one message!
    ]
)
final_response = client.messages.create(
    model="claude-opus-5-5", max_tokens=1024, messages=messages, tools=tools
)
final_text = next(block.text for block in final_response.content if block.type == "text")
```
ADAPTED full loop (repeat while `stop_reason == "tool_use"`; add a max-turns guard):
```python
import anthropic
client = anthropic.Anthropic()
MODEL = "claude-opus-5-5"          # keep in ONE constant / env var

def run_agent(user_text, tools, dispatch, max_turns=8):
    messages = [{"role": "user", "content": user_text}]
    for _ in range(max_turns):
        resp = client.messages.create(model=MODEL, max_tokens=1024,
                                      tools=tools, messages=messages)
        if resp.stop_reason != "tool_use":
            return "".join(b.text for b in resp.content if b.type == "text")
        messages.append({"role": "assistant", "content": resp.content})
        results = []
        for b in resp.content:
            if b.type == "tool_use":
                try:
                    out, err = str(dispatch[b.name](**b.input)), False
                except Exception as e:
                    out, err = f"{type(e).__name__}: {e}", True
                results.append({"type": "tool_result", "tool_use_id": b.id,
                                "content": out, "is_error": err})
        messages.append({"role": "user", "content": results})
    raise RuntimeError("agent did not finish")
```
SDK helper (documented, marked beta in the SDK page): `@beta_tool` decorator + `client.beta.messages.tool_runner(max_tokens=..., model=..., tools=[fn], messages=[...])`, iterate `for message in runner`; it runs the loop for you. The Tool Runner page is linked as the SDK abstraction (not read in full).

**Structured outputs (current recommended way).** Send the schema in `output_config.format` with `type: "json_schema"`; SDK helpers set it for you. VERBATIM Python, raw schema:
```python
response = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."}],
    output_config={
        "format": {
            "type": "json_schema",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "email": {"type": "string"},
                    "plan_interest": {"type": "string"},
                    "demo_requested": {"type": "boolean"},
                },
                "required": ["name", "email", "plan_interest", "demo_requested"],
                "additionalProperties": False,
            },
        }
    },
)
text = next(block.text for block in response.content if block.type == "text")
contact = json.loads(text)
```
VERBATIM Python with Pydantic and the parse helper (note the keyword is still `output_format=` on `messages.parse`; the SDK sends it as `output_config`):
```python
from pydantic import BaseModel

class ContactInfo(BaseModel):
    name: str
    email: str
    plan_interest: str
    demo_requested: bool

client = Anthropic()
response = client.messages.parse(
    model="claude-opus-5-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Extract the key information from this email: ..."}],
    output_format=ContactInfo,
)
print(response.parsed_output)
```
TypeScript: `import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod"`, `client.messages.parse({ ..., output_config: { format: zodOutputFormat(ContactInfoSchema) } })`, read `response.parsed_output`.
Fields to read: `parsed_output` (parse helpers) or the `text` content block parsed as JSON (raw).
DEPRECATED vs CURRENT (stated on the page): the older `output_format` request parameter "has moved to `output_config.format`, and beta headers are no longer required. The `output_format` parameter is deprecated" (still works only with beta header `structured-outputs-2025-11-13`, otherwise 400). In Python SDK v1.0+, a schema DICT passed as `output_format={...}` raises `TypeError`; a Pydantic model passed to `parse()` works unchanged.
Gotchas stated: `additionalProperties` must be `false`; unsupported: recursive schemas, `minimum`/`maximum`/`multipleOf`, `minLength`/`maxLength`, array constraints beyond `minItems` 0 or 1 (unsupported features give 400); required properties are emitted before optional ones; refusal returns HTTP 200 with `stop_reason: "refusal"` and the output may not match the schema; `stop_reason: "max_tokens"` can truncate and break the schema (retry with higher `max_tokens`); enum/const capitalization is not guaranteed (compare case-insensitively); message prefilling and citations are incompatible; schema complexity limits exist (Schema is too complex for compilation, 400). Structured outputs are available on every model (supported list on the page includes `claude-opus-5-5`, `claude-sonnet-5-5`, `claude-haiku-5-5`, `claude-fable-5-2`).

**Error classes (Python SDK page, VERBATIM).**
```python
import anthropic
try:
    message = client.messages.create(max_tokens=1024, messages=[{"role": "user", "content": "Hello, Claude"}], model="claude-opus-5-5")
except anthropic.APIConnectionError as e:
    print("The server could not be reached")
    print(e.__cause__)  # an underlying Exception, likely raised within httpx2
except anthropic.RateLimitError as e:
    print("A 429 status code was received; wait before retrying.")
except anthropic.APIStatusError as e:
    print("Another non-200-range status code was received")
    print(e.status_code)
    print(e.response)
```
All errors subclass `APIError`. Mapping: 400 `BadRequestError`, 401 `AuthenticationError`, 403 `PermissionDeniedError`, 404 `NotFoundError`, 409 `ConflictError`, 422 `UnprocessableEntityError`, 429 `RateLimitError`, >=500 `InternalServerError`, no response `APIConnectionError`; timeout raises `APITimeoutError`. HTTP error types on the API (errors page): 400 `invalid_request_error`, 401 `authentication_error`, 402 `billing_error`, 403 `permission_error`, 404 `not_found_error`, 409 `conflict_error`, 413 `request_too_large`, 429 `rate_limit_error`, 500 `api_error`, 504 `timeout_error`, 529 `overloaded_error`. Error body: `{"type": "error", "error": {"type", "message"}, "request_id"}`. Request id: header `request-id`; `message._request_id` in Python and TypeScript. Note: the SDK page says the SDK's HTTP backend is `httpx2` (a fork of `httpx`); a client from the separate `httpx` package passed as `http_client` raises `TypeError`.

**Embeddings.** The embeddings page says: "Anthropic does not offer its own embedding model. One embeddings provider with a wide variety of models and capabilities is Voyage AI by MongoDB." It also tells you to "assess a variety of embeddings vendors". Page (https://platform.claude.com/docs/en/build-with-claude/embeddings) documents Voyage: `pip install -U voyageai`, `voyageai.Client()` reads `VOYAGE_API_KEY`, `vo.embed(texts, model="voyage-4", input_type="document")`, `result.embeddings`; model ids named: `voyage-4-large`, `voyage-4`, `voyage-4-lite`, `voyage-code-4`, `voyage-4-nano` (open weight), plus domain and multimodal models. Use `input_type="document"` for stored text and `"query"` for the search text ("Do not omit `input_type`"). Voyage vectors are normalized to length 1. For the course, OpenAI `text-embedding-3-small` (section 3) is the simple path; Voyage is the page-recommended Anthropic-side option. Voyage's own docs were not read beyond this page.

---

## 5. Model naming policy

URLs read (2026-11-18): https://developers.openai.com/api/docs/quickstart, https://developers.openai.com/api/docs/models, https://developers.openai.com/api/docs/guides/text, https://platform.claude.com/docs/en/get-started, https://platform.claude.com/docs/en/models/overview

**OpenAI IDs the docs currently use.**
- Quickstart, function-calling, structured-outputs, token-counting and text guides: `gpt-6.2-astra` (in nearly every example). The structured-outputs guide says "For new projects, start with `gpt-6.2-astra`".
- Models page, "Flagship models": `gpt-6.2-astra` (default recommendation, complex reasoning and coding), `gpt-6.2-sol` (balance of intelligence and cost), `gpt-6.1-terra` (fast, efficient), `gpt-6-luna` (most efficient, high volume). No model is labelled "mini" or "nano" on that page.
- The text guide cites `gpt-5.5-2026-04-23` only as an example of a pinned snapshot id. The openai-node README examples still use `gpt-5.5` and `gpt-4o` (README, not the docs site).
- Embedding ids: `text-embedding-3-small`, `text-embedding-3-large` (section 3).

**Anthropic IDs.** Quickstart and SDK pages use `claude-opus-5-5` in every sample. The models overview "Latest models" table lists (Claude API ID = alias): `claude-fable-5-2`, `claude-opus-5-5`, `claude-sonnet-5-5`, `claude-haiku-5-5`. CONFIRMED: the four IDs the project's skill listed (claude-opus-5-5, claude-sonnet-5-5, claude-haiku-5-5, claude-fable-5-2) all appear on the models overview page. The page says: start with Claude Opus 5.5 for most workloads; Fable 5.2 for demanding reasoning and long-horizon agentic work; Sonnet 5.5 "best combination of speed and intelligence"; Haiku 5.5 for high-volume, latency-sensitive tasks (classification, extraction, routing). "Every Claude model ID is a pinned snapshot, including the dateless IDs used from the 4.6 generation on." All current models support text and image input, text output, vision and tool use. Older ids still listed: `claude-opus-5`, `claude-sonnet-5`, `claude-opus-4-8` ... `claude-haiku-4-5-20251001`; Claude Mythos models are "limited availability". Retirement dates for the four current models are listed on the page ("Not sooner than ..."); see https://platform.claude.com/docs/en/about-claude/model-deprecations (not read).

**Policy for course code.** Model names change often (these pages already list several generations). Every sample should read the model id from ONE constant or environment variable, e.g. `MODEL = os.environ.get("OPENAI_MODEL", "gpt-6.2-astra")` and `os.environ.get("ANTHROPIC_MODEL", "claude-opus-5-5")`, never repeat the literal in many places, and lessons should say "use the current id from the docs". Do not hard-code snapshots in prose without the checked date.

---

## 6. pgvector

URLs read (2026-11-18): https://github.com/pgvector/pgvector (README), https://github.com/pgvector/pgvector-python, https://github.com/pgvector/pgvector-node

README text (via fetch summary; quotes are the summary's reproduction of README lines):
```sql
CREATE EXTENSION vector;
CREATE TABLE items (id bigserial PRIMARY KEY, embedding vector(3));
INSERT INTO items (embedding) VALUES ('[1,2,3]'), ('[4,5,6]');
SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 5;
```
Enable once per database. `vector(n)` is the column type (n = number of dimensions).
**Operators:** `<->` L2 (Euclidean) distance; `<#>` negative inner product (README note: Postgres only supports ascending index scans on operators, so the inner product is negated); `<=>` cosine distance; `<+>` L1 distance; `<~>` Hamming distance (binary vectors); `<%>` Jaccard distance (binary vectors).
**Cosine distance vs similarity (README):** "For cosine similarity, use 1 - cosine distance":
```sql
SELECT 1 - (embedding <=> '[3,1,2]') AS cosine_similarity FROM items;
```
So `<=>` returns DISTANCE (smaller is closer); similarity is `1 - distance`. `<#>` returns the NEGATIVE inner product (multiply by -1 to read it as a dot product).
**Index examples (README):**
```sql
CREATE INDEX ON items USING hnsw (embedding vector_l2_ops);     -- L2
CREATE INDEX ON items USING hnsw (embedding vector_ip_ops);     -- inner product
CREATE INDEX ON items USING hnsw (embedding vector_cosine_ops); -- cosine
CREATE INDEX ON items USING hnsw (embedding vector_l2_ops) WITH (m = 16, ef_construction = 64);
SET hnsw.ef_search = 100;
CREATE INDEX ON items USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);
SET ivfflat.probes = 10;
```
HNSW options and defaults: `m` 16, `ef_construction` 64, query-time `hnsw.ef_search` 40. IVFFlat: create the index after the table has some data; `lists`: start with rows / 1000 for up to 1M rows and sqrt(rows) above that; `ivfflat.probes` default 1, start with sqrt(lists), higher improves recall and slows queries. Operator class must match the operator you query with (`vector_cosine_ops` for `<=>`). Limits: `vector` type up to 16,000 dimensions; indexing `vector` up to 2,000 dimensions (HNSW and IVFFlat); `halfvec` indexing up to 4,000; `bit` 64,000.
**Install notes:** Docker image `pgvector/pgvector:pg18-trixie` (replace 18 with your Postgres major version); packages e.g. APT `postgresql-18-pgvector`, Homebrew `pgvector`; build from source tag v0.8.7 at the check date.
**Python client (README links `pgvector-python`):** `pip install pgvector`. psycopg 3:
```python
from pgvector.psycopg import register_vector
from pgvector import Vector
conn.execute('CREATE EXTENSION IF NOT EXISTS vector')
register_vector(conn)
embedding = Vector([1, 2, 3])
conn.execute('INSERT INTO items (embedding) VALUES (%s)', (embedding,))
conn.execute('SELECT * FROM items ORDER BY embedding <-> %s LIMIT 5', (embedding,)).fetchall()
```
(psycopg2: `from pgvector.psycopg2 import register_vector`; asyncpg: `from pgvector.asyncpg import register_vector` with `await register_vector(conn)`; pools register in `configure=` / `init=`.) Fetch summaries of these README sections, so run them once before using in a lesson.
**Node client (README links `pgvector-node`):** `npm install pgvector`. node-postgres:
```js
import pgvector from 'pgvector/pg';
await client.query('CREATE EXTENSION IF NOT EXISTS vector');
await pgvector.registerTypes(client);
await client.query('INSERT INTO items (embedding) VALUES ($1)', [pgvector.toSql([1, 2, 3])]);
const result = await client.query('SELECT * FROM items ORDER BY embedding <-> $1 LIMIT 5', [pgvector.toSql([1, 2, 3])]);
```
Deprecated vs current (pgvector-node Upgrading note): "`registerType` is deprecated for node-postgres. Use `registerTypes` instead." Pool form: `new pg.Pool({onConnect: async (client) => await pgvector.registerTypes(client)})`.

---

## 7. Supabase vectors

URLs read (2026-11-18): https://supabase.com/docs/guides/ai/semantic-search, https://supabase.com/docs/guides/ai/vector-columns (SQL below copied from the official docs source on GitHub: `supabase/supabase`, `apps/docs/content/guides/ai/semantic-search.mdx` and `vector-columns.mdx`), https://supabase.com/docs/reference/javascript/{installing,initializing,rpc}, https://supabase.com/docs/reference/python/{installing,initializing,rpc}, https://supabase.com/docs/guides/database/postgres/row-level-security

**Packages.** supabase-js: `npm install @supabase/supabase-js` (package `@supabase/supabase-js`). supabase-py: `pip install supabase` (package `supabase`; also `conda install -c conda-forge supabase`; page says it needs Data API access granted on your tables and functions).

**Enable extension (VERBATIM).** Dashboard: Database > Extensions > search "vector" > enable. SQL:
```sql
create extension vector
with
  schema extensions;
```
("Even though the SQL code is `create extension`, this is the equivalent of 'enabling the extension'." Disable with `drop extension if exists vector;`.)

**documents table (VERBATIM, semantic-search page).**
```sql
create table documents (
  id bigint primary key generated always as identity,
  content text,
  embedding extensions.vector(512)
);
```
"Adjust this to match the number of dimensions produced by your embedding model." (The vector-columns page uses `embedding extensions.vector(384)` with `title`/`body` columns. For OpenAI `text-embedding-3-small` the default would be 1536, or the `dimensions` you request.) The page also says to use the same embedding model for all comparisons.

**match_documents (VERBATIM, cosine distance).**
```sql
-- Match documents using cosine distance (<=>)
create or replace function match_documents (
  query_embedding extensions.vector(512),
  match_threshold float,
  match_count int
)
returns setof documents
language sql
as $$
  select *
  from documents
  where documents.embedding <=> query_embedding < 1 - match_threshold
  order by documents.embedding <=> query_embedding asc
  limit least(match_count, 200);
$$;
```
Parameter notes (page): `match_threshold` is "the minimum similarity between embeddings. This is a value between 1 and -1"; `match_count` limited to 200 records. Cosine distance is "a safe default when you don't know whether or not your embeddings are normalized"; for normalized embeddings (the page names OpenAI) the negative inner product `<#>` is faster, with the threshold negated (`< -match_threshold`). The vector-columns page's older variant returns `id, title, body, similarity` using `1 - (documents.embedding <=> query_embedding) as similarity`, ordered by `(documents.embedding <=> query_embedding) asc`. Indexes: "ensure that the `order by` sorts by the distance function directly" so the index is used; IVFFlat (`using ivfflat (embedding vector_cosine_ops)`, `with (lists = 100)`) and HNSW (`using hnsw (embedding vector_cosine_ops)`) are both offered on the page. Page says PostgREST does not support pgvector operators directly, hence the SQL function.
Metadata filter gotcha (page): put filters INSIDE the SQL function (e.g. a `filter_category text` parameter). Chaining `.eq()` after `rpc()` "is applied by PostgREST as an outer filter on the function's result, after the function has already executed its similarity ranking and `limit`", so selective filters can return fewer than `match_count` rows. pgvector 0.8.0+ supports iterative index scans for filtered HNSW queries.

**Calling from supabase-js (VERBATIM).**
```tsx
const { data: documents } = await supabase.rpc('match_documents', {
  query_embedding: embedding, // pass the query embedding
  match_threshold: 0.78, // choose an appropriate threshold for your data
  match_count: 10, // choose the number of matches
})
```
Client creation (VERBATIM, JS reference): `import { createClient } from '@supabase/supabase-js'` then `const supabase = createClient('https://xyzcompany.supabase.co', 'your-publishable-key')`. `rpc` returns `{ data, error }` (JS reference examples: `const { data, error } = await supabase.rpc('echo', { say: '👋' })`).

**Calling from supabase-py.** The semantic-search page shows no Python call. From the Python reference (VERBATIM): `response = (supabase.rpc("echo", { "say": "👋" }).execute())`. Client creation (VERBATIM, Python initializing reference):
```python
import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)
```
ADAPTED vector search call (combining the two verbatim pieces; read `response.data`, which the Python rpc page does not spell out, so check it once):
```python
response = supabase.rpc("match_documents", {
    "query_embedding": embedding,   # list[float] from your embedding model
    "match_threshold": 0.78,
    "match_count": 10,
}).execute()
rows = response.data
```
**Row level security (RLS) notes (RLS guide).** "Enable RLS on every table in an exposed schema." "A table in an exposed schema without RLS is readable and writable by any role with a grant on it." "Once RLS is enabled, no data is accessible through the API when using a publishable key, until you create policies." Policies run on every access like an added filter. `anon` = unauthenticated request, `authenticated` = signed in. "Use a secret key for administrative tasks that need to bypass RLS." "Never use a secret key in the browser or expose it to customers." (`service_role`: "Full access. It bypasses RLS, so keep it server-side".) A `security definer` function in an exposed schema "is callable over the Data API with the creator's privileges". The semantic-search and vector-columns pages themselves contain no RLS section; `match_documents` as written is `language sql` (security invoker by default in Postgres; the RLS page does not discuss invoker functions, so state only that the function reads `documents` under the caller's role: UNVERIFIED on the Supabase pages). Course takeaway grounded in the pages: enable RLS on `documents`, add policies, and keep the secret key out of client code.

---

## 8. Environment variables and secrets

URLs read (2026-11-18): https://developers.openai.com/api/docs/api-reference/authentication, https://github.com/openai/openai-python, https://platform.claude.com/docs/en/manage-claude/authentication, https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python, https://pypi.org/project/python-dotenv/, https://nodejs.org/api/cli.html

**OpenAI (API reference, Authentication).** "Remember that your API key is a secret." "Don't share it with others or expose it in any client-side code such as browsers or apps." "Load API keys from an environment variable or key management service on the server." Auth is "HTTP Bearer authentication": `Authorization: Bearer OPENAI_API_KEY_OR_ACCESS_TOKEN`. openai-python README: "we recommend using python-dotenv to add OPENAI_API_KEY="My API Key" to your .env file" so the key is not in source control. The OpenAI Help Center article on key safety returned HTTP 403 (not read): UNVERIFIED beyond the two sources above.
**Anthropic (authentication page).** "Call the Claude API from your own back end, not from code that runs in your users' browsers. Anyone who uses a webpage can read an API key in that page's code." "Store API keys in a secrets manager, rotate them periodically, and disable or delete any key you suspect has leaked." SDKs read `ANTHROPIC_API_KEY` automatically. Python SDK page tip: "Consider using python-dotenv to add `ANTHROPIC_API_KEY="my-anthropic-api-key"` to your `.env` file so that your API key isn't stored in source control." Direct browser calls need the `anthropic-dangerous-direct-browser-access: true` header (TypeScript SDK option `dangerouslyAllowBrowser`); organizations with ZDR or the Compliance API enabled cannot call from a browser at all (401 `CORS requests are not allowed for this Organization`). Key sent as `Authorization: Bearer <key>` or legacy `x-api-key`. Other auth methods named: Workload Identity Federation, App Attest (iOS/macOS).
**python-dotenv (PyPI page).**
```
pip install python-dotenv
```
```python
from dotenv import load_dotenv

load_dotenv()  # reads variables from a .env file and sets them in os.environ
```
`dotenv_values(".env")` returns a dict without touching `os.environ`. `.env` example: `DOMAIN=example.org`, `ADMIN_EMAIL=admin@${DOMAIN}` (must be written `${DOMAIN}`; bare `$DOMAIN` is not expanded). Default is `override=False` (does not replace existing environment variables; pass `override=True` to override). The page recommends adding `.env` to `.gitignore`, "especially if it contains secrets like a password."
**Node (`nodejs.org/api/cli.html`).** `--env-file=file`: added v20.6.0; experimental label removed in v24.10.0 and v22.21.0; multi-line values supported since v21.7.0 and v20.12.0. "Loads environment variables from a file relative to the current directory, making them available to applications on `process.env`... If the same variable is defined in the environment and in the file, the value from the environment takes precedence." Multiple files allowed: `node --env-file=.env --env-file=.development.env index.js` (later files override earlier ones; an error is thrown if the file does not exist). `--env-file-if-exists=file` (added v22.9.0) behaves the same without the error. `.env` format: `PORT=3000`; `#` comments; values may be wrapped in backticks, `"` or `'`; multi-line values; leading `export` ignored. `process.loadEnvFile` is not mentioned in the part of the page that was read (the page is 185k characters and only the first 100k were read): UNVERIFIED. The Node page was not checked for an official `dotenv` npm statement; the `dotenv` npm package page was not read: UNVERIFIED.

---

## 9. Rate limits and retries

URLs read (2026-11-18): https://developers.openai.com/api/docs/guides/rate-limits, https://developers.openai.com/api/docs/guides/error-codes, openai-python and openai-node READMEs, https://platform.claude.com/docs/en/api/rate-limits, https://platform.claude.com/docs/en/api/errors, https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python

**OpenAI.** 429 means a temporary rate limit was exceeded; there is also a 429 `slow_down` (code `slow_down`, type `rate_limit_error`, request rate rose too quickly even if RPM/TPM were not exhausted). Guidance: follow `Retry-After` when present ("the minimum seconds to wait"; add a small random delay); if missing, use exponential backoff with jitter and cap both attempts and total retry time; "unsuccessful requests contribute to your per-minute limit, so continuously resending a request won't work"; do not retry quota/billing errors that need user action; 500 and 503 (`server_is_overloaded`) are retried after a brief wait. Header names (documented): `Retry-After`, `x-ratelimit-limit-requests`, `x-ratelimit-limit-tokens`, `x-ratelimit-remaining-requests`, `x-ratelimit-remaining-tokens`, `x-ratelimit-reset-requests`, `x-ratelimit-reset-tokens`, plus project-scoped `x-ratelimit-limit-project-tokens`, `x-ratelimit-remaining-project-tokens`, `x-ratelimit-reset-project-tokens`. The page says official SDKs retry eligible 429 and 503 automatically but "`Retry-After` handling varies by SDK version", and "If you manage retries yourself, disable SDK retries to avoid nested retry loops". Batch API for non-urgent work is mentioned. Its code samples (tenacity `wait_random_exponential`, `backoff.expo`, a manual wrapper) catch `RateLimitError` with SDK retries disabled; the page notes OpenAI makes no guarantee about tenacity.
SDK parameter (READMEs): Python `OpenAI(max_retries=0)` (default 2) or per call `client.with_options(max_retries=5).responses.create(...)` (README example uses `chat.completions.create`); `max_retries` must be a non-negative integer, `0` disables retries. TypeScript `new OpenAI({ maxRetries: 0 })` or per request `{ maxRetries: 5 }` as the second argument. Retried: connection errors, 408, 409, 429, >=500, only when the body can be resent. Timeout default 10 minutes (`timeout=20.0` in Python, `timeout: 20 * 1000` ms in TS); a timed-out request is retried twice by default.
ADAPTED manual backoff (aligned with the page's advice; test before use):
```python
import random, time, openai
def with_backoff(fn, tries=5, base=1.0, cap=30.0):
    for n in range(tries):
        try:
            return fn()
        except openai.RateLimitError as e:
            if n == tries - 1: raise
            ra = e.response.headers.get("retry-after")
            delay = float(ra) if ra else min(cap, base * 2 ** n)
            time.sleep(delay + random.random())
```
(`client = OpenAI(max_retries=0)` when you do this.)

**Anthropic.** Errors page: "The official SDK automatically retries transient failures (such as connection errors, rate limits, and 5xx server errors) with exponential backoff, twice by default, honoring the `retry-after` header when present. The SDK client accepts `max_retries` (typescript, php: `maxRetries`; java: `.maxRetries()`; csharp: `MaxRetries`; go: `option.WithMaxRetries()`) to configure or disable this behavior." Python SDK page VERBATIM:
```python
client = Anthropic(
    max_retries=0,  # default is 2
)
client.with_options(max_retries=5).messages.create(
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}],
    model="claude-opus-5-5",
)
```
Retried statuses: connection errors, 408, 409, 429, >=500. Timeout default 10 minutes (`timeout=` float or `httpx2.Timeout`); `APITimeoutError` on timeout (retried twice by default); the SDK raises `ValueError` for a non-streaming request expected to exceed about 10 minutes (use `stream=True`). Rate-limits page: on a 429, "When the response has a `retry-after` header, wait that many seconds before retrying." Headers: `retry-after`, `anthropic-ratelimit-requests-limit|remaining|reset`, `anthropic-ratelimit-tokens-limit|remaining|reset`, `anthropic-ratelimit-input-tokens-limit|remaining|reset`, `anthropic-ratelimit-output-tokens-limit|remaining|reset` (reset values are RFC 3339 timestamps), plus Priority Tier `anthropic-priority-*` headers. Gotchas stated: not every 429 carries `retry-after`; a spend-cap 429 (`error.details.error_code` = `enforced_spend_limit_reached`) has no `retry-after` and keeps failing, SDK retries included, until access resumes; a ramp limit 429 (`error.details.error_code` = `ramp_limit_exceeded`) can occur under your limits after a sharp usage jump (ramp traffic up gradually); spend limit you set yourself returns HTTP 400 `invalid_request_error`, not 429; limits use a token bucket (capacity replenishes continuously); 529 `overloaded_error` can happen across all users; rate limits for token counting are separate from message creation. Read headers in Python with `client.messages.with_raw_response.create(...)` then `response.headers.get("request-id")` and `response.parse()`. No limit numbers recorded here.

---

## 10. Token counting and `usage`

URLs read (2026-11-18): https://developers.openai.com/api/docs/guides/token-counting, https://github.com/openai/openai-python/blob/main/src/openai/types/responses/response_usage.py (raw file), https://developers.openai.com/api/docs/guides/embeddings, https://platform.claude.com/docs/en/build-with-claude/token-counting, https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python, https://platform.claude.com/docs/en/api/rate-limits

**OpenAI.**
- Counting before a request: `POST /v1/responses/input_tokens` takes the same input as the Responses API (text, messages, images, files, tools, conversations) and "returns the exact count the model will receive"; response fields `input_tokens` (integer) and `object: "response.input_tokens"`. The count includes tokens for message roles and boundaries. Python (VERBATIM):
```python
from openai import OpenAI

client = OpenAI()

response = client.responses.input_tokens.count(
    model="gpt-6.2-astra", input="Tell me a joke."
)
print(response.input_tokens)
```
- `tiktoken` is mentioned as a local tokenizer for plain text only (no images or files, struggles with tools and schemas; model-specific behavior can change tokenization). For embeddings the guide says use `tiktoken` with encoding `cl100k_base` for `text-embedding-3-*` (embeddings guide, with a `num_tokens_from_string` helper).
- `usage` on a Responses result (from the SDK type file `response_usage.py`, current main branch; the docs token-counting page does NOT document `total_tokens` or the details objects): `usage.input_tokens`, `usage.input_tokens_details.cached_tokens`, `usage.input_tokens_details.cache_write_tokens`, `usage.output_tokens`, `usage.output_tokens_details.reasoning_tokens`, `usage.total_tokens`. Also present in the type file: `input_tokens_details.cache_write_tokens_details` (optional) with `ttl_12h_tokens` and `ttl_30m_tokens`.
- Chat Completions names output tokens `completion_tokens`; Responses uses `output_tokens` (token-counting page). "Reported output token usage includes all tokens generated by the model, not only the text visible in a response" (hidden formatting tokens can make the count exceed the visible text, even with `reasoning_tokens` 0). `max_output_tokens` (Responses) / `max_completion_tokens` (Chat Completions) cap all generated tokens, including hidden ones, so leave headroom.
- Embeddings response `usage` has `prompt_tokens` and `total_tokens` (section 3).
- The Responses API reference page was too large for the fetch tool to read the `usage` section: the SDK type file above is the source, not the reference page.

**Anthropic.**
- Counting before a request: `client.messages.count_tokens(...)` (endpoint `POST /v1/messages/count_tokens`), same inputs as creating a message (system, tools, images, PDFs); returns `input_tokens`. VERBATIM from the SDK page:
```python
count = client.messages.count_tokens(
    model="claude-opus-5-5",
    messages=[{"role": "user", "content": "Hello, world"}],
)
print(count.input_tokens)  # 10
```
The token-counting page's own example prints `response.json()` and shows output `{ "input_tokens": 14 }`; TypeScript is `client.messages.countTokens({...})`.
- Page statements: the count is an estimate that can differ slightly from actual input tokens, "You are not billed for system-added tokens"; counting is free but has its own requests-per-minute limit, separate from message creation; no caching logic is used. It returns `invalid_request_error` for server tools (web search, web fetch, code execution, tool search; the advisor tool is the exception), the MCP connector, and `image`/`document` blocks with a `url` or `file` source (send base64 instead). Client tools ARE supported. Claude 4.7 and later models (and the Fable/Mythos line) use a newer tokenizer that produces about 30 percent more tokens for the same text: count with the model you will actually use.
- `usage` on a message: `message.usage` (SDK page shows `Usage(input_tokens=25, output_tokens=13)`); quickstart response shows `"usage": {"input_tokens": 21, "output_tokens": 305}`. The rate-limits page also names `cache_creation_input_tokens` and `cache_read_input_tokens`, and notes `input_tokens` counts only tokens after the last cache breakpoint: total input = `cache_read_input_tokens + cache_creation_input_tokens + input_tokens`. Whether other `usage` fields (for example `server_tool_use`, `service_tier`) exist in the current response schema was NOT confirmed on a page (the Messages create reference did not reach its response section): UNVERIFIED.

---

## READ

OpenAI:
- https://developers.openai.com/api/docs/quickstart (via 301 from platform.openai.com/docs/quickstart)
- https://developers.openai.com/api/docs/guides/function-calling (+ .md)
- https://developers.openai.com/api/docs/guides/structured-outputs (+ .md; first 100k chars via fetch, key sections via .md)
- https://developers.openai.com/api/docs/guides/embeddings (+ .md)
- https://developers.openai.com/api/docs/api-reference/embeddings/create
- https://developers.openai.com/api/docs/guides/migrate-to-responses
- https://developers.openai.com/api/docs/guides/text
- https://developers.openai.com/api/docs/guides/token-counting
- https://developers.openai.com/api/docs/guides/rate-limits
- https://developers.openai.com/api/docs/guides/error-codes
- https://developers.openai.com/api/docs/api-reference/authentication
- https://developers.openai.com/api/docs/models and https://developers.openai.com/api/docs/models/text-embedding-3-small
- https://github.com/openai/openai-python (README) and https://raw.githubusercontent.com/openai/openai-python/main/src/openai/types/responses/response_usage.py
- https://github.com/openai/openai-node (README)

Anthropic:
- https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools
- https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls
- https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use
- https://platform.claude.com/docs/en/build-with-claude/structured-outputs (all but a middle chunk of schema-limit detail)
- https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python and /cli-sdks-libraries/overview
- https://platform.claude.com/docs/en/api/errors and /api/rate-limits
- https://platform.claude.com/docs/en/build-with-claude/token-counting, /embeddings, /handling-stop-reasons
- https://platform.claude.com/docs/en/get-started and /models/overview
- https://platform.claude.com/docs/en/manage-claude/authentication

Vector / env:
- https://github.com/pgvector/pgvector, https://github.com/pgvector/pgvector-python, https://github.com/pgvector/pgvector-node
- https://supabase.com/docs/guides/ai/semantic-search and /vector-columns (SQL from the official docs source in github.com/supabase/supabase), https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/reference/javascript/{installing,initializing,rpc}, https://supabase.com/docs/reference/python/{installing,initializing,rpc}
- https://pypi.org/project/python-dotenv/
- https://nodejs.org/api/cli.html (first 100k of 185k characters)

## NOT READ / UNVERIFIED

- OpenAI Help Center "best practices for API key safety" (HTTP 403). OpenAI Responses API reference `usage` section (page too large; `usage` fields taken from the SDK type file instead). The "supported schemas" limitations section of OpenAI structured outputs (not read; only the strict-mode requirements stated on the function-calling page are recorded).
- Raw-JSON-schema Python call for OpenAI is ADAPTED from a curl sample, not a page snippet. The multi-turn OpenAI and Anthropic agent loops and the backoff helper are ADAPTED (assembled here from documented single rounds); run them before publishing.
- Anthropic: the Tool Runner page, the strict-tool-use page, the Messages create response schema (so the full list of `usage` fields and any `output_config` details beyond `format` are unconfirmed), the model-deprecations page, the TypeScript SDK page (exception class names for TS not read), and Voyage AI's own docs.
- Node: `process.loadEnvFile` and the `dotenv` npm package (not read). supabase-py: no vector example on any Supabase page (the call above is assembled from two verbatim pieces; the shape of `response.data` is not spelled out on the Python rpc page). Supabase RLS behavior of `match_documents` as an invoker function (not stated on the pages read).
- pgvector README and the pgvector-python / pgvector-node READMEs came through the fetch tool's summary rather than raw text; operators, index syntax and defaults are as summarized, so re-run once before putting them in a lesson.
- The OpenAI SDK READMEs (and the Anthropic Python SDK page) now state the Python HTTP backend is `httpx2` (README wording as fetched); not independently checked.
