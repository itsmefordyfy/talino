import { useRef, useState } from 'react';
import { StyleSheet, View, type HostInstance } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChipSelect } from '@/components/ui/chip-select';
import { FormSection } from '@/components/ui/form-section';
import { Notice } from '@/components/ui/notice';
import { Screen, type ScreenHandle } from '@/components/ui/screen';
import { ErrorState, LoadingState } from '@/components/ui/state-view';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { learnerNameChanged, selectLearnerName } from '@/features/settings/settings-slice';
import { useLocalized, useStrings } from '@/hooks/use-strings';
import { builderStrings } from '../builder-strings';
import { pickProfilePhoto } from '../api/pick-photo';
import { photoStrings } from '../photo-strings';
import { isResumeLevel, RESUME_LEVELS } from '../lib/templates';
import { successFeedback } from '@/lib/haptics';
import { reportError } from '@/lib/monitoring';
import { closeScreen } from '@/lib/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import type { ProfileInput } from '../api/resume-repo';
import { DraftLine } from '../components/draft-line';
import { ProfileHero } from '../components/profile-hero';
import { useMasterContent } from '../hooks/use-documents';
import { useProfilePhoto, useResumeProfile, useSaveProfile, useSaveProfilePhoto } from '../hooks/use-resume';
import { draftStrings } from '../draft-strings';
import { useDraftErrorText, useTaliDraft } from '../hooks/use-tali-draft';
import { profileCompleteness, type ProfileCheck } from '../lib/profile-completeness';
import { profileStrings } from '../profile-strings';
import { resumeStrings } from '../strings';
import type { ResumeProfile } from '../types';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The résumé's profile: the learner's name (kept in settings, shared with certificates) and the one profile row. */
export function ResumeProfileScreen() {
  const strings = useLocalized(resumeStrings);
  const profile = useResumeProfile();
  if (profile.isPending) return <LoadingState />;
  if (profile.isError) return <ErrorState message={strings.loadError} onRetry={() => void profile.refetch()} />;
  return <ProfileForm initial={profile.data ?? null} />;
}

