import { Image } from 'expo-image';
import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Share, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { FormActions } from '@/components/ui/form-actions';
import { ListRow } from '@/components/ui/list-row';
import { OfflineNotice } from '@/components/offline-notice';
import { Notice, type NoticeTone } from '@/components/ui/notice';
import { Screen } from '@/components/ui/screen';
import { SettingsGroup } from '@/components/ui/settings-group';
import { ErrorState, LoadingState } from '@/components/ui/state-view';
import { TextField } from '@/components/ui/text-field';
import { Toggle } from '@/components/ui/toggle';
import { FeatureTones, Radius, Spacing } from '@/constants/theme';
import { photoStrings, useProfilePhoto, type ResumeProfile } from '@/features/resume';
import { learnerNameChanged, selectLearnerName } from '@/features/settings/settings-slice';
import { useIsOnline } from '@/hooks/use-is-online';
import { useLocalized, useStrings } from '@/hooks/use-strings';
import { copyText } from '@/lib/clipboard';
import { formatDate } from '@/lib/dates';
import { successFeedback } from '@/lib/haptics';
import { reportError } from '@/lib/monitoring';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { portfolioError, publishPortfolio, removePortfolio } from '../api/client';
import type { PortfolioState } from '../api/portfolio-state';
import { PortfolioPreview } from '../components/portfolio-preview';
import { TaliPageHelp } from '../components/tali-page-help';
import { TaliPortfolioReview } from '../components/tali-portfolio-review';
import { useProjects } from '../hooks/use-projects';
import { MAX_PROJECTS } from '../lib/projects';
import { projectStrings } from '../project-strings';
import { portfolioUrl, usePortfolioOptions, useSavePortfolioOptions, useClearPortfolioState, usePortfolioPreview, usePortfolioState, useSavePortfolioState } from '../hooks/use-portfolio';
import { hasPortfolioContent, type PortfolioPayload } from '../lib/build-portfolio';
import { portfolioStrings } from '../strings';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The public portfolio: a preview of exactly what goes public, publish/update/remove, and the talent list opt-in. */
export function PortfolioScreen() {
  const strings = useLocalized(portfolioStrings);
  const name = useAppSelector(selectLearnerName);
  const preview = usePortfolioPreview();
  const state = usePortfolioState();

  if (name.trim().length < 2) return <NameForm />;
  if (preview.isPending || state.isPending) return <LoadingState />;
  if (preview.isError || state.isError || !preview.portfolio) {
    return (
      <ErrorState
        message={strings.loadError}
        onRetry={() => {
          preview.refetch();
          void state.refetch();
        }}
      />
    );
  }
  return <PortfolioContent portfolio={preview.portfolio} profile={preview.profile} state={state.data ?? null} />;
}

function NameForm() {
  const strings = useLocalized(portfolioStrings);
  const dispatch = useAppDispatch();
  const [draft, setDraft] = useState('');
  return (
    <Screen footer={<Button title={strings.saveName} onPress={() => dispatch(learnerNameChanged(draft))} disabled={draft.trim().length < 2} />} keyboardShouldPersistTaps="handled">
      <Notice tone="info" message={strings.nameNeeded} />
      <TextField label={strings.nameLabel} value={draft} onChangeText={setDraft} placeholder={strings.namePlaceholder} autoCapitalize="words" textContentType="name" />
    </Screen>
  );
}

type PortfolioContentProps = {
  portfolio: PortfolioPayload;
  profile: ResumeProfile | null;
  state: PortfolioState | null;
};

