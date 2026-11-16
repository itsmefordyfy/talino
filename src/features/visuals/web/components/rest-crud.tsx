import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Radius, Spacing } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

import { PayloadBox } from '../../diagrams';
import { VisualFrame } from '../../components/visual-frame';
import type { VisualProps } from '../../types';
import { createStore, handleRequest, SAMPLE_TASKS, TASKS_SPEC, type ApiRecord, type ApiRequest } from '../lib/http';
import { webStrings } from '../strings';

const MAX_TASKS = 8;
const LOG_LENGTH = 5;

type Entry = { line: string; status: number };

/** A to-do list that lives in memory: every button is one HTTP request to a tiny API, shown below the list. */
export function RestCrudVisual({ compact }: VisualProps) {
  const s = useLocalized(webStrings).crud;
  const [store, setStore] = useState(() => createStore(TASKS_SPEC, SAMPLE_TASKS));
  const [created, setCreated] = useState(0);
  const [log, setLog] = useState<Entry[]>([]);
  const [caption, setCaption] = useState<string>(s.captionIdle);

  const run = (request: ApiRequest) => {
    tapFeedback();
    const result = handleRequest(store, request);
    setStore(result.store);
    const { response } = result;
    const line = `${request.method} ${request.path} → ${response.status} ${response.statusText}`;
    setLog((previous) => [...previous.slice(-(LOG_LENGTH - 1)), { line, status: response.status }]);
    setCaption(s.caption(request.method, request.path, response.status, response.statusText));
    return result;
  };
  const create = () => {
    const title = s.suggestions[created % s.suggestions.length];
    const result = run({ method: 'POST', path: '/tasks', body: { title } });
    if (result.change === 'created') setCreated(created + 1);
  };
  const reset = () => {
    setStore(createStore(TASKS_SPEC, SAMPLE_TASKS));
    setLog([]);
    setCreated(0);
    setCaption(s.captionIdle);
  };

  return (
    <VisualFrame
      title={s.title}
      description={s.description}
      compact={compact}
      caption={caption}
      controls={
        <View style={styles.row}>
          <Button title={s.create} icon="add" size="small" disabled={store.items.length >= MAX_TASKS} onPress={create} />
          <Button title={s.readAll} icon="list" size="small" variant="secondary" onPress={() => run({ method: 'GET', path: '/tasks' })} />
          <Button title={s.reset} icon="refresh" size="small" variant="ghost" onPress={reset} />
        </View>
      }>
      <View style={styles.stage}>
        {store.items.length === 0 ? (
          <ThemedText type="secondary" themeColor="textSecondary">
            {s.empty}
          </ThemedText>
        ) : (
          store.items.map((item) => <TaskRow key={item.id} item={item} onRead={() => run({ method: 'GET', path: `/tasks/${item.id}` })} onToggle={() => run({ method: 'PATCH', path: `/tasks/${item.id}`, body: { done: item.done !== true } })} onDelete={() => run({ method: 'DELETE', path: `/tasks/${item.id}` })} />)
        )}
        <PayloadBox title={s.logTitle} lines={log.length > 0 ? log.map((entry) => entry.line) : [s.logEmpty]} tone={log.length > 0 && log[log.length - 1].status >= 400 ? 'danger' : 'info'} />
        <ThemedText type="caption" themeColor="textSecondary">
          {s.note}
        </ThemedText>
      </View>
    </VisualFrame>
  );
}

function TaskRow({ item, onRead, onToggle, onDelete }: { item: ApiRecord; onRead: () => void; onToggle: () => void; onDelete: () => void }) {
  const s = useLocalized(webStrings).crud;
  const theme = useTheme();
  const done = item.done === true;
  const title = String(item.title);
  return (
    <View accessible={false} style={[styles.item, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]}>
      <ThemedText type="bodySemiBold" accessibilityLabel={s.itemLabel(title, done)} style={done && styles.done}>
        {`${item.id}. ${title}`}
        <ThemedText type="caption" themeColor={done ? 'statusOk' : 'textSecondary'}>{`  ${done ? s.done : s.open}`}</ThemedText>
      </ThemedText>
      <View style={styles.row}>
        <Button title={s.read} size="small" variant="ghost" onPress={onRead} />
        <Button title={s.toggle} size="small" variant="secondary" onPress={onToggle} />
        <Button title={s.remove} size="small" variant="danger" onPress={onDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: Spacing.two },
  stage: { gap: Spacing.two },
  item: { gap: Spacing.one, padding: Spacing.two + 2, borderWidth: 1, borderRadius: Radius.medium, borderCurve: 'continuous' },
  done: { textDecorationLine: 'line-through' },
});
