import type { Course } from './types';

const CHECKED = '2026-11-14';

const SRC = {
  nist80022: { label: 'NIST SP 800-122, Guide to Protecting the Confidentiality of PII', url: 'https://csrc.nist.gov/pubs/sp/800/122/final' },
  owaspLlm02: { label: 'OWASP LLM02:2025 Sensitive Information Disclosure', url: 'https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/' },
  owaspLlm01: { label: 'OWASP LLM01:2025 Prompt Injection', url: 'https://genai.owasp.org/llmrisk/llm01-prompt-injection/' },
  owaspLlm06: { label: 'OWASP LLM06:2025 Excessive Agency', url: 'https://genai.owasp.org/llmrisk/llm062025-excessive-agency/' },
  pgGrant: { label: 'PostgreSQL 18: GRANT', url: 'https://www.postgresql.org/docs/current/sql-grant.html' },
  pgAlterRole: { label: 'PostgreSQL 18: ALTER ROLE', url: 'https://www.postgresql.org/docs/current/sql-alterrole.html' },
  pgClientConfig: { label: 'PostgreSQL 18: Client Connection Defaults', url: 'https://www.postgresql.org/docs/current/runtime-config-client.html' },
  pgExplain: { label: 'PostgreSQL 18: EXPLAIN', url: 'https://www.postgresql.org/docs/current/sql-explain.html' },
  wcagColor: { label: 'WCAG 2.2: Understanding Use of Color (1.4.1)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html' },
  wcagContrast: { label: 'WCAG 2.2: Understanding Non-text Contrast (1.4.11)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html' },
  ghSchedule: { label: 'GitHub Docs: events that trigger workflows (schedule)', url: 'https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule' },
  ghSecrets: { label: 'GitHub Docs: using secrets in GitHub Actions', url: 'https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions' },
};

