import type { VisualDefinition } from '../types';
import { ApiRequestTraceVisual } from './components/api-request-trace';
import { AuthFlowVisual } from './components/auth-flow';
import { ClientServerVisual } from './components/client-server';
import { DatabaseJoinsVisual } from './components/database-joins';
import { FrontendBackendVisual } from './components/frontend-backend';
import { HttpExplorerVisual } from './components/http-explorer';
import { RestCrudVisual } from './components/rest-crud';
import { webStrings } from './strings';


/** Interactive visuals for web development. */
const build = (s: typeof webStrings.en): VisualDefinition[] => [
  {
    id: 'web-api-request-trace',
    title: s.apiTrace.title,
    category: 'web',
    summary: s.apiTrace.summary,
    description: s.apiTrace.description,
    topics: ['api', 'http request', 'request response', 'frontend backend', 'database', 'status code', 'rest', '404'],
    Component: ApiRequestTraceVisual,
  },
  {
    id: 'web-client-server',
    title: s.clientServer.title,
    category: 'web',
    summary: s.clientServer.summary,
    description: s.clientServer.description,
    topics: ['client server', 'browser', 'server', 'architecture', 'web basics', 'request response'],
    Component: ClientServerVisual,
  },
  {
    id: 'web-http-explorer',
    title: s.http.title,
    category: 'web',
    summary: s.http.summary,
    description: s.http.description,
    topics: ['http', 'get', 'post', 'put', 'patch', 'delete', 'status codes', '404', '201', 'methods'],
    Component: HttpExplorerVisual,
  },
  {
    id: 'web-rest-crud',
    title: s.crud.title,
    category: 'web',
    summary: s.crud.summary,
    description: s.crud.description,
    topics: ['rest', 'crud', 'api', 'create read update delete', 'http methods', 'to-do'],
    Component: RestCrudVisual,
  },
  {
    id: 'web-auth-flow',
    title: s.auth.title,
    category: 'web',
    summary: s.auth.summary,
    description: s.auth.description,
    topics: ['authentication', 'authorization', 'login', 'token', 'jwt', '401', '403', 'password hash', 'session'],
    Component: AuthFlowVisual,
  },
  {
    id: 'web-frontend-backend',
    title: s.where.title,
    category: 'web',
    summary: s.where.summary,
    description: s.where.description,
    topics: ['frontend', 'backend', 'full stack', 'what runs where', 'security', 'validation', 'secrets'],
    Component: FrontendBackendVisual,
  },
  {
    id: 'web-database-joins',
    title: s.db.title,
    category: 'web',
    summary: s.db.summary,
    description: s.db.description,
    topics: ['database', 'sql', 'join', 'primary key', 'foreign key', 'one to many', 'many to many', 'relationships', 'tables'],
    Component: DatabaseJoinsVisual,
  },
];

export const webVisuals = build(webStrings.en);
/** The same visuals with their titles, summaries and descriptions in Tagalog (the components read their own language). */
export const webVisualsFil = build(webStrings.fil);
