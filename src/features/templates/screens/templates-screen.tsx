import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ListRow } from '@/components/ui/list-row';
import { Screen } from '@/components/ui/screen';
import { Section } from '@/components/ui/section';
import { SettingsGroup } from '@/components/ui/settings-group';
import { FeatureTones } from '@/constants/theme';
import { useLocalized } from '@/hooks/use-strings';

import { TEMPLATE_GROUPS, templatesInGroup } from '../content';
import { templateStrings } from '../strings';

/** Every template, bundled with the app (no loading or empty state: the list is never empty), in groups: your profile, finding a job, working with clients. */
export function TemplatesScreen() {
  const strings = useLocalized(templateStrings);
  return (
    <Screen>
      <ThemedText type="body" themeColor="textSecondary">
        {strings.intro}
      </ThemedText>
      {TEMPLATE_GROUPS.map((group) => {
        const templates = templatesInGroup(group);
        return (
          <Section key={group} title={strings.groups[group]} actionLabel={strings.count(templates.length)}>
            <SettingsGroup>
              {templates.map((template) => (
                <ListRow
                  key={template.id}
                  title={template.title}
                  subtitle={template.description}
                  icon={template.icon}
                  tone={template.coachMode === 'freelancing' ? FeatureTones.career : FeatureTones.resume}
                  onPress={() => router.push({ pathname: '/templates/[id]', params: { id: template.id } })}
                />
              ))}
            </SettingsGroup>
          </Section>
        );
      })}
    </Screen>
  );
}
