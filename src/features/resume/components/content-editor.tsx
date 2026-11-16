import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { FormSection } from '@/components/ui/form-section';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { ListRow } from '@/components/ui/list-row';
import { SettingsGroup } from '@/components/ui/settings-group';
import { TextField } from '@/components/ui/text-field';
import { MinTouchSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useLocalized } from '@/hooks/use-strings';
import { tapFeedback } from '@/lib/haptics';

import { builderStrings } from '../builder-strings';
import { entryId, formatRange, LIMITS, lineList, type DocEntry, type DocSection, type EntrySection, type ResumeContent, isEntrySection } from '../lib/document';
import { SECTION_HEADINGS } from '../lib/render';
import type { ResumeStyle } from '../lib/templates';
import { resumeStrings } from '../strings';
import { blankEntry, EntryEditor } from './entry-editor';
import { ResumeTextHelp } from './resume-text-help';

export type ContentEditorProps = {
  content: ResumeContent;
  style: ResumeStyle;
  onChange: (content: ResumeContent) => void;
  canImprove: boolean;
  onUpgrade: () => void;
};

type Editing = { section: EntrySection; id: string };

/** The Edit tab: every part of the résumé as plain text fields, in the order it prints. */
export function ContentEditor({ content, style, onChange, canImprove, onUpgrade }: ContentEditorProps) {
  const s = useLocalized(builderStrings);
  const r = useLocalized(resumeStrings);
  const [editing, setEditing] = useState<Editing | null>(null);
  const set = (patch: Partial<ResumeContent>) => onChange({ ...content, ...patch });

  if (editing) {
    const list = content[editing.section];
    const index = list.findIndex((entry) => entry.id === editing.id);
    const entry = list[index];
    if (entry) {
      const replace = (next: DocEntry[]) => set({ [editing.section]: next } as Partial<ResumeContent>);
      const move = (by: -1 | 1) => {
        const target = index + by;
        if (target < 0 || target >= list.length) return;
        const next = [...list];
        [next[index], next[target]] = [next[target], next[index]];
        replace(next);
      };
      return (
        <View style={styles.root}>
          <View style={styles.bar}>
            <Button title={s.edit.done} icon="check" size="small" onPress={() => setEditing(null)} />
            <View style={styles.flex} />
            <IconButton icon="keyboard_arrow_up" accessibilityLabel={s.edit.moveUp} disabled={index === 0} onPress={() => move(-1)} />
            <IconButton icon="keyboard_arrow_down" accessibilityLabel={s.edit.moveDown} disabled={index === list.length - 1} onPress={() => move(1)} />
            <IconButton
              icon="delete"
              accessibilityLabel={s.edit.removeEntry}
              onPress={() => {
                replace(list.filter((candidate) => candidate.id !== entry.id));
                setEditing(null);
              }}
            />
          </View>
          <EntryEditor key={entry.id} section={editing.section} entry={entry} onChange={(next) => replace(list.map((candidate) => (candidate.id === next.id ? next : candidate)))} canImprove={canImprove} onUpgrade={onUpgrade} />
        </View>
      );
    }
  }

  const addEntry = (section: EntrySection) => {
    tapFeedback();
    const entry = blankEntry(entryId);
    set({ [section]: [...content[section], entry] } as Partial<ResumeContent>);
    setEditing({ section, id: entry.id });
  };

  const sectionBody = (section: DocSection) => {
    if (section === 'summary') {
      return (
        <FormSection key={section} title={SECTION_HEADINGS.summary} footer={s.edit.summaryHint}>
          <TextField label={r.summaryLabel} placeholder={r.summaryPlaceholder} value={content.summary} onChangeText={(summary) => set({ summary })} multiline maxLength={LIMITS.summary} />
        </FormSection>
      );
    }
    if (section === 'skills') return <SkillsEditor key={section} skills={content.skills} onChange={(skills) => set({ skills })} />;
    if (section === 'achievements') return <AchievementsEditor key={section} lines={content.achievements} onChange={(achievements) => set({ achievements })} />;
    if (!isEntrySection(section)) return null;
    return (
      <SettingsGroup key={section} title={SECTION_HEADINGS[section]}>
        {content[section].map((entry) => (
          <ListRow
            key={entry.id}
            title={entry.title || s.edit.untitled}
            subtitle={[entry.organization, formatRange(entry)].filter(Boolean).join(' · ') || undefined}
            icon={ENTRY_ICONS[section]}
            onPress={() => setEditing({ section, id: entry.id })}
          />
        ))}
        {content[section].length < LIMITS.entries && <ListRow title={s.edit.add[section]} icon="add" onPress={() => addEntry(section)} />}
      </SettingsGroup>
    );
  };

  return (
    <View style={styles.root}>
      <FormSection title={s.edit.basics}>
        <TextField label={r.nameLabel} placeholder={r.namePlaceholder} value={content.name} onChangeText={(name) => set({ name })} autoCapitalize="words" textContentType="name" />
        <TextField label={r.headlineLabel} placeholder={r.headlinePlaceholder} value={content.headline} onChangeText={(headline) => set({ headline })} />
        <TextField label={r.emailLabel} placeholder={r.emailPlaceholder} value={content.email} onChangeText={(email) => set({ email })} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
        <TextField label={r.phoneLabel} placeholder={r.phonePlaceholder} value={content.phone} onChangeText={(phone) => set({ phone })} keyboardType="phone-pad" />
        <TextField label={r.locationLabel} placeholder={r.locationPlaceholder} value={content.location} onChangeText={(location) => set({ location })} autoCapitalize="words" />
      </FormSection>
      <FormSection title={r.linksSection}>
        <TextField label={r.websiteLabel} placeholder={r.websitePlaceholder} value={content.website} onChangeText={(website) => set({ website })} keyboardType="url" autoCapitalize="none" autoCorrect={false} />
        <TextField label={r.linkedinLabel} placeholder={r.linkedinPlaceholder} value={content.linkedin} onChangeText={(linkedin) => set({ linkedin })} keyboardType="url" autoCapitalize="none" autoCorrect={false} />
        <TextField label={r.githubLabel} placeholder={r.githubPlaceholder} value={content.github} onChangeText={(github) => set({ github })} keyboardType="url" autoCapitalize="none" autoCorrect={false} />
      </FormSection>
      {canImprove && <ResumeTextHelp content={content} onChange={onChange} />}
      {style.order.map((section) => sectionBody(section))}
    </View>
  );
}

