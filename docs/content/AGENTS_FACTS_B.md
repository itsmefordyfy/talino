# AGENTS_FACTS_B: verified fact sheet (frameworks, vendor SDKs, MCP, security, evaluation)

Checked date for every item below: **2026-11-18**.

How to read this file:
- "Page says" = read on the official page on 2026-11-18 (the fetch tool summarises pages; where it refused to reproduce long code verbatim, the sample is marked **ADAPTED**).
- **RUN-VERIFIED** = I ran the code on 2026-11-18 in a scratch venv against the installed packages (langgraph 1.2.22, langchain 1.5.0). That proves the code works; it is not a docs quote.
- **UNVERIFIED** = not read on an official page. Do not publish as fact.
- Model name strings below are copied exactly as the pages show them. Pages say model IDs change often; course code should use a constant (the docs themselves warn: "Model IDs change often. Verify them in the provider's model catalog before deploying." CrewAI LLM page).
- No prices, scores, star counts or rankings are recorded.

---

## 1. LangChain

**URLs read:** https://docs.langchain.com/oss/python/langchain/overview ; /quickstart ; /tools ; /models ; /guardrails ; /human-in-the-loop ; https://docs.langchain.com/oss/python/migrate/langchain-v1 ; https://docs.langchain.com/oss/javascript/langchain/quickstart

**Current entry point:** `create_agent`, imported `from langchain.agents import create_agent`. Overview page calls it "a minimal, highly configurable harness" combining model, tools, prompt and middleware.

**Older API:** Migration page (v1): "Prior to v1.0, we recommended using" `langgraph.prebuilt.create_react_agent`; "Now, we recommend you use" `langchain.agents.create_agent`. "Existing functionality outside the focus of standard interfaces and agents has been moved to the" `langchain-classic` package. The migration page and the quickstart do **not** mention `AgentExecutor` or `initialize_agent` (so no docs statement about them; do not claim "deprecated" for those two from these pages; say only that the recommended path is `create_agent` and older chains live in `langchain-classic`). The installed `langgraph.prebuilt.create_react_agent` docstring (package, not docs page) says: "This function is deprecated in favor of create_agent from the langchain package" (still importable, RUN-VERIFIED).

**Packages / install (page says):**
```bash
pip install -U langchain
# uv: uv add langchain
# provider extras (models page):
pip install -U "langchain[openai]"        # also used for Azure
pip install -U "langchain[anthropic]"
pip install -U "langchain[google-genai]"
pip install -U "langchain[aws]"
```
Provider classes live in packages like `langchain_openai.ChatOpenAI`, `langchain_anthropic.ChatAnthropic`, `langchain_google_genai.ChatGoogleGenerativeAI` (models page).
Python: quickstart says "Install Python 3.11+ separately if needed." (Installed package metadata: langchain requires `>=3.11.0`.)

**Minimal agent (quickstart, copied):**
```python
from langchain.agents import create_agent

def get_weather(city: str) -> str:
    """Get weather for a given city."""
    return f"It's always sunny in {city}!"

agent = create_agent(
    model="openai:gpt-6.1-sol",
    tools=[get_weather],
    system_prompt="You are a helpful assistant",
)

result = agent.invoke(
    {"messages": [{"role": "user", "content": "What's the weather in San Francisco?"}]}
)
print(result["messages"][-1].content_blocks)
```
Other `model=` strings shown on the quickstart: `"google_genai:gemini-2.5-flash-lite"`, `"claude-sonnet-4-6"`. The quickstart's own wording: "Print the final message content (Python: `.content_blocks`)". Note the plain function (no decorator) works as a tool in this sample.

**Choosing a model:** model string `"{model_provider}:{model}"` passed to `create_agent(model=...)`, or `init_chat_model` (recommended for standalone models):
```python
from langchain.chat_models import init_chat_model
model = init_chat_model("claude-sonnet-4-6")      # provider inferred
model = init_chat_model("google_genai:gemini-4-hydrogen")  # provider:model
response = model.invoke("Why do parrots talk?")
```
Parameters pass as kwargs: `temperature`, `timeout`, `max_tokens`, `max_retries` (default 6).

**`@tool` decorator (tools page; the import line and rules are from the page, the code is ADAPTED):**
- Import: `from langchain.tools import tool`
- Docstring becomes the tool description (should be "informative and concise"); "Type hints are **required** as they define the tool's input schema."
- Override name `@tool("name")` (prefer snake_case); override description `description=`; schema via `args_schema=` (Pydantic model or JSON schema).
```python
from langchain.tools import tool

@tool
def lookup_invoice(invoice_id: str, include_items: bool = False) -> str:
    """Look up an invoice by its ID.

    Args:
        invoice_id: The invoice identifier to fetch
        include_items: Whether to list line items
    """
    return f"Invoice {invoice_id} (items shown: {include_items})"
```
The quickstart's second example also uses `@tool` on `fetch_text_from_url(url: str) -> str`.

**Key concepts as named:** agent (`create_agent`), tools, model, `system_prompt`, middleware, `HumanInTheLoopMiddleware`, `PIIMiddleware`, `checkpointer`.

**Relation / when to use (overview page):** LangChain agents are built on LangGraph (durable execution, human-in-the-loop, persistence). "Deep Agents" is a prebuilt harness on top (context compression, virtual filesystem, subagents). LangSmith handles tracing, debugging, evaluation. Page guidance: use `create_agent` "for a highly customizable harness tailored to your use case and data"; use LangGraph "for advanced applications that mix deterministic and agentic workflows".

**Human approval (human-in-the-loop page, sample copied from page):**
```python
from langchain.agents import create_agent
from langchain.agents.middleware import HumanInTheLoopMiddleware
from langgraph.checkpoint.memory import InMemorySaver

agent = create_agent(
    model="gpt-6.1-sol",
    tools=[write_file, execute_sql, read_data],
    middleware=[
        HumanInTheLoopMiddleware(
            interrupt_on={
                "write_file": True,  # approve, edit, and reject allowed
                "execute_sql": {"allowed_decisions": ["approve", "reject"]},
                "read_data": False,  # no review needed
            },
        ),
    ],
    checkpointer=InMemorySaver(),  # required for interrupts
)
```
Decisions: approve, edit, reject. Page: "You must configure a checkpointer to persist the graph state across interrupts." Middleware "lets you add human oversight to agent tool calls."

