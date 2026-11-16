import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { tapFeedback } from '@/lib/haptics';

import { PayloadBox } from '../../diagrams';
import { VisualFrame } from '../../components/visual-frame';
import type { VisualProps } from '../../types';
import { createStore, handleRequest, METHODS, requestLines, responseLines, SAMPLE_USERS, statusClass, USERS_SPEC, type ApiRequest, type ApiResult, type ChangeKind, type HttpMethod } from '../lib/http';
import { webStrings } from '../strings';

const PATHS = ['/users', '/users/2', '/users/99', '/orders'] as const;
type BodyKind = 'name' | 'empty';

type Sent = { request: ApiRequest; result: ApiResult };

/** Pick a method and a path, send it to a tiny in-memory users API and read the real response and what changed. */
export function HttpExplorerVisual({ compact }: VisualProps) {
  const s = useLocalized(webStrings).http;
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [path, setPath] = useState<string>('/users/2');
  const [bodyKind, setBodyKind] = useState<BodyKind>('name');
  const [store, setStore] = useState(() => createStore(USERS_SPEC, SAMPLE_USERS));
  const [sent, setSent] = useState<Sent | null>(null);
  const hasBody = method === 'POST' || method === 'PUT' || method === 'PATCH';

  const send = () => {
    tapFeedback();
    const request: ApiRequest = { method, path, body: hasBody ? (bodyKind === 'name' ? { name: 'Zoe' } : {}) : null };
    const result = handleRequest(store, request);
    setStore(result.store);
    setSent({ request, result });
  };
  const reset = () => {
    setStore(createStore(USERS_SPEC, SAMPLE_USERS));
    setSent(null);
  };

  const describeChange = (change: ChangeKind, id: number | null) => (change === 'none' || id === null ? s.changes.none : s.changes[change](id));
  const response = sent?.result.response;
  const caption = sent && response
    ? [s.caption(sent.request.method, sent.request.path, response.status, response.statusText), describeChange(sent.result.change, sent.result.affectedId), s.statusNotes[response.status] ?? s.classNotes[statusClass(response.status)]].join(' ')
    : `${s.methodNotes[method]} ${s.noRequest}`;

  return (
    <VisualFrame
      title={s.title}
      description={s.description}
      compact={compact}
      caption={caption}
      controls={
        <View style={styles.controls}>
          <ChipSelect label={s.method} wrap value={method} onChange={setMethod} options={METHODS.map((value) => ({ value, label: value }))} />
          <ChipSelect label={s.path} wrap value={path} onChange={setPath} options={PATHS.map((value) => ({ value, label: value }))} />
          {hasBody && <ChipSelect label={s.body} wrap value={bodyKind} onChange={setBodyKind} options={[{ value: 'name', label: s.bodyOptions.name }, { value: 'empty', label: s.bodyOptions.empty }]} />}
          <View style={styles.buttons}>
            <Button title={s.send} icon="send" size="small" onPress={send} />
            <Button title={s.resetData} icon="refresh" size="small" variant="ghost" onPress={reset} />
          </View>
        </View>
      }>
      <View style={styles.stage}>
        <PayloadBox title={s.requestTitle} lines={requestLines({ method, path, body: hasBody ? (bodyKind === 'name' ? { name: 'Zoe' } : {}) : null })} />
        {response ? <PayloadBox title={`${s.responseTitle} · ${response.status} ${response.statusText}`} lines={responseLines(response)} tone={statusClass(response.status) === '2xx' ? 'ok' : 'danger'} /> : null}
        <PayloadBox title={s.dataTitle} lines={store.items.length > 0 ? store.items.map((item) => JSON.stringify(item)) : [s.emptyData]} tone="info" />
        <ThemedText type="caption" themeColor="textSecondary">
          {s.simplified}
        </ThemedText>
      </View>
    </VisualFrame>
  );
}

const styles = StyleSheet.create({
  controls: { gap: Spacing.three },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  stage: { gap: Spacing.two + 2 },
});
