import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ListRow } from '@/components/ui/list-row';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { SettingsGroup } from '@/components/ui/settings-group';
import { ErrorState, LoadingState } from '@/components/ui/state-view';
import { useLocalized } from '@/hooks/use-strings';
import { formatDate, todayISO } from '@/lib/dates';
import { formatMoney } from '@/lib/money';

import { useCareer } from '../hooks/use-career';
import { incomeSummary, monthRange } from '../lib/overview';
import { careerStrings } from '../strings';

/** Freelance income: this month's total and clients, then every payment, newest first. */
export function IncomeScreen() {
  const strings = useLocalized(careerStrings);
  const career = useCareer();

  if (career.isError) return <ErrorState onRetry={() => void career.refetch()} />;
  if (!career.data) return <LoadingState />;

  const { income } = career.data;
  const month = monthRange(todayISO());
  const thisMonth = incomeSummary(income, month.from, month.to);
  const add = <Button title={strings.addIncome} icon="add" onPress={() => router.push('/career/income/new')} />;

  if (income.length === 0) {
    return (
      <Screen footer={add}>
        <EmptyState icon="payments" title={strings.noIncome} message={strings.noIncomeBody} />
      </Screen>
    );
  }

  return (
    <Screen footer={add}>
      <Card>
        <ThemedText type="caption" themeColor="textSecondary">
          {strings.incomeThisMonth}
        </ThemedText>
        <ThemedText type="stat" tabular selectable>
          {thisMonth.totals.length === 0 ? formatMoney(0, income[0].currency) : thisMonth.totals.map((total) => formatMoney(total.minor, total.currency)).join(' · ')}
        </ThemedText>
      </Card>

      {thisMonth.clients.length > 0 && (
        <Section title={strings.byClient}>
          <SettingsGroup>
            {thisMonth.clients.map((client) => (
              <ListRow
                key={`${client.client}|${client.currency}`}
                icon="handshake"
                tone="mint"
                title={client.client}
                subtitle={strings.clientPayments(client.count)}
                trailing={
                  <ThemedText type="bodySemiBold" tabular selectable>
                    {formatMoney(client.minor, client.currency)}
                  </ThemedText>
                }
              />
            ))}
          </SettingsGroup>
        </Section>
      )}

      <Section title={strings.entries}>
        <SettingsGroup>
          {income.map((entry) => (
            <ListRow
              key={entry.id}
              icon="payments"
              tone="mint"
              title={entry.client}
              subtitle={entry.note ? `${formatDate(entry.received_on)} · ${entry.note}` : formatDate(entry.received_on)}
              trailing={
                <ThemedText type="bodySemiBold" tabular>
                  {formatMoney(entry.amount_minor, entry.currency)}
                </ThemedText>
              }
              onPress={() => router.push({ pathname: '/career/income/[id]', params: { id: entry.id } })}
            />
          ))}
        </SettingsGroup>
      </Section>
    </Screen>
  );
}