**TypeScript:** package `langchain` plus `@langchain/core` (`npm install langchain @langchain/core`; pnpm/yarn/bun equivalents). Page says Node.js 22+ (Bun v1.0.0+). Entry point `createAgent` from `"langchain"`, `tool` from `"langchain"`, schemas with `zod`. Sample below is **ADAPTED** (the fetch tool would not reproduce the page's sample verbatim; structure matches the page's APIs):
```ts
import { createAgent, tool } from "langchain";
import { z } from "zod";

const addNumbers = tool(({ a, b }) => String(a + b), {
  name: "add_numbers",
  description: "Add two numbers together",
  schema: z.object({ a: z.number(), b: z.number() }),
});

const agent = createAgent({ model: "claude-sonnet-4-6", tools: [addNumbers] });
const result = await agent.invoke({
  messages: [{ role: "user", content: "What is 19 plus 23?" }],
});
console.log(result.messages.at(-1)?.contentBlocks);
```
Mark TS sample as untested (not run).

---

## 2. LangGraph

**URLs read:** https://docs.langchain.com/oss/python/langgraph/overview ; /graph-api ; /quickstart ; /persistence ; /interrupts

**What it is (overview):** "a low-level orchestration framework and runtime for long-running, stateful agents." Workflows are graphs of shared state, nodes and edges, mixing deterministic and LLM-driven steps. It "does not prescribe prompts or agent architecture" and "does not require LangChain". Listed capabilities: deterministic and agentic steps, persistence (checkpointing), human-in-the-loop, memory, streaming.
**When to use:** page suggests starting with Deep Agents or LangChain agents for a higher-level loop; use LangGraph when you need "explicit control over state and control flow."

**Install:** `pip install -U langgraph` (or `uv add langgraph`). The graph quickstart installs `pip install -U langgraph langchain langchain-anthropic`. Python: installed package metadata says `>=3.10` (not read on a docs page: UNVERIFIED as docs wording).

**Concepts as named (graph-api page):**
- `StateGraph`: main graph builder; takes the state schema; chain `add_node` / `add_edge`.
- State schema: shared data nodes read and update; each key is a channel, optionally with a reducer. Page: "Prefer `TypedDict` or `dataclass` for performance"; Pydantic `BaseModel` also supported.
- Nodes: "Nodes are sync or async functions that implement a step of the graph." Return a partial state update.
- Edges: normal edges, conditional edges, entry point. Warning: use static edges or dynamic routing per node, not both.
- `START` is "the virtual entry that delivers user input into the graph"; `END` marks a terminal edge.
- `add_conditional_edges(source, routing_fn, optional_mapping)`; routing function receives state and returns next node name (or list for fan-out, `END`, or `Send`). Page recommends `Command` to update state and route in one function.
- `compile()`: "You must compile the graph before you invoke or stream it." Checkpointers and breakpoints are attached at compile.
- `invoke`: pass a dict matching the state schema; to start a new turn on an existing thread pass a plain dict (not `Command(update=...)` alone).
- Checkpointers (persistence page): "Checkpointers persist a thread's graph state as checkpoints." Pass a `thread_id` in config. `InMemorySaver` (RAM, lost on restart; `from langgraph.checkpoint.memory import InMemorySaver`); production: `PostgresSaver` / `AsyncPostgresSaver` (`langgraph.checkpoint.postgres`); `SqliteSaver` "Local file-based storage for development".
- Human-in-the-loop (interrupts page): `interrupt()` "pauses graph execution and returns a value to the caller"; `Command(resume=...)` value "becomes the return value of the interrupt call"; resume with the same thread id; interrupts need a checkpointer; on resume the node restarts from its beginning, so code before `interrupt()` re-runs.

