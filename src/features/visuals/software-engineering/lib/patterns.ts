import type { DiagramSpec } from '../../diagrams';

export const PATTERN_IDS = ['observer', 'factory', 'singleton'] as const;
export type PatternId = (typeof PATTERN_IDS)[number];

/* Observer ----------------------------------------------------------------- */

export const OBSERVERS = ['email', 'sms', 'dashboard'] as const;
export type ObserverId = (typeof OBSERVERS)[number];

/** The observers told about an event: exactly those subscribed, in the order they subscribed. */
export function notifyObservers(subscribed: readonly ObserverId[]): ObserverId[] {
  return [...subscribed];
}

export function toggleSubscription(subscribed: readonly ObserverId[], id: ObserverId): ObserverId[] {
  return subscribed.includes(id) ? subscribed.filter((item) => item !== id) : [...subscribed, id];
}

/* Factory ------------------------------------------------------------------ */

export const NOTIFIER_KINDS = ['email', 'sms', 'push'] as const;
export type NotifierKind = (typeof NOTIFIER_KINDS)[number];

export type Notifier = { type: 'EmailNotifier' | 'SmsNotifier' | 'PushNotifier'; send: (text: string) => string };

/** A simple factory: the caller names a kind, the factory decides which class to build. Unknown kinds are refused. */
export function createNotifier(kind: string): Notifier | null {
  switch (kind) {
    case 'email':
      return { type: 'EmailNotifier', send: (text) => `Email sent: ${text}` };
    case 'sms':
      return { type: 'SmsNotifier', send: (text) => `SMS sent: ${text}` };
    case 'push':
      return { type: 'PushNotifier', send: (text) => `Push sent: ${text}` };
    default:
      return null;
  }
}

/* Singleton ---------------------------------------------------------------- */

export type SingletonState = { instance: number | null; calls: number; created: number };

export const SINGLETON_START: SingletonState = { instance: null, calls: 0, created: 0 };

/** `getInstance()`: the first call builds the one object, every later call returns that same object. */
export function getInstance(state: SingletonState): { state: SingletonState; instance: number; wasCreated: boolean } {
  if (state.instance !== null) return { state: { ...state, calls: state.calls + 1 }, instance: state.instance, wasCreated: false };
  const instance = state.created + 1;
  return { state: { instance, calls: state.calls + 1, created: state.created + 1 }, instance, wasCreated: true };
}

/* Class diagrams (accurate, small) ----------------------------------------- */

export type PatternSpecStrings = { observer: { title: string; summary: string; notes: Record<string, string> }; factory: { title: string; summary: string; notes: Record<string, string> }; singleton: { title: string; summary: string; notes: Record<string, string> } };

export function patternSpec(id: PatternId, s: PatternSpecStrings): DiagramSpec {
  switch (id) {
    case 'observer':
      return {
        kind: 'class',
        title: s.observer.title,
        summary: s.observer.summary,
        classes: [
          { id: 'Subject', label: 'Subject', attributes: ['observers: Observer[]'], methods: ['attach(o: Observer)', 'detach(o: Observer)', 'notify()'], note: s.observer.notes.Subject },
          { id: 'Observer', label: 'Observer', stereotype: 'interface', methods: ['update(event)'], note: s.observer.notes.Observer },
          { id: 'EmailAlert', label: 'EmailAlert', methods: ['update(event)'], note: s.observer.notes.EmailAlert },
          { id: 'SmsAlert', label: 'SmsAlert', methods: ['update(event)'], note: s.observer.notes.SmsAlert },
        ],
        relations: [
          { from: 'Subject', to: 'Observer', type: 'aggregates', label: 'notifies' },
          { from: 'EmailAlert', to: 'Observer', type: 'implements' },
          { from: 'SmsAlert', to: 'Observer', type: 'implements' },
        ],
      };
    case 'factory':
      return {
        kind: 'class',
        title: s.factory.title,
        summary: s.factory.summary,
        classes: [
          { id: 'Client', label: 'Client', methods: ['run()'], note: s.factory.notes.Client },
          { id: 'NotifierFactory', label: 'NotifierFactory', methods: ['create(kind): Notifier'], note: s.factory.notes.NotifierFactory },
          { id: 'Notifier', label: 'Notifier', stereotype: 'interface', methods: ['send(text)'], note: s.factory.notes.Notifier },
          { id: 'EmailNotifier', label: 'EmailNotifier', methods: ['send(text)'], note: s.factory.notes.EmailNotifier },
          { id: 'SmsNotifier', label: 'SmsNotifier', methods: ['send(text)'], note: s.factory.notes.SmsNotifier },
        ],
        relations: [
          { from: 'Client', to: 'NotifierFactory', type: 'depends', label: 'asks' },
          { from: 'Client', to: 'Notifier', type: 'depends', label: 'uses' },
          { from: 'NotifierFactory', to: 'EmailNotifier', type: 'depends', label: 'creates' },
          { from: 'NotifierFactory', to: 'SmsNotifier', type: 'depends', label: 'creates' },
          { from: 'EmailNotifier', to: 'Notifier', type: 'implements' },
          { from: 'SmsNotifier', to: 'Notifier', type: 'implements' },
        ],
      };
    case 'singleton':
      return {
        kind: 'class',
        title: s.singleton.title,
        summary: s.singleton.summary,
        classes: [{ id: 'Config', label: 'Config', attributes: ['-instance: Config (static)'], methods: ['-Config()', '+getInstance(): Config (static)', '+get(key): string'], note: s.singleton.notes.Config }],
        relations: [],
      };
  }
}
