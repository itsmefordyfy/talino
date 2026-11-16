import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { FormActions } from '@/components/ui/form-actions';
import { FormSection } from '@/components/ui/form-section';
import { ListRow } from '@/components/ui/list-row';
import { Notice } from '@/components/ui/notice';
import { RemovableTags } from '@/components/ui/removable-tags';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Screen } from '@/components/ui/screen';
import { SettingsGroup } from '@/components/ui/settings-group';
import { ErrorState, LoadingState } from '@/components/ui/state-view';
import { TextField } from '@/components/ui/text-field';
import { Toggle } from '@/components/ui/toggle';
import { TaliSays } from '@/components/tali-says';
import { FeatureTones, Spacing } from '@/constants/theme';
import { useCoachIdentity } from '@/features/coach';
import { openPaywall, useAccess } from '@/features/store';
import { useLanguage, useLocalized } from '@/hooks/use-strings';
import { successFeedback, tapFeedback } from '@/lib/haptics';
import { newId } from '@/lib/id';
import { reportError } from '@/lib/monitoring';

import { aiErrorKey, requestGenerated, type AiErrorKey } from '../api/ai-client';
import { GenerationProgress } from '../components/generation-progress';
import type { ProfileInput } from '../api/resume-repo';
import { builderStrings } from '../builder-strings';
import { createStrings } from '../create-strings';
import { applyGenerated } from '../lib/ai';
import { ENTRY_SECTIONS, lineList, type ResumeContent } from '../lib/document';
import { holdNotes } from '../lib/pending-notes';
import { defaultStyle, isResumeLevel, recommendTemplate, RESUME_LEVELS, TEMPLATE_IDS, type ResumeLevel, type TemplateId } from '../lib/templates';
import { useCreateDocument, useMasterContent } from '../hooks/use-documents';
import { useDeleteItem, useSaveItem, useSaveProfile } from '../hooks/use-resume';
import { resumeStrings } from '../strings';
import type { ResumeItemKind } from '../types';

const STEPS = ['you', 'details', 'work', 'education', 'skills', 'projects', 'extras', 'target'] as const;
type Step = (typeof STEPS)[number];

const MIN_JOB_POST = 40;

/** What there has to be before there is anything to write from (the server's own rule). */
const hasFacts = (content: ResumeContent) => ENTRY_SECTIONS.some((section) => content[section].length > 0) || content.skills.length > 0 || content.summary !== '';

/** The guided builder: Tali asks one thing at a time, then writes the résumé from the answers (or you build it without AI). */
export function CreateScreen() {
  const r = useLocalized(resumeStrings);
  const master = useMasterContent();
  const [picked, setPicked] = useState<Step | null>(null);
  if (master.isPending) return <LoadingState />;
  if (master.isError || !master.content) return <ErrorState message={r.loadError} onRetry={master.refetch} />;
  // A returning learner with their details already in goes straight to the last step.
  const returning = !!master.content.name && hasFacts(master.content);
  return <Builder step={picked ?? (returning ? 'target' : 'you')} onStep={setPicked} master={{ ...master, content: master.content }} returning={returning} />;
}

type BuilderProps = {
  step: Step;
  onStep: (step: Step) => void;
  master: Omit<ReturnType<typeof useMasterContent>, 'content'> & { content: ResumeContent };
  returning: boolean;
};

