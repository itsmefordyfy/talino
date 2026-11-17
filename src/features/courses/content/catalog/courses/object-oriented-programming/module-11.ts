import type { Lesson, Project } from '../../../types';

/**
 * Module 11, Writing Maintainable Object-Oriented Software (lessons 57 to 63, project p10). Coupling, cohesion, god objects, deep inheritance and
 * file layout, error handling, unit testing, then refactoring with a guided project. Every JavaScript example was run with Node 22 and the
 * outputs in comments are the real ones; every activity is also run by the activity validator (the in-app runner). Money is whole pesos.
 */

const DOCS = {
  errorCause: { label: 'MDN: Error cause', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause' },
  modules: { label: 'MDN: JavaScript modules', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules' },
  jest: { label: 'Jest: Getting started', url: 'https://jestjs.io/docs/getting-started' },
  jestExpect: { label: 'Jest: Expect', url: 'https://jestjs.io/docs/expect' },
};
void DOCS;

export const lessons: Lesson[] = [
  {
    id: 'object-oriented-programming-57',
    day: 57,
    title: 'Understanding Coupling',
    summary: 'Measure how much one class must know about another, and loosen the ties that make every change ripple.',
    intro: {
      objectives: [
        'Explain coupling and why tight coupling makes a small change break distant code',
        'Spot reaching inside another object and hardwired creation of a collaborator',
        'Loosen a tie with a small contract, an injected collaborator or an event name',
      ],
      why: 'AI assistants happily generate classes that reach into each other. If you can see the ties, you can tell which generated code will be painful to change and ask for the version that is not.',
    },
    minutes: 18,
    skills: ['maintainable-code', 'composition'],
    body: [
      {
        type: 'paragraph',
        text: "Parts of a program have to need each other. The trouble starts when one part needs to know too much about another: how it stores its data, what it is called inside. Rename one field and a class in a different file breaks, with no error. **Coupling** is how much one class depends on the details of another. Software that stays easy to change has few, small, deliberate ties.",
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: 'A lamp wired straight into the wall means cutting the wall to change the bulb. A lamp with a plug needs only the shape of a socket and works in any room. The goal is never zero coupling, since a lamp connected to nothing is useless. It is to make every tie as small and visible as a plug and socket.',
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: 'Ask of any two classes: **if the second one changes, what could break in the first?** It depends on what the first one knows.',
      },
      {
        type: 'table',
        headers: ['What class A knows about class B', 'Example', 'What breaks if B changes'],
        rows: [
          ['B\'s internal fields (reaching inside)', 'customer.wallet.balance -= total', 'Renaming or restructuring a field'],
          ['The whole shape of an object B handed over', 'print(order) reads order.items, order.customer.city...', 'Any change to that object\'s shape'],
          ['One method name and what it promises', 'customer.pay(total)', 'Only that method\'s name or promise'],
          ['Only plain values', 'printReceipt(total, phone)', 'Nothing about B at all'],
          ['An event name and its data', "announcer.emit('paid', { total })", 'The event\'s name or data'],
        ],
        caption: 'Tight at the top, loose at the bottom.',
      },
      {
        type: 'paragraph',
        text: 'The top row is the dangerous one. When A reaches into B\'s fields, B can no longer protect its own rules (module 4, encapsulation). The cure is **tell, do not ask**: instead of reading a field and deciding, tell the object what you want (`wallet.charge(60)`) and let it decide.',
      },
      {
        type: 'paragraph',
        text: 'A hidden tie is **creating** the collaborator yourself. `new SmsSender()` inside a constructor welds the class to that sender: you cannot test it without sending a text, or switch to email without editing it. The cure from module 8 is injection: have the collaborator handed in, and depend only on the small contract it must keep.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'After: Checkout knows one method of Customer and one small contract (a convention in JavaScript, an interface in TypeScript).',
        source: `classDiagram
class Checkout {
  +complete(customer, total)
}
class Customer {
  +pay(amount)
}
class Notifier {
  <<interface>>
  +send(text)
}
class SmsSender {
  +send(text)
}
class ScreenNotifier {
  +send(text)
}
Checkout --> Customer
Checkout --> Notifier
Notifier <|.. SmsSender
Notifier <|.. ScreenNotifier`,
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: 'In plain words: coupling is how much one class has to know about another to do its job. It is like a recipe that says "take the third jar on the left shelf" instead of "take the sugar": move the jars and the recipe fails. A **contract** is the agreement about names: "anything that has a `send` method will do".',
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'Step 1: a tightly coupled checkout reads and changes the wallet\'s field directly. If a teammate renames that field and never opens `Checkout`, nothing fails loudly.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Reaching inside another object',
        code: `class Wallet {
  constructor(balance) { this.balance = balance; }
}
class Customer {
  constructor(name, wallet) { this.name = name; this.wallet = wallet; }
}
class Checkout {
  pay(customer, total) {
    if (customer.wallet.balance < total) return 'declined';
    customer.wallet.balance -= total;
    return \`paid, \${customer.wallet.balance} left\`;
  }
}
const checkout = new Checkout();
const ana = new Customer('Ana', new Wallet(100));
console.log(checkout.pay(ana, 60)); // paid, 40 left
console.log(checkout.pay(ana, 60)); // declined
// Rename Wallet's field to pesos and leave the rest alone:
// both calls print "paid, NaN left"`,
      },
      {
        type: 'paragraph',
        text: 'Step 2: the loosened version. `Wallet` keeps its balance private and offers `charge`, `Customer` offers `pay`, and `Checkout` knows one method name.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Tell, do not ask',
        code: `class Wallet {
  #pesos;
  constructor(pesos) { this.#pesos = pesos; }
  get pesos() { return this.#pesos; }
  charge(amount) {
    if (amount > this.#pesos) return false;
    this.#pesos -= amount;
    return true;
  }
}
class Customer {
  constructor(name, wallet) { this.name = name; this.wallet = wallet; }
  pay(amount) { return this.wallet.charge(amount); }
}
class Checkout {
  pay(customer, total) {
    return customer.pay(total) ? 'paid' : 'declined';
  }
}
const checkout = new Checkout();
const ana = new Customer('Ana', new Wallet(100));
console.log(checkout.pay(ana, 60)); // paid
console.log(checkout.pay(ana, 60)); // declined
console.log(ana.wallet.pesos); // 40`,
      },
      {
        type: 'paragraph',
        text: 'Step 3: a hardwired collaborator, then the same class with the collaborator handed in. The stub is a plain object that keeps the contract.',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'Creating inside vs being handed one',
        code: `class SmsSender {
  send(text) { console.log(\`SMS: \${text}\`); }
}
class TightCheckout {
  constructor() { this.sender = new SmsSender(); }
  complete(total) { this.sender.send(\`Paid \${total} pesos\`); }
}
new TightCheckout().complete(60); // SMS: Paid 60 pesos

class Checkout {
  constructor(notifier) { this.notifier = notifier; }
  complete(total) { this.notifier.send(\`Paid \${total} pesos\`); }
}
const stub = { send: (text) => console.log(\`STUB: \${text}\`) };
new Checkout(new SmsSender()).complete(60); // SMS: Paid 60 pesos
new Checkout(stub).complete(60); // STUB: Paid 60 pesos`,
      },
      {
        type: 'paragraph',
        text: 'The loosest tie is the **event by name**. Checkout announces that something happened and does not know who listens. (`a ?? b` means "use `a`, or `b` when `a` is undefined".)',
      },
      {
        type: 'code',
        language: 'javascript',
        label: 'A tiny announcer',
        code: `class Announcer {
  #listeners = new Map();
  on(name, listener) {
    const list = this.#listeners.get(name) ?? [];
    list.push(listener);
    this.#listeners.set(name, list);
  }
  emit(name, data) {
    for (const listener of this.#listeners.get(name) ?? []) listener(data);
  }
}
class Checkout {
  constructor(announcer) { this.announcer = announcer; }
  complete(total) { this.announcer.emit('paid', { total }); }
}
const announcer = new Announcer();
announcer.on('paid', (order) => console.log(\`Receipt for \${order.total}\`));
announcer.on('paid', (order) => console.log(\`Texting about \${order.total}\`));
new Checkout(announcer).complete(60);
// Receipt for 60
// Texting about 60`,
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          '**Step 1.** After the rename, `customer.wallet.balance` is `undefined`. `undefined < 60` is `false`, so the check passes, and the subtraction gives `NaN`. No error, in a class nobody edited.',
          '**Step 2.** Checkout is told only `customer.pay(total)`. The wallet\'s `charge` guards the rule, and the private `#pesos` cannot be reached from outside.',
          '**Step 3.** `TightCheckout` runs `new SmsSender()` itself. `Checkout` receives its notifier, so the real sender and the stub both work.',
          '**Last example.** `emit(\'paid\', ...)` never mentions the receipt or the text. A third listener can be added without opening `Checkout`.',
        ],
      },
      {
        type: 'warning',
        text: 'Loosening has a cost: every contract, injected argument and event adds indirection, and an event is the hardest tie to follow. Loosen ties that cross a boundary or change often, and leave small, stable ones alone.',
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: 'In a large codebase the expensive ties are across module and team boundaries: a shared table, a JSON shape three services parse, a global singleton, a base class everyone extends. Keep each module\'s public surface small, depend on stable contracts rather than volatile classes, and treat tests that need heavy setup as a sign of high coupling. Events trade a visible dependency for a hidden one, so keep their names in one place and document their data.',
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Find the ties',
        text: "Here is a small JavaScript class. List every place where it depends on the internal details of another class (field names, hardwired `new` calls, assumptions about an object's shape). For each one, tell me the smallest change that loosens the tie. Do not rewrite the whole program, and do not add new classes unless they remove a dependency.\n\nclass Checkout {\n  pay(customer, total) {\n    if (customer.wallet.balance < total) return 'declined';\n    customer.wallet.balance -= total;\n    new SmsSender().send('Paid ' + total);\n    return 'paid';\n  }\n}",
      },
      {
        type: 'paragraph',
        text: 'Look for three ties: the reach into `wallet.balance`, the `new SmsSender()` and the assumption that a customer has a wallet. An AI may over-fix, adding a factory and three interfaces to remove one call. Ask whether each new piece removes a tie or only adds a layer, and run the code before you trust it.',
      },
      {
        type: 'takeaways',
        items: [
          'Coupling is how much one class must know about another; tight coupling lets a change in one place break another.',
          'Reaching into another object\'s fields is the tightest tie and breaks encapsulation. Tell the object what you want.',
          'Creating a collaborator with new welds you to it. Take it as an argument and depend on a small contract.',
          'An event by name is the loosest tie but the hardest to follow, so loosen where change is likely.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-57-fix-bug-1',
          kind: 'fix-bug',
          title: 'Asked, but never told',
          prompt: 'Checkout says paid twice, yet the wallet still holds 100 pesos and the second payment of 80 should have been declined. Tap the line where Checkout looks inside the wallet and decides alone, then choose the line that tells the wallet to charge.',
          language: 'javascript',
          code: `class Wallet {
  #pesos = 100;
  get pesos() { return this.#pesos; }
  charge(amount) {
    if (amount > this.#pesos) return false;
    this.#pesos -= amount;
    return true;
  }
}
class Checkout {
  pay(wallet, total) {
    const accepted = wallet.pesos >= total;
    return accepted ? 'paid' : 'declined';
  }
}
const wallet = new Wallet();
console.log(new Checkout().pay(wallet, 30));
console.log(new Checkout().pay(wallet, 80));
console.log(wallet.pesos);`,
          bugLine: 12,
          fixes: [
            { line: 'const accepted = wallet.charge(total);', correct: true, why: 'The wallet applies its own rule and changes its own private balance, and its answer decides the result. Checkout only tells it what to do.' },
            { line: 'const accepted = wallet.pesos > total;', correct: false, why: 'This is still asking: Checkout reads the balance and decides alone, and nothing is ever taken out of the wallet.' },
            { line: 'const accepted = wallet.charge(total) === false;', correct: false, why: 'This does tell the wallet, but it flips the answer, so a successful charge reads as declined.' },
            { line: 'const accepted = wallet.charge;', correct: false, why: 'This reads the method itself without calling it. A function is always truthy, so every payment is accepted and nothing is charged.' },
          ],
          lineNote: 'Which line pulls the balance out of the wallet to make a decision that belongs to the wallet?',
          tests: { kind: 'output', expected: ['paid', 'declined', '70'] },
          hints: [
            'Trace the program: after the first payment of 30, what should the wallet hold, and what does it hold?',
            'Checkout reads the balance but never changes it. Which wallet method both applies the rule and takes the money?',
            'Call charge and let its true or false answer decide the result.',
          ],
          explanation: 'Reading `wallet.pesos` and deciding in Checkout is the "ask" style: it copies the wallet\'s rule into the wrong class and forgets to apply it. Telling the wallet to `charge` keeps the rule, and the change to the balance, in one place.',
          concept: 'tell, do not ask',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-57-match-1',
          kind: 'match',
          title: 'Name the tie',
          prompt: 'Each situation describes how one class depends on another. Match it to the kind of tie it shows.',
          labels: { terms: 'Situation', meanings: 'The tie' },
          pairs: [
            { term: 'A delivery-fee function reads order.customer.address.city three levels deep', definition: 'Reaching inside the structure of other objects', note: 'The function must know how orders, customers and addresses are nested.' },
            { term: 'A Checkout constructor runs new SmsSender() on its first line', definition: 'Hardwired creation of a collaborator', note: 'Look at who decides which sender is used.' },
            { term: 'A Checkout is given a notifier and calls notifier.send(text), nothing else', definition: 'A tie to one small contract', note: 'Only one method name is assumed.' },
            { term: "Checkout emits 'paid'; the receipt printer and the texter each react on their own", definition: 'A tie to an event name and its data only', note: 'Checkout does not know who is listening.' },
          ],
          hints: [
            'Ask what the first class would have to be edited for if the second one changed.',
            'Who decides which collaborator is used: the class itself, or whoever builds it?',
            'The event tie is the only one where the caller does not know who receives the call.',
          ],
          explanation: 'Each situation differs in what the first class knows: another object\'s nesting, the choice of a concrete class, one method name, or just an event. The less it knows, the less can break.',
          concept: 'kinds of coupling',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-57-scenario-1',
          kind: 'scenario',
          title: 'Texts and tests',
          prompt: 'Decide what to change first.',
          situation: 'ReportPrinter creates `new EmailSender()` inside its constructor. Your team now wants to send some reports by SMS, and nobody can run the tests without real emails going out. You can change ReportPrinter only once this week.',
          options: [
            { text: 'Let the constructor take a sender with a send(text) method and use whatever it is given.', consequence: 'Email, SMS and a silent test stub all work, and ReportPrinter never changes again for a new channel.', quality: 'best' },
            { text: 'Add a type argument and an if/else inside ReportPrinter to choose between EmailSender and SmsSender.', consequence: 'SMS works, but ReportPrinter still names both concrete classes and every new channel means editing it. Tests still send real messages.', quality: 'acceptable' },
            { text: 'Copy ReportPrinter into SmsReportPrinter and change the sender in the copy.', consequence: 'It works today. Now every future fix to report logic must be made twice, and the two copies drift apart.', quality: 'poor' },
            { text: 'Make one shared global sender that every class reads and anyone can swap.', consequence: 'Swapping is easy, but now any class can change what every other class sends, and the tie is invisible in each constructor.', quality: 'poor' },
          ],
          hints: [
            'What does the class need from a sender: its type, or one method?',
            'Which option lets tests and new channels change nothing in ReportPrinter?',
            'Hand the sender in.',
          ],
          explanation: 'Taking the collaborator as an argument and depending only on `send` removes the tie to any concrete class. The if/else keeps the tie, and copying or a global creates new problems.',
          concept: 'loosening coupling',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-57-code-challenge-1',
          kind: 'code-challenge',
          title: 'Print anywhere',
          prompt: 'ReceiptPrinter writes straight to the console, so nobody can capture what it prints. Change the class so it is handed an `output` object when it is built and writes through `output.write(text)`. The program at the bottom should then collect the lines instead of printing them.',
          language: 'javascript',
          starter: `class ReceiptPrinter {
  print(total) {
    console.log(\`Total: \${total}\`);
  }
}

const lines = [];
const output = { write: (text) => lines.push(text) };
const printer = new ReceiptPrinter(output);
printer.print(60);
printer.print(25);
console.log(lines);`,
          tests: { kind: 'output', expected: ["[ 'Total: 60', 'Total: 25' ]"] },
          solution: `class ReceiptPrinter {
  constructor(output) {
    this.output = output;
  }
  print(total) {
    this.output.write(\`Total: \${total}\`);
  }
}

const lines = [];
const output = { write: (text) => lines.push(text) };
const printer = new ReceiptPrinter(output);
printer.print(60);
printer.print(25);
console.log(lines);`,
          hints: [
            'The class needs somewhere to keep the thing it is handed. What method receives it?',
            'Store the argument on this, then call a method on it instead of console.log.',
            'constructor(output) { this.output = output; } and this.output.write(...) inside print.',
          ],
          explanation: 'The printer now depends only on `write`. In the program it receives an object that collects lines; in an app it could receive one that writes to the screen or a file, with no change to the class.',
          concept: 'injection',
        },
      },
    ],
    quiz: [
      {
        id: 'object-oriented-programming-57-q1',
        prompt: 'A teammate renames a field inside Wallet. Checkout, which nobody edited, now prints NaN. What is the best description of the problem?',
        choices: ['Checkout is tightly coupled to a detail of Wallet', 'JavaScript does not check types, so nothing can be done', 'Wallet should never have been a class', 'The teammate should have used more comments'],
        answer: 0,
        explanation: 'Checkout depended on the exact name of one of Wallet\'s fields. A tie to an internal detail is what makes a change in one class break another.',
      },
      {
        id: 'object-oriented-programming-57-q2',
        prompt: 'Which change removes the tie between Checkout and one particular sender?',
        choices: ['Rename SmsSender to Sender and update every place in the program that mentions the old name', 'Move the new SmsSender() call from the first line of the constructor to the second, after the other setup', 'Take the sender as a constructor argument and call only its send method', 'Turn SmsSender into a global variable that every class reads whenever it needs to send a message'],
        answer: 2,
        explanation: 'Renaming or moving the call keeps Checkout choosing the concrete class. Handing the sender in, and relying only on `send`, lets any object with that method work.',
      },
      {
        id: 'object-oriented-programming-57-q3',
        prompt: '"Tell, do not ask" is advice about which kind of code?',
        choices: ['Code that reads fields to decide, instead of asking the object to act', 'Comments written above a function that describe in detail what it returns and when', 'Error messages shown to people, which should say what to do next and avoid jargon', 'Names of tests, which should say which behaviour is being checked and in which case'],
        answer: 0,
        explanation: 'Asking means pulling data out and deciding elsewhere. Telling means calling a method and letting the object, which knows its own rules, decide.',
      },
      {
        id: 'object-oriented-programming-57-q4',
        prompt: 'A class announces "paid" and has no idea which other classes react. What is the main cost of this very loose tie?',
        choices: ['It runs much slower than a direct call, because every event is copied through a waiting queue', 'It cannot be used in JavaScript, because the language has no way to keep a list of functions', 'The sender cannot show who reacts, so the flow is harder to follow', 'It makes the announcing class\'s data public so that every listener can read and change it'],
        answer: 2,
        explanation: 'Events remove the compile-time and reading-time link between sender and receivers. The price is that nothing in the sender shows what happens next.',
      },
      {
        id: 'object-oriented-programming-57-q5',
        audience: { max: 'beginner' },
        prompt: 'A recipe says "take the third jar on the left shelf". Someone rearranges the shelf and the recipe fails. What does this picture show?',
        choices: ['Recipes should be shorter, so that fewer things in the kitchen can be rearranged by anyone', 'Relying on how something is arranged, not on its name, breaks when it changes', 'Shelves should never be rearranged, because a recipe cannot be told about the new places', 'Names are not useful in a kitchen, so every ingredient is best found by counting jars'],
        answer: 1,
        explanation: 'The recipe is tied to the shelf\'s arrangement. Asking for "the sugar" by name keeps it working however the shelf changes, which is what a clear method name does for a class.',
      },
      {
        id: 'object-oriented-programming-57-q6',
        audience: { min: 'advanced' },
        prompt: 'Three services each parse the same JSON payload from a fourth and read its field names directly. Which statement describes the situation best?',
        choices: ['It is loose coupling, because the three services share no classes with the fourth one', 'Tight coupling across a team boundary: the shape should be a versioned, documented contract', 'It is fine, because JSON is a standard format that every language reads the same way', 'It proves that splitting a system into services is always worse than writing one program'],
        answer: 1,
        explanation: 'Sharing no code does not mean sharing no assumptions. The field names are a hidden contract. Making it explicit and versioned turns a silent break into a managed change.',
      },
    ],
    task: {
      title: 'Find and loosen one tie',
      steps: [
        'Open the Step 1 code in any free JavaScript environment (or a notes file) and run it. Note the two lines of output.',
        'Rename the field in Wallet, run Checkout again without editing it, and write down what changes and why no error appears.',
        'Rewrite Wallet and Checkout as in Step 2 so a rename inside Wallet cannot break Checkout. Prove it by renaming the private field and running again.',
        'Write two sentences: what did Checkout stop knowing about Wallet, and what did you gain?',
      ],
      minutes: 15,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Before changing anything, read the Step 1 code aloud line by line and say what each line of Checkout.pay asks the wallet for. Circle every place Checkout names something inside Wallet.'] },
      { audience: { min: 'advanced' }, steps: ['Add the announcer from the last example and make the receipt printer and a stock updater listen to \'paid\'. Then write down what a new teammate must read to learn everything that happens when an order is paid, and how you would make that easier to find.'] },
    ],
  },
  {
    id: 'object-oriented-programming-58',
    day: 58,
    title: 'Understanding Cohesion and Separation of Concerns',
    summary: 'Keep everything inside a class pulling the same way, and keep the model, the rules, the storage and the screen apart.',
    intro: {
      objectives: [
        'Judge how cohesive a class is with two quick tests',
        'Split a mixed-up class by the question each part answers: model, logic, storage or presentation',
        'Explain why high cohesion and low coupling are goals that work together',
      ],
      why: 'AI assistants often produce one convenient class that formats, saves and calculates everything. Knowing what a focused class looks like lets you ask for a better split.',
    },
    minutes: 18,
    skills: ['maintainable-code', 'abstraction'],
    body: [
      {
        type: 'paragraph',
        text: "Lesson 57 was about the ties between classes. This lesson looks inside one class: do its parts belong together? A class can have a neat name and still be a junk drawer. **Cohesion** is how strongly the parts of one class belong together. **Separation of concerns** is keeping the different jobs of a program (what the data is, the rules, where it is kept, how it looks) in different places.",
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: "A barangay hall has separate windows for certificates, payments and the health desk, and papers pass between them as forms. If one window issued certificates, sold ice and repaired phones, a change to the ice price would disturb the certificate line. For a tiny office one clerk is fine. Split when the jobs change for different reasons, not as a rule.",
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: "Two quick tests for cohesion. The **sentence test**: describe the class in one plain sentence. If it needs \"and\" or \"also\", or the only honest name is `Helper`, `Utils` or `Manager`, it is probably a grab-bag. The **shared-data test**: see which fields each method uses. In a cohesive class most methods work on the same data. In a grab-bag they use different data, or none.",
      },
      {
        type: 'paragraph',
        text: "A **concern** is one question your program has to answer. Most small programs ask the same four.",
      },
      {
        type: 'table',
        headers: ['Concern', 'The question it answers', 'Example in this lesson', 'What it should not know'],
        rows: [
          ['Model', 'What is the thing, and what rules keep it valid?', 'Order', 'How it is printed or stored'],
          ['Logic', 'In what steps does the program do its job?', 'Checkout', 'The look of a receipt, the details of storage'],
          ['Storage', 'Where does it live between uses?', 'OrderStore', 'Business rules, wording'],
          ['Presentation', 'How is it shown to a person?', 'ReceiptPrinter', 'How orders are stored or checked'],
        ],
        caption: 'Four concerns, each with one home.',
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The arrows show who knows about whom. The model depends on nothing.',
        source: `flowchart TD
  P[Presentation: ReceiptPrinter] --> M[Model: Order]
  L[Logic: Checkout] --> M
  L --> P
  L --> S[Storage: OrderStore]
  S --> M`,
      },
      {
        type: 'paragraph',
        text: "The model is the most stable part: an order is still lines with a total next year, even if receipts change and storage moves to a file. So the arrows point toward it. If the model knew about the printer, a wording change would reach into the model, and an amount could turn into text such as \"P120\".",
      },
      {
        type: 'paragraph',
        text: "High cohesion and low coupling are two views of one goal. Splitting a grab-bag creates ties, but few and small ones, as lesson 57 showed, and the mess inside one class cost more. The opposite mistake exists too: one tiny class per function. Split where the questions differ, and stop there. Module 10 names the principle Single Responsibility.",
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: a class is cohesive when everything inside it is about one thing, like a pencil case that holds only pencils. A junk drawer holds batteries, a spoon and a spare key, and you search it every time. Ask \"what question does this part answer?\". If the answer is \"it holds the data and its rules\", \"it shows things\" or \"it saves things\", each part gets its own class.",
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'Step 1: the grab-bag. Every method is correct on its own. The trouble is the shape.',
      },
      { type: 'code', language: 'javascript', label: 'A class with low cohesion', code: `class StoreHelper {
  saved = new Map();
  total(lines) {
    let sum = 0;
    for (const line of lines) sum += line.price * line.qty;
    return sum;
  }
  receipt(id, lines) {
    return \`Order \${id}: \${this.total(lines)} pesos\`;
  }
  save(id, lines) {
    this.saved.set(id, lines);
  }
  smsText(phone, id) {
    return \`To \${phone}: order \${id} is ready\`;
  }
}
const helper = new StoreHelper();
const lines = [{ name: 'Rice', price: 60, qty: 2 }];
helper.save(1, lines);
console.log(helper.receipt(1, lines));
console.log(helper.smsText('0917 000 0000', 1));
// Order 1: 120 pesos
// To 0917 000 0000: order 1 is ready` },
      {
        type: 'paragraph',
        text: "Step 2: each job has a home. `Order` is the model: it keeps its lines private, refuses a quantity below 1, and works out its own total as a plain number. `OrderStore` only remembers orders. `ReceiptPrinter` only turns an order into text. `Checkout` is the logic: it knows the steps and is handed its two collaborators.",
      },
      { type: 'code', language: 'javascript', label: 'Model, storage, presentation and logic', code: `class Order {
  #lines = [];
  constructor(id) {
    this.id = id;
  }
  add(name, price, qty) {
    if (qty < 1) throw new Error('quantity must be at least 1');
    this.#lines.push({ name, price, qty });
  }
  get lines() {
    return this.#lines.map((line) => ({ ...line }));
  }
  get total() {
    let sum = 0;
    for (const line of this.#lines) sum += line.price * line.qty;
    return sum;
  }
}
class OrderStore {
  #orders = new Map();
  save(order) {
    this.#orders.set(order.id, order);
  }
  find(id) {
    return this.#orders.get(id);
  }
}
class ReceiptPrinter {
  format(order) {
    const rows = [];
    for (const line of order.lines) {
      const cost = line.price * line.qty;
      rows.push(\`\${line.qty} x \${line.name}: \${cost}\`);
    }
    const total = \`Total: \${order.total} pesos\`;
    return [\`Order \${order.id}\`, ...rows, total].join('\\n');
  }
}
class Checkout {
  constructor(store, printer) {
    this.store = store;
    this.printer = printer;
  }
  complete(order) {
    this.store.save(order);
    return this.printer.format(order);
  }
}
const store = new OrderStore();
const checkout = new Checkout(store, new ReceiptPrinter());
const order = new Order(1);
order.add('Rice', 60, 2);
order.add('Egg', 9, 6);
console.log(checkout.complete(order));
// Order 1
// 2 x Rice: 120
// 6 x Egg: 54
// Total: 174 pesos` },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          "**Step 1.** `StoreHelper` has one field, and only `save` touches it. `total`, `receipt` and `smsText` use none of the object's data, so the class is only a bag.",
          "**Step 2.** `Order`'s methods all work on `#lines`. `OrderStore` has one private map that both its methods use. `ReceiptPrinter` has no fields, and that is fine: its single method does one job.",
          "**Step 2, logic.** `complete` is told only `store.save(order)` and `printer.format(order)`. Neither collaborator knows about the other.",
        ],
      },
      {
        type: 'warning',
        text: "Do not split a class just because it is long. A class that needs three others to do anything has been split too far. Judge by the questions the parts answer, and name a class by its answer (`OrderStore`, not `StoreHelper`).",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Cohesion is sometimes measured by counting pairs of methods that share fields (the LCOM family of metrics). Treat the numbers as hints: a class of pure functions scores badly and may be fine. In larger systems the separation is also a dependency rule: the domain model imports nothing from storage or the web, and storage implements an interface the domain owns. That keeps the model testable without a database. The cost is mapping between layers.",
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Review the split',
        text: "Here is a small JavaScript class. For each method, say which concern it belongs to (model, logic, storage, presentation) and which fields it uses. Then tell me whether the class has high or low cohesion and why. Suggest a split only if the methods answer different questions, and keep the number of new classes as small as possible. Do not add interfaces or abstract classes.\n\nclass StoreHelper {\n  saved = new Map();\n  total(lines) { let sum = 0; for (const l of lines) sum += l.price * l.qty; return sum; }\n  receipt(id, lines) { return 'Order ' + id + ': ' + this.total(lines) + ' pesos'; }\n  save(id, lines) { this.saved.set(id, lines); }\n  smsText(phone, id) { return 'To ' + phone + ': order ' + id + ' is ready'; }\n}",
      },
      {
        type: 'paragraph',
        text: "A good answer sorts the four methods into arithmetic, text output, storage and messaging, and notices that only `save` uses the field. An AI may split too far, one class per method, or invent a field the code does not have. Compare its summary with the code.",
      },
      {
        type: 'takeaways',
        items: [
          'Cohesion is how strongly the parts of one class belong together. Test it: one sentence without "and", and methods that share the same data.',
          'A concern is one question the program answers: the model, the logic, storage or presentation.',
          'Dependencies point toward the stable part, the model, so parts that change often never force changes in it.',
          'Aim for high cohesion and low coupling together, and stop splitting when the parts of one job end up far apart.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-58-fix-bug-1',
          kind: 'fix-bug',
          title: 'The total that became text',
          prompt: "The order's total is used to add a 10 percent service charge, but the program prints `P120NaN` instead of 132. Tap the line where the model took on a presentation job, then choose the fix that keeps the model's total a plain number.",
          language: 'javascript',
          code: `class Order {
  constructor() {
    this.lines = [];
  }
  add(price, qty) {
    this.lines.push({ price, qty });
  }
  get total() {
    let sum = 0;
    for (const line of this.lines) sum += line.price * line.qty;
    return \`P\${sum}\`;
  }
}
function withServiceCharge(order, percent) {
  return order.total + (order.total * percent) / 100;
}
const order = new Order();
order.add(60, 2);
console.log(withServiceCharge(order, 10));`,
          bugLine: 11,
          fixes: [
            { line: 'return sum;', correct: true, why: 'The model keeps its total as a number, so any calculation can use it. A printer can add the peso sign when it shows the number.' },
            { line: 'return String(sum);', correct: false, why: 'A string "120" added to the number 12 joins as text ("12012"). The total is still not usable for arithmetic.' },
            { line: 'return sum.toFixed(2);', correct: false, why: 'toFixed returns text too ("120.00"), so adding the service charge joins two pieces of text instead of adding numbers.' },
            { line: 'return `P${sum}`.length;', correct: false, why: 'This returns the number of characters in the text, which is 4, not the amount of money.' },
          ],
          lineNote: 'Which line gives the total a peso sign, which is a decision about how it looks?',
          tests: { kind: 'output', expected: ['132'] },
          hints: [
            'Read the output: the answer starts with a P. What did `withServiceCharge` receive from `order.total`?',
            'The `P` was added inside the model. Who should decide how an amount looks on screen?',
            'Return the plain number and leave the wording to whatever prints it.',
          ],
          explanation: 'Presentation leaked into the model. Once `total` became text, arithmetic on it broke far from the line that caused it. Keeping `total` a number and formatting it where it is shown keeps each concern in its own place.',
          concept: 'separation of concerns',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-58-match-1',
          kind: 'match',
          title: 'Which concern is it?',
          prompt: 'Each piece of code answers one question. Match it to the concern where it belongs.',
          labels: { terms: 'The code', meanings: 'Its home' },
          pairs: [
            { term: 'A check that an item price is never negative, kept next to the price', definition: 'Model: data and the rules that keep it valid', note: 'The rule protects the data, so it lives with the data.' },
            { term: 'Turning an order into the lines of text a customer reads', definition: 'Presentation: how it is shown to a person', note: 'This is wording and layout.' },
            { term: 'Remembering orders so they can be found by id later', definition: 'Storage: where it lives between uses', note: 'It is about keeping and finding, not about what an order means.' },
            { term: 'The steps of finishing an order: save it, then print its receipt', definition: 'Logic: the steps that coordinate the others', note: 'It joins the parts but does not do their work.' },
          ],
          hints: [
            'Ask what question the code answers: what is it, how does it look, where does it live, or what steps happen?',
            'The two that touch an order closely are a rule about its data and a sequence of steps. Which one decides how the data stays valid?',
            'Wording and layout are presentation; keeping and finding are storage.',
          ],
          explanation: 'Each piece answers a different question. Keeping the answers apart is what lets a change to one (a new receipt layout) leave the others alone.',
          concept: 'concerns',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-58-scenario-1',
          kind: 'scenario',
          title: 'A thank-you on the receipt',
          prompt: 'Decide where this change goes.',
          situation: 'The shop owner wants every receipt to start with the shop name and end with "Thank you!". Your program has Order (the model), OrderStore (storage), ReceiptPrinter (presentation) and Checkout (logic).',
          options: [
            { text: 'Change only ReceiptPrinter.format to add the two lines around the existing ones.', consequence: 'The change is two lines in one class. Order, OrderStore and Checkout are not opened, so nothing else can break.', quality: 'best' },
            { text: 'Add a `receiptText` getter to Order so the order builds its own receipt, and have the printer call it.', consequence: 'It works, but now the model carries wording. Next month\'s receipt redesign will edit the class that holds the rules.', quality: 'acceptable' },
            { text: 'Make OrderStore return orders with the shop name and thank-you already attached.', consequence: 'The storage class now knows about receipts, and every code path that only wants to read an order gets text it did not ask for.', quality: 'poor' },
            { text: 'Have Checkout print the extra lines with console.log before and after calling the printer.', consequence: 'The receipt is now split between two classes, and it prints even when someone only wanted the receipt text for an SMS.', quality: 'poor' },
          ],
          hints: [
            'What question does this change answer: what an order is, where it lives, or how it looks?',
            'Which class already decides how an order looks?',
            'The one with "Receipt" in its name.',
          ],
          explanation: 'Wording is presentation, and `ReceiptPrinter` is the one class whose job is wording. Putting the change there leaves the rest of the program alone.',
          concept: 'separation of concerns',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-58-code-challenge-1',
          kind: 'code-challenge',
          title: 'Move the receipt out',
          prompt: '`OrderDesk` keeps orders and also writes receipt text. Move the receipt job into a new class `ReceiptPrinter` with a `format(order)` method, and remove `receipt` from `OrderDesk`. The program at the bottom should print the receipt line and then `undefined`.',
          language: 'javascript',
          starter: `class OrderDesk {
  #orders = new Map();
  save(order) {
    this.#orders.set(order.id, order);
  }
  find(id) {
    return this.#orders.get(id);
  }
  receipt(id) {
    const order = this.#orders.get(id);
    return \`Order \${order.id}: \${order.total} pesos\`;
  }
}

const desk = new OrderDesk();
desk.save({ id: 1, total: 120 });
const printer = new ReceiptPrinter();
console.log(printer.format(desk.find(1)));
console.log(typeof desk.receipt);`,
          tests: { kind: 'output', expected: ['Order 1: 120 pesos', 'undefined'] },
          solution: `class ReceiptPrinter {
  format(order) {
    return \`Order \${order.id}: \${order.total} pesos\`;
  }
}

class OrderDesk {
  #orders = new Map();
  save(order) {
    this.#orders.set(order.id, order);
  }
  find(id) {
    return this.#orders.get(id);
  }
}

const desk = new OrderDesk();
desk.save({ id: 1, total: 120 });
const printer = new ReceiptPrinter();
console.log(printer.format(desk.find(1)));
console.log(typeof desk.receipt);`,
          hints: [
            'Run it as it is: what error do you get, and which name is missing?',
            'The new class needs a `format(order)` method that returns the same text `receipt` built. Where does the order come from now?',
            'Add `class ReceiptPrinter { format(order) { return ...; } }` and delete the whole `receipt` method from OrderDesk.',
          ],
          explanation: 'After the move, `OrderDesk` only stores and finds, and `ReceiptPrinter` only formats. `typeof desk.receipt` prints `undefined`, which proves the old method is gone rather than duplicated.',
          concept: 'extracting a concern',
        },
      },
    ],
    quiz: [
      {
        id: 'object-oriented-programming-58-q1',
        prompt: 'A class has four methods. Only one of them uses the class\'s single field, and the other three would work unchanged as plain functions. What does that suggest?',
        choices: ['The class needs more fields, so that each of its methods has some data to work on', 'The class has high cohesion, because each of its four methods is correct on its own', 'Low cohesion: the methods are unrelated, so it is a group of functions, not an object looking after data', 'The class breaks encapsulation, because its one field can be reached from outside the class'],
        answer: 2,
        explanation: 'The shared-data test: a cohesive class exists to look after its data, so most methods use it. Methods that use none of it have no reason to share a class.',
      },
      {
        id: 'object-oriented-programming-58-q2',
        prompt: 'Which sentence describes a cohesive class?',
        choices: ['"It keeps the orders and also formats receipts and sends texts"', '"It keeps orders and lets you save and find them by id"', '"It does whatever the checkout screen needs next"', '"It is a manager for everything about the store"'],
        answer: 1,
        explanation: 'The sentence test: a cohesive class can be described in one plain sentence with no "and" or "also". The vague names and lists of unrelated jobs signal a grab-bag.',
      },
      {
        id: 'object-oriented-programming-58-q3',
        prompt: 'An order\'s `total` getter returns the text "P120". Later code tries to multiply it by 10 and gets NaN. Which concern leaked into which?',
        choices: ['Presentation (how an amount looks) leaked into the model (the amount itself)', 'Storage (where orders are kept) leaked into presentation (how a receipt reads to a person)', 'The model (what an order is) leaked into storage (the place where it is kept)', 'Logic (the steps of checkout) leaked into presentation (the wording of a receipt)'],
        answer: 0,
        explanation: 'Adding the peso sign is a decision about how the amount looks. Doing it inside the model turned a number into text and broke every calculation that expected a number.',
      },
      {
        id: 'object-oriented-programming-58-q4',
        prompt: 'After splitting a grab-bag into four small classes, a teammate says "now there are more connections, so this is more coupled". What is the best reply?',
        choices: ['They are right, so the split should be undone and the four classes merged back into one', 'Coupling only counts between files, and all of these classes could stay in one file', 'There are more ties, but each is small, and the mess inside one class cost more', 'The classes should all extend one common parent class, which would remove every connection'],
        answer: 2,
        explanation: 'High cohesion and low coupling are goals to balance. A few small, visible ties between focused classes are cheaper than one class whose parts are tangled together.',
      },
      {
        id: 'object-oriented-programming-58-q5',
        audience: { max: 'beginner' },
        prompt: 'A drawer holds batteries, a spoon, a spare key and a bill. Which sentence best matches a class with low cohesion?',
        choices: ['Everything in it is about one job, so it is easy to say what it is for', 'It is hard to say what it is for, so you have to search it every time', 'It is private, so nobody outside the house is able to open it', 'It is small enough to carry, so it is easy to move from room to room'],
        answer: 1,
        explanation: 'A junk drawer is a group of unrelated things kept together by accident. A low-cohesion class is the same: its parts are about different jobs, and its name tells you nothing.',
      },
      {
        id: 'object-oriented-programming-58-q6',
        audience: { min: 'advanced' },
        prompt: 'A team\'s domain classes import the database library directly, so their unit tests need a running database. Which change fits separation of concerns best?',
        choices: ['Mock the database library in every single test so that the imports can stay as they are', 'Move the domain classes into the same file as the database code, so one file holds both', 'Have the domain define a storage contract that a storage class implements', 'Make the database library a global object, so that no import is needed anywhere in the domain'],
        answer: 2,
        explanation: 'The domain should depend on nothing about storage. A contract owned by the domain, implemented by a storage class, points the dependency toward the stable part and lets tests use an in-memory version.',
      },
    ],
    task: {
      title: 'Sort the methods into homes',
      steps: [
        'Run the Step 1 code in any free JavaScript environment. For each method of StoreHelper, write down which fields it uses and which concern it belongs to.',
        'Type in the Step 2 classes and run them. Confirm the receipt matches the one in the lesson.',
        'Add one new rule, for example a maximum of 20 lines in an order. Write down which single class you opened, and which you did not.',
        'In two sentences, say what you would lose if Order had a method that returned the receipt text.',
      ],
      minutes: 15,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Before typing code, draw four boxes on paper labelled Model, Logic, Storage and Presentation. Write each method name from StoreHelper in the box where it belongs, and notice which box stays empty.'] },
      { audience: { min: 'advanced' }, steps: ['Write a `Storage` contract as a comment (the methods Checkout needs: `save` and `find`), then write a second store, `LoggingStore`, that wraps `OrderStore` and logs each call. Prove that Checkout runs unchanged with either, and say which layer should own that contract.'] },
    ],
  },
  {
    id: 'object-oriented-programming-59',
    day: 59,
    title: 'Single-Purpose, Reusable Classes and Avoiding God Objects',
    summary: 'See how one class quietly grows into a god object, spot the symptoms, and split it into small classes you could reuse elsewhere.',
    intro: {
      objectives: [
        'Explain how a god object grows one reasonable request at a time',
        'Recognise a god object by its symptoms, not only by its size',
        'Split a god object by finding clusters of fields and methods, then name each new class',
      ],
      why: 'AI assistants add a method to the nearest class every time you ask for a feature, which is how god objects grow. If you can see the pattern and ask for the split, your code stays changeable.',
    },
    minutes: 20,
    skills: ['maintainable-code', 'solid'],
    body: [
      {
        type: 'paragraph',
        text: "Nobody sets out to build a class that does everything. It happens one reasonable request at a time: the shop class already has the stock, so the loyalty points go there too, then the sales total. A year later everybody is afraid of it. A **god object** is a class that knows too much and does too much, so the rest of the program leans on it.",
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: "A sari-sari store run by one person with the loyalty notebook, supplier list and sales book in one drawer works, until a second person needs the sales book while the first counts stock. A growing shop hands out the notebooks. Between classes each handover must be a clear method call, so keep those calls small.",
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: "A god object grows by the **nearest-place rule**: each request goes into the class that already has the data. Loyalty points go into the shop class, since `placeOrder` knows the total. The sales total goes in, since it sees every order. Each choice is sensible alone; together they put four jobs in one place.",
      },
      {
        type: 'paragraph',
        text: "Size is a poor test, since a long class that does one thing may be fine. Look for **symptoms** instead.",
      },
      {
        type: 'table',
        headers: ['Symptom', 'What it tells you'],
        rows: [
          ['The name is vague: Manager, Handler, System, Processor, Utils', 'Nobody could name one job, because there are several'],
          ['The fields fall into groups that never meet', 'Each group is a separate class waiting to be named'],
          ['Each method uses only some of the fields', 'The methods are not working on one shared thing (lesson 58)'],
          ['A test needs a long setup before it can check one rule', 'The class cannot be used without dragging in its other jobs'],
          ['Two people changing different features keep editing the same file', 'Unrelated reasons to change live together'],
        ],
        caption: 'Count the symptoms, not the lines.',
      },
      {
        type: 'paragraph',
        text: "To split a god object, follow the data. Mark which methods touch which fields, and group what travels together. Each group is a **cluster**, and becomes a class named for what it looks after. In `ShopManager`, the stock and price maps with `addStock` and `lowStock` are one cluster, the points map another, the sales list a third. `placeOrder` touches all of them, so it becomes a short coordinating class.",
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'After the split: Shop only sequences the steps, and the three new classes know nothing about each other.',
        source: `classDiagram
class Shop {
  +placeOrder(customer, item, qty)
}
class Inventory {
  +add(item, price, qty)
  +countOf(item)
  +priceOf(item)
  +take(item, qty)
  +lowStock(limit)
}
class LoyaltyBook {
  +pointsOf(customer)
  +earn(customer, pesos)
  +priceFor(customer, total)
}
class SalesLog {
  +record(sale)
  +total
}
Shop --> Inventory
Shop --> LoyaltyBook
Shop --> SalesLog`,
      },
      {
        type: 'paragraph',
        text: "A class is reusable if you could copy it into another program and use it as it is. `Inventory` could serve a pharmacy, because it knows nothing about loyalty points or the shop. A class that prints with `console.log`, reads a global, or names another feature stays stuck. Reuse is a side effect of one job and small ties, not a goal to chase.",
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: a god object is a one-person office. It started with one job, and every new job was added because it was already there. To fix it, find the groups of data and actions that belong together, like a pharmacy keeping medicines on one shelf and receipts in a drawer, and give each group its own class named for what it holds. The old class then only tells the others what to do, in order. The output is the same before and after, which is how you know nothing broke.",
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'Step 1: the god object. Four fields, four jobs, and `placeOrder` using all of them. Money is whole pesos, and `a ?? 0` means "use `a`, or 0 when `a` is undefined".',
      },
      { type: 'code', language: 'javascript', label: 'One class that does everything', code: `class ShopManager {
  stock = new Map();
  prices = new Map();
  points = new Map();
  sales = [];
  addStock(item, price, qty) {
    this.stock.set(item, (this.stock.get(item) ?? 0) + qty);
    this.prices.set(item, price);
  }
  placeOrder(customer, item, qty) {
    if ((this.stock.get(item) ?? 0) < qty) return 'out of stock';
    let total = this.prices.get(item) * qty;
    if ((this.points.get(customer) ?? 0) >= 50) total = (total * 90) / 100;
    this.stock.set(item, this.stock.get(item) - qty);
    const earned = Math.floor(total / 10);
    this.points.set(customer, (this.points.get(customer) ?? 0) + earned);
    this.sales.push({ customer, item, qty, total });
    return \`\${customer} pays \${total}\`;
  }
  lowStock(limit) {
    return [...this.stock]
      .filter(([, qty]) => qty <= limit)
      .map(([item]) => item);
  }
  salesTotal() {
    let sum = 0;
    for (const sale of this.sales) sum += sale.total;
    return sum;
  }
}
const shop = new ShopManager();
shop.addStock('Rice', 60, 10);
shop.addStock('Egg', 9, 30);
console.log(shop.placeOrder('Ana', 'Rice', 6));
console.log(shop.placeOrder('Ana', 'Rice', 2));
console.log(shop.placeOrder('Ana', 'Egg', 10));
console.log(shop.placeOrder('Ana', 'Egg', 10));
console.log(shop.placeOrder('Ben', 'Rice', 5));
console.log(shop.lowStock(5));
console.log(shop.salesTotal());
// Ana pays 360
// Ana pays 120
// Ana pays 90
// Ana pays 81
// out of stock
// [ 'Rice' ]
// 651` },
      {
        type: 'paragraph',
        text: "Step 2: three classes with private fields, and a `Shop` that is handed them (lesson 57) and only orders the steps. The same program gives the same seven lines. The pharmacy at the end is the reuse test.",
      },
      { type: 'code', language: 'javascript', label: 'Three single-purpose classes and a thin coordinator', code: `class Inventory {
  #stock = new Map();
  #prices = new Map();
  add(item, price, qty) {
    this.#stock.set(item, this.countOf(item) + qty);
    this.#prices.set(item, price);
  }
  countOf(item) {
    return this.#stock.get(item) ?? 0;
  }
  priceOf(item) {
    return this.#prices.get(item);
  }
  take(item, qty) {
    if (this.countOf(item) < qty) throw new Error(\`not enough \${item}\`);
    this.#stock.set(item, this.countOf(item) - qty);
  }
  lowStock(limit) {
    return [...this.#stock]
      .filter(([, qty]) => qty <= limit)
      .map(([item]) => item);
  }
}
class LoyaltyBook {
  #points = new Map();
  pointsOf(customer) {
    return this.#points.get(customer) ?? 0;
  }
  earn(customer, pesos) {
    const earned = Math.floor(pesos / 10);
    this.#points.set(customer, this.pointsOf(customer) + earned);
  }
  priceFor(customer, total) {
    return this.pointsOf(customer) >= 50 ? (total * 90) / 100 : total;
  }
}
class SalesLog {
  #sales = [];
  record(sale) {
    this.#sales.push({ ...sale });
  }
  get total() {
    let sum = 0;
    for (const sale of this.#sales) sum += sale.total;
    return sum;
  }
}
class Shop {
  constructor(inventory, loyalty, log) {
    this.inventory = inventory;
    this.loyalty = loyalty;
    this.log = log;
  }
  placeOrder(customer, item, qty) {
    if (this.inventory.countOf(item) < qty) return 'out of stock';
    const base = this.inventory.priceOf(item) * qty;
    const total = this.loyalty.priceFor(customer, base);
    this.inventory.take(item, qty);
    this.loyalty.earn(customer, total);
    this.log.record({ customer, item, qty, total });
    return \`\${customer} pays \${total}\`;
  }
}
const inventory = new Inventory();
const log = new SalesLog();
const shop = new Shop(inventory, new LoyaltyBook(), log);
inventory.add('Rice', 60, 10);
inventory.add('Egg', 9, 30);
console.log(shop.placeOrder('Ana', 'Rice', 6));
console.log(shop.placeOrder('Ana', 'Rice', 2));
console.log(shop.placeOrder('Ana', 'Egg', 10));
console.log(shop.placeOrder('Ana', 'Egg', 10));
console.log(shop.placeOrder('Ben', 'Rice', 5));
console.log(inventory.lowStock(5));
console.log(log.total);
// Ana pays 360
// Ana pays 120
// Ana pays 90
// Ana pays 81
// out of stock
// [ 'Rice' ]
// 651

const pharmacy = new Inventory();
pharmacy.add('Paracetamol', 3, 120);
pharmacy.add('Bandage', 15, 4);
console.log(pharmacy.lowStock(10));
console.log(pharmacy.priceOf('Bandage'));
// [ 'Bandage' ]
// 15` },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          "**Finding the clusters.** `addStock` and `lowStock` share `stock`, `salesTotal` uses only `sales`, and the points map is touched only by `placeOrder`, so it is its own cluster.",
          "**Inside `Shop.placeOrder`.** It checks the inventory, asks the loyalty book for the discounted price, then tells each part to do its piece: `take`, `earn`, `record`.",
          "**A subtle change.** `Inventory.take` throws instead of returning `'out of stock'`, since a stock class should not decide what the shop says. `Shop` checks `countOf` first, so the output is unchanged.",
        ],
      },
      {
        type: 'warning',
        text: "Do not swap a god object for twenty one-method classes. Keep together what always changes together. If the best name you can find still ends in `Manager`, the cluster probably holds two jobs.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "In an old codebase a god class has callers everywhere, so a rewrite is risky. Split a cluster at a time: pin down current behaviour with tests, extract one cluster, and keep the old methods as thin wrappers that delegate until every caller has moved. Files that change most often, or together with unrelated files, are the god objects that hurt. Two clusters that read the same mutable data are not truly separate: extracting them only moves the coupling into a shared object nobody owns.",
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Find the clusters',
        text: "Here is a JavaScript class. First, list its fields and, for each method, which fields it reads or changes, as a table. Second, group the fields and methods into clusters that always travel together and give each cluster a noun for a class name. Third, tell me which method crosses clusters. Do not write the new classes yet, and do not add interfaces or base classes.\n\nclass ShopManager {\n  stock = new Map();\n  prices = new Map();\n  points = new Map();\n  sales = [];\n  addStock(item, price, qty) { /* ... */ }\n  placeOrder(customer, item, qty) { /* uses stock, prices, points and sales */ }\n  lowStock(limit) { /* uses stock */ }\n  salesTotal() { /* uses sales */ }\n}",
      },
      {
        type: 'paragraph',
        text: "A good answer names the same three clusters. Check its table against the code, since an AI sometimes lists a field a method never touches, and ask for the smallest split.",
      },
      {
        type: 'takeaways',
        items: [
          'A god object knows and does too much. It grows by the nearest-place rule: each feature goes into the class that already has the data.',
          'Judge by symptoms: a vague name, groups of fields that never meet, heavy test setup, merge conflicts between unrelated features.',
          'Split by following the data: group fields and methods into clusters, name each with a noun, and leave a thin coordinator.',
          'A class is reusable when it could be copied into another program unchanged. That comes from one job and small ties.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-59-arrange-1',
          kind: 'arrange',
          title: 'Split a god object in order',
          prompt: 'Put the steps of splitting a god object in a sensible order.',
          language: 'text',
          solution: [
            'List every field and every method of the class',
            'Mark which fields each method reads or changes',
            'Group fields and methods that always travel together into clusters',
            'Name each cluster with a noun that says what it looks after',
            'Move each cluster into its own class with private fields',
            'Hand the new classes to the old class, which now only sequences them',
            'Run the same program and check that the output has not changed',
          ],
          reasons: [
            'You cannot group what you have not listed.',
            'The marks show which pieces belong together.',
            'The marked groups are the clusters.',
            'The name checks that a cluster is one job and not two.',
            'Only now is it safe to move code.',
            'The old class becomes the coordinator.',
            'Unchanged output is your evidence that nothing broke.',
          ],
          hints: [
            'You must know what exists before you can group it.',
            'Grouping comes after marking, and moving code comes after naming.',
            'The last step proves the first six did no harm.',
          ],
          explanation: 'Analysis first (list, mark, group, name), then the move, then the proof. Moving code before you know the clusters is how a split turns into a second mess.',
          concept: 'splitting a god object',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-59-match-1',
          kind: 'match',
          title: 'What does the symptom tell you?',
          prompt: 'Each situation shows a symptom of a god object. Match it to what it means.',
          labels: { terms: 'What you notice', meanings: 'What it means' },
          pairs: [
            { term: 'To test the loyalty discount you first add stock, register a customer and create a sales log', definition: 'The class mixes jobs, so one rule cannot be tried alone', note: 'The setup shows which jobs are tied together.' },
            { term: 'Two teammates, one fixing stock counting and one changing receipt wording, keep hitting merge conflicts in one file', definition: 'Unrelated reasons to change live in the same class', note: 'The two changes have nothing to do with each other.' },
            { term: 'You want the stock counting in a pharmacy app, but copying the class brings loyalty points with it', definition: 'The class is not reusable, because it knows too much about its original program', note: 'It cannot be lifted out.' },
            { term: 'A method named process(mode) does one of seven different jobs depending on a text value', definition: 'A vague name hides several jobs', note: 'A real name for one job would not need a mode.' },
          ],
          hints: [
            'Ask what the symptom would stop you from doing.',
            'One of the situations is about moving a class into a new project; another is about who edits a file.',
            'A method that needs a mode text to know its job has no single job.',
          ],
          explanation: 'Each symptom is a different way of feeling the same thing: several jobs in one class. Heavy setup, shared edits, being stuck in one program and vague names are all signs worth acting on.',
          concept: 'god object symptoms',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-59-scenario-1',
          kind: 'scenario',
          title: 'Email the receipt',
          prompt: 'Choose where the new feature goes.',
          situation: 'ShopManager already holds the stock, points and sales. The owner now wants each order\'s receipt emailed to the customer. A teammate says: "ShopManager already has all the data, so just add an emailReceipt method." You have time to do it once, properly.',
          options: [
            { text: 'Create a small ReceiptMailer class that is handed a sender and an order\'s data, and have the coordinating class call it.', consequence: 'The mailing job gets a home and a name. It can be tested with a fake sender, and ShopManager does not grow a fifth cluster.', quality: 'best' },
            { text: 'Add emailReceipt to ShopManager, but put the email-sending code in a helper function in the same file.', consequence: 'The method is short, but the class now depends on email sending and still grows. The helper function is hidden coupling that tests cannot replace.', quality: 'acceptable' },
            { text: 'Add emailReceipt to ShopManager and send the email directly inside it.', consequence: 'It works today. The class now has five jobs, and every test of ordering needs an email setup or sends real mail.', quality: 'poor' },
            { text: 'Copy ShopManager into EmailShopManager and add the feature to the copy.', consequence: 'Every future change to stock or points now has to be made twice, and the two copies drift apart.', quality: 'poor' },
          ],
          hints: [
            'Does emailing a receipt belong with stock, points or sales?',
            'Which option gives the new job its own name and lets a test use a fake sender?',
            'A small class of its own, handed what it needs.',
          ],
          explanation: 'The nearest-place rule is exactly how god objects grow. Giving the new job its own class keeps the existing clusters as they are and makes the feature testable with a fake sender (lesson 57).',
          concept: 'avoiding god objects',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-59-code-challenge-1',
          kind: 'code-challenge',
          title: 'Pull the sales log out',
          prompt: '`Shop` keeps its own sales and works out the total. Move that job into a new class `SalesLog` with `record(sale)` and a `total` getter, and have `Shop` take a log in its constructor and call `record`. Remove `salesTotal` from `Shop`. The program should print `174` and then `undefined`.',
          language: 'javascript',
          starter: `class Shop {
  sales = [];
  sell(item, total) {
    this.sales.push({ item, total });
  }
  salesTotal() {
    let sum = 0;
    for (const sale of this.sales) sum += sale.total;
    return sum;
  }
}

const log = new SalesLog();
const shop = new Shop(log);
shop.sell('Rice', 120);
shop.sell('Egg', 54);
console.log(log.total);
console.log(typeof shop.salesTotal);`,
          tests: { kind: 'output', expected: ['174', 'undefined'] },
          solution: `class SalesLog {
  #sales = [];
  record(sale) {
    this.#sales.push(sale);
  }
  get total() {
    let sum = 0;
    for (const sale of this.#sales) sum += sale.total;
    return sum;
  }
}

class Shop {
  constructor(log) {
    this.log = log;
  }
  sell(item, total) {
    this.log.record({ item, total });
  }
}

const log = new SalesLog();
const shop = new Shop(log);
shop.sell('Rice', 120);
shop.sell('Egg', 54);
console.log(log.total);
console.log(typeof shop.salesTotal);`,
          hints: [
            'Run it first and read the error: which name does not exist yet?',
            'SalesLog needs a private list, `record(sale)` to add to it and a `get total()` that adds up the totals. Shop then needs a constructor that keeps the log it is given.',
            'Move the summing loop into SalesLog, delete salesTotal and the sales field from Shop, and call this.log.record(...) in sell.',
          ],
          explanation: 'After the extraction `Shop` only coordinates and `SalesLog` owns the list and the sum. Printing `undefined` for `shop.salesTotal` shows the old method is gone, not left behind as a duplicate.',
          concept: 'extracting a class',
        },
      },
    ],
    quiz: [
      {
        id: 'object-oriented-programming-59-q1',
        prompt: 'A class called ShopManager keeps stock, loyalty points and a sales list. Each method uses only one of these, except placeOrder, which uses all three. What is the most useful reading of this?',
        choices: ['The class is fine as it is, because every field is private and every method is short', 'The class should grow, so that placeOrder is no longer the one special method in it', 'The fields are not needed, since a single Map could hold the data for every customer', 'Three clusters share one class; placeOrder is the method that crosses them'],
        answer: 3,
        explanation: 'Fields and methods that travel together form clusters. A method that crosses every cluster is the one doing several jobs, and it is the natural job of a thin coordinating class.',
      },
      {
        id: 'object-oriented-programming-59-q2',
        prompt: 'Which description makes a class reusable in another program?',
        choices: ['It does one job and does not mention other features or print directly', 'It has many public fields, so that any other program can adjust whatever it needs to', 'It is long and detailed, so that it already covers every case the next program might have', 'It extends a base class that every single class in the first program also extends'],
        answer: 0,
        explanation: 'Reuse comes from knowing nothing about the program around it: one job, small ties, no printing or global reads. Size, public fields and shared parents all tie it to the first program.',
      },
      {
        id: 'object-oriented-programming-59-q3',
        prompt: 'How does a god object usually come to exist?',
        choices: ['A designer plans one big class from the start, because keeping everything together looks simpler', 'The language forces all of the data of one program to be held together in a single class', 'Each feature goes into the class that already has the data, and nobody stops to split it', 'Private fields make classes grow, because the data inside them cannot be shared with others'],
        answer: 2,
        explanation: 'The nearest-place rule is how it happens: every step is reasonable alone, so the class grows until it is too big to change safely.',
      },
      {
        id: 'object-oriented-programming-59-q4',
        prompt: 'You must name a new class that holds a stock map, a price map and the methods that use them. Which name helps most?',
        choices: ['ShopHelper, since it helps the rest of the shop with its day-to-day data', 'Inventory, since it looks after what is in stock and what each item costs', 'StockAndPriceManager, since it manages the stock and also manages the price', 'Data, since it holds all of the data that the shop works with'],
        answer: 1,
        explanation: 'A noun that says what the class looks after tells readers what to expect inside. Helper, Manager and Data say nothing, and the "and" in the third hints at two jobs.',
      },
      {
        id: 'object-oriented-programming-59-q5',
        audience: { max: 'beginner' },
        prompt: 'A shop keeps stock, loyalty cards and sales all in one drawer, and a second worker keeps getting in the first worker\'s way. What is the best fix?',
        choices: ['Give each kind of record its own labelled notebook and say who looks after it', 'Buy a much bigger drawer, so that two people can reach into it at the same time', 'Ask the two workers to take turns at the drawer, one hour each, all through the day', 'Throw away the loyalty cards, so that there is less to keep inside the drawer'],
        answer: 0,
        explanation: 'Splitting by kind of record, each with its own owner, is what splitting a god object means. A bigger drawer or taking turns leaves everything tangled in one place.',
      },
      {
        id: 'object-oriented-programming-59-q6',
        audience: { min: 'advanced' },
        prompt: 'A legacy OrderService has forty methods and callers in every module. What is the safest first move?',
        choices: ['Delete the class and rewrite the service from the requirements, in a single release', 'Write tests that pin its behaviour, extract one cluster, and delegate to it', 'Split it into forty classes, one per method, so that every class has a single purpose', 'Freeze it, and add every new feature in a new class beside it without ever opening the old one'],
        answer: 1,
        explanation: 'Tests protect behaviour, one cluster at a time limits the risk, and delegating wrappers let callers move gradually. A big-bang rewrite or a method-per-class split changes too much at once.',
      },
    ],
    task: {
      title: 'Split the shop',
      steps: [
        'Type the Step 1 code (the class and the program) into any free JavaScript environment and run it. Keep the seven output lines.',
        'Make a table: write each field of ShopManager and mark which methods use it.',
        'Create Inventory, LoyaltyBook, SalesLog and Shop as in Step 2. Run the same program and check that all seven output lines match.',
        'Use Inventory on its own, as in the pharmacy lines of Step 2, with items of your choice. Write one sentence on why this works only because Inventory knows nothing about the shop.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Before splitting, write each method of ShopManager on its own index card, and each field on another. Group the cards that belong together on the table, give each group a name, and only then start typing the new classes.'] },
      { audience: { min: 'advanced' }, steps: ['Add a new rule, "an order over 500 pesos gets free delivery", and decide which class owns it. Then write the minimum tests (without a framework) that would have protected the behaviour of ShopManager during the split, and run them against both versions.'] },
    ],
  },
  {
    id: 'object-oriented-programming-60',
    day: 60,
    title: 'Avoiding Deep Inheritance and Organizing Files and Modules',
    summary: 'Keep inheritance shallow by swapping variations for parts, and lay out files so that code is easy to find and imports never loop.',
    intro: {
      objectives: [
        'Explain why deep inheritance chains and growing combinations are hard to change',
        'Flatten a chain of subclasses into one class that holds small parts',
        'Choose a file layout and spot a circular import before it crashes the program',
      ],
      why: 'AI assistants like to build tall class trees and to pile many classes into one file. You need a rule of thumb for how deep a tree may go and where each class should live.',
    },
    minutes: 20,
    skills: ['maintainable-code', 'inheritance'],
    body: [
      {
        type: 'paragraph',
        text: "Module 6 showed what inheritance costs. This lesson asks how far it should go, then where the classes live. Both are about finding and changing code: a tall tree makes you read five classes to understand one, and tangled files make you hunt.",
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: "Imagine recipe cards where each says \"make card 12, but use less sugar\", and card 12 says \"make card 9, but bake longer\", five cards deep. To cook the last dish you flip through five cards. One level saves effort. Trouble starts as the chain lengthens and variations multiply.",
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: "To understand a class in a deep chain you must read every ancestor, and a change near the top ripples down (the fragile base class of module 6). Worse, variations multiply: if an item can be room, cool or frozen, and local or imported, a class per combination gives six classes. Add a two-way choice and you have twelve. Parts add instead: one class and a small value per choice.",
      },
      {
        type: 'paragraph',
        text: "A rule of thumb: **keep a class tree to two levels, and think hard before a third.** Inherit only for a true is-a. When the difference is a setting (how it is stored, where it came from), make it a part the class holds, the composition of module 8. **Flattening** moves each level's difference into a part and collapses the chain into one class.",
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'Before: each feature adds a level. After: one class holds a part.',
        source: `classDiagram
class Item {
  +label()
  +storage()
}
class PerishableItem
class FrozenItem
class ImportedFrozenItem {
  +country
}
Item <|-- PerishableItem
PerishableItem <|-- FrozenItem
FrozenItem <|-- ImportedFrozenItem
class FlatItem {
  +name
  +price
  +origin
  +label()
}
class Storage {
  +note
  +shelfDays
}
FlatItem o-- Storage`,
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: when two things differ in one small detail, do not build a family tree for it. Keep one class and give it a small separate object for the detail, the way a toy robot takes a battery instead of every model having its own copy. A new combination is then just a different battery. The same idea helps with files: one class per file, named after it, and no two files that need each other to start.",
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'Step 1: a chain four levels deep. Every level changes one thing.',
      },
      { type: 'code', language: 'javascript', label: 'Four levels of inheritance', code: `class Item {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }
  label() {
    return \`\${this.name} P\${this.price}\`;
  }
  storage() {
    return 'store anywhere';
  }
}
class PerishableItem extends Item {
  storage() {
    return 'keep cool';
  }
}
class FrozenItem extends PerishableItem {
  storage() {
    return 'keep frozen';
  }
}
class ImportedFrozenItem extends FrozenItem {
  constructor(name, price, country) {
    super(name, price);
    this.country = country;
  }
  label() {
    return \`\${super.label()} (from \${this.country})\`;
  }
}
const hotdog = new ImportedFrozenItem('Hotdog', 80, 'Japan');
console.log(\`\${hotdog.label()}: \${hotdog.storage()}\`);
console.log(hotdog instanceof Item);
// Hotdog P80 (from Japan): keep frozen
// true` },
      {
        type: 'paragraph',
        text: 'Step 2: the same behaviour with one class and a part. `Storage` holds a note and a shelf life, and `Item` holds one, plus an optional origin.',
      },
      { type: 'code', language: 'javascript', label: 'One class that holds parts', code: `class Storage {
  constructor(note, shelfDays) {
    this.note = note;
    this.shelfDays = shelfDays;
  }
}
const ROOM = new Storage('store anywhere', 365);
const COOL = new Storage('keep cool', 7);
const FROZEN = new Storage('keep frozen', 90);

class Item {
  constructor(name, price, { storage = ROOM, origin = null } = {}) {
    this.name = name;
    this.price = price;
    this.storage = storage;
    this.origin = origin;
  }
  label() {
    const from = this.origin ? \` (from \${this.origin})\` : '';
    return \`\${this.name} P\${this.price}\${from}: \${this.storage.note}\`;
  }
}
const hotdog = new Item('Hotdog', 80, { storage: FROZEN, origin: 'Japan' });
const fish = new Item('Fish', 120, { storage: COOL, origin: 'Norway' });
const rice = new Item('Rice', 60);
console.log(hotdog.label());
console.log(fish.label());
console.log(rice.label());
// Hotdog P80 (from Japan): keep frozen
// Fish P120 (from Norway): keep cool
// Rice P60: store anywhere` },
      {
        type: 'paragraph',
        text: "Now files. JavaScript shares code with **modules**: one file exports a class, another imports it. These blocks are shown, not run here, since the practice runner cannot load files; they were run with Node 22.",
      },
      { type: 'code', language: 'text', label: 'Module syntax: export, import, and a barrel file (not run here)', code: `// inventory.js
export class Inventory {
  /* ... */
}

// checkout.js
import { Inventory } from './inventory.js';

// orders/index.js  (a barrel file: it only re-exports)
export { Order } from './order.js';
export { OrderStore } from './order-store.js';` },
      {
        type: 'paragraph',
        text: "A **barrel file** only re-exports other files, so callers write one import per folder. It hides where code lives and makes import loops easy, so use one per feature at most. Folders go **by layer** (all models together) or **by feature** (everything about orders together); by feature keeps changes together.",
      },
      {
        type: 'paragraph',
        text: "The nastiest trap is a **circular import**: A imports B, and B imports A. Here `Customer.of` makes a `VipCustomer`, which extends `Customer`. Running `main.mjs` fails with \"ReferenceError: Cannot access 'Customer' before initialization\".",
      },
      { type: 'code', language: 'text', label: 'Two files that import each other (customer.mjs, vip-customer.mjs, main.mjs)', code: `// customer.mjs
import { VipCustomer } from './vip-customer.mjs';

export class Customer {
  constructor(name) {
    this.name = name;
  }
  static of(kind, name) {
    return kind === 'vip' ? new VipCustomer(name) : new Customer(name);
  }
}

// vip-customer.mjs
import { Customer } from './customer.mjs';

export class VipCustomer extends Customer {
  get discount() {
    return 10;
  }
}

// main.mjs
import { Customer } from './customer.mjs';

console.log(Customer.of('vip', 'Ana').discount);` },
      {
        type: 'paragraph',
        text: "Node loads `customer.mjs`, which needs `vip-customer.mjs`, which needs the unfinished `customer.mjs`, so `extends Customer` runs too early. Remove the loop: code that knows both classes moves to a third file.",
      },
      { type: 'code', language: 'text', label: 'Without the loop (running main.mjs prints 10)', code: `// customer.mjs (no import of VipCustomer any more)
export class Customer {
  constructor(name) {
    this.name = name;
  }
}

// vip-customer.mjs (unchanged)
import { Customer } from './customer.mjs';

export class VipCustomer extends Customer {
  get discount() {
    return 10;
  }
}

// make-customer.mjs (new)
import { Customer } from './customer.mjs';
import { VipCustomer } from './vip-customer.mjs';

export function makeCustomer(kind, name) {
  return kind === 'vip' ? new VipCustomer(name) : new Customer(name);
}

// main.mjs
import { makeCustomer } from './make-customer.mjs';

console.log(makeCustomer('vip', 'Ana').discount);` },
      {
        type: 'version',
        text: 'Modules are standard JavaScript (ES modules). Node.js treats a file as one when it ends in .mjs or package.json sets "type": "module". Checked against MDN on 2026-11-16.',
        checked: '2026-11-16',
        sources: [DOCS.modules],
      },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          "**Step 1.** `label` is found on `ImportedFrozenItem`, which calls `super.label()` on `Item`. `storage()` is found on `FrozenItem`. To predict either, you must know all four classes.",
          "**Step 2.** The item stores the storage object it is handed, and a cool fish from Norway is one more line of data, with no new class.",
          "**What changed.** The first output line is identical. What is lost is `instanceof FrozenItem`, so code that relied on it would have to change.",
        ],
      },
      {
        type: 'warning',
        text: "Flat is not always better: a `Manager` that is an `Employee` is a fine use of inheritance. Avoid chains you cannot hold in your head.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Cycles usually appear between folders and packages, and are easier to prevent than untangle: a linter rule or dependency checker can fail the build when a folder imports from one that imports it back. Barrel files deserve scepticism in large projects: re-exporting a whole folder can make tools load every file behind it, slow test start-up, and make cycles easy. Across feature boundaries prefer importing from the file that defines a thing, and keep a barrel only for a deliberate public surface.",
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Flatten a chain',
        text: "Here are four JavaScript classes in a chain: Item, PerishableItem extends Item, FrozenItem extends PerishableItem, ImportedFrozenItem extends FrozenItem. Each overrides one method. Rewrite them as one Item class that takes a small Storage object and an optional origin, with the same output for the same items. Then tell me one thing the flat version cannot do that the chain could, and one thing it can do that the chain could not. Do not add interfaces, factories or extra classes beyond Storage.\n\nclass Item { constructor(name, price) { this.name = name; this.price = price; } label() { return this.name + ' P' + this.price; } storage() { return 'store anywhere'; } }\nclass PerishableItem extends Item { storage() { return 'keep cool'; } }\nclass FrozenItem extends PerishableItem { storage() { return 'keep frozen'; } }\nclass ImportedFrozenItem extends FrozenItem {\n  constructor(name, price, country) { super(name, price); this.country = country; }\n  label() { return super.label() + ' (from ' + this.country + ')'; }\n}",
      },
      {
        type: 'paragraph',
        text: "Run both versions and compare with `Hotdog P80 (from Japan): keep frozen`. An AI may keep a hierarchy \"for flexibility\" or claim an old `instanceof` check still works. Test that yourself.",
      },
      {
        type: 'takeaways',
        items: [
          'Deep inheritance means reading every ancestor, and combinations multiply subclasses. Keep trees to two levels.',
          'When classes differ by a setting, make it a part.',
          'One class per file, folders by feature or layer, and a barrel only as a deliberate public surface.',
          'Break a circular import by moving the code that needs both files into a third file.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-60-predict-output-1',
          kind: 'predict-output',
          title: 'Follow the chain',
          prompt: 'Work out what this program prints. Each class adds its word to what its parent said.',
          language: 'javascript',
          code: `class Item {
  describe() {
    return 'item';
  }
}
class Perishable extends Item {
  describe() {
    return \`\${super.describe()} > perishable\`;
  }
}
class Frozen extends Perishable {
  describe() {
    return \`\${super.describe()} > frozen\`;
  }
}
class Imported extends Frozen {
  describe() {
    return \`\${super.describe()} > imported\`;
  }
}
console.log(new Frozen().describe());
console.log(new Imported().describe());
console.log(new Imported() instanceof Perishable);`,
          choices: [
            'item > perishable > frozen\nitem > perishable > frozen > imported\ntrue',
            'item > frozen\nitem > frozen > imported\ntrue',
            'frozen\nimported\ntrue',
            'item > perishable > frozen\nitem > perishable > frozen > imported\nfalse',
          ],
          wrongNotes: {
            'item > frozen\nitem > frozen > imported\ntrue': 'Each `super.describe()` runs the parent\'s version, and that version calls its own parent. No level is skipped.',
            'frozen\nimported\ntrue': 'Every describe starts with super.describe(), so the text of every ancestor is included.',
            'item > perishable > frozen\nitem > perishable > frozen > imported\nfalse': 'The text is right, but an Imported object is a Frozen, which is a Perishable, so instanceof Perishable is true.',
          },
          hints: [
            'Start with `new Frozen().describe()`. Which class defines describe, and what does its super call run?',
            'The chain of super calls goes up one level at a time until it reaches Item, whose describe returns plain "item".',
            'Imported adds to Frozen, which adds to Perishable, which adds to Item. instanceof is true for every ancestor.',
          ],
          explanation: 'Each describe calls its parent and adds a word, so the result grows by one word per level, starting from Item. An object is an instance of every class above it. Reading four classes to predict one line is exactly the cost of a deep chain.',
          concept: 'deep inheritance',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-60-code-challenge-1',
          kind: 'code-challenge',
          title: 'Give Item a part, not a subclass',
          prompt: 'Complete `Item` so it stores the storage object and the optional origin it is given, and so `label()` returns `<name>: <note>`, followed by ` (from <origin>)` when an origin is set. No subclasses.',
          language: 'javascript',
          starter: `class Storage {
  constructor(note) {
    this.note = note;
  }
}
const COOL = new Storage('keep cool');
const FROZEN = new Storage('keep frozen');

class Item {
  constructor(name, storage, origin = null) {
    this.name = name;
  }
  label() {
    return this.name;
  }
}

console.log(new Item('Milk', COOL).label());
console.log(new Item('Hotdog', FROZEN, 'Japan').label());`,
          tests: { kind: 'output', expected: ['Milk: keep cool', 'Hotdog: keep frozen (from Japan)'] },
          solution: `class Storage {
  constructor(note) {
    this.note = note;
  }
}
const COOL = new Storage('keep cool');
const FROZEN = new Storage('keep frozen');

class Item {
  constructor(name, storage, origin = null) {
    this.name = name;
    this.storage = storage;
    this.origin = origin;
  }
  label() {
    const from = this.origin ? \` (from \${this.origin})\` : '';
    return \`\${this.name}: \${this.storage.note}\${from}\`;
  }
}

console.log(new Item('Milk', COOL).label());
console.log(new Item('Hotdog', FROZEN, 'Japan').label());`,
          hints: [
            'The constructor receives three values but keeps only one. What do the other two need?',
            'Store `storage` and `origin` on `this`. In `label`, build the optional text first, then join the pieces.',
            'this.storage = storage; this.origin = origin; and in label use this.storage.note plus (this.origin ? ` (from ${this.origin})` : "").',
          ],
          explanation: 'The item now holds a storage part and an origin, so one class covers every combination. A new kind of storage is a new `Storage` value, not a new subclass.',
          concept: 'flattening inheritance',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-60-scenario-1',
          kind: 'scenario',
          title: 'The app that will not start',
          prompt: 'Pick the best fix.',
          situation: 'Your app crashes at start with "ReferenceError: Cannot access \'Customer\' before initialization". `customer.js` imports `VipCustomer` to offer `Customer.of(kind, name)`, and `vip-customer.js` imports `Customer` to extend it. A teammate suggests several fixes.',
          options: [
            { text: 'Move the factory into a third file that imports both classes, and remove the VipCustomer import from customer.js.', consequence: 'Imports now flow one way. The error is gone, each class file is simple, and the cause is removed instead of hidden.', quality: 'best' },
            { text: 'Swap the order of the two import lines at the top of main.js until the error goes away.', consequence: 'It may work today. The cycle is still there, so a small change elsewhere can bring the error back, and nobody knows why the order matters.', quality: 'poor' },
            { text: 'Paste both classes into one file so there is nothing to import.', consequence: 'The crash disappears, but the files you wanted to organise are now one long file, and a tall pair of tangled classes is still there.', quality: 'acceptable' },
            { text: 'Make every class extend one shared base class so that nothing needs to be imported by name.', consequence: 'A new base class adds a level of inheritance and does not remove the loop between the two files.', quality: 'poor' },
          ],
          hints: [
            'Which two files need each other? Which one only needs the other for a helper?',
            'The code that needs both classes can live somewhere that neither class imports.',
            'Create a third file for the factory.',
          ],
          explanation: 'A cycle is fixed by removing it. The helper that knew both classes moves to a file that depends on them, and neither class depends on it. Reordering lines only hides the loop.',
          concept: 'circular imports',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-60-match-1',
          kind: 'match',
          title: 'Which layout idea is it?',
          prompt: 'Each situation shows a file-layout idea or problem. Match it to the name for it.',
          labels: { terms: 'Situation', meanings: 'The idea' },
          pairs: [
            { term: 'To add a coupon feature you edit one file in models, one in services, one in storage and one in ui', definition: 'A by-layer layout: a feature is spread across folders', note: 'The folders are named after kinds of code, not after features.' },
            { term: 'Opening the orders folder shows the order class, its store, its printer and its tests', definition: 'A by-feature layout: everything about one feature is together', note: 'The folder is named after the feature.' },
            { term: 'A file in each folder only re-exports the files beside it, so callers write one import per folder', definition: 'A barrel file: one import path, at the cost of hiding where code lives', note: 'It adds no code of its own.' },
            { term: 'The program stops at start with "Cannot access Customer before initialization", and two files import each other', definition: 'A circular import: the shared part belongs in a third file', note: 'Each file needs the other before either is ready.' },
          ],
          hints: [
            'Ask whether the folder is named after a kind of code or after a feature.',
            'One of the situations has a file with no code of its own; another is an error at startup.',
            'Two files that import each other, and an error that says a name does not exist yet, point to a cycle.',
          ],
          explanation: 'Each situation is a different face of file organisation: where a feature lives, how a folder is offered to callers, and which way imports point. Reading the symptom tells you which idea applies.',
          concept: 'organising files',
        },
      },
    ],
    quiz: [
      {
        id: 'object-oriented-programming-60-q1',
        prompt: 'An item can be stored room, cool or frozen, and can be local or imported. A team makes one subclass for each combination. What is the main problem?',
        choices: ['JavaScript does not allow more than three subclasses of one parent class in a program', 'Subclasses cannot override methods that their parent defines, unless the two share a file', 'The subclasses cannot be made with new, so each one needs its own factory function', 'Each new choice multiplies the classes, though the difference is only a setting'],
        answer: 3,
        explanation: 'Three storages times two origins is six classes, and a third choice doubles it again. When classes differ by a setting, holding the setting as a part keeps one class.',
      },
      {
        id: 'object-oriented-programming-60-q2',
        prompt: 'Which rule of thumb fits this lesson best?',
        choices: ['Never use inheritance at all, because composition is always the better choice', 'Use inheritance everywhere, since reading one parent is easier than reading many parts', 'Keep trees shallow, and inherit only for a true is-a that can replace its parent', 'Add one more level whenever two classes differ, because a level costs nothing to read'],
        answer: 2,
        explanation: 'The lesson does not ban inheritance: a shallow tree with a true is-a is fine. It warns against deep chains and against making a subclass for every small variation.',
      },
      {
        id: 'object-oriented-programming-60-q3',
        prompt: 'File a imports file b and file b imports file a. What is the best fix?',
        choices: ['Keep both imports but swap the order of the lines until the error goes away', 'Move the code that needs both into a third file, so that imports flow one way only', 'Rename one of the two files so that Node treats it as a different module', 'Add a barrel file that re-exports both, so each file imports it instead of the other'],
        answer: 1,
        explanation: 'A cycle is removed, not reordered. Putting the code that needs both classes in a third file makes the dependencies one-way. A barrel that both files import can simply move the loop.',
      },
      {
        id: 'object-oriented-programming-60-q4',
        prompt: 'Why can a barrel file be a mixed blessing?',
        choices: ['One import path and a small public surface, but it can hide where code lives and invite cycles', 'It forces every class in the folder to extend the first class that it happens to export', 'It makes JavaScript run each class twice, once for every file in the project that imports it', 'It stops a folder from having any tests, because test files are not allowed to import from it'],
        answer: 0,
        explanation: 'A barrel only re-exports. The convenience is real, but callers stop seeing where things are defined, and a barrel that imports a lot is easy to include in a loop.',
      },
      {
        id: 'object-oriented-programming-60-q5',
        audience: { max: 'beginner' },
        prompt: 'Two toy robots differ only in their battery. Which design avoids a family tree?',
        choices: ['Build one robot that takes a battery, and give it a different battery for each model', 'Build a robot class for every battery type, each copying the others', 'Build a robot class for every battery and every colour, so each pair has its own', 'Build no robots, since batteries are hard to fit into a class'],
        answer: 1,
        explanation: 'Making the battery a part the robot holds means one robot class covers every battery. A class per battery, or per battery and colour, grows with every new choice.',
      },
      {
        id: 'object-oriented-programming-60-q6',
        audience: { min: 'advanced' },
        prompt: 'A project has one barrel file at the root that re-exports about 300 modules, and every file imports from it. Which risk is the most realistic?',
        choices: ['Every import is slow at run time, because each re-export is copied into memory twice over', 'The language rejects any project with more than a hundred exports gathered in one file', 'Tools and tests load everything behind the barrel, and import cycles become easy to create', 'The barrel prevents any module from using named exports, so every module must use defaults'],
        answer: 2,
        explanation: 'A broad barrel makes each file depend on everything, so tool start-up and tests can slow down, and a file that is re-exported can end up importing the barrel that re-exports it. Naming a deliberate public surface per feature avoids this.',
      },
    ],
    task: {
      title: 'Flatten a chain and break a loop',
      steps: [
        'Type the Step 1 code into any free JavaScript environment and run it. Then add a class for a cool, imported item and notice what you have to copy.',
        'Type the Step 2 code and add the same cool, imported fish. Count how many new classes the second version needed.',
        'Make a folder with customer.mjs, vip-customer.mjs and main.mjs as in the lesson and run `node main.mjs`. Read the error aloud and say which file is loading which.',
        'Fix it with a third file and run it again. Write one sentence on why reordering the imports would not have fixed the cause.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Before the files, draw the chain on paper with an arrow from each class to its parent. Then draw the flat version: one Item box with an arrow to a Storage box. Count the boxes in each.'] },
      { audience: { min: 'advanced' }, steps: ['Write a tiny script that reads the import lines of the .mjs files in a folder and reports any cycle. Test it on both versions of the customer example, and say what size of project would justify using a ready-made tool instead.'] },
    ],
  },
  {
    id: 'object-oriented-programming-61',
    day: 61,
    title: 'Error Handling in Object-Oriented Code',
    summary: 'Decide when to throw and when to return, write custom errors, keep objects valid after a failure, and never swallow a problem.',
    intro: {
      objectives: [
        'Choose between throwing an error and returning a value for an expected outcome',
        'Write custom Error subclasses with a name, useful data and a cause',
        'Use try, catch and finally so that a failed call leaves the object valid',
      ],
      why: 'AI assistants usually write the happy path and add a catch that prints and moves on. You need to see what a failure leaves behind, so you can ask for code that fails clearly and keeps its data correct.',
    },
    minutes: 20,
    skills: ['maintainable-code', 'encapsulation'],
    body: [
      {
        type: 'paragraph',
        text: "How a class fails matters as much as how it works. The goal is a class that **fails loudly, early and cleanly**: it says what went wrong, stops before it makes things worse, and stays in a state where the next call still works.",
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: "A cashier whose customer is short says so at once, with the exact amount missing. If the card machine fails after the cash was taken, a good cashier gives the cash back before telling the customer. A bad cashier says \"all good\" and hopes.",
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: "First decision: **throw, or return a value?** An **exception** travels up the callers until a `catch` takes it, and cannot be ignored by accident. A **return value** (`null`, `false`, `{ ok: false, reason }`) is an ordinary answer a caller can forget to check.",
      },
      {
        type: 'table',
        headers: ['Situation', 'Prefer', 'Why'],
        rows: [
          ['The caller passed something that makes no sense (a negative amount, null)', 'Throw (RangeError or TypeError)', 'It is a bug in the calling code and must not be ignored'],
          ['A normal result the caller expects to handle right away (item out of stock, coupon expired)', 'Return a value', 'It is not a failure of the code; it is an answer, and it happens often'],
          ['The operation cannot go on and the caller cannot fix it here (payment service down)', 'Throw a custom error, with the cause', 'It must travel to the place that can decide what to do'],
        ],
        caption: 'Neither is always right.',
      },
      {
        type: 'paragraph',
        text: "A **custom error** extends `Error`, so callers can catch it with `instanceof`, and it can carry data. A subclass does not set its own name: it stays `'Error'` unless you set `this.name`. When you translate a low-level error, pass the original as `{ cause: error }`.",
      },
      {
        type: 'paragraph',
        text: "If `try` throws, the rest is skipped and `catch` receives the error. `finally` runs in every case, even after a return or a throw, so it is the place for cleanup. A `catch` takes everything, so ask \"can I handle this?\" and rethrow the rest.",
      },
      {
        type: 'paragraph',
        text: "Three habits. **Fail fast**: check inputs first and name the bad value. **Never swallow**: an empty `catch` turns a failure into a mystery. **Keep the object valid**: check before you change, or undo before the error leaves.",
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'One failure through three layers.',
        source: `sequenceDiagram
  participant Screen
  participant Checkout
  participant Wallet
  participant Gateway
  Screen->>Checkout: pay(30)
  Checkout->>Wallet: charge(30)
  Wallet-->>Checkout: ok, 30 taken
  Checkout->>Gateway: confirm(30)
  Gateway-->>Checkout: throws Error: timeout after 3s
  Checkout->>Wallet: refund(30)
  Checkout-->>Screen: throws PaymentFailedError with the cause
  Screen->>Screen: log everything, show a friendly line`,
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: an error is a way for one part of a program to say \"I cannot do this, and here is why\" and stop. `throw` hands the note up. `catch` is where someone reads it and decides what to do. `finally` is the tidy-up that happens either way, like switching off the lights when you leave a room. The key habit: never write a `catch` that does nothing, because it hides the note unread.",
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: 'Step 1: errors and a wallet that fails fast. A bad amount is a caller bug, so it throws a `RangeError`. Too little money is a business condition with data, so it throws our own error.',
      },
      { type: 'code', language: 'javascript', label: 'Errors and a wallet that fails fast', code: `class ShopError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = this.constructor.name;
  }
}
class InsufficientFundsError extends ShopError {
  constructor(needed, available) {
    super(\`needed \${needed}, available \${available}\`);
    this.needed = needed;
    this.available = available;
  }
}
class PaymentFailedError extends ShopError {}

class Wallet {
  #pesos;
  constructor(pesos) {
    if (!Number.isInteger(pesos) || pesos < 0) {
      throw new RangeError(\`bad opening balance: \${pesos}\`);
    }
    this.#pesos = pesos;
  }
  get pesos() {
    return this.#pesos;
  }
  charge(amount) {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new RangeError(\`bad amount: \${amount}\`);
    }
    if (amount > this.#pesos) {
      throw new InsufficientFundsError(amount, this.#pesos);
    }
    this.#pesos -= amount;
  }
  refund(amount) {
    this.#pesos += amount;
  }
}` },
      {
        type: 'paragraph',
        text: "Step 2: if the gateway fails, checkout refunds, then throws a higher-level error with the original as its cause. `finally` clears `#busy`.",
      },
      { type: 'code', language: 'javascript', label: 'Undo, translate and clean up', code: `class Checkout {
  #busy = false;
  constructor(wallet, gateway) {
    this.wallet = wallet;
    this.gateway = gateway;
  }
  pay(total) {
    if (this.#busy) throw new Error('a payment is already running');
    this.#busy = true;
    try {
      this.wallet.charge(total);
      try {
        this.gateway.confirm(total);
      } catch (error) {
        this.wallet.refund(total);
        throw new PaymentFailedError('payment not confirmed', {
          cause: error,
        });
      }
    } finally {
      this.#busy = false;
    }
  }
}` },
      {
        type: 'paragraph',
        text: "Step 3: the edge. It logs the detail, shows a friendly line, and rethrows anything that is not a `ShopError`.",
      },
      { type: 'code', language: 'javascript', label: 'Words for people, details for the log (the output is in the comments)', code: `function messageFor(error) {
  if (error instanceof InsufficientFundsError) {
    return \`You need \${error.needed - error.available} more pesos.\`;
  }
  if (error instanceof PaymentFailedError) {
    return 'The payment did not go through. You were not charged.';
  }
  return 'Something went wrong. Please try again.';
}

function attempt(checkout, total) {
  try {
    checkout.pay(total);
    console.log('Paid');
  } catch (error) {
    const cause = error.cause ? \` (cause: \${error.cause.message})\` : '';
    console.log(\`LOG \${error.name}: \${error.message}\${cause}\`);
    console.log(\`SHOWN \${messageFor(error)}\`);
    if (!(error instanceof ShopError)) throw error;
  }
}
const okGateway = { confirm() {} };
const downGateway = {
  confirm() {
    throw new Error('timeout after 3s');
  },
};
const wallet = new Wallet(100);
attempt(new Checkout(wallet, okGateway), 60);
attempt(new Checkout(wallet, okGateway), 60);
const down = new Checkout(wallet, downGateway);
attempt(down, 30);
attempt(down, 30);
console.log(wallet.pesos);
try {
  attempt(new Checkout(wallet, okGateway), -5);
} catch (error) {
  console.log(\`UNEXPECTED \${error.name}: \${error.message}\`);
}
// Paid
// LOG InsufficientFundsError: needed 60, available 40
// SHOWN You need 20 more pesos.
// LOG PaymentFailedError: payment not confirmed (cause: timeout after 3s)
// SHOWN The payment did not go through. You were not charged.
// LOG PaymentFailedError: payment not confirmed (cause: timeout after 3s)
// SHOWN The payment did not go through. You were not charged.
// 40
// LOG RangeError: bad amount: -5
// SHOWN Something went wrong. Please try again.
// UNEXPECTED RangeError: bad amount: -5` },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          "**Second payment.** `charge(60)` finds 40 left and throws `InsufficientFundsError(60, 40)`. Checkout has no `catch`, and `finally` clears `#busy`. The screen builds `You need 20 more pesos.` from the numbers on the error.",
          "**Gateway down.** The inner `catch` refunds 30 and throws `PaymentFailedError` with the cause. The wallet still holds 40, and a retry works, because `finally` reset `#busy`.",
          "**The bug case.** `-5` throws a `RangeError`, not a `ShopError`, so `attempt` rethrows it. Bugs are not turned into friendly messages.",
        ],
      },
      {
        type: 'paragraph',
        text: "Keeping an object valid: with a closed account, `transfer` has already withdrawn when the deposit fails, and 40 pesos vanish. `safeTransfer` undoes it first.",
      },
      { type: 'code', language: 'javascript', label: 'Without and with the undo', code: `class Account {
  #pesos;
  #open = true;
  constructor(pesos) {
    this.#pesos = pesos;
  }
  get pesos() {
    return this.#pesos;
  }
  close() {
    this.#open = false;
  }
  withdraw(amount) {
    if (amount > this.#pesos) throw new Error('not enough pesos');
    this.#pesos -= amount;
  }
  deposit(amount) {
    if (!this.#open) throw new Error('account is closed');
    this.#pesos += amount;
  }
}
function transfer(from, to, amount) {
  from.withdraw(amount);
  to.deposit(amount);
}
function safeTransfer(from, to, amount) {
  from.withdraw(amount);
  try {
    to.deposit(amount);
  } catch (error) {
    from.deposit(amount);
    throw error;
  }
}
for (const move of [transfer, safeTransfer]) {
  const ana = new Account(100);
  const ben = new Account(0);
  ben.close();
  try {
    move(ana, ben, 40);
  } catch (error) {
    console.log(error.message);
  }
  console.log(ana.pesos, ben.pesos);
}
// account is closed
// 60 0
// account is closed
// 100 0` },
      {
        type: 'version',
        text: 'The `cause` option is modern JavaScript, available across browsers since September 2021 per MDN, which gives no Node.js version. The examples ran on Node 22.',
        checked: '2026-11-16',
        sources: [DOCS.errorCause],
      },
      {
        type: 'warning',
        text: "Do not hide a failure you did not expect, and do not log and rethrow at every layer. Catch where you can undo, translate, retry or tell the person.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Errors cross boundaries, and classes do not survive them: `JSON.stringify(new Error('x'))` gives `{}`, and a class check cannot work across a network call. When an error leaves a process, give it a stable machine-readable `code` and map it at the edge. Translate once per boundary, keep the original as `cause`, and decide whether each failure is safe to retry, since a charge that may have gone through is not. Cleanup code in `finally` must not throw a new error that hides the first.",
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Review the failure paths',
        text: "Review this JavaScript class only for how it fails. For each method, list: what can go wrong, whether it throws or returns, what state the object is left in after a failure, and whether any catch block swallows an error. Then show me the smallest changes that fix the worst problem. Do not rewrite the class, do not add logging libraries, and do not change what it does when everything works.\n\nfunction transfer(from, to, amount) {\n  from.withdraw(amount);\n  try {\n    to.deposit(amount);\n  } catch (error) {\n    console.log('deposit failed');\n  }\n}",
      },
      {
        type: 'paragraph',
        text: "A good answer finds that the withdrawal is not undone and the `catch` hides the error. Beware a big try around everything, a catch that logs and continues, or an invented retry. Run it with a closed account before and after.",
      },
      {
        type: 'takeaways',
        items: [
          'Throw for bugs and failures the caller cannot fix; return a value for ordinary answers.',
          'A custom Error sets its name, carries data, and keeps the original as its cause.',
          'catch handles only what it can; finally always runs, so it holds the cleanup.',
          'Fail fast, never swallow, and keep objects valid.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-61-fix-bug-1',
          kind: 'fix-bug',
          title: 'The desk that stays busy',
          prompt: 'The desk should refuse a missing name with an error, but still serve the next customers. Right now the error vanishes and the desk locks up. Tap the line that should guarantee the tidy-up, then choose the replacement.',
          language: 'javascript',
          code: `class Desk {
  #busy = false;
  serve(name) {
    if (this.#busy) throw new Error('desk busy');
    this.#busy = true;
    try {
      if (name === '') throw new Error('no name');
      console.log(\`serving \${name}\`);
    } catch (error) {
      this.#busy = false;
    }
  }
}
const desk = new Desk();
try {
  desk.serve('');
} catch (error) {
  console.log(error.message);
}
desk.serve('Ana');
desk.serve('Ben');`,
          bugLine: 9,
          fixes: [
            { line: '} finally {', correct: true, why: 'The tidy-up now runs after every call, and the error is no longer caught, so it travels to the caller who prints it.' },
            { line: '} catch {', correct: false, why: 'This is the same behaviour without the error variable: the error is still swallowed, and a successful call still leaves the desk busy.' },
            { line: '} catch (error) { throw error;', correct: false, why: 'The error now travels up, but the line that clears the flag sits after the throw and never runs, so the desk stays busy.' },
            { line: '} else {', correct: false, why: 'try has no else branch, so this line is a syntax error and the program does not run at all.' },
          ],
          lineNote: 'Which line decides when the busy flag is cleared?',
          tests: { kind: 'output', expected: ['no name', 'serving Ana', 'serving Ben'] },
          hints: [
            'Run it in your head: after serve(\'Ana\') succeeds, is the desk still busy?',
            'The flag is cleared only inside catch, which runs only after an error. Which block runs after every call?',
            'Replace the catch with the block that always runs.',
          ],
          explanation: 'With `catch`, the flag was cleared only on failure, and the failure itself was hidden. With `finally`, the flag is cleared on every path and the error reaches the caller, so the desk stays usable and the problem is reported.',
          concept: 'try, catch and finally',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-61-predict-output-1',
          kind: 'predict-output',
          title: 'When does finally run?',
          prompt: 'Work out the output. Remember the order of try, catch and finally, and that a return still passes through finally.',
          language: 'javascript',
          code: `function attempt(n) {
  try {
    console.log('try');
    if (n > 1) throw new Error('big');
    return 'small';
  } catch (error) {
    console.log(\`caught \${error.message}\`);
    return 'caught';
  } finally {
    console.log('finally');
  }
}
console.log(attempt(1));
console.log(attempt(2));`,
          choices: [
            'try\nfinally\nsmall\ntry\ncaught big\nfinally\ncaught',
            'try\nsmall\nfinally\ntry\ncaught big\ncaught\nfinally',
            'try\nsmall\ntry\ncaught big\ncaught',
            'try\nfinally\nsmall\ntry\nfinally\ncaught big\ncaught',
          ],
          wrongNotes: {
            'try\nsmall\nfinally\ntry\ncaught big\ncaught\nfinally': 'The value being returned is only handed back after finally has run, so `finally` prints before the caller prints `small`.',
            'try\nsmall\ntry\ncaught big\ncaught': 'The finally block runs in every case, including after a return, so its line appears in both calls.',
            'try\nfinally\nsmall\ntry\nfinally\ncaught big\ncaught': 'In the second call the catch block runs first, and finally runs after it ends, not before.',
          },
          hints: [
            'For attempt(1): try runs and reaches return. What still has to happen before the caller gets the value?',
            'For attempt(2): the throw jumps to catch. In what order do catch, finally and the return value happen?',
            'finally runs last inside the function, and the returned value reaches the caller after it.',
          ],
          explanation: 'A return inside try or catch waits until finally has run. So in both calls the `finally` line prints before the console.log outside prints the returned value.',
          concept: 'finally',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-61-scenario-1',
          kind: 'scenario',
          title: 'Throw or return?',
          prompt: 'Choose the best way for the method to report this.',
          situation: 'A `Cart.applyCoupon(code)` method is called when a customer types a coupon. About one in five codes is expired or mistyped, and the screen already has a place to show "That coupon cannot be used". Your teammate is deciding how `applyCoupon` should report a bad code.',
          options: [
            { text: 'Return a small result such as { ok: false, reason: "expired" } and let the screen read it.', consequence: 'The answer is an ordinary outcome, the screen handles it on the spot, and no special catch code is needed anywhere.', quality: 'best' },
            { text: 'Throw a CouponExpiredError and require every caller to wrap the call in try and catch.', consequence: 'It works, but a common, expected answer now travels like an emergency, and every caller needs a catch just to show a normal message.', quality: 'acceptable' },
            { text: 'Return the plain text "error" and let callers compare it with a string.', consequence: 'A typo in one caller\'s comparison hides the failure, and the reason for the failure is thrown away.', quality: 'poor' },
            { text: 'Catch every problem inside applyCoupon, print it and return nothing.', consequence: 'The screen cannot tell a bad code from a good one, and the problem is only visible in a console nobody reads.', quality: 'poor' },
          ],
          hints: [
            'Is a mistyped coupon a bug in the code, or a normal answer?',
            'Which option lets the screen react right away without a catch block?',
            'Return a result that says what happened.',
          ],
          explanation: 'A bad coupon is an expected answer that happens often, so a returned result fits better than an exception. An exception would suit a call with nonsense input, for example a null cart.',
          concept: 'exceptions vs return values',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-61-code-challenge-1',
          kind: 'code-challenge',
          title: 'An error that carries its numbers',
          prompt: 'Write the class `InsufficientFundsError` so that it extends `Error`, has the name `InsufficientFundsError`, has the message `needed <amount>, has <balance>`, and keeps `balance` and `amount` as properties. `Account.withdraw` already throws it. The program should print the name and message, then the shortfall.',
          language: 'javascript',
          starter: `class Account {
  #balance;
  constructor(balance) {
    this.#balance = balance;
  }
  withdraw(amount) {
    if (amount > this.#balance) {
      throw new InsufficientFundsError(this.#balance, amount);
    }
    this.#balance -= amount;
  }
}

try {
  new Account(50).withdraw(80);
} catch (error) {
  console.log(\`\${error.name}: \${error.message}\`);
  console.log(error.amount - error.balance);
}`,
          tests: { kind: 'output', expected: ['InsufficientFundsError: needed 80, has 50', '30'] },
          solution: `class InsufficientFundsError extends Error {
  constructor(balance, amount) {
    super(\`needed \${amount}, has \${balance}\`);
    this.name = 'InsufficientFundsError';
    this.balance = balance;
    this.amount = amount;
  }
}

class Account {
  #balance;
  constructor(balance) {
    this.#balance = balance;
  }
  withdraw(amount) {
    if (amount > this.#balance) {
      throw new InsufficientFundsError(this.#balance, amount);
    }
    this.#balance -= amount;
  }
}

try {
  new Account(50).withdraw(80);
} catch (error) {
  console.log(\`\${error.name}: \${error.message}\`);
  console.log(error.amount - error.balance);
}`,
          hints: [
            'Run it first. Which name does the error say is missing?',
            'The class extends Error, calls super with the message, then sets this.name and two properties. Notice the order of its two arguments, balance and then amount.',
            'class InsufficientFundsError extends Error { constructor(balance, amount) { super(`needed ${amount}, has ${balance}`); this.name = ...; this.balance = ...; this.amount = ...; } }',
          ],
          explanation: 'The subclass sets its own name, since a subclass would otherwise report `Error`, and it keeps the numbers so a caller can compute the shortfall without parsing the message.',
          concept: 'custom errors',
        },
      },
    ],
    quiz: [
      {
        id: 'object-oriented-programming-61-q1',
        prompt: 'A `findItem(id)` method is called all the time, and about a third of lookups find nothing. How should it report a miss?',
        choices: ['Throw a NotFoundError, so that nobody can ever forget that a miss can happen', 'Print a warning and return nothing at all, so that the screen stays clean and quiet', 'Return a value that says "not found", since a miss is an ordinary answer', 'Throw a RangeError each time, because the id was outside the range of known items'],
        answer: 2,
        explanation: 'A frequent, expected outcome is an answer, not an emergency. Returning a value lets the caller handle it on the spot, while exceptions suit bugs and failures the caller cannot fix.',
      },
      {
        id: 'object-oriented-programming-61-q2',
        prompt: 'A method has a try block that returns early and a finally block that clears a flag. When does the flag get cleared?',
        choices: ['Only when the try block finishes without an error and does not return early at any point', 'Only when the catch block runs, because finally is a part of the catch block itself', 'Only when the method returns a value, since it waits for the last line of the try block', 'On every path: a normal finish, an early return, a caught error, an uncaught one'],
        answer: 3,
        explanation: 'finally runs in every case, even when try returns or throws, which is why it is the place for cleanup such as clearing a flag or closing a resource.',
      },
      {
        id: 'object-oriented-programming-61-q3',
        prompt: 'A team\'s logs show "Error: payment not confirmed" for every failure, whatever kind it is. What is the likely cause?',
        choices: ['The error classes never set this.name, so each subclass reports the name Error', 'JavaScript only has one kind of error, so names cannot be told apart', 'The errors were thrown from a method that was too long, which hides their names', 'The message was built from a template literal, which replaces the name'],
        answer: 0,
        explanation: 'A subclass of Error does not set its own name: it stays Error unless the constructor sets this.name (for example from this.constructor.name).',
      },
      {
        id: 'object-oriented-programming-61-q4',
        prompt: 'What is the main danger of `catch (error) { }` with nothing inside?',
        choices: ['It slows the program down, because every error is copied somewhere before it is dropped', 'It hides a real failure, so the program goes on in a wrong state with no clue why', 'It stops the program from running any of the code that follows the try block at all', 'It prevents finally from ever running, because the catch block has no code to finish'],
        answer: 1,
        explanation: 'An empty catch removes the only signal that something went wrong. The program continues as if nothing happened, and the problem shows up later, far from its cause.',
      },
      {
        id: 'object-oriented-programming-61-q5',
        audience: { max: 'beginner' },
        prompt: 'A cashier takes a customer\'s cash, then the card machine fails. What should a careful cashier do before telling the customer?',
        choices: ['Keep the cash and say that everything worked, so that the customer is not upset', 'Hide the problem and try the card machine again when nobody is looking at it', 'Ask the customer to come back tomorrow, and keep the cash until that time comes', 'Give the cash back so nothing is half done, then explain what went wrong'],
        answer: 3,
        explanation: 'Undoing the half-finished step before reporting the failure keeps things in a valid state. It is what a transfer or a checkout should do when its second step fails.',
      },
      {
        id: 'object-oriented-programming-61-q6',
        audience: { min: 'advanced' },
        prompt: 'A service catches a database error and throws new Error("save failed") with no other detail. Production logs now show only "save failed". What went wrong, and what is the fix?',
        choices: ['Nothing: short messages are best, since logs are read by people in a hurry', 'The original error was logged twice, so remove one of the two logs in the service', 'The cause was dropped: rethrow with { cause: error } and log the chain once', 'The service should return the string "save failed", so that callers can compare it'],
        answer: 2,
        explanation: 'Translating an error is fine, but the original must travel with it, or the evidence is lost. Passing the cause and logging once at the edge keeps both clarity and detail.',
      },
    ],
    task: {
      title: 'Break it, then make it fail well',
      steps: [
        'Type the code blocks of Steps 1 to 3 into any free JavaScript environment. Confirm the output matches the comments.',
        'Remove the `finally` from Checkout, put `this.#busy = false;` after the try statement, and run again. Write down which attempt now says that a payment is already running.',
        'Restore the `finally`. Then add an empty catch around a call to `wallet.charge(-5)` and run it. Write what the output no longer tells you.',
        'Run the transfer example. The first pair of lines is `transfer` and the second is `safeTransfer`. Write both final balances.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Before running the transfer, predict the two balances on paper for the version without a rollback, and then for the version with one. Compare with the real output.'] },
      { audience: { min: 'advanced' }, steps: ['Give each ShopError subclass a stable `code` string, serialise a caught error with JSON.stringify to show what is lost, and write a small `toResponse(error)` function that maps codes to a status and a safe message without leaking the cause.'] },
    ],
  },
  {
    id: 'object-oriented-programming-62',
    day: 62,
    title: 'Unit Testing Classes',
    summary: 'Test one class at a time through its public methods, with hand-written stand-ins for its collaborators and a check for every failure path.',
    intro: {
      objectives: [
        'Write a unit test in arrange, act, assert form for a class',
        'Test behaviour through public methods instead of private internals',
        'Use a hand-written stub and fake to test a class away from its real collaborators',
      ],
      why: 'AI assistants write tests quickly, and many of those tests cannot fail or check the wrong thing. Once you can write and judge a unit test, you can tell whether a green result means anything.',
    },
    minutes: 20,
    skills: ['maintainable-code', 'encapsulation'],
    body: [
      {
        type: 'paragraph',
        text: "A class that works today can break tomorrow when someone changes a line far away. A **unit test** is a small program that checks one behaviour of one class and says pass or fail in a moment. A set of them is a safety net.",
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: "A mechanic does not test a jeepney's brakes on a crowded road. The brakes go on a stand, alone and safe, with a fake load for passengers. If the stand shows a problem, it is the brakes. Parts that pass alone can still fail together, so unit tests are one layer of testing.",
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: "A **unit** is one class, or one small behaviour of it, tested without the unpredictable world around it: no network, no files, no real clock. A good test has three steps, **arrange, act, assert**: build the object and what it needs, make the one call you are testing, then check what should now be true. One behaviour per test, named for it.",
      },
      {
        type: 'paragraph',
        text: "Test **behaviour through the public methods**, not private state. A `#private` field cannot be read from a test, and an underscore field should not be. A test that peeks inside breaks when you tidy the inside, though nothing the class promises changed. If you can only check something by looking inside, the class may need a getter.",
      },
      {
        type: 'paragraph',
        text: "In a test you give a class's collaborators stand-ins called **test doubles**, written by hand. A **stub** returns fixed answers, such as a price list that always says rice costs 60. A **fake** is a simplified version that really works, such as a store that keeps orders in a list. A fake that records its calls, like a notifier that keeps every message, lets the test check what was sent. This is where lesson 57's injection pays off.",
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'In a test, Checkout gets a fake store and a recording notifier, and cannot tell the difference.',
        source: `classDiagram
class Checkout {
  +complete(cart, customer)
}
class Store {
  <<interface>>
  +save(order)
}
class Notifier {
  <<interface>>
  +send(text)
}
class DatabaseStore
class SmsNotifier
class FakeStore {
  +orders
}
class RecordingNotifier {
  +sent
}
Checkout --> Store
Checkout --> Notifier
Store <|.. DatabaseStore
Store <|.. FakeStore
Notifier <|.. SmsNotifier
Notifier <|.. RecordingNotifier`,
      },
      {
        type: 'table',
        headers: ['What to test', 'Example for the cart and checkout', 'What it protects'],
        rows: [
          ['Normal use', 'Two lines of items give the right total', 'The main promise of the class'],
          ['Edge values', 'A quantity of 1 works; 0 does not', 'The boundary where off-by-one bugs live'],
          ['Refused input and the state after it', 'A bad quantity throws a RangeError and the cart is still empty', 'Failing cleanly (lesson 61)'],
          ['Collaborator behaviour', 'A failing store means no message is sent', 'How the class treats the parts it uses'],
        ],
        caption: 'A checklist for each class.',
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: a unit test is a tiny program that tries one thing and tells you pass or fail. You set up the situation (arrange), do the one thing (act), and compare what happened with what you expected (assert). Because the test only looks at what the class shows to the outside, you can rearrange the inside and the test still tells the truth. When the class needs another part, you hand it a simple pretend one, the way a driving school uses a practice car, so the only thing that can fail is the class you are testing.",
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: "Step 1: a tiny test helper as in lesson 23, the classes under test, and the doubles. `Cart` is handed a price list. `Checkout` is handed a store and a notifier.",
      },
      { type: 'code', language: 'javascript', label: 'Test helper, classes under test and test doubles', code: `function test(name, run) {
  try {
    run();
    console.log(\`PASS \${name}\`);
  } catch (error) {
    console.log(\`FAIL \${name}: \${error.message}\`);
  }
}
function assertEqual(actual, expected) {
  if (actual !== expected) {
    throw new Error(\`expected \${expected}, got \${actual}\`);
  }
}
function assertThrows(run, ErrorType) {
  try {
    run();
  } catch (error) {
    if (!(error instanceof ErrorType)) {
      throw new Error(\`wrong error: \${error.name}\`);
    }
    return;
  }
  throw new Error('expected an error, but none was thrown');
}

class Cart {
  #lines = [];
  constructor(prices) {
    this.prices = prices;
  }
  add(item, qty = 1) {
    if (!Number.isInteger(qty) || qty < 1) {
      throw new RangeError(\`bad quantity: \${qty}\`);
    }
    const price = this.prices.priceOf(item);
    if (price === undefined) throw new Error(\`unknown item: \${item}\`);
    this.#lines.push({ item, qty, price });
  }
  get count() {
    let n = 0;
    for (const line of this.#lines) n += line.qty;
    return n;
  }
  get total() {
    let sum = 0;
    for (const line of this.#lines) sum += line.price * line.qty;
    return sum;
  }
}
class Checkout {
  constructor(store, notifier) {
    this.store = store;
    this.notifier = notifier;
  }
  complete(cart, customer) {
    if (cart.count === 0) throw new Error('cart is empty');
    const id = this.store.save({ customer, total: cart.total });
    this.notifier.send(\`\${customer}: order \${id} for \${cart.total} pesos\`);
    return id;
  }
}

const stubPrices = {
  priceOf: (item) => ({ Rice: 60, Egg: 9 })[item],
};
class FakeStore {
  orders = [];
  save(order) {
    this.orders.push(order);
    return this.orders.length;
  }
}
class RecordingNotifier {
  sent = [];
  send(text) {
    this.sent.push(text);
  }
}
const brokenStore = {
  save() {
    throw new Error('disk full');
  },
};` },
      {
        type: 'paragraph',
        text: 'Step 2: six tests, each arrange, act, assert, with a name that states the behaviour.',
      },
      { type: 'code', language: 'javascript', label: 'Six small tests (add below, then run)', code: `test('total adds price times quantity', () => {
  const cart = new Cart(stubPrices);
  cart.add('Rice', 2);
  cart.add('Egg', 6);
  assertEqual(cart.total, 174);
});
test('a bad quantity is refused and the cart is unchanged', () => {
  const cart = new Cart(stubPrices);
  assertThrows(() => cart.add('Rice', 0), RangeError);
  assertEqual(cart.count, 0);
});
test('an unknown item is refused', () => {
  const cart = new Cart(stubPrices);
  assertThrows(() => cart.add('Gold', 1), Error);
  assertEqual(cart.total, 0);
});
test('checkout saves the order and tells the customer', () => {
  const store = new FakeStore();
  const notifier = new RecordingNotifier();
  const cart = new Cart(stubPrices);
  cart.add('Rice', 2);
  const id = new Checkout(store, notifier).complete(cart, 'Ana');
  assertEqual(id, 1);
  assertEqual(store.orders[0].total, 120);
  assertEqual(notifier.sent[0], 'Ana: order 1 for 120 pesos');
});
test('an empty cart saves nothing and sends nothing', () => {
  const store = new FakeStore();
  const notifier = new RecordingNotifier();
  const checkout = new Checkout(store, notifier);
  assertThrows(() => checkout.complete(new Cart(stubPrices), 'Ana'), Error);
  assertEqual(store.orders.length, 0);
  assertEqual(notifier.sent.length, 0);
});
test('if saving fails, no message is sent', () => {
  const notifier = new RecordingNotifier();
  const cart = new Cart(stubPrices);
  cart.add('Egg', 3);
  const checkout = new Checkout(brokenStore, notifier);
  assertThrows(() => checkout.complete(cart, 'Ana'), Error);
  assertEqual(notifier.sent.length, 0);
});
// PASS total adds price times quantity
// PASS a bad quantity is refused and the cart is unchanged
// PASS an unknown item is refused
// PASS checkout saves the order and tells the customer
// PASS an empty cart saves nothing and sends nothing
// PASS if saving fails, no message is sent` },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          "**`test`.** It runs the function in a `try`: no throw prints `PASS`, a failed assert prints `FAIL`. One failing test does not stop the others.",
          "**The first test.** Arrange: a cart with the stub. Act: two `add` calls. Assert: 120 + 54 = 174.",
          "**The refused quantity.** `assertThrows` checks for a `RangeError`, then the second assert checks the state after the failure: the cart is still empty.",
          "**Checkout with doubles.** The fake's `save` returns the count of stored orders, so the first id is 1. The test reads the fake's `orders` and the notifier's `sent`, never a private field.",
        ],
      },
      {
        type: 'paragraph',
        text: "A test that cannot fail proves nothing, so make each fail once. Change `total` to `sum += line.price;` and run again: two tests go red (`expected 174, got 69`, `expected 120, got 60`) and four stay green. Restore the line.",
      },
      {
        type: 'version',
        text: 'Test runners such as Jest express the same checks with test(), expect(value).toBe(...) and expect(() => ...).toThrow(ErrorClass). Checked against the Jest documentation (version 30.5) on 2026-11-16.',
        checked: '2026-11-16',
        sources: [DOCS.jest, DOCS.jestExpect],
      },
      {
        type: 'warning',
        text: "Do not copy production logic into the test: it will agree with a mistake in the formula. Use values worked out by hand, with no loops or conditions.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "Hand-written fakes and stubs keep tests readable and survive refactoring. Mocks that assert exactly which methods were called, in which order, tie the test to the implementation, so a harmless refactor turns tests red. Prefer checking outcomes (the stored order, the message sent) over calls. Test a fake against the same contract as the real implementation, or it will drift. Keep unit tests deterministic: inject the clock and the id source, and treat a test that fails one run in twenty as a bug to fix, not a test to rerun.",
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Review these tests',
        text: "Here is a JavaScript class and its tests. For each test, tell me: which behaviour it checks, whether it could ever fail, whether it reads private state or copies the class's own formula, and which important cases are missing (edge values, refused input, state after failure). Do not write new tests yet, and do not install any libraries.\n\nclass Cart {\n  #lines = [];\n  constructor(prices) { this.prices = prices; }\n  add(item, qty = 1) {\n    if (!Number.isInteger(qty) || qty < 1) throw new RangeError('bad quantity: ' + qty);\n    this.#lines.push({ item, qty, price: this.prices.priceOf(item) });\n  }\n  get total() { let s = 0; for (const l of this.#lines) s += l.price * l.qty; return s; }\n}\n\ntest('adds items', () => {\n  const cart = new Cart({ priceOf: () => 10 });\n  cart.add('Rice', 2);\n  assertEqual(typeof cart.total, 'number');\n});",
      },
      {
        type: 'paragraph',
        text: "A good review notices that the test passes even if the total is wrong, and that nothing tests a bad quantity. An AI may praise weak tests as \"comprehensive\". Break the class on purpose to check.",
      },
      {
        type: 'takeaways',
        items: [
          'A unit test checks one behaviour of one class: arrange, act, assert.',
          'Test through public methods, so tests survive changes inside.',
          'A stub gives fixed answers; a fake is a simple working stand-in.',
          'Test error paths and the state after failure, and make each test fail once to prove it can.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-62-fix-bug-1',
          kind: 'fix-bug',
          title: 'A test that peeks inside',
          prompt: 'This test tries to read the cart\'s private list and the program will not even run. Tap the line that reaches inside, then choose the assert that checks the same thing through the public interface.',
          language: 'javascript',
          code: `function test(name, run) {
  try {
    run();
    console.log(\`PASS \${name}\`);
  } catch (error) {
    console.log(\`FAIL \${name}: \${error.message}\`);
  }
}
function assertEqual(actual, expected) {
  if (actual !== expected) throw new Error(\`expected \${expected}, got \${actual}\`);
}
class Cart {
  #lines = [];
  add(item, price) {
    this.#lines.push({ item, price });
  }
  get count() {
    return this.#lines.length;
  }
}
test('adding one item', () => {
  const cart = new Cart();
  cart.add('Rice', 60);
  assertEqual(cart.#lines.length, 1);
});`,
          bugLine: 24,
          fixes: [
            { line: 'assertEqual(cart.count, 1);', correct: true, why: 'The cart already reports how many items it holds through the public `count` getter, so the test checks the behaviour without looking inside.' },
            { line: 'assertEqual(cart.lines.length, 1);', correct: false, why: 'The cart has no public property called lines, so this reads undefined and the test fails with an error.' },
            { line: 'assertEqual(cart._lines.length, 1);', correct: false, why: 'The underscore is only a naming convention, and this cart used a real private field, so there is no _lines to read.' },
            { line: 'assertEqual(cart.count, 0);', correct: false, why: 'It uses the public getter, but the cart now holds one item, so this expects the wrong value and the test fails.' },
          ],
          lineNote: 'Which line reads something the class keeps private?',
          tests: { kind: 'output', expected: ['PASS adding one item'] },
          hints: [
            'A name with # in front belongs to the class and cannot be used from outside it.',
            'Does the class already offer a public way to ask how many items it holds?',
            'Use the getter named count.',
          ],
          explanation: 'A test should ask the same questions any other caller can ask. The public `count` answers the question without exposing the list, so the test keeps working if the cart later keeps its items in a different structure.',
          concept: 'testing behaviour',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-62-predict-output-1',
          kind: 'predict-output',
          title: 'What do the tests say?',
          prompt: 'Work out the output of this test run, line by line.',
          language: 'javascript',
          code: `function test(name, run) {
  try {
    run();
    console.log(\`PASS \${name}\`);
  } catch (error) {
    console.log(\`FAIL \${name}: \${error.message}\`);
  }
}
function assertEqual(actual, expected) {
  if (actual !== expected) throw new Error(\`expected \${expected}, got \${actual}\`);
}
class Jar {
  #coins = 0;
  put(n) {
    this.#coins += n;
    if (n < 0) throw new RangeError('negative');
  }
  get coins() {
    return this.#coins;
  }
}
test('adds coins', () => {
  const jar = new Jar();
  jar.put(3);
  jar.put(4);
  assertEqual(jar.coins, 7);
});
test('stays valid after a refused put', () => {
  const jar = new Jar();
  try {
    jar.put(-5);
  } catch (error) {
    console.log(\`refused: \${error.message}\`);
  }
  assertEqual(jar.coins, 0);
});`,
          choices: [
            'PASS adds coins\nrefused: negative\nFAIL stays valid after a refused put: expected 0, got -5',
            'PASS adds coins\nrefused: negative\nPASS stays valid after a refused put',
            'PASS adds coins\nFAIL stays valid after a refused put: expected 0, got -5',
            'FAIL adds coins: expected 7, got 3\nrefused: negative\nPASS stays valid after a refused put',
          ],
          wrongNotes: {
            'PASS adds coins\nrefused: negative\nPASS stays valid after a refused put': 'Look at `put`: it changes the coins before it checks the amount. The refusal happens after the damage.',
            'PASS adds coins\nFAIL stays valid after a refused put: expected 0, got -5': 'The catch inside the test prints a line when the error arrives, so `refused: negative` appears before the FAIL line.',
            'FAIL adds coins: expected 7, got 3\nrefused: negative\nPASS stays valid after a refused put': 'Both calls to `put` work, so the first test sees 3 + 4 = 7 and passes.',
          },
          hints: [
            'The first test is plain: 3 plus 4. Does it pass?',
            'In the second test, `put(-5)` first changes the coins and only then throws. What does the jar hold when the test asserts?',
            'The catch prints its line before the assert runs, and the assert sees -5.',
          ],
          explanation: 'The jar adds before it validates, so a refused put leaves -5 inside. The test for state after failure catches exactly this, and it is the kind of bug a test that only checked the thrown error would miss.',
          concept: 'testing error paths',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-62-scenario-1',
          kind: 'scenario',
          title: 'The test that fails by chance',
          prompt: 'Choose the best way to make the test dependable.',
          situation: 'A `PriceReport` class fetches live exchange rates from a web service inside its constructor, then converts prices. Its test passes some days and fails on others, because the rates change and the service is sometimes slow. You must make the test dependable without losing the check that conversion is correct.',
          options: [
            { text: 'Have the class take a rates provider as an argument, and in the test hand it a stub that always returns the same rates.', consequence: 'The test no longer touches the network, gives the same result every run, and still checks the conversion arithmetic. The real provider is used in the real app.', quality: 'best' },
            { text: 'Keep the live call and make the test retry up to five times until it passes.', consequence: 'It passes more often, but it is still slow, still depends on the network, and may hide a real conversion bug when a retry gets lucky.', quality: 'poor' },
            { text: 'Delete the test, because tests that touch the outside world cannot be reliable.', consequence: 'The flakiness is gone, and so is any protection for the conversion logic. The next change to it is unchecked.', quality: 'poor' },
            { text: 'Copy the conversion formula into the test and compare the class to it using the live rates.', consequence: 'Still flaky, and the test now repeats the class\'s own formula, so a mistake in the formula would agree with itself.', quality: 'poor' },
          ],
          hints: [
            'What makes the test unpredictable: the class, or something it reaches for?',
            'Which option makes the unpredictable part something you can replace in a test?',
            'Inject the provider and use a stub with fixed rates.',
          ],
          explanation: 'Injecting the collaborator lets a test replace the unpredictable part with a stub. That is the same loosening as lesson 57, and it is what makes classes testable.',
          concept: 'test doubles',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-62-code-challenge-1',
          kind: 'code-challenge',
          title: 'Write the fake store',
          prompt: 'The three tests need a `FakeStore`. Write it: `save(order)` keeps the order in a public `orders` list and returns its position, starting at 1 (so the first order gets id 1, the second id 2). All three tests should print PASS.',
          language: 'javascript',
          starter: `function test(name, run) {
  try {
    run();
    console.log(\`PASS \${name}\`);
  } catch (error) {
    console.log(\`FAIL \${name}: \${error.message}\`);
  }
}
function assertEqual(actual, expected) {
  if (actual !== expected) throw new Error(\`expected \${expected}, got \${actual}\`);
}

class Checkout {
  constructor(store) {
    this.store = store;
  }
  complete(total) {
    return this.store.save({ total });
  }
}

// Write FakeStore here.

test('the first order gets id 1', () => {
  const checkout = new Checkout(new FakeStore());
  assertEqual(checkout.complete(120), 1);
});
test('the second order gets id 2', () => {
  const checkout = new Checkout(new FakeStore());
  checkout.complete(120);
  assertEqual(checkout.complete(54), 2);
});
test('the store keeps the orders', () => {
  const store = new FakeStore();
  const checkout = new Checkout(store);
  checkout.complete(120);
  checkout.complete(54);
  assertEqual(store.orders[1].total, 54);
});`,
          tests: { kind: 'output', expected: ['PASS the first order gets id 1', 'PASS the second order gets id 2', 'PASS the store keeps the orders'] },
          solution: `function test(name, run) {
  try {
    run();
    console.log(\`PASS \${name}\`);
  } catch (error) {
    console.log(\`FAIL \${name}: \${error.message}\`);
  }
}
function assertEqual(actual, expected) {
  if (actual !== expected) throw new Error(\`expected \${expected}, got \${actual}\`);
}

class Checkout {
  constructor(store) {
    this.store = store;
  }
  complete(total) {
    return this.store.save({ total });
  }
}

class FakeStore {
  orders = [];
  save(order) {
    this.orders.push(order);
    return this.orders.length;
  }
}

test('the first order gets id 1', () => {
  const checkout = new Checkout(new FakeStore());
  assertEqual(checkout.complete(120), 1);
});
test('the second order gets id 2', () => {
  const checkout = new Checkout(new FakeStore());
  checkout.complete(120);
  assertEqual(checkout.complete(54), 2);
});
test('the store keeps the orders', () => {
  const store = new FakeStore();
  const checkout = new Checkout(store);
  checkout.complete(120);
  checkout.complete(54);
  assertEqual(store.orders[1].total, 54);
});`,
          hints: [
            'Run it first. The error names the class that does not exist yet.',
            'FakeStore needs a list called orders and a save method that adds to it.',
            'After pushing, the new order\'s id is the length of the list.',
          ],
          explanation: 'A fake is a simple working stand-in. Because Checkout is handed its store, the test can give it one that keeps orders in a list, and the test can look at that list to check the result without any database.',
          concept: 'fakes',
        },
      },
    ],
    quiz: [
      {
        id: 'object-oriented-programming-62-q1',
        prompt: 'A test builds a Cart, calls add twice and then checks cart.total against a number worked out by hand. Which parts of the arrange, act, assert pattern are they?',
        choices: ['Arrange is the total check, act is the building of the cart, and assert is the second add call', 'Arrange and act are the same step, so the pattern does not apply to a test of this size', 'Arrange is the hand-worked number, since it has to be prepared before anything else can run', 'Arrange is the cart and its stub, act is the add calls, and assert is the check of the total'],
        answer: 3,
        explanation: 'Arrange sets up the object and what it needs, act makes the call under test, and assert compares the result with what you expected.',
      },
      {
        id: 'object-oriented-programming-62-q2',
        prompt: 'A test reads a class\'s underscore field to check its state. Later the field is renamed and the test breaks, though the class still works. What is the lesson?',
        choices: ['Underscore names are private in JavaScript, so the test was written correctly', 'Fields should never be renamed after the first test has been written for them', 'Tests should read every field of a class, so that nothing inside is left unchecked', 'Test through public methods, so tests survive harmless changes inside the class'],
        answer: 3,
        explanation: 'An underscore is only a naming habit and can be read, but a test that depends on it is tied to the inside. A test on public behaviour keeps working when the inside is tidied.',
      },
      {
        id: 'object-oriented-programming-62-q3',
        prompt: 'What is the difference between a stub and a fake as this lesson uses the words?',
        choices: ['A stub gives fixed answers, while a fake is a simplified version that really works', 'A stub works with a real database, while a fake only prints text to the screen', 'A stub is a class that extends the real one, while a fake can only be an object literal', 'A stub is used for errors, while a fake is used only for passing tests'],
        answer: 0,
        explanation: 'A stub is a canned answer, like a price list that always says 60. A fake behaves like the real thing in a simple way, like a store that keeps orders in a list.',
      },
      {
        id: 'object-oriented-programming-62-q4',
        prompt: 'Why can a Checkout that is handed its store and notifier be tested without a database or real messages?',
        choices: ['Because JavaScript turns off network access whenever a test function is running', 'Because a test can hand it stand-ins with the same method names', 'Because private fields stop a class from reaching the database during a test run', 'Because tests are always run on a different computer from the real program'],
        answer: 1,
        explanation: 'Checkout only calls `save` and `send`. Anything with those methods will do, so a test can supply doubles, which is the injection idea of lesson 57.',
      },
      {
        id: 'object-oriented-programming-62-q5',
        audience: { max: 'beginner' },
        prompt: 'A driving school lets learners practise on a quiet track with a practice car, not on a busy road. What does this match in unit testing?',
        choices: ['The class is tested alone, with simple stand-ins in place of the real, unpredictable parts', 'The class is tested only after the whole program is finished and busy', 'The class is tested by asking customers whether it seems to work', 'The class is tested by reading its code and saying that it looks correct'],
        answer: 1,
        explanation: 'A quiet track is a safe, repeatable place. A unit test runs one class alone, with simple stand-ins, so a failure points to that class.',
      },
      {
        id: 'object-oriented-programming-62-q6',
        audience: { min: 'advanced' },
        prompt: 'Tests turn red after a harmless refactor of a class that has not changed what it does. They assert the exact order and number of calls made to mocks. What is the most likely cause?',
        choices: ['The refactor must have changed behaviour, and the tests are correct to complain', 'The tests are coupled to the implementation, so assert outcomes such as stored data and messages sent', 'The tests need more mocks, so that every internal call is also checked', 'The class should be made static, so that no calls need to be recorded at all'],
        answer: 2,
        explanation: 'Tests that pin down which methods were called, and in what order, are tied to how the class works rather than what it promises. Checking outcomes through fakes survives refactoring.',
      },
    ],
    task: {
      title: 'Write, break and trust a test',
      steps: [
        'Type the helper, the classes, the doubles and the six tests into any free JavaScript environment and run them. All six should say PASS.',
        'Break `total` on purpose by removing the quantity from the sum. Run the tests and write down which tests fail and what their messages say. Restore the line.',
        'Write one new test: adding the same item twice with quantities 1 and 3 gives the right total. Work out the expected number by hand first.',
        'Write one new test that checks the state after a failure for a different class method, and say in one sentence what it protects.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Before running anything, read each of the six tests aloud and say, in your own words, what it checks. Then run them and see whether you were right.'] },
      { audience: { min: 'advanced' }, steps: ['Make the tests deterministic against a changing input: give Checkout an injected id source and clock (plain functions), update the fake and the tests, and write one test that proves two checkouts get the ids the fake hands out, in order.'] },
    ],
  },
  {
    id: 'object-oriented-programming-63',
    day: 63,
    title: 'Refactoring a Poorly Structured Application',
    summary: 'Improve a messy program in small, tested steps without changing what it does, and learn the named moves that make each step safe.',
    intro: {
      objectives: [
        'Explain what refactoring is and why tests come first',
        'Apply extract method, replace conditional with data and extract class in small steps',
        'Plan the refactoring of a tangled program, one named step at a time',
      ],
      why: 'Most real work, and most AI-generated code, is a messy program you must improve without breaking it. Refactoring in small tested steps is the skill that makes that safe.',
    },
    minutes: 25,
    skills: ['maintainable-code', 'solid'],
    body: [
      {
        type: 'paragraph',
        text: "Real code rarely starts with good structure, and AI-generated code often does not either. **Refactoring** is improving the structure of working code without changing what it does. A rewrite throws code away and hopes. Refactoring changes the shape in small steps and checks after each that nothing moved. That is why tests come first.",
      },
      { type: 'heading', text: 'A real-world picture' },
      {
        type: 'paragraph',
        text: "Imagine reorganising a sari-sari store's shelves while customers keep buying. You move one shelf at a time and check after each move that the till still balances. If it is off, you know which move did it. A program gives no such signal, so the till has to be a test.",
      },
      { type: 'heading', text: 'How it works' },
      {
        type: 'paragraph',
        text: "The loop has four steps. Start with tests that pass on the code as it is. Make **one small change** that should not alter behaviour. Run the tests. If they pass, keep it and take the next change. If not, undo it and take a smaller step.",
      },
      {
        type: 'diagram',
        format: 'mermaid',
        caption: 'The loop. A red result tells you which small change to look at.',
        source: `flowchart TD
  A[Tests pass on the current code] --> B[Make one small change]
  B --> C[Run the tests]
  C --> D{Still passing?}
  D -->|Yes| E[Keep it and pick the next change]
  D -->|No| F[Undo it or fix it, then try a smaller step]
  E --> B
  F --> B`,
      },
      {
        type: 'paragraph',
        text: "**Tests first** also means testing what the code does today, including odd cases you suspect are wrong. These are called characterisation tests: they describe, not judge. If you tidy while an odd case is unpinned, you may silently change it. If it really is a bug, fix it later as a separate change with its own test. Never wear the refactoring hat and the new-feature hat together.",
      },
      {
        type: 'table',
        headers: ['Named refactoring', 'What changes', 'Where you have met it'],
        rows: [
          ['Extract method', 'A repeated or long stretch of code becomes a method with a name', 'Step 1 below'],
          ['Replace conditional with data', 'An if chain whose branches differ only in values becomes a lookup table', 'Step 2 below'],
          ['Replace conditional with polymorphism', 'A switch on type becomes one class per case', 'Module 7'],
          ['Extract class', 'A cluster of fields and methods moves to a class of its own', 'Step 3 below, lesson 59'],
          ['Move method', 'A method moves to the class whose data it mostly uses', 'Lesson 58'],
          ['Inject dependency', 'A collaborator created inside a class is handed in instead', 'Lesson 57, module 8'],
        ],
        caption: 'Named moves are safe because each has a known before, after and risk.',
      },
      {
        type: 'paragraph',
        text: "**When not to refactor**: code about to be deleted, code that works, never changes and has no tests, and the middle of a deadline. A mess you must change this week is different: write tests around the part you will touch, tidy only that part, and leave the rest.",
      },
      {
        type: 'paragraph',
        audience: { max: 'beginner' },
        text: "In plain words: refactoring is tidying code without changing what it does, like rearranging a room while the furniture stays the same. You cannot see by looking whether you broke something, so first you write small checks (tests) that tell you what the code does now. Then you tidy in tiny steps, running the checks after each. If one turns red, the last step is the guilty one. Names like \"extract method\" (give a repeated piece of code a name and call it from both places) are labels for common tidy-ups.",
      },
      { type: 'heading', text: 'See it in code' },
      {
        type: 'paragraph',
        text: "A small shop with two smells: the fee calculation is written twice, and an `if` chain picks the fee by kind. First the original, with tests that pin today's behaviour, including the unknown kind, which has no fee.",
      },
      { type: 'code', language: 'javascript', label: 'The original (messy but working) and tests that pin it', code: `class Shop {
  constructor() {
    this.sales = [];
  }
  quote(kind, price, qty) {
    let total = price * qty;
    if (kind === 'frozen') total += 10 * qty;
    else if (kind === 'imported') total += 20 * qty;
    return total;
  }
  sell(kind, price, qty) {
    let total = price * qty;
    if (kind === 'frozen') total += 10 * qty;
    else if (kind === 'imported') total += 20 * qty;
    this.sales.push(total);
    return total;
  }
  get takings() {
    let sum = 0;
    for (const total of this.sales) sum += total;
    return sum;
  }
}

function check(name, actual, expected) {
  const ok = actual === expected;
  const note = ok ? '' : \` (got \${actual}, wanted \${expected})\`;
  console.log(\`\${ok ? 'PASS' : 'FAIL'} \${name}\${note}\`);
}
const shop = new Shop();
check('regular item', shop.quote('regular', 60, 2), 120);
check('frozen adds 10 per item', shop.quote('frozen', 80, 2), 180);
check('imported adds 20 per item', shop.quote('imported', 100, 1), 120);
check('unknown kind adds nothing', shop.quote('mystery', 50, 2), 100);
shop.sell('regular', 60, 2);
shop.sell('frozen', 80, 1);
check('takings add up', shop.takings, 210);
// PASS regular item
// PASS frozen adds 10 per item
// PASS imported adds 20 per item
// PASS unknown kind adds nothing
// PASS takings add up` },
      {
        type: 'paragraph',
        text: 'Step 1, extract method: the duplicated lines become one `price` method.',
      },
      { type: 'code', language: 'javascript', label: 'Step 1 (fragment: the checks still all PASS)', code: `  price(kind, price, qty) {
    let total = price * qty;
    if (kind === 'frozen') total += 10 * qty;
    else if (kind === 'imported') total += 20 * qty;
    return total;
  }
  quote(kind, price, qty) {
    return this.price(kind, price, qty);
  }
  sell(kind, price, qty) {
    const total = this.price(kind, price, qty);
    this.sales.push(total);
    return total;
  }` },
      {
        type: 'paragraph',
        text: "Step 2, replace conditional with data: the `if` chain becomes a table. This first attempt looks right, and it is a trap. One test goes red and names the case: an unknown kind makes `FEES[kind]` undefined, and `60 + undefined` is `NaN`.",
      },
      { type: 'code', language: 'javascript', label: 'Step 2, first attempt (fragment: the changed lines)', code: `const FEES = { regular: 0, frozen: 10, imported: 20 };
// inside Shop:
price(kind, price, qty) {
  return (price + FEES[kind]) * qty;
}
// Tests: four PASS, and
// FAIL unknown kind adds nothing (got NaN, wanted 100)` },
      {
        type: 'paragraph',
        text: "The fix keeps the old behaviour with `??`, which uses the right side when the left is `undefined`: `(FEES[kind] ?? 0)`. Step 3, extract class, is in the final version: the sales list and its sum move into `Sales`, which `Shop` is handed. `takings` stays on `Shop`, so no caller and no test changes.",
      },
      { type: 'code', language: 'javascript', label: 'After step 3 (the finished refactoring)', code: `const FEES = { regular: 0, frozen: 10, imported: 20 };

class Sales {
  #totals = [];
  record(total) {
    this.#totals.push(total);
  }
  get total() {
    let sum = 0;
    for (const total of this.#totals) sum += total;
    return sum;
  }
}

class Shop {
  constructor(sales = new Sales()) {
    this.sales = sales;
  }
  quote(kind, price, qty) {
    return (price + (FEES[kind] ?? 0)) * qty;
  }
  sell(kind, price, qty) {
    const total = this.quote(kind, price, qty);
    this.sales.record(total);
    return total;
  }
  get takings() {
    return this.sales.total;
  }
}

// Run the same five checks: all PASS` },
      { type: 'heading', text: 'Walk through the code' },
      {
        type: 'list',
        items: [
          "**Before.** The same lines compute the fee in `quote` and `sell`. A fee change needs two edits, and forgetting one makes the quote and the sale disagree.",
          "**Step 1.** The structure improved and the five checks still pass.",
          "**Step 2.** A new kind is one line of data. The red line shows why the odd case had to be pinned: the table was right for every kind in it and wrong for one outside it.",
          "**Step 3.** `Sales` keeps its totals private, so the public `shop.takings` is unchanged. Each step was a few lines and ended with a green run.",
        ],
      },
      { type: 'heading', text: 'The guided project: the tangled shop' },
      {
        type: 'paragraph',
        text: "Project 10 gives you a bigger version. The program below works and prints ten lines. It has a god class, the find and fee code written twice, a four-level product tree with an `instanceof` chain, printing in the middle of the logic, and no tests. Run it and keep its exact output: that is the behaviour you must preserve.",
      },
      { type: 'code', language: 'javascript', label: 'Project starting code: the tangled shop (about 100 lines)', code: `class Product {
  constructor(name, price, stock) {
    this.name = name;
    this.price = price;
    this.stock = stock;
  }
}
class Perishable extends Product {
  constructor(name, price, stock, days) {
    super(name, price, stock);
    this.days = days;
  }
}
class Frozen extends Perishable {
  constructor(name, price, stock, days) {
    super(name, price, stock, days);
    this.cold = true;
  }
}
class ImportedFrozen extends Frozen {
  constructor(name, price, stock, days, country) {
    super(name, price, stock, days);
    this.country = country;
  }
}

class Shop {
  constructor() {
    this.products = [];
    this.orders = [];
    this.points = {};
    this.log = [];
  }
  add(product) {
    this.products.push(product);
  }
  order(customer, name, qty) {
    let product = null;
    for (const p of this.products) {
      if (p.name === name) product = p;
    }
    if (product === null) {
      console.log('no such product: ' + name);
      return 0;
    }
    if (product.stock < qty) {
      console.log('not enough ' + name);
      return 0;
    }
    let total = product.price * qty;
    if (product instanceof ImportedFrozen) total += 20 * qty;
    else if (product instanceof Frozen) total += 10 * qty;
    else if (product instanceof Perishable) total += 5 * qty;
    if ((this.points[customer] || 0) >= 50) total = (total * 90) / 100;
    product.stock -= qty;
    this.points[customer] = (this.points[customer] || 0) + Math.floor(total / 10);
    this.orders.push({ customer, name, qty, total });
    this.log.push('ORDER ' + customer + ' ' + name + ' x' + qty);
    console.log(customer + ' pays ' + total);
    return total;
  }
  quote(name, qty) {
    let product = null;
    for (const p of this.products) {
      if (p.name === name) product = p;
    }
    if (product === null) return 0;
    let total = product.price * qty;
    if (product instanceof ImportedFrozen) total += 20 * qty;
    else if (product instanceof Frozen) total += 10 * qty;
    else if (product instanceof Perishable) total += 5 * qty;
    return total;
  }
  report() {
    let sum = 0;
    for (const o of this.orders) sum += o.total;
    console.log('SALES ' + this.orders.length + ' orders, ' + sum + ' pesos');
    const spent = {};
    for (const o of this.orders) {
      spent[o.customer] = (spent[o.customer] || 0) + o.total;
    }
    let best = null;
    for (const c in spent) if (best === null || spent[c] > spent[best]) best = c;
    console.log('BEST ' + best);
    for (const p of this.products) {
      if (p.stock <= 5) console.log('LOW ' + p.name + ' ' + p.stock);
    }
  }
}

const shop = new Shop();
shop.add(new Product('Rice', 60, 20));
shop.add(new Perishable('Milk', 40, 12, 7));
shop.add(new Frozen('Hotdog', 80, 10, 90));
shop.add(new ImportedFrozen('Fish', 120, 4, 60, 'Norway'));
shop.order('Ana', 'Rice', 6);
shop.order('Ana', 'Hotdog', 2);
shop.order('Ana', 'Fish', 3);
shop.order('Ben', 'Milk', 3);
shop.order('Ben', 'Fish', 3);
shop.order('Ben', 'Gold', 1);
console.log(shop.quote('Fish', 2));
shop.report();` },
      { type: 'code', language: 'text', label: 'Its output (Node 22)', code: `Ana pays 360
Ana pays 180
Ana pays 378
Ben pays 135
not enough Fish
no such product: Gold
280
SALES 4 orders, 1053 pesos
BEST Ana
LOW Fish 1` },
      {
        type: 'table',
        headers: ['Smell in the tangled shop', 'Refactoring to try', 'A test that guards it'],
        rows: [
          ['The find-a-product loop appears in `order` and `quote`', 'Extract method, later an `Inventory` class', 'Quote of a known and of an unknown product'],
          ['The fee `instanceof` chain appears twice', 'Extract method, then replace the conditional with data or polymorphism', 'A quote for each product kind'],
          ['A four-level product tree', 'Flatten into one `Product` that holds a small part (lesson 60)', 'Quotes and the stock check'],
          ['Points and the discount rule live inside `order`', 'Extract class (`LoyaltyBook`)', 'Ana\'s third order gets 10 percent off'],
          ['Totals and the best customer are worked out inside `report`', 'Extract class (a sales log)', 'The numbers in the report'],
          ['`console.log` in the middle of the logic', 'Return values, and move printing to the edge', 'The same lines of output'],
        ],
        caption: 'A plan, not a requirement. Run your tests after every step.',
      },
      {
        type: 'warning',
        text: "The tangled shop prints from inside its methods, so test through the values it returns and its public fields, or capture `console.log` for the length of a test and put it back. Do not rewrite the program to make it testable first: that is the big-bang rewrite.",
      },
      {
        type: 'paragraph',
        audience: { min: 'advanced' },
        text: "With many callers, a change to a widely used method cannot be done in one step. Use **parallel change**: add the new method or class beside the old one, move callers over a few at a time, then remove the old one, so every commit leaves the system working. Editor refactorings such as rename and extract method update every reference, so they beat hand edits. Where tests are missing, write characterisation tests at the outermost seam. Keep refactoring commits separate from behaviour changes.",
      },
      { type: 'heading', text: 'Try it with AI' },
      {
        type: 'prompt',
        label: 'Plan the steps first',
        text: "Here is a small JavaScript class and the tests that pass on it. I want to refactor it without changing behaviour. Do not write the new code yet. Give me a numbered plan of the smallest steps, in order. For each step, name the refactoring (extract method, extract class, replace conditional with data, and so on), say which tests guard it, and say what could change by accident. Tell me which case in the tests is easiest to break.\n\nclass Shop {\n  constructor() { this.sales = []; }\n  quote(kind, price, qty) {\n    let total = price * qty;\n    if (kind === 'frozen') total += 10 * qty;\n    else if (kind === 'imported') total += 20 * qty;\n    return total;\n  }\n  sell(kind, price, qty) {\n    let total = price * qty;\n    if (kind === 'frozen') total += 10 * qty;\n    else if (kind === 'imported') total += 20 * qty;\n    this.sales.push(total);\n    return total;\n  }\n}\n\nTests: regular item 120 for (60 x 2); frozen adds 10 per item; imported adds 20 per item; an unknown kind adds nothing.",
      },
      {
        type: 'paragraph',
        text: "A good plan has small steps, names each move, and spots that the unknown kind is the risk of a lookup table. Watch for an AI that proposes one big rewrite, \"improves\" behaviour at the same time, or edits the test expectations to make them pass. Run your own tests after each step.",
      },
      {
        type: 'takeaways',
        items: [
          'Refactoring changes structure, not behaviour. Write tests that pass on the current code first, odd cases included, then change one small thing and run them again.',
          'A red test after a small step points at the step to undo; a big step leaves you guessing.',
          'Named refactorings are known-safe moves.',
          'Do not mix refactoring with new features or bug fixes.',
        ],
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-63-match-1',
          kind: 'match',
          title: 'Which refactoring is it?',
          prompt: 'Each situation describes a messy spot. Match it to the refactoring that fixes it.',
          labels: { terms: 'The messy spot', meanings: 'The refactoring' },
          pairs: [
            { term: 'The same five lines that work out a fee appear in both quote and sell', definition: 'Extract method: give the repeated code a name and call it', note: 'The fix is a name and a call, not a new class.' },
            { term: 'An if chain returns 0, 10 or 20 depending on a kind, and nothing else differs between its branches', definition: 'Replace conditional with data: a lookup table of values', note: 'Only the values differ, so a table is enough.' },
            { term: 'A Shop keeps a list of sales and the code that sums them, and none of the other methods touch either', definition: 'Extract class: move the cluster to a class of its own', note: 'The fields and methods travel together.' },
            { term: 'A Shop constructor runs new SmsSender(), so every test sends a text', definition: 'Inject dependency: pass the collaborator in', note: 'The class should be handed what it uses.' },
            { term: 'A formatPrice method sits in Shop but only reads fields of Product', definition: 'Move method: put it in the class whose data it uses', note: 'It belongs next to the data it reads.' },
          ],
          hints: [
            'Ask what is wrong: repeated code, a chain that differs only in values, a cluster of data, a hidden collaborator, or a method in the wrong place?',
            'Two of the situations involve a class creating or holding something that belongs to another class.',
            'A repeated stretch of code needs a name; a chain that differs only in numbers needs a table.',
          ],
          explanation: 'Each messy spot has a known, small fix. Naming the move tells you what the before and after look like, and what to test.',
          concept: 'named refactorings',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-63-fix-bug-1',
          kind: 'fix-bug',
          title: 'The tidy-up that changed behaviour',
          prompt: 'A teammate extracted the discount rule into its own method. The old rule gave a 10 percent discount at 500 pesos or more, and the tests describe it. One test is now red. Tap the line where the refactoring changed the behaviour, then choose the line that restores it.',
          language: 'javascript',
          code: `function check(name, actual, expected) {
  const ok = actual === expected;
  const note = ok ? '' : \` (got \${actual}, wanted \${expected})\`;
  console.log(\`\${ok ? 'PASS' : 'FAIL'} \${name}\${note}\`);
}
class Cart {
  #amounts = [];
  add(price, qty) {
    this.#amounts.push(price * qty);
  }
  subtotal() {
    let sum = 0;
    for (const amount of this.#amounts) sum += amount;
    return sum;
  }
  discount(sum) {
    return sum > 500 ? (sum * 10) / 100 : 0;
  }
  total() {
    const sum = this.subtotal();
    return sum - this.discount(sum);
  }
}
function cartOf(price, qty) {
  const cart = new Cart();
  cart.add(price, qty);
  return cart.total();
}
check('600 gets 10 percent off', cartOf(100, 6), 540);
check('400 gets none', cartOf(100, 4), 400);
check('500 is the boundary', cartOf(100, 5), 450);`,
          bugLine: 17,
          fixes: [
            { line: 'return sum >= 500 ? (sum * 10) / 100 : 0;', correct: true, why: 'The rule is "500 or more", so the boundary at exactly 500 gets the discount again, as before the tidy-up.' },
            { line: 'return sum >= 500 ? (sum * 90) / 100 : 0;', correct: false, why: 'This fixes the boundary but takes 90 percent off the price instead of 10, so the 600 test and the 500 test fail.' },
            { line: 'return sum >= 400 ? (sum * 10) / 100 : 0;', correct: false, why: 'This moves the boundary down to 400, so the "400 gets none" test fails.' },
            { line: 'return sum > 500 ? 50 : 0;', correct: false, why: 'A flat 50 is wrong for 600, which should lose 60, and the boundary at 500 still gets no discount.' },
          ],
          lineNote: 'Which line decides when the discount applies?',
          tests: { kind: 'output', expected: ['PASS 600 gets 10 percent off', 'PASS 400 gets none', 'PASS 500 is the boundary'] },
          hints: [
            'Read the red line: which amount does not get the discount that the old rule gave it?',
            'The old rule was "500 pesos or more". Which comparison includes 500 itself?',
            'Use >= instead of >.',
          ],
          explanation: 'The extraction quietly changed `>=` to `>`, a change in behaviour at exactly one value. Only a test of the boundary could catch it, which is why tests come first and why edge values matter.',
          concept: 'preserving behaviour',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-63-scenario-1',
          kind: 'scenario',
          title: 'A messy module, two days, no tests',
          prompt: 'Decide how to approach the work.',
          situation: 'You must add a new loyalty rule to a 400-line OrderManager that has no tests. It is tangled, and you have two days. A teammate says "let\'s rewrite OrderManager from scratch first; then adding the rule is easy".',
          options: [
            { text: 'Write tests for the part you will touch, tidy only that part in small steps, then add the rule as a separate change.', consequence: 'You get a safety net exactly where the change happens, the risk stays small, and the new rule is reviewed on its own.', quality: 'best' },
            { text: 'Add the rule directly with careful manual checks, and leave the structure alone.', consequence: 'It may ship on time, but without tests you cannot be sure you broke nothing, and the module is a little worse than before.', quality: 'acceptable' },
            { text: 'Rewrite OrderManager from scratch, then add the rule on top of the new code.', consequence: 'Two days are not enough, nothing pins down the old behaviour, and the rewrite may drop odd cases customers depend on.', quality: 'poor' },
            { text: 'Refactor the whole class and add the rule in the same change, so there is only one review.', consequence: 'If something breaks, you cannot tell whether the tidy-up or the new rule caused it, and the review is too large to read properly.', quality: 'poor' },
          ],
          hints: [
            'What protects you if you change a module that has no tests?',
            'Which option keeps the tidy-up small and the new rule separate?',
            'Tests around the part you will touch, small steps, then the rule.',
          ],
          explanation: 'With no tests and little time, refactor only where you must work, behind tests you write first, and keep the behaviour change separate. A full rewrite or a mixed change removes your ability to tell what broke.',
          concept: 'when and how to refactor',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'object-oriented-programming-63-code-challenge-1',
          kind: 'code-challenge',
          title: 'Extract the repeated price',
          prompt: '`quote` and `sell` repeat the same fee calculation. Extract it into a method `price(kind, qty)` on `Shop` that both use, without changing any result. The program should print 120, 210 and then `function` (the type of `shop.price`).',
          language: 'javascript',
          starter: `class Shop {
  constructor() {
    this.sales = [];
  }
  quote(kind, qty) {
    let total = 60 * qty;
    if (kind === 'frozen') total += 10 * qty;
    return total;
  }
  sell(kind, qty) {
    let total = 60 * qty;
    if (kind === 'frozen') total += 10 * qty;
    this.sales.push(total);
    return total;
  }
}

const shop = new Shop();
console.log(shop.quote('regular', 2));
console.log(shop.sell('frozen', 3));
console.log(typeof shop.price);`,
          tests: { kind: 'output', expected: ['120', '210', 'function'] },
          solution: `class Shop {
  constructor() {
    this.sales = [];
  }
  price(kind, qty) {
    let total = 60 * qty;
    if (kind === 'frozen') total += 10 * qty;
    return total;
  }
  quote(kind, qty) {
    return this.price(kind, qty);
  }
  sell(kind, qty) {
    const total = this.price(kind, qty);
    this.sales.push(total);
    return total;
  }
}

const shop = new Shop();
console.log(shop.quote('regular', 2));
console.log(shop.sell('frozen', 3));
console.log(typeof shop.price);`,
          hints: [
            'Which lines appear twice? They are the ones to move.',
            'Create a `price(kind, qty)` method that holds those lines and returns the total, then call `this.price(...)` from both methods.',
            'quote returns this.price(kind, qty); sell stores this.price(kind, qty) and returns it.',
          ],
          explanation: 'The two methods now share one definition of the price, so the fee rule exists once. The three outputs stay the same, which is the sign of a behaviour-preserving step, and `typeof shop.price` shows the new method exists.',
          concept: 'extract method',
        },
      },
    ],
    quiz: [
      {
        id: 'object-oriented-programming-63-q1',
        prompt: 'Which of these is a refactoring?',
        choices: ['Adding a loyalty discount to the checkout so customers earn points', 'Rewriting the program from scratch in a different structure and checking it later', 'Fixing a wrong total by changing the formula so the result matches the receipt', 'Moving the repeated fee lines into one method, with every output unchanged'],
        answer: 3,
        explanation: 'Refactoring changes structure and leaves behaviour alone. Adding a feature, fixing a bug and a rewrite all change what the program does or throw away what it has.',
      },
      {
        id: 'object-oriented-programming-63-q2',
        prompt: 'Why do tests come before the first refactoring step?',
        choices: ['Tests make the refactored code run faster, because they remove branches that are never used', 'The tests teach you the names of the tidy-ups, and any order of those names will work well', 'The language refuses to run a refactored class that has no tests stored next to it', 'Without them you cannot tell whether a step changed behaviour, odd cases included'],
        answer: 3,
        explanation: 'A refactoring promises that behaviour has not changed. Only a test, written first and passing on the old code, can show whether the promise held, including for odd cases.',
      },
      {
        id: 'object-oriented-programming-63-q3',
        prompt: 'You make a change and one test turns red. Which response fits the lesson best?',
        choices: ['Undo or fix that one change and take a smaller step', 'Change the test so that it expects the new result and carry on', 'Make three more changes first, so that the red test is fixed by accident', 'Delete the test, since it is blocking the refactoring'],
        answer: 0,
        explanation: 'A red test after a small step points at that step. Editing or deleting the test removes the safety net, and piling on changes hides the cause.',
      },
      {
        id: 'object-oriented-programming-63-q4',
        prompt: 'You notice a real bug while refactoring: unknown kinds are not rejected. What should you do?',
        choices: ['Fix it in the same commit as the tidy-up, since you are already inside the code', 'Finish the refactoring, then fix the bug as a separate change with its own test', 'Ignore it for good, because a refactoring is never allowed to touch any bug at all', 'Rewrite the whole class from scratch, so that the bug cannot exist in the new version'],
        answer: 1,
        explanation: 'Mixing a behaviour change into a tidy-up makes failures impossible to place. Finish the structure change, then make the fix on its own with a test.',
      },
      {
        id: 'object-oriented-programming-63-q5',
        audience: { max: 'beginner' },
        prompt: 'You rearrange a store\'s shelves one shelf at a time and count the till after each move. What does counting the till stand for in refactoring?',
        choices: ['Writing the final report for the shop owner, so that the owner can read it later', 'Counting how many lines of code the program has before and after the tidy-up', 'Running the tests after every small change to check that nothing broke', 'Asking a friend to say whether the code looks neat from the outside of the shop'],
        answer: 2,
        explanation: 'The till is the check that the shop still works. In code, the tests are that check, and running them after every small step tells you which move caused a problem.',
      },
      {
        id: 'object-oriented-programming-63-q6',
        audience: { min: 'advanced' },
        prompt: 'A widely used method must change its parameters, and forty callers across many teams depend on it. Which approach keeps the system working at every commit?',
        choices: ['Change the method and all forty callers in a single large commit, to avoid a half-done state', 'Leave the old method untouched forever and add a comment that it is deprecated', 'Add the new method beside the old one, migrate callers gradually, then remove the old method', 'Make the parameters optional at once, so that any caller works with either shape'],
        answer: 3,
        explanation: 'Parallel change keeps both versions alive while callers move, so every commit is a working system. A single giant commit is hard to review and revert, and doing nothing leaves the mess in place.',
      },
    ],
    task: {
      title: 'Refactor the small shop, then plan the big one',
      steps: [
        'Run the original `Shop` with the five tests and confirm five PASS lines. Then apply steps 1, 2 and 3 in order, running the tests after each, and keep the three outputs.',
        'Deliberately make the first attempt of step 2 (without the `??`) and read the failing line. Write one sentence on what the test protected you from.',
        'Copy the tangled shop of the guided project, run it, and keep the ten output lines.',
        'Without changing the code, list five smells you can see and, for each, the refactoring you would try first.',
      ],
      minutes: 20,
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['For the tangled shop, underline in the code, with two colours, every place that finds a product and every place that works out a fee. Count how many times each appears, then say which refactoring removes the repetition.'] },
      { audience: { min: 'advanced' }, steps: ['Plan the move of `Shop.quote` to take a `Product` object instead of kind, price and quantity, using parallel change: write the steps in order so that the old signature keeps working until every caller has moved, and say which test you would add first.'] },
    ],
  },
];