export const miniAiDataCourse: Course = {
  id: 'mini-ai-data',
  kind: 'mini',
  level: 'beginner',
  title: 'AI for Data Analysts',
  tagline: 'Clean, query and explain data faster, and still get the numbers right.',
  description:
    'Five short lessons on using AI in everyday analysis: cleaning messy spreadsheets and pandas data, writing SQL with AI and checking it, turning results into clear charts and insights, automating a weekly report, and protecting privacy and accuracy. You finish with an analysis of a public dataset and a short report.',
  finishLine: [
    'A cleaning routine for messy data, in a spreadsheet or in pandas',
    'SQL you write with AI help and verify before you trust it',
    'Charts and plain-language insights a manager can act on',
    'A published analysis of a public dataset with a short report',
  ],
  audiences: ['fresh-grad', 'career-changer'],
  skills: [
    { id: 'data-cleaning', label: 'Data cleaning' },
    { id: 'sql-with-ai', label: 'SQL with AI' },
    { id: 'charts-insights', label: 'Charts and insights' },
    { id: 'report-automation', label: 'Report automation' },
    { id: 'data-accuracy-privacy', label: 'Accuracy and privacy' },
  ],
  lessons: [
    {
      id: 'mini-ai-data-01',
      day: 1,
      title: 'Cleaning data with AI help',
      summary: 'Fix messy spreadsheets and pandas data with AI, without losing track of what changed.',
      intro: {
        objectives: [
          'Describe a messy file to an AI with column names and masked sample rows instead of the whole file',
          'Read cleaning code line by line, including what errors="coerce" does',
          'Choose the spreadsheet formula or pandas option that fixes each kind of mess',
          'Count the rows each cleaning step changes or removes',
        ],
        why: 'Cleaning takes most of an analyst\'s time, and one quiet mistake here ruins every chart that follows. AI makes it faster, but you stay responsible for what "clean" means.',
      },
      minutes: 15,
      skills: ['data-cleaning'],
      body: [
        {
          type: 'paragraph',
          text: 'Most of an analyst\'s time goes into cleaning data, not into charts. Names typed three ways, amounts saved as text with peso signs, dates in two formats, duplicate rows. AI can speed this up a lot, as long as you stay the one who decides what "clean" means.',
        },
        { type: 'heading', text: 'Describe the mess, not the whole file' },
        {
          type: 'paragraph',
          text: 'You rarely need to upload a full file. Show the AI the column names and a few sample rows with fake or masked values, and describe the problems you see. That is safer and gives better answers.',
        },
        {
          type: 'prompt',
          label: 'Cleaning plan',
          text: 'I have a sales CSV with columns: Date, Branch, Customer Type, Amount. Sample rows (values changed):\n03/01/2026, Quezon City , Walk-in, "₱1,250.00"\n2026-03-01, quezon city, walk in, 980\n03/02/2026, Cebu, Online, \n\nProblems I see: mixed date formats, branch names with spaces and different capitalisation, "Walk-in" vs "walk in", amounts as text with ₱ and commas, empty amounts.\n\nGive me a step-by-step cleaning plan, then pandas code for it. Do not drop rows silently: count and print how many rows each step changes or removes.',
        },
        {
          type: 'paragraph',
          text: 'Here is the kind of pandas code you should get back. Read it line by line before you run it:',
        },
        {
          type: 'code',
          language: 'python',
          label: 'clean_sales.py',
          code: 'import pandas as pd\n\ndf = pd.read_csv("sales.csv")\nprint("Rows at start:", len(df))\n\ndf.columns = df.columns.str.strip().str.lower().str.replace(" ", "_", regex=False)\n\ndf["branch"] = df["branch"].str.strip().str.title()\ndf["customer_type"] = (\n    df["customer_type"].str.strip().str.lower().str.replace(" ", "-", regex=False)\n)\n\namount_text = (\n    df["amount"].astype(str)\n    .str.replace("₱", "", regex=False)\n    .str.replace(",", "", regex=False)\n    .str.strip()\n)\ndf["amount"] = pd.to_numeric(amount_text, errors="coerce")\n\ndf["date"] = pd.to_datetime(df["date"], format="mixed", errors="coerce")\n\nprint("Missing amounts:", df["amount"].isna().sum())\nprint("Unreadable dates:", df["date"].isna().sum())\n\nbefore = len(df)\ndf = df.drop_duplicates()\nprint("Duplicates removed:", before - len(df))\n\ndf.to_csv("sales_clean.csv", index=False)',
        },
        {
          type: 'paragraph',
          text: 'Two lines need your judgment. `errors="coerce"` turns anything unreadable into an empty value instead of crashing, so you must look at those rows. And `format="mixed"` (pandas 2 and later) guesses each date separately: is 03/01/2026 March 1 or January 3? Check your source and, if the dates are day-first, tell pandas with `dayfirst=True`.',
        },
        {
          type: 'diagram',
          format: 'json',
          source: {
            kind: 'flow',
            title: 'What clean_sales.py does, in order',
            summary: 'The script reads the CSV, tidies column names and text, turns amounts into numbers and dates into dates, counts what is missing or unreadable, removes duplicates while counting them, and saves a clean copy.',
            direction: 'TD',
            nodes: [
              { id: 'read', label: 'Read sales.csv and count the rows', shape: 'database' },
              { id: 'names', label: 'Tidy the column names' },
              {
                id: 'text',
                label: 'Fix branch and customer type text',
                note: 'Strip spaces and fix capitalisation so "Quezon City " and "quezon city" match.',
              },
              {
                id: 'amount',
                label: 'Amounts: remove ₱ and commas, convert to numbers',
                note: 'errors="coerce" turns anything unreadable into an empty value instead of crashing, so look at those rows.',
              },
              {
                id: 'date',
                label: 'Dates: convert to real dates',
                note: 'format="mixed" guesses each date separately. Check whether your dates are day-first.',
              },
              { id: 'count', label: 'Count missing amounts and unreadable dates' },
              { id: 'dupes', label: 'Drop duplicates and count them' },
              { id: 'save', label: 'Save sales_clean.csv', shape: 'rounded' },
            ],
            edges: [
              { from: 'read', to: 'names' },
              { from: 'names', to: 'text' },
              { from: 'text', to: 'amount' },
              { from: 'amount', to: 'date' },
              { from: 'date', to: 'count' },
              { from: 'count', to: 'dupes' },
              { from: 'dupes', to: 'save' },
            ],
          },
          caption: 'Every step that changes or removes rows prints a count, so silent data loss shows up.',
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-ai-data-01-python-1',
            kind: 'predict-output',
            title: 'What does coerce do?',
            prompt: 'This is the amount cleaning from the script, on three values. What does it print? (Python code here is judged against the stored answer, not run.)',
            concept: 'cleaning numbers',
            language: 'python',
            code: 'import pandas as pd\n\namounts = pd.Series(["₱1,250.00", "980", "oops"])\ntext = amounts.str.replace("₱", "", regex=False).str.replace(",", "", regex=False)\nprint(pd.to_numeric(text, errors="coerce").tolist())',
            expected: '[1250.0, 980.0, nan]',
            choices: ['[1250.0, 980.0, nan]', '[1250.0, 980.0]', '[1250.0, 980.0, 0.0]', 'ValueError'],
            wrongNotes: {
              '[1250.0, 980.0]': '`errors="coerce"` does not delete values. It replaces unreadable ones with an empty value (NaN), so the list keeps its three items.',
              '[1250.0, 980.0, 0.0]': 'Unreadable values become NaN (empty), not zero. Treating them as zero would quietly change your totals.',
              ValueError: 'Without `errors="coerce"` this would stop with an error. Coerce is what turns "oops" into an empty value instead.',
            },
            hints: [
              'First the peso sign and commas are removed. What are the first two values after that?',
              '"oops" is not a number. What does `errors="coerce"` do with it?',
              'The result keeps three items, and the last one is empty (NaN).',
            ],
            explanation: '"₱1,250.00" becomes 1250.0 and "980" becomes 980.0. "oops" cannot be read, so coerce makes it NaN. That is why you count and look at the missing values afterwards.',
          },
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **CSV** file is a plain text table: one row per line, with commas between the columns. Here is the script in everyday words. **pandas** is a Python library (a ready-made toolbox) for working with tables. `pd.read_csv(\"sales.csv\")` opens the file and keeps its table in a **variable** (a label for something the computer remembers) called `df`, short for DataFrame, which is just a table with named columns. `len(df)` counts the rows. The lines with `.str.strip()` remove stray spaces from the edges of each text cell, `.str.title()` fixes capital letters, and `.str.lower()` makes everything small letters, so \"Quezon City \" and \"quezon city\" become one branch. `pd.to_numeric` turns text such as 1250.00 into a number you can add up, and `drop_duplicates()` removes rows that are exact copies. Each `print` shows a count, so you can see what changed.",
        },
        { type: 'heading', text: 'In a spreadsheet instead' },
        {
          type: 'list',
          items: [
            '`=TRIM(B2)` removes extra spaces; `=PROPER(TRIM(B2))` also fixes capitalisation.',
            '`=VALUE(SUBSTITUTE(SUBSTITUTE(D2,"₱",""),",",""))` turns "₱1,250.00" into a number.',
            'Keep the original column and put cleaned values in a new one, so you can compare.',
          ],
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-ai-data-01-match-1',
            kind: 'match',
            title: 'Which fix for which mess?',
            prompt: 'Five problems from a real sales file. Match each problem with the formula or option that fixes it.',
            concept: 'data cleaning',
            labels: { terms: 'Problem in your data', meanings: 'What fixes it' },
            pairs: [
              {
                term: 'Branch names like "  Cebu  " have stray spaces, but the capitals are already right.',
                definition: '`=TRIM(B2)`',
                note: 'Only the spaces are wrong here, so nothing else needs fixing.',
              },
              {
                term: '"quezon city " and "QUEZON CITY" should both read "Quezon City".',
                definition: '`=PROPER(TRIM(B2))`',
                note: 'Spaces and capitals both need fixing.',
              },
              {
                term: 'An Amount column holds text like "₱12,400.50", so the sheet cannot add it up.',
                definition: '`=VALUE(SUBSTITUTE(SUBSTITUTE(D2,"₱",""),",",""))`',
                note: 'The peso sign and comma must go before the text can become a number.',
              },
              {
                term: '`pd.to_numeric` stops with an error on an amount typed as "unknown", and you want that value empty so you can inspect it.',
                definition: '`errors="coerce"`',
                note: 'It empties unreadable values instead of stopping; you still look at them.',
              },
              {
                term: 'Your branch system writes 05/04/2026 for 5 April.',
                definition: '`dayfirst=True`',
                note: 'It tells pandas the day comes before the month.',
              },
            ],
            hints: [
              'Two problems are about text, one about money stored as text, and two about pandas reading values.',
              'If only the spaces are wrong, you do not need the formula that also changes capitals.',
              'A value pandas cannot read needs one option; a date written day first needs another.',
            ],
            explanation: 'TRIM fixes spaces alone, PROPER with TRIM fixes spaces and capitals, SUBSTITUTE then VALUE turns peso text into a number, `errors="coerce"` empties unreadable values for you to inspect, and `dayfirst=True` reads 05/04 as 5 April.',
          },
        },
        {
          type: 'warning',
          text: 'Never let a cleaning step delete rows without a count. Ten "duplicates" might be ten real customers who bought the same thing.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Think of cleaning data like tidying a kitchen before cooking. You do not throw away an ingredient you are unsure about, you set it aside and look at it. That is why the script counts instead of deleting quietly. **NaN** (short for \"not a number\") is how pandas marks a cell with nothing usable in it. When `errors=\"coerce\"` meets a value like \"oops\", it writes NaN instead of stopping the program with an error. Your job afterwards is to open those rows and decide: fix them from the source, leave them empty, or leave them out of a total, and write down which you chose. Always keep the original file untouched and save the cleaned table under a new name, as the script does with `sales_clean.csv`.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "In a team, cleaning is a pipeline other people depend on, so treat it like code. Keep the raw export immutable and write cleaned output as a new, versioned file. Turn your rules into assertions that stop the run (expected columns, a row-loss threshold, value ranges, a unique business key), so a changed export fails loudly instead of flowing into dashboards. Classify columns before any AI tool sees them: direct identifiers, quasi-identifiers (a birthdate plus a town can single someone out) and sensitive attributes. Share schemas and synthetic rows, not extracts, and log what was sent where. If an agent can reach your warehouse, give it a read-only role on a sandbox schema, never the production tables. The function below is the kind of check an assistant can draft and you should review.",
        },
        {
          type: "code",
          audience: { min: "advanced" },
          language: "python",
          label: "check_clean.py",
          code: "import pandas as pd\n\ndef check_clean(df, raw_rows):\n    \"\"\"Stop the run if the cleaned table breaks a rule we wrote down.\"\"\"\n    expected = {\"date\", \"branch\", \"customer_type\", \"amount\"}\n    assert set(df.columns) == expected, f\"columns changed: {set(df.columns) ^ expected}\"\n    assert len(df) >= 0.9 * raw_rows, f\"lost {raw_rows - len(df)} of {raw_rows} rows\"\n    assert (df[\"amount\"].dropna() >= 0).all(), \"negative amounts found\"\n    assert df[\"date\"].between(\"2026-01-01\", \"2026-12-31\").all(), \"dates outside 2026\"",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "NIST SP 800-122 (April 2010) says PII should be protected from inappropriate access, use and disclosure, and gives context-based advice on how much protection each instance of PII needs. OWASP's LLM02:2025 lists sanitization (scrubbing or masking sensitive content, including tokenization and redaction) and least-privilege access among the mitigations for sensitive information disclosure.",
          checked: CHECKED,
          sources: [
            SRC.nist80022,
            SRC.owaspLlm02,
          ],
        },
        {
          type: 'takeaways',
          items: [
            'Most of an analyst\'s time goes into cleaning. AI speeds it up, but you decide what "clean" means.',
            'Share column names and a few masked sample rows with the AI, not the whole file.',
            '`errors="coerce"` turns unreadable values into empty ones, so count and inspect them. Ambiguous dates need the source to tell you the format.',
            'Never let a step delete rows without a count: ten "duplicates" might be ten real customers.',
            'In a spreadsheet, keep the original column and put cleaned values in a new one so you can compare.',
          ],
        },
      ],
      quiz: [
        {
          id: 'mini-ai-data-01-q1',
          prompt: 'What does `errors="coerce"` do in `pd.to_numeric`?',
          choices: [
            'Deletes rows that cannot be read',
            'Turns unreadable values into empty values (NaN) instead of raising an error',
            'Guesses the correct number from the text',
          ],
          answer: 1,
          explanation: 'Coerce replaces bad values with NaN. That is why you count and inspect the missing values afterwards.',
        },
        {
          id: 'mini-ai-data-01-q2',
          prompt: 'What is the safest thing to share with an AI tool when asking for cleaning help?',
          choices: [
            'The whole customer file, so the AI sees every problem',
            'Column names and a few sample rows with fake or masked values',
            'Your database password so it can read the data directly',
          ],
          answer: 1,
          explanation: 'The structure and a few masked examples are enough to get good code, without exposing real data.',
        },
        {
          id: 'mini-ai-data-01-q3',
          prompt: 'The date "03/01/2026" appears in your data. What should you do?',
          choices: [
            'Assume it is March 1, since that is the US format',
            'Delete it because it is ambiguous',
            'Check the source system, then tell pandas the right format (for example dayfirst=True)',
          ],
          answer: 2,
          explanation: 'Day-first and month-first dates look the same. Only the source tells you which one it is.',
        },
        {
          id: 'mini-ai-data-01-q4',
          prompt: 'Why print how many rows each step removes?',
          choices: [
            'So you notice when a step removes far more rows than expected',
            'Because pandas requires it',
            'To make the script slower and safer',
          ],
          answer: 0,
          explanation: 'Counts make silent data loss visible. A surprising number is a sign to look closer.',
        },
        {
          id: "mini-ai-data-01-q5",
          audience: { max: "beginner" },
          prompt: "What does the line `df = pd.read_csv(\"sales.csv\")` do?",
          choices: [
            "Cleans every amount in the file",
            "Opens the file and keeps its table in a variable called df",
            "Sends the file to an AI tool",
            "Deletes the file after reading it",
          ],
          answer: 1,
          explanation: "It reads the file and stores the table in `df` (a DataFrame, a table with named columns). Nothing is cleaned, sent or deleted by that line.",
        },
        {
          id: "mini-ai-data-01-q6",
          audience: { min: "advanced" },
          prompt: "A nightly cleaning job suddenly keeps 60% fewer rows because the source system renamed the branch column. Which design catches this before a dashboard updates?",
          choices: [
            "A final print of the row count that somebody might read tomorrow",
            "Dropping rows that fail to parse so the counts stay steady",
            "Assertions on expected columns and a minimum row-retention rate that stop the run and alert you",
            "Re-running the cleaning code until the counts look right",
          ],
          answer: 2,
          explanation: "Checks that stop the run turn a silent change into a loud failure. A printed count only helps if someone reads it, and dropping or retrying hides the real problem.",
        },
      ],
      task: {
        title: 'Clean a messy sample',
        steps: [
          'Make a small CSV (10–15 rows) with the problems from the lesson, or download any messy public CSV.',
          'Run the "Cleaning plan" prompt with your column names and 3 masked sample rows.',
          'Run the pandas code (or the spreadsheet formulas) and compare the row counts before and after.',
          'Open a few rows that became empty and decide what to do with each.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Ask your AI tool: \"Explain this script one line at a time as if I have never programmed.\" Write down one word you still do not understand and ask about it.",
            "Put the word \"oops\" in one amount of your sample file, predict what the script will print, then run it and compare.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Add a `check_clean` function with at least four assertions (columns, row retention, value range, unique key) to the script, then break your data on purpose and confirm each assertion fires.",
            "Classify every column of a real or realistic file as direct identifier, quasi-identifier, sensitive or none, and decide what each AI tool you use may be shown.",
          ],
        },
      ],
    },
    {
      id: 'mini-ai-data-02',
      day: 2,
      title: 'SQL with AI, and checking it',
      summary: 'Let AI draft queries from plain questions, then prove the numbers are right.',
      intro: {
        objectives: [
          'Give the AI your database name and table definitions, never the data itself',
          'Spot the four common SQL mistakes: join fan-out, LEFT JOIN filters, NULLs and date ranges',
          'Write a date range with >= and < instead of BETWEEN on a timestamp',
          'Check a query result by getting the same number another way',
        ],
        why: 'A query that runs can still return the wrong number, and a wrong number in front of a manager costs you trust. Checking AI-written SQL is a skill employers look for in new analysts.',
      },
      minutes: 15,
      skills: ['sql-with-ai', 'data-accuracy-privacy'],
      body: [
        {
          type: 'paragraph',
          text: 'AI assistants write SQL quickly, and the query will usually run. That is the danger: a query that runs can still return the wrong number, and nobody notices until a manager makes a decision with it.',
        },
        { type: 'heading', text: 'Give the AI your schema and your database' },
        {
          type: 'paragraph',
          text: 'SQL varies between databases. Date functions in PostgreSQL, MySQL, SQLite and BigQuery are different. Always say which one you use, and paste the table definitions (column names and types, never the data itself).',
        },
        {
          type: 'prompt',
          label: 'Question to SQL',
          text: 'Database: PostgreSQL.\nTables:\norders(id int, customer_id int, branch text, status text, amount numeric, created_at timestamp)\ncustomers(id int, city text, signup_date date)\n\nQuestion: monthly revenue from paid orders in 2026, by branch.\nWrite the query, then explain each part in one line, and list any assumption you made (for example about which status means paid).',
        },
        {
          type: 'code',
          language: 'sql',
          label: 'A likely answer',
          code: "SELECT date_trunc('month', created_at) AS month,\n       branch,\n       COUNT(*) AS paid_orders,\n       SUM(amount) AS revenue\nFROM orders\nWHERE status = 'paid'\n  AND created_at >= '2026-01-01'\n  AND created_at < '2027-01-01'\nGROUP BY 1, 2\nORDER BY 1, 2;",
        },
        {
          type: 'paragraph',
          text: 'Read the assumptions. Is the status really spelled `paid`, or `PAID`, or `completed`? Run `SELECT status, COUNT(*) FROM orders GROUP BY status;` and see.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "**SQL** is the language you use to ask a database questions. A **database** keeps information in **tables**, like spreadsheets: each **row** is one record (one order) and each **column** is one detail about it (branch, amount). Read the query like a sentence. `SELECT` says which columns you want back, `FROM orders` names the table, `WHERE` keeps only rows that pass a rule (paid orders from 2026), `GROUP BY` puts rows that share a month and branch into one group (`1, 2` means \"the first two columns I selected\"), `SUM(amount)` adds up each group, `COUNT(*)` counts its rows, and `ORDER BY` sorts the result. `AS revenue` just gives a column a friendlier name.",
        },
        { type: 'heading', text: 'Four mistakes to check every time' },
        {
          type: 'list',
          items: [
            '**Join fan-out:** joining orders to a table with several rows per order multiplies amounts. Compare `COUNT(*)` before and after the join.',
            '**Filters on a LEFT JOIN:** a `WHERE` condition on the right-hand table quietly turns it into an inner join and drops rows.',
            '**NULLs:** `COUNT(column)` skips NULLs, `COUNT(*)` does not; `SUM` ignores NULLs too.',
            '**Date ranges:** `BETWEEN \'2026-01-01\' AND \'2026-12-31\'` on a timestamp misses most of December 31. Use `>=` and `<` the next day.',
          ],
        },
        {
          type: 'table',
          headers: ['Mistake', 'What goes wrong', 'How to catch it'],
          rows: [
            [
              'Join fan-out',
              'A one-to-many join repeats each order, so its amount is counted several times',
              'Compare COUNT(*) before and after the join',
            ],
            [
              'Filter on a LEFT JOIN',
              'A WHERE condition on the right-hand table quietly turns it into an inner join and drops rows',
              'Look for rows that disappeared',
            ],
            [
              'NULLs',
              'COUNT(column) and SUM skip NULLs, COUNT(*) does not',
              'Know which one you are using',
            ],
            [
              'Date ranges',
              'BETWEEN on a timestamp misses most of December 31',
              'Use >= the start and < the next day',
            ],
          ],
          caption: 'Four mistakes to check every time.',
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-ai-data-02-sql-1',
            kind: 'sql-challenge',
            title: 'The missing December 31',
            prompt: 'Show each branch\'s revenue from **paid** orders created in 2026, as `branch` and `revenue`, sorted by `branch`. The starter query uses `BETWEEN` and misses the orders placed later on December 31. Fix its date range with `>=` and `<`. (This practice database is SQLite, so there is no `date_trunc`.)',
            concept: 'date ranges in sql',
            setup: 'CREATE TABLE orders (id INTEGER PRIMARY KEY, branch TEXT, status TEXT, amount INTEGER, created_at TEXT);\nINSERT INTO orders VALUES\n  (1, \'Cebu\', \'paid\', 1000, \'2026-03-05 10:00:00\'),\n  (2, \'Cebu\', \'paid\', 500, \'2026-12-31 15:30:00\'),\n  (3, \'Cebu\', \'refunded\', 700, \'2026-04-01 09:00:00\'),\n  (4, \'Naga\', \'paid\', 800, \'2026-06-10 12:00:00\'),\n  (5, \'Naga\', \'paid\', 300, \'2027-01-01 08:00:00\'),\n  (6, \'Naga\', \'pending\', 400, \'2026-07-07 07:00:00\'),\n  (7, \'Naga\', \'paid\', 200, \'2026-12-31 23:59:00\');',
            starter: 'SELECT branch, SUM(amount) AS revenue\nFROM orders\nWHERE status = \'paid\'\n  AND created_at BETWEEN \'2026-01-01\' AND \'2026-12-31\'\nGROUP BY branch\nORDER BY branch;',
            expected: {
              columns: ['branch', 'revenue'],
              rows: [
                ['Cebu', 1500],
                ['Naga', 1000],
              ],
              ordered: true,
            },
            solution: 'SELECT branch, SUM(amount) AS revenue\nFROM orders\nWHERE status = \'paid\'\n  AND created_at >= \'2026-01-01\'\n  AND created_at < \'2027-01-01\'\nGROUP BY branch\nORDER BY branch;',
            hints: [
              'Run the starter first and compare it with the orders on December 31 in the table.',
              '`BETWEEN \'2026-01-01\' AND \'2026-12-31\'` stops at the very start of December 31.',
              'Keep the rows that are `>= \'2026-01-01\'` and `< \'2027-01-01\'`: from the first day up to, but not including, the next year.',
            ],
            explanation: '`created_at < \'2027-01-01\'` includes every moment of December 31, while `BETWEEN` ending at \'2026-12-31\' stops at the start of that day. Using `>=` and `<` also leaves out the 2027 order.',
          },
        },
        {
          type: 'tip',
          text: 'Check one number by another route. If the query says ₱1.2M revenue for March, add up March in the source system or a spreadsheet export. If two routes agree, you can trust it more.',
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-ai-data-02-scenario-1',
            kind: 'scenario',
            title: 'Two numbers that do not match',
            prompt: 'What do you do before 3 PM?',
            concept: 'verifying query results',
            situation: 'An AI-written query says March revenue was ₱1.2M. The finance export says ₱1.05M. Your manager needs the number at 3 PM.',
            options: [
              {
                text: 'Look for the gap: check the status values, compare row counts before and after each join, check the date range and keep going until you can explain the difference.',
                consequence: 'You find the cause (for example a join that counted some orders twice) and give your manager a number you can defend.',
                quality: 'best',
              },
              {
                text: 'Send the finance figure and say you are still checking why the query differs.',
                consequence: 'Your manager gets a safe number and an honest note, but the query\'s mistake is still there for the next report.',
                quality: 'acceptable',
              },
              {
                text: 'Send ₱1.2M. The query ran without errors.',
                consequence: 'A query that runs can still be wrong. If it double-counts orders, a decision is made on a number that is too high.',
                quality: 'poor',
              },
              {
                text: 'Ask the AI whether its query is correct and send whatever it answers.',
                consequence: 'Asking the same tool is not an independent check. It may defend its own mistake, and you still do not know which number is right.',
                quality: 'poor',
              },
            ],
            hints: [
              'Two routes disagree, so at least one of them is wrong.',
              'Think of the four mistakes: fan-out, LEFT JOIN filters, NULLs and date ranges.',
              'Choose the option that finds out why the numbers differ.',
            ],
            explanation: 'A query that runs can still return the wrong number. Getting the same figure by another route, and explaining any difference, is how you earn the right to trust it.',
          },
        },
        {
          type: 'prompt',
          label: 'Ask AI to review its own query',
          text: 'Review this SQL for correctness, not style. Look for join fan-out, LEFT JOINs filtered in WHERE, NULL handling, date range edges and integer division. For each risk, give a small query I can run to test whether it is happening.\n\n[paste query]',
        },
        {
          type: 'warning',
          text: 'Only run AI-written queries that change data (UPDATE, DELETE) on a copy, after reading them. Reading queries first is a good default for any new analyst.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **join** glues two tables together using a column they share, like matching each receipt to its list of items. If one order has three items, gluing makes three rows for that order, and its amount appears three times. Adding them up counts the money three times. That is fan-out. For example, one ₱1,000 order with three items becomes three rows of ₱1,000, and `SUM` reports ₱3,000 for an order that paid ₱1,000.",
        },
        {
          type: "paragraph",
          audience: { min: "intermediate", max: "intermediate" },
          text: "When you move from a playground to a real project, queries run from code. Never build SQL text by pasting user input into it. Pass values as parameters, so the database treats them as data and not as commands, and check your database driver's documentation for its parameter marker. Then test the function on a tiny table with a known answer, as below, including an empty result and a hostile input. The same habit makes AI-written query code safer to accept: ask for parameters and for a test, then run both.",
        },
        {
          type: "code",
          audience: { min: "intermediate", max: "intermediate" },
          language: "python",
          label: "revenue_test.py",
          code: "import sqlite3\ncon = sqlite3.connect(\":memory:\")\ncon.executescript(\"\"\"\nCREATE TABLE orders (id INTEGER PRIMARY KEY, branch TEXT, status TEXT, amount INTEGER, created_at TEXT);\nINSERT INTO orders VALUES (1,'Cebu','paid',1000,'2026-03-05 10:00:00'),(2,'Cebu','paid',500,'2026-12-31 15:30:00'),\n (3,'Cebu','refunded',700,'2026-04-01 09:00:00'),(4,'Naga','paid',800,'2026-06-10 12:00:00'),(5,'Naga','paid',300,'2027-01-01 08:00:00');\n\"\"\")\ndef revenue(con, branch, start, end):\n    row = con.execute(\n        \"SELECT COALESCE(SUM(amount), 0) FROM orders WHERE status = 'paid' AND branch = ? AND created_at >= ? AND created_at < ?\",\n        (branch, start, end),\n    ).fetchone()\n    return row[0]\nassert revenue(con, \"Cebu\", \"2026-01-01\", \"2027-01-01\") == 1500\nassert revenue(con, \"Naga\", \"2026-01-01\", \"2027-01-01\") == 800\nassert revenue(con, \"Nowhere\", \"2026-01-01\", \"2027-01-01\") == 0\nassert revenue(con, \"Cebu'; DROP TABLE orders; --\", \"2026-01-01\", \"2027-01-01\") == 0\nprint(con.execute(\"SELECT COUNT(*) FROM orders\").fetchone()[0], \"rows still there\")\nprint(\"all checks passed\")",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "An analyst's query touches shared infrastructure, so review it like code. Run `EXPLAIN` to read the plan, but remember that `EXPLAIN ANALYZE` really executes the statement, so wrap anything that modifies data in a transaction you roll back. When an AI tool or agent is connected to a database, grant it a dedicated role with `SELECT` on only the tables it needs, set a `statement_timeout` for that role, and point it at a replica or sandbox where you can. `default_transaction_read_only` is only a default that a session can change, so missing privileges are the real control. Log each generated query with who asked and what it returned.",
        },
        {
          type: "code",
          audience: { min: "advanced" },
          language: "sql",
          label: "A read-only role for an AI tool",
          code: "CREATE ROLE ai_reader LOGIN;\nGRANT SELECT ON orders, customers TO ai_reader;\nALTER ROLE ai_reader SET statement_timeout = '15s';\nALTER ROLE ai_reader SET default_transaction_read_only = on;\n-- ALTER ROLE ... SET applies at the role's next login, not to sessions already open.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "PostgreSQL 18 documentation: GRANT can give a role SELECT on named tables; ALTER ROLE ... SET gives a role a session default that takes effect only at login; statement_timeout aborts any statement that runs longer than the set time (0 disables it); default_transaction_read_only sets the default read-only state of new transactions; and with the ANALYZE option, EXPLAIN actually executes the statement. Other databases have their own equivalents, so check yours.",
          checked: CHECKED,
          sources: [
            SRC.pgGrant,
            SRC.pgAlterRole,
            SRC.pgClientConfig,
            SRC.pgExplain,
          ],
        },
        {
          type: 'takeaways',
          items: [
            'AI-written SQL usually runs, and a query that runs can still return the wrong number.',
            'Tell the AI which database you use and paste the table definitions (never the data).',
            'Check four mistakes every time: join fan-out, filters on a LEFT JOIN, NULLs and date ranges.',
            'Use `>=` the start and `<` the next day for timestamp ranges, not `BETWEEN`.',
            'Check one number by another route, such as a spreadsheet total, and run data-changing queries only on a copy.',
          ],
        },
      ],
      quiz: [
        {
          id: 'mini-ai-data-02-q1',
          prompt: 'Why should you tell the AI which database you use?',
          choices: [
            'Date functions and some syntax differ between databases',
            'AI tools can only write PostgreSQL',
            'It makes the query faster',
          ],
          answer: 0,
          explanation: 'A query written for PostgreSQL may fail or behave differently in MySQL, SQLite or BigQuery.',
        },
        {
          id: 'mini-ai-data-02-q2',
          prompt: 'Revenue doubles after you join orders to an order_items table. What is the likely cause?',
          choices: [
            'The orders table has duplicates',
            'Join fan-out: each order now appears once per item, so its amount is counted several times',
            'SUM is broken in your database',
          ],
          answer: 1,
          explanation: 'A one-to-many join repeats the order row. Compare row counts before and after the join to catch it.',
        },
        {
          id: 'mini-ai-data-02-q3',
          prompt: "Why is `created_at < '2027-01-01'` safer than `BETWEEN '2026-01-01' AND '2026-12-31'` on a timestamp?",
          choices: [
            'BETWEEN is not valid SQL',
            'It is shorter',
            "BETWEEN stops at midnight on December 31, missing most of that day",
          ],
          answer: 2,
          explanation: "'2026-12-31' means the very start of that day, so later times that day are excluded.",
        },
        {
          id: 'mini-ai-data-02-q4',
          prompt: 'What is a good way to check an AI-written query\'s result?',
          choices: [
            'Ask the AI if it is correct and trust the answer',
            'Get the same number by another route, such as a spreadsheet total, and compare',
            'Run it twice',
          ],
          answer: 1,
          explanation: 'An independent route catches logic errors that rerunning the same query never will.',
        },
        {
          id: "mini-ai-data-02-q5",
          audience: { max: "beginner" },
          prompt: "In a query, what does `WHERE status = 'paid'` do?",
          choices: [
            "Keeps only the rows whose status is paid",
            "Adds up all the paid amounts",
            "Sorts the rows by status",
            "Joins the table to another table",
          ],
          answer: 0,
          explanation: "`WHERE` filters rows before anything is added up. Adding is done by `SUM`, sorting by `ORDER BY` and gluing tables by a join.",
        },
        {
          id: "mini-ai-data-02-q6",
          audience: { min: "advanced" },
          prompt: "A team lets an AI agent write and run SQL against the production database through one shared login. What is the best first change?",
          choices: [
            "Tell the agent in its instructions never to run DELETE",
            "Give the agent its own role with SELECT on only the tables it needs and a statement timeout",
            "Ask the agent to explain every query after it runs",
            "Run each query twice and compare the results",
          ],
          answer: 1,
          explanation: "Instructions can be ignored or overridden, so enforce limits where the database can: a dedicated, least-privilege role and a timeout. Explaining or repeating a query does not stop a harmful one.",
        },
      ],
      task: {
        title: 'Write and verify one query',
        steps: [
          'Open a free online SQL playground or a sample database (many tutorials include one), or use SQLite on your laptop.',
          'Ask a business question in plain English with the "Question to SQL" prompt, naming your database.',
          'Run the query, then run the "review its own query" prompt and at least one of the test queries it suggests.',
          'Write one sentence: do you trust the number, and why?',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Pick one line of the \"likely answer\" query and ask the AI to explain it with a shop example. Then change `branch` to another column from the table definition and ask what the result would show.",
            "Draw a small orders table and a small items table on paper and join them by hand to see the fan-out for one order.",
          ],
        },
        {
          audience: { min: "intermediate", max: "intermediate" },
          steps: [
            "Run the query from Python with parameters (branch and date range) instead of text pasted into the SQL, then write the three checks from the lesson: a known total, an empty result, and a hostile input.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "On a throwaway database, create the read-only role from the lesson, connect as it and confirm that a SELECT works while DELETE and CREATE TABLE are refused. Run `EXPLAIN` on your query and note which part of the plan is the most expensive.",
          ],
        },
      ],
    },
    {
      id: 'mini-ai-data-03',
      day: 3,
      title: 'Charts and explaining insights',
      summary: 'Pick the right chart, make it readable, and say what it means in plain words.',
      intro: {
        objectives: [
          'Choose a chart from the question: line, sorted bar, stacked bar or scatter plot',
          'Make a chart readable with a title, labelled axes, units and a bar axis that starts at zero',
          'Calculate a percent change as (new - old) / old',
          'Write an insight that keeps what the data shows apart from guesses about why',
        ],
        why: 'Managers act on a clear sentence and a readable chart, not on a table of numbers. Doing both well is what turns analysis into decisions.',
      },
      minutes: 15,
      skills: ['charts-insights'],
      body: [
        {
          type: 'paragraph',
          text: 'A table of numbers is not an insight. An insight is a short sentence a busy person can act on: "Online orders grew every month since January, while walk-in sales in Cebu fell 15% in March." Charts help you find that sentence and help others believe it.',
        },
        { type: 'heading', text: 'Choose the chart from the question' },
        {
          type: 'list',
          items: [
            '**Change over time:** a line chart (or columns for a few periods).',
            '**Compare categories:** a bar chart, sorted from largest to smallest.',
            '**Part of a whole:** a stacked bar; avoid pie charts with many slices.',
            '**Relationship between two numbers:** a scatter plot.',
          ],
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-ai-data-03-match-1',
            kind: 'match',
            title: 'Pick the chart',
            prompt: 'Four people ask you a question about the business. Match each question with the chart that answers it best.',
            concept: 'choosing charts',
            labels: { terms: 'What someone asks you', meanings: 'Chart to make' },
            pairs: [
              {
                term: 'Your manager wants to see how GCash payments have grown week by week since June.',
                definition: 'A line chart',
                note: 'Week by week since June is change over time.',
              },
              {
                term: 'The regional head wants to know which of nine branches had the most returns last quarter.',
                definition: 'A bar chart sorted from largest to smallest',
                note: 'Comparing branches is comparing categories, and sorting shows the ranking.',
              },
              {
                term: 'Marketing asks how this year\'s sales split between walk-in, online shop and Facebook orders.',
                definition: 'A stacked bar',
                note: 'A split of one total is a part-of-a-whole question.',
              },
              {
                term: 'You wonder whether branches with more staff on shift also have shorter delivery times.',
                definition: 'A scatter plot',
                note: 'Two numbers that might move together.',
              },
            ],
            hints: [
              'First decide what each question is about: change over time, a comparison, parts of a whole, or a relationship.',
              '"Week by week since June" is change over time; "which of nine branches" is a comparison.',
              'A split of one total is parts of a whole; two numbers per branch that might move together need a scatter plot.',
            ],
            explanation: 'Growth since June is change over time (line), nine branches is a comparison (sorted bar), the channel split is part of a whole (stacked bar), and staff against delivery time is a relationship between two numbers (scatter plot).',
          },
        },
        {
          type: 'paragraph',
          text: 'You can ask AI to suggest a chart and write the code. Here is a simple matplotlib example that reads yesterday\'s clean file:',
        },
        {
          type: 'code',
          language: 'python',
          label: 'monthly_chart.py',
          code: 'import pandas as pd\nimport matplotlib.pyplot as plt\n\ndf = pd.read_csv("sales_clean.csv", parse_dates=["date"])\nmonthly = df.groupby(df["date"].dt.to_period("M"))["amount"].sum()\n\nax = monthly.plot(kind="bar", color="#2a7f62")\nax.set_title("Monthly sales (PHP)")\nax.set_xlabel("Month")\nax.set_ylabel("Sales in pesos")\nplt.xticks(rotation=0)\nplt.tight_layout()\nplt.savefig("monthly_sales.png", dpi=150)\nprint(monthly)',
        },
        {
          type: 'paragraph',
          text: 'Notice the title, axis labels and units. A chart without units makes people guess. Start bar charts at zero; a bar axis that starts at ₱90,000 makes a small change look huge.',
        },
        {
          type: 'paragraph',
          text: 'Keep one message per chart. If you need to show sales by month and by branch, make two simple charts rather than one crowded chart with twelve colours. Your reader should get the point in five seconds.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Here is the chart script in plain words. **matplotlib** is a Python library that draws charts. `pd.read_csv` loads the cleaned table. `groupby(...).sum()` puts the rows into groups (one per month) and adds up each group's amounts, so `monthly` holds one total per month. `plot(kind=\"bar\")` draws one bar per month. The **x axis** is the line along the bottom (months) and the **y axis** is the line up the side (pesos). `set_title`, `set_xlabel` and `set_ylabel` write the title and the labels on the two axes, and `savefig` saves the picture as a file you can paste into a report. `print(monthly)` also shows the numbers, so you can check the picture against them.",
        },
        { type: 'heading', text: 'From chart to sentence' },
        {
          type: 'prompt',
          label: 'Draft insights from a summary',
          text: 'Here is a summary table from my analysis (monthly sales in pesos by branch):\n[paste the small summary table, not raw data]\n\nWrite 3 insights for a branch manager. Each one: one sentence with the number, then one sentence on what they might do about it. Only use numbers from the table. If something needs more data to explain (for example, why sales fell), say so instead of guessing a cause.',
        },
        {
          type: 'paragraph',
          text: 'AI is good at turning a table into readable sentences. It is also good at inventing reasons. "Sales fell because of the rainy season" sounds smart, but unless you have weather data, it is a guess. Keep what the data shows separate from what might explain it.',
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-ai-data-03-scenario-1',
            kind: 'scenario',
            title: 'Which insight do you send?',
            prompt: 'Which sentence should go to the branch manager?',
            concept: 'writing insights',
            situation: 'Your summary table shows that walk-in sales in Cebu went from ₱80,000 in February to ₱68,000 in March. You have no weather, marketing or foot-traffic data. The AI offers four draft sentences.',
            options: [
              {
                text: 'Walk-in sales in Cebu fell 15% in March (₱80,000 to ₱68,000). The data cannot say why, so check what changed that month.',
                consequence: 'The number is right ((68,000 − 80,000) ÷ 80,000 = −15%), it comes from the table, and the cause is left as a question to check.',
                quality: 'best',
              },
              {
                text: 'Walk-in sales in Cebu fell in March.',
                consequence: 'It is true, but it has no number and nothing to act on.',
                quality: 'acceptable',
              },
              {
                text: 'Walk-in sales in Cebu fell 15% in March because of the rainy season.',
                consequence: 'The percentage is right, but the cause is a guess. Without weather data, it is a hypothesis presented as a finding.',
                quality: 'poor',
              },
              {
                text: 'Walk-in sales in Cebu collapsed by 85% in March.',
                consequence: 'The percent change was worked out against the wrong value. The real drop is 15%, so the manager would panic over a wrong number.',
                quality: 'poor',
              },
            ],
            hints: [
              'Recalculate the percent change yourself: (new − old) ÷ old.',
              'Which sentences state a cause that the table cannot show?',
              'A good insight has a checked number and keeps what the data shows apart from what might explain it.',
            ],
            explanation: 'An insight is a short sentence with a checked number that someone can act on. Recalculate every percentage, and keep what the data shows separate from guesses about why.',
          },
        },
        {
          type: 'tip',
          text: 'Recalculate every number the AI writes in an insight. Percent changes are the most common slip: (new − old) ÷ old, not ÷ new.',
        },
        {
          type: 'warning',
          text: 'Correlation is not cause. Two lines moving together is a reason to ask a question, not a conclusion.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Percent change tells you how much something grew or shrank compared with where it started. Take the new number minus the old number, divide by the old number, then multiply by 100. From ₱80,000 to ₱68,000: 68,000 − 80,000 = −12,000, and −12,000 ÷ 80,000 = −0.15, which is −15%. The minus sign means it fell. The common slip is dividing by the new number: 12,000 ÷ 68,000 is about 17.6%, a different answer for the same drop. Always divide by the number you started from.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "A chart is evidence, so ask what could make it mislead. Compare rates, not counts, when the groups differ in size. Compare like with like: a December against a November hides seasonality, while December against last December does not. Beware mix effects: if the share of sales shifts between groups, an overall average can move opposite to every group. For example, branch A's average order rose from ₱200 to ₱210 and branch B's from ₱50 to ₱55, yet if A sold 80 orders then 40 while B sold 20 then 60, the company-wide average fell from ₱170 to ₱117. Report both and explain the mix. Make charts accessible too: colour must not be the only cue, and lines and bars should contrast with their background.",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "WCAG 2.2 success criterion 1.4.1 (Level A) says colour must not be the only visual means of conveying information. Success criterion 1.4.11 (Level AA) asks for at least 3:1 contrast for parts of graphics that are needed to understand the content, which the page applies to chart elements such as lines and slices. Both are web guidelines, so check which standard your organisation follows.",
          checked: CHECKED,
          sources: [
            SRC.wcagColor,
            SRC.wcagContrast,
          ],
        },
        {
          type: 'takeaways',
          items: [
            'An insight is a short sentence a busy person can act on, not a table of numbers.',
            'Choose the chart from the question: lines for change over time, sorted bars to compare, stacked bars for parts of a whole, scatter plots for relationships.',
            'Add a title, axis labels and units, start bar charts at zero and keep one message per chart.',
            'AI is good at turning a table into sentences and also at inventing reasons: keep what the data shows apart from what might explain it.',
            'Recalculate every number the AI writes. Percent change is (new − old) ÷ old.',
          ],
        },
      ],
      quiz: [
        {
          id: 'mini-ai-data-03-q1',
          prompt: 'You want to show how sales changed over 12 months. Which chart fits best?',
          choices: ['A pie chart', 'A line chart', 'A scatter plot'],
          answer: 1,
          explanation: 'Line charts show change over time clearly. Pies show parts of a whole at one moment.',
        },
        {
          id: 'mini-ai-data-03-q2',
          prompt: 'Sales went from ₱80,000 to ₱100,000. What is the percent change?',
          choices: ['20%', '25%', '80%', '125%'],
          answer: 1,
          explanation: '(100,000 − 80,000) ÷ 80,000 = 0.25, so 25%. Dividing by the new value would wrongly give 20%.',
        },
        {
          id: 'mini-ai-data-03-q3',
          prompt: 'The AI writes "sales fell because of the rainy season", but you have no weather data. What should you do?',
          choices: [
            'Keep it, it sounds reasonable',
            'Present it as a question to check, not a finding',
            'Add a weather chart from memory',
          ],
          answer: 1,
          explanation: 'Without data, a cause is a hypothesis. Say so, or find data that tests it.',
        },
        {
          id: 'mini-ai-data-03-q4',
          prompt: 'Why should a bar chart\'s axis usually start at zero?',
          choices: [
            'Bar length is read as the size of the value, so a cut axis exaggerates differences',
            'Matplotlib requires it',
            'It saves space on the page',
          ],
          answer: 0,
          explanation: 'People compare bar lengths. Starting the axis higher makes small differences look large.',
        },
        {
          id: "mini-ai-data-03-q5",
          audience: { max: "beginner" },
          prompt: "Sales fell from ₱80,000 to ₱68,000. What does the result −15% tell you?",
          choices: [
            "The new value is 15 times bigger",
            "The calculation has a mistake",
            "The data is missing",
            "The new value is lower than the old one",
          ],
          answer: 3,
          explanation: "A minus sign means a fall. 15% of the starting ₱80,000 is ₱12,000, and 80,000 − 12,000 = 68,000.",
        },
        {
          id: "mini-ai-data-03-q6",
          audience: { min: "advanced" },
          prompt: "Average order value rose in every branch from January to February, but the company-wide average fell. What should your report do?",
          choices: [
            "Treat it as a calculation error and recompute with another formula",
            "Drop the smaller branch so the numbers agree",
            "Show both figures and explain that the mix of orders shifted toward a lower-value branch",
            "Report only the company-wide figure, since it is the total",
          ],
          answer: 2,
          explanation: "A weighted average moves with the mix as well as with each group. Showing both numbers and the reason is accurate, while dropping data or hiding one figure misleads.",
        },
      ],
      task: {
        title: 'One chart, three insights',
        steps: [
          'Make one chart from your cleaned data (or any small public dataset) with a title, axis labels and units.',
          'Build a small summary table (10 rows or fewer) from the same data.',
          'Run the "Draft insights" prompt with the summary table.',
          'Recalculate every number in the insights and rewrite any sentence that guesses a cause.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Invent two more pairs of numbers (one rise and one fall) and work out each percent change on paper, writing the three steps. Then ask the AI to check your working step by step.",
            "Ask the AI to explain `groupby(...).sum()` using a shop example, then check it against your own chart.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "View your chart in grayscale (or a colour-blindness simulator) and make sure every series can still be told apart by labels, markers or line styles.",
            "Build a small table where an overall average moves the opposite way to every group, and write the two sentences that explain it to a manager.",
          ],
        },
      ],
    },
    {
      id: 'mini-ai-data-04',
      day: 4,
      title: 'Automating reports',
      summary: 'Turn the weekly copy-paste report into a script you run in one command.',
      intro: {
        objectives: [
          'Write your manual report steps down before asking AI for a script',
          'Test a report script on last week\'s data, where you already know the answer',
          'Handle a branch with zero sales last week, which gives inf in pandas',
          'Decide when to schedule a script and keep a human check before anything is sent',
        ],
        why: 'Weekly reports eat hours that a script can give back, and many analyst jobs include one. An automated report only helps if you can trust it, so testing and a human check come first.',
      },
      minutes: 15,
      skills: ['report-automation', 'data-cleaning'],
      body: [
        {
          type: 'paragraph',
          text: 'Many analyst jobs include a report that comes back every week: download the export, clean it, make the same pivot, paste the same chart, email it. If you do the same steps every Monday, a script can do them in seconds, and it makes the same choices every time.',
        },
        { type: 'heading', text: 'Write the steps down first' },
        {
          type: 'paragraph',
          text: 'Before asking AI for code, list your manual steps exactly as you do them. The list becomes your prompt, and later your documentation.',
        },
        {
          type: 'prompt',
          label: 'Manual steps to script',
          text: 'I do this report every Monday by hand:\n1. Download last week\'s sales CSV (columns: date, branch, amount).\n2. Clean amounts (remove ₱ and commas).\n3. Total sales per branch for the week, sorted high to low.\n4. Compare with the previous week\'s totals file.\n5. Write a short summary for my manager.\n\nWrite a Python script with pandas that does steps 2–5. Inputs: this_week.csv and last_week.csv. Output: a text file named with today\'s date. Use only pandas and the standard library. Add comments explaining each step.',
        },
        {
          type: 'code',
          language: 'python',
          label: 'weekly_report.py',
          code: 'from datetime import date\nimport pandas as pd\n\n\ndef load(path):\n    df = pd.read_csv(path)\n    text = (\n        df["amount"].astype(str)\n        .str.replace("₱", "", regex=False)\n        .str.replace(",", "", regex=False)\n    )\n    df["amount"] = pd.to_numeric(text, errors="coerce")\n    return df.groupby("branch")["amount"].sum()\n\n\nthis_week = load("this_week.csv")\nlast_week = load("last_week.csv")\n\nreport = pd.DataFrame({"this_week": this_week, "last_week": last_week}).fillna(0)\nreport["change_pct"] = (\n    (report["this_week"] - report["last_week"]) / report["last_week"] * 100\n).round(1)\nreport = report.sort_values("this_week", ascending=False)\n\nlines = [f"Weekly sales report, {date.today():%B %d, %Y}", ""]\nfor branch, row in report.iterrows():\n    lines.append(\n        f"{branch}: PHP {row[\'this_week\']:,.2f} ({row[\'change_pct\']:+.1f}% vs last week)"\n    )\nlines.append("")\nlines.append(f"Total: PHP {report[\'this_week\'].sum():,.2f}")\n\nout = f"report_{date.today().isoformat()}.txt"\nwith open(out, "w", encoding="utf-8") as f:\n    f.write("\\n".join(lines))\nprint("Saved", out)',
        },
        {
          type: 'paragraph',
          text: 'Test it with last week\'s files, where you already know the right answer from your manual report. If the totals match, you can trust it for next week. One edge case to handle: a branch with zero sales last week gives a division by zero (pandas shows `inf`). Decide what the report should say then, and ask the AI to handle it.',
        },
        {
          type: 'diagram',
          format: 'json',
          source: {
            kind: 'flow',
            title: 'The weekly report, automated',
            summary: 'The script cleans and totals this week\'s and last week\'s sales per branch, compares the two weeks, sorts the branches, and writes a dated text report. A person checks the report before anything is sent.',
            direction: 'TD',
            nodes: [
              { id: 'files', label: 'this_week.csv and last_week.csv', shape: 'database' },
              { id: 'clean', label: 'Clean the amounts (remove ₱ and commas)' },
              { id: 'total', label: 'Total sales per branch' },
              {
                id: 'compare',
                label: 'Compare with last week',
                note: 'A branch with zero sales last week divides by zero and shows inf. Decide what the report should say.',
              },
              { id: 'sort', label: 'Sort high to low' },
              { id: 'write', label: 'Write report_<date>.txt' },
              {
                id: 'check',
                label: 'You read it before it is sent',
                shape: 'rounded',
                note: 'An automated report that is wrong every week does more damage than a slow manual one.',
              },
            ],
            edges: [
              { from: 'files', to: 'clean' },
              { from: 'clean', to: 'total' },
              { from: 'total', to: 'compare' },
              { from: 'compare', to: 'sort' },
              { from: 'sort', to: 'write' },
              { from: 'write', to: 'check' },
            ],
          },
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-ai-data-04-python-1',
            kind: 'predict-output',
            title: 'The branch with no sales last week',
            prompt: 'This is the percent-change step of the report, on two branches. What does it print? (Python code here is judged against the stored answer, not run.)',
            concept: 'edge cases in reports',
            language: 'python',
            code: 'import pandas as pd\n\nreport = pd.DataFrame(\n    {"this_week": [500.0, 300.0], "last_week": [400.0, 0.0]},\n    index=["Cebu", "Naga"],\n)\nreport["change_pct"] = (\n    (report["this_week"] - report["last_week"]) / report["last_week"] * 100\n).round(1)\nprint(report["change_pct"].tolist())',
            expected: '[25.0, inf]',
            choices: ['[25.0, inf]', '[25.0, 0.0]', '[25.0, nan]', 'ZeroDivisionError: division by zero'],
            wrongNotes: {
              '[25.0, 0.0]': 'Nothing turns the division into zero. Dividing 300 by 0 gives an infinite value.',
              '[25.0, nan]': 'NaN would mean 0 divided by 0. Here the top is 300, so the result is infinite.',
              'ZeroDivisionError: division by zero': 'Plain Python would raise that error. In pandas, dividing by zero gives `inf` instead, so the bad value slips quietly into the report.',
            },
            hints: [
              'Cebu: (500 − 400) ÷ 400 × 100.',
              'Naga had 0 last week, so the script divides 300 by 0.',
              'The lesson says what pandas shows for a branch with zero sales last week.',
            ],
            explanation: 'Cebu grew 25%. For Naga, dividing by zero gives `inf` in pandas instead of an error, so you must decide what the report should say for a branch that had no sales last week.',
          },
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Here is the report script in plain words. A **script** is a file of instructions the computer follows from top to bottom. `def load(path):` defines a **function**, a named recipe you can reuse: it opens a file, cleans the amounts and adds them up per branch. The script uses it twice, once for each week. `fillna(0)` replaces empty cells with zero. The change column is the formula from Day 3: new minus old, divided by old, times 100. The `f\"...\"` lines are **f-strings**: text where the parts in curly braces are filled in with real values. Finally `open(out, \"w\")` creates the report file and `write` puts the lines into it.",
        },
        { type: 'heading', text: 'Running it on a schedule' },
        {
          type: 'list',
          items: [
            'Start manual: run `python3 weekly_report.py` yourself each Monday and read the output.',
            'Once it is stable, a scheduler (Task Scheduler on Windows, cron on Mac or Linux) can run it.',
            'If your team lives in Google Sheets, Apps Script or a no-code automation tool can do similar jobs.',
          ],
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-ai-data-04-scenario-1',
            kind: 'scenario',
            title: 'When do you schedule it?',
            prompt: 'What is the best plan for this script?',
            concept: 'automating reports',
            situation: 'Your `weekly_report.py` gives the same totals as your manual report for last week. Your manager says: "Great, have it email me every Monday at 7 AM starting now."',
            options: [
              {
                text: 'Run it by hand for the next few Mondays and read the output. Once it is stable, schedule it, and keep a human check before anything is sent.',
                consequence: 'You catch surprises (a zero-sales branch, a renamed column) while a person is still in the loop, and you automate with confidence.',
                quality: 'best',
              },
              {
                text: 'Schedule it now, but send the email only to yourself for a few weeks.',
                consequence: 'The manager is protected from a bad report, but you are relying on yourself to open and check each email, and you have scheduled something before knowing it is stable.',
                quality: 'acceptable',
              },
              {
                text: 'Schedule it to email your manager every Monday at 7 AM, as asked.',
                consequence: 'The first week with a zero-sales branch or a renamed column sends a wrong report to your manager, and nobody checked it.',
                quality: 'poor',
              },
              {
                text: 'Schedule it and stop doing the manual report altogether.',
                consequence: 'If the script breaks, you no longer have your own figures to notice it. A report that is wrong every week does more damage than a slow manual one.',
                quality: 'poor',
              },
            ],
            hints: [
              'Passing one test on last week\'s data does not prove it is stable.',
              'The lesson says to start manual, then use a scheduler once it is stable.',
              'Keep a human check before anything is sent.',
            ],
            explanation: 'Start manual, read the output, schedule only once it is stable and keep a human check before anything is sent. An automated report that is wrong every week does more damage than a slow manual one.',
          },
        },
        {
          type: 'tip',
          text: 'Keep a human check before anything is sent. An automated report that is wrong every week does more damage than a slow manual one.',
        },
        {
          type: 'warning',
          text: 'Do not put database passwords or API keys in the script. Read them from environment variables, and never commit them to GitHub.',
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "A **scheduler** is a program that starts other programs at set times, such as \"every Monday at 7 AM\". One built-in scheduler on Mac and Linux is called cron, and on Windows it is Task Scheduler. A schedule on your own laptop can only run while the laptop is on, which is one reason teams move reports to a computer that is always on. A **secret** such as a password lives in an **environment variable**, a named setting kept outside your code, so the script reads it but never contains it. Start by running the script yourself, read the output, and only schedule it when it behaves.",
        },
        {
          type: "paragraph",
          audience: { min: "intermediate", max: "intermediate" },
          text: "At your stage the jump is from \"it ran once\" to \"it can be trusted every week\". Put the cleaning and totalling in a function that takes a file path, so you can test it with a tiny file whose answer you know, and keep that test next to the script. Add a test for the awkward case from the lesson, a branch with zero sales last week. Each time you change the script, or ask an AI tool to change it, run the tests first. If the tests pass but the report looks odd, add a test that captures what you noticed. This is how a script becomes a small, dependable tool.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "An unattended report needs the discipline of a service. Validate before you publish, and refuse to write the report if a check fails (empty input, an unknown branch, a total that differs from the source system). Make each run idempotent: the same inputs produce the same file, written to a dated name, so a re-run never doubles anything. Log what ran, the row counts and the outcome. Alert on failure and on silence, since a job that never starts raises no error. Keep secrets in the platform's secret store and prefer short-lived credentials. If a coding agent writes the pipeline, keep the validation rules and acceptance tests as your own spec, and review its diff against them.",
        },
        {
          type: "code",
          audience: { min: "advanced" },
          language: "python",
          label: "validate_report.py",
          code: "import pandas as pd\n\ndef validate_report(this_week, last_week, totals_from_source):\n    problems = []\n    if this_week.empty:\n        problems.append(\"this week's file has no rows\")\n    if set(this_week.index) - set(last_week.index):\n        problems.append(f\"new branches: {sorted(set(this_week.index) - set(last_week.index))}\")\n    drift = abs(this_week.sum() - totals_from_source)\n    if drift > 0.01:\n        problems.append(f\"total {this_week.sum():,.2f} differs from source total {totals_from_source:,.2f}\")\n    return problems",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "GitHub Docs, scheduled workflows: the schedule event uses POSIX cron syntax in UTC by default, the shortest interval is once every 5 minutes, runs can be delayed during periods of high load (scheduling at an off-peak minute of the hour helps), and in a public repository scheduled workflows are automatically disabled when there has been no repository activity for 60 days. GitHub Actions secrets are read through the secrets context, are redacted from logs, and are not passed to workflows triggered from forks (except GITHUB_TOKEN). GitHub recommends OpenID Connect to avoid storing long-lived credentials as secrets.",
          checked: CHECKED,
          sources: [
            SRC.ghSchedule,
            SRC.ghSecrets,
          ],
        },
        {
          type: 'takeaways',
          items: [
            'If you do the same report every week, a script makes the same choices in seconds.',
            'Write your manual steps down first: the list becomes your prompt and your documentation.',
            'Test the script on last week\'s files, where you already know the right answer.',
            'Handle edge cases such as a branch with zero sales last week (division by zero shows `inf`).',
            'Start manual, schedule once stable, keep a human check before sending, and keep passwords in environment variables.',
          ],
        },
      ],
      quiz: [
        {
          id: 'mini-ai-data-04-q1',
          prompt: 'What is the best first test for a new report script?',
          choices: [
            'Run it on last week\'s data, where you already know the right totals',
            'Send its output straight to your manager',
            'Ask the AI if the code is correct',
          ],
          answer: 0,
          explanation: 'Comparing with a result you already trust is the quickest way to find mistakes.',
        },
        {
          id: 'mini-ai-data-04-q2',
          prompt: 'A branch had ₱0 sales last week. What happens to its percent change in the script?',
          choices: [
            'It shows 0%',
            'The script skips the branch',
            'It divides by zero and shows inf, which you need to handle',
          ],
          answer: 2,
          explanation: 'Dividing by zero gives an infinite value in pandas. Decide what the report should say and handle it.',
        },
        {
          id: 'mini-ai-data-04-q3',
          prompt: 'Why write your manual steps down before asking for code?',
          choices: [
            'AI tools refuse vague prompts',
            'The list becomes a precise prompt and your documentation',
            'It is required by pandas',
          ],
          answer: 1,
          explanation: 'Exact steps give the AI less to guess and give your team a record of what the script does.',
        },
        {
          id: 'mini-ai-data-04-q4',
          prompt: 'Where should a database password for your script live?',
          choices: [
            'In an environment variable, not in the code',
            'At the top of the script, so it is easy to change',
            'In the report output',
          ],
          answer: 0,
          explanation: 'Secrets in code get copied, shared and committed. Environment variables keep them out of the file.',
        },
        {
          id: "mini-ai-data-04-q5",
          audience: { max: "beginner" },
          prompt: "What does it mean to run a script \"on a schedule\"?",
          choices: [
            "You open the file by hand each Monday",
            "The script reads your calendar to decide when to run",
            "A scheduler starts it automatically at set times",
            "The AI decides each week whether it should run",
          ],
          answer: 2,
          explanation: "A scheduler (cron, Task Scheduler or a cloud service) starts the script at times you set. Nothing in the script decides that by itself.",
        },
        {
          id: "mini-ai-data-04-q6",
          audience: { min: "advanced" },
          prompt: "A weekly report runs from a scheduled workflow in a public repository. After two quiet months the reports stop arriving and no error is raised. What is the most likely cause and the best fix?",
          choices: [
            "The cron syntax expired, so rewrite the schedule every quarter",
            "The workflow was disabled for 60 days without repository activity, so add a check that alerts when an expected report is missing",
            "Secrets are deleted after 60 days, so store them in the script",
            "Scheduled runs are only allowed once a month",
          ],
          answer: 1,
          explanation: "GitHub disables scheduled workflows in a public repository after 60 days without activity, and a job that never runs sends no failure alert. Alerting on a missing report catches silence of any cause.",
        },
      ],
      task: {
        title: 'Automate one small report',
        steps: [
          'Make two small CSVs (this_week.csv and last_week.csv) with date, branch and amount columns.',
          'Run `weekly_report.py` and open the text file it writes.',
          'Check one branch\'s total and percent change by hand.',
          'Set one branch to 0 sales in last_week.csv, run it again, and ask the AI to handle that case cleanly.',
        ],
        minutes: 20,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "Ask the AI to explain `weekly_report.py` one line at a time as if you have never programmed. Change one number in this_week.csv, predict how the report changes, then run it to check.",
          ],
        },
        {
          audience: { min: "intermediate", max: "intermediate" },
          steps: [
            "Write two tests for `load` with tiny CSV files: one normal week and one with a branch at zero. Run them before and after you ask an AI tool to change the script.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Add `validate_report` checks (empty input, an unknown branch, a total that differs from the source) and make the script stop without writing a file if any fail. Break an input on purpose to prove it, then add an alert for a missing report.",
          ],
        },
      ],
    },
    {
      id: 'mini-ai-data-05',
      day: 5,
      title: 'Privacy and accuracy',
      summary: 'Protect people in your data and make sure every number you publish is one you checked.',
      intro: {
        objectives: [
          'Share the least you need: column names, fake rows or aggregated totals',
          'Explain why pseudonymized data can still identify people and why the salt stays secret',
          'Apply sanity checks and a second route before you publish a number',
          'State limits and assumptions in a report',
        ],
        why: 'Leaking personal data or publishing a wrong number can end an analyst\'s credibility fast. These habits protect the people in your data and your own reputation.',
      },
      minutes: 15,
      skills: ['data-accuracy-privacy', 'sql-with-ai'],
      body: [
        {
          type: 'paragraph',
          text: 'Two things can end an analyst\'s credibility fast: leaking personal data and publishing a wrong number. AI tools make both easier to do by accident, so build habits that make them hard.',
        },
        { type: 'heading', text: 'Privacy: share the least you need' },
        {
          type: 'paragraph',
          text: 'Customer names, mobile numbers, addresses and account numbers are personal data. In the Philippines the Data Privacy Act applies, and your company has its own rules on which tools are approved. When in doubt, ask your data protection officer before you upload anything.',
        },
        {
          type: 'list',
          items: [
            'Most questions need only column names, types and a few fake rows, not the real file.',
            'Aggregate first: a table of totals per branch rarely identifies anyone.',
            'Drop columns you do not need for the analysis.',
            'Replace IDs with pseudonyms when you must keep rows linked.',
          ],
        },
        {
          type: 'code',
          language: 'python',
          label: 'pseudonymize.py',
          code: 'import hashlib\nimport os\n\nimport pandas as pd\n\nSALT = os.environ["HASH_SALT"]  # a long random secret, never in the code\n\n\ndef pseudonym(value):\n    raw = (SALT + str(value)).encode("utf-8")\n    return hashlib.sha256(raw).hexdigest()[:12]\n\n\ndf = pd.read_csv("customers.csv")\ndf["customer_id"] = df["customer_id"].map(pseudonym)\ndf = df.drop(columns=["name", "email", "mobile"])\ndf.to_csv("customers_safe.csv", index=False)',
        },
        {
          type: 'paragraph',
          text: 'The script replaces each `customer_id` with a short code made by hashing the id together with a **salt**, a long random secret added before hashing. The same id always gives the same code, so rows stay linked, but nobody can easily work backwards from the code to the id. If the salt were written in the code and the code leaked, someone could hash known ids themselves and match them to your codes. That is why the script reads it from an environment variable, and it also drops the name, email and mobile columns.',
        },
        {
          type: 'warning',
          text: 'Pseudonymized data can still identify people (a rare birthdate plus a small town can be enough). Treat it as personal data unless your data protection officer says otherwise.',
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-ai-data-05-scenario-1',
            kind: 'scenario',
            title: 'Paste the customer table?',
            prompt: 'What do you do?',
            concept: 'data privacy',
            situation: 'Your manager says: "Paste the full customer table (names, mobile numbers, branch, amounts) into the AI tool so it finds patterns fast." Nobody has told you whether this tool is approved for customer data.',
            options: [
              {
                text: 'Don\'t paste it. Aggregate first (for example totals per branch) or share only column names and a few fake rows, and ask your data protection officer which tools are approved.',
                consequence: 'You get your patterns without exposing anyone, and you find out the company\'s rules before an incident, not after.',
                quality: 'best',
              },
              {
                text: 'Drop the name and mobile columns and replace the customer ids with hashes, then paste it.',
                consequence: 'Much safer, but pseudonymized data can still identify people (a rare birthdate plus a small town can be enough), and you still have not checked the tool is approved.',
                quality: 'acceptable',
              },
              {
                text: 'Paste it. Your manager asked, so it is approved.',
                consequence: 'Customer names and mobile numbers are personal data covered by the Data Privacy Act, and an instruction to paste them does not make the tool approved.',
                quality: 'poor',
              },
              {
                text: 'Paste it into a personal free account so the company tool is not involved.',
                consequence: 'The data still leaves the company, now through a tool nobody approved or can control.',
                quality: 'poor',
              },
            ],
            hints: [
              'Which columns are personal data?',
              'The lesson\'s habits: share the least you need, aggregate first, drop columns you don\'t need.',
              'When in doubt, ask your data protection officer before you upload anything.',
            ],
            explanation: 'Most questions need only column names, types and a few fake rows, or aggregated totals. Even pseudonymized data can still identify people, and you should ask before uploading anything.',
          },
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Here is the privacy script in plain words. **Personal data** is any information that points to a real person, such as a name or a mobile number. A **hash** is a one-way scrambler: the same input always gives the same output, but you cannot easily turn the output back into the input. `os.environ[\"HASH_SALT\"]` reads the salt from an **environment variable**, a named setting stored outside the code. `pseudonym` joins the salt and the id, scrambles them with SHA-256 and keeps the first 12 characters as a code. `.map(pseudonym)` applies it to every customer id, and `.drop(columns=[...])` deletes the name, email and mobile columns. The result is a table where the rows still match each other but no longer show who the customers are.",
        },
        { type: 'heading', text: 'Accuracy: trust, but verify' },
        {
          type: 'paragraph',
          text: 'AI can misread a column, invent a statistic, or do arithmetic wrong in a sentence while the code itself is right. Some habits that catch most problems:',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Sanity checks:** row counts, totals and date ranges match the source.',
            '**Second route:** confirm key numbers with a different method (SQL vs spreadsheet).',
            '**Numbers from code only:** every number in your report comes from a query or script you ran, never from the AI\'s memory.',
            '**State your limits:** missing months, removed rows and assumptions go in the report.',
          ],
        },
        {
          type: 'prompt',
          label: 'Pre-publish check',
          text: 'Act as a careful reviewer of a data report. Here is my report text and the summary table it is based on:\n[paste report]\n[paste table]\n\nList every number in the report and say whether it matches the table. Flag any claim about causes that the table cannot support, any percent that looks miscalculated, and any missing caveat a reader would need.',
        },
        {
          type: 'tip',
          text: 'Write "AI-assisted" in your report\'s method notes if your employer, client or school expects you to disclose it.',
        },
        {
          type: 'activity',
          activity: {
            id: 'mini-ai-data-05-match-1',
            kind: 'match',
            title: 'Habits and what they protect',
            prompt: 'Match each habit with what it does for privacy or accuracy.',
            concept: 'accuracy and privacy habits',
            pairs: [
              {
                term: 'Aggregate first',
                definition: 'A table of totals per branch rarely identifies anyone',
                note: 'Totals hide the individual rows.',
              },
              {
                term: 'Drop columns you do not need',
                definition: 'Remove the name, email and mobile when the analysis does not need them',
                note: 'Data you do not share cannot leak.',
              },
              {
                term: 'Pseudonymize with a secret salt',
                definition: 'Replace ids with codes so rows stay linked without showing who they are',
                note: 'The salt must stay out of the code, or the mapping can be rebuilt.',
              },
              {
                term: 'Sanity checks',
                definition: 'Row counts, totals and date ranges match the source',
                note: 'They catch a column the AI misread.',
              },
              {
                term: 'Second route',
                definition: 'Confirm a key number with a different method, such as SQL against a spreadsheet',
                note: 'Two routes that agree are more trustworthy than one.',
              },
            ],
            hints: [
              'The first three are about privacy and the last two about accuracy.',
              'Pseudonymizing keeps rows linked, but swaps the real id for a code.',
              'A "second route" means getting the same number a different way.',
            ],
            explanation: 'For privacy: share the least you need, aggregate, drop columns and pseudonymize with a secret salt. For accuracy: sanity-check against the source and confirm key numbers by a second route.',
          },
        },
        {
          type: "paragraph",
          audience: { max: "beginner" },
          text: "Accuracy in plain words means checking your work against something you already trust. Say the source file has 1,200 rows and your cleaned file has 1,150: that is a gap of 50, so find out why before moving on. Say your total is ₱4.8M and the finance report says ₱4.9M: that ₱100,000 difference is a clue, not a rounding detail. Each check is the same habit: compare a number you produced with a number from a different route. Write down every check and its result. Then if someone asks \"how do you know this is right?\", you have an answer.",
        },
        {
          type: "paragraph",
          audience: { min: "advanced" },
          text: "Privacy engineering goes beyond dropping columns. Pseudonymised data is still personal data while it can be linked back, and a table of averages can identify people when a group is tiny, so apply a minimum group size and suppress or merge smaller cells before publishing. Treat the content of your data as untrusted input as well: a text field can carry instructions that an AI tool might follow (indirect prompt injection), so keep tools that read free text away from tools that can send or delete. Give each AI tool the least data and the least permission it needs, record which classes of data went to which approved account, and review the settings that decide whether your inputs may be retained or used for training. Check your privacy law and company policy rather than assuming a technique makes data anonymous.",
        },
        {
          type: "code",
          audience: { min: "advanced" },
          language: "python",
          label: "small_cells.py",
          code: "import pandas as pd\ndf = pd.DataFrame({\"city\":[\"Naga\"]*6+[\"Pili\"]*2+[\"Iriga\"]*5, \"amount\":[100]*13})\nMIN_GROUP = 5\nt = df.groupby(\"city\").agg(customers=(\"amount\",\"size\"), total=(\"amount\",\"sum\"))\nt.loc[t[\"customers\"] < MIN_GROUP, [\"customers\",\"total\"]] = pd.NA\nprint(t)",
        },
        {
          type: "version",
          audience: { min: "advanced" },
          text: "OWASP LLM01:2025 describes indirect prompt injection (instructions hidden in content a model reads) and says least privilege, human approval for high-risk actions and checking outputs with deterministic code reduce the impact without fully preventing it. LLM02:2025 lists sanitization, access controls and clear data policies against sensitive information disclosure, and LLM06:2025 recommends least-privilege credentials such as read-only database roles. NIST SP 800-122 gives guidance on deciding how much protection each instance of PII needs.",
          checked: CHECKED,
          sources: [
            SRC.owaspLlm01,
            SRC.owaspLlm02,
            SRC.owaspLlm06,
            SRC.nist80022,
          ],
        },
        {
          type: 'takeaways',
          items: [
            'Two things end an analyst\'s credibility fast: leaking personal data and publishing a wrong number.',
            'Share the least you need: column names, a few fake rows or aggregated totals, and drop columns you do not need.',
            'Pseudonymized data can still identify people, so treat it as personal data unless your data protection officer says otherwise.',
            'Every number in a report should come from a query or script you ran, never from the AI\'s memory.',
            'Sanity-check against the source, confirm key numbers by a second route and state your limits and assumptions.',
          ],
        },
      ],
      quiz: [
        {
          id: 'mini-ai-data-05-q1',
          prompt: 'Which is safest to paste into an AI tool when asking about an analysis?',
          choices: [
            'The full customer table',
            'A table of totals per branch',
            'A sample of real customers with their mobile numbers',
          ],
          answer: 1,
          explanation: 'Aggregated totals rarely identify anyone and are usually enough for the question.',
        },
        {
          id: 'mini-ai-data-05-q2',
          prompt: 'Why read the salt from an environment variable in the pseudonym script?',
          choices: [
            'Python cannot store long strings',
            'It makes hashing faster',
            'Anyone with the code and the salt could rebuild the mapping, so the salt must stay secret',
          ],
          answer: 2,
          explanation: 'If the salt leaks with the code, someone could hash known IDs and match them. Keep it out of the file.',
        },
        {
          id: 'mini-ai-data-05-q3',
          prompt: 'Is pseudonymized data always safe to share?',
          choices: [
            'No, combinations of remaining columns can still identify people',
            'Yes, hashing makes it anonymous',
            'Yes, if the file is a CSV',
          ],
          answer: 0,
          explanation: 'Rare combinations of details can point to one person. Treat it as personal data unless told otherwise.',
        },
        {
          id: 'mini-ai-data-05-q4',
          prompt: 'Where should the numbers in your published report come from?',
          choices: [
            'Whatever the AI says in its summary',
            'Queries or scripts you ran and checked',
            'Last year\'s report',
          ],
          answer: 1,
          explanation: 'Numbers you computed and verified are traceable. AI summaries can contain slips or invented figures.',
        },
        {
          id: "mini-ai-data-05-q5",
          audience: { max: "beginner" },
          prompt: "In the pseudonymize script, what is a hash?",
          choices: [
            "A copy of the file stored in the cloud",
            "A one-way scramble: the same input gives the same code, but the code cannot easily be turned back",
            "A password you type each time you run the script",
            "A column that holds the customer name",
          ],
          answer: 1,
          explanation: "The hash replaces the customer id with a code. The same id always gives the same code, so rows still match, and the original is hard to recover.",
        },
        {
          id: "mini-ai-data-05-q6",
          audience: { min: "advanced" },
          prompt: "A table of average spend per city is going into a public report, and one city has only two customers. What should you do before publishing?",
          choices: [
            "Publish it, since averages are not personal data",
            "Replace the city names with hashes",
            "Suppress or merge groups below a minimum size so a small group cannot reveal individuals",
            "Add the customers' mobile numbers so readers can verify the figure",
          ],
          answer: 2,
          explanation: "An average over two people can reveal their spending, and changing the label does not change the group. A minimum group size, with suppression or merging, protects them.",
        },
      ],
      task: {
        title: 'Make a safe copy and check a report',
        steps: [
          'Make a small fake customers.csv with customer_id, name, email, mobile and city.',
          'Set a salt (for example `export HASH_SALT="a-long-random-text"` on Mac or Linux) and run `pseudonymize.py`.',
          'Take the insights you wrote on Day 3 and run the "Pre-publish check" prompt with their summary table.',
          'Fix every mismatch it finds, after checking it yourself.',
        ],
        minutes: 15,
      },
      taskExtra: [
        {
          audience: { max: "beginner" },
          steps: [
            "List five columns from a made-up customer file and mark each one \"personal data\" or \"not personal data\". Ask the AI to check your list and explain any it disagrees with.",
            "Ask the AI to explain `pseudonymize.py` one line at a time, then say in your own words why the salt is kept out of the code.",
          ],
        },
        {
          audience: { min: "advanced" },
          steps: [
            "Add a minimum-group-size rule (for example 5) to a summary table and test it with a city that has two customers.",
            "Write a two-line team rule for what may be pasted into an AI tool and into which approved account, and what must never be shared.",
          ],
        },
      ],
    },
  ],
  projects: [
    {
      id: 'mini-ai-data-p1',
      title: 'Public dataset analysis with a short report',
      summary:
        'Pick a public dataset, clean it, answer three questions with charts, and write a one-page report a non-analyst can follow.',
      outcome: 'A shareable analysis that shows an employer you can clean, analyse, explain and check data.',
      unlockAfterDay: 5,
      steps: [
        {
          id: 'mini-ai-data-p1-s1',
          text: 'Choose a public dataset you find interesting, for example from Kaggle or a Philippine government open data portal such as the PSA\'s. Check its licence allows reuse.',
          link: 'https://www.kaggle.com/datasets',
        },
        {
          id: 'mini-ai-data-p1-s2',
          text: 'Write three questions a real person would care about (for example, which regions changed the most).',
        },
        {
          id: 'mini-ai-data-p1-s3',
          text: 'Clean the data in a notebook with counts after each step. Google Colab works in the browser.',
          link: 'https://colab.research.google.com',
        },
        {
          id: 'mini-ai-data-p1-s4',
          text: 'Answer each question with a chart that has a title, labels and units, and verify key numbers a second way.',
        },
        {
          id: 'mini-ai-data-p1-s5',
          text: 'Write a short report (one page): the questions, 3–5 insights with numbers, limits and assumptions, the data source, and how you used AI.',
        },
        {
          id: 'mini-ai-data-p1-s6',
          text: 'Share the notebook or document with a public view link.',
        },
        {
          id: "mini-ai-data-p1-s7",
          audience: { max: "beginner" },
          text: "Scaffold for newcomers: choose a small dataset (under 1,000 rows and a handful of columns), answer two questions instead of three, and ask your AI tool to explain each cleaning step and each chart in plain words. Under every chart write one sentence saying what a reader should notice.",
        },
        {
          id: "mini-ai-data-p1-s8",
          audience: { min: "intermediate", max: "intermediate" },
          text: "Load the cleaned data into a SQLite database and answer at least one question with a parameterised SQL query. Confirm its result with a second method (a pandas total or a spreadsheet) and note any difference.",
        },
        {
          id: "mini-ai-data-p1-s9",
          audience: { min: "advanced" },
          text: "Make the analysis reproducible and safe: keep the raw file untouched, add a validation function that stops the run when a rule breaks, classify columns as identifiers, quasi-identifiers or neither, and suppress or merge small groups before you publish.",
        },
        {
          id: "mini-ai-data-p1-s10",
          audience: { min: "professional" },
          text: "Run it as a reviewed workflow: write the questions and acceptance checks as a short spec first, have an AI assistant or agent produce the analysis code, then record in your report what your review caught (a wrong assumption, a miscalculated percent, a privacy gap) and which check found it.",
        },
      ],
      submission: {
        kind: 'url',
        label: 'Notebook or report URL',
        placeholder: 'https://colab.research.google.com/drive/…',
        hint: 'A public link to your notebook or document with the cleaning steps, charts, a one-page report, the dataset source and a note on how AI was used.',
      },
      rubric: [
        'The dataset source and licence are named',
        'Cleaning steps are shown with row counts, and nothing is dropped without explanation',
        'Each question has a readable chart with title, labels and units',
        'Insights use numbers that match the analysis and do not claim causes the data cannot show',
        'Limits, assumptions and AI use are stated',
      ],
      rubricExtra: [
        {
          audience: { max: "beginner" },
          items: [
            "The learner explains in their own words what each cleaning step does and how a percent change is calculated.",
          ],
        },
        {
          audience: { min: "intermediate", max: "intermediate" },
          items: [
            "At least one answer comes from a parameterised SQL query that is checked against a second method.",
          ],
        },
        {
          audience: { min: "advanced" },
          items: [
            "Validation checks stop the run when a rule breaks, and small groups are suppressed or merged before publishing.",
            "The raw data is unchanged and the analysis can be re-run from the raw file.",
          ],
        },
        {
          audience: { min: "professional" },
          items: [
            "Review evidence is recorded: what the AI-assisted analysis got wrong, which check caught it, and the acceptance checks used.",
          ],
        },
      ],
    },
  ],
  icon: 'query_stats',
  updated: '2026-11-13',
};