function Builder({ step, onStep, master, returning }: BuilderProps) {
  const s = useLocalized(builderStrings);
  const access = useAccess();
  const index = STEPS.indexOf(step);
  const text = s.create.steps[step];
  const base = master.content;
  const items = master.sources.items;
  const [documentId] = useState(newId);

  const [level, setLevel] = useState<ResumeLevel | null>(master.level);
  const [goal, setGoal] = useState(master.goal);
  const [jobTitle, setJobTitle] = useState('');
  const [jobPost, setJobPost] = useState('');
  const [template, setTemplate] = useState<TemplateId | null>(null);
  const [tried, setTried] = useState(false);

  const saveProfile = useSaveProfile();
  const [saving, setSaving] = useState(false);

  const currentTemplate = template ?? recommendTemplate(level);

  const profileInput = (): ProfileInput => ({
    headline: master.sources.profile?.headline ?? '',
    email: master.sources.profile?.email ?? '',
    phone: master.sources.profile?.phone ?? '',
    location: master.sources.profile?.location ?? '',
    website: master.sources.profile?.website ?? '',
    linkedin: master.sources.profile?.linkedin ?? '',
    github: master.sources.profile?.github ?? '',
    summary: master.sources.profile?.summary ?? '',
    career_goal: goal.trim(),
    level: level ?? '',
  });

  const next = () => {
    tapFeedback();
    if (step !== 'you') return onStep(STEPS[index + 1]);
    // The first step keeps what was chosen, so the template and the AI know who they are writing for.
    setSaving(true);
    saveProfile.mutate(profileInput(), {
      onSuccess: () => onStep('details'),
      onError: (error) => reportError(error, 'career', { action: 'save-resume-goal' }),
      onSettled: () => setSaving(false),
    });
  };

  const itemsOf = (kind: ResumeItemKind) => items.filter((item) => item.kind === kind);
  const empty = {
    you: false,
    details: false,
    work: itemsOf('experience').length === 0,
    education: itemsOf('education').length === 0,
    skills: base.skills.length === 0,
    projects: itemsOf('project').length === 0,
    extras: itemsOf('certification').length + itemsOf('achievement').length === 0,
    target: false,
  }[step];

  const footer =
    step === 'target' ? undefined : (
      <FormActions>
        <Button title={empty && step !== 'you' ? s.create.skip : s.create.next} icon="arrow_forward" loading={saving} disabled={saving} onPress={next} />
        {index > 0 && <Button title={s.create.back} variant="secondary" disabled={saving} onPress={() => onStep(STEPS[index - 1])} />}
      </FormActions>
    );

  if (step === 'target') {
    return (
      <TargetStep
        documentId={documentId}
        base={base}
        level={level}
        goal={goal}
        jobTitle={jobTitle}
        onJobTitle={setJobTitle}
        jobPost={jobPost}
        onJobPost={setJobPost}
        template={currentTemplate}
        recommended={recommendTemplate(level)}
        onTemplate={setTemplate}
        allAccess={access.allAccess}
        tried={tried}
        onTried={() => setTried(true)}
        returning={returning}
        onReview={() => onStep('you')}
        onBack={() => onStep(returning ? 'you' : 'extras')}
      />
    );
  }

  return (
    <Screen footer={footer} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: s.create.title }} />
      <ProgressBar fraction={(index + 1) / STEPS.length} accessibilityLabel={s.create.progress(index + 1, STEPS.length)} />
      <ThemedText type="caption" themeColor="textSecondary">
        {s.create.progress(index + 1, STEPS.length)}
      </ThemedText>
      <TaliSays key={step} mood={text.mood} text={text.say} />
      {saveProfile.isError && <Notice tone="warning" message={s.create.saveFailed} />}

      {step === 'you' && (
        <>
          <FormSection title={s.create.levelTitle}>
            <ChipSelect
              wrap
              options={RESUME_LEVELS.map((value) => ({ value, label: s.levels[value] }))}
              value={level}
              onChange={(value) => setLevel(isResumeLevel(value) ? value : null)}
            />
          </FormSection>
          <FormSection title={s.create.goalTitle}>
            <TextField label={s.create.goalLabel} placeholder={s.create.goalPlaceholder} value={goal} onChangeText={setGoal} multiline maxLength={300} />
          </FormSection>
        </>
      )}

      {step === 'details' && <DetailsStep name={master.sources.name} base={base} />}

      {step === 'work' && <EntryStep kind="experience" />}
      {step === 'education' && <EntryStep kind="education" />}
      {step === 'projects' && <EntryStep kind="project" note={s.create.projectsNote} />}
      {step === 'skills' && <SkillsStep />}
      {step === 'extras' && (
        <>
          <EntryStep kind="certification" />
          <EntryStep kind="achievement" />
        </>
      )}
    </Screen>
  );
}

function DetailsStep({ name, base }: { name: string; base: ResumeContent }) {
  const s = useLocalized(builderStrings);
  const r = useLocalized(resumeStrings);
  const summary = [name, base.email, base.phone, base.location].filter(Boolean).join(' · ');
  const missing = name.trim() === '' || base.email === '';
  return (
    <>
      <SettingsGroup>
        <ListRow title={r.profileRow} subtitle={summary || s.create.detailsEmpty} icon="person" tone={FeatureTones.resume} titleLines={1} onPress={() => router.push('/resume/profile')} />
      </SettingsGroup>
      {missing && <Notice tone="info" message={s.create.detailsNeeded} />}
    </>
  );
}