**Complete minimal graph with one conditional edge: RUN-VERIFIED** (the page's code is longer; this is a minimal sample written for the course, output `{'score': 2, 'label': 'done'}`, langgraph 1.2.22, Python 3.13):
```python
from typing_extensions import TypedDict
from langgraph.graph import END, START, StateGraph

class State(TypedDict):
    score: int
    label: str

def bump(state: State):
    return {"score": state["score"] + 1}

def route(state: State) -> str:
    return "high" if state["score"] >= 2 else "retry"

def high(state: State):
    return {"label": "done"}

builder = StateGraph(State)
builder.add_node("bump", bump)
builder.add_node("high", high)
builder.add_edge(START, "bump")
builder.add_conditional_edges("bump", route, {"high": "high", "retry": "bump"})
builder.add_edge("high", END)

graph = builder.compile()
print(graph.invoke({"score": 0, "label": ""}))
```

**Interrupt + resume with checkpointer: RUN-VERIFIED** (course-written; printed an `Interrupt(value='Proceed? (yes/no)', ...)` list under `result["__interrupt__"]`, then `yes`):
```python
from typing import TypedDict
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.types import Command, interrupt

class State(TypedDict):
    answer: str

def ask_human(state: State):
    reply = interrupt("Proceed? (yes/no)")
    return {"answer": reply}

builder = StateGraph(State)
builder.add_node("ask_human", ask_human)
builder.add_edge(START, "ask_human")
builder.add_edge("ask_human", END)
graph = builder.compile(checkpointer=InMemorySaver())

config = {"configurable": {"thread_id": "demo-1"}}
result = graph.invoke({"answer": ""}, config)
print(result["__interrupt__"])
result = graph.invoke(Command(resume="yes"), config)
print(result["answer"])
```

**Prebuilt ReAct helper:** the graph quickstart builds the agent by hand (model node, tool node, conditional `should_continue`, loop) and does not mention a prebuilt helper. The current prebuilt-agent entry point is `langchain.agents.create_agent` (migration page). `langgraph.prebuilt.create_react_agent` still imports but its docstring marks it deprecated in favour of `create_agent` (RUN-VERIFIED import and docstring).

---

## 3. CrewAI

**URLs read:** https://docs.crewai.com/en/installation ; /quickstart ; /concepts/crews ; /concepts/agents ; /concepts/tasks ; /concepts/llms ; /concepts/flows

**Install (page says):** install `uv`, then `uv tool install crewai` (verify `uv tool list`; upgrade `uv tool install crewai --upgrade`). Python: "CrewAI requires `Python >=3.10 and <3.14`." Provider extras for library use: `uv add "crewai[openai]"`, `uv add "crewai[anthropic]"`, `uv add "crewai[google-genai]"`.

**Scaffolding:** `crewai create crew <your_project_name>`; the new project is **JSON-first** (agents in `agents/*.jsonc`, tasks and crew settings in `crew.jsonc`); "For the older Python/YAML layout, the page says to add `--classic`." Then `crewai install`, `crewai run`. The quickstart scaffolds a Flow instead: `crewai create flow latest-ai-flow`. Keys in `.env`; quickstart `.env` holds `SERPER_API_KEY` and the model provider's key. Note: the quickstart does not use `agents.yaml` / `@CrewBase`; do not teach those as the default scaffold without checking `--classic`.

**Key concepts as named:**
- Agent: "an autonomous unit" (perform tasks, decide from role and goal, use tools, collaborate, keep memory, delegate if permitted). Required `role`, `goal`, `backstory`; also `llm`, `tools`, `allow_delegation` (default False), `max_iter`, `max_rpm`, `max_execution_time`, `verbose`, `reasoning`, `knowledge_sources`. (`allow_code_execution` and `code_execution_mode` are marked deprecated.)
- Task: `description`, `expected_output`, `agent`, `tools`, `context` (earlier tasks feeding this one), `output_pydantic`, `human_input` (bool, default False: person reviews the agent's final answer), `guardrail` (callable returning `(bool, value)` or a string judged by the agent's LLM).
- Crew: core `agents`, `tasks`; optional `process`, `verbose`, `manager_llm`, `manager_agent`, `memory`, `planning`, `knowledge_sources`, `checkpoint`, etc.
- Process types: two documented: `sequential` (default) and `hierarchical` (manager agent delegates and validates; requires `manager_llm` or `manager_agent`). "The page doesn't describe any other process types."
- Kickoff: `kickoff()`, `kickoff_for_each()`, `akickoff()`, `akickoff_for_each()` (native async, recommended for high concurrency), `kickoff_async()`.
- Flow: "structured, event-driven workflows"; decorators `@start()`, `@listen()`, `@router()`; state in `self.state` (dict or Pydantic `BaseModel`, automatic `id`). Positioned as the layer that coordinates Crews and plain code.

**Minimal crew (crews page, copied):**
```python
from crewai import Agent, Crew, Task, Process

researcher = Agent(
    role="Researcher",
    goal="Find key facts on a topic",
    backstory="A careful researcher who cites sources",
)

research_task = Task(
    description="Research the topic: {topic}",
    expected_output="A short list of key facts",
    agent=researcher,
)

crew = Crew(
    agents=[researcher],
    tasks=[research_task],
    process=Process.sequential,
)

result = crew.kickoff(inputs={"topic": "AI agents"})
print(result)
```
Hierarchical: `process=Process.hierarchical` plus `manager_llm="openai/gpt-4o"` (the page's own example) or `manager_agent`.

**Minimal Flow (flows page, copied):**
```python
from typing import Literal
from crewai.flow.flow import Flow, listen, router, start

class GreetFlow(Flow):
    @start()
    def pick_name(self):
        self.state["name"] = "Grace"
        return self.state["name"]

    @router(pick_name)
    def choose_style(self) -> Literal["formal", "casual"]:
        return "formal" if len(self.state["name"]) > 3 else "casual"

    @listen("formal")
    def greet_formally(self):
        print(f"Good day, {self.state['name']}.")

    @listen("casual")
    def greet_casually(self):
        print(f"Hi {self.state['name']}!")

GreetFlow().kickoff()
```

**LLM configuration (llms page):** model string is `provider/model-id`, provider prefix mandatory (`openai/gpt-4` works, `gpt-4` is wrong). Set via env `MODEL=provider/model-id` in `.env`, or an `llm:` field on an agent, or in Python `from crewai import LLM; llm = LLM(model="provider/model-id")` and pass `llm=llm` to the `Agent`. Keys in env vars: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY` or `GOOGLE_API_KEY`; missing key raises `MissingAPIKeyError`. Anthropic example from page: `LLM(model="anthropic/claude-sonnet-4-6", max_tokens=4096, stop_sequences=["END"])` with the note `max_tokens` is "required for all Anthropic models". Gemini example from page: `LLM(model="gemini/gemini-3.6-flash", max_output_tokens=8192)`. Page note: "Never commit API keys to version control."

**For / limits (page wording):** Flows for orchestrating multi-step logic across Crews; an Agent used directly in a Flow is "a lightweight alternative to full Crews when you need simpler, focused task execution."

---

## 4. Microsoft Agent Framework

**URLs read:** https://learn.microsoft.com/en-us/agent-framework/overview/ ; /get-started/your-first-agent ; /get-started/add-tools ; /concepts/workflows/ ; /workflows/ ; /concepts/agents/safety ; /migration-guide/from-semantic-kernel/ ; /support/upgrade/python-2026-significant-changes (first 100k characters) ; https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/ . (github.com/microsoft/agent-framework and the AutoGen migration URL I tried returned 404 or too-large output; see NOT READ.)

**What it is (overview page):** "Build AI agents and multi-agent workflows in .NET, Python, and Go." Four primary areas: Agents, Harness Agent, Workflows, Integrations. Foundations: model clients, agent session, context providers, middleware, MCP clients.

**Relation to Semantic Kernel and AutoGen (overview page, exact):** "Semantic Kernel and AutoGen pioneered the concepts of AI agents and multi-agent orchestration. The Agent Framework is the direct successor, created by the same teams." and "In short, Agent Framework is the next generation of both Semantic Kernel and AutoGen." It "combines AutoGen's simple abstractions for single- and multi-agent patterns with Semantic Kernel's enterprise-grade features" and adds graph-based workflows. Dev blog: "Coming from AutoGen or Semantic Kernel? Now is the time to migrate to Microsoft Agent Framework." (I did not read any page stating a maintenance-mode status for SK or AutoGen: UNVERIFIED.)

**Release status:** Dev blog (dated April 3, 2026 per search result; the post itself I read without a date line): "Microsoft Agent Framework has reached version 1.0" for .NET and Python; "This is the production-ready release: stable APIs, and a commitment to long-term support." Stable features carry "full backward compatibility going forward"; preview features are "functional and available for early adoption" and "These APIs may evolve based on community feedback before reaching 'stable'." Go: overview page says "Agent Framework for Go is in public preview and requires Go 1.26 or later." Python upgrade page: latest release listed is python-1.26.0 (November 13, 2026); some meta-package members may still be alpha or beta (core, OpenAI, Foundry, AG-UI, Declarative, GitHub Copilot, Orchestrations listed as released in 1.23.0). Workflow API: Python's functional workflow API is described as "experimental" ("Python additionally provides an experimental functional workflow API").

**Packages:**
- Python: `pip install agent-framework` (meta-package; imports are `agent_framework`, `agent_framework.foundry`). Core is `agent-framework-core`; provider packages `agent-framework-openai`, `agent-framework-foundry` (replaced `agent-framework-azure-ai`), etc. First-agent tutorial uses `pip install agent-framework-foundry azure-identity`.
- .NET: `dotnet add package Microsoft.Agents.AI.Foundry --prerelease` (overview/tutorial); dev blog names `Microsoft.Agents.AI`. Namespace `Microsoft.Agents.AI`; agent type `AIAgent`.
- Go: `go get github.com/microsoft/agent-framework-go`.
- Python version: upgrade page says "Agent Framework packages no longer install on Python 3.10. Upgrade the interpreter to Python 3.11 or later" (python-1.25.0, Nov 6, 2026).
- Note: Python does not auto-load `.env`; call `load_dotenv()` ("Agent Framework does **not** automatically load `.env` files").

**Minimal Python agent with a tool (add-tools page, copied):**
```python
import asyncio

from agent_framework import Agent, tool
from agent_framework.foundry import FoundryChatClient
from azure.identity import AzureCliCredential

# This read-only sample tool can run without approval.
@tool(approval_mode="never_require")
def get_weather(location: str) -> str:
    """Get the weather for a given location."""
    return f"The weather in {location} is sunny."

async def main() -> None:
    agent = Agent(
        client=FoundryChatClient(
            project_endpoint="https://your-account.services.ai.azure.com/api/projects/your-project",
            model="gpt-6-luna",
            credential=AzureCliCredential(),
        ),
        instructions="Use the weather tool to answer questions.",
        tools=[get_weather],
    )
    print(await agent.run("What's the weather like in Seattle?"))

if __name__ == "__main__":
    asyncio.run(main())
```
Needs a Microsoft Foundry project and `az login`. SK migration page says a plain Python function (type hints + docstring) also works as `tools=get_weather`, and `@tool(name=..., description=...)` customises it; other chat clients (e.g. OpenAI) exist, so Foundry is not required in general.

**Workflow / orchestration concepts as named:** workflows "define explicit, inspectable execution paths for coordinating code, agents, state, events, and human input"; graph-based `WorkflowBuilder` (executors, edges, events, state management; fan-out/fan-in; checkpoints at superstep boundaries) and a Python functional API (`@workflow`, `@step`). Human-in-the-loop: `ctx.request_info()` (functional) / `RequestInfoExecutor` (graph). Capabilities page: agents in workflows, workflows as agents, declarative workflows, human-in-the-loop, checkpoints and resuming, observability, visualization. Orchestrations: "sequential, concurrent, handoff, group-chat, and Magentic patterns."

**When to use agents vs workflows (overview, table):** use an agent for open-ended or conversational tasks and autonomous tool use; a workflow when steps are well defined and you need explicit control of order. Page line: "If you can write a function to handle the task, do that instead of using an AI agent."

**Safety page ("Agent Safety") quotes:** "Treat LLM-provided arguments as untrusted input"; "By default, all tools provided to an agent are invoked without user approval. Use the tool approval mechanism to gate high-risk operations behind human confirmation."; "Do not place end-user input into `system`-role messages."; also notes indirect prompt injection via RAG data, and that the framework imposes no input/output length or rate limits.

---

## 5. Vendor agent SDKs

### 5a. OpenAI Agents SDK
**URLs read:** https://openai.github.io/openai-agents-python/ ; /quickstart/ ; /handoffs/ ; /guardrails/ ; /tracing/ ; /tools/ ; raw `docs/tools.md`, `docs/quickstart.md`, `pyproject.toml` on GitHub (openai/openai-agents-python).
- Package: `openai-agents`; `pip install openai-agents`; set `OPENAI_API_KEY`. Imports from `agents`. Python: `pyproject.toml` says `requires-python = ">=3.10"` (repo file; the docs page I read states no Python version).
- Primitives named on the home page: Agents; Agents as tools / Handoffs; Guardrails; also Sessions and Tracing.
- Hello world (home page, copied):
```python
from agents import Agent, Runner

agent = Agent(name="Assistant", instructions="You are a helpful assistant")

result = Runner.run_sync(agent, "Write a haiku about recursion in programming.")
print(result.final_output)
```
- **Function-tool decorator discrepancy (important):** every code example on the current quickstart and tools pages imports `from agents.decorators import tool` and uses `@tool`. The tools page prose still says `@function_tool(...)` (for `defer_loading`, `timeout`, `failure_error_function`, `allowed_callers`) and never explains the relation. Do not claim either is renamed or deprecated. For course code: UNVERIFIED which import is canonical; check installed version before publishing (`pyproject.toml` version read: 0.25.0).
- Function tool (quickstart, copied; async `Runner.run`):
```python
import asyncio
from agents import Agent, Runner
from agents.decorators import tool

@tool
def history_fun_fact() -> str:
    """Return a short history fact."""
    return "Sharks are older than trees."

agent = Agent(
    name="History Tutor",
    instructions="Answer history questions clearly. Use history_fun_fact when it helps.",
    tools=[history_fun_fact],
)

async def main():
    result = await Runner.run(
        agent, "Tell me something surprising about ancient life on Earth."
    )
    print(result.final_output)

if __name__ == "__main__":
    asyncio.run(main())
```
- Handoffs (quickstart, copied): `Agent(name="Triage Agent", instructions=..., handoffs=[history_tutor_agent, math_tutor_agent])`, specialists carry `handoff_description=...`; read `result.last_agent.name`. Handoffs page: LLM sees each handoff as a tool (e.g. `transfer_to_refund_agent`); items in `handoffs` can be an `Agent` or `handoff(agent, tool_name_override=..., on_handoff=..., input_filter=..., ...)`.
- Guardrails (guardrails page): input guardrails (`@input_guardrail`, `InputGuardrailTripwireTriggered`; check initial input, only the first agent in a chain; parallel by default, `run_in_parallel=False` to block); output guardrails (`@output_guardrail`, `OutputGuardrailTripwireTriggered`; only the agent producing the final output); tool guardrails (`@tool_input_guardrail`, `@tool_output_guardrail`, exceptions `ToolInputGuardrailTripwireTriggered` / `ToolOutputGuardrailTripwireTriggered`, results via `ToolGuardrailFunctionOutput.allow()` / `.reject_content(...)`). Stated limits: tool guardrails don't cover handoffs, hosted tools (e.g. `WebSearchTool`) or built-in execution tools (e.g. `ShellTool`); in parallel mode the agent may already have used tokens and run tools before a tripwire cancels it.
- Tracing (tracing page): "Tracing is enabled by default." Records model calls, tool calls, handoffs, guardrails; viewed in the Traces dashboard. Disable: `OPENAI_AGENTS_DISABLE_TRACING=1`, `set_tracing_disabled(True)`, or `RunConfig(tracing_disabled=True)` per run. Sensitive data: `RunConfig.trace_include_sensitive_data` defaults to `True` (env `OPENAI_AGENTS_TRACE_INCLUDE_SENSITIVE_DATA`). Concepts: trace (one end-to-end workflow run), span.

### 5b. Claude Agent SDK and Anthropic tool runner
**URLs read:** https://code.claude.com/docs/en/agent-sdk/overview (platform.claude.com/docs/en/agent-sdk/overview redirects there) ; https://code.claude.com/docs/en/agent-sdk/quickstart ; https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-runner

**Claude Agent SDK (page's words):** subtitle "Build production AI agents with Claude Code as a library". "The Agent SDK gives you the same tools, agent loop, and context management that power Claude Code, programmable in Python and TypeScript." Comparison table row: Agent SDK = "A library that runs the Claude Code binary, with Claude Code's capabilities, such as built-in tools, permissions, sessions, and hooks." Capabilities: built-in tools, hooks, subagents, MCP, permissions, sessions, skills/commands/memory, plugins. Both SDKs "bundle a native Claude Code binary".
- Packages: Python `claude-agent-sdk` (`pip install claude-agent-sdk` or `uv add claude-agent-sdk`); TypeScript `@anthropic-ai/claude-agent-sdk` (`npm install @anthropic-ai/claude-agent-sdk`). Prerequisites: "Node.js 18.14+ or Python 3.10+". Auth: `ANTHROPIC_API_KEY` env var (it does not load `.env` files); page note: unless previously approved, third-party developers may not offer claude.ai login for their products.
- Minimal sample (quickstart, copied):
```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage

async def main():
    async for message in query(
        prompt="Review utils.py for bugs that would cause crashes. Fix any issues you find.",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit", "Glob"],  # Auto-approve these tools
            permission_mode="acceptEdits",  # Auto-approve file edits
        ),
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if hasattr(block, "text"):
                    print(block.text)
                elif hasattr(block, "name"):
                    print(f"Tool: {block.name}")
        elif isinstance(message, ResultMessage):
            print(f"Done: {message.subtype}")

asyncio.run(main())
```
TypeScript uses `import { query } from "@anthropic-ai/claude-agent-sdk"` and `for await (const message of query({ prompt, options: { allowedTools: [...], permissionMode: "acceptEdits" } }))`.
- Permissions (permissions page, https://code.claude.com/docs/en/agent-sdk/permissions): modes `default`, `dontAsk`, `acceptEdits`, `bypassPermissions`, `plan`, `auto`; evaluation order hooks, deny rules, ask rules, permission mode, allow rules, `canUseTool` callback. Warnings from the page: "Auto-approved tools never reach `canUseTool`"; `allowed_tools` "does not constrain `bypassPermissions`"; a locked-down headless agent pairs `allowedTools` with `permissionMode: "dontAsk"`.
- The page says the Agent SDK is distinct from the Client SDK (you write the tool loop yourself "or let the client SDK's beta tool runner drive it") and from Managed Agents (Anthropic hosts the agent loop).
- Not verified: any statement about a prior "Claude Code SDK" name beyond the overview page's "Migration guide: migrate from the Claude Code SDK packages to the Agent SDK" link text.

**Tool runner (page's words):** "The tool runner handles the agentic loop, error wrapping, and type safety so you don't have to." Automatically runs tools when Claude calls them, handles request/response cycle, manages conversation state, provides type safety and validation. Page front-matter marks it `status: beta`. "When you need human-in-the-loop approval, custom logging, or conditional execution, use the manual loop instead." Available in the Python, TypeScript, C# (and further listed) SDKs. It is a helper over the Messages API for tools you define in your own code; it does not run Claude Code.
- Python sample (page, copied; `@beta_tool`, async client uses `@beta_async_tool`):
```python
import json
from anthropic import Anthropic, beta_tool

client = Anthropic()

@beta_tool
def get_weather(location: str, unit: str = "fahrenheit") -> str:
    """Get the current weather in a given location.

    Args:
        location: The city and state, e.g. San Francisco, CA
        unit: Temperature unit, either 'celsius' or 'fahrenheit'
    """
    return json.dumps({"temperature": "20°C", "condition": "Sunny"})

runner = client.beta.messages.tool_runner(
    model="claude-opus-5-5",
    max_tokens=1024,
    tools=[get_weather],
    messages=[{"role": "user", "content": "What's the weather like in Paris?"}],
)
for message in runner:
    print(message)
```
(Page's sample has a second tool `calculate_sum`; trimmed here.) TypeScript: `betaZodTool()` (Zod 3.25.0+) or `betaTool()` (JSON Schema) from `@anthropic-ai/sdk/helpers/beta/zod` / `.../json-schema`, run with `client.beta.messages.toolRunner({...})`. Page note: for `betaTool`, "The input generated by Claude is not validated at runtime."

### 5c. Google Agent Development Kit (ADK)
**URLs read:** https://adk.dev/ (https://google.github.io/adk-docs/ redirects there with a 301) ; https://adk.dev/get-started/python/
- Page says ADK is "the open-source agent development framework" for building, debugging and deploying AI agents. Languages and packages: Python `pip install google-adk`; TypeScript `npm install @google/adk`; Go `go get google.golang.org/adk/v2`; Java `com.google.adk:google-adk`; Kotlin `com.google.adk:google-adk-kotlin-core`. Python prerequisite: "Python 3.10 or later".
- Minimal Python agent (copied from the Python get-started page):
```python
from google.adk.agents.llm_agent import Agent

def get_current_time(city: str) -> dict:
    """Returns the current time in a specified city."""
    return {"status": "success", "city": city, "time": "10:30 AM"}

root_agent = Agent(
    model='gemini-flash-latest',
    name='root_agent',
    description="Tells the current time in a specified city.",
    instruction="You are a helpful assistant that tells the current time in cities. Use the 'get_current_time' tool for this purpose.",
    tools=[get_current_time],
)
```
(The page runs this through ADK's project layout and CLI; I did not read the run commands.)

---

## 6. Model Context Protocol

**URLs read:** https://modelcontextprotocol.io/docs/getting-started/intro ; https://modelcontextprotocol.io/docs/learn/architecture (served as the `2026-07-28` docs version).
- Page says: "MCP (Model Context Protocol) is an open-source standard for connecting AI applications to external systems." AI applications can connect to "data sources (e.g. local files, databases), tools (e.g. search engines, calculators) and workflows (e.g. specialized prompts)." Analogy on the page: "Think of MCP like a USB-C port for AI applications."
- Participants: MCP host (the AI application), MCP client (one per server connection), MCP server ("A program that provides context to MCP clients"). Transports: stdio (local) and Streamable HTTP (remote; "MCP recommends using OAuth"). Data layer is JSON-RPC 2.0 based.
- **Three server primitives (architecture page):** **Tools** ("Executable functions that AI applications can invoke to perform actions"), **Resources** ("Data sources that provide contextual information to AI applications"), **Prompts** ("Reusable templates that help structure interactions with language models"). Methods: `tools/list`, `tools/call`, `resources/list`, `resources/read`, `prompts/list`, `prompts/get`.
- Client primitive named: Elicitation (`elicitation/create`). The page says roots and sampling (client features) and protocol logging (server feature) are deprecated as of protocol version `2026-07-28`. MCP "is a stateless protocol"; servers advertise versions/capabilities via `server/discover`. Note this differs from older MCP descriptions (initialize handshake), so do not teach the old handshake without checking the version your SDK speaks.
- Page note: "MCP focuses solely on the protocol for context exchange—it does not dictate how AI applications use LLMs or manage the provided context."
- Security best-practices page exists (linked from intro) but I did not read it: UNVERIFIED.

---

## 7. Agent security and evaluation sources

### 7a. OWASP
**URLs read:** https://genai.owasp.org/llm-top-10/ ; individual risk pages LLM01 (`/llmrisk/llm01-prompt-injection/`), LLM02, LLM05, LLM06, LLM10 ; https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/ ; https://genai.owasp.org/initiatives/agentic-security-initiative/

**Current edition on the list page: 2025** ("OWASP Top 10 for LLM Applications", IDs written `LLMnn:2025`). Category names exactly as listed:
- LLM01:2025 Prompt Injection
- LLM02:2025 Sensitive Information Disclosure
- LLM03:2025 Supply Chain
- LLM04:2025 Data and Model Poisoning
- LLM05:2025 Improper Output Handling
- LLM06:2025 Excessive Agency
- LLM07:2025 System Prompt Leakage
- LLM08:2025 Vector and Embedding Weaknesses
- LLM09:2025 Misinformation
- LLM10:2025 Unbounded Consumption

One-sentence wording (short quotes; the list page only shows truncated teasers, so I fetched risk pages for five):
- Prompt Injection: "A Prompt Injection Vulnerability occurs when user prompts alter the LLM's behavior or output in unintended ways."
- Sensitive Information Disclosure: "Sensitive information can affect both the LLM and its application context."
- Improper Output Handling: "Improper Output Handling refers specifically to insufficient validation, sanitization, and handling of the outputs generated" (sentence continues past my quote limit).
- Excessive Agency: "Excessive Agency is the vulnerability that enables damaging actions to be performed in response to unexpected, ambiguous" (continues: harmful actions can occur whatever causes the model's faulty output).
- Unbounded Consumption: "Unbounded Consumption refers to the process where a Large Language Model (LLM) generates outputs based on input queries or..." (truncated by the tool; full sentence not read).
- LLM03, LLM04, LLM07, LLM08, LLM09: only the truncated list-page teasers read (e.g. "LLM supply chains are susceptible to various vulnerabilities, which can..."); full definitions UNVERIFIED.

**Agentic AI:** official resource page is titled "OWASP Top 10 for Agentic Applications for 2026", published December 9, 2025, described as "a globally peer-reviewed framework that identifies the most critical security risks facing autonomous and agentic AI systems." The official page content I could read did **not** include the ten category names (they are in a downloadable document). A web search returned third-party summaries using IDs ASI01 to ASI10 and naming ASI01 as agent goal hijack, but I did **not** read an official page listing them, so the ASI category names are **UNVERIFIED**; do not list them in the course without reading the OWASP PDF. The "Agentic Security Initiative" page describes its focus as "Securing autonomous agents and multi-step AI workflows" and points to the guides "Securing Agentic Applications V2" and "Agentic AI Taxonomy" (not read).

### 7b. Vendor statements on prompt injection, tool permissions, human approval, guardrails
- **OpenAI**, "Safety in building agents": https://developers.openai.com/api/docs/guides/agent-builder-safety (platform.openai.com/docs/guides/agent-builder-safety redirects). Quotes: "Prompt injections are a common and dangerous type of attack." and "always enable tool approvals so end users can review and confirm every operation, including reads and writes." (I read only these two sentences; the page likely says more.)
- **OpenAI Agents SDK guardrails:** https://openai.github.io/openai-agents-python/guardrails/ (see 5a for names and stated limits).
- **Anthropic**, "Mitigate jailbreaks and prompt injections": https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks . Quotes: "Put untrusted content only in tool results." and "Apply the principle of least privilege so that a successful injection can do minimal damage". The page separates "Jailbreaks and direct prompt injection" (user is the adversary) from "Indirect prompt injection" (third-party content such as webpages, emails, tool results), and advises screening tool outputs and red-teaming your own agent.
- **Anthropic**, Claude Code "Security": https://code.claude.com/docs/en/security . Quotes: "Prompt injection is a technique where an attacker attempts to override or manipulate an AI assistant's instructions by inserting malicious text." and "no system is completely immune to all attacks." Lists permission-based architecture, sandboxed Bash, network command approval.
- **Anthropic**, Agent SDK permissions: https://code.claude.com/docs/en/agent-sdk/permissions . Opening: "Use permission modes and rules to define what's allowed automatically, and the `canUseTool` callback to handle everything else at runtime." Also the `bypassPermissions` warning: "Use with extreme caution. Claude has full system access in this mode."
- **LangChain**, "Guardrails": https://docs.langchain.com/oss/python/langchain/guardrails . Quote: "Guardrails help you build safe, compliant AI applications." Names deterministic ("rule-based logic like regex patterns, keyword matching, or explicit checks") and model-based approaches; built-in `PIIMiddleware` and `HumanInTheLoopMiddleware`. See also human-in-the-loop page (section 1).
- **Microsoft**, "Agent Safety": https://learn.microsoft.com/en-us/agent-framework/concepts/agents/safety . Quote: "Treat LLM-provided arguments as untrusted input, similar to user input in a web API." and "By default, all tools provided to an agent are invoked without user approval." Page also points to "Agent Security with FIDES" (label-based information-flow control; not read).

### 7c. NIST AI Risk Management Framework
**URLs read:** https://www.nist.gov/itl/ai-risk-management-framework ; https://airc.nist.gov/airmf-resources/airmf/5-sec-core/
- The Core "is composed of four functions: govern, map, measure, and manage" (AIRC Core page). Descriptions quoted: GOVERN "cultivates and implements a culture of risk management"; MAP "establishes the context to frame risks related to an AI system"; MEASURE uses tools and methodologies "to analyze, assess, benchmark, and monitor AI risk and related impacts"; MANAGE "entails allocating risk resources to mapped and measured risks on a regular basis".
- NIST page: AI RMF 1.0 released January 26, 2023; page says it is being revised as part of the White House AI Action Plan (no date given). Companion "NIST-AI-600-1, Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile", released July 26, 2024.
- (NIST.AI.100-1 PDF fetch returned unreadable data, so I rely on the AIRC page.)

### 7d. OpenTelemetry GenAI semantic conventions
**URLs read:** https://opentelemetry.io/docs/specs/semconv/gen-ai/ ; https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans/ ; https://raw.githubusercontent.com/open-telemetry/semantic-conventions-genai/main/docs/gen-ai/gen-ai-spans.md ; https://github.com/open-telemetry/semantic-conventions-genai
- opentelemetry.io page says: "GenAI semantic conventions have moved to the OpenTelemetry GenAI semantic conventions repository." (repo: github.com/open-telemetry/semantic-conventions-genai). Pages listed: events, metrics, spans, agent spans.
- Status: the spans document in that repo opens with "**Status**: Development"; most `gen_ai.*` attributes carry a Development badge; a few shared attributes (`error.type`, `server.address`, `server.port`) are Stable. So: **in development, not stable**, as the page states. Content capture is off by default (`NO_CONTENT` is "(Default)"); env var `OTEL_INSTRUMENTATION_GENAI_CAPTURE_CONTENT`. I did not find `OTEL_SEMCONV_STABILITY_OPT_IN` text on the pages I read: UNVERIFIED.

---

## 8. Evaluation tooling (concepts and URLs only)

- **LangSmith**, evaluation concepts: https://docs.langchain.com/langsmith/evaluation-concepts . Terms as named: dataset ("a collection of examples used for evaluating an application"), example (inputs, optional reference outputs, optional metadata), evaluator (outputs feedback with a metric key, score/value, optional comment), offline evaluation ("pre-deployment testing" on datasets with reference outputs), online evaluation (live runs, no reference outputs), experiment (one application version run on a dataset; comparable side by side). The page does not define "trajectory evaluation" or "tool-call checks" as named concepts.
- **LangSmith**, "Evaluate a complex agent": https://docs.langchain.com/langsmith/evaluate-complex-agent . Three evaluation types named: **Final response** (LLM-as-judge against a reference), **Trajectory** ("whether the agent took the expected path (e.g., of tool calls) to arrive at the final answer"), **Single step** ("whether it selects the appropriate first tool for a given step").
- **OpenAI**, "Evaluate agent workflows": https://developers.openai.com/api/docs/guides/agent-evals . Progression: start with **traces** (model calls, tool calls, guardrails, handoffs) and **trace grading**; then **datasets** and **eval runs** for repeatable benchmarking. Quote: "Trace grading is the fastest way to identify workflow-level issues."
- **OpenAI**, "Working with evals": https://developers.openai.com/api/docs/guides/evals . Terms: dataset (JSONL items, purpose `evals`), graders in `testing_criteria` (e.g. `string_check`), eval run (asynchronous). **Page notice: OpenAI is deprecating the Evals platform; existing evals become read-only on October 31, 2026 and the platform shuts down on November 30, 2026** (read 2026-11-18; recheck before the course ships, and avoid teaching the Evals API as the main path).
- **Anthropic**, "Define success criteria and build evaluations": https://platform.claude.com/docs/en/test-and-evaluate/develop-tests . Concepts: success criteria (specific, measurable, achievable, relevant), test cases (task-specific, automate where possible, prioritise volume), grading methods code-based, LLM-based, human. Advice quoted: "Generally best practice to evaluate with a different model from the one used to generate the evaluated output." (read only first 100k of 153k characters.)

---

## 9. Minimum versions stated

| Item | Stated minimum | Source |
|---|---|---|
| LangChain (Python) | Python 3.11+ | langchain quickstart ("Install Python 3.11+ separately if needed") |
| LangChain (TypeScript) | Node.js 22+ (Bun v1.0.0+) | JS quickstart |
| LangGraph (Python) | `>=3.10` | installed package metadata only; docs page UNVERIFIED |
| CrewAI | Python `>=3.10 and <3.14` | docs.crewai.com/en/installation |
| Microsoft Agent Framework (Python) | Python 3.11+ (3.10 no longer installs from python-1.25.0) | python-2026-significant-changes page |
| Microsoft Agent Framework (Go) | Go 1.26+ | overview page |
| OpenAI Agents SDK | Python `>=3.10` | repo `pyproject.toml` (docs page states none) |
| Claude Agent SDK | Node.js 18.14+ or Python 3.10+ | agent-sdk quickstart |
| Google ADK (Python) | Python 3.10+ | adk.dev/get-started/python/ |
| Anthropic tool runner (TypeScript Zod helper) | Zod 3.25.0+ | tool runner page |

Practical note for the course: the highest Python minimum among these is 3.11 (LangChain, Microsoft Agent Framework), so a 3.11+ baseline satisfies all of the above; Node 22+ satisfies the TypeScript items read.

---

## READ (URLs actually read, 2026-11-18)

LangChain/LangGraph:
- https://docs.langchain.com/oss/python/langchain/overview
- https://docs.langchain.com/oss/python/langchain/quickstart
- https://docs.langchain.com/oss/python/langchain/tools
- https://docs.langchain.com/oss/python/langchain/models
- https://docs.langchain.com/oss/python/langchain/guardrails
- https://docs.langchain.com/oss/python/langchain/human-in-the-loop
- https://docs.langchain.com/oss/python/migrate/langchain-v1
- https://docs.langchain.com/oss/javascript/langchain/quickstart
- https://docs.langchain.com/oss/python/langgraph/overview
- https://docs.langchain.com/oss/python/langgraph/graph-api
- https://docs.langchain.com/oss/python/langgraph/quickstart
- https://docs.langchain.com/oss/python/langgraph/persistence
- https://docs.langchain.com/oss/python/langgraph/interrupts
- https://docs.langchain.com/langsmith/evaluation-concepts
- https://docs.langchain.com/langsmith/evaluate-complex-agent

CrewAI:
- https://docs.crewai.com/en/installation
- https://docs.crewai.com/en/quickstart
- https://docs.crewai.com/en/concepts/crews
- https://docs.crewai.com/en/concepts/agents
- https://docs.crewai.com/en/concepts/tasks
- https://docs.crewai.com/en/concepts/llms
- https://docs.crewai.com/en/concepts/flows

Microsoft:
- https://learn.microsoft.com/en-us/agent-framework/overview/
- https://learn.microsoft.com/en-us/agent-framework/get-started/your-first-agent (served for the quick-start URL)
- https://learn.microsoft.com/en-us/agent-framework/get-started/add-tools
- https://learn.microsoft.com/en-us/agent-framework/concepts/workflows/
- https://learn.microsoft.com/en-us/agent-framework/workflows/
- https://learn.microsoft.com/en-us/agent-framework/concepts/agents/safety
- https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-semantic-kernel/
- https://learn.microsoft.com/en-us/agent-framework/support/upgrade/python-2026-significant-changes (first 100,000 of 186,282 characters)
- https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/

Vendor SDKs, MCP:
- https://openai.github.io/openai-agents-python/ ; /quickstart/ ; /handoffs/ ; /guardrails/ ; /tracing/ ; /tools/
- https://raw.githubusercontent.com/openai/openai-agents-python/main/docs/tools.md ; .../docs/quickstart.md ; .../pyproject.toml
- https://code.claude.com/docs/en/agent-sdk/overview ; /agent-sdk/quickstart ; /agent-sdk/permissions ; https://code.claude.com/docs/en/security
- https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-runner
- https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks
- https://platform.claude.com/docs/en/test-and-evaluate/develop-tests (first 100,000 of 152,950 characters)
- https://adk.dev/ ; https://adk.dev/get-started/python/
- https://modelcontextprotocol.io/docs/getting-started/intro ; https://modelcontextprotocol.io/docs/learn/architecture

Security and standards:
- https://genai.owasp.org/llm-top-10/ ; https://genai.owasp.org/llmrisk/llm01-prompt-injection/ ; .../llm062025-excessive-agency/ ; .../llm052025-improper-output-handling/ ; .../llm102025-unbounded-consumption/ ; .../llm022025-sensitive-information-disclosure/
- https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/ ; https://genai.owasp.org/initiatives/agentic-security-initiative/
- https://developers.openai.com/api/docs/guides/agent-builder-safety ; /agent-evals ; /evals
- https://www.nist.gov/itl/ai-risk-management-framework ; https://airc.nist.gov/airmf-resources/airmf/5-sec-core/
- https://opentelemetry.io/docs/specs/semconv/gen-ai/ ; .../gen-ai-agent-spans/ ; https://github.com/open-telemetry/semantic-conventions-genai ; raw `docs/gen-ai/gen-ai-spans.md`

Run locally (not a doc page): scratch venv with `pip install -U langgraph` (1.2.22) and `langchain` (1.5.0); LangGraph samples and the `create_agent` import executed; package metadata and the `create_react_agent` docstring inspected.

## NOT READ / UNVERIFIED

- github.com/microsoft/agent-framework README and raw README: 404 on fetch. Status wording therefore comes from the dev blog and Learn pages only. Microsoft AutoGen migration guide: fetched but output too large to read; no statement on AutoGen/Semantic Kernel maintenance status was read.
- Any official page saying `AgentExecutor` or `initialize_agent` is deprecated (LangChain pages I read are silent).
- LangGraph's documented Python minimum on a docs page; OpenAI Agents SDK's Python minimum on a docs page (only repo file and package metadata).
- OpenAI Agents SDK: whether `@function_tool` and `@tool` (from `agents.decorators`) are aliases; which is canonical.
- OWASP Top 10 for Agentic Applications: the ten ASI category names and descriptions (official document not read). Full definitions of LLM03, LLM04, LLM07, LLM08, LLM09 and the full sentences for LLM05, LLM06, LLM10.
- OpenTelemetry `OTEL_SEMCONV_STABILITY_OPT_IN` guidance.
- MCP security best-practices page; MCP SDK package names and install commands (not fetched).
- Microsoft "Agent Security with FIDES" and tool-approval pages; OpenAI Agent Builder safety page beyond two sentences.
- Anthropic: Managed Agents docs; Agent SDK custom tools / hooks pages; any evaluation page specific to agent trajectories.
- CrewAI quickstart `crew.jsonc` / `load_crew` details beyond the excerpt; CrewAI hierarchical sample was not run; the LangChain TypeScript sample, ADK sample, CrewAI, OpenAI, Claude and Microsoft samples were not executed (no keys used).
- Several model-name strings in the sources (for example `gpt-6.1-sol`, `gemini-4-hydrogen`, `gpt-6-luna`, `openai/gpt-5.6-terra`, `gemini/gemini-3.6-flash`, `gemini-flash-latest`, `claude-opus-5-5`, `claude-sonnet-4-6`) are copied exactly as the pages show them; I did not check the provider catalogs, so do not treat them as confirmed live model IDs.
