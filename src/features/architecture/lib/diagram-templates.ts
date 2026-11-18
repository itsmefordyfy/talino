/**
 * Starting diagrams for the workbench, all about TindaTrack: an inventory and sales app for small stores. Each is written in the Mermaid subset the course's
 * diagram engine reads (every one is checked by `diagram-templates.test.ts`), small enough to read at a glance and meant to be edited, not copied.
 */
export type DiagramTemplateId = 'c4-context' | 'c4-container' | 'c4-component' | 'sequence' | 'data-flow' | 'er' | 'class';

export type DiagramTemplate = { id: DiagramTemplateId; label: string; source: string };

export const DIAGRAM_TEMPLATES: readonly DiagramTemplate[] = [
  {
    id: 'c4-context',
    label: 'C4 context',
    source: `C4Context
  title TindaTrack in its surroundings
  Person(owner, "Store owner", "Tracks stock and sales")
  Person(helper, "Store helper", "Records sales at the counter")
  System(tinda, "TindaTrack", "Inventory and sales for small stores")
  System_Ext(wallet, "E-wallet provider", "Takes payments from customers")
  System_Ext(sms, "SMS service", "Sends low-stock alerts")
  Rel(owner, tinda, "Checks stock and reports")
  Rel(helper, tinda, "Records sales")
  Rel(tinda, wallet, "Starts payments")
  Rel(tinda, sms, "Sends alerts")
`,
  },
  {
    id: 'c4-container',
    label: 'C4 container',
    source: `C4Container
  title TindaTrack containers
  Person(owner, "Store owner", "Tracks stock and sales")
  System_Boundary(app, "TindaTrack") {
    Container(web, "Web app", "React", "The owner's screens")
    Container(api, "API", "Node.js", "Business rules")
    ContainerDb(db, "Database", "PostgreSQL", "Stores, products, sales")
  }
  System_Ext(wallet, "E-wallet provider", "Takes online payments")
  Rel(owner, web, "Uses")
  Rel(web, api, "Calls", "HTTPS/JSON")
  Rel(api, db, "Reads and writes", "SQL")
  Rel(api, wallet, "Starts payments", "HTTPS")
`,
  },
  {
    id: 'c4-component',
    label: 'C4 component',
    source: `C4Component
  title Inside the TindaTrack API
  Container(web, "Web app", "React", "The owner's screens")
  Container_Boundary(api, "API") {
    Component(sales, "Sales controller", "Node.js module", "Takes a sale from the counter")
    Component(stock, "Stock service", "Node.js module", "Keeps counts correct")
    Component(alerts, "Alert rules", "Node.js module", "Decides when stock is low")
  }
  ContainerDb(db, "Database", "PostgreSQL", "Stores, products, sales")
  Rel(web, sales, "Sends sales", "HTTPS/JSON")
  Rel(sales, stock, "Reduces stock")
  Rel(stock, alerts, "Asks if stock is low")
  Rel(stock, db, "Reads and writes", "SQL")
`,
  },
  {
    id: 'sequence',
    label: 'Sequence: checkout',
    source: `sequenceDiagram
  actor Helper as Store helper
  participant App as TindaTrack app
  participant API as TindaTrack API
  participant Wallet as E-wallet provider
  Helper->>App: Scans items and taps Pay
  App->>API: Create sale
  API->>Wallet: Request payment
  Wallet-->>API: Payment confirmed
  API-->>App: Sale saved, stock reduced
  App-->>Helper: Show receipt
`,
  },
  {
    id: 'data-flow',
    label: 'Data flow + trust boundary',
    // A flowchart has no boundary box in this subset: the gateway is named as the boundary and every dashed arrow is a trust crossing.
    source: `flowchart LR
  customer((Customer)) -.->|crosses the internet| gateway[API gateway: the trust boundary]
  owner((Store owner)) -.->|crosses the internet| gateway
  gateway -->|checks sign-in| api[TindaTrack API]
  api -->|reads and writes| db[(Sales database)]
  api -.->|crosses to a third party| wallet[E-wallet provider]
  api -->|writes audit log| logs[(Audit log)]
`,
  },
  {
    id: 'er',
    label: 'Data model (ER)',
    source: `erDiagram
  Store {
    uuid id PK
    string name
  }
  Product {
    uuid id PK
    uuid store_id FK
    string name
    int stock_count
  }
  Sale {
    uuid id PK
    uuid store_id FK
    datetime sold_at
  }
  SaleItem {
    uuid sale_id FK
    uuid product_id FK
    int quantity
  }
  Store ||--o{ Product : stocks
  Store ||--o{ Sale : records
  Sale ||--|{ SaleItem : contains
  Product ||--o{ SaleItem : appears_in
`,
  },
  {
    id: 'class',
    label: 'Classes: stock rules',
    source: `classDiagram
  class StockService {
    +recordSale(sale)
    +adjustStock(productId, change)
  }
  class Product {
    +id
    +name
    +stockCount
  }
  class AlertRule {
    <<interface>>
    +isLow(product)
  }
  class FixedThreshold {
    +limit
    +isLow(product)
  }
  StockService o-- Product
  StockService ..> AlertRule : asks
  FixedThreshold ..|> AlertRule
`,
  },
];

export const DEFAULT_TEMPLATE_ID: DiagramTemplateId = 'c4-context';
export const findTemplate = (id: string): DiagramTemplate | undefined => DIAGRAM_TEMPLATES.find((template) => template.id === id);
export const defaultTemplate = (): DiagramTemplate => findTemplate(DEFAULT_TEMPLATE_ID) as DiagramTemplate;