/** One kind of entry: what the learner has, and a button to add another in the form they already know. */
function EntryStep({ kind, note }: { kind: ResumeItemKind; note?: string }) {
  const s = useLocalized(builderStrings);
  const r = useLocalized(resumeStrings);
  const master = useMasterContent();
  const items = master.sources.items.filter((item) => item.kind === kind);
  return (
    <View style={styles.gap}>
      <SettingsGroup title={r.kinds[kind]}>
        {items.map((item) => (
          <ListRow key={item.id} title={item.title} subtitle={item.organization ?? undefined} icon="check_circle" onPress={() => router.push({ pathname: '/resume/item/[id]', params: { id: item.id } })} />
        ))}
        <ListRow title={r.addKind[kind]} icon="add" onPress={() => router.push({ pathname: '/resume/item/new', params: { kind } })} />
      </SettingsGroup>
      {note && (
        <ThemedText type="caption" themeColor="textSecondary">
          {note}
        </ThemedText>
      )}
      {items.length === 0 && (
        <ThemedText type="caption" themeColor="textSecondary">
          {s.create.emptyHint[kind]}
        </ThemedText>
      )}
    </View>
  );
}

function SkillsStep() {
  const s = useLocalized(builderStrings);
  const master = useMasterContent();
  const save = useSaveItem();
  const remove = useDeleteItem();
  const [draft, setDraft] = useState('');
  const [duplicate, setDuplicate] = useState<string | null>(null);
  const skills = master.content?.skills ?? [];
  const own = master.sources.items.filter((item) => item.kind === 'skill');
  const known = (master.sources.achievements?.skills ?? []).length;
  const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();
  // Skills the learner typed can be taken away; the ones learned in Talino courses are added automatically and stay.
  const tags = skills.map((label) => ({ label, removable: own.some((item) => same(item.title, label)) }));

  /** Splits what was typed on commas and line breaks; a skill already on the list (any capitals) or typed twice is not added again. */
  const add = () => {
    const typed = lineList(draft.split(/[,\n]/), 20, 60);
    const fresh: string[] = [];
    let repeated: string | null = null;
    for (const skill of typed) {
      if (skills.some((have) => same(have, skill)) || fresh.some((have) => same(have, skill))) repeated ??= skill;
      else fresh.push(skill);
    }
    setDraft('');
    setDuplicate(repeated);
    if (fresh.length === 0) return;
    tapFeedback();
    for (const title of fresh) {
      save.mutate({ id: newId(), kind: 'skill', title, organization: '', startOn: null, endOn: null, description: '', location: '', link: '', datesText: null }, { onError: (error) => reportError(error, 'career', { action: 'add-skill' }) });
    }
  };

  const take = (label: string) => {
    tapFeedback();
    setDuplicate(null);
    for (const item of own.filter((entry) => same(entry.title, label))) remove.mutate(item.id, { onError: (error) => reportError(error, 'career', { action: 'remove-skill' }) });
  };

  return (
    <FormSection title={s.create.skillsTitle} footer={known > 0 ? s.create.skillsKnown(known) : undefined}>
      {tags.length > 0 && <RemovableTags tags={tags} onRemove={take} removeLabel={s.edit.removeSkill} />}
      <TextField label={s.create.skillsLabel} placeholder={s.edit.skillPlaceholder} value={draft} onChangeText={setDraft} onSubmitEditing={add} returnKeyType="done" autoCapitalize="words" error={duplicate ? s.create.skillDuplicate(duplicate) : null} />
      <Button title={s.edit.addSkillButton} icon="add" variant="secondary" disabled={draft.trim() === ''} onPress={add} />
    </FormSection>
  );
}

type TargetStepProps = {
  documentId: string;
  base: ResumeContent;
  level: ResumeLevel | null;
  goal: string;
  jobTitle: string;
  onJobTitle: (value: string) => void;
  jobPost: string;
  onJobPost: (value: string) => void;
  template: TemplateId;
  recommended: TemplateId;
  onTemplate: (template: TemplateId) => void;
  allAccess: boolean;
  tried: boolean;
  onTried: () => void;
  returning: boolean;
  onReview: () => void;
  onBack: () => void;
};

