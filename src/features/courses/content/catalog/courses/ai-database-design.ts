import type { Course, Lesson, Project, SourceLink } from '../../types';

/**
 * AI-Assisted Database Design. One running example, Aling Nena's bakery taking pre-orders for pandesal, so every lesson builds on the same
 * data. Everything shown was run while this course was written: the SQLite output (SQLite 3.54.0) and the Node.js snippet (Node 22) are
 * real, and the PostgreSQL output (query plans, row-level security, pg_dump and pg_restore) is real output from PostgreSQL 14.18 running
 * locally; the PostgreSQL documentation pages cited are the current ones (PostgreSQL 18), and every statement used here exists in both.
 * Every "example AI answer" is written for this course and labelled as such: it is not the output of a real model. Product statements live
 * in dated `version` notes.
 */

const CHECKED = '2026-11-14';

const DOCS = {
  sqliteWhen: { label: 'SQLite docs: Appropriate uses for SQLite', url: 'https://www.sqlite.org/whentouse.html' },
  sqliteFk: { label: 'SQLite docs: Foreign key support', url: 'https://www.sqlite.org/foreignkeys.html' },
  sqliteTypes: { label: 'SQLite docs: Datatypes in SQLite', url: 'https://www.sqlite.org/datatype3.html' },
  sqliteAlter: { label: 'SQLite docs: ALTER TABLE', url: 'https://www.sqlite.org/lang_altertable.html' },
  sqliteEqp: { label: 'SQLite docs: EXPLAIN QUERY PLAN', url: 'https://www.sqlite.org/eqp.html' },
  sqliteVacuum: { label: 'SQLite docs: VACUUM (VACUUM INTO)', url: 'https://www.sqlite.org/lang_vacuum.html' },
  sqliteBackup: { label: 'SQLite docs: Online Backup API', url: 'https://www.sqlite.org/backup.html' },
  pgConstraints: { label: 'PostgreSQL docs: Constraints', url: 'https://www.postgresql.org/docs/current/ddl-constraints.html' },
  pgRls: { label: 'PostgreSQL docs: Row security policies', url: 'https://www.postgresql.org/docs/current/ddl-rowsecurity.html' },
  pgExplain: { label: 'PostgreSQL docs: EXPLAIN', url: 'https://www.postgresql.org/docs/current/sql-explain.html' },
  pgDump: { label: 'PostgreSQL docs: pg_dump', url: 'https://www.postgresql.org/docs/current/app-pgdump.html' },
  pgBackup: { label: 'PostgreSQL docs: Backup and restore', url: 'https://www.postgresql.org/docs/current/backup.html' },
  supaOverview: { label: 'Supabase docs: Database overview', url: 'https://supabase.com/docs/guides/database/overview' },
  supaRls: { label: 'Supabase docs: Row Level Security', url: 'https://supabase.com/docs/guides/database/postgres/row-level-security' },
  supaRlsPrompt: { label: 'Supabase docs: AI prompt for writing RLS policies', url: 'https://supabase.com/docs/guides/getting-started/ai-prompts/database-rls-policies' },
  supaMigrationPrompt: { label: 'Supabase docs: AI prompt for creating migrations', url: 'https://supabase.com/docs/guides/getting-started/ai-prompts/database-create-migration' },
  supaMigrations: { label: 'Supabase docs: Database migrations', url: 'https://supabase.com/docs/guides/deployment/database-migrations' },
  supaBackups: { label: 'Supabase docs: Database backups', url: 'https://supabase.com/docs/guides/platform/backups' },
  supaDump: { label: 'Supabase CLI reference: supabase db dump', url: 'https://supabase.com/docs/reference/cli/supabase-db-dump' },
  supaMcp: { label: 'Supabase docs: Model Context Protocol (MCP)', url: 'https://supabase.com/docs/guides/getting-started/mcp' },
  nodeSqlite: { label: 'Node.js 22 docs: SQLite (node:sqlite)', url: 'https://nodejs.org/docs/latest-v22.x/api/sqlite.html' },
  ccBest: { label: 'Claude Code docs: Best practices', url: 'https://code.claude.com/docs/en/best-practices' },
  ccMemory: { label: 'Claude Code docs: How Claude remembers your project', url: 'https://code.claude.com/docs/en/memory' },
} satisfies Record<string, SourceLink>;