const ENTRY_ICONS = { experience: 'work', projects: 'deployed_code', education: 'school', certifications: 'verified' } as const satisfies Record<EntrySection, string>;

function SkillsEditor({ skills, onChange }: { skills: string[]; onChange: (skills: string[]) => void }) {
  const s = useLocalized(builderStrings);
  const theme = useTheme();
  const [draft, setDraft] = useState('');

  const add = () => {
    // "React, SQL, Figma" adds three; repeats are ignored.
    const next = lineList([...skills, ...draft.split(/[,\n]/)], LIMITS.skills, 60);
    if (next.length > skills.length) tapFeedback();
    onChange(next);
    setDraft('');
  };

  return (
    <FormSection title={SECTION_HEADINGS.skills} footer={s.edit.skillsHint}>
      {skills.length > 0 && (
        <View style={styles.chips}>
          {skills.map((skill) => (
            <Pressable
              key={skill}
              accessibilityRole="button"
              accessibilityLabel={s.edit.removeSkill(skill)}
              onPress={() => onChange(skills.filter((candidate) => candidate !== skill))}
              style={[styles.chip, { backgroundColor: theme.backgroundSelected, borderColor: theme.border }]}>
              <ThemedText type="secondarySemiBold" numberOfLines={1}>
                {skill}
              </ThemedText>
              <Icon name="close" size={14} color="textSecondary" />
            </Pressable>
          ))}
        </View>
      )}
      <TextField label={s.edit.addSkill} placeholder={s.edit.skillPlaceholder} value={draft} onChangeText={setDraft} onSubmitEditing={add} returnKeyType="done" autoCapitalize="words" />
      <Button title={s.edit.addSkillButton} icon="add" variant="secondary" disabled={draft.trim() === ''} onPress={add} />
    </FormSection>
  );
}

function AchievementsEditor({ lines, onChange }: { lines: string[]; onChange: (lines: string[]) => void }) {
  const s = useLocalized(builderStrings);
  // Blank lines are kept while typing here and dropped by the résumé's own reading of its text.
  return (
    <FormSection title={SECTION_HEADINGS.achievements} footer={s.edit.achievementsHint}>
      {lines.map((line, index) => (
        <View key={index} style={styles.achievement}>
          <TextField style={styles.flex} label={s.edit.achievement} labelHidden value={line} onChangeText={(text) => onChange(lines.map((candidate, at) => (at === index ? text : candidate)))} multiline maxLength={LIMITS.bullet} />
          <IconButton icon="delete" accessibilityLabel={s.edit.removeAchievement} onPress={() => onChange(lines.filter((_, at) => at !== index))} />
        </View>
      ))}
      {lines.length < LIMITS.achievements && <Button title={s.edit.add.achievements} icon="add" variant="secondary" onPress={() => onChange([...lines, ''])} />}
    </FormSection>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.four,
  },
  flex: {
    flex: 1,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    minHeight: MinTouchSize,
    borderRadius: Radius.pill,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
});