/** The last step: an optional job post, a template, and then Tali writes it (or it is made from the details as they are). */
function TargetStep(props: TargetStepProps) {
  const s = useLocalized(builderStrings);
  const language = useLanguage();
  const identity = useCoachIdentity();
  const create = useCreateDocument();
  const [phase, setPhase] = useState<'idle' | 'working'>('idle');
  const [error, setError] = useState<AiErrorKey | null>(null);
  const c = useLocalized(createStrings);
  // The job post is optional and tucked away: off unless the learner already started one (coming back to this step).
  const [tailor, setTailor] = useState(props.jobTitle.trim() !== '' || props.jobPost.trim() !== '');
  const { base } = props;
  const jobName = tailor ? props.jobTitle.trim() : '';
  const post = tailor ? props.jobPost.trim() : '';
  const shortPost = post !== '' && post.length < MIN_JOB_POST;
  const thin = !hasFacts(base);

  const finish = (content: ResumeContent, keywords: string[]) => {
    const style = defaultStyle(props.template);
    const title = jobName;
    create.mutate(
      {
        id: props.documentId,
        name: title ? s.create.docNameFor(title) : s.create.docName,
        style,
        content,
        target: title || post ? { jobTitle: title, jobDescription: post, keywords } : null,
      },
      {
        onSuccess: () => {
          successFeedback();
          router.replace({ pathname: '/resume/document/[id]', params: { id: props.documentId } });
        },
        onError: (caught) => {
          reportError(caught, 'career', { action: 'create-resume' });
          setError('unknown');
          setPhase('idle');
        },
      },
    );
  };

  const withoutAi = () => {
    props.onTried();
    if (shortPost || create.isPending || thin) return;
    setError(null);
    finish(base, []);
  };

  const withAi = async () => {
    props.onTried();
    if (shortPost || phase === 'working' || thin) return;
    setPhase('working');
    setError(null);
    try {
      const job = post ? { title: jobName, description: post } : null;
      const generated = await requestGenerated(identity, { requestId: newId(), content: base, goal: props.goal, level: props.level, job, language });
      // The wording is checked against the learner's own facts before it becomes the résumé.
      const result = applyGenerated(base, generated);
      holdNotes(props.documentId, { questions: result.questions, suggestedSkills: result.suggestedSkills, gaps: result.gaps });
      finish(result.content, result.keywords);
    } catch (caught) {
      const key = aiErrorKey(caught);
      if (key === 'unknown') reportError(caught, 'career', { action: 'generate-resume' });
      setError(key);
      setPhase('idle');
    }
  };

  if (phase === 'working' || create.isPending) return <GenerationProgress />;

  return (
    <Screen
      footer={
        <FormActions>
          {props.allAccess ? (
            <>
              <Button title={s.create.generate} icon="auto_awesome" disabled={thin} onPress={() => void withAi()} />
              {/* Back and the no-AI route share one row: two footer rows instead of three tall buttons. */}
              <View style={styles.pair}>
                <Button title={s.create.back} variant="secondary" style={styles.half} onPress={props.onBack} />
                <Button title={s.create.buildWithout} variant="secondary" style={styles.half} disabled={thin} onPress={withoutAi} />
              </View>
            </>
          ) : (
            <>
              <Button title={s.create.buildResume} icon="description" disabled={thin} onPress={withoutAi} />
              <Button title={s.create.back} variant="secondary" onPress={props.onBack} />
            </>
          )}
        </FormActions>
      }
      keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: s.create.title }} />
      <TaliSays mood={s.create.steps.target.mood} text={s.create.steps.target.say} />
      {props.returning && (
        <ListRow title={s.create.reviewDetails} subtitle={s.create.reviewDetailsBody} icon="edit" onPress={props.onReview} titleLines={1} />
      )}
      {thin && <Notice tone="warning" message={s.create.thin} />}
      {error && <Notice tone={error === 'offline' ? 'info' : 'warning'} message={s.errors[error]} />}

      <SettingsGroup>
        <ListRow title={c.tailorTitle} subtitle={c.tailorBody} icon="work" tone={FeatureTones.resume} titleLines={1} trailing={<Toggle value={tailor} onValueChange={setTailor} accessibilityLabel={c.tailorTitle} />} />
      </SettingsGroup>
      {tailor && (
        <FormSection title={s.create.jobTitleSection} footer={s.create.jobFooter}>
          <TextField label={s.create.jobTitleLabel} placeholder={s.create.jobTitlePlaceholder} value={props.jobTitle} onChangeText={props.onJobTitle} maxLength={120} autoCapitalize="words" />
          <TextField
            label={s.create.jobPostLabel}
            placeholder={s.create.jobPostPlaceholder}
            value={props.jobPost}
            onChangeText={props.onJobPost}
            multiline
            error={props.tried && shortPost ? s.create.jobPostTooShort : null}
          />
        </FormSection>
      )}

      <FormSection title={s.create.templateTitle} footer={props.template === props.recommended ? c.templateOther : c.recommendedFor(s.templates[props.recommended].name)}>
        <ChipSelect wrap options={TEMPLATE_IDS.map((id) => ({ value: id, label: s.templates[id].name }))} value={props.template} onChange={props.onTemplate} />
        <ThemedText type="secondary" themeColor="textSecondary">
          {s.templates[props.template].detail}
        </ThemedText>
      </FormSection>

      {!props.allAccess && <Notice tone="info" message={s.create.noAi} />}
      {!props.allAccess && <Button title={s.assistant.seeAllAccess} variant="secondary" onPress={() => void openPaywall('resume')} />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: {
    gap: Spacing.two,
  },
  pair: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  half: {
    flex: 1,
  },
});