const lessons: Lesson[] = [
  {
    id: 'ai-database-design-01',
    day: 1,
    title: 'What a database is for',
    summary: 'Why an app needs a database, the five jobs it does that a spreadsheet or a text file cannot, and a first look at asking it a question.',
    minutes: 22,
    skills: ['data-thinking', 'sql-reading'],
    intro: {
      objectives: [
        'Explain the jobs a database does that a variable, a file or a spreadsheet does not',
        'Name the parts of a table: rows, columns and the key that identifies a row',
        'Read a simple question written in SQL and predict the rows it returns',
      ],
      why: 'When AI builds your app, it decides where the data lives within seconds. If you do not know what a database is for, you cannot tell whether its choice is sound, and every screen the AI builds afterwards sits on top of that choice.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Aling Nena runs a small bakery. Until now, customers have texted her what they want for pickup, and she writes it in a notebook. On Friday morning she cannot find who asked for the five dozen pandesal, two people ordered the last ensaymada, and one customer says she ordered “yesterday” but the page is missing. She asks you to build an app so people can pre-order. Your AI tool will happily generate screens in minutes. The question underneath every screen is the same: **where does the information live, and what keeps it correct?** The answer is a **database**.',
      },
      {
        type: 'paragraph',
        text: 'A database is a program that stores information on disk, keeps it correct while many people use it at once, and lets you ask questions about it. Notice what that sentence does not say: it does not say “a big spreadsheet”. A spreadsheet remembers what you typed. A database also **refuses** what makes no sense and **answers** questions fast, no matter whether there are 50 rows or 5 million.',
      },
      { type: 'heading', text: 'Why not just a variable, a file or a spreadsheet?' },
      {
        type: 'paragraph',
        text: 'A **variable** in your app’s code disappears when the app closes. A **text file or spreadsheet** survives, but only one person can safely edit it at a time, nothing stops a typo like “-5 pandesal”, and finding “all orders for Friday” means opening and scanning the whole thing. A database does five jobs that those do not:',
      },
      {
        type: 'table',
        headers: ['Job', 'What it means', 'Bakery example'],
        rows: [
          ['Remember', 'Keep information after the app closes or the phone restarts', 'Friday’s orders are still there on Saturday'],
          ['Find', 'Answer a question without reading everything', 'Show only the orders to pick up on 20 November'],
          ['Share', 'Let many people read and write at the same time without breaking each other’s work', 'Two customers order the last ensaymada in the same second: only one gets it'],
          ['Protect', 'Refuse data that breaks your rules', 'A quantity of -5 is rejected before it is saved'],
          ['Connect', 'Link a fact to the thing it belongs to, once', 'An order points to one customer, so a phone number is stored in one place'],
        ],
        caption: 'The five jobs of a database. The rest of this course is about getting the AI to design the last three well.',
      },
      { type: 'heading', text: 'Tables, rows, columns and keys' },
      {
        type: 'paragraph',
        text: 'Most databases you will meet with AI (SQLite, PostgreSQL and Supabase, which runs PostgreSQL) are **relational**: the information lives in **tables**. A table is a grid about one kind of thing. Each **column** is one fact about that thing (a name, a price). Each **row** is one example (one product). Every row has a **primary key**, a column whose value is different for every row, so the database can point at exactly one row even when two products have the same name. Here is the bakery’s product table, created and filled for real, then asked a question.',
      },
      {
        type: 'code',
        language: 'sql',
        label: 'products.sql (run in SQLite 3.54)',
        code: `CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price_cents INTEGER NOT NULL
);

INSERT INTO products (name, price_cents) VALUES
  ('Pandesal (dozen)', 6000), ('Ensaymada', 3500), ('Pan de coco', 2500),
  ('Spanish bread', 3000), ('Cheese roll', 4500);

SELECT name, price_cents
FROM products
WHERE price_cents < 4000
ORDER BY price_cents;`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output of the SELECT',
        code: `    name       price_cents
-------------  -----------
Pan de coco           2500
Spanish bread         3000
Ensaymada             3500`,
      },
      {
        type: 'paragraph',
        text: 'That last block is a **query**, a question written in **SQL** (Structured Query Language, the language almost every relational database understands). Read it like a sentence: SELECT these columns, FROM this table, WHERE this is true, ORDER BY this. Prices are stored as whole **centavos** (6000 means ₱60.00), and you will see in lesson 3 why. You will not write much SQL in this course. You will **read** it, because AI writes it and you must judge it.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Picture Aling Nena’s notebook, but with a very strict helper. The notebook has one page per kind of thing: a page of customers, a page of products, a page of orders. Each page is a **table**. Each line on a page is a **row**. Each column heading is a **column**. The helper gives every line a number nobody else has, the **key**, so “line 7 of the products page” always means the same thing. The helper also refuses a line that makes no sense, and can answer “show me every product under ₱40, cheapest first” without you flipping pages. In the SQL above: `CREATE TABLE` makes a new page, `INSERT INTO` adds lines, and `SELECT … WHERE … ORDER BY` is that question. `NOT NULL` means “this box may never be left empty”. Your AI tool will write all of this; you only need to recognise what it is doing.',
      },
      { type: 'heading', text: 'Which database will the AI pick?' },
      {
        type: 'paragraph',
        text: 'You will meet three names again and again. **SQLite** is a database in a single file that lives inside your app, with nothing to install or run: it suits an app’s own local data and small sites. **PostgreSQL** is a database *server*: a separate program that many apps and people connect to over a network, built for many users writing at once. **Supabase** is a hosted service where every project is a full PostgreSQL database, with a dashboard, sign-in and an API around it. For Aling Nena’s pre-order app, customers on their phones and staff on a tablet all need the same orders, so the data belongs on a shared server, not inside one phone. Tools like Cursor, Claude Code or Lovable may choose for you. Your job is to ask “why this one?” and check the answer against who needs the data and how many can write at once.',
      },
      {
        type: 'version',
        text: 'The SQLite documentation says it suits embedded and local application storage and sites with modest traffic, and recommends a client/server database when many computers use the same data over a network or many writers must write at the same moment (SQLite allows one writer at a time per file). Supabase documents that every project includes a full Postgres database. Examples in this course were run on SQLite 3.54.0 and PostgreSQL 14.18; the PostgreSQL pages cited are the current documentation (PostgreSQL 18), and everything shown behaves the same in both. Checked on this date.',
        checked: CHECKED,
        sources: [DOCS.sqliteWhen, DOCS.supaOverview, DOCS.pgConstraints],
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** The choice of store is a decision about concurrency, durability and who owns the schema. SQLite’s single-writer model is a feature when one process owns the file and a liability behind several app servers, which is why a networked PostgreSQL is the default for a shared product. The schema is the longest-lived contract in the system: code is rewritten, data outlives it, and a migration against a populated table is far costlier than a redesign on day one. Beware ORM-first generation: an agent that emits models and lets the framework create tables hides constraints, indexes and defaults in code you may never read. Ask for the DDL (the `CREATE TABLE` statements) as an artifact, review it as you would an API, and keep it in version control. State your volume, read/write ratio and concurrency in the prompt so the AI is not designing for an imaginary load.',
      },
      {
        type: 'takeaways',
        items: [
          'A database remembers, finds, shares, protects and connects data; a variable, file or spreadsheet does at most the first.',
          'Relational data lives in tables: a row is one example, a column is one fact, and a primary key identifies exactly one row.',
          'A SELECT query reads like a sentence: which columns, from which table, where, in what order.',
          'SQLite is a file inside an app, PostgreSQL is a shared server, and Supabase is hosted PostgreSQL; pick by who needs the data and how many write at once.',
          'You will mostly read SQL that AI writes, so the skill is judging it, not typing it.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-01-sql-1',
          kind: 'sql-challenge',
          title: 'Cheap breads, cheapest first',
          story: 'A customer asks Aling Nena what she can afford for under ₱40.',
          prompt: 'Show the `name` and `price_cents` of every product that costs less than 4000, cheapest first. The starter shows everything; add the filter and the order.',
          concept: 'reading and writing a simple query',
          setup: `CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL, price_cents INTEGER NOT NULL);
INSERT INTO products (name, price_cents) VALUES ('Pandesal (dozen)', 6000), ('Ensaymada', 3500), ('Pan de coco', 2500), ('Spanish bread', 3000), ('Cheese roll', 4500);`,
          starter: 'SELECT name, price_cents\nFROM products;',
          expected: { columns: ['name', 'price_cents'], rows: [['Pan de coco', 2500], ['Spanish bread', 3000], ['Ensaymada', 3500]], ordered: true },
          solution: 'SELECT name, price_cents\nFROM products\nWHERE price_cents < 4000\nORDER BY price_cents;',
          hints: [
            'Two things are missing from the starter: a filter that keeps only some rows, and an order.',
            'The filter is a WHERE line under FROM; the order is an ORDER BY line at the end.',
            'WHERE price_cents < 4000 keeps the cheap ones, ORDER BY price_cents sorts from the smallest price up.',
          ],
          explanation: 'WHERE keeps only the rows where the test is true (the cheese roll at 4500 and the pandesal at 6000 are left out), and ORDER BY price_cents sorts what remains from smallest to largest.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-01-match-1',
          kind: 'match',
          title: 'Which job is being asked for?',
          prompt: 'Each situation needs one of the database’s five jobs. Match the situation to the job.',
          concept: 'the jobs of a database',
          labels: { terms: 'Situation', meanings: 'Job the database does' },
          pairs: [
            { term: 'The app is closed and the phone restarts, but yesterday’s orders must still be there', definition: 'Remember', note: 'Surviving a restart is about keeping data on disk.' },
            { term: 'Show only the orders to pick up on 20 November', definition: 'Find', note: 'Answering a question without reading everything is finding.' },
            { term: 'Two customers tap Order on the last ensaymada in the same second', definition: 'Share', note: 'Several people writing at once is sharing.' },
            { term: 'A quantity of -5 must never be saved', definition: 'Protect', note: 'Refusing data that breaks your rules is protecting.' },
          ],
          hints: [
            'Ask: is this about keeping, searching, many people at once, or refusing bad data?',
            'The restart is about keeping; the two customers at once is about taking turns safely.',
            'Remember is the restart, Find is the date filter, Share is the two customers, Protect is the negative quantity.',
          ],
          explanation: 'Each job answers a different pain: remembering after a restart, finding without scanning, sharing without collisions, protecting against bad data. (Connecting, the fifth, is what the next lessons build.)',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-01-scenario-1',
          kind: 'scenario',
          title: 'Where should the orders live?',
          prompt: 'Choose where the pre-order data should be stored.',
          concept: 'choosing where data lives',
          situation: 'Aling Nena wants customers to order from their own phones and her staff to see every order on a tablet in the shop, all at the same time. Your AI tool offers four options.',
          options: [
            { text: 'One hosted PostgreSQL database (for example a Supabase project) that the customer app and the tablet app both talk to.', consequence: 'Everyone reads and writes the same orders, the server takes turns safely, and the rules are enforced in one place.', quality: 'best' },
            { text: 'A SQLite file inside each customer’s app, with orders emailed to the shop.', consequence: 'Every phone has its own private copy. The shop only sees what happens to be emailed, and nothing keeps the copies consistent.', quality: 'poor' },
            { text: 'A spreadsheet that every customer is given edit access to.', consequence: 'It works for three people. With many editing at once it becomes slow and messy, and nothing stops a customer from deleting someone else’s row.', quality: 'poor' },
            { text: 'A SQLite file on the shop’s tablet, with the customer app sending requests to the tablet.', consequence: 'It can work, but the tablet must stay on, charged and reachable, and one device becomes the single point of failure for the business.', quality: 'acceptable' },
          ],
          hints: [
            'Who needs to see the same orders, and from how many places?',
            'Several phones and a tablet need one shared copy that is always up.',
            'A database server that all the apps talk to gives everyone the same data and one place for the rules.',
          ],
          explanation: 'Customers and staff must share one copy of the truth, so the data belongs on a shared server. A file inside one phone cannot be shared, and a spreadsheet cannot enforce rules.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-01-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'Five words, in your own words',
          prompt: 'Tap each card after you have said the meaning aloud.',
          concept: 'database vocabulary',
          cards: [
            { front: 'Table', back: 'A grid about one kind of thing, such as products or customers.' },
            { front: 'Row', back: 'One example in the table: one product, one customer.' },
            { front: 'Column', back: 'One fact about every row, such as a name or a price.' },
            { front: 'Primary key', back: 'A column whose value is different in every row, so one row can be named exactly.' },
            { front: 'Query', back: 'A question you ask the database, written in SQL.' },
          ],
          hints: ['Think of a notebook with one page per kind of thing.'],
          explanation: 'These five words come back in every lesson. If you can explain each one to a friend, you can follow what the AI generates.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-database-design-01-q1',
        prompt: 'Two cashiers sell the last ensaymada at the same moment from different phones. Which job of a database is supposed to handle this?',
        choices: [
          'Remember: it keeps every order safe on disk even after the app restarts',
          'Find: it searches through the table quickly without reading every row',
          'Share: many people can write at once without clashing',
          'Connect: it links each order to one customer record without copying details',
        ],
        answer: 2,
        explanation: 'Sharing means several people can read and write the same data at once and the database takes turns safely, so only one sale of the last item succeeds. Remembering and finding are different jobs.',
      },
      {
        id: 'ai-database-design-01-q2',
        prompt: 'In a table of products, what does the primary key do?',
        choices: [
          'It gives each row a value no other row shares',
          'It sorts the rows from cheapest to most expensive whenever you ask',
          'It stops the same product name from ever being used twice in the table',
          'It hides the price column from people who are not signed in to the app',
        ],
        answer: 0,
        explanation: 'A primary key identifies exactly one row. It does not sort rows, it does not by itself stop duplicate names (that is a separate rule you will meet in lesson 3), and it has nothing to do with who may see data.',
      },
      {
        id: 'ai-database-design-01-q3',
        prompt: 'What does this query return? SELECT name FROM products WHERE price_cents < 3000 ORDER BY name; (products: Pandesal 6000, Ensaymada 3500, Pan de coco 2500, Spanish bread 3000, Cheese roll 4500)',
        choices: [
          'Pan de coco and Spanish bread',
          'Pandesal (dozen) and Cheese roll',
          'Ensaymada, Pan de coco and Spanish bread',
          'Only Pan de coco',
        ],
        answer: 3,
        explanation: 'Only 2500 is below 3000. The Spanish bread costs exactly 3000, and “less than” does not include equal. A reader who stops at “cheap breads” and does not check the boundary gets the wrong rows.',
      },
      {
        id: 'ai-database-design-01-q4',
        prompt: 'A customer app on thousands of phones and a staff tablet must show the same live orders. Which setup fits best?',
        choices: [
          'A SQLite file stored inside each customer’s app',
          'A shared database server that every app talks to',
          'A spreadsheet emailed to the shop every evening',
          'A text file the tablet app rewrites after every sale',
        ],
        answer: 1,
        explanation: 'Many devices must see one copy of the data, so it belongs on a server they all connect to. A file inside each phone gives each person a private copy that nothing keeps in sync.',
      },
      {
        id: 'ai-database-design-01-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what is a “row” in a database table?',
        choices: [
          'The heading at the top of a column, which names the fact stored there',
          'The page that holds every kind of information used anywhere in the app',
          'The secret code that protects the data from people who should not see it',
          'One example, such as one single product',
        ],
        answer: 3,
        explanation: 'A table is about one kind of thing and each row is one example of it. The heading is a column name, and a table holds one kind of thing, not everything.',
      },
      {
        id: 'ai-database-design-01-q6',
        audience: { min: 'advanced' },
        prompt: 'You ask an agent to scaffold a multi-user web app and it creates its tables from ORM model classes at start-up. What is the main risk to review?',
        choices: [
          'The tables may be slower to read than hand-written SQL, for every query, forever',
          'Constraints, indexes and defaults hide in code, so the schema goes unreviewed',
          'The ORM will refuse to connect to PostgreSQL because it was built for SQLite',
          'The agent can only create one table for each model class it is given',
        ],
        answer: 1,
        explanation: 'The risk is an unreviewed schema: constraints, indexes and defaults hide inside framework code. Ask for the generated DDL and review it like an API. ORMs are not inherently slower and they do support PostgreSQL.',
      },
    ],
    task: {
      title: 'Run your first query',
      minutes: 12,
      steps: [
        'Open a terminal and run `sqlite3` (it is installed on most Macs and Linux machines; on Windows ask your AI tool how to install it). You are now talking to a temporary database that disappears when you exit.',
        'Paste in the `CREATE TABLE products` and `INSERT` statements from this lesson, then run the SELECT. Check that your three rows match the output shown.',
        'Change the number 4000 to 3000 and predict the rows before you run it. Then change `ORDER BY price_cents` to `ORDER BY name`. Write down whether each prediction was right.',
        'Ask your AI assistant: “Explain this SQL line by line for a beginner,” pasting the SELECT. Compare its explanation with the one in the lesson.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask your AI tool to explain the word “primary key” using a school example (a student number), then explain it back in your own words.'] },
      { audience: { min: 'advanced' }, steps: ['Run `.schema` after creating the table and `EXPLAIN QUERY PLAN` on the SELECT. Note what SQLite says it will do, and write one sentence on when you would choose PostgreSQL instead for this app.'] },
    ],
  },
  {
    id: 'ai-database-design-02',
    day: 2,
    title: 'Describe your data to the AI',
    summary: 'A five-part way to describe the things, facts, connections, rules and questions of your app so the AI designs from your needs instead of guessing.',
    minutes: 24,
    skills: ['data-thinking', 'ai-data-prompts'],
    intro: {
      objectives: [
        'Describe an app’s data as things, facts, connections, rules and questions',
        'Write a prompt that gets a useful first schema instead of a generic one',
        'Ask the AI to question you first, and check its first draft against your own description',
      ],
      why: 'The AI can only design what you describe. A vague request gets the average schema for the average app, and the average app is not yours. Five minutes of describing your data well saves days of reshaping later.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Ask an AI tool for “a database for a bakery pre-order app” and you will get something. It will look professional and it will run. But it was designed for a bakery the AI imagined, with the questions the AI imagined. Aling Nena’s bakery has a Friday bake list, customers who order by phone number, and prices that change. None of that is in your one-line request, so none of it is in the design. The cure is not a cleverer prompt. It is knowing **what to say about your data** and saying it in a shape the AI (and you) can check.',
      },
      {
        type: 'paragraph',
        text: 'Here is what a vague request tends to produce. This is an **example AI answer written for this course**, not the output of a real model, but it is the kind of first draft you will really see: one table that holds everything.',
      },
      {
        type: 'prompt',
        label: 'A vague prompt',
        text: 'Design a database for a bakery pre-order app.',
      },
      {
        type: 'code',
        language: 'sql',
        label: 'Example AI answer to the vague prompt (written for this course)',
        code: `CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  product TEXT,
  quantity INTEGER,
  price REAL,
  status TEXT,
  pickup_date TEXT
);`,
      },
      {
        type: 'paragraph',
        text: 'It runs. It is also the start of many problems you will find in lesson 3. For now, notice what the AI could not know: that one order can have several products, that customers come back, that the price must be remembered as it was. Those facts live in your head. Describing them is the work.',
      },
      { type: 'heading', text: 'The five parts of a data description' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Things.** The nouns your app keeps track of: customer, product, order. Each becomes a table.',
          '**Facts.** What you know about each thing: a customer has a name and a phone number; a product has a name and a price. Each becomes a column. Say which facts are optional.',
          '**Connections.** How things relate, in sentences with verbs: a customer *places* many orders; an order *contains* many products, and a product can be in many orders.',
          '**Rules.** What must always or never be true: a quantity is at least 1; two customers never share a phone number; an order has exactly one of four statuses.',
          '**Questions.** What the app must be able to answer: what must we bake on Friday? What does this order cost? Who has not picked up? Which bread sells best this month?',
        ],
      },
      {
        type: 'paragraph',
        text: 'There is a sixth habit worth adding: **history**. Say which facts must be remembered *as they were*. If pandesal costs ₱60 today and ₱65 next month, last month’s orders must still show ₱60. That sentence changes the design, because it means an order line must store its own price, not just point at the product. Here is Aling Nena’s whole description, written once.',
      },
      {
        type: 'prompt',
        label: 'A good prompt: the full description (plain language)',
        text: `I am building a pre-order app for a small bakery. Design the database tables for PostgreSQL. Do not write code yet: list each table with its columns, which column is the primary key, and how tables connect. Then I will review it.

THINGS AND FACTS
- Customer: name, phone number (how we reach them), optional email.
- Product: name, price, and whether we still sell it.
- Order: which customer, pickup date, status.
- Order line: which product, how many, the price at the time of the order.

CONNECTIONS
- A customer places many orders. An order contains many products, and a product appears in many orders.

RULES
- Quantity is at least 1. Prices are always above zero.
- No two customers share a phone number.
- Status is one of: pending, ready, picked up, cancelled.
- A picked-up order is never deleted; we cancel instead.

QUESTIONS THE APP MUST ANSWER
- What must we bake on a given day, per product?
- What does a given order cost in total?
- Who has not picked up yet?
- Which products sold best this month?

HISTORY
- If the price of a product changes, past orders keep the price they were made at.`,
      },
      {
        type: 'paragraph',
        text: 'Notice the instruction “do not write code yet”. Asking first for the *design in words* gives you something you can check against the description before any SQL exists. It is far cheaper to correct “the order line has no price column” in a list than in a migration.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Imagine hiring a cook and handing over a recipe card that says only “make dinner”. You would get dinner, but not the one you wanted. A good card says what dishes, for how many people, what is allergic, and what you must be able to serve by seven o’clock. The five parts do the same for your data: **things** (the nouns), **facts** (details about each noun), **connections** (which things belong together), **rules** (what must always be true), and **questions** (what you want to find out later). You do not need to know any technical words. If you can describe your shop to a new helper, you can describe your data. Read the prompt above slowly: each heading is one of the five parts, written in everyday sentences.',
      },
      { type: 'heading', text: 'Let the AI interview you' },
      {
        type: 'paragraph',
        text: 'You will forget things. A powerful trick is to make the AI find the gaps: ask it to question you *before* it designs anything. AI tool guidance says the same thing in general terms: tell the assistant what it cannot see, and give it a check to run. Here your description is the thing it cannot see, and in lesson 6 you will build the checks.',
      },
      {
        type: 'prompt',
        label: 'Ask the AI to interview you first',
        text: 'I want to design the database for a bakery pre-order app. Before you design anything, interview me. Ask me one group of questions at a time (what things the app tracks, how they connect, what rules must always hold, what questions the app must answer, and what must be remembered as it was). Push back if my answers are vague. When you have enough, summarise my answers as a description in those five parts and wait for me to confirm it.',
      },
      {
        type: 'paragraph',
        text: 'When the AI answers, **read its design against your description**, line by line. Does every thing have a table? Does every fact have a column? Is every connection drawn? Is every rule represented somewhere, and can every question be answered from what is stored? Whatever is missing, tell the AI. This is the loop you will use all course: describe, generate, check against the description, correct.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Treat the description as a spec the schema must satisfy: the rules become invariants, the questions become **access patterns** that decide indexes later, and the connections become cardinalities with explicit delete behaviour. Add what a vague prompt never carries: expected volume (rows per month), the read/write ratio, how many writers contend for the same rows, retention and deletion obligations, and who may read what. If one database serves many customers or businesses (a multi-tenant app), say who owns each row and which questions cross owners, because that decides the owner columns and the access rules. Without those, the model optimises for a generic app. Once the description is agreed, keep it in the repository and reference it from your instructions file (`CLAUDE.md` or `AGENTS.md`) so every future session starts from the same data rules; both tools load these files at the start of a session as context, not as an enforced rule, so still verify the result. An agent that sees the invariants in its instructions will write migrations that respect them.',
      },
      {
        type: 'version',
        text: 'Claude Code’s documentation says each session starts with a fresh context window and that CLAUDE.md files (or a repository’s AGENTS.md) carry persistent instructions into every session, treated as context rather than enforced configuration; its best-practices page advises telling Claude what it cannot see and giving it a check to run. Other tools (Cursor, Codex, Copilot) have their own instruction files; check each tool’s current documentation for the file name. Checked on this date.',
        checked: CHECKED,
        sources: [DOCS.ccMemory, DOCS.ccBest],
      },
      {
        type: 'takeaways',
        items: [
          'A vague prompt gets the average schema for an imagined app, so say what is true about yours.',
          'Describe your data in five parts: things, facts, connections, rules and questions, plus any history that must be remembered as it was.',
          'Ask for the design in words first, so you can check it against your description before any SQL exists.',
          'Let the AI interview you to find the gaps, then confirm its summary.',
          'Always check the first draft back against your own description: every thing, fact, connection, rule and question.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-02-arrange-1',
          kind: 'arrange',
          title: 'Describe the data in the right order',
          prompt: 'Put these steps of describing a clinic’s appointment data in a sensible order, first at the top.',
          concept: 'the five-part data description',
          language: 'text',
          solution: [
            'List the things: patient, doctor, appointment',
            'Write the facts of each thing: a patient has a name and a phone number',
            'Say how they connect: a patient books many appointments with one doctor each',
            'State the rules: a doctor cannot have two appointments at the same time',
            'List the questions: which appointments does Dr. Lim have tomorrow?',
            'Give all of it to the AI and ask for the design in words first',
          ],
          reasons: [
            'You cannot describe facts or connections until you know what the things are.',
            'Facts belong to a thing, so they come right after the things.',
            'Connections are between things you have already named.',
            'Rules mention the things, facts and connections, so they come after.',
            'Questions tell you whether the earlier parts hold enough to answer them.',
            'The AI gets the complete description last, with the instruction to answer in words so you can review it.',
          ],
          hints: [
            'Which part needs the least from the others?',
            'Start with the nouns; the rules and questions refer to them.',
            'Things, facts, connections, rules, questions, then the prompt to the AI.',
          ],
          explanation: 'The five parts build on each other: you name the things, give each its facts, connect them, state the rules, and list the questions. Only then do you ask the AI, and you ask for the design in words so you can check it.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-02-fill-blank-1',
          kind: 'fill-blank',
          title: 'Finish the description',
          prompt: 'This description for a small rice store has four gaps. Fill each from the word bank.',
          concept: 'writing connections and rules',
          language: 'text',
          code: `THINGS: customer, sack, purchase
CONNECTIONS: A ___ makes many purchases. A purchase is for one ___ of rice, and each kind of rice appears in many purchases.
RULES: The number of sacks in a purchase is at least ___.
QUESTION: Which customers still ___ money for a past purchase?`,
          blanks: [
            { answers: ['customer'], feedback: 'The sentence is about who makes purchases.' },
            { answers: ['kind'], feedback: 'Each purchase is for one type of rice, not a sack count.' },
            { answers: ['1'], feedback: 'Selling zero or negative sacks makes no sense, so the smallest allowed number is one.' },
            { answers: ['owe'], feedback: 'The question is about money still due.' },
          ],
          bank: ['customer', 'kind', '1', 'owe', 'receipt', '0', 'paid'],
          hints: [
            'Read each sentence out loud and ask which word makes it true for a store.',
            'The first blank is the person who buys, the second a type of rice, the third the smallest sensible quantity.',
            'customer, kind, 1, owe.',
          ],
          explanation: 'A customer makes many purchases (a connection), a purchase is for one kind of rice (another connection), the number of sacks is at least 1 (a rule), and the question asks who still owes money.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-02-scenario-1',
          kind: 'scenario',
          title: 'Which request gets a usable first draft?',
          prompt: 'You are about to ask your AI tool to design the data for a dental clinic’s appointment app. Which request do you send?',
          concept: 'prompting for a schema',
          situation: 'The clinic has patients, dentists and appointments. A dentist cannot be double-booked, patients may change phone number, and the receptionist needs tomorrow’s list every evening.',
          options: [
            { text: 'Describe the things and their facts, how they connect, the double-booking rule, and the “tomorrow’s list” question; ask for the design in words first.', consequence: 'The AI has everything it needs, and the answer can be checked against your description before any SQL is written.', quality: 'best' },
            { text: 'Ask: “Make me a complete production database for a dental clinic with every feature a clinic could need.”', consequence: 'You get a huge generic schema with tables you do not need and none of your rules, and you cannot tell what is missing.', quality: 'poor' },
            { text: 'Ask: “Design a database for a dental clinic,” then fix whatever looks wrong afterwards.', consequence: 'You will not notice what is missing, because the AI never learned your double-booking rule or the evening list. The design looks complete and quietly is not.', quality: 'poor' },
            { text: 'Describe the things and facts but skip the rules and questions, since the AI can work them out.', consequence: 'Better than nothing, but the AI cannot know about the double-booking rule or what the receptionist needs, so the first draft will miss both.', quality: 'acceptable' },
          ],
          hints: [
            'Which request tells the AI the rules and the questions?',
            'The rules and the questions are exactly what the AI cannot guess.',
            'Give it things, facts, connections, rules and questions, and ask for words first.',
          ],
          explanation: 'The AI cannot know your rules or the questions your app must answer, so they go in the description. Asking for the design in words first means you can check it before any SQL exists.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-02-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'Everyday words to database words',
          prompt: 'Tap each card to see which database word matches the everyday one.',
          concept: 'from description to schema',
          cards: [
            { front: 'A thing you keep track of (a customer)', back: 'Becomes a table.' },
            { front: 'A detail about that thing (a phone number)', back: 'Becomes a column.' },
            { front: 'One real customer, Mara', back: 'Becomes a row.' },
            { front: 'Something that must always be true (quantity at least 1)', back: 'Becomes a rule the database enforces (a constraint).' },
            { front: 'Something you want to find out (who has not picked up?)', back: 'Becomes a query.' },
          ],
          hints: ['Think of each everyday phrase as a label for one part of the table.'],
          explanation: 'The words change but the ideas do not: nouns become tables, details become columns, examples become rows, must-always-be-true statements become rules, and what you want to know becomes a query.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-database-design-02-q1',
        prompt: 'Aling Nena says: “A customer can order many times, and one order can have several kinds of bread.” Which part of a data description is this?',
        choices: [
          'A thing and its facts',
          'A connection between things',
          'A rule the data must always follow',
          'A question the app must answer',
        ],
        answer: 1,
        explanation: 'It says how things relate (customer to orders, order to products), so it is a connection. It lists no facts, forbids nothing, and asks nothing.',
      },
      {
        id: 'ai-database-design-02-q2',
        prompt: 'Why should the description include the question “What must we bake on Friday?”',
        choices: [
          'It makes the AI choose a faster database engine for the bakery',
          'It tells the AI the bakery opens on weekdays so it can set a deadline',
          'It lets the AI choose names for the tables that sound polite and friendly',
          'It shows what must be stored and findable, such as the pickup date',
        ],
        answer: 3,
        explanation: 'A question reveals what the data must contain so the answer can be found later: here a pickup date on each order and a quantity per product. It does not choose an engine or set deadlines.',
      },
      {
        id: 'ai-database-design-02-q3',
        prompt: 'You asked for “a database for a bakery app” and the AI returned one table with the customer, the product and the price together. What is the best next step?',
        choices: [
          'Say what you left out, or ask the AI to interview you, then ask again',
          'Accept it, because the AI is trained on many bakery apps and so knows best',
          'Ask the AI to keep adding columns until the single table covers everything',
          'Switch to a different AI tool and ask the very same one-line question again',
        ],
        answer: 0,
        explanation: 'The draft is generic because the request was. The fix is to supply the missing parts of the description, not to hope another model guesses them. Adding columns to one table does not create the connections you left out.',
      },
      {
        id: 'ai-database-design-02-q4',
        prompt: 'The description says “past orders keep the price they were made at.” What does that change in the design?',
        choices: [
          'Nothing changes, because the order can always look up the product’s current price',
          'Products need a second price column called “old price” to remember history',
          'Each order line must store its own price at the time of the order',
          'The orders table must be deleted and rebuilt at the end of every month',
        ],
        answer: 2,
        explanation: 'If the order only points to the product, raising the product’s price silently rewrites history. Storing the price on the order line freezes what the customer actually paid.',
      },
      {
        id: 'ai-database-design-02-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a “rule” in a data description?',
        choices: [
          'A button the customer presses on the screen to place an order',
          'A colour or a font used for the screens of the finished app',
          'The name of the AI tool that you use to design the tables',
          'Something that must always be true, such as “quantity is at least 1”',
        ],
        answer: 3,
        explanation: 'A rule is a statement that must always hold, which the database can later enforce. The other choices are about screens and tools, not about data.',
      },
      {
        id: 'ai-database-design-02-q6',
        audience: { min: 'advanced' },
        prompt: 'You prompted “multi-tenant booking schema” and the AI’s tables have no owner column on the child tables. What was missing from your description?',
        choices: [
          'The name of the web framework that the app will be built with',
          'Who owns each row, and which questions cross owners',
          'The list of indexes that the database should create for speed',
          'The hosting provider and the region the database should run in',
        ],
        answer: 1,
        explanation: 'Tenancy is a rule and an access pattern. Without saying who owns each row and which reads cross owners, the AI has no reason to put an owner on the child tables. Frameworks, indexes and hosting do not decide that.',
      },
    ],
    task: {
      title: 'Describe your own app’s data',
      minutes: 15,
      steps: [
        'Pick a small app idea (yours, or a shop, a clinic, a tutoring schedule). Write the five parts in a plain text file: things, facts, connections, rules and questions. Aim for three things and at least four rules.',
        'Add a “history” line: what must be remembered as it was, even if it changes later?',
        'Paste the “interview me first” prompt into an AI chat, answer its questions, and compare its summary with your file. Note what it found that you had missed.',
        'Ask the AI for the design in words only (tables, columns, keys, connections, no SQL) and check it line by line against your description.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Read your description aloud to a friend and ask them to point at anything they cannot picture. Add a sentence for each gap.'] },
      { audience: { min: 'advanced' }, steps: ['Add expected volume per month, the read/write ratio and who may read what. Save the description in your repository and reference it from your instructions file.'] },
    ],
  },
  {
    id: 'ai-database-design-03',
    day: 3,
    title: 'Review a generated schema',
    summary: 'A seven-question review for any schema an AI hands you, and the habit of proving it by trying to put bad data in.',
    minutes: 26,
    skills: ['schema-review', 'sql-reading', 'ai-data-prompts'],
    intro: {
      objectives: [
        'Review a generated schema with seven questions about keys, uniqueness, emptiness, types, impossible values, repetition and change',
        'Choose safe types for money, dates and status values',
        'Prove a schema is safe by trying to insert bad data and expecting the database to refuse it',
      ],
      why: 'A schema that works in the demo can still accept anything. AI is happy to produce one, and you are the only reviewer. Constraints are what keep wrong data out for the life of the app, long after you have forgotten the prompt.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Take the single `orders` table from lesson 2. It runs, the demo works, and a reviewer who only clicks through the app would pass it. But a schema is a promise about what can *never* be stored, and this one promises almost nothing. To see that, do not read it harder: **try to break it**. Here are three orders typed the way real people type, run against that draft in SQLite for real.',
      },
      {
        type: 'code',
        language: 'sql',
        label: 'Three plausible orders typed into the draft',
        code: `INSERT INTO orders (customer_name, customer_phone, product, quantity, price, status, pickup_date)
VALUES ('Mara Reyes', '0917 555 0101', 'Pandesal (dozen)', 2, 0.1, 'pending', '2026-11-20');
INSERT INTO orders (customer_name, customer_phone, product, quantity, price, status, pickup_date)
VALUES ('Mara Reyes', '09175550101', 'Ensaymada', 3, 0.2, 'pending', '2026-11-20');
INSERT INTO orders (customer_name, product, quantity, price, status, pickup_date)
VALUES ('Mara  Reyes', 'Pandesal (dozen)', -5, 'free', 'Pending', 'next friday');`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: all three were accepted',
        code: `id  customer_name  quantity  price  status   pickup_date
--  -------------  --------  -----  -------  -----------
 1  Mara Reyes            2    0.1  pending  2026-11-20
 2  Mara Reyes            3    0.2  pending  2026-11-20
 3  Mara  Reyes          -5  free   Pending  next friday`,
      },
      {
        type: 'paragraph',
        text: 'Every row was accepted: a negative quantity, a price that is the word “free”, a date that is “next friday”, a status spelled with a capital letter so a search for `pending` misses it, and a customer who now appears under two spellings. The database did exactly what it was told. It was told nothing. Asking `SELECT 0.1 + 0.2` in the same database prints `0.30000000000000004`, so adding up two “prices” of ten and twenty centavos does not even give thirty. That is not a bug in SQLite: it is how **floating-point** numbers work. They cannot store a value like 0.1 exactly, which is why money is stored as a whole number of centavos instead.',
      },
      { type: 'heading', text: 'The seven questions' },
      {
        type: 'table',
        headers: ['Ask', 'Look for', 'In the draft'],
        rows: [
          ['1. Does every table have a primary key?', 'A column that names exactly one row', 'Yes: id'],
          ['2. What must never repeat?', 'UNIQUE on phone numbers, product names, emails', 'Nothing stops the same customer twice'],
          ['3. What may never be empty?', 'NOT NULL on every fact the app needs', 'Every column may be empty'],
          ['4. Are the types right?', 'Whole centavos for money; real dates; a fixed list for statuses', 'price REAL, pickup_date free text, status free text'],
          ['5. Which values are impossible?', 'CHECK rules: quantity above zero, price above zero, status in a list', 'No rule at all'],
          ['6. Is something repeated that deserves its own table?', 'The same customer details copied on every row', 'Name, phone and email are on every order'],
          ['7. What changes over time, and must be remembered?', 'A price copied at the time of sale', 'Only the current price exists'],
        ],
        caption: 'Run these seven questions over every schema you are given, human or AI. Question 6 is the next lesson.',
      },
      {
        type: 'paragraph',
        text: 'Three tools do most of the work. **NOT NULL** says a column can never be empty. **UNIQUE** says no two rows may have the same value in it. **CHECK** says a condition must be true for every row, such as `quantity > 0` or `status IN (\'pending\', \'ready\', \'picked_up\', \'cancelled\')`. These are **constraints**: rules the database enforces on every write, whoever writes it, whether that is your app, an admin tool, or a script an AI wrote last week. Here is the safer version of the facts about an order line, and what the database says when you try the same bad rows against it.',
      },
      {
        type: 'code',
        language: 'sql',
        label: 'The same facts, with constraints (a fragment of the corrected schema)',
        code: `CREATE TABLE customers (
  id         INTEGER PRIMARY KEY,
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL UNIQUE,
  email      TEXT UNIQUE
);
CREATE TABLE products (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  price_cents INTEGER NOT NULL CHECK (price_cents > 0)
);
-- in the order lines table
quantity INTEGER NOT NULL CHECK (quantity > 0),
-- in the orders table
status TEXT NOT NULL DEFAULT 'pending'
  CHECK (status IN ('pending', 'ready', 'picked_up', 'cancelled')),`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real errors from SQLite when the bad rows are tried',
        code: `UNIQUE constraint failed: customers.phone
CHECK constraint failed: quantity > 0
CHECK constraint failed: status IN ('pending', 'ready', 'picked_up', 'cancelled')`,
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Think of the school’s enrolment office. A form with every box optional is accepted even when it is blank, has two names crammed in, or a birth date of “someday”. A good office has rules on the counter: every form needs a name (**NOT NULL**), no two students get the same student number (**UNIQUE**), and the grade must be one of the real grades (**CHECK**). The office does not trust each clerk to remember; the counter itself refuses the bad form. Constraints are that counter. Reading the SQL above: `NOT NULL` means “may not be left empty”, `UNIQUE` means “no repeats”, `CHECK (quantity > 0)` means “this must be true or the row is turned away”, and `price_cents` holds whole centavos so 60 pesos is stored as 6000, with no decimals to go wrong.',
      },
      { type: 'heading', text: 'Types: three that AI often gets wrong' },
      {
        type: 'list',
        items: [
          '**Money.** Store a whole number of the smallest unit (`price_cents INTEGER`), or PostgreSQL’s exact `numeric` type. PostgreSQL gives `0.1 + 0.2 = 0.3` for `numeric` and `false` for the comparison with floating-point numbers, while `REAL` and `DOUBLE PRECISION` drift.',
          '**Dates.** Use real dates and times where the database has them (PostgreSQL `date`, `timestamptz`). SQLite has no date type, so use text in the year-month-day form (`2026-11-20`) and add a rule so “next friday” is refused.',
          '**Choices.** A status is one of a short list. Without a CHECK (or a PostgreSQL enum), “Pending”, “pending” and “pnding” are three different statuses.',
        ],
      },
      {
        type: 'paragraph',
        text: 'One database-specific trap: **SQLite lets any column hold any kind of value** unless the table is declared STRICT. Put `\'four\'` in an INTEGER column and SQLite stores the text; put `\'4\'` and it quietly converts it to the number 4. PostgreSQL is stricter: the same insert is refused with `invalid input syntax for type integer`. So an AI that generated a “working” SQLite schema has not proved the types are enforced. Ask for constraints, and then test them.',
      },
      {
        type: 'version',
        text: 'SQLite documents that its type system is dynamic (a column can hold any type, with “affinity” converting text that looks like a number) and that STRICT tables, which enforce column types, exist from SQLite 3.37.0 (2021-11-27). PostgreSQL’s constraints documentation covers CHECK, NOT NULL, UNIQUE, PRIMARY KEY and FOREIGN KEY. Tested here on SQLite 3.54.0 and PostgreSQL 14.18. Checked on this date.',
        checked: CHECKED,
        sources: [DOCS.sqliteTypes, DOCS.pgConstraints],
      },
      { type: 'heading', text: 'Prove it, do not just read it' },
      {
        type: 'paragraph',
        text: 'Asking the AI to review its own schema is a useful second opinion, but it is an opinion. The proof is a set of **negative tests**: for each rule you care about, write one insert that breaks it and expect an error. If an insert you thought was forbidden succeeds, you have found a gap before a customer did. Keep these inserts in a file; you will run them again after every change.',
      },
      {
        type: 'prompt',
        label: 'Ask the AI to review its own schema, then test the answer yourself',
        text: 'Here is the schema you generated for the bakery pre-order app: [paste it]. Review it as a skeptical senior engineer. For each table, answer: (1) is there a primary key, (2) what should be UNIQUE, (3) what should be NOT NULL, (4) are money, date and status types safe, (5) which impossible values should a CHECK refuse, (6) is anything repeated that belongs in its own table, (7) what must be remembered as it was. Then write the corrected schema and, for every rule, one INSERT that should fail and the error I should see.',
      },
      {
        type: 'paragraph',
        text: 'You can also hunt for problems that are already in the data, such as a customer typed two ways. `GROUP BY` collects rows that share a value, `COUNT(*)` counts each group, and `HAVING` filters the groups after counting. This is how you find repeats the schema should have prevented:',
      },
      {
        type: 'code',
        language: 'sql',
        label: 'Which customer names appear on more than one order? (real result: Mara Reyes, 2)',
        code: `SELECT customer_name, COUNT(*) AS orders
FROM orders
GROUP BY customer_name
HAVING COUNT(*) > 1;`,
      },
      {
        type: 'paragraph',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: '**At your level.** Do not stop at “the AI said it checked”. Build the negative-test file as you go: one failing insert per constraint, each with the exact error you expect. When you later ask the AI to change the schema, run the file again. If a constraint disappears in a rewrite, a test will fail and you will see it, instead of finding out from your data.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** The point of a constraint is that it holds for every writer: the web app, a background worker, a migration, a person with a SQL console and, increasingly, an agent with credentials. Validation only in a form or an API layer protects exactly one path. Prefer making illegal states unrepresentable: exact numerics or integers for money, `timestamptz` for instants, a CHECK or enum for closed sets, a real foreign key rather than a convention. Choose keys deliberately (a surrogate identity or UUID key, and a separate UNIQUE on the natural key), and remember that adding a constraint to a table that already holds data can fail on old rows, so audit with a query first and check your database’s documentation for how to add it to a large table without a long lock. Treat an AI’s “looks good” as untested: assert the schema in tests.',
      },
      {
        type: 'takeaways',
        items: [
          'Review every schema with seven questions: keys, uniqueness, emptiness, types, impossible values, repetition and change.',
          'NOT NULL, UNIQUE and CHECK are constraints the database enforces for every writer, so they outlive your app code and your prompts.',
          'Store money as whole centavos (or an exact numeric), never as a floating-point number, and keep statuses to a fixed list.',
          'SQLite lets a column hold any type unless the table is STRICT; PostgreSQL enforces types, so a schema that works in one is not proved safe in the other.',
          'Prove a schema with negative tests: insert bad rows on purpose and expect each to be refused.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-03-fix-bug-1',
          kind: 'fix-bug',
          title: 'The unsafe money column',
          prompt: 'This product table was generated by an AI. Tap the line that stores money unsafely, then choose the best replacement.',
          concept: 'safe money types and constraints',
          language: 'sql',
          code: `CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  price REAL
);`,
          bugLine: 4,
          lineNote: 'That line is fine. Look for the column that holds money.',
          fixes: [
            { line: '  price_cents INTEGER NOT NULL CHECK (price_cents > 0)', correct: true, why: 'Whole centavos cannot drift, NOT NULL means a price is always there, and the CHECK refuses zero or negative prices.' },
            { line: '  price DOUBLE PRECISION', correct: false, why: 'This is still floating point, so sums drift, and it can still be empty or negative.' },
            { line: '  price TEXT NOT NULL', correct: false, why: 'Text accepts “free” and “sixty pesos” and cannot be added up reliably.' },
            { line: '  price REAL NOT NULL', correct: false, why: 'Better than before, but it is still floating point and still allows zero or a negative number.' },
          ],
          hints: [
            'Which column holds money, and what did 0.1 + 0.2 give earlier in the lesson?',
            'Floating point drifts, so store a whole number of the smallest unit, and add the rules that make sense for a price.',
            'A price is a whole number of centavos that is never empty and always above zero.',
          ],
          explanation: 'Money belongs in a whole number of the smallest unit with NOT NULL and a CHECK above zero. That removes the rounding drift and the nonsense values in one line.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-03-predict-output-1',
          kind: 'predict-output',
          title: 'What does SQLite really store?',
          prompt: 'This SQLite table has an INTEGER column. What does the final SELECT print, one value per line?',
          concept: 'flexible typing in SQLite',
          language: 'sql',
          code: `CREATE TABLE t (qty INTEGER);
INSERT INTO t VALUES (3), ('4'), ('four'), (2.5);
SELECT typeof(qty) FROM t;`,
          expected: 'integer\ninteger\ntext\nreal',
          choices: ['integer\ninteger\ninteger\ninteger', 'integer\ninteger\ntext\nreal', 'integer\ntext\ntext\nreal', 'integer\ninteger\nerror\nerror'],
          wrongNotes: {
            'integer\ninteger\ninteger\ninteger': 'SQLite does not force a column’s values to integers. “four” is not a number, so it stays text, and 2.5 cannot be turned into a whole number without losing something, so it stays real.',
            'integer\ntext\ntext\nreal': 'The text “4” looks like a whole number, so SQLite’s INTEGER column converts it to the number 4.',
            'integer\ninteger\nerror\nerror': 'SQLite does not refuse these inserts, which is exactly the trap. PostgreSQL would refuse “four”.',
          },
          hints: [
            'SQLite tries to convert, and keeps the value as it is when it cannot.',
            'The text “4” can become a whole number; “four” cannot; 2.5 is not whole.',
            'integer, integer, text, real.',
          ],
          explanation: 'A column’s type in SQLite is a preference called affinity, not a rule. “4” is converted to 4, “four” stays text and 2.5 stays real. Only a STRICT table or a CHECK would refuse them.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-03-sql-1',
          kind: 'sql-challenge',
          title: 'Find the repeated customers',
          story: 'Aling Nena suspects customers are stored again on every order.',
          prompt: 'List each `customer_name` that appears on more than one order, with how many orders it has, as `order_count`, most orders first.',
          concept: 'GROUP BY and HAVING to find repeats',
          setup: `CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_name TEXT, customer_phone TEXT, product TEXT, quantity INTEGER);
INSERT INTO orders (customer_name, customer_phone, product, quantity) VALUES
  ('Mara Reyes', '09175550101', 'Pandesal (dozen)', 2),
  ('Jun Santos', '09175550102', 'Ensaymada', 1),
  ('Mara Reyes', '09175550101', 'Ensaymada', 3),
  ('Liza Cruz', '09175550103', 'Pan de coco', 1),
  ('Jun Santos', '09175550102', 'Pandesal (dozen)', 2),
  ('Mara Reyes', '09175550101', 'Pandesal (dozen)', 1);`,
          starter: 'SELECT customer_name, COUNT(*) AS order_count\nFROM orders\nGROUP BY customer_name;',
          expected: { columns: ['customer_name', 'order_count'], rows: [['Mara Reyes', 3], ['Jun Santos', 2]], ordered: true },
          solution: 'SELECT customer_name, COUNT(*) AS order_count\nFROM orders\nGROUP BY customer_name\nHAVING COUNT(*) > 1\nORDER BY order_count DESC;',
          hints: [
            'The starter counts every customer, including Liza who has one order. Which keyword filters groups after counting?',
            'HAVING COUNT(*) > 1 goes after GROUP BY, and ORDER BY comes last.',
            'Add HAVING COUNT(*) > 1 and ORDER BY order_count DESC.',
          ],
          explanation: 'GROUP BY collects the rows of each customer, COUNT(*) counts them, HAVING drops Liza (one order) and ORDER BY puts Mara’s three orders before Jun’s two.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-03-match-1',
          kind: 'match',
          title: 'Which rule would have stopped it?',
          prompt: 'Each bad row got into the draft schema. Match it to the constraint that would have refused it.',
          concept: 'choosing the right constraint',
          labels: { terms: 'Bad row that got in', meanings: 'Rule that refuses it' },
          pairs: [
            { term: 'Two customers saved with the same phone number', definition: 'UNIQUE on phone', note: 'Repeats are what UNIQUE forbids.' },
            { term: 'An order saved with no pickup date at all', definition: 'NOT NULL on pickup_date', note: 'A value that must always exist needs NOT NULL.' },
            { term: 'An order line with a quantity of -5', definition: 'CHECK (quantity > 0)', note: 'An impossible value is a CHECK.' },
            { term: 'A status typed as “Pendng”', definition: 'CHECK that status is in the allowed list', note: 'A closed set of choices is a CHECK against the list.' },
          ],
          hints: [
            'Ask whether the problem is a repeat, an empty value, an impossible number or a wrong word.',
            'A repeat is UNIQUE and an empty value is NOT NULL; the other two are CHECK rules about different things.',
            'Phone repeats: UNIQUE. Missing date: NOT NULL. Negative quantity: CHECK on quantity. Misspelled status: CHECK against the list.',
          ],
          explanation: 'Each bad row breaks a different kind of rule: a repeat (UNIQUE), a missing value (NOT NULL), an impossible number (CHECK on quantity) and a value outside a closed list (CHECK on status).',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-03-scenario-1',
          kind: 'scenario',
          title: 'Is this schema safe to ship?',
          prompt: 'Choose what you do before this goes into the app.',
          concept: 'reviewing before shipping',
          situation: 'You asked an AI for the data behind a tutoring app. It gave you one table: sessions(id, tutor TEXT, student TEXT, fee REAL, minutes INTEGER, status TEXT), with no constraints. It works in the demo, and the AI says “this schema is production-ready”.',
          options: [
            { text: 'Run the seven questions: store the fee as centavos with a CHECK, add NOT NULL and CHECK on minutes, restrict status to a list, move tutors and students into their own tables, then try bad rows and expect errors.', consequence: 'You find the gaps yourself and the database now refuses nonsense for every writer, not just the form.', quality: 'best' },
            { text: 'Ship it: it works in the demo and the AI called it production-ready.', consequence: 'Negative minutes, a fee of “free”, and a student typed three ways all go in on day one, and you find out from a confused customer.', quality: 'poor' },
            { text: 'Ask the same AI whether the schema is safe and ship it if it says yes.', consequence: 'You will get a confident yes or a list of tweaks, but you have still not proved anything. A second opinion helps; a test does not rely on opinion.', quality: 'acceptable' },
            { text: 'Leave the schema alone and add validation to the app’s forms.', consequence: 'The form protects one path. A script, an admin tool or an import can still write nonsense straight to the table.', quality: 'poor' },
          ],
          hints: [
            'Who else can write to this table besides the app’s forms?',
            'A rule in the database holds for every writer; a rule in a form holds only for the form.',
            'Apply the seven questions, then prove the result with bad rows that must fail.',
          ],
          explanation: 'Constraints in the database protect every path to the data, and negative tests prove they work. “Production-ready” from the model that wrote the schema is a claim, not evidence.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-database-design-03-q1',
        prompt: 'Why is a REAL (floating-point) column risky for money?',
        choices: [
          'It can only store whole numbers, so prices lose their centavos',
          'It stores the price as text, so totals cannot be added up',
          'It makes every query on the table slower than an INTEGER column',
          'It cannot store values like 0.1 exactly, so sums drift',
        ],
        answer: 3,
        explanation: 'Floating point stores most decimal fractions only approximately: 0.1 + 0.2 prints 0.30000000000000004. Whole centavos in an integer avoid the problem entirely.',
      },
      {
        id: 'ai-database-design-03-q2',
        prompt: 'In SQLite, you insert the text “four” into a column declared INTEGER in an ordinary (non-STRICT) table. What happens?',
        choices: [
          'The insert fails with an error saying the value is not an integer',
          'Stored as text, because a non-STRICT SQLite column can hold any type',
          'It is stored as the number 4, because SQLite converts words to numbers',
          'It is stored as NULL, because the value does not match the column',
        ],
        answer: 1,
        explanation: 'SQLite’s column types are preferences (affinity), not rules. Text that does not look like a number stays text. PostgreSQL would refuse the insert, which is why you test constraints instead of trusting types.',
      },
      {
        id: 'ai-database-design-03-q3',
        prompt: 'Which constraint stops two customers from being saved with the same phone number?',
        choices: [
          'NOT NULL',
          'CHECK (phone > 0)',
          'UNIQUE',
          'DEFAULT',
        ],
        answer: 2,
        explanation: 'UNIQUE refuses a value that already exists in another row. NOT NULL only forbids empty, and a CHECK looks at one row at a time.',
      },
      {
        id: 'ai-database-design-03-q4',
        prompt: 'The AI’s schema passes every click-through in the demo. What is the strongest next check?',
        choices: [
          'Try inserting bad rows on purpose and expect every one to be refused',
          'Ask the AI whether it is happy with its own schema and then trust whatever it says',
          'Count the columns and compare them with a typical bakery schema found online',
          'Run the same demo again with many more good rows in every one of the tables',
        ],
        answer: 0,
        explanation: 'A negative test proves a rule exists. A demo only shows that good data works, an AI’s approval is an opinion, and more good rows prove nothing about bad ones.',
      },
      {
        id: 'ai-database-design-03-q5',
        audience: { max: 'beginner' },
        prompt: 'In everyday words, what does NOT NULL mean for a column?',
        choices: [
          'The box may never be left empty',
          'The box may only ever hold a number',
          'No two rows may have the same value in the box',
          'The box is hidden from people who are not signed in',
        ],
        answer: 0,
        explanation: 'NOT NULL means a value must always be present. “Only numbers” is a type, “no repeats” is UNIQUE, and hiding data is a separate topic (access rules).',
      },
      {
        id: 'ai-database-design-03-q6',
        audience: { min: 'advanced' },
        prompt: 'A web app, a background worker and an admin script all write to the orders table. Where should “quantity must be above zero” be enforced?',
        choices: [
          'Only in the web form, because that is where most of the mistakes are made',
          'Only in the API layer, since every single write goes through the API anyway',
          'In the database as a CHECK, with form checks added for friendly messages',
          'In a nightly clean-up job that deletes any order that has a bad quantity',
        ],
        answer: 2,
        explanation: 'Only a database constraint holds for every writer, including scripts and consoles that skip the app. Form checks improve the experience but are not enforcement, and a nightly job lets bad data live all day.',
      },
    ],
    task: {
      title: 'Break a schema on purpose',
      minutes: 18,
      steps: [
        'Take the schema your AI produced in lesson 2 (or the flat `orders` draft from this lesson). Create it in `sqlite3`.',
        'Write five inserts that should be refused: a negative number, an empty required value, a duplicate, an impossible status and an impossible date. Run them and note which ones the database accepts.',
        'Paste the schema into an AI chat with the review prompt from this lesson. Apply its corrected schema to a fresh database.',
        'Run your five bad inserts again. Every one should now fail; write down the exact error message of each.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask your AI tool to explain each constraint in the corrected schema with a real-life example (a library card, a school form), and check that you can say each one back in your own words.'] },
      { audience: { min: 'advanced' }, steps: ['Run the same bad inserts in PostgreSQL and in SQLite, and list where the two engines disagree. Convert one SQLite table to STRICT and note what changes.'] },
    ],
  },
  {
    id: 'ai-database-design-04',
    day: 4,
    title: 'Relationships between things',
    summary: 'How tables point at each other with keys, the three kinds of connection, what happens on delete, and how to read a join.',
    minutes: 28,
    skills: ['relationships', 'sql-reading', 'schema-review'],
    intro: {
      objectives: [
        'Choose between a one-to-many, many-to-many and one-to-one connection for a pair of things',
        'Explain how a foreign key and a join table link tables, and read a simple JOIN',
        'Decide what should happen to related rows when a row is deleted, and spot a risky CASCADE',
      ],
      why: 'Most data bugs in AI-built apps are relationship bugs: a customer saved twice, an order that points at nobody, a delete that silently erased a year of sales. If you can read the connections in a schema, you can catch these before launch.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'The flat `orders` table had a problem you spotted with question 6: Mara’s name, phone number and email were copied onto every order she ever made. Suppose she changes her phone number. Do you update three rows, or thirty? If you miss one, the bakery now has two phone numbers for one person and no way to tell which is right. The rule that fixes this is simple: **store each fact once, and point to it from everywhere else.** A connection between tables is how you point.',
      },
      { type: 'heading', text: 'Three kinds of connection' },
      {
        type: 'table',
        headers: ['Kind', 'In words', 'Bakery example', 'How it is stored'],
        rows: [
          ['One-to-many', 'One thing has many of another; each of those belongs to one', 'One customer places many orders', 'The “many” table has a column holding the other table’s key'],
          ['Many-to-many', 'Each side can have many of the other', 'An order contains many products; a product is in many orders', 'A third table, a join table, with one row per pair'],
          ['One-to-one', 'Each belongs to exactly one of the other', 'Each customer has one loyalty card', 'A key column that is also UNIQUE (often better to keep it in one table)'],
        ],
        caption: 'Read your description’s connection sentences and match each to one of these.',
      },
      {
        type: 'paragraph',
        text: 'Two words carry all of this. A **primary key** identifies a row inside its own table (you met it in lesson 1). A **foreign key** is a column in one table that holds the primary key of a row in *another* table, written `REFERENCES`, and the database checks that the row it names really exists. In the bakery, `orders.customer_id` is a foreign key to `customers.id`. For the many-to-many connection, one column cannot hold “many products”, so we add a **join table**: `order_items` has one row per product on an order, with a foreign key to the order and one to the product. It is also the right home for facts about the connection itself: the **quantity** and the **price at the time**. Its primary key is the pair (`order_id`, `product_id`), which says an order lists each product once.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The bakery’s connections. “||--o{” reads “one to many”: one customer, many orders.',
        source: `erDiagram
  CUSTOMERS ||--o{ ORDERS : places
  ORDERS ||--|{ ORDER_ITEMS : contains
  PRODUCTS ||--o{ ORDER_ITEMS : appears_in
  CUSTOMERS {
    int id
    text name
    text phone
    text email
  }
  PRODUCTS {
    int id
    text name
    int price_cents
    int active
  }
  ORDERS {
    int id
    int customer_id
    text pickup_date
    text status
  }
  ORDER_ITEMS {
    int order_id
    int product_id
    int quantity
    int unit_price_cents
  }`,
      },
      {
        type: 'code',
        language: 'sql',
        label: 'The connected schema (SQLite; the same design in PostgreSQL uses bigint identity keys and a date column)',
        code: `CREATE TABLE customers (
  id    INTEGER PRIMARY KEY,
  name  TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE
);

CREATE TABLE products (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  price_cents INTEGER NOT NULL CHECK (price_cents > 0),
  active      INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1))
);

CREATE TABLE orders (
  id          INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers (id),
  pickup_date TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'ready', 'picked_up', 'cancelled'))
);

CREATE TABLE order_items (
  order_id         INTEGER NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  product_id       INTEGER NOT NULL REFERENCES products (id) ON DELETE RESTRICT,
  quantity         INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents > 0),
  PRIMARY KEY (order_id, product_id)
);`,
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Think of a restaurant bill. The bill does not copy the customer’s whole life story onto every line; it says “Table 7”, and the host stand knows who is at table 7. A **foreign key** is that “Table 7”: a number on one page that points at a line on another page. The **join table** is the list of dishes on the bill: one line per dish, saying which bill it belongs to, which dish it is, how many, and what price was charged that night. Read the SQL above top to bottom: each `CREATE TABLE` is a page; `REFERENCES customers (id)` means “this number must match a real customer”; `ON DELETE CASCADE` on the order lines means “if the bill is torn up, tear up its lines too”; `PRIMARY KEY (order_id, product_id)` means “a bill lists each dish once”.',
      },
      { type: 'heading', text: 'A trap: the connection that is not enforced' },
      {
        type: 'paragraph',
        text: 'Here is a result you will meet. SQLite does not enforce foreign keys **unless you turn them on for each connection** with `PRAGMA foreign_keys = ON;`. Written into a table definition, `REFERENCES` looks protective and does nothing until then. We ran this for real:',
      },
      {
        type: 'code',
        language: 'sql',
        label: 'Run against the schema above in SQLite 3.54',
        code: `INSERT INTO orders (customer_id, pickup_date) VALUES (99, '2026-11-22');
-- accepted: there is no customer 99

PRAGMA foreign_keys = ON;
INSERT INTO orders (customer_id, pickup_date) VALUES (98, '2026-11-22');
-- Error: FOREIGN KEY constraint failed`,
      },
      {
        type: 'paragraph',
        text: 'Without enforcement the database holds an **orphan**: an order for a customer who does not exist. Delete an order with enforcement off and its lines stay behind pointing at nothing: in our run, two order lines were left. PostgreSQL always enforces foreign keys. If your AI picked SQLite, ask “where is `foreign_keys` switched on?” and make sure the answer is “on every connection”.',
      },
      { type: 'heading', text: 'What happens on delete?' },
      {
        type: 'paragraph',
        text: 'Every foreign key needs an answer to: *if the row I point at is deleted, what happens to me?* You choose with `ON DELETE`. **RESTRICT** (or the default, NO ACTION) refuses the delete while rows still point at it. **CASCADE** deletes the pointing rows too. **SET NULL** keeps them and blanks the link. There is no universally right answer, only the right one for each connection. AI often writes `ON DELETE CASCADE` everywhere because it makes errors go away, and that is the dangerous default.',
      },
      {
        type: 'table',
        headers: ['Connection', 'Choice', 'Why'],
        rows: [
          ['order lines → order', 'CASCADE', 'A line has no meaning without its order'],
          ['order lines → product', 'RESTRICT', 'A product that was sold must not vanish; mark it inactive instead'],
          ['orders → customer', 'RESTRICT', 'Deleting a customer must not erase the bakery’s sales history'],
        ],
        caption: 'The three delete decisions for the bakery. Real SQLite results below.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real results with foreign keys on (customer 1 has orders; product 1 was sold; order 1 has two lines)',
        code: `DELETE FROM customers WHERE id = 1;   -- Error: FOREIGN KEY constraint failed
DELETE FROM products  WHERE id = 1;   -- Error: FOREIGN KEY constraint failed
DELETE FROM orders    WHERE id = 1;   -- works, and its 2 lines go with it
SELECT COUNT(*) FROM order_items;     -- 2 (the lines of the other orders)`,
      },
      { type: 'heading', text: 'Reading a join' },
      {
        type: 'paragraph',
        text: 'Because each fact is stored once, a question that needs two tables must **join** them: line up rows where one table’s foreign key equals the other’s primary key. Read a join as a sentence: “for each order, find the customer whose id is this order’s customer_id.”',
      },
      {
        type: 'code',
        language: 'sql',
        label: 'Orders with the customer’s name (real output below)',
        code: `SELECT o.id, c.name, o.pickup_date, o.status
FROM orders o
JOIN customers c ON c.id = o.customer_id
ORDER BY o.id;`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output',
        code: `id     name     pickup_date  status
--  ----------  -----------  -------
 1  Mara Reyes  2026-11-20   pending
 2  Mara Reyes  2026-11-21   ready
 3  Jun Santos  2026-11-20   pending`,
      },
      {
        type: 'paragraph',
        text: 'The letters `o` and `c` are short nicknames (aliases) so you can say which table a column comes from. Mara’s name now exists once; to change her phone you update one row.',
      },
      {
        type: 'prompt',
        label: 'Ask the AI to defend every connection',
        text: 'Here is the schema you proposed: [paste it]. List every connection between tables. For each one say: (1) is it one-to-many, many-to-many or one-to-one, (2) which column is the foreign key, (3) what ON DELETE behaviour you chose and what real-world event it protects against or allows, and (4) whether any fact is copied instead of referenced, and why. Flag any use of ON DELETE CASCADE that would erase business history. If this is SQLite, tell me where foreign keys are switched on.',
      },
      {
        type: 'version',
        text: 'SQLite documents that foreign key constraints are disabled by default for backwards compatibility and must be enabled for each database connection with PRAGMA foreign_keys = ON (a request made inside a multi-statement transaction has no effect), and lists the ON DELETE actions NO ACTION (the default), RESTRICT, SET NULL, SET DEFAULT and CASCADE. PostgreSQL documents the same actions and notes that declaring a foreign key does not automatically create an index on the referencing column. Checked on this date.',
        checked: CHECKED,
        sources: [DOCS.sqliteFk, DOCS.pgConstraints],
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Review delete behaviour as a data-retention decision, not a convenience: a cascade from a parent to a ledger table destroys the audit trail, and in a system with legal retention duties you usually want soft deletion or anonymisation instead. Index referencing columns yourself (PostgreSQL does not), or a delete on the parent scans the child table and joins on the foreign key degrade as data grows. Beware **polymorphic associations**, where a generated schema stores `owner_type` plus `owner_id` so one column can point at several tables: no foreign key can enforce that, so orphans are possible, and separate nullable keys with a CHECK, or separate join tables, are safer. A join table with a composite primary key is natural when each pair is unique; use a surrogate key if other rows must reference the pairing. Make sure the migration that adds a foreign key to populated data first audits for orphans with an anti-join.',
      },
      {
        type: 'takeaways',
        items: [
          'Store each fact once and point to it: a foreign key is a column holding another table’s primary key.',
          'A one-to-many connection puts a key on the “many” side; a many-to-many connection needs a join table that also holds facts about the pair, like quantity and price at the time.',
          'SQLite ignores foreign keys until PRAGMA foreign_keys = ON on every connection; PostgreSQL always enforces them.',
          'Choose ON DELETE per connection: RESTRICT to protect history, CASCADE only when the child means nothing alone. Be suspicious of CASCADE everywhere.',
          'A JOIN lines up a foreign key with the primary key it points at, so each fact can live in one place.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-04-sql-1',
          kind: 'sql-challenge',
          title: 'Who is waiting on a pending order?',
          story: 'On Thursday evening Aling Nena wants the names behind the pending orders.',
          prompt: 'Show each pending order’s customer `name` and `pickup_date`, earliest date first and, for the same date, by name. The starter only reads the orders table; join the customers.',
          concept: 'reading and writing a join',
          setup: `CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL REFERENCES customers (id), pickup_date TEXT NOT NULL, status TEXT NOT NULL);
INSERT INTO customers (id, name) VALUES (1, 'Mara Reyes'), (2, 'Jun Santos'), (3, 'Liza Cruz');
INSERT INTO orders (id, customer_id, pickup_date, status) VALUES (1, 1, '2026-11-20', 'pending'), (2, 1, '2026-11-21', 'ready'), (3, 2, '2026-11-20', 'pending'), (4, 3, '2026-11-19', 'cancelled');`,
          starter: 'SELECT pickup_date\nFROM orders;',
          expected: { columns: ['name', 'pickup_date'], rows: [['Jun Santos', '2026-11-20'], ['Mara Reyes', '2026-11-20']], ordered: true },
          solution: "SELECT c.name, o.pickup_date\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nWHERE o.status = 'pending'\nORDER BY o.pickup_date, c.name;",
          hints: [
            'The name lives in customers, but orders only holds a customer_id. Which keyword brings the other table in?',
            'JOIN customers c ON c.id = o.customer_id, then keep only the rows where the status is pending.',
            "Finish with ORDER BY o.pickup_date, c.name; Jun sorts before Mara.",
          ],
          explanation: 'The join matches each order to the customer whose id equals its customer_id. WHERE keeps the two pending orders (the ready and cancelled ones drop out), and ORDER BY sorts by date and then by name.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-04-sql-2',
          kind: 'sql-challenge',
          audience: { min: 'intermediate' },
          title: 'What must be baked on 20 November?',
          story: 'The bake list joins three tables: lines, orders (for the date and status) and products (for the name).',
          prompt: 'For orders to pick up on `2026-11-20` that are not cancelled, show each product `name` and the total quantity as `total`, ordered by name.',
          concept: 'joining three tables and summing',
          setup: `CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE orders (id INTEGER PRIMARY KEY, pickup_date TEXT NOT NULL, status TEXT NOT NULL);
CREATE TABLE order_items (order_id INTEGER NOT NULL, product_id INTEGER NOT NULL, quantity INTEGER NOT NULL);
INSERT INTO products (id, name) VALUES (1, 'Pandesal (dozen)'), (2, 'Ensaymada'), (3, 'Pan de coco');
INSERT INTO orders (id, pickup_date, status) VALUES (1, '2026-11-20', 'pending'), (2, '2026-11-21', 'ready'), (3, '2026-11-20', 'pending'), (4, '2026-11-20', 'cancelled');
INSERT INTO order_items (order_id, product_id, quantity) VALUES (1, 1, 2), (1, 2, 3), (2, 1, 1), (3, 3, 4), (4, 1, 6);`,
          starter: 'SELECT p.name, SUM(oi.quantity) AS total\nFROM order_items oi\nJOIN products p ON p.id = oi.product_id\nGROUP BY p.name;',
          expected: { columns: ['name', 'total'], rows: [['Ensaymada', 3], ['Pan de coco', 4], ['Pandesal (dozen)', 2]], ordered: true },
          solution: "SELECT p.name, SUM(oi.quantity) AS total\nFROM order_items oi\nJOIN orders o ON o.id = oi.order_id\nJOIN products p ON p.id = oi.product_id\nWHERE o.pickup_date = '2026-11-20' AND o.status <> 'cancelled'\nGROUP BY p.name\nORDER BY p.name;",
          hints: [
            'The starter ignores the date and the status, which live on orders. Add the missing join.',
            'Join orders o ON o.id = oi.order_id, then filter on o.pickup_date and o.status before grouping.',
            "WHERE o.pickup_date = '2026-11-20' AND o.status <> 'cancelled', then GROUP BY and ORDER BY p.name.",
          ],
          explanation: 'The date and status are facts about the order, so the lines must be joined to orders before filtering. The cancelled order’s six pandesal and the 21 November order are left out, so the pandesal total is 2.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-04-predict-output-1',
          kind: 'predict-output',
          title: 'How many lines survive?',
          prompt: 'Foreign keys are on and the lines cascade from their order. What does the SELECT print?',
          concept: 'ON DELETE CASCADE',
          language: 'sql',
          code: `PRAGMA foreign_keys = ON;
CREATE TABLE orders (id INTEGER PRIMARY KEY);
CREATE TABLE order_items (
  order_id INTEGER REFERENCES orders (id) ON DELETE CASCADE,
  product TEXT
);
INSERT INTO orders VALUES (1), (2);
INSERT INTO order_items VALUES (1, 'pandesal'), (1, 'ensaymada'), (2, 'pan de coco');
DELETE FROM orders WHERE id = 1;
SELECT COUNT(*) FROM order_items;`,
          expected: '1',
          choices: ['3', '2', '1', '0'],
          wrongNotes: {
            '3': 'That would be the answer if nothing cascaded, for example with foreign keys switched off. Here the two lines of order 1 are deleted with it.',
            '2': 'Only the lines of the deleted order go. Order 2’s line stays, and order 1 had two lines, so two are removed from three.',
            '0': 'CASCADE deletes only the lines that point at the deleted order. Order 2 still exists, so its line stays.',
          },
          hints: [
            'Which order is deleted, and how many lines point at it?',
            'ON DELETE CASCADE removes the lines of the deleted order and no others.',
            'Three lines, minus the two that belonged to order 1.',
          ],
          explanation: 'Deleting order 1 cascades to its two lines. The one line that belongs to order 2 remains, so the count is 1.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-04-fix-bug-1',
          kind: 'fix-bug',
          title: 'The orders that point at nobody',
          prompt: 'The AI’s orders table does not link to customers at all. Tap the line to fix, then choose the replacement.',
          concept: 'declaring a foreign key',
          language: 'sql',
          code: `CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  pickup_date TEXT NOT NULL
);`,
          bugLine: 3,
          lineNote: 'That line is fine. Look for the column that should point at another table.',
          fixes: [
            { line: '  customer_id INTEGER NOT NULL REFERENCES customers (id),', correct: true, why: 'REFERENCES makes customer_id a foreign key, so the database checks that the customer exists (with enforcement on).' },
            { line: '  customer_id INTEGER NOT NULL UNIQUE,', correct: false, why: 'UNIQUE would let each customer place only one order, and it still does not link to the customers table.' },
            { line: '  customer_id TEXT NOT NULL,', correct: false, why: 'Changing the type does not create a link; it only makes the column hold words.' },
            { line: '  customer_id INTEGER NOT NULL CHECK (customer_id > 0),', correct: false, why: 'The CHECK only tests that the number is positive. Customer 9999 would still be accepted although no such customer exists.' },
          ],
          hints: [
            'The column holds a number, but nothing says what the number refers to.',
            'The keyword that links a column to another table’s primary key is REFERENCES.',
            'REFERENCES customers (id) on the customer_id column.',
          ],
          explanation: 'A foreign key is declared with REFERENCES. Unique, a different type or a positive-number check all leave the column pointing at nothing in particular.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-04-match-1',
          kind: 'match',
          title: 'Which connection is this?',
          prompt: 'Match each sentence from a data description to how it is stored.',
          concept: 'choosing a connection',
          labels: { terms: 'Sentence from the description', meanings: 'How it is stored' },
          pairs: [
            { term: 'One customer places many orders', definition: 'A customer_id foreign key on the orders table', note: 'The “many” side holds the key.' },
            { term: 'An order contains many products, and each product appears in many orders', definition: 'A join table with one row per order and product', note: 'Many on both sides needs a third table.' },
            { term: 'Each customer has exactly one loyalty card', definition: 'A foreign key that is also UNIQUE', note: 'One-to-one is a key that can only be used once.' },
            { term: 'An order line must keep the price from the day of the sale', definition: 'A price copied onto the line when it is created', note: 'History is a copied fact, not a reference.' },
          ],
          hints: [
            'Ask: does each side have one or many of the other?',
            'Many on both sides needs a third table; history is a copy, not a pointer.',
            'One-to-many: key on the many side. Many-to-many: join table. One-to-one: unique key. History: copy the price.',
          ],
          explanation: 'The kind of connection decides where the key goes. And a fact that must stay as it was is copied on purpose, because pointing at the product would change it later.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-04-scenario-1',
          kind: 'scenario',
          title: 'A customer asks to be deleted',
          prompt: 'Choose how the schema should handle it.',
          concept: 'choosing ON DELETE behaviour',
          situation: 'The AI’s schema made orders.customer_id reference customers with ON DELETE CASCADE. A customer asks the bakery to delete her account. The owner worries about losing three years of sales totals. (Check the rules where you operate; this is a design question, not legal advice.)',
          options: [
            { text: 'Change the link to RESTRICT and handle the request by clearing the customer’s name, phone and email while the orders, totals and dates stay.', consequence: 'Her personal details are gone, the sales history is intact, and an accidental delete of a customer with orders is refused by the database.', quality: 'best' },
            { text: 'Keep CASCADE and delete her row.', consequence: 'Every order she ever made disappears with her, and so do those sales from the monthly totals.', quality: 'poor' },
            { text: 'Make orders.customer_id optional with ON DELETE SET NULL, so orders stay but lose their customer.', consequence: 'The history survives and her details go, but every such order now has no customer at all, and the schema has loosened a rule to make a delete work.', quality: 'acceptable' },
            { text: 'Refuse every deletion request, because the database will not allow the delete anyway.', consequence: 'The schema is safe, but you now cannot honour a request that you may have a duty to honour.', quality: 'poor' },
          ],
          hints: [
            'What must survive: her personal details, or the bakery’s sales history?',
            'You want the history kept and the personal details removable.',
            'RESTRICT protects the history, and clearing the personal fields removes the person.',
          ],
          explanation: 'The delete rule decides what an innocent-looking delete can destroy. RESTRICT keeps history safe, and a deliberate step that clears personal fields honours the request without erasing sales.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-04-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'Four connection words',
          prompt: 'Say each meaning aloud, then tap to check.',
          concept: 'relationship vocabulary',
          cards: [
            { front: 'Primary key', back: 'A number that names one row in its own table.' },
            { front: 'Foreign key', back: 'A column holding the number of a row in another table, linking the two.' },
            { front: 'Join table', back: 'A table of pairs that connects two things that each have many of the other, such as orders and products.' },
            { front: 'ON DELETE CASCADE', back: 'When the row is deleted, the rows pointing at it are deleted too.' },
          ],
          hints: ['Think of a bill number on a restaurant receipt pointing at a table.'],
          explanation: 'These four words describe nearly every connection you will see in a generated schema.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-database-design-04-q1',
        prompt: 'In the bakery schema, why does the orders table hold a customer_id instead of the customer’s name and phone?',
        choices: [
          'So each customer is stored once and every order points to that row',
          'Because a number fits better on a phone screen than a name does',
          'Because the database cannot store text in an orders table at all',
          'So two customers with the same name are always treated as one',
        ],
        answer: 0,
        explanation: 'Storing a customer once means a changed phone number is a one-row update, and every order stays consistent. A key says nothing about screens or text, and two people with the same name still have different keys.',
      },
      {
        id: 'ai-database-design-04-q2',
        prompt: 'An order can include many products and a product can be in many orders. What does the database need to store that?',
        choices: [
          'A column on products holding a list of order numbers',
          'A column on orders holding a list of product names',
          'A join table with one row for each order and product pair',
          'Two copies of the orders table, one for each kind of product',
        ],
        answer: 2,
        explanation: 'A single column cannot hold many values cleanly, so a third table records each pairing as its own row, along with facts about the pair like quantity. Lists inside a column cannot be checked or joined reliably.',
      },
      {
        id: 'ai-database-design-04-q3',
        prompt: 'SQLite accepts an order whose customer_id names a customer that does not exist, although the column says REFERENCES. What is the most likely reason?',
        choices: [
          'REFERENCES is a PostgreSQL keyword and SQLite ignores the word entirely',
          'Foreign key enforcement is off until PRAGMA foreign_keys = ON on that connection',
          'The customers table is empty, and SQLite skips the check on empty tables',
          'The customer_id column must be declared as TEXT for the check to run',
        ],
        answer: 1,
        explanation: 'SQLite parses REFERENCES but only enforces it when foreign keys are switched on for the connection. The check does not depend on the table being empty or on the column type.',
      },
      {
        id: 'ai-database-design-04-q4',
        prompt: 'A schema declares orders.customer_id with ON DELETE CASCADE and a customer row is deleted. What happens to that customer’s orders?',
        choices: [
          'They stay, and the customer column becomes blank',
          'The delete is refused because orders still exist',
          'They are moved into an archive table automatically',
          'They are deleted along with the customer',
        ],
        answer: 3,
        explanation: 'CASCADE passes the delete down to every row that points at the deleted one, so the customer’s whole order history is erased. Refusal would be RESTRICT and a blank link would be SET NULL.',
      },
      {
        id: 'ai-database-design-04-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a foreign key?',
        choices: [
          'A key that lets people open the database if they forgot their password',
          'A column holding the number of a row in another table, linking the two',
          'The first column in every table, used to sort the rows',
          'A second copy of the table that is kept somewhere safe',
        ],
        answer: 1,
        explanation: 'A foreign key points from one table to a row in another, like “Table 7” written on a bill. It is a link, not a password, a sort column or a backup.',
      },
      {
        id: 'ai-database-design-04-q6',
        audience: { min: 'advanced' },
        prompt: 'An AI proposes comments(owner_type TEXT, owner_id INTEGER) so a comment can belong to a post or an order. What is the main problem?',
        choices: [
          'The columns are too short to hold large post numbers reliably over time',
          'Text columns cannot be indexed in PostgreSQL, so lookups will be slow',
          'Every comment query will always be slower than the equivalent join would be',
          'owner_id cannot be a foreign key to two tables, so orphaned comments can exist',
        ],
        answer: 3,
        explanation: 'A polymorphic owner column cannot be a real foreign key, so the database cannot refuse a comment pointing at nothing. Separate nullable keys with a CHECK, or separate join tables, keep the link enforced. Text columns can be indexed.',
      },
    ],
    task: {
      title: 'Connect the tables and test the links',
      minutes: 18,
      steps: [
        'Create the four-table bakery schema from this lesson in `sqlite3` and add a few customers, products, orders and lines (or ask your AI tool to write the inserts).',
        'Without `PRAGMA foreign_keys = ON`, insert an order for customer 99. Then turn it on and try again. Write down both results.',
        'Try to delete a customer who has orders, a product that was sold and an order with lines. Predict each outcome first, then check it.',
        'Run the join from this lesson, then write one join of your own that lists each order with its customer name and its total in pesos (ask your AI tool, then read what it wrote).',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Draw the four tables on paper as boxes, with arrows from each foreign key to the table it points at, and label each arrow “one-to-many”.'] },
      { audience: { min: 'advanced' }, steps: ['Write an anti-join that finds orphaned lines in a database where foreign keys were never enforced, and add the foreign key in a migration only after it returns zero rows.'] },
    ],
  },
  {
    id: 'ai-database-design-05',
    day: 5,
    title: 'Change it safely: migrations',
    summary: 'How to change a live database without losing data: migration files, a backup first, transactions, and the expand-then-contract pattern.',
    minutes: 28,
    skills: ['safe-migrations', 'ai-data-prompts', 'sql-reading'],
    intro: {
      objectives: [
        'Explain what a migration is and why an applied migration is never edited',
        'Follow a safe routine: back up, write the change as a file, test on a copy, run in a transaction, verify',
        'Review a migration an AI wrote for data loss, invented values and missing WHERE clauses',
      ],
      why: 'Designing a schema is a one-time act. Changing it while real orders are arriving is a weekly one, and it is where AI-built apps lose data. A migration habit means a bad change costs you ten minutes, not the business.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'The bakery app has been live for three weeks, with real orders in it. Aling Nena now wants a **pickup time** on every order and a new status, “preparing”. You open your AI tool and type: “add a pickup_time column to orders.” A coding agent may do it in seconds: it connects to the database it can reach and runs the change, right now, on live data. If the statement is wrong, or the connection pointed at production instead of your laptop, you will find out when orders look wrong, and there may be no way back. The habit that prevents this is the **migration**.',
      },
      {
        type: 'paragraph',
        text: 'A migration is **one change to the database, written as a numbered file, run once, in order, and recorded**. The files live in your project (in Git), so the same files build the database on your laptop, on a test copy and in production, and you can read exactly how it got to its present shape. It is the difference between scribbling on the master recipe card and keeping a logbook of every change with a date. The simplest runner you can imagine fits in a few lines. This is a real one; we ran it.',
      },
      {
        type: 'code',
        language: 'bash',
        label: 'migrate.sh: a tiny migration runner for SQLite (real, run with sqlite3 3.54)',
        code: `#!/bin/sh
# usage: ./migrate.sh bakery.db
DB="$1"
sqlite3 "$DB" "CREATE TABLE IF NOT EXISTS schema_migrations (version TEXT PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT (datetime('now')));"
for f in 0*.sql; do
  done=$(sqlite3 "$DB" "SELECT COUNT(*) FROM schema_migrations WHERE version = '$f';")
  if [ "$done" = "0" ]; then
    echo "applying $f"
    { echo "BEGIN;"; cat "$f"; echo "INSERT INTO schema_migrations (version) VALUES ('$f');"; echo "COMMIT;"; } | sqlite3 -bail "$DB" || exit 1
  fi
done`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output: the first run applies three files; the second run applies none',
        code: `$ ./migrate.sh bakery.db
applying 0001_init.sql
applying 0002_add_pickup_time.sql
applying 0003_index_orders_customer.sql
$ ./migrate.sh bakery.db
$ sqlite3 bakery.db "SELECT version FROM schema_migrations;"
0001_init.sql
0002_add_pickup_time.sql
0003_index_orders_customer.sql`,
      },
      {
        type: 'paragraph',
        text: 'Three ideas are in that script. Each file runs **once**, because its name is recorded in a `schema_migrations` table. Files run **in order**, because their names start with a number. And each file runs **inside a transaction**: a group of statements that either all happen or none do. We then added a broken fourth file that tried to add the `pickup_time` column again. Real result: `Parse error near line 3: duplicate column name: pickup_time`, the runner stopped, and the `note` column that came *before* the broken line was not added either. The half-finished change had been rolled back, so the database was exactly as before. PostgreSQL behaves the same way for the same kind of change: we ran a migration that failed on its second statement and the first one vanished.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Imagine the bakery’s recipe for pandesal is pinned on the wall and the ovens are running. You would not scribble on the wall copy mid-bake. You would write the new step on a numbered card, test it on a small tray, and only then pin it up and file the card. A migration file is that numbered card: it says exactly what to change, and the runner pins up each card once. The **transaction** is a safety net held under the change: if any step fails, everything done so far is undone, as if you had never started. The script above reads each numbered file in order, skips the cards already pinned up (recorded in `schema_migrations`), and stops at the first problem.',
      },
      { type: 'heading', text: 'The safe routine' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Back up** the live database first (lesson 8 shows how). Everything below assumes you can go back.',
          '**Write the change as a new numbered file.** Never edit a file that has already run anywhere: other copies of the database ran the old version and would silently differ. A mistake is fixed by a new file.',
          '**Run it on a copy of the real data**, not an empty database, because problems hide in the old rows.',
          '**Check the copy:** row counts before and after, a sample of rows, and the new schema.',
          '**Run it on the live database inside a transaction**, with nobody else changing the tables.',
          '**Verify the app**, and keep the file in version control.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Be careful with agents. A coding agent that holds a database connection can run anything. Supabase’s documentation for connecting AI tools says to keep manual approval on and review each tool call, to limit the server to one project, to use read-only mode where you can, and to connect to production data only when the task needs it. The rule for this course: **an AI writes the migration file; you review it and you run it.**',
      },
      { type: 'heading', text: 'Reading a migration the AI wrote' },
      {
        type: 'paragraph',
        text: 'Look at our own `0002` file: `ALTER TABLE orders ADD COLUMN pickup_time TEXT NOT NULL DEFAULT \'08:00\';`. SQLite requires a default when you add a NOT NULL column, so the AI supplied one. Run it and every existing order now reads 08:00. But nobody chose 08:00 for those orders. **A default invents a fact for every old row.** For a pickup time that may be harmless; for a price or a status it can be a quiet lie. The safer path for a fact you cannot know is to add the column as optional, **backfill** it from real information where you have it, and only then make it required.',
      },
      {
        type: 'code',
        language: 'sql',
        label: 'Changing a CHECK in PostgreSQL: one transaction, so there is no moment with no rule (real run on PostgreSQL 14)',
        code: `begin;
alter table orders drop constraint orders_status_check;
alter table orders add constraint orders_status_check
  check (status in ('pending', 'preparing', 'ready', 'picked_up', 'cancelled'));
commit;`,
      },
      { type: 'heading', text: 'Changes that destroy: expand, then contract' },
      {
        type: 'paragraph',
        text: 'Dropping a column, dropping a table, changing a type and renaming are the changes that lose data or break the running app. Suppose the AI proposes renaming `customers.phone` to `mobile` by dropping `phone` and adding `mobile`. Every phone number is gone, and the live app that still reads `phone` breaks at once. The safe pattern is **expand and contract**: *expand* by adding the new column and copying the data, *move* the app to the new column, and only later *contract* by dropping the old one, each step its own migration. Along the way both columns exist, so the live app never breaks. We ran the expand step: after `ADD COLUMN mobile` and `UPDATE customers SET mobile = phone`, every row held the number in both columns.',
      },
      {
        type: 'paragraph',
        text: 'The last classic is the statement with no `WHERE`. `UPDATE orders SET status = \'cancelled\';` is perfectly valid SQL and changes **every row**. Wrapping risky statements in a transaction lets you look before you commit. Real run: we ran the update inside `begin;`, counted, and then rolled back.',
      },
      {
        type: 'code',
        language: 'sql',
        label: 'Look before you commit (PostgreSQL 14, real output in the comments)',
        code: `begin;
update orders set status = 'cancelled';
select count(*) as rows_that_would_change from orders where status = 'cancelled';
-- rows_that_would_change = 3   (all of them; we meant one)
rollback;
-- statuses are back to pending, preparing and ready`,
      },
      {
        type: 'prompt',
        label: 'Ask the AI for the migration and its risks',
        text: 'I need to add a pickup time to every order in the bakery database (PostgreSQL, live data, 3 weeks of orders). Write a numbered migration file, not a statement to run. Then list: (1) what it does to existing rows and whether it invents any values, (2) anything that drops, truncates or deletes, (3) whether it runs inside a transaction, (4) how I would undo it, and (5) the checks I should run on a copy first. Do not connect to any database.',
      },
      {
        type: 'version',
        text: 'Supabase’s migration documentation describes timestamped files created with supabase migration new in supabase/migrations/, applied locally with supabase migration up or supabase db reset, and pushed to a linked project with supabase db push; it advises that once you use migrations you make remote schema changes through migration files rather than the dashboard. Its MCP guidance recommends manual approval of tool calls, project scoping and read-only mode for AI tools, and its AI prompt for writing migrations asks for a header comment, comments on each step, extra comments on destructive commands and RLS on new tables. SQLite’s ALTER TABLE page says a NOT NULL column added with ADD COLUMN needs a default other than NULL, and describes a 12-step procedure for changes it cannot make directly. Checked on this date.',
        checked: CHECKED,
        sources: [DOCS.supaMigrations, DOCS.supaMcp, DOCS.supaMigrationPrompt, DOCS.sqliteAlter],
      },
      {
        type: 'paragraph',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: '**At your level.** Write the undo before you run the change. For an additive migration the undo may be a single DROP COLUMN; for a destructive one it is your backup and a restore you have practised, because a “down” file cannot bring back dropped data. When you ask an AI for a migration, ask for the undo in the same answer and read both.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Treat the schema and the code as two deployments that overlap: with more than one app instance, or a rolling release, old and new code run against the same database at the same time, so every migration must work for both. That is why expand and contract is separate steps, and why a column rename is never one step. Check your database’s documentation for which ALTER TABLE forms rewrite a table or hold a strong lock, and run those on a large table with the locking and timeout settings you intend to use in production. Make migrations part of CI: apply them to an empty database and to a restored copy of production, then run the tests. Prefer forward-fixes to rollbacks once data has been written. Supabase’s own AI prompt for writing migrations asks for a header comment on purpose and affected tables, comments on every step, extensive comments on destructive commands and RLS on every new table; copy that discipline into your instructions file.',
      },
      {
        type: 'takeaways',
        items: [
          'A migration is one change written as a numbered file, run once in order and recorded, so every copy of the database follows the same history.',
          'Never edit a migration that has run anywhere; fix a mistake with a new file.',
          'Back up, test on a copy of real data, then run the change inside a transaction so a failure undoes everything.',
          'A default added to satisfy NOT NULL invents a value for every old row; backfill from real information instead.',
          'Destructive changes use expand, then contract: add the new column, move the app, drop the old one later.',
          'Wrap risky UPDATE and DELETE statements in a transaction and check the count before you commit.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-05-arrange-1',
          kind: 'arrange',
          title: 'A safe migration, in order',
          prompt: 'Put the steps of changing the live bakery database in the safe order, first at the top.',
          concept: 'the safe migration routine',
          language: 'text',
          solution: [
            'Take a backup of the live database',
            'Write the change as a new numbered migration file',
            'Run it against a copy of the real data',
            'Check row counts and a sample of rows on the copy',
            'Run it on the live database inside a transaction',
            'Verify the app and keep the migration file in version control',
          ],
          reasons: [
            'Everything after this assumes you can go back, so the backup comes first.',
            'The change is written down as a file so the same steps can be repeated and reviewed.',
            'The copy of real data shows problems hidden in old rows without risking the real ones.',
            'Counts and a sample show whether the change did what you expected.',
            'Only now does it touch live data, inside a transaction so a failure undoes it.',
            'Last you confirm the result and file the migration so every copy of the database follows it.',
          ],
          hints: [
            'What must exist before you change anything you cannot easily undo?',
            'Test on a copy before the live database, and check the result before trusting it.',
            'Backup, file, copy, check, live in a transaction, verify.',
          ],
          explanation: 'The routine moves from safest to riskiest: you can go back (backup), the change is reviewable (file), it is proved on a copy (run and check), and only then does it touch live data (in a transaction), after which you verify.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-05-fix-bug-1',
          kind: 'fix-bug',
          title: 'Cancel one order, not all of them',
          prompt: 'The AI wrote this to cancel order 7 only. Tap the line with the bug, then choose the fix.',
          concept: 'unbounded UPDATE',
          language: 'sql',
          code: `BEGIN;
UPDATE orders SET status = 'cancelled';
COMMIT;`,
          bugLine: 2,
          lineNote: 'BEGIN and COMMIT are fine. Look at the statement that changes data.',
          fixes: [
            { line: "UPDATE orders SET status = 'cancelled' WHERE id = 7;", correct: true, why: 'WHERE id = 7 limits the change to the single order, because id is the primary key.' },
            { line: "UPDATE orders SET status = 'cancelled' WHERE id > 7;", correct: false, why: 'This cancels every order after number 7 and leaves order 7 itself alone.' },
            { line: "UPDATE orders SET status = 'cancelled' WHERE status = 'cancelled';", correct: false, why: 'This only touches rows that are already cancelled, so it changes nothing useful.' },
            { line: "UPDATE orders SET status = 'cancelled' LIMIT 1;", correct: false, why: 'LIMIT 1 does not say which order, so the row it changes is arbitrary.' },
          ],
          hints: [
            'What does an UPDATE do when it has no WHERE?',
            'You need a condition that is true for exactly one row.',
            'The primary key id identifies one order: WHERE id = 7.',
          ],
          explanation: 'Without WHERE, an UPDATE changes every row. Filtering on the primary key targets exactly one. Running the statement inside a transaction lets you check the count before COMMIT.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-05-fill-blank-1',
          kind: 'fill-blank',
          title: 'Finish the migration file',
          prompt: 'Complete this migration file so the change runs in a transaction and is recorded. Pick from the bank.',
          concept: 'a migration inside a transaction',
          language: 'sql',
          code: `-- 0005_add_order_note.sql: let staff add a note to an order
___;
ALTER TABLE orders ADD COLUMN note ___;
INSERT INTO schema_migrations (version) VALUES ('0005_add_order_note.sql');
___;`,
          blanks: [
            { answers: ['BEGIN'], feedback: 'The file should open a transaction first, so everything below can be undone together.' },
            { answers: ['TEXT'], feedback: 'A note is words, so its type is text.' },
            { answers: ['COMMIT'], feedback: 'The transaction ends with COMMIT once every statement has worked.' },
          ],
          bank: ['BEGIN', 'COMMIT', 'TEXT', 'ROLLBACK', 'INTEGER', 'DROP'],
          hints: [
            'The first line opens the group of statements that succeed or fail together.',
            'The note is text, and the transaction is closed with the word that saves the changes.',
            'BEGIN, TEXT, COMMIT.',
          ],
          explanation: 'BEGIN opens the transaction, the new column holds TEXT, the version is recorded so the file never runs twice, and COMMIT saves everything at once. ROLLBACK would undo it.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-05-scenario-1',
          kind: 'scenario',
          title: 'The AI wants to rename a column',
          prompt: 'Choose what you do with the AI’s migration.',
          concept: 'expand and contract',
          situation: 'The app is live and reads customers.phone. Your AI tool writes a migration: ALTER TABLE customers DROP COLUMN phone; ALTER TABLE customers ADD COLUMN mobile TEXT;. It offers to run it for you on the production database.',
          options: [
            { text: 'Reject it. Add the mobile column and copy the phone numbers across in one migration, move the app to mobile, and drop phone in a later migration after a backup.', consequence: 'No data is ever lost and the live app keeps working at each step, because both columns exist while the app switches.', quality: 'best' },
            { text: 'Let the agent run it on production now; you will re-enter the numbers.', consequence: 'Every phone number is gone at once, and the live app breaks until it is changed to read mobile.', quality: 'poor' },
            { text: 'Replace both statements with a single RENAME COLUMN and run it after a backup.', consequence: 'The data survives and the file is small, but the live app that still reads phone fails until the new code is deployed at the same moment.', quality: 'acceptable' },
            { text: 'Edit the original 0001 migration so the column is called mobile from the start.', consequence: 'Databases that already ran 0001 still have phone, so your laptop and production now disagree and nothing records the difference.', quality: 'poor' },
          ],
          hints: [
            'What is lost if phone is dropped, and what is broken while the app still reads it?',
            'Keep the old column alive while the app switches over.',
            'Expand (add and copy), move the app, then contract (drop) later.',
          ],
          explanation: 'Expand and contract keeps both columns until the app has moved, so nothing is lost and nothing breaks. A one-step rename keeps the data but breaks the live app, and editing an applied migration makes databases disagree.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-05-match-1',
          kind: 'match',
          title: 'Which habit would have prevented it?',
          prompt: 'Match each migration accident to the habit that prevents it.',
          concept: 'migration habits',
          labels: { terms: 'What went wrong', meanings: 'Habit that prevents it' },
          pairs: [
            { term: 'An agent ran ALTER TABLE straight on the live database and the result was wrong', definition: 'Back up first and run the change on a copy', note: 'Going back needs a backup, and surprises show up on a copy first.' },
            { term: 'Migration 3 was edited after it ran in production, so the laptop and production differ', definition: 'Never edit an applied migration; add a new one', note: 'Every copy of the database must follow one history.' },
            { term: 'A rename broke the live app for ten minutes', definition: 'Expand and contract: add, move the app, then drop', note: 'Old and new must both work while the app switches.' },
            { term: 'An UPDATE with no WHERE changed every row', definition: 'Run it in a transaction and check the count before COMMIT', note: 'A transaction lets you look before you keep it.' },
          ],
          hints: [
            'Which habit would have stopped each one, not just helped afterwards?',
            'The edited migration is about history, the rename about overlap, the UPDATE about looking before committing.',
            'Back up and copy; new file instead of an edit; expand and contract; transaction and count.',
          ],
          explanation: 'Each accident has a specific cause and a specific guard: backups and copies for surprises, new files for a single history, expand and contract for overlap, and a transaction with a count for statements that touch too much.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-05-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'Four safety words',
          prompt: 'Say each in your own words, then tap to check.',
          concept: 'migration vocabulary',
          cards: [
            { front: 'Migration', back: 'One change to the database, written as a numbered file, run once and kept.' },
            { front: 'Backup', back: 'A copy of the data you can go back to if a change goes wrong.' },
            { front: 'Transaction', back: 'A group of steps that either all happen or none do.' },
            { front: 'Rollback', back: 'Undoing everything a transaction did so far, as if it never started.' },
          ],
          hints: ['Think of changing the master recipe: card, tray test, then the wall.'],
          explanation: 'These four words are the safety net under every change to a live database.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-database-design-05-q1',
        prompt: 'Why should you never edit a migration file after it has already been applied to a live database?',
        choices: [
          'Git refuses to save any file that has already been run on a database',
          'The file would grow too large to run a second time on the database',
          'Copies that already ran the old version would silently differ',
          'The database deletes each migration file as soon as it has run it',
        ],
        answer: 2,
        explanation: 'Every copy of the database must follow the same history. If an applied file changes, copies that ran the old version and copies that run the new one end up different with nothing to show it.',
      },
      {
        id: 'ai-database-design-05-q2',
        prompt: 'A migration adds `pickup_time TEXT NOT NULL DEFAULT \'08:00\'` and every existing order now shows 08:00. What is the concern?',
        choices: [
          'SQLite will refuse to apply any column that has a default value at all',
          'The default makes every later query on that column slower to run',
          'A NOT NULL column must always be filled in by hand, one row at a time',
          'The default invents a fact for every old order that nobody chose',
        ],
        answer: 3,
        explanation: 'A default added to satisfy NOT NULL writes the same value into every old row. When the true value is unknown, add the column as optional, backfill from real information, then make it required.',
      },
      {
        id: 'ai-database-design-05-q3',
        prompt: 'You must rename customers.phone to customers.mobile on a live app without breaking it. What is the safe order?',
        choices: [
          'Add mobile and copy the numbers, move the app, then drop phone later',
          'Drop phone, add mobile, and ask customers to enter their numbers again',
          'Rename the column in the hosting dashboard while the app keeps running',
          'Edit the very first migration so the column was called mobile from the start',
        ],
        answer: 0,
        explanation: 'Expand, move, contract: both columns exist while the app switches over. Dropping loses data, a one-step rename breaks the running app, and editing an applied file makes databases disagree.',
      },
      {
        id: 'ai-database-design-05-q4',
        prompt: 'A migration file with three statements runs inside a transaction and the second statement fails. What is the state of the database?',
        choices: [
          'The first statement stays applied so you can finish the rest by hand later',
          'None of the three changes is kept, because the transaction is rolled back',
          'The backup is replaced with the half-changed database automatically, to be safe',
          'The migration is recorded as applied but the failed part is skipped over',
        ],
        answer: 1,
        explanation: 'A transaction either keeps all of its changes or none. In the real runs, the earlier ADD COLUMN in the same file vanished when a later line failed, and the migration was not recorded.',
      },
      {
        id: 'ai-database-design-05-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a migration?',
        choices: [
          'A numbered file describing one change to the database, run once',
          'Moving the whole app and its screens from one phone to another phone',
          'Copying the entire database onto a USB drive so that it is safe',
          'A setting that makes the database answer all questions much faster',
        ],
        answer: 0,
        explanation: 'A migration is one recorded change to the database’s shape. Copying data is a backup, and speed is a separate topic.',
      },
      {
        id: 'ai-database-design-05-q6',
        audience: { min: 'advanced' },
        prompt: 'Your CI applies every migration to an empty database before the tests run. What does that catch that a code review often misses?',
        choices: [
          'Spelling mistakes in the labels of the buttons shown in the app screens',
          'Whether the production server will have enough free disk space',
          'Migrations that fail on a fresh build or work only in one order',
          'Slow queries that appear only when production has millions of rows',
        ],
        answer: 2,
        explanation: 'Building from nothing proves the migration history is complete and ordered. It does not measure disk space or production-sized performance, and it does not read button labels.',
      },
    ],
    task: {
      title: 'Run a migration, break one, undo one',
      minutes: 20,
      steps: [
        'Create a folder with `0001_init.sql` (the four-table schema), `0002_add_pickup_time.sql` and the `migrate.sh` script from this lesson. Run it on a new `bakery.db` twice and confirm the second run does nothing.',
        'Add a deliberately broken `0003` file (add a column that already exists). Run the script, then check with `sqlite3 bakery.db ".schema orders"` that nothing from the broken file was applied.',
        'Make a backup with `sqlite3 bakery.db "VACUUM INTO \'backup.db\'"`. Then run `UPDATE orders SET status = \'cancelled\';` inside `BEGIN;` ... `ROLLBACK;` after counting, and confirm the data is unchanged.',
        'Ask your AI tool for a migration that adds an order note column, using the migration prompt in this lesson. Read its answer against the six safe steps and note which it skipped.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Explain to a friend, using the recipe-card idea, why a migration file is never edited after it has run.'] },
      { audience: { min: 'advanced' }, steps: ['Script the expand and contract of a column rename as three migration files and a smoke test that the old and the new code both read the right value between them.'] },
    ],
  },
  {
    id: 'ai-database-design-06',
    day: 6,
    title: 'Read and check the queries AI writes',
    summary: 'Five checks for any query an AI hands you: the right rows, the right joins, NULL traps, safe parameters and a plan that does not read every row.',
    minutes: 30,
    skills: ['query-checking', 'sql-reading', 'ai-data-prompts'],
    intro: {
      objectives: [
        'Check an AI-written query by running it on data where you already know the answer',
        'Spot the common wrong-answer traps: inner versus left join, join fan-out and NULL comparisons',
        'Keep user input out of SQL text with parameters, and read a query plan to see whether an index is used',
      ],
      why: 'A wrong query does not crash. It returns a confident, plausible, wrong number that ends up on a report or a screen. Checking queries is the part of AI-assisted data work that you can never hand back to the AI.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'You ask your AI tool: “How many orders has each customer made?” It writes a neat query, it runs without error, and it prints numbers. Aling Nena reads “Mara Reyes: 3” and says “no, she ordered twice.” Who is right? The query ran perfectly. It just answered a different question. This lesson is about not trusting a query because it ran. Here is the AI’s query, run for real against our bakery data, where we know the truth by hand: Mara has two orders (one with two lines), Jun has one, and Liza has none.',
      },
      {
        type: 'code',
        language: 'sql',
        label: 'The AI’s query for “orders per customer”',
        code: `SELECT c.name, COUNT(o.id) AS orders
FROM customers c
JOIN orders o ON o.customer_id = c.id
JOIN order_items oi ON oi.order_id = o.id
GROUP BY c.id;`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output (the truth is Mara 2, Jun 1, Liza 0)',
        code: `   name     orders
----------  ------
Mara Reyes       3
Jun Santos       1`,
      },
      {
        type: 'paragraph',
        text: 'Two mistakes in one result. Mara shows **3** instead of 2, and **Liza is missing**. Both are classic. The first is **join fan-out**: joining `order_items` repeats each order once per line, so Mara’s order with two lines is counted twice. The second is an **inner join**: `JOIN` keeps only customers that have a match, so a customer with no orders vanishes. The fixes are small: join from the customers outward with `LEFT JOIN` (keep every customer, even with no match) and count only the orders, which do not need `order_items` at all. This is what the safer version prints:',
      },
      {
        type: 'code',
        language: 'sql',
        label: 'Corrected: every customer, orders counted once (real output below)',
        code: `SELECT c.name, COUNT(o.id) AS orders
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id;`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real output',
        code: `   name     orders
----------  ------
Mara Reyes       2
Jun Santos       1
Liza Cruz        0`,
      },
      {
        type: 'paragraph',
        text: 'Notice what found these. Not reading harder: **running the query on a few rows whose answer you already knew**. That is check number two below. If you had run it on 50,000 real rows, nobody would have noticed that Mara’s count was inflated.',
      },
      { type: 'heading', text: 'The five checks' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Say it in words.** Read the query as a sentence and compare it with your question. “For each customer, count their orders” is not “count the order lines joined to each customer”.',
          '**Run it on known data.** Keep a tiny seed (a handful of rows) whose results you can compute by hand, including awkward cases: a customer with no orders, an order with several lines, a missing value.',
          '**Check the joins.** Inner `JOIN` drops rows with no match; `LEFT JOIN` keeps them. A join to a “many” table repeats the other side’s rows, so counts and sums can inflate; count `DISTINCT` ids or join later.',
          '**Check for NULL.** A missing value is not equal to anything, including another missing value, and not different from anything either. `WHERE email <> \'mara@example.com\'` silently drops every customer with no email (in our data it returned only Liza and left out Jun). Add `OR email IS NULL` if you want them.',
          '**Check how it is sent and how much it returns.** Values go in as parameters, results have a `LIMIT` when a screen only needs a page, and nothing selects every column of a big table (`SELECT *`) without a reason.',
        ],
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** A query is a question you ask the database, and the database always answers the question you *wrote*, not the one you *meant*. It is like sending a helper to the market with a list: if you wrote “buy bread” and meant “buy pandesal”, you get bread. So after the AI writes a question, read it back in plain words and test it on a tiny list where you already know the answer. A **join** lines up two lists. `JOIN` keeps only the names that appear in both lists, so a customer who has never ordered disappears. `LEFT JOIN` keeps everyone from the first list, even if there is no match. In the SQL above, `COUNT(o.id)` counts how many orders were found for each customer, and `GROUP BY c.id` says “do this once per customer”.',
      },
      { type: 'heading', text: 'Never paste values into SQL' },
      {
        type: 'paragraph',
        text: 'AI-written code often builds a query by gluing the user’s input into the text. Here is a real run in Node.js 22 with its built-in SQLite, against the same bakery data. The first function glues the phone number in; the second sends it separately as a **parameter**, the `?` placeholder.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Two ways to look up orders by phone (Node 22, built-in node:sqlite, which is still experimental)',
        code: `import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('bakery.db');

function findOrdersUnsafe(phone) {
  const sql = "SELECT o.id FROM orders o JOIN customers c ON c.id = o.customer_id WHERE c.phone = '" + phone + "'";
  return db.prepare(sql).all();
}

function findOrdersSafe(phone) {
  const sql = 'SELECT o.id FROM orders o JOIN customers c ON c.id = o.customer_id WHERE c.phone = ?';
  return db.prepare(sql).all(phone);
}`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real results',
        code: `findOrdersUnsafe('09175550102')        -> 1 order   (Jun's)
findOrdersUnsafe("x' OR '1'='1")       -> 3 orders  (everyone's!)
  the SQL that actually ran: ... WHERE c.phone = 'x' OR '1'='1'
findOrdersSafe("x' OR '1'='1")         -> 0 orders
findOrdersSafe('09175550102')          -> 1 order`,
      },
      {
        type: 'paragraph',
        text: 'When the input is glued in, a customer can type a quote and change the *meaning* of the query: this is called **SQL injection**. With a parameter, the database receives the SQL and the value separately, so the value can never be read as part of the command. This is the same idea whether your app uses SQLite, PostgreSQL or a library that hides the SQL: **user-typed values travel as parameters, never as text in the query.** If you see `+` or a template string building SQL from input, stop.',
      },
      { type: 'heading', text: 'Is it fast enough? Ask for the plan' },
      {
        type: 'paragraph',
        text: 'A correct query can still be slow, and “slow” only shows up when there is lots of data. You can ask the database how it intends to answer with `EXPLAIN`. We built a table of 50,000 orders for 2,000 customers and asked for one customer’s orders. Real SQLite plans, before and after adding an index on the filter column:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'EXPLAIN QUERY PLAN on 50,000 orders (SQLite 3.54)',
        code: `SELECT id, pickup_date FROM orders WHERE customer_id = 42;

before:  SCAN orders
after CREATE INDEX idx_orders_customer ON orders (customer_id);
after:   SEARCH orders USING INDEX idx_orders_customer (customer_id=?)`,
      },
      {
        type: 'paragraph',
        text: '**SCAN** means “read every row”; **SEARCH … USING INDEX** means “jump straight to the matching rows”, like using a book’s index instead of reading every page. PostgreSQL says the same in its own words. We ran the same data in PostgreSQL 14:',
      },
      {
        type: 'code',
        language: 'text',
        label: 'EXPLAIN in PostgreSQL 14 on 50,000 orders (costs are the planner’s estimates, in arbitrary units)',
        code: `before:  Seq Scan on orders  (cost=0.00..1042.00 rows=25 width=12)
           Filter: (customer_id = 42)

after:   Bitmap Heap Scan on orders  (cost=4.48..86.43 rows=25 width=12)
           ->  Bitmap Index Scan on orders_customer_id_idx
                 Index Cond: (customer_id = 42)
         EXPLAIN ANALYZE: Execution Time: 0.098 ms`,
      },
      {
        type: 'paragraph',
        text: 'Three cautions. First, indexes are not free: each one takes space and slows writes a little, so index the columns you filter and join on, not every column. PostgreSQL does **not** automatically index a foreign key column, so the AI’s foreign keys (like `orders.customer_id`) are the first place to look. Second, plans depend on the amount of data and on the database’s statistics, so check them on realistic volumes, not on ten dev rows. Third, `EXPLAIN ANALYZE` in PostgreSQL really **runs** the statement; for an UPDATE or DELETE wrap it in a transaction and roll back.',
      },
      {
        type: 'prompt',
        label: 'Make the AI show its work',
        text: 'Here is the schema: [paste it] and this tiny seed data: [paste inserts]. Write a query for: [your question in words]. Then (1) restate the query in plain words, (2) give the exact rows it should return on the seed, and (3) say which joins could drop rows (inner joins) or repeat rows (joins to a many-side table) and how you avoided each. Use parameters (?) for any value, never string concatenation. Finally, tell me which columns should be indexed and give me the EXPLAIN command to verify it.',
      },
      {
        type: 'version',
        text: 'SQLite documents EXPLAIN QUERY PLAN output such as SCAN (a full scan) and SEARCH … USING INDEX, and warns that the output format may change between releases and should not be parsed by applications. PostgreSQL documents that EXPLAIN shows the planner’s plan, that adding ANALYZE actually executes the statement (use a transaction and rollback for INSERT, UPDATE and DELETE), and that the planner depends on up-to-date statistics. PostgreSQL’s constraints page says declaring a foreign key does not automatically create an index on the referencing columns. The injection demonstration used Node 22’s built-in node:sqlite module, which the Node documentation lists as experimental (stability 1.1, active development) though no flag is needed since v22.13.0; its prepared statements accept bound parameters. Checked on this date.',
        checked: CHECKED,
        sources: [DOCS.sqliteEqp, DOCS.pgExplain, DOCS.pgConstraints, DOCS.nodeSqlite],
      },
      {
        type: 'paragraph',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: '**At your level.** Build a small seed file once and keep it with the project: a customer with no orders, an order with several lines, a NULL email, two people with the same name. Every time an AI writes or changes a query, run it on the seed and compare with the answer you wrote down beforehand. This single habit catches most wrong-answer queries before they reach a screen.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Review generated data-access code for: values concatenated into SQL (parameterise everything, including `LIMIT` values), N+1 patterns where an ORM issues one query per row, unbounded result sets (paginate; offset paging reads and discards rows, so keyset paging scales better for deep pages), and missing indexes on foreign keys and filter columns. Verify plans on production-sized data with current statistics (`ANALYZE`), not on a development copy, and re-check them after the data grows. Run `EXPLAIN (ANALYZE, BUFFERS)` inside a transaction you roll back. Remember that a plan is a snapshot: the planner can change its mind as data and statistics change, so alert on slow queries in production rather than assuming an index is used. SQLite’s plan text is for people, not parsers.',
      },
      {
        type: 'takeaways',
        items: [
          'A query that runs is not a query that is right; read it in words and run it on a tiny seed whose answer you know.',
          'Inner JOIN drops rows with no match, LEFT JOIN keeps them, and a join to a many-side table repeats rows, so counts can inflate.',
          'A missing value (NULL) is never equal to anything, so WHERE x <> y silently drops rows where x is empty.',
          'Values typed by users travel as parameters (?), never glued into the SQL text, or a quote can change the meaning of the query.',
          'EXPLAIN shows whether a query scans every row or uses an index; check plans on realistic data, and index the columns you filter and join on.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-06-sql-1',
          kind: 'sql-challenge',
          title: 'Include the customers with no orders',
          story: 'Aling Nena wants a loyalty mailing list that also shows who has never ordered.',
          prompt: 'Show every customer’s `name` and how many orders they have as `orders`, including customers with none. Most orders first, then by name. The starter drops customers with no orders: fix the join.',
          concept: 'LEFT JOIN and COUNT',
          setup: `CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL);
INSERT INTO customers (id, name) VALUES (1, 'Mara Reyes'), (2, 'Jun Santos'), (3, 'Liza Cruz'), (4, 'Ben Lim');
INSERT INTO orders (id, customer_id) VALUES (1, 1), (2, 1), (3, 2);`,
          starter: 'SELECT c.name, COUNT(o.id) AS orders\nFROM customers c\nJOIN orders o ON o.customer_id = c.id\nGROUP BY c.id\nORDER BY orders DESC, c.name;',
          expected: { columns: ['name', 'orders'], rows: [['Mara Reyes', 2], ['Jun Santos', 1], ['Ben Lim', 0], ['Liza Cruz', 0]], ordered: true },
          solution: 'SELECT c.name, COUNT(o.id) AS orders\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id\nGROUP BY c.id\nORDER BY orders DESC, c.name;',
          hints: [
            'Ben and Liza are missing. Which kind of join drops customers with no match?',
            'Change JOIN to LEFT JOIN so every customer is kept; COUNT(o.id) counts only real orders.',
            'LEFT JOIN orders o ON o.customer_id = c.id, and keep the rest of the query.',
          ],
          explanation: 'An inner JOIN removes customers with no matching order. LEFT JOIN keeps them with empty order columns, and COUNT(o.id) ignores those empty values, so Ben and Liza count 0.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-06-predict-output-1',
          kind: 'predict-output',
          title: 'How many “orders” after the join?',
          prompt: 'Mara has two orders; the first has three lines. What does this query print?',
          concept: 'join fan-out',
          language: 'sql',
          code: `CREATE TABLE orders (id INTEGER PRIMARY KEY, customer TEXT);
CREATE TABLE lines (order_id INTEGER, product TEXT);
INSERT INTO orders VALUES (1, 'Mara'), (2, 'Mara');
INSERT INTO lines VALUES (1, 'pandesal'), (1, 'ensaymada'), (1, 'pan de coco'), (2, 'pandesal');
SELECT COUNT(o.id) FROM orders o JOIN lines l ON l.order_id = o.id;`,
          expected: '4',
          choices: ['2', '4', '3', '1'],
          wrongNotes: {
            '2': 'That is the true number of orders, but the join repeats an order once for every line, and COUNT(o.id) counts every repeat.',
            '3': 'Three is the number of lines on the first order only. The join produces one row per line in total.',
            '1': 'The query does not group, so it counts all joined rows, not one per customer.',
          },
          hints: [
            'How many rows does the join produce: one per order or one per line?',
            'There are four lines in total, and every line matches exactly one order.',
            'Four joined rows, and COUNT(o.id) counts each of them.',
          ],
          explanation: 'The join produces one row for every line (three for order 1, one for order 2), so COUNT(o.id) is 4. COUNT(DISTINCT o.id) would give the true 2.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-06-code-1',
          kind: 'code-challenge',
          title: 'Build the query safely',
          story: 'The AI’s search code glues filters into the SQL. You will write the safe version.',
          prompt: 'Write `buildOrderQuery(filters)`. `filters` may have `status` and/or `pickupDate`. Return `{ sql, params }`. The base is `SELECT id, customer_id, pickup_date, status FROM orders`. For each filter that is present add a condition `status = ?` and/or `pickup_date = ?` (in that order) joined with ` AND ` after ` WHERE `, and put the values, in the same order, in `params`. Never put a value into the SQL text.',
          concept: 'parameterised queries',
          language: 'javascript',
          starter: `function buildOrderQuery(filters) {
  // return { sql, params }
}`,
          tests: {
            kind: 'function',
            fn: 'buildOrderQuery',
            cases: [
              { args: [{}], expected: { sql: 'SELECT id, customer_id, pickup_date, status FROM orders', params: [] }, label: 'no filters' },
              { args: [{ status: 'pending' }], expected: { sql: 'SELECT id, customer_id, pickup_date, status FROM orders WHERE status = ?', params: ['pending'] }, label: 'one filter' },
              { args: [{ status: 'ready', pickupDate: '2026-11-20' }], expected: { sql: 'SELECT id, customer_id, pickup_date, status FROM orders WHERE status = ? AND pickup_date = ?', params: ['ready', '2026-11-20'] }, label: 'two filters, in order' },
              { args: [{ pickupDate: "x' OR '1'='1" }], expected: { sql: 'SELECT id, customer_id, pickup_date, status FROM orders WHERE pickup_date = ?', params: ["x' OR '1'='1"] }, label: 'a hostile value stays a value' },
            ],
          },
          solution: `function buildOrderQuery(filters) {
  let sql = 'SELECT id, customer_id, pickup_date, status FROM orders';
  const conditions = [];
  const params = [];
  if (filters.status !== undefined) {
    conditions.push('status = ?');
    params.push(filters.status);
  }
  if (filters.pickupDate !== undefined) {
    conditions.push('pickup_date = ?');
    params.push(filters.pickupDate);
  }
  if (conditions.length > 0) {
    sql = sql + ' WHERE ' + conditions.join(' AND ');
  }
  return { sql: sql, params: params };
}`,
          hints: [
            'Keep two lists as you go: the conditions (with ? in them) and the values.',
            'For each filter that exists, push the text with a question mark onto one list and the value onto the other.',
            'If there is at least one condition, add " WHERE " and the conditions joined with " AND "; return the sql and the params.',
          ],
          explanation: 'The SQL text only ever contains placeholders and fixed words, and every value goes in the separate params list. The hostile value is just another string in params, so it cannot change the query.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-06-fix-bug-1',
          kind: 'fix-bug',
          title: 'The lookup that returns everyone',
          prompt: 'This lookup was generated by an AI. Tap the line that lets a typed quote change the query, then choose the fix.',
          concept: 'SQL injection and parameters',
          language: 'javascript',
          code: `function findOrders(db, phone) {
  return db.prepare("SELECT o.id FROM orders o JOIN customers c ON c.id = o.customer_id WHERE c.phone = '" + phone + "'").all();
}`,
          bugLine: 2,
          lineNote: 'The function line is fine. Look at the line that builds and runs the SQL.',
          fixes: [
            { line: "  return db.prepare('SELECT o.id FROM orders o JOIN customers c ON c.id = o.customer_id WHERE c.phone = ?').all(phone);", correct: true, why: 'The SQL text has a ? placeholder and the phone is passed separately, so a quote typed by a user stays part of the value.' },
            { line: "  return db.prepare(\"SELECT o.id FROM orders o JOIN customers c ON c.id = o.customer_id WHERE c.phone = '\" + phone.trim() + \"'\").all();", correct: false, why: 'Trimming spaces does nothing about a quote: the value is still glued into the SQL text.' },
            { line: "  return db.prepare(\"SELECT o.id FROM orders o JOIN customers c ON c.id = o.customer_id WHERE c.phone = '\" + phone.replace(\"'\", '') + \"'\").all();", correct: false, why: 'Stripping the first quote is a guess at what an attacker will type. Other inputs still change the query, and real phone numbers or names with an apostrophe get damaged.' },
            { line: "  return db.prepare(\"SELECT o.id FROM orders o JOIN customers c ON c.id = o.customer_id WHERE c.phone = \" + phone).all();", correct: false, why: 'Removing the quotes makes it worse: the value is still glued in, and now it is not even quoted.' },
          ],
          hints: [
            'What reaches the database: a value, or a piece of the SQL command?',
            'Clean-up of the input is a guess. The reliable fix is to keep values out of the SQL text.',
            'Use a ? placeholder in the SQL and pass phone to .all(phone).',
          ],
          explanation: 'Parameters make the database treat the typed text as a value, never as SQL. Trimming or removing characters tries to predict bad input; a placeholder removes the problem.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-06-scenario-1',
          kind: 'scenario',
          title: 'The orders screen is slow',
          prompt: 'Choose your first move.',
          concept: 'reading a query plan',
          situation: 'With 200,000 orders in production, the “my orders” screen takes several seconds. It runs SELECT … FROM orders WHERE customer_id = ?. The AI suggests: “Add an index on every column of the orders table.”',
          options: [
            { text: 'Run EXPLAIN on the query. If it scans every row, add one index on customer_id, then run EXPLAIN again and check the screen.', consequence: 'You see the cause in the plan, fix it with the one index that matches the filter, and confirm the plan changed to an index search.', quality: 'best' },
            { text: 'Add an index on every column, as suggested.', consequence: 'It may help, but every extra index takes space and slows every write, and you still do not know which one was needed.', quality: 'poor' },
            { text: 'Add an index on customer_id without checking the plan, and move on.', consequence: 'It probably works, but you did not verify that the query now uses it, so you cannot be sure what fixed the screen.', quality: 'acceptable' },
            { text: 'Pay for a larger database server.', consequence: 'A bigger machine hides the symptom for a while, but the query still reads every row and gets slower as orders grow.', quality: 'poor' },
          ],
          hints: [
            'What can you ask the database to learn why the query is slow?',
            'EXPLAIN shows whether it scans every row, and a matching index can change that.',
            'Check the plan, add the one index for the filter, check the plan again.',
          ],
          explanation: 'Measure before you change: the plan shows the cause, one index on the filter column fixes it, and a second look at the plan proves it. Indexing everything costs write speed and space for no reason.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-06-match-1',
          kind: 'match',
          title: 'What went wrong in the query?',
          prompt: 'Match each symptom with its cause.',
          concept: 'common query traps',
          labels: { terms: 'Symptom', meanings: 'Cause' },
          pairs: [
            { term: 'A customer who never ordered is missing from the report', definition: 'An inner JOIN where a LEFT JOIN was needed', note: 'Inner joins drop rows with no match.' },
            { term: 'Orders per customer come out higher than the real number after joining the order lines', definition: 'Join fan-out: each order repeats once per line', note: 'Joining a many-side table repeats the other side.' },
            { term: 'WHERE email <> \'x\' leaves out customers who have no email', definition: 'A missing value is never equal or unequal to anything', note: 'NULL comparisons are not true.' },
            { term: 'Typing a quote into the search box returns every customer’s orders', definition: 'The typed value was glued into the SQL instead of sent as a parameter', note: 'Parameters keep values from becoming commands.' },
          ],
          hints: [
            'Ask whether rows disappeared, repeated, went missing for a hidden reason, or the query changed meaning.',
            'Disappeared customer with no orders is about the join type; inflated counts are about repeating rows.',
            'Inner join, fan-out, NULL, injection, in that order.',
          ],
          explanation: 'Each symptom points at a specific trap: dropped rows (inner join), repeated rows (fan-out), vanished NULLs, and input that rewrites the command.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-06-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'Four query words',
          prompt: 'Say each in your own words, then tap to check.',
          concept: 'query vocabulary',
          cards: [
            { front: 'JOIN', back: 'Lines up rows from two tables; an ordinary JOIN keeps only rows that have a match in both.' },
            { front: 'LEFT JOIN', back: 'Keeps every row from the first table, even when the other table has no match.' },
            { front: 'Parameter (?)', back: 'A slot in the SQL where a value is sent separately, so typed text can never act as a command.' },
            { front: 'Index', back: 'A lookup list the database keeps so it can jump to matching rows instead of reading every row.' },
          ],
          hints: ['Think of a market list, a book’s index and a sealed envelope for the typed value.'],
          explanation: 'These four words explain most of what you need to judge a generated query.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-database-design-06-q1',
        prompt: 'An AI joins customers, orders and order lines and counts COUNT(o.id). Mara has two orders (one with two lines) and the report says 3. Why?',
        choices: [
          'COUNT always adds one extra row for the customer itself, on top of the orders',
          'The join repeats each order once per line; count distinct order ids',
          'Mara was entered into the customers table twice by mistake in the data',
          'The report is correct, and an order count should include the lines too',
        ],
        answer: 1,
        explanation: 'Joining the many-side table repeats the order once per line (2 + 1 = 3 joined rows). Counting distinct order ids, or not joining the lines at all, gives the true 2.',
      },
      {
        id: 'ai-database-design-06-q2',
        prompt: 'The report must include customers who have never ordered. Which join keeps them?',
        choices: [
          'A LEFT JOIN from customers to orders',
          'An inner JOIN from customers to orders',
          'An inner JOIN with WHERE o.id IS NOT NULL added to it',
          'A JOIN that lists orders first and then customers',
        ],
        answer: 0,
        explanation: 'LEFT JOIN keeps every row of the first table even when there is no match. An inner join drops the customer, and adding IS NOT NULL removes the customers you wanted to keep.',
      },
      {
        id: 'ai-database-design-06-q3',
        prompt: 'A function glues the typed phone number into its SQL with +. Someone types: x\' OR \'1\'=\'1. What happens?',
        choices: [
          'The database rejects the quote and returns an error to the user typing',
          'It returns no rows because no phone number matches that exact text',
          'It returns only the first customer’s orders and then stops reading',
          'The condition becomes true for every row, so everyone’s orders return',
        ],
        answer: 3,
        explanation: 'The typed text becomes part of the command: WHERE c.phone = \'x\' OR \'1\'=\'1\' is true for every row. In the real run it returned all three orders. A parameter would have returned none.',
      },
      {
        id: 'ai-database-design-06-q4',
        prompt: 'EXPLAIN QUERY PLAN shows SCAN orders for WHERE customer_id = 42 on 50,000 rows. What does that mean, and what would you try?',
        choices: [
          'It uses an index already; nothing to do except add more server memory',
          'The query is wrong and returns no rows until it is rewritten from scratch',
          'It reads every row; an index on customer_id may turn it into a SEARCH',
          'It is the fastest possible plan, and SEARCH is always slower than SCAN',
        ],
        answer: 2,
        explanation: 'SCAN means every row is read. An index on the filter column lets the database jump to the matching rows (SEARCH … USING INDEX), which is what the real run showed.',
      },
      {
        id: 'ai-database-design-06-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, why do we send typed values separately from the SQL instead of gluing them in?',
        choices: [
          'So the database can run the query faster for every single user of the app',
          'So the SQL text stays short enough to fit comfortably on the screen',
          'So the app can store the value in a different table at a later time',
          'So typed text is only ever treated as a value, never as a command',
        ],
        answer: 3,
        explanation: 'Keeping values separate means a quote or a clever sentence cannot change what the query does. It is about safety, not speed or length.',
      },
      {
        id: 'ai-database-design-06-q6',
        audience: { min: 'advanced' },
        prompt: 'A teammate shows an EXPLAIN from a 300-row development database and says the new index is “proven to be used in production”. What is the right response?',
        choices: [
          'Agree, because the plan the database picks never depends on how much data there is',
          'Ask for the plan on production-sized data, since plans depend on size',
          'Remove the index, because small tables never use indexes at all and so it is pointless',
          'Ask the AI tool to write a longer query so that the plan looks more convincing',
        ],
        answer: 1,
        explanation: 'The planner chooses by estimated cost from table size and statistics, so a plan on ten or three hundred rows says little about millions. Verify on realistic data and monitor slow queries.',
      },
    ],
    task: {
      title: 'Test a query on known data',
      minutes: 20,
      steps: [
        'Create the four-table bakery schema and the small seed (three customers, three orders, four lines) in `sqlite3`. Write on paper the true answers to: orders per customer, and the total in pesos of each order.',
        'Ask your AI tool for those two queries using the “make the AI show its work” prompt. Run them and compare with your paper answers. Note anything that disagrees and find out why.',
        'Run the AI’s “orders per customer” with the extra join to order lines and COUNT(o.id). Does Mara show 3? Fix it with COUNT(DISTINCT o.id) or by removing the join.',
        'Add `EXPLAIN QUERY PLAN` in front of a query that filters on `orders.customer_id` and note whether it says SCAN or SEARCH. Create an index on the column and run it again.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Ask your AI tool to explain one query line by line, then write the same question back in your own words and check it matches.'] },
      { audience: { min: 'advanced' }, steps: ['Generate 100,000 rows in PostgreSQL, capture `EXPLAIN (ANALYZE, BUFFERS)` inside a rolled-back transaction before and after an index, and write down which numbers you will alert on in production.'] },
    ],
  },
  {
    id: 'ai-database-design-07',
    day: 7,
    title: 'Who may see what: access rules',
    summary: 'Why hiding data in the screens is not security, how row-level security works, and how to test it by acting as two different customers.',
    minutes: 30,
    skills: ['access-rules', 'ai-data-prompts', 'schema-review'],
    intro: {
      objectives: [
        'Explain why access rules must live with the data and not only in the app’s screens',
        'Read a row-level security policy and tell what its USING and WITH CHECK parts decide',
        'Test access rules by acting as different users, and spot the mistakes AI makes most often',
      ],
      why: 'In a backend-as-a-service setup, the phone talks almost directly to your database. One missing rule and any customer can read every other customer’s orders, names and phone numbers. AI writes these rules fast and sometimes writes them wrong.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Mara opens the bakery app and sees her two orders. Jun opens it and sees his one. It works. But how does it work? If the app downloads *every* order and simply hides the ones that are not hers, then every phone is carrying every customer’s data. Anyone who knows how to call the database’s web address directly, with a browser or a short script, can skip the app’s screens and read all of it. **Hiding things in the screens is decoration, not security.** The rule “a customer sees only their own orders” has to live where the data lives: in the database. In PostgreSQL (and Supabase, which is PostgreSQL) that mechanism is called **row-level security**, or **RLS**.',
      },
      {
        type: 'paragraph',
        text: 'You switch it on per table with `alter table orders enable row level security;`. From then on, ordinary users can see or change **only the rows a policy allows**, and if there is no policy at all the default is **deny**: no rows. A **policy** is a rule attached to a table, saying for one operation (select, insert, update, delete) which rows are allowed. It has up to two conditions. **USING** decides which *existing* rows the person may see, update or delete. **WITH CHECK** decides which *new or changed* rows are allowed to be written. If a policy has no WITH CHECK, PostgreSQL uses its USING condition for that too.',
      },
      {
        type: 'paragraph',
        text: 'Here is what that does, run for real in PostgreSQL 14 against the bakery tables, acting as an ordinary application role (not the owner) with the signed-in person’s id set per session. On Supabase the signed-in person’s id comes from the sign-in token, read with `auth.uid()`; here a session setting plays that part. Mara is customer 1 and Jun is customer 2.',
      },
      {
        type: 'table',
        headers: ['Step', 'Setup', 'What Mara gets (real result)'],
        rows: [
          ['1', 'RLS off', 'All 3 orders, including Jun’s'],
          ['2', 'RLS on, no policy', '0 rows (default deny)'],
          ['3', 'A policy with using (true), the AI shortcut', 'All 3 orders again'],
          ['4', 'A policy: orders whose customer is me', 'Orders 1 and 2 only; Jun gets only order 3'],
        ],
        caption: 'Four states of the same table. Step 3 looks like security and is not.',
      },
      {
        type: 'code',
        language: 'sql',
        label: 'The policy that works (PostgreSQL; on Supabase write (select auth.uid()) where it reads current_setting)',
        code: `alter table orders enable row level security;

create policy "orders: customers read their own" on orders
  for select to app_user
  using (customer_id in (
    select id from customers
    where user_id = current_setting('app.user_id')::uuid
  ));

create policy "orders: customers add their own" on orders
  for insert to app_user
  with check (customer_id in (
    select id from customers
    where user_id = current_setting('app.user_id')::uuid
  ));`,
      },
      {
        type: 'code',
        language: 'text',
        label: 'Real results as Mara (customer 1) with those policies in place',
        code: `insert into orders (customer_id, pickup_date) values (1, '2026-11-25');   -- INSERT 0 1   (her own: fine)
insert into orders (customer_id, pickup_date) values (2, '2026-11-25');   -- ERROR: new row violates row-level security policy for table "orders"

update orders set status = 'cancelled' where id = 3;   -- UPDATE 0   (Jun's order: no error, nothing changed)
update orders set status = 'cancelled' where id = 1;   -- UPDATE 1   (her own order)`,
      },
      {
        type: 'paragraph',
        text: 'Read those carefully, because they teach three habits. Writing an order for someone else is refused loudly (WITH CHECK failed). **Changing someone else’s order does not fail; it quietly changes zero rows**, because the USING condition hides Jun’s row from Mara, so the database acts as if it did not exist. A test that only looks for errors would miss that. And the policy covers `orders` only. We then asked for the `order_items` table as Mara: she received **all 4 lines, including Jun’s**, because that table had no RLS. Only after we enabled RLS on it and added a policy (lines whose order belongs to me) did she get her own 3.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Think of a hotel with key cards. If the lobby simply tells guests “please only open your own room”, any guest can try every door. Real hotels put the lock **on the door**: your card opens room 12 and nothing else. Row-level security is the lock on the door of each row. The screen telling Mara “here are your orders” is the polite sign in the lobby; the policy is the lock. **Default deny** means a new door is locked until someone writes a rule saying whose card opens it. A **policy** is that rule. Reading the SQL: `enable row level security` fits the lock; `for select … using (…)` says who may *look*; `for insert … with check (…)` says who may *add* a row, and the condition inside checks that the order’s customer belongs to the signed-in person.',
      },
      { type: 'heading', text: 'The mistakes AI makes most often' },
      {
        type: 'list',
        items: [
          '**`using (true)`.** It makes the red error go away and opens the whole table. In our run it gave Mara every order.',
          '**Turning RLS off “to fix” an empty screen.** The screen is empty because there is no policy yet. The fix is to add the right one, never to remove the lock.',
          '**Forgetting a table.** The child table (`order_items`) leaked while the parent was protected. Every table that holds private data needs RLS and a policy.',
          '**Using the secret key in the app.** Supabase documents that its service role bypasses RLS and that a secret key must never be used in a browser or shipped to customers. It belongs on a server you control.',
          '**Views.** Supabase documents that a view runs with its creator’s rights and can expose rows the table’s policies would hide; on PostgreSQL 15 and later a view can be created with `security_invoker = true`.',
          '**Trusting data the user can edit** for decisions, for example a profile field. Supabase’s guidance says to keep authorization data somewhere users cannot change.',
        ],
      },
      { type: 'heading', text: 'Test it as two people' },
      {
        type: 'paragraph',
        text: 'You test an access rule by **acting as each kind of person** and checking both what they can see and what they cannot change. Write the expectations before you run anything, as you did for queries.',
      },
      {
        type: 'table',
        headers: ['Act as', 'Try', 'Expect'],
        rows: [
          ['Mara', 'Read orders', 'Only orders 1 and 2'],
          ['Jun', 'Read orders', 'Only order 3'],
          ['Nobody signed in', 'Read orders', '0 rows (or refused)'],
          ['Mara', 'Insert an order for Jun', 'An error from the policy'],
          ['Mara', 'Update or delete Jun’s order', '0 rows changed'],
          ['Mara', 'Read order lines', 'Only lines of her orders'],
        ],
        caption: 'Six checks for the bakery. Keep them as a script and rerun it after every schema change.',
      },
      {
        type: 'prompt',
        label: 'Ask the AI for policies and the test that proves them',
        text: 'Here is my schema for a bakery app on Supabase: [paste it]. Customers sign in and each customer row has a user_id column holding their auth user id. Write row-level security policies so a signed-in customer can read and create only their own orders and the lines of their own orders, and can read the product list. Write one policy per operation and role, use (select auth.uid()), and do not use using (true) on private tables. Then write a test script that acts as two different customers and as a signed-out visitor, with the exact rows each should see and the result of trying to read, insert and update the other customer’s data.',
      },
      {
        type: 'version',
        text: 'PostgreSQL’s documentation says row security is off by default and enabled per table; with RLS enabled and no policy a default-deny policy applies; USING controls which existing rows a command can see and WITH CHECK which rows may be created or modified (USING is reused if WITH CHECK is absent); and superusers, roles with BYPASSRLS and (unless FORCE ROW LEVEL SECURITY is set) table owners bypass it. Supabase’s documentation requires RLS on tables in exposed schemas, uses (select auth.uid()) in policy examples, says the service role bypasses RLS and a secret key must never reach a browser, and warns that views bypass RLS unless created with security_invoker (PostgreSQL 15 and later). Its AI prompt for policies asks for separate policies per operation, TO roles, and indexes on columns used in policies. Real results above come from PostgreSQL 14.18. Checked on this date.',
        checked: CHECKED,
        sources: [DOCS.pgRls, DOCS.supaRls, DOCS.supaRlsPrompt],
      },
      {
        type: 'paragraph',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: '**At your level.** Build the two-customer test as a script you can run in one command, and put it in the repository next to your migrations. When you ask an AI to change a table or add a new one, the first thing you check afterwards is that script. Add a line for every new table: “which policy covers it?”',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Run the policy tests as the same role your API uses, not as the owner: owners and `BYPASSRLS` roles skip RLS entirely, so a suite that passes as the owner proves nothing; consider `FORCE ROW LEVEL SECURITY` where the owner should be subject to it. Policies are evaluated per row and often contain subqueries, so index the columns they use, prefer set-membership forms (`customer_id in (select …)`) over per-row joins and wrap functions like `auth.uid()` in a `select` so they are evaluated once per statement, as Supabase’s guidance advises. For multi-tenant data, put the tenant key on every table, resolve membership through one small table, and write a policy per operation. Treat `security definer` functions and views as bypass routes and review each one. Remember RLS protects rows, not columns: restrict sensitive columns with grants or a view, and audit what the `anon` and `authenticated` roles can reach by default.',
      },
      {
        type: 'takeaways',
        items: [
          'Hiding data in the screens is not security: access rules must live in the database, as row-level security policies.',
          'With RLS on and no policy, the default is deny; USING decides which existing rows a person can see or change, WITH CHECK decides which rows may be written.',
          'A policy of using (true), RLS switched off, and an unprotected child table are the usual AI mistakes.',
          'Changing someone else’s row under RLS often succeeds with 0 rows changed instead of an error, so test counts as well as errors.',
          'Test by acting as two customers and a signed-out visitor, as the application’s role and not the table owner, and never put the secret key in an app.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-07-fix-bug-1',
          kind: 'fix-bug',
          title: 'The policy that shows everyone’s orders',
          prompt: 'The AI wrote this Supabase policy so “customers can see their orders”. Tap the line that is wrong, then choose the fix.',
          concept: 'a policy that really limits rows',
          language: 'sql',
          code: `create policy "orders: read"
  on orders for select to authenticated
  using (true);`,
          bugLine: 3,
          lineNote: 'The first two lines name the policy and the operation. Look for the condition.',
          fixes: [
            { line: '  using (customer_id in (select id from customers where user_id = (select auth.uid())))', correct: true, why: 'It allows only orders whose customer row belongs to the signed-in person.' },
            { line: '  using (auth.uid() is not null)', correct: false, why: 'Every signed-in user passes this test, so every customer still sees every order.' },
            { line: '  using (customer_id = auth.uid())', correct: false, why: 'customer_id is the bakery’s own customer number, not the sign-in id, so the condition compares unlike things and is never true for the right rows.' },
            { line: '  using (true) -- only staff will see this screen', correct: false, why: 'A comment does not restrict anything: the policy still allows every row to every signed-in user.' },
          ],
          hints: [
            'What does using (true) allow?',
            'The condition must connect the order to the signed-in person, through the customer row.',
            'Orders whose customer_id belongs to a customers row whose user_id is the signed-in person.',
          ],
          explanation: 'USING is the test applied to every row. True lets everything through, “signed in” lets every customer through, and the right condition ties each order to the person who owns it.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-07-scenario-1',
          kind: 'scenario',
          title: 'The screen went empty after RLS',
          prompt: 'Choose how to respond to the AI’s suggestion.',
          concept: 'fixing an empty screen under RLS',
          situation: 'After you enable row-level security on orders, the customer app shows an empty list. Your AI tool says: “Row-level security is blocking it. Run: alter table orders disable row level security;”',
          options: [
            { text: 'Keep RLS on, add the missing select policy that ties orders to the signed-in customer, and test as Mara and as Jun.', consequence: 'The list returns for each customer, and each sees only their own. The lock stays on the door.', quality: 'best' },
            { text: 'Disable RLS, as the AI suggests.', consequence: 'The screen works again because every customer can now read every order, and nobody notices until someone does.', quality: 'poor' },
            { text: 'Put the project’s secret key in the app so queries bypass the rules.', consequence: 'Every phone now carries a key that bypasses all access rules. Anyone can extract it and read or delete everything.', quality: 'poor' },
            { text: 'Turn RLS off on your local development copy while you debug, and keep it on in production.', consequence: 'Fine for investigating, but your local tests no longer match production, so you must re-test with RLS on before you finish.', quality: 'acceptable' },
          ],
          hints: [
            'Why is the list empty? What is the default when RLS is on and no policy exists?',
            'The list is empty because nothing has granted access yet.',
            'Add the right policy, then test as two customers; never remove the lock.',
          ],
          explanation: 'An empty list under RLS means no policy yet grants access, which is the safe default. The fix is the correct policy plus a test as two people, not removing the protection.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-07-match-1',
          kind: 'match',
          title: 'What does this symptom mean?',
          prompt: 'Match each thing you observe to what it tells you about the policies.',
          concept: 'diagnosing RLS behaviour',
          labels: { terms: 'What you observe', meanings: 'What it means' },
          pairs: [
            { term: 'A signed-in customer sees an empty orders list right after RLS was enabled', definition: 'No SELECT policy exists yet, so the default is deny', note: 'Default deny shows nothing until a policy grants access.' },
            { term: 'Customer A can read customer B’s orders', definition: 'RLS is off, or the policy is using (true)', note: 'Either the lock is missing or the rule lets everything through.' },
            { term: 'An insert fails with “new row violates row-level security policy”', definition: 'The WITH CHECK condition was false for the new row', note: 'WITH CHECK judges rows being written.' },
            { term: 'An update on another customer’s order says 0 rows changed, with no error', definition: 'The USING condition hides that row from the user', note: 'A hidden row cannot be updated, so nothing matches.' },
          ],
          hints: [
            'Ask: did the person see nothing, too much, get refused, or silently change nothing?',
            'Nothing means no policy; too much means a loose policy; a loud refusal is WITH CHECK; a silent zero is USING.',
            'Empty list: no policy. Sees others: off or true. Insert error: WITH CHECK. Zero changed: USING.',
          ],
          explanation: 'Each symptom points to a different part of the rules: the default deny, a policy that is too loose, a failed WITH CHECK, or a USING condition that hides the row.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-07-code-1',
          kind: 'code-challenge',
          title: 'Who can see this order?',
          story: 'Before you write the SQL policy, write its logic as plain code.',
          prompt: 'Write `visibleOrders(orders, customers, userId)`. Each order has `customerId`; each customer has `id` and `userId`. Return the orders whose customer’s `userId` equals the given `userId`, in the original order. If `userId` is `null` (nobody signed in), return an empty array.',
          concept: 'a row-level rule as code',
          language: 'javascript',
          starter: `function visibleOrders(orders, customers, userId) {
  // return the orders this person may see
}`,
          tests: {
            kind: 'function',
            fn: 'visibleOrders',
            cases: [
              { args: [[{ id: 1, customerId: 1 }, { id: 2, customerId: 1 }, { id: 3, customerId: 2 }], [{ id: 1, userId: 'u-mara' }, { id: 2, userId: 'u-jun' }], 'u-mara'], expected: [{ id: 1, customerId: 1 }, { id: 2, customerId: 1 }], label: 'Mara sees her two orders' },
              { args: [[{ id: 1, customerId: 1 }, { id: 3, customerId: 2 }], [{ id: 1, userId: 'u-mara' }, { id: 2, userId: 'u-jun' }], 'u-jun'], expected: [{ id: 3, customerId: 2 }], label: 'Jun sees his order only' },
              { args: [[{ id: 1, customerId: 1 }], [{ id: 1, userId: 'u-mara' }], null], expected: [], label: 'nobody signed in sees nothing' },
              { args: [[{ id: 1, customerId: 1 }], [{ id: 1, userId: 'u-mara' }], 'u-stranger'], expected: [], label: 'a signed-in person with no customer row sees nothing' },
            ],
          },
          solution: `function visibleOrders(orders, customers, userId) {
  if (userId === null) return [];
  const mine = [];
  for (const customer of customers) {
    if (customer.userId === userId) mine.push(customer.id);
  }
  return orders.filter((order) => mine.includes(order.customerId));
}`,
          hints: [
            'First find the customer ids that belong to this userId.',
            'Then keep only the orders whose customerId is one of those. Do not forget the signed-out case.',
            'If userId is null return []. Otherwise collect the matching customer ids and filter the orders by them.',
          ],
          explanation: 'The policy has two hops: from the signed-in person to their customer row, then from the customer row to the orders. The safe default is nothing: no signed-in person, or no customer row, means no orders.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-07-arrange-1',
          kind: 'arrange',
          title: 'Prove the access rule',
          prompt: 'Put the steps of building and testing the orders policy in a sensible order, first at the top.',
          concept: 'testing access rules',
          language: 'text',
          solution: [
            'Enable row-level security on the orders table',
            'Write the select, insert and update policies',
            'Act as Mara and expect only her orders',
            'Act as Jun and expect only his order',
            'Act as nobody signed in and expect no rows',
            'Try to insert and update Jun’s data as Mara and expect a refusal or zero rows changed',
          ],
          reasons: [
            'Without RLS on, the policies below would do nothing.',
            'The policies are the rules being proved.',
            'The first check shows the rule lets the owner in.',
            'The second check shows the rule keeps the owner’s data separate from another person’s.',
            'A signed-out visitor is a third kind of person who must see nothing.',
            'Last, the dangerous direction: writing to someone else’s data must fail.',
          ],
          hints: [
            'What must be on before any policy matters?',
            'Test who can get in, then who is kept out, then who can write where they should not.',
            'Enable, write policies, check Mara, check Jun, check nobody, try the forbidden writes.',
          ],
          explanation: 'RLS first, then the rules, then checks for each kind of person, ending with the writes that must be refused, because those are the ones that would hurt a customer.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-07-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'Four access words',
          prompt: 'Say each in your own words, then tap to check.',
          concept: 'access vocabulary',
          cards: [
            { front: 'Row-level security (RLS)', back: 'A lock on each row of a table, so the database itself decides who may see or change it.' },
            { front: 'Policy', back: 'A rule attached to a table that says which rows a person may see, add, change or delete.' },
            { front: 'Default deny', back: 'With the lock on and no policy written, nobody gets in.' },
            { front: 'Secret key', back: 'A key that skips the locks. It lives only on a server you control, never inside an app.' },
          ],
          hints: ['Think of key cards in a hotel.'],
          explanation: 'These four words are what you need to read and check the access rules an AI generates.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-database-design-07-q1',
        prompt: 'Row-level security is enabled on orders and no policy exists. A signed-in customer asks for the orders. What do they get?',
        choices: [
          'All of the orders, because they are signed in',
          'An error saying that the orders table does not exist',
          'Only their own orders, because RLS works that out itself',
          'No rows, because the default with RLS on is deny',
        ],
        answer: 3,
        explanation: 'With RLS enabled and no policy, a default-deny rule applies and ordinary users see nothing until a policy grants access.',
      },
      {
        id: 'ai-database-design-07-q2',
        prompt: 'Why is hiding other customers’ orders in the app’s screens not enough?',
        choices: [
          'Because filtered screens always load more slowly than unfiltered ones',
          'Because phones cannot keep only some of the rows from a table at a time',
          'Because anyone can call the database directly and skip the screens',
          'Because the screens are drawn by the database, which ignores filters',
        ],
        answer: 2,
        explanation: 'Screens are only a polite front. A person who can reach the database directly bypasses them, so the rule must be enforced where the data lives.',
      },
      {
        id: 'ai-database-design-07-q3',
        prompt: 'Which part of a policy decides which existing rows a person may see, update or delete?',
        choices: [
          'WITH CHECK',
          'USING',
          'DEFAULT',
          'UNIQUE',
        ],
        answer: 1,
        explanation: 'USING is the test applied to existing rows. WITH CHECK judges rows being written; DEFAULT and UNIQUE belong to table definitions.',
      },
      {
        id: 'ai-database-design-07-q4',
        prompt: 'As Mara, you run an update on Jun’s order and the database answers “UPDATE 0” with no error. What happened?',
        choices: [
          'USING hides Jun’s row from Mara, so no row matched',
          'The database crashed halfway through the update and lost the change',
          'The WITH CHECK condition failed, which always produces an error',
          'Updates are never allowed on tables that use RLS, for any user',
        ],
        answer: 0,
        explanation: 'To Mara, Jun’s row does not exist, so the update matches nothing and reports zero rows. A failed WITH CHECK would raise an error, and RLS tables can be updated by the right person.',
      },
      {
        id: 'ai-database-design-07-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what does “default deny” mean for a table with row-level security?',
        choices: [
          'Everyone may read everything until somebody adds a rule against it',
          'Only the person who created the table may ever use it',
          'Once the lock is on, nobody gets in until a rule says who may',
          'Anyone who is signed in may read the rows but never change them',
        ],
        answer: 2,
        explanation: 'Default deny means the safe choice applies first: no access until a policy grants it. The other choices describe rules someone would have to write.',
      },
      {
        id: 'ai-database-design-07-q6',
        audience: { min: 'advanced' },
        prompt: 'Your RLS test suite passes when run through the table owner’s connection. Why is that weak evidence?',
        choices: [
          'Owners bypass RLS unless it is forced; test as the app’s role',
          'Owners cannot run SELECT statements on tables that have policies at all',
          'Policies only ever apply to superusers and never to ordinary roles',
          'RLS tests only mean something against the production database itself',
        ],
        answer: 0,
        explanation: 'Owners (and superusers and BYPASSRLS roles) skip row security unless FORCE ROW LEVEL SECURITY is set, so a pass as the owner proves nothing about what the app’s role can see.',
      },
    ],
    task: {
      title: 'Act as two customers',
      minutes: 22,
      steps: [
        'If you have PostgreSQL (or a free Supabase project), create the bakery tables and seed two customers with their orders. If you do not, ask your AI tool to write a small PostgreSQL setup script you can read, and run it in a throwaway database.',
        'Create an application role without owner rights and enable RLS on `orders` and `order_items`. Before adding any policy, confirm the role sees 0 rows.',
        'Use the policy prompt in this lesson to get policies from your AI tool. Read every policy for `using (true)` and for a table it forgot.',
        'Run the six checks from the table in this lesson, as each person, and write down every result. Make one deliberate mistake (a `using (true)`) and watch which check catches it.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Draw the hotel analogy for your own app: what are the rooms, who holds which key card, and which room must no guest ever open?'] },
      { audience: { min: 'advanced' }, steps: ['Run the same checks as the table owner and as the application role and record the difference. Add `FORCE ROW LEVEL SECURITY` and rerun. Index the columns your policies use and compare the plans.'] },
    ],
  },
  {
    id: 'ai-database-design-08',
    day: 8,
    title: 'Backups and recovery',
    summary: 'How often to back up, where to keep the copies, and how to prove with a restore drill that you can really get your data back.',
    minutes: 28,
    skills: ['backup-recovery', 'ai-data-prompts', 'sql-reading'],
    intro: {
      objectives: [
        'Choose how often to back up and how fast you must recover, in the bakery’s own terms',
        'Make and restore a real backup in SQLite and PostgreSQL, and check the result',
        'Run a restore drill and say what a backup does not cover',
      ],
      why: 'Sooner or later something deletes data: a bad migration, a careless command, an AI agent, a stolen phone or a provider incident. The people who recover calmly are not the ones who made backups. They are the ones who have already restored one.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'Earlier in this course we ran `DELETE FROM orders;` on purpose, to see what happens when foreign keys are off. It took one line and no warning, and the orders were gone. An AI agent with database access can type that line in half a second, and so can you on a tired Friday. A backup is how you say “no problem” afterwards. But there is a catch that catches nearly everyone: **a backup you have never restored is a hope, not a backup.** It may be empty, truncated, missing a table, or in a format nobody can open. You only find out when you need it. So this lesson is as much about *restoring* as about backing up.',
      },
      { type: 'heading', text: 'Two numbers to decide first' },
      {
        type: 'paragraph',
        text: '“How often should we back up?” has no answer until you decide two things in your business’s own words. The **recovery point** is how much recent data you can afford to lose: if Aling Nena can live with losing one hour of orders, you need a copy at least every hour. The **recovery time** is how long you can be without the app: if the bakery cannot stay closed for more than half an hour, then a restore that takes three hours is not good enough, and you will only know how long yours takes by timing it. Write both numbers down. They decide the method.',
      },
      {
        type: 'table',
        headers: ['Way to back up', 'What it is', 'Good for'],
        rows: [
          ['A dump or snapshot', 'A file with all the data (and the structure) as it was at one moment', 'A small database, a copy before a risky change, a nightly copy'],
          ['A copy of the database files', 'Copying the files on disk (the database must be stopped or use a safe method)', 'Whole-server copies; easy to get subtly wrong on a live database'],
          ['Continuous archiving (point-in-time recovery)', 'A base copy plus a running log of every change, so you can return to any moment', 'When losing even an hour is too much'],
        ],
        caption: 'The three approaches in PostgreSQL’s own backup chapter, in everyday words.',
      },
      { type: 'heading', text: 'A real backup and restore, in SQLite' },
      {
        type: 'paragraph',
        text: 'SQLite’s `VACUUM INTO` writes a consistent snapshot of a live database into a new file. We seeded the bakery database, took a snapshot, checked it, deleted every order from the live database, and restored. Everything below is the real output.',
      },
      {
        type: 'code',
        language: 'bash',
        label: 'Back up, damage, restore (SQLite 3.54)',
        code: `sqlite3 bakery.db "VACUUM INTO 'backup-2026-11-14.db'"
sqlite3 backup-2026-11-14.db "PRAGMA integrity_check;"
# ok

sqlite3 bakery.db "DELETE FROM orders;"
sqlite3 bakery.db "SELECT COUNT(*) FROM orders;"
# 0

cp backup-2026-11-14.db restored.db
sqlite3 restored.db "SELECT COUNT(*) FROM orders;" "SELECT COUNT(*) FROM order_items;"
# 3
# 4`,
      },
      {
        type: 'paragraph',
        text: 'Two notes. The snapshot is a **consistent** copy: it shows the database as it was at one moment, even while the app is writing. (SQLite’s documentation describes this and the online backup API, and warns that merely copying the database file with `cp` can give a corrupted copy if the machine fails while copying.) And the damaged database has a tell-tale sign of what was lost: `PRAGMA foreign_key_check;` listed order lines pointing at orders that no longer exist, while the same check on the restored copy printed nothing.',
      },
      { type: 'heading', text: 'The same drill in PostgreSQL' },
      {
        type: 'code',
        language: 'bash',
        label: 'pg_dump to a file and pg_restore into a new database (PostgreSQL 14)',
        code: `pg_dump -Fc -f mig.dump mig
psql -c "create database mig_restore"
pg_restore -d mig_restore --no-owner mig.dump

psql -d mig_restore -c "select count(*) from orders"
# 3   (the original had 3)`,
      },
      {
        type: 'paragraph',
        text: 'Here `-Fc` means “custom format”, a compressed archive that `pg_restore` reads; a plain SQL file is restored with `psql` instead. We restored into a **new, separate database** and compared row counts for every table against the original (2 customers, 2 products, 3 orders, 4 lines, all matching). Restoring beside the original, never over it, is the safe habit: you can inspect the copy before you decide to rely on it. `pg_dump` saves one database; roles and other cluster-wide objects need `pg_dumpall`, and a restore on another machine has to recreate those.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Think of photographing the bakery’s order notebook at the end of each day. The photo is the backup. If the notebook is lost, you have the photo, but only if the photo is sharp and you can read it. A **restore drill** is the practice of actually reading the photo and copying it into a fresh notebook once, on a calm day, to check nothing is missing and to time how long it takes. The commands above do that: the first line takes the photo (the snapshot), the next ones check the photo is readable (`integrity_check`), then they lose the notebook on purpose (`DELETE`), copy the photo back and count the pages (`COUNT(*)`). Keep the photo somewhere other than the shelf the notebook sits on, or one fire takes both.',
      },
      { type: 'heading', text: 'Where the copy lives, and what it misses' },
      {
        type: 'list',
        items: [
          '**Somewhere else.** A backup in the same folder, on the same disk or in the same account as the database dies in the same accident. A widely used rule of thumb is three copies, on two kinds of storage, with one kept elsewhere.',
          '**Protected.** A backup holds every customer’s name and phone number. Limit who can read it, and remember it is personal data too: if a customer asks for deletion, decide and document how long backups keep their data.',
          '**Not only the database.** Photos and uploaded files, secret keys and environment settings, and sign-in configuration are separate. Supabase documents that its database backups do not include files stored through its Storage API, and that daily backups do not store the passwords of custom database roles.',
          '**Hosted does not mean automatic for you.** Supabase documents daily backups for its paid plans, with point-in-time recovery as an optional add-on, and recommends exporting data yourself on a free project, for example with `supabase db dump`. Read what *your* plan includes before you rely on it.',
        ],
      },
      {
        type: 'paragraph',
        text: 'One more AI-specific habit: **take a backup before a coding agent works near your data**, and give the agent credentials that cannot delete. A backup taken a minute before the session turns “the agent dropped the table” from a disaster into a restore.',
      },
      { type: 'heading', text: 'The restore drill' },
      {
        type: 'list',
        ordered: true,
        items: [
          'Make a backup the way you do in production (same command, same place).',
          'Restore it into a **new** database or file, never over the live one.',
          'Check it: the tool reports no errors, an integrity check passes, row counts match the original for every table, a foreign-key check finds no orphans.',
          'Run your most important queries and a smoke test of the app against the restored copy.',
          'Time the whole thing, compare with your recovery time, and write the steps down so anyone can follow them under stress.',
        ],
      },
      {
        type: 'prompt',
        label: 'Ask the AI for a backup plan you can test',
        text: 'My app is a bakery pre-order app on [Supabase / PostgreSQL / SQLite]. I can lose at most one hour of orders and be down at most 30 minutes. Write (1) a backup routine that meets that, saying how often it runs and where the copies are kept (not on the same machine as the database), (2) the exact commands to restore into a NEW database, (3) the checks to run afterwards (integrity, row counts per table, orphan check, three business queries), and (4) a list of what these backups do NOT include, such as uploaded files and secrets. Do not put passwords in the scripts; read them from environment variables.',
      },
      {
        type: 'version',
        text: 'SQLite documents VACUUM INTO as writing a vacuumed, consistent copy of a database into a new file (which must not exist or must be empty), alongside its online backup API, and notes that copying the file with cp can corrupt a backup if the system fails mid-copy. PostgreSQL’s backup chapter names three approaches (SQL dump, file-system-level backup, continuous archiving) and the pg_dump page documents custom format with pg_restore, plain format with psql, and pg_dumpall for roles. Supabase documents daily backups on paid plans, an optional point-in-time recovery add-on, no Storage files in database backups, a restore that makes the project unavailable while it runs, and supabase db dump for exports. Plans and retention change, so check the page for your plan. Commands run on SQLite 3.54.0 and PostgreSQL 14.18. Checked on this date.',
        checked: CHECKED,
        sources: [DOCS.sqliteVacuum, DOCS.sqliteBackup, DOCS.pgDump, DOCS.pgBackup, DOCS.supaBackups, DOCS.supaDump],
      },
      {
        type: 'paragraph',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: '**At your level.** Put the drill in a script and put the script in the repository next to the migrations, with the expected row counts as assertions so it fails loudly. A drill you run once is a good start; a drill you run on a schedule, and that tells you when it breaks, is a backup strategy.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Derive the method from recovery point and recovery time objectives: a nightly logical dump gives hours of potential loss and a restore time that grows with data size, while continuous archiving with point-in-time recovery lets you return to a chosen moment. Supabase documents that a point-in-time restore replaces the current database state, so to keep current data you restore into a new project first and inspect it. Keep at least one copy outside the account and provider that hold the database, make it immutable or access-restricted so a compromised credential cannot delete it, and encrypt it, and back up the keys separately. Test restores into a clean environment automatically and alert on failure, and record retention against your deletion obligations (a deleted customer still exists in older backups). A logical dump restores data and schema but not cluster-level roles, extensions’ external state or object storage, so list those explicitly in the runbook.',
      },
      {
        type: 'takeaways',
        items: [
          'A backup you have not restored is a hope: prove it with a restore drill into a new database, then check counts, integrity and orphans.',
          'Decide the recovery point (how much you can lose) and recovery time (how long you can be down) first; they decide how and how often to back up.',
          'Keep copies away from the database they protect, restrict who can read them, and remember they contain personal data.',
          'Backups of the database do not cover uploaded files, secrets or sign-in settings, and a hosted plan may not include backups at all.',
          'Back up before a risky migration or an AI agent session, and write the restore steps down so anyone can follow them.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-08-arrange-1',
          kind: 'arrange',
          title: 'The restore drill, in order',
          prompt: 'Put the steps of a restore drill in the right order, first at the top.',
          concept: 'the restore drill',
          language: 'text',
          solution: [
            'Make a backup the way production does it',
            'Restore it into a new, separate database',
            'Check integrity, row counts and orphaned rows against the original',
            'Run key queries and a smoke test of the app on the restored copy',
            'Time the whole restore and write the steps down',
          ],
          reasons: [
            'You test the real process, so the backup comes first and uses the real commands.',
            'Restoring beside the original keeps the live data safe while you inspect the copy.',
            'Counts, integrity and orphans show whether anything was lost or damaged.',
            'Business queries and the app prove the restored data is usable, not just present.',
            'The time tells you your real recovery time, and the written steps let anyone repeat it in an emergency.',
          ],
          hints: [
            'What must exist before you can restore anything?',
            'Never restore over the live database while testing; check before you trust.',
            'Backup, restore to new, check, use it, time and write it down.',
          ],
          explanation: 'The drill moves from making the copy to proving it works and measuring how long it takes. Restoring to a new place means the drill itself can never harm the live data.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-08-sql-1',
          kind: 'sql-challenge',
          title: 'Find the orphaned lines',
          story: 'After a partial restore, Aling Nena fears some order lines point at orders that did not come back.',
          prompt: 'List the `order_id` and `product_id` of every order line whose order no longer exists, ordered by order then product. Use a LEFT JOIN from the lines to the orders and keep the lines with no match.',
          concept: 'finding orphans after a restore',
          setup: `CREATE TABLE orders (id INTEGER PRIMARY KEY);
CREATE TABLE order_items (order_id INTEGER NOT NULL, product_id INTEGER NOT NULL, quantity INTEGER NOT NULL);
INSERT INTO orders (id) VALUES (1), (2);
INSERT INTO order_items (order_id, product_id, quantity) VALUES (1, 1, 2), (2, 1, 1), (3, 2, 4), (3, 3, 1);`,
          starter: 'SELECT oi.order_id, oi.product_id\nFROM order_items oi\nLEFT JOIN orders o ON o.id = oi.order_id;',
          expected: { columns: ['order_id', 'product_id'], rows: [[3, 2], [3, 3]], ordered: true },
          solution: 'SELECT oi.order_id, oi.product_id\nFROM order_items oi\nLEFT JOIN orders o ON o.id = oi.order_id\nWHERE o.id IS NULL\nORDER BY oi.order_id, oi.product_id;',
          hints: [
            'The LEFT JOIN keeps every line. For a line with no order, the order’s columns are empty.',
            'Filter for the lines where the order’s id is NULL, then sort.',
            'WHERE o.id IS NULL ORDER BY oi.order_id, oi.product_id.',
          ],
          explanation: 'A LEFT JOIN fills the order columns with NULL when no order matches, so WHERE o.id IS NULL keeps exactly the orphaned lines: the two lines of the missing order 3.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-08-predict-output-1',
          kind: 'predict-output',
          title: 'What does the snapshot remember?',
          prompt: 'A snapshot is taken, then every order is deleted. The backup is attached and both tables are counted. What are the two lines printed?',
          concept: 'a backup is a moment in time',
          language: 'sql',
          code: `CREATE TABLE orders (id INTEGER PRIMARY KEY);
INSERT INTO orders VALUES (1), (2), (3);
VACUUM INTO '/tmp/bk-snapshot.db';
DELETE FROM orders;
ATTACH '/tmp/bk-snapshot.db' AS bk;
SELECT COUNT(*) FROM orders;
SELECT COUNT(*) FROM bk.orders;`,
          expected: '0\n3',
          choices: ['0\n0', '0\n3', '3\n3', '3\n0'],
          wrongNotes: {
            '0\n0': 'The snapshot was taken before the delete, and it is a separate file, so deleting from the live table does not touch it.',
            '3\n3': 'The live table is emptied by DELETE, so the first count cannot be 3.',
            '3\n0': 'Reversed: the live table is the one that was emptied, and the snapshot still holds the three orders.',
          },
          hints: [
            'Which table lost its rows: the live one or the snapshot file?',
            'The snapshot is a separate file made before the DELETE.',
            'Live table: 0. Snapshot: still 3.',
          ],
          explanation: 'VACUUM INTO writes a separate file holding the data as it was at that moment. The later DELETE empties only the live table, so the counts are 0 and 3, which is exactly why a backup lets you recover.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-08-fill-blank-1',
          kind: 'fill-blank',
          title: 'Complete the restore check',
          prompt: 'This drill restores a dump into a new database and checks it. Fill the two blanks from the bank.',
          concept: 'restoring into a new database and checking',
          language: 'bash',
          code: `pg_dump -Fc -f bakery.dump bakery
psql -c "create database bakery_check"
pg_restore -d ___ bakery.dump
psql -d bakery_check -c "select ___(*) from orders"`,
          blanks: [
            { answers: ['bakery_check'], feedback: 'The restore must go into the new, separate database that was just created, never over the original.' },
            { answers: ['count'], feedback: 'To compare with the original you want the number of rows, which is count.' },
          ],
          bank: ['bakery_check', 'bakery', 'count', 'sum', 'bakery.dump'],
          hints: [
            'Which database is the safe place to try the restore?',
            'The second blank is the function that counts rows.',
            'bakery_check, then count.',
          ],
          explanation: 'Restoring into bakery_check leaves the live bakery database untouched, and count(*) gives a number you can compare with the original’s orders.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-08-scenario-1',
          kind: 'scenario',
          title: 'Is this backup plan good enough?',
          prompt: 'Choose your response to the AI’s plan.',
          concept: 'judging a backup plan',
          situation: 'Your AI tool writes a backup script that runs every night. It writes bakery-backup.sql to the same server’s /backups folder, the database password is typed into the script, and the plan says “restore if needed”. The bakery can lose at most one hour of orders.',
          options: [
            { text: 'Reject it: back up at least hourly, keep copies off the server, read the password from an environment variable, and write and practise a timed restore into a new database.', consequence: 'The plan now meets the one-hour limit, survives losing the server, keeps the secret out of the file, and has been proved by a drill.', quality: 'best' },
            { text: 'Accept it. A nightly file is a backup.', consequence: 'Losing the server loses both the data and its only backup, up to a day of orders can be lost, and nobody knows the file restores.', quality: 'poor' },
            { text: 'Keep the nightly schedule but copy the file to another machine each morning.', consequence: 'Better: the copy survives the server, but you can still lose almost a day of orders, and the password is still in the script and the restore is still untested.', quality: 'acceptable' },
            { text: 'Switch to a spreadsheet export that Aling Nena opens each evening.', consequence: 'A spreadsheet does not hold the structure or rules, it is not a restore path, and it relies on a person remembering.', quality: 'poor' },
          ],
          hints: [
            'Which of the three needs is not met: how often, where, or whether it is proved?',
            'One hour of loss means more than a nightly copy, and the copy must survive the server.',
            'Hourly, off-server, no password in the file, restore tested and timed.',
          ],
          explanation: 'A plan is judged against your recovery point and time, where the copies live, how secrets are handled, and whether a restore has been proved. A nightly file on the same server fails all four.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-08-match-1',
          kind: 'match',
          title: 'Which need does this answer?',
          prompt: 'Match each situation to what the plan must do about it.',
          concept: 'backup requirements',
          labels: { terms: 'Situation', meanings: 'What the plan must do' },
          pairs: [
            { term: 'We can afford to lose at most one hour of orders', definition: 'Meet the recovery point: back up or archive at least hourly', note: 'The most you can lose sets how often to copy.' },
            { term: 'The bakery cannot be closed for more than thirty minutes', definition: 'Meet the recovery time: practise the restore and time it', note: 'Only a timed restore tells you how long recovery takes.' },
            { term: 'The server’s disk fails, taking the database and the backup folder with it', definition: 'Keep a copy somewhere other than the database’s machine', note: 'A copy beside the database dies with it.' },
            { term: 'The backup file exists but nobody has ever opened it', definition: 'Run a restore drill and check the data', note: 'An unrestored backup is a hope.' },
          ],
          hints: [
            'Ask whether each situation is about how much, how long, where, or whether it works.',
            'How much loss sets frequency; how long sets restore speed; the disk failure is about where the copy lives.',
            'One hour: hourly. Thirty minutes: timed restore. Disk failure: elsewhere. Never opened: drill.',
          ],
          explanation: 'Each situation maps to a distinct requirement: frequency (recovery point), speed (recovery time), location (a separate copy) and proof (a drill).',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-08-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'Four recovery words',
          prompt: 'Say each in your own words, then tap to check.',
          concept: 'backup vocabulary',
          cards: [
            { front: 'Backup', back: 'A copy of your data from one moment, kept so you can go back to it.' },
            { front: 'Restore', back: 'Putting the data from a backup back into a working database.' },
            { front: 'Recovery point', back: 'How much recent data you can afford to lose, such as one hour of orders.' },
            { front: 'Restore drill', back: 'Practising a restore on a calm day, checking the data and timing it.' },
          ],
          hints: ['Think of photographing the order notebook every evening.'],
          explanation: 'These four words are the language of getting your data back.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-database-design-08-q1',
        prompt: 'Why is a backup that has never been restored only a hope?',
        choices: [
          'It may be empty or unreadable, and you learn that only when you need it',
          'Backups only become valid after the database vendor has restored them once',
          'The database deletes any backup that has not been opened within a week',
          'A backup is only a copy of the structure and never of the data inside',
        ],
        answer: 0,
        explanation: 'Until you restore and check it, you do not know the backup works. Restoring does not validate anything at a vendor, and a normal backup includes the data.',
      },
      {
        id: 'ai-database-design-08-q2',
        prompt: 'The bakery can afford to lose at most one hour of orders. What does that decide?',
        choices: [
          'How many people may have a password to the database',
          'That copies or archived changes must be made at least every hour',
          'That the backup must be stored in a spreadsheet instead of a file',
          'That the database must be restored once every hour to stay healthy',
        ],
        answer: 1,
        explanation: 'The amount of data you can lose is the recovery point, and it sets how often you must back up (or archive changes). It says nothing about passwords, file formats or restoring hourly.',
      },
      {
        id: 'ai-database-design-08-q3',
        prompt: 'A nightly backup file is stored in a folder on the same server as the database. What is the main risk?',
        choices: [
          'The file will be too large to open on a different computer later on',
          'The database runs more slowly while the backup file sits on its disk',
          'One failure, such as a dead disk or a break-in, can destroy both',
          'Backups kept on the same server cannot be restored into a new database',
        ],
        answer: 2,
        explanation: 'A copy that shares the database’s fate protects against little. Keep at least one copy somewhere else. File size and speed are not the point, and a same-server file can be restored.',
      },
      {
        id: 'ai-database-design-08-q4',
        prompt: 'You have just restored a backup into a new database. Which check is most useful first?',
        choices: [
          'Assume it worked, because the restore tool printed no error message at all',
          'Delete the backup file straight away to free the space it takes on disk',
          'Restart the computer to make sure the new database is saved properly',
          'Compare row counts with the original and run key queries on the copy',
        ],
        answer: 3,
        explanation: 'No error is not proof: a table can be missing without one. Matching counts and working business queries show the data is complete and usable. Deleting the backup removes your safety net.',
      },
      {
        id: 'ai-database-design-08-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is a restore drill?',
        choices: [
          'A tool that makes your database run faster during the night hours',
          'Practising a restore from a backup before there is an emergency',
          'A password you must type before anyone can open a backup file',
          'Deleting old backups so that the newest one is the only copy kept',
        ],
        answer: 1,
        explanation: 'A drill is a practice run of the restore, to prove it works and to time it. It is not a speed tool, a password or a clean-up.',
      },
      {
        id: 'ai-database-design-08-q6',
        audience: { min: 'advanced' },
        prompt: 'A bad migration dropped a column at 14:05 on a hosted project that has point-in-time recovery. What is the safest way to use it?',
        choices: [
          'Restore the live project to the oldest available point so no recent change stays',
          'Skip the restore and re-run the same migration to see if it repairs the column',
          'Restore to just before 14:05 on the live project straight away, to save time',
          'Restore to just before 14:05 into a new project first, then inspect it',
        ],
        answer: 3,
        explanation: 'A point-in-time restore replaces the current state of the project it targets, so restoring to a new project first lets you compare and recover only what you need. Restoring to the oldest point loses the most data, and re-running the migration does not bring a column back.',
      },
    ],
    task: {
      title: 'Run your own restore drill',
      minutes: 20,
      steps: [
        'Use the bakery database from the earlier lessons (SQLite file, or a PostgreSQL database). Write down your recovery point and recovery time in one sentence each.',
        'Take a backup with `VACUUM INTO` (SQLite) or `pg_dump -Fc` (PostgreSQL), then delete every order from a copy of the database and confirm the count is 0.',
        'Restore into a new file or database and check: an integrity check, row counts for every table against the original, and an orphan check for lines with no order. Time the whole process with a stopwatch.',
        'Ask your AI tool for a backup plan with the prompt in this lesson and compare it with the checklist: how often, where the copies live, how secrets are handled and whether a restore is proved. List what it left out.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Write the restore steps on one page in your own words, as if for a friend who must do it while you are away, and ask your AI tool to point out anything unclear.'] },
      { audience: { min: 'advanced' }, steps: ['Automate the drill as a scheduled job that restores the latest backup into a scratch database, asserts the row counts and orphan check, and alerts on failure. Record the measured restore time next to your recovery-time objective.'] },
    ],
  },
  {
    id: 'ai-database-design-09',
    day: 9,
    title: 'Project: design the data for a real app',
    summary: 'Bring the whole course together: the seven things to produce, the order to work in, a one-page data design record and a final review checklist.',
    minutes: 26,
    skills: ['data-thinking', 'schema-review', 'safe-migrations', 'access-rules', 'backup-recovery'],
    intro: {
      objectives: [
        'Plan the data design of a real app as seven concrete deliverables, in a sensible order',
        'Write a one-page data design record that someone else could review',
        'Judge your own design with a final checklist that covers structure, safety, access and recovery',
      ],
      why: 'Anyone can ask an AI for a schema. What clients, teammates and employers trust is evidence that you described the data, checked what came back, changed it safely, locked it down and proved you can recover it.',
    },
    body: [
      {
        type: 'paragraph',
        text: 'You now have every piece. In the earlier lessons you described data, reviewed schemas, connected tables, changed a live database safely, checked queries, wrote access rules and restored a backup, all on one bakery. The final project asks you to do it again for **an app of your own**, and to leave behind evidence that you did it properly. This lesson is the plan: what to produce, in what order, and how to judge your result. Nothing here is new SQL; the skill being tested is judgment about what the AI hands you.',
      },
      { type: 'heading', text: 'Seven things to produce' },
      {
        type: 'table',
        headers: ['What you produce', 'From lesson', 'What it proves'],
        rows: [
          ['1. A data description: things, facts, connections, rules, questions, history', '2', 'You know what the app must remember and what must always be true'],
          ['2. A reviewed schema that applies the seven questions, with connections and delete rules', '3 and 4', 'The structure is sound and every choice has a reason'],
          ['3. Negative tests: inserts that must fail', '3', 'The database, not just the app, refuses bad data'],
          ['4. A migrations folder with a runner, plus one real change made safely', '5', 'You can change a live database without losing data'],
          ['5. Five queries, each checked on a seed with a written expected answer, and one query plan', '6', 'Your reports are right and not read-everything slow'],
          ['6. Access rules and a test acting as two people and a signed-out visitor', '7', 'One person cannot reach another’s rows'],
          ['7. A timed restore drill', '8', 'You can get the data back, and you know how long it takes'],
        ],
        caption: 'The same seven things you built for the bakery. Together they are the project’s evidence.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The order of work. Each stage checks the one before it; the AI helps at every stage and decides none of them.',
        source: `flowchart TD
  A[Describe the data in five parts] --> B[Ask the AI for the design in words]
  B --> C[Review it against your description]
  C --> D[Ask for the SQL and apply the seven questions]
  D --> E[Seed data and negative tests]
  E --> F[Five queries checked on the seed]
  F --> G[Access rules tested as two people]
  G --> H[One safe migration with a backup first]
  H --> I[Timed restore drill]
  I --> J(Write the one-page design record)`,
      },
      { type: 'heading', text: 'Choose an app that is small and real' },
      {
        type: 'paragraph',
        text: 'Pick something you could plausibly build or sell, small enough to finish. A good project has **at least four tables, one many-to-many connection, private data that belongs to individual people, money or counts that must be exact, and something that changes over time and must be remembered as it was.** A boarding-house rent tracker (rooms, tenants, leases, payments), a tutoring schedule, a sari-sari store’s utang ledger, a driver’s trip and fuel log, or your own idea all qualify. Avoid projects whose data is mostly sensitive personal records you are not equipped to protect.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: '**In plain words.** Start smaller than feels impressive. Three tables are plenty: for a rent tracker, rooms, tenants and payments. Use a SQLite file on your own computer, which needs nothing installed beyond the `sqlite3` tool, and ask your AI tool to explain each step as it goes. You can still do all seven things: describe the data, review the AI’s tables with the seven questions, try to break them with bad rows, make one safe change, check two queries against answers you worked out by hand, and restore a backup. Access rules (the lock on each row) matter most when many people share a database, so for a single-user practice file you can write down *what the rules would be* instead of building them. A finished small project beats an unfinished big one.',
      },
      { type: 'heading', text: 'The data design record' },
      {
        type: 'paragraph',
        text: 'The last thing you write is a **one-page record** of the design, for the next person (or the next AI session) who has to change it. It is the document that turns a pile of SQL into something reviewable. A reviewer should be able to read it in five minutes and know what the data is, what protects it and how to recover it.',
      },
      {
        type: 'code',
        language: 'text',
        label: 'Data design record: template (bakery excerpt in the right column of the table below)',
        code: `DATA DESIGN RECORD: <app name>, <date>

1. Purpose        What the app remembers, in two sentences.
2. Tables         For each: what one row is, its primary key, its foreign keys.
3. Rules          Every NOT NULL, UNIQUE and CHECK, with the reason for each.
4. History        Which facts are copied so they stay as they were, and why.
5. Deletes        What each foreign key does on delete (RESTRICT / CASCADE / SET NULL) and why.
6. Questions      The five queries, each with its expected answer on the seed data.
7. Access         Who may read, add, change and delete what; the two-person test and its result.
8. Changes        How migrations run; the last migration and how it was checked.
9. Recovery       Recovery point, recovery time, where copies live, the last drill and its timing.
10. Not covered   What the backups and the rules do not protect (files, secrets, columns).
11. Open risks    What you know is still weak, and who decides when to fix it.`,
      },
      {
        type: 'table',
        headers: ['Section', 'Bakery example (condensed)'],
        rows: [
          ['Tables', 'customers (id), products (id), orders (id; customer_id to customers), order_items (order_id + product_id; to orders and products)'],
          ['Rules', 'phone UNIQUE and NOT NULL; price_cents above zero; quantity above zero; status one of four values'],
          ['History', 'order_items.unit_price_cents copies the price at the time of sale'],
          ['Deletes', 'order lines cascade from their order; orders and products are RESTRICTed; customers are anonymised, never deleted'],
          ['Access', 'a customer reads and creates only their own orders and lines; products are readable by everyone; tested as two customers and a signed-out visitor'],
          ['Recovery', 'at most one hour of orders lost, thirty minutes down; hourly copy kept off the server; restore drill timed'],
        ],
        caption: 'The record is short on purpose: every line is a decision someone can challenge.',
      },
      { type: 'heading', text: 'Working with the AI at each stage' },
      {
        type: 'paragraph',
        text: 'You will use the AI at every stage, so keep the same rule throughout: **it drafts, you decide, and you verify with something that can fail.** At each stage there is a prompt from this course to reuse (the interview, the seven-question review, the connection defence, the migration and its risks, the show-your-work query, the policies with a two-person test, the backup plan). Keep a short log of **what the AI got wrong or left out** at each stage. That log is the most convincing part of your submission, because it shows judgment, not just output.',
      },
      {
        type: 'paragraph',
        audience: { min: 'intermediate', max: 'intermediate' },
        text: '**At your level.** Build it on PostgreSQL (a local install, or a free hosted project) and include row-level security with the two-person test, a migration folder, and a restore drill using `pg_dump` and `pg_restore` into a new database. If you use Supabase, use its migration files and read what your plan backs up.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: '**For experienced engineers.** Make the project realistic: state expected volume and concurrency in the description, apply the design to an existing codebase or an existing database with data already in it (so the migration is a real expand-and-contract on populated tables), index the foreign keys and policy columns and show before-and-after plans on production-sized data, run the access tests as the application’s role, automate the restore drill, and put the migration and test steps in CI. If an agent assisted, keep its transcript or diff as evidence, give it read-only credentials, and list what you verified independently, since agent output is a proposal to be tested.',
      },
      {
        type: 'takeaways',
        items: [
          'The project is seven pieces of evidence: a description, a reviewed schema, negative tests, safe migrations, checked queries, tested access rules and a timed restore drill.',
          'Work in order, and let each stage check the one before it, with the AI drafting and you deciding.',
          'Pick an app with at least four tables, a many-to-many connection, private data and money or history; start smaller if you are new.',
          'Finish with a one-page data design record so someone else can review, change and recover the design.',
          'Keep a log of what the AI got wrong or left out: it is the proof of your judgment.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-09-arrange-1',
          kind: 'arrange',
          title: 'The order of work',
          prompt: 'Put the stages of the project in the order you would do them, first at the top.',
          concept: 'order of a database design project',
          language: 'text',
          solution: [
            'Describe the data in five parts',
            'Ask the AI for the design in words and review it against the description',
            'Ask for the SQL and review it with the seven questions',
            'Add seed data and negative tests that must fail',
            'Write five queries and check them on the seed',
            'Write access rules and test them as two people',
            'Make one change as a migration, with a backup first',
            'Run and time a restore drill, then write the design record',
          ],
          reasons: [
            'Everything else is measured against the description.',
            'A design in words is cheap to correct before any SQL exists.',
            'The SQL is judged with the seven questions only once the design is agreed.',
            'Tests need a schema and data to run against, and they protect every later change.',
            'Queries come after the structure they read, and need seed data with a known answer.',
            'Access rules need the tables and the questions the app asks of them.',
            'A real change proves the migration routine on a design that already has data in it.',
            'The drill proves recovery of the finished design, and the record describes all of it.',
          ],
          hints: [
            'What must exist before anything can be checked against it?',
            'Structure first, then tests and data, then queries and access rules, then change and recovery.',
            'Describe, design in words, SQL, seed and tests, queries, access, migration, drill and record.',
          ],
          explanation: 'Each stage depends on the one before it: the description defines correctness, the schema gives the tests and queries something to run on, the rules sit on top of the tables, and the migration and drill prove the finished design can change and recover.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-09-sql-1',
          kind: 'sql-challenge',
          title: 'What earns the most?',
          story: 'For the design record, Aling Nena wants one check query: money earned per product, excluding cancelled orders.',
          prompt: 'Show each product `name` and its revenue as `revenue_cents` (quantity times `unit_price_cents`, summed), counting only orders that are not cancelled, biggest revenue first and by name for ties. The starter ignores the status.',
          concept: 'a business question across three tables',
          setup: `CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE orders (id INTEGER PRIMARY KEY, status TEXT NOT NULL);
CREATE TABLE order_items (order_id INTEGER NOT NULL, product_id INTEGER NOT NULL, quantity INTEGER NOT NULL, unit_price_cents INTEGER NOT NULL);
INSERT INTO products (id, name) VALUES (1, 'Pandesal (dozen)'), (2, 'Ensaymada'), (3, 'Pan de coco');
INSERT INTO orders (id, status) VALUES (1, 'picked_up'), (2, 'ready'), (3, 'cancelled'), (4, 'pending');
INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents) VALUES (1, 1, 2, 6000), (1, 2, 3, 3500), (2, 1, 1, 6000), (3, 2, 10, 3500), (4, 3, 4, 2500);`,
          starter: 'SELECT p.name, SUM(oi.quantity * oi.unit_price_cents) AS revenue_cents\nFROM order_items oi\nJOIN products p ON p.id = oi.product_id\nGROUP BY p.name\nORDER BY revenue_cents DESC, p.name;',
          expected: { columns: ['name', 'revenue_cents'], rows: [['Pandesal (dozen)', 18000], ['Ensaymada', 10500], ['Pan de coco', 10000]], ordered: true },
          solution: "SELECT p.name, SUM(oi.quantity * oi.unit_price_cents) AS revenue_cents\nFROM order_items oi\nJOIN orders o ON o.id = oi.order_id\nJOIN products p ON p.id = oi.product_id\nWHERE o.status <> 'cancelled'\nGROUP BY p.name\nORDER BY revenue_cents DESC, p.name;",
          hints: [
            'The status lives on orders, so the lines must be joined to orders as well.',
            'Add JOIN orders o ON o.id = oi.order_id and filter on o.status before grouping.',
            "WHERE o.status <> 'cancelled' between the joins and GROUP BY.",
          ],
          explanation: 'The cancelled order’s ten ensaymada would have made Ensaymada the top earner (45500). Joining to orders and excluding the cancelled status gives Pandesal 18000, Ensaymada 10500 and Pan de coco 10000.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-09-fix-bug-1',
          kind: 'fix-bug',
          title: 'Do not erase the rent history',
          prompt: 'A boarding-house app’s payments table was generated by an AI. Tap the line that would erase a tenant’s payment history when the tenant is deleted, then choose the fix.',
          concept: 'a safe delete rule',
          language: 'sql',
          code: `CREATE TABLE payments (
  id INTEGER PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  paid_on TEXT NOT NULL
);`,
          bugLine: 3,
          lineNote: 'That line is fine. Look at the line with the delete rule.',
          fixes: [
            { line: '  tenant_id INTEGER NOT NULL REFERENCES tenants (id) ON DELETE RESTRICT,', correct: true, why: 'The database now refuses to delete a tenant who has payments, so the landlord’s records cannot be erased by accident.' },
            { line: '  tenant_id INTEGER NOT NULL REFERENCES tenants (id) ON DELETE SET NULL,', correct: false, why: 'The column is NOT NULL, so this conflicts with itself, and even if it worked every payment would lose who paid it.' },
            { line: '  tenant_id INTEGER NOT NULL REFERENCES tenants (id) ON DELETE CASCADE ON UPDATE CASCADE,', correct: false, why: 'Adding ON UPDATE CASCADE does nothing about the delete: the payments are still erased with the tenant.' },
            { line: '  tenant_id INTEGER NOT NULL,', correct: false, why: 'Removing the foreign key means payments can point at tenants who do not exist, which is a worse problem.' },
          ],
          hints: [
            'What does CASCADE do to the payments when a tenant row is deleted?',
            'A payment history is a record you want to keep; the database should refuse the delete.',
            'Change ON DELETE CASCADE to ON DELETE RESTRICT.',
          ],
          explanation: 'CASCADE passes the delete down, so removing a tenant would silently erase the rent history. RESTRICT protects the records and forces a deliberate decision, such as marking the tenant as moved out.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-09-scenario-1',
          kind: 'scenario',
          title: 'Where do you start the review?',
          prompt: 'Choose your first move.',
          concept: 'reviewing a whole design',
          situation: 'A classmate shows you their AI-generated rent tracker: one payments table holding tenant name, room and rent (as a decimal), no foreign keys, no policies, and “backups: Google Drive, sometimes”. They ask what to fix first.',
          options: [
            { text: 'Work through the checklist in order: write the data description, fix the structure (separate tables, keys, whole-centavo money, constraints), prove it with bad rows, then access rules, then backups with a drill.', consequence: 'The structure is fixed first, so the rules, the queries and the restore all sit on something sound, and every step is checked.', quality: 'best' },
            { text: 'Switch on row-level security first, because it is the security problem.', consequence: 'A fair instinct, but the rules need the right tables to attach to. One flat table means you will redo the policies after the structure changes.', quality: 'acceptable' },
            { text: 'Ask the AI to “improve and harden it” and accept the new version.', consequence: 'You get a bigger schema with the same unverified claims, and you cannot say what is now better or what is still missing.', quality: 'poor' },
            { text: 'Add indexes on every column, since slow queries lose users.', consequence: 'There is no data yet to be slow, the real problems are untouched, and every index slows writes for no reason.', quality: 'poor' },
          ],
          hints: [
            'What do the access rules, the queries and the backup all depend on?',
            'Structure first, then protection and recovery.',
            'Fix the tables, keys and constraints, prove them, then add access rules and a drilled backup.',
          ],
          explanation: 'Access rules, queries and backups all depend on a sound structure, so you fix that first and prove it. Hardening requested from the same AI without checks gives you more claims, not more safety.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-09-match-1',
          kind: 'match',
          title: 'Which question does this evidence answer?',
          prompt: 'Match each deliverable to the question a reviewer asks of it.',
          concept: 'evidence in a data design',
          labels: { terms: 'Deliverable', meanings: 'The reviewer’s question' },
          pairs: [
            { term: 'Data description with rules and history', definition: 'What must the app remember, and what must always be true?', note: 'The description defines what correct means.' },
            { term: 'Negative tests: inserts that must fail', definition: 'Does the database itself refuse bad data?', note: 'Tests that must fail show a rule exists.' },
            { term: 'Two-person access test', definition: 'Can one customer reach another customer’s rows?', note: 'Acting as two people tests the separation.' },
            { term: 'Timed restore drill', definition: 'Can we get the data back, and how long does it take?', note: 'Only a drill shows recovery and its duration.' },
          ],
          hints: [
            'Which question would you ask if you could only see that one piece of evidence?',
            'The negative tests are about refusal; the two-person test is about separation.',
            'Description: what is true. Negative tests: refusal. Access test: separation. Drill: recovery.',
          ],
          explanation: 'Each piece of evidence answers one reviewer question, so together they cover what the data is, whether it is protected from bad writes and from the wrong readers, and whether it can be recovered.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'ai-database-design-09-tap-reveal-1',
          kind: 'tap-reveal',
          audience: { max: 'beginner' },
          title: 'The course in six cards',
          prompt: 'Tap each card after you have said the idea in your own words.',
          concept: 'review of the course',
          cards: [
            { front: 'Describe', back: 'Say the things, facts, connections, rules, questions and history of your app before asking the AI.' },
            { front: 'Review', back: 'Check every schema with the seven questions; the AI’s “looks good” is not proof.' },
            { front: 'Connect', back: 'Store each fact once and point to it; choose what happens on delete.' },
            { front: 'Change', back: 'Back up, write a numbered migration, test on a copy, run in a transaction.' },
            { front: 'Check and lock', back: 'Test queries on known data, send values as parameters, and test who may see what.' },
            { front: 'Recover', back: 'Restore a backup into a new database and time it before you ever need it.' },
          ],
          hints: ['Each card is one lesson of the course.'],
          explanation: 'These six verbs are the whole workflow: describe, review, connect, change, check and lock, recover.',
        },
      },
    ],
    quiz: [
      {
        id: 'ai-database-design-09-q1',
        prompt: 'Which deliverable shows that the database itself, not only the app, refuses bad data?',
        choices: [
          'A diagram of how all the tables connect to one another',
          'The written description of everything the app remembers',
          'A set of negative tests: inserts that must fail',
          'A list of the AI tools that were used to design the data',
        ],
        answer: 2,
        explanation: 'Only an insert that is refused proves a rule exists in the database. A diagram, a description and a tool list say nothing about what the database will accept.',
      },
      {
        id: 'ai-database-design-09-q2',
        prompt: 'Why does the design record include a “not covered” section for the backups and rules?',
        choices: [
          'So the owner knows what needs its own protection, like files',
          'So that the backups can be skipped for any item that is listed there',
          'So the database can safely ignore those items when a restore is run',
          'So the record fills one complete page, as the template demands of it',
        ],
        answer: 0,
        explanation: 'Database backups and row rules do not cover everything, such as files, secrets and sign-in settings. Writing the gaps down is how they get their own protection.',
      },
      {
        id: 'ai-database-design-09-q3',
        prompt: 'In the order of work, what comes straight after the AI’s design in words?',
        choices: [
          'Writing the access rules for each of the tables that it described',
          'Applying a migration to the live database for the very first time',
          'Running a restore drill on all of the tables that it described',
          'Review it against your own description before writing any SQL',
        ],
        answer: 3,
        explanation: 'The design in words is cheap to correct, so it is checked against your description first. Access rules, migrations and drills come once the structure is agreed.',
      },
      {
        id: 'ai-database-design-09-q4',
        prompt: 'What result of the two-person access test shows the rules work?',
        choices: [
          'Both customers can see every single order, so nobody is blocked from the data',
          'Each sees only their own rows, a visitor sees none, writes to others fail',
          'The test passes when it is run through the table owner’s own connection',
          'The app’s screens only ever show the signed-in customer’s own orders',
        ],
        answer: 1,
        explanation: 'The rules work when each person sees only their own rows, a visitor sees nothing, and attempts to write to someone else’s rows fail or change zero rows. Owner connections and screen filters prove nothing about the policies.',
      },
      {
        id: 'ai-database-design-09-q5',
        audience: { max: 'beginner' },
        prompt: 'In plain words, what is the data design record for?',
        choices: [
          'A one-page note on the data, its rules and its protection',
          'A secret file that stores the passwords of every one of the customers',
          'A printed list of every single row in the database, kept for safety',
          'A program that makes the database run much faster whenever it is open',
        ],
        answer: 0,
        explanation: 'The record explains the design and its safeguards to the next person. It holds no passwords, it is not a copy of the data, and it does not change speed.',
      },
      {
        id: 'ai-database-design-09-q6',
        audience: { min: 'advanced' },
        prompt: 'An agent proposes a migration that adds a column and an index to a large production table in one go. What should you check before running it?',
        choices: [
          'Whether the agent used a polite tone in its explanation of the change',
          'Only that the SQL has no syntax errors, since the database will otherwise cope',
          'Whether they lock or rewrite the table on your version; rehearse on a copy',
          'Whether the table has fewer than ten columns before the change is made',
        ],
        answer: 2,
        explanation: 'On a large live table, some changes hold strong locks or rewrite the table. Check your database’s documentation for each statement, and rehearse on a restored copy with realistic data. Tone and column counts are irrelevant, and valid syntax says nothing about locking.',
      },
    ],
    task: {
      title: 'Plan your project on one page',
      minutes: 20,
      steps: [
        'Choose your app and write one paragraph saying who uses it, which data is private to a person, and what must be remembered as it was.',
        'Write the five-part description (things, facts, connections, rules, questions) and a history line. Run the “interview me first” prompt and note what the AI found that you missed.',
        'Make a checklist of the seven deliverables with a date for each, and decide where your data will live (a SQLite file, a local PostgreSQL, or a Supabase project) and why.',
        'Copy the data design record template into a file. Fill in the Purpose and Tables sections from your description now; the rest will fill in as you build.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Show your one-page plan to a friend and ask them to tell you back what your app remembers. Fix anything they misunderstand.'] },
      { audience: { min: 'advanced' }, steps: ['Add a risk register to the plan: the three ways this design could fail in production, how you would detect each one, and which deliverable addresses it.'] },
    ],
  },
];