function PortfolioContent({ portfolio, profile, state }: PortfolioContentProps) {
  const strings = useLocalized(portfolioStrings);
  const common = useStrings().common;
  const saveState = useSavePortfolioState();
  const clearState = useClearPortfolioState();
  // Off by default; a published page keeps what was chosen last time.
  const [talent, setTalent] = useState(state?.talent ?? false);
  const [contact, setContact] = useState(state?.contactEmail || profile?.email || '');
  const [tried, setTried] = useState(false);
  const [busy, setBusy] = useState<'publish' | 'remove' | null>(null);
  const online = useIsOnline();
  const [notice, setNotice] = useState<{ tone: NoticeTone; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const url = portfolioUrl(state);
  const contactInvalid = talent && !EMAIL.test(contact.trim());
  const hasContent = hasPortfolioContent(portfolio);

  const fail = (error: unknown, step: string) => {
    const code = portfolioError(error);
    if (code === 'unknown') reportError(error, 'portfolio', { step });
    setNotice({ tone: code === 'offline' ? 'info' : 'warning', text: strings.errors[code] });
    return code;
  };

  const publish = async () => {
    setTried(true);
    if (contactInvalid || busy || !hasContent) return;
    setBusy('publish');
    setNotice(null);
    try {
      const contactEmail = talent ? contact.trim() : '';
      const result = await publishPortfolio({ slug: state?.slug ?? null, editToken: state?.editToken ?? null, portfolio, talent, contactEmail });
      const editToken = result.editToken ?? state?.editToken;
      if (!editToken) throw new Error('portfolio published without an edit token');
      await saveState.mutateAsync({ slug: result.slug, editToken, talent, contactEmail, publishedAt: new Date().toISOString() });
      successFeedback();
      setNotice({ tone: 'success', text: state ? strings.updated : strings.published });
    } catch (error) {
      fail(error, 'publish');
    } finally {
      setBusy(null);
    }
  };

  const remove = async () => {
    if (!state || busy) return;
    setBusy('remove');
    setNotice(null);
    try {
      await removePortfolio(state.slug, state.editToken);
      await clearState.mutateAsync();
      setTalent(false);
      setNotice({ tone: 'success', text: strings.removed });
    } catch (error) {
      // A key the server no longer accepts can never change that page: forget it here so a new one can be published.
      if (fail(error, 'remove') === 'forbidden') {
        await clearState.mutateAsync();
        setNotice({ tone: 'info', text: strings.forgotten });
      }
    } finally {
      setBusy(null);
    }
  };

  const confirmRemove = () =>
    Alert.alert(strings.removeConfirm, strings.removeConfirmBody, [
      { text: strings.remove, style: 'destructive', onPress: () => void remove() },
      { text: common.cancel, style: 'cancel' },
    ]);

  const copy = async () => {
    if (url && (await copyText(url))) setCopied(true);
  };

  const footer = (
    <FormActions>
      <Button title={busy === 'publish' ? strings.publishing : state ? strings.update : strings.publish} icon="public" loading={busy === 'publish'} disabled={busy !== null || !hasContent || !online} onPress={() => void publish()} />
      {state && <Button title={busy === 'remove' ? strings.removing : strings.remove} variant="danger" disabled={busy !== null || !online} onPress={confirmRemove} />}
    </FormActions>
  );

  return (
    <Screen footer={footer} keyboardShouldPersistTaps="handled">
      <ThemedText type="body" themeColor="textSecondary">
        {strings.intro}
      </ThemedText>
      {!online && <OfflineNotice feature={strings.publishFeature} meanwhile={strings.publishMeanwhile} />}

      <Card style={styles.status}>
        <ThemedText type="cardTitle">{state ? strings.live : strings.notPublished}</ThemedText>
        {state ? (
          <>
            {url ? (
              <ThemedText type="body" themeColor="primaryText" selectable>
                {url}
              </ThemedText>
            ) : (
              <ThemedText type="secondary" themeColor="textSecondary">
                {strings.liveNoLink}
              </ThemedText>
            )}
            {state.publishedAt !== '' && (
              <ThemedText type="secondary" themeColor="textSecondary">
                {strings.liveSince(formatDate(state.publishedAt.slice(0, 10)))}
              </ThemedText>
            )}
            {url && (
              <View style={styles.row}>
                <Button title={strings.view} icon="open_in_new" variant="secondary" size="small" style={styles.flex} onPress={() => void Linking.openURL(url).catch(() => setNotice({ tone: 'warning', text: strings.errors.unknown }))} />
                <Button title={copied ? strings.copied : strings.copyLink} icon="link" variant="secondary" size="small" style={styles.flex} onPress={() => void copy()} />
                <Button title={strings.share} icon="share" variant="secondary" size="small" style={styles.flex} onPress={() => void Share.share({ message: strings.shareMessage(url), url })} />
              </View>
            )}
          </>
        ) : (
          <ThemedText type="secondary" themeColor="textSecondary">
            {strings.notPublishedBody}
          </ThemedText>
        )}
      </Card>

      {notice && <Notice tone={notice.tone} message={notice.text} />}

      <ProjectsSection />
      <PhotoOption />
      <TaliPageHelpSection profile={profile} portfolio={portfolio} />

      <SettingsGroup title={strings.talentGroup} footer={strings.talentExplain}>
        <ListRow title={strings.talentToggle} icon="handshake" tone={FeatureTones.career} trailing={<Toggle value={talent} onValueChange={setTalent} accessibilityLabel={strings.talentToggle} />} />
      </SettingsGroup>
      {talent && (
        <TextField
          label={strings.contactLabel}
          placeholder={strings.contactPlaceholder}
          value={contact}
          onChangeText={setContact}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
          error={tried && contactInvalid ? strings.contactInvalid : null}
        />
      )}

      <ThemedText type="caption" themeColor="textSecondary" style={styles.heading} accessibilityRole="header">
        {strings.previewGroup}
      </ThemedText>
      {hasContent ? (
        <PortfolioPreview portfolio={portfolio} labels={strings} />
      ) : (
        <EmptyState icon="badge" title={strings.emptyTitle} message={strings.emptyBody} action={<Button title={strings.emptyAction} onPress={() => router.push('/resume/profile')} />} />
      )}
      {hasContent && (
        <SettingsGroup>
          <ListRow title={strings.editProfile} icon="edit" tone={FeatureTones.portfolio} onPress={() => router.push('/resume/profile')} />
        </SettingsGroup>
      )}
    </Screen>
  );
}

/** Whether the public page shows the learner's picture. Off until they turn it on; shown only once there is a picture to show. */
function PhotoOption() {
  const t = useLocalized(photoStrings);
  const photo = useProfilePhoto();
  const options = usePortfolioOptions();
  const save = useSavePortfolioOptions();
  if (photo.isPending || options.isPending) return null;
  const has = Boolean(photo.data);
  return (
    <SettingsGroup footer={has ? t.pageHint : t.pageNone}>
      <ListRow
        title={t.pageToggle}
        icon="account_circle"
        trailing={<Toggle value={has && options.data?.showPhoto === true} onValueChange={(on) => save.mutate({ showPhoto: on })} disabled={!has} accessibilityLabel={t.pageToggle} />}
      />
    </SettingsGroup>
  );
}

/** Tali's help with the page's words, once the projects have loaded. */
function TaliPageHelpSection({ profile, portfolio }: { profile: ResumeProfile | null; portfolio: PortfolioPayload }) {
  const projects = useProjects();
  if (projects.isPending) return null;
  return (
    <>
      <TaliPageHelp profile={profile} projects={projects.data ?? []} />
      <TaliPortfolioReview profile={profile} projects={projects.data ?? []} portfolio={portfolio} />
    </>
  );
}

/** The learner's own projects: the page's strongest part, so it sits right under the status. */
function ProjectsSection() {
  const strings = useLocalized(projectStrings);
  const projects = useProjects();
  const list = projects.data ?? [];
  const add = () => router.push('/portfolio/project/new' as Href);
  if (projects.isPending) return null;
  if (list.length === 0) {
    return (
      <Card style={styles.status}>
        <ThemedText type="cardTitle">{strings.emptyTitle}</ThemedText>
        <ThemedText type="secondary" themeColor="textSecondary">
          {strings.emptyBody}
        </ThemedText>
        <Button title={strings.addProject} icon="add_photo_alternate" onPress={add} />
      </Card>
    );
  }
  return (
    <SettingsGroup title={strings.listGroup} footer={list.length >= MAX_PROJECTS ? strings.full : strings.listFooter}>
      {list.map((project) => (
        <ListRow
          key={project.id}
          title={project.title}
          subtitle={[project.images.length > 0 ? strings.shotCount(project.images.length) : strings.noShots, project.tech.slice(0, 3).join(', ')].filter(Boolean).join(' · ')}
          leading={
            project.images.length > 0 ? (
              <Image source={{ uri: `data:image/jpeg;base64,${project.images[0]}` }} style={styles.thumb} contentFit="cover" contentPosition="top" accessibilityIgnoresInvertColors />
            ) : undefined
          }
          icon="folder_open"
          tone={FeatureTones.portfolio}
          onPress={() => router.push({ pathname: '/portfolio/project/[id]', params: { id: project.id } } as Href)}
        />
      ))}
      {list.length < MAX_PROJECTS && <ListRow title={strings.addProject} icon="add" tone={FeatureTones.portfolio} onPress={add} />}
    </SettingsGroup>
  );
}

const styles = StyleSheet.create({
  thumb: {
    width: 56,
    aspectRatio: 16 / 10,
    borderRadius: Radius.small,
    borderCurve: 'continuous',
  },
  status: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  flex: {
    flex: 1,
  },
  heading: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.three,
  },
});
