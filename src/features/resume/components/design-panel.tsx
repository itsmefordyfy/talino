import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { FormSection } from '@/components/ui/form-section';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { ListRow } from '@/components/ui/list-row';
import { OptionCard } from '@/components/ui/option-card';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { SettingsGroup } from '@/components/ui/settings-group';
import { TextField } from '@/components/ui/text-field';
import { Toggle } from '@/components/ui/toggle';
import { MinTouchSize, Spacing } from '@/constants/theme';
import { useLocalized, useStrings } from '@/hooks/use-strings';
import { useTheme } from '@/hooks/use-theme';
import { tapFeedback } from '@/lib/haptics';

import { builderStrings } from '../builder-strings';
import { photoStrings } from '../photo-strings';
import { SECTION_HEADINGS } from '../lib/render';
import { ACCENT_HEX, ACCENT_IDS, DENSITIES, FONT_IDS, moveSection, PAPERS, switchTemplate, TEMPLATE_IDS, toggleSection, type ResumeStyle } from '../lib/templates';

export type DesignPanelProps = {
  style: ResumeStyle;
  onStyle: (style: ResumeStyle) => void;
  name: string;
  onName: (name: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  busy: boolean;
  /** Whether the learner has a profile picture to put on this résumé (their own, or the one it already holds). */
  photoAvailable: boolean;
  onPhoto: (on: boolean) => void;
};

/** The Design tab: template, colour, font, spacing, paper, and which sections show and in what order. */
export function DesignPanel({ style, onStyle, name, onName, onDuplicate, onDelete, busy, photoAvailable, onPhoto }: DesignPanelProps) {
  const photoText = useLocalized(photoStrings);
  const s = useLocalized(builderStrings);
  const common = useStrings().common;
  const theme = useTheme();

  const confirmDelete = () =>
    Alert.alert(s.design.deleteConfirm, s.design.deleteConfirmBody, [
      { text: common.cancel, style: 'cancel' },
      { text: common.delete, style: 'destructive', onPress: onDelete },
    ]);

  return (
    <View style={styles.root}>
      <FormSection title={s.design.nameTitle}>
        <TextField label={s.design.nameLabel} value={name} onChangeText={onName} maxLength={60} />
      </FormSection>

      <FormSection title={s.design.templateTitle} footer={s.design.templateHint}>
        {TEMPLATE_IDS.map((id) => (
          <OptionCard
            key={id}
            title={s.templates[id].name}
            detail={s.templates[id].detail}
            selected={style.template === id}
            mode="single"
            onPress={() => {
              tapFeedback();
              onStyle(switchTemplate(style, id));
            }}
          />
        ))}
      </FormSection>

      <FormSection title={s.design.lookTitle}>
        <ThemedText type="secondarySemiBold" themeColor="textSecondary">
          {s.design.color}
        </ThemedText>
        <View style={styles.swatches} accessibilityRole="radiogroup">
          {ACCENT_IDS.map((id) => (
            <Pressable
              key={id}
              accessibilityRole="radio"
              accessibilityState={{ selected: style.accent === id }}
              accessibilityLabel={s.design.accents[id]}
              onPress={() => {
                tapFeedback();
                onStyle({ ...style, accent: id });
              }}
              style={[styles.swatch, { borderColor: style.accent === id ? theme.primary : theme.border }]}>
              <View style={[styles.dot, { backgroundColor: ACCENT_HEX[id] }]}>{style.accent === id && <Icon name="check" size={16} tint="#FFFFFF" />}</View>
            </Pressable>
          ))}
        </View>
        <SegmentedControl options={FONT_IDS.map((id) => ({ value: id, label: s.design.fonts[id] }))} value={style.font} onChange={(font) => onStyle({ ...style, font })} accessibilityLabel={s.design.font} />
        <SegmentedControl options={DENSITIES.map((id) => ({ value: id, label: s.design.densities[id] }))} value={style.density} onChange={(density) => onStyle({ ...style, density })} accessibilityLabel={s.design.spacing} />
        <SegmentedControl options={PAPERS.map((id) => ({ value: id, label: s.design.papers[id] }))} value={style.paper} onChange={(paper) => onStyle({ ...style, paper })} accessibilityLabel={s.design.paper} />
      </FormSection>

      <SettingsGroup title={photoText.docTitle} footer={photoAvailable ? photoText.docHint : photoText.docNone}>
        <ListRow
          title={photoText.docToggle}
          icon="account_circle"
          trailing={<Toggle value={style.photo === true && photoAvailable} onValueChange={onPhoto} disabled={!photoAvailable} accessibilityLabel={photoText.docToggle} />}
        />
      </SettingsGroup>

      <SettingsGroup title={s.design.sectionsTitle} footer={s.design.sectionsHint}>
        {style.order.map((section, index) => (
          <View key={section} style={[styles.sectionRow, { minHeight: MinTouchSize + Spacing.two }]}>
            <ThemedText type="body" style={[styles.flex, style.hidden.includes(section) && { color: theme.textTertiary }]}>
              {SECTION_HEADINGS[section]}
            </ThemedText>
            <IconButton icon="keyboard_arrow_up" accessibilityLabel={s.design.moveUp(SECTION_HEADINGS[section])} disabled={index === 0} onPress={() => onStyle(moveSection(style, section, -1))} />
            <IconButton icon="keyboard_arrow_down" accessibilityLabel={s.design.moveDown(SECTION_HEADINGS[section])} disabled={index === style.order.length - 1} onPress={() => onStyle(moveSection(style, section, 1))} />
            <Toggle value={!style.hidden.includes(section)} onValueChange={() => onStyle(toggleSection(style, section))} accessibilityLabel={s.design.showSection(SECTION_HEADINGS[section])} />
          </View>
        ))}
      </SettingsGroup>

      <View style={styles.actions}>
        <Button title={s.design.duplicate} icon="content_copy" variant="secondary" disabled={busy} onPress={onDuplicate} />
        <Button title={s.design.delete} icon="delete" variant="danger" disabled={busy} onPress={confirmDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.four,
  },
  flex: {
    flex: 1,
  },
  swatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  swatch: {
    width: MinTouchSize,
    height: MinTouchSize,
    borderRadius: MinTouchSize / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.four,
  },
  actions: {
    gap: Spacing.three,
  },
});