const projects: Project[] = [
  {
    id: 'ai-database-design-p1',
    title: 'Review an AI-generated schema',
    summary: 'Describe a small app’s data, get a first schema from an AI tool, and review it against the seven questions with bad rows that prove each gap.',
    outcome: 'A written schema review with proof of each gap, showing a client you can judge generated database designs instead of accepting them.',
    unlockAfterDay: 4,
    steps: [
      { id: 'ai-database-design-p1-s1', text: 'Choose a small app (a rent tracker, tutoring schedule or your own idea) and write its five-part data description with a history line.' },
      { id: 'ai-database-design-p1-s2', text: 'Ask an AI tool for a schema from a deliberately short prompt, then again with your full description. Save both answers.', link: 'https://www.sqlite.org/datatype3.html' },
      { id: 'ai-database-design-p1-s3', text: 'Apply the seven questions to each schema and write down every gap you find, with the table and column.' },
      { id: 'ai-database-design-p1-s4', audience: { max: 'beginner' }, text: 'Keep to three tables in a SQLite file. Ask your AI tool to explain each constraint in everyday words and write the explanation next to it.' },
      { id: 'ai-database-design-p1-s5', text: 'Write at least five negative tests (inserts that should fail) and run them on both schemas. Record which were wrongly accepted and the exact errors of those that were refused.' },
      { id: 'ai-database-design-p1-s6', audience: { min: 'advanced' }, text: 'Run the negative tests on both SQLite and PostgreSQL and list where the two engines disagree, with the reason.' },
    ],
    submission: {
      kind: 'text',
      label: 'Your schema review',
      placeholder: 'Paste your description, the two prompts, the two schemas, your gap list, your negative tests with results, and the corrected schema.',
      hint: 'A good review names the table and column of every gap, shows the failing insert that proves it, and ends with a corrected schema that passes all of them.',
    },
    rubric: [
      'The description names things, facts, connections, rules, questions and history in plain words',
      'The review applies all seven questions to the schemas, with specific tables and columns named',
      'At least five negative tests are shown with the real results, not guesses',
      'The corrected schema refuses every bad insert the first one accepted',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['Each constraint used is explained in everyday words', 'Three tables are enough; clarity matters more than size'] },
      { audience: { min: 'intermediate', max: 'intermediate' }, items: ['The schema includes at least one foreign key and one join table, with delete rules chosen and explained'] },
      { audience: { min: 'advanced' }, items: ['Differences between SQLite and PostgreSQL behaviour are listed and explained', 'Constraints are added in a way that would work on a table that already holds data'] },
    ],
  },
  {
    id: 'ai-database-design-p2',
    title: 'Design the data for a real app',
    summary: 'Design, review, protect and recover the data for an app of your own, with the seven pieces of evidence and a one-page data design record.',
    outcome: 'A complete, evidenced data design (description, schema, migrations, checked queries, access rules, restore drill and design record) that you can show to a client or employer.',
    unlockAfterDay: 8,
    steps: [
      { id: 'ai-database-design-p2-s1', text: 'Write the five-part data description and the project plan from this lesson’s task for an app with at least four tables, a many-to-many connection, private data and something that must be remembered as it was.' },
      { id: 'ai-database-design-p2-s2', text: 'Get the design in words from an AI tool, review it against your description, then ask for the SQL and review it with the seven questions. Write the connections and delete rules with their reasons.' },
      { id: 'ai-database-design-p2-s3', audience: { max: 'beginner' }, text: 'Use a SQLite file and three or four tables. Write the access rules in words (who should see what) instead of building them, and explain why a shared database would need them.' },
      { id: 'ai-database-design-p2-s4', text: 'Create a seed with awkward cases and a negative-test file. Put migrations in a numbered folder with a runner, and make one real change (for example, a new column or status) following the safe routine.' },
      { id: 'ai-database-design-p2-s5', text: 'Write five queries for the questions your app must answer. For each, write the expected result on the seed first, then check it, and capture one query plan before and after an index.' },
      { id: 'ai-database-design-p2-s6', audience: { min: 'intermediate' }, text: 'Use PostgreSQL (local or Supabase). Enable row-level security on every private table, write one policy per operation, and test as two people and a signed-out visitor.' },
      { id: 'ai-database-design-p2-s7', audience: { min: 'advanced' }, text: 'Apply the design to an existing database or codebase with data already in it, test the policies as the application’s role, index policy and foreign key columns, and show plans on production-sized data.' },
      { id: 'ai-database-design-p2-s8', text: 'Run and time a restore drill into a new database, with integrity, row-count and orphan checks, then write the one-page data design record, including the log of what the AI got wrong.' },
    ],
    submission: {
      kind: 'url',
      label: 'Link to your project folder',
      placeholder: 'https://github.com/you/your-app-data-design',
      hint: 'Include the description, schema and migrations, the seed and negative tests, the five queries with expected results, the access test, the drill notes and the design record.',
    },
    rubric: [
      'The description, schema and design record agree with one another: every table, rule and delete choice has a reason',
      'Negative tests and the migrations folder show that the database refuses bad data and changes in recorded steps',
      'Each of the five queries has an expected answer written before it was run, and one query plan shows an index being used',
      'Access rules (or, for a single-user practice file, a written access plan) cover who may read, add, change and delete what, with a test as two people',
      'The restore drill is timed, checks counts and orphans, and the record lists what is not covered',
    ],
    rubricExtra: [
      { audience: { max: 'beginner' }, items: ['The project is small and finished: three or four tables, every step done at least once', 'Technical words in the design record are explained in a sentence'] },
      { audience: { min: 'intermediate', max: 'intermediate' }, items: ['The design uses PostgreSQL with row-level security on every private table and a policy per operation', 'The migration was run on a copy of data with a backup taken first'] },
      { audience: { min: 'advanced', max: 'advanced' }, items: ['The design was applied to an existing codebase or database with data in it, using expand and contract for at least one change', 'Policies were tested as the application’s role, and plans are shown on production-sized data'] },
      { audience: { min: 'professional' }, items: ['An agent-assisted workflow is documented with read-only credentials, reviewed diffs and a list of independently verified claims', 'Migrations, access tests and the restore drill run automatically in CI'] },
    ],
  },
];