function ProfileForm({ initial }: { initial: ResumeProfile | null }) {
  const strings = useLocalized(resumeStrings);
  const builder = useLocalized(builderStrings);
  const p = useLocalized(profileStrings);
  const common = useStrings().common;
  const dispatch = useAppDispatch();
  const savedName = useAppSelector(selectLearnerName);
  const save = useSaveProfile();
  const [name, setName] = useState(savedName);
  const [form, setForm] = useState<ProfileInput>({
    headline: initial?.headline ?? '',
    email: initial?.email ?? '',
    phone: initial?.phone ?? '',
    location: initial?.location ?? '',
    website: initial?.website ?? '',
    linkedin: initial?.linkedin ?? '',
    github: initial?.github ?? '',
    summary: initial?.summary ?? '',
    career_goal: initial?.career_goal ?? '',
    level: initial?.level ?? '',
  });
  const [tried, setTried] = useState(false);
  const photo = useProfilePhoto();
  const picker = usePhotoPicker();
  // "Next: add your city" scrolls to the section that holds it.
  const screen = useRef<ScreenHandle>(null);
  const sections = useRef<Record<Section, HostInstance | null>>({ about: null, contact: null, links: null });
  const goTo = (check: ProfileCheck) => screen.current?.reveal(sections.current[SECTION_OF[check]]);
  const set = (key: keyof ProfileInput) => (value: string) => setForm((current) => ({ ...current, [key]: value }));

  const emailInvalid = form.email.trim() !== '' && !EMAIL.test(form.email.trim());
  const progress = profileCompleteness({ name, headline: form.headline, summary: form.summary, email: form.email, location: form.location, website: form.website, linkedin: form.linkedin, github: form.github });

  const submit = () => {
    setTried(true);
    if (emailInvalid || save.isPending) return;
    save.mutate(form, {
      onSuccess: () => {
        if (name.trim() !== savedName) dispatch(learnerNameChanged(name));
        successFeedback();
        closeScreen();
      },
      onError: (error) => reportError(error, 'career', { action: 'save-resume-profile' }),
    });
  };

  return (
    <Screen ref={screen} footer={<Button title={save.isPending ? common.saving : common.save} loading={save.isPending} disabled={save.isPending} onPress={submit} />} keyboardShouldPersistTaps="handled">
      {save.isError && <Notice tone="warning" message={strings.saveFailed} />}
      <ProfileHero name={name} headline={form.headline} photo={photo.data ?? null} percent={progress.percent} next={progress.missing[0] ? p.next(p.missing[progress.missing[0]]) : p.allDone} label={p.complete(progress.percent)} onNext={progress.missing[0] ? () => goTo(progress.missing[0]) : undefined} busy={picker.busy} problem={picker.problem} onChoosePhoto={() => void picker.choose()} onRemovePhoto={picker.remove} />
      <View ref={(node) => { sections.current.about = node; }} style={styles.group}>
      <FormSection title={p.about} footer={p.aboutFooter}>
        <TextField label={strings.nameLabel} placeholder={strings.namePlaceholder} hint={strings.nameHint} value={name} onChangeText={setName} autoCapitalize="words" textContentType="name" />
        <TextField label={strings.headlineLabel} placeholder={strings.headlinePlaceholder} value={form.headline} onChangeText={set('headline')} maxLength={120} />
        <TextField label={strings.summaryLabel} placeholder={strings.summaryPlaceholder} hint={p.summaryCount(form.summary.length, 1200)} value={form.summary} onChangeText={set('summary')} multiline maxLength={1200} />
      </FormSection>
      {/* Under the fields it fills in, so a chosen draft lands right above the button that made it. */}
      <TaliHelp headline={form.headline} summary={form.summary} onHeadline={set('headline')} onSummary={set('summary')} />
      </View>
      <FormSection title={builder.create.goalTitle} footer={builder.create.goalFooter}>
        <ChipSelect
          wrap
          options={RESUME_LEVELS.map((value) => ({ value, label: builder.levels[value] }))}
          value={isResumeLevel(form.level) ? form.level : null}
          onChange={(value) => set('level')(value)}
        />
        <TextField label={builder.create.goalLabel} placeholder={builder.create.goalPlaceholder} value={form.career_goal} onChangeText={set('career_goal')} multiline maxLength={300} />
      </FormSection>
      <View ref={(node) => { sections.current.contact = node; }}>
      <FormSection title={strings.contactSection} footer={p.contactFooter}>
        <TextField
          label={strings.emailLabel}
          placeholder={strings.emailPlaceholder}
          value={form.email}
          onChangeText={set('email')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
          error={tried && emailInvalid ? strings.emailInvalid : null}
        />
        <TextField label={strings.phoneLabel} placeholder={strings.phonePlaceholder} value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" textContentType="telephoneNumber" />
        <TextField label={strings.locationLabel} placeholder={strings.locationPlaceholder} value={form.location} onChangeText={set('location')} autoCapitalize="words" />
      </FormSection>
      </View>
      <View ref={(node) => { sections.current.links = node; }}>
      <FormSection title={strings.linksSection} footer={p.linksFooter}>
        <TextField label={strings.websiteLabel} placeholder={strings.websitePlaceholder} value={form.website} onChangeText={set('website')} keyboardType="url" autoCapitalize="none" autoCorrect={false} />
        <TextField label={strings.linkedinLabel} placeholder={strings.linkedinPlaceholder} value={form.linkedin} onChangeText={set('linkedin')} keyboardType="url" autoCapitalize="none" autoCorrect={false} />
        <TextField label={strings.githubLabel} placeholder={strings.githubPlaceholder} value={form.github} onChangeText={set('github')} keyboardType="url" autoCapitalize="none" autoCorrect={false} />
      </FormSection>
      </View>
    </Screen>
  );
}

/** The sections "Next:" can scroll to, and which one holds each thing a profile can still be missing. */
type Section = 'about' | 'contact' | 'links';
const SECTION_OF: Record<ProfileCheck, Section> = { name: 'about', headline: 'about', summary: 'about', email: 'contact', location: 'contact', links: 'links' };

/** Picks, saves and removes the profile picture. It saves at once, apart from the form's Save, so a chosen picture is never lost; it is cropped square and shrunk on the phone. */
function usePhotoPicker() {
  const text = useLocalized(photoStrings);
  const save = useSaveProfilePhoto();
  const [problem, setProblem] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const busy = picking || save.isPending;

  const choose = async () => {
    if (busy) return;
    setProblem(null);
    setPicking(true);
    try {
      const picked = await pickProfilePhoto();
      if (picked.kind === 'photo') {
        save.mutate(picked.base64, {
          onSuccess: successFeedback,
          onError: (error) => {
            setProblem(text.saveFailed);
            reportError(error, 'career', { action: 'save-profile-photo' });
          },
        });
      } else if (picked.kind === 'too_big') setProblem(text.tooBig);
      else if (picked.kind === 'unavailable') setProblem(text.unavailable);
      else if (picked.kind === 'failed') setProblem(text.failed);
    } finally {
      setPicking(false);
    }
  };
  const remove = () => {
    setProblem(null);
    save.mutate(null, { onError: (error) => reportError(error, 'career', { action: 'remove-profile-photo' }) });
  };
  return { busy, problem, choose, remove };
}

type TaliHelpProps = { headline: string; summary: string; onHeadline: (value: string) => void; onSummary: (value: string) => void };

/** Tali (or Tala) drafts the headline and summary; nothing changes until the learner taps Use on a line. */
function TaliHelp({ headline, summary, onHeadline, onSummary }: TaliHelpProps) {
  const p = useLocalized(profileStrings);
  const errorText = useDraftErrorText();
  const d = useLocalized(draftStrings);
  const master = useMasterContent();
  const tali = useTaliDraft();
  const [used, setUsed] = useState<string[]>([]);
  const content = master.content;
  const hasFacts = !!content && (content.skills.length > 0 || content.experience.length + content.projects.length + content.education.length > 0);
  const working = tali.state.status === 'working';

  const use = (key: string, apply: () => void) => {
    apply();
    setUsed((current) => [...current, key]);
  };
  const ask = () => {
    setUsed([]);
    void tali.run({ headline, about: summary, projects: [], want: { headline: true, about: true, projectIds: [] } });
  };

  return (
    <Card style={styles.tali}>
      <ThemedText type="cardTitle">{p.taliTitle}</ThemedText>
      <ThemedText type="secondary" themeColor="textSecondary">
        {hasFacts ? p.taliBody : p.taliNeedFacts}
      </ThemedText>
      <Button title={working ? p.taliWorking : tali.state.status === 'done' || tali.state.status === 'failed' ? p.taliAgain : p.taliButton} icon="auto_awesome" variant={tali.state.status === 'idle' ? 'primary' : 'secondary'} loading={working} disabled={working || !hasFacts} onPress={ask} />
      {tali.state.status === 'failed' && <Notice tone={tali.state.error === 'offline' ? 'info' : 'warning'} message={errorText(tali.state.error)} />}
      {tali.state.status === 'done' && (
        <View style={styles.draft}>
          {tali.state.draft.headline !== '' && <DraftLine label={p.taliHeadline} text={tali.state.draft.headline} used={used.includes('headline')} useLabel={p.use} usedLabel={p.used} onUse={() => use('headline', () => onHeadline(tali.state.status === 'done' ? tali.state.draft.headline : ''))} />}
          {tali.state.draft.headlineOptions.map((option) => (
            <DraftLine key={option} label={d.headlineAlt} text={option} used={used.includes(`option:${option}`)} useLabel={p.use} usedLabel={p.used} onUse={() => use(`option:${option}`, () => onHeadline(option))} />
          ))}
          {tali.state.draft.about !== '' && <DraftLine label={p.taliSummary} text={tali.state.draft.about} used={used.includes('summary')} useLabel={p.use} usedLabel={p.used} onUse={() => use('summary', () => onSummary(tali.state.status === 'done' ? tali.state.draft.about : ''))} />}
          {tali.state.draft.questions.length > 0 && (
            <View style={styles.questions}>
              <ThemedText type="caption" themeColor="textSecondary" style={styles.caps}>
                {p.taliAsks}
              </ThemedText>
              {tali.state.draft.questions.map((question) => (
                <ThemedText key={question} type="secondary">{`• ${question}`}</ThemedText>
              ))}
            </View>
          )}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: Spacing.four,
  },
  tali: {
    gap: Spacing.two,
  },
  draft: {
    gap: Spacing.three,
    marginTop: Spacing.one,
  },
  questions: {
    gap: Spacing.half,
  },
  caps: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