export const project: Project | null = {
  id: 'object-oriented-programming-p10',
  title: 'Refactor a poorly structured application',
  summary: 'Take the tangled shop script from Lesson 63 (a god class, duplicated logic, a four-level product tree and no tests), pin down its behaviour with tests, then split it into small classes in small, tested steps and explain every step.',
  outcome: 'A set of tests, a log of small named refactorings and a cleaner program with identical behaviour, plus your own explanation, which shows you can improve existing code safely and justify each decision.',
  unlockAfterDay: 62,
  steps: [
    { id: 'object-oriented-programming-p10-s1', text: 'Copy the "tangled shop" starting code from the guided project section of Lesson 63 into any free JavaScript environment and run it. Save its exact output (ten lines). This is the behaviour you must keep.' },
    { id: 'object-oriented-programming-p10-s2', audience: { max: 'beginner' }, text: 'Scaffolded version: read the program once and write, in plain words, what each method of Shop does. Then limit yourself to three behaviours for your tests (a frozen product quote, a "not enough stock" order and the report) and to the first three refactorings of the plan table in Lesson 63.' },
    { id: 'object-oriented-programming-p10-s3', text: 'Without changing the code, list at least five problems you can see. For each, say what makes the code hard to change and which idea from this module names it: coupling, cohesion, a god object, deep inheritance, duplication, mixed concerns or missing tests.' },
    { id: 'object-oriented-programming-p10-s4', text: 'Write tests first. With the tiny assert helper from Lesson 62, write at least eight checks that describe what the unchanged code does today: a quote for each product kind, the 10 percent discount once a customer has 50 points, an order with not enough stock, an unknown product, the report numbers and the low-stock line. Run them: all must pass on the original code. The script prints from inside its methods, so test through the values the methods return and the shop\'s public fields, or replace console.log with a function that stores lines for the length of a test and put it back afterwards.' },
    { id: 'object-oriented-programming-p10-s5', text: 'Refactor in small steps (at least four, ideally six or more). Each step is one named change: extract method, extract class, move method, replace conditional with data or polymorphism, inject dependency or rename. Run all the tests after each step, keep them green, and write one line per step: what changed, the name of the refactoring, which smell it removes and whether the tests stayed green. A suggested order is in the plan table of Lesson 63; you may choose your own and should say why.' },
    { id: 'object-oriented-programming-p10-s6', audience: { min: 'intermediate' }, text: 'Replace the pattern "print a message and return 0" for an unknown product or too little stock with a failure design you choose: a custom error or a returned result. Explain why you chose it, update the tests (including the error paths and the state after a failure), and keep the visible output at the edge of the program the same.' },
    { id: 'object-oriented-programming-p10-s7', audience: { min: 'advanced' }, text: 'Make the shop receive its collaborators (the inventory, the loyalty book, the sales log and a printer) through its constructor, and write at least two tests that use a hand-written fake or stub so that a class is tested without the others. Say which direction each dependency points, and why.' },
    { id: 'object-oriented-programming-p10-s8', text: 'Run the original ten calls (the last lines of the starting code) against your refactored program and compare its output with the output you saved in step 1: it must be identical. Then write 200 to 350 words in your own words: which problem mattered most, which step was riskiest and how the tests protected you, one thing you chose not to change and why, and what you would do next.' },
    { id: 'object-oriented-programming-p10-s9', audience: { min: 'professional' }, text: 'Optional: ask an AI assistant to review your final design, asking for evidence from the code and not for praise. Include the prompt, say which suggestions you accepted and rejected and why, and show one run or test that backs each decision. You remain responsible for the design.' },
  ],
  submission: {
    kind: 'text',
    label: 'Your tests, step log, final code and explanation',
    placeholder: 'Paste: (1) your list of problems, (2) your tests, (3) your step log (one line per refactoring), (4) your final code, (5) the matching output, and (6) your explanation in your own words.',
    hint: 'A good submission shows tests that passed before any change, a log of small named steps with green tests after each, final code that prints the same output as the original, and an explanation of your decisions in your own words, not a copy of the lesson.',
  },
  rubric: [
    'Understanding of the problems: the real smells in the starting code are found and each is tied to the right idea (coupling, cohesion, god object, deep inheritance, duplication, mixed concerns, no tests).',
    'Tests first: the tests were written and passing on the unchanged code, and they cover normal use, edge values, refused input and the state after a refusal.',
    'Safe, small steps: every step is one named refactoring, the tests are run after it, behaviour is preserved, and the final output is identical to the original.',
    'Design decisions: the final classes are small and single-purpose, the ties between them are few and visible, inheritance is shallow, and one thing deliberately left alone is justified.',
    'The learner\'s own explanation: it says what changed and why in the learner\'s own words, names the riskiest step, and does not simply repeat the lesson.',
  ],
  rubricExtra: [
    { audience: { max: 'beginner' }, items: ['A smaller scope is fine: at least three refactorings, at least five tests, and an explanation that names each step in plain words.'] },
    { audience: { min: 'intermediate', max: 'intermediate' }, items: ['The failure design is justified (throw or return, and why), and the tests cover the error paths.'] },
    { audience: { min: 'advanced' }, items: ['Collaborators are injected and tested with fakes, dependency directions are explained, and there is a short note on how the same change would be rolled out safely in a codebase with many callers.'] },
    { audience: { min: 'professional' }, items: ['If AI was used: the prompts, what was accepted and rejected, and run or test evidence for each decision are included, with a clear statement that the learner owns the final design.'] },
  ],
};