export const aiDatabaseDesignCourse: Course = {
  id: 'ai-database-design',
  kind: 'standard',
  title: 'AI-Assisted Database Design',
  level: 'intermediate',
  tagline: 'Describe your data, judge the schema AI proposes, change it safely and keep it protected and recoverable.',
  description: 'Learn to design and change the data behind an app with an AI assistant. You will describe your data so the AI designs from your needs, review generated schemas, check the queries it writes, set access rules and prove you can restore a backup.',
  finishLine: ['A written description of your app’s data and a reviewed schema', 'Migrations you can run, check and undo', 'Queries you have verified on known data, with their plans', 'Access rules tested as two different users', 'A backup you have actually restored'],
  objectives: [
    'Describe an app’s data to an AI so it designs from your needs',
    'Review a generated schema for keys, duplicates, types and missing rules',
    'Model relationships and decide what happens when a row is deleted',
    'Change a live database safely with migrations and a backup',
    'Read and check the queries AI writes, including their plans',
    'Write and test row-level access rules and a restore drill',
  ],
  audiences: ['builder', 'career-changer', 'experienced-dev'],
  skills: [
    { id: 'data-thinking', label: 'Thinking in data' },
    { id: 'sql-reading', label: 'Reading SQL' },
    { id: 'ai-data-prompts', label: 'Prompting for data work' },
    { id: 'schema-review', label: 'Schema review' },
    { id: 'relationships', label: 'Relationships and keys' },
    { id: 'safe-migrations', label: 'Safe migrations' },
    { id: 'query-checking', label: 'Checking queries' },
    { id: 'access-rules', label: 'Access rules' },
    { id: 'backup-recovery', label: 'Backup and recovery' },
  ],
  lessons,
  projects,
  icon: 'database',
  updated: '2026-11-14',
};
