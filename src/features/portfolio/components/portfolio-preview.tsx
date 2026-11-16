import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Radius, Spacing } from '@/constants/theme';

import type { PortfolioPayload } from '../lib/build-portfolio';

export type PortfolioPreviewProps = {
  portfolio: PortfolioPayload;
  labels: { about: string; links: string; projects: string; certificates: string; verify: string; skills: string; badges: string };
};

/** The public page's content, in its order, so the learner sees exactly what goes public. */
export function PortfolioPreview({ portfolio, labels }: PortfolioPreviewProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.head}>
        {portfolio.photo !== '' && <Image source={{ uri: `data:image/jpeg;base64,${portfolio.photo}` }} style={styles.photo} contentFit="cover" accessibilityIgnoresInvertColors />}
        <ThemedText type="section" selectable>
          {portfolio.name}
        </ThemedText>
        {(portfolio.headline !== '' || portfolio.location !== '') && (
          <ThemedText type="body" themeColor="textSecondary" selectable>
            {[portfolio.headline, portfolio.location].filter(Boolean).join(' · ')}
          </ThemedText>
        )}
      </View>
      {portfolio.about !== '' && (
        <Block title={labels.about}>
          <ThemedText type="body" selectable>
            {portfolio.about}
          </ThemedText>
        </Block>
      )}
      {portfolio.links.length > 0 && (
        <Block title={labels.links}>
          {portfolio.links.map((link) => (
            <ThemedText key={link.label} type="secondary" themeColor="primaryText" selectable numberOfLines={1}>
              {`${link.label}: ${link.url}`}
            </ThemedText>
          ))}
        </Block>
      )}
      {portfolio.projects.length > 0 && (
        <Block title={labels.projects}>
          {portfolio.projects.map((project, index) => (
            <View key={`${project.title}-${index}`} style={styles.entry}>
              {project.images.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shots}>
                  {project.images.map((image, shot) => (
                    <Image key={shot} source={{ uri: `data:image/jpeg;base64,${image}` }} style={styles.shot} contentFit="cover" contentPosition="top" accessibilityIgnoresInvertColors />
                  ))}
                </ScrollView>
              )}
              <ThemedText type="bodySemiBold">{project.title}</ThemedText>
              {(project.role !== '' || project.course !== '') && (
                <ThemedText type="secondary" themeColor="textSecondary">
                  {[project.role, project.course].filter(Boolean).join(' · ')}
                </ThemedText>
              )}
              {(project.description || project.summary) !== '' && <ThemedText type="secondary">{project.description || project.summary}</ThemedText>}
              {project.tech.length > 0 && (
                <ThemedText type="caption" themeColor="primaryText">
                  {project.tech.join(' · ')}
                </ThemedText>
              )}
              {project.url !== '' && (
                <ThemedText type="secondary" themeColor="primaryText" selectable numberOfLines={1}>
                  {project.url}
                </ThemedText>
              )}
              {project.repoUrl !== '' && (
                <ThemedText type="secondary" themeColor="primaryText" selectable numberOfLines={1}>
                  {project.repoUrl}
                </ThemedText>
              )}
            </View>
          ))}
        </Block>
      )}
      {portfolio.certificates.length > 0 && (
        <Block title={labels.certificates}>
          {portfolio.certificates.map((certificate) => (
            <View key={certificate.title} style={styles.entry}>
              <ThemedText type="bodySemiBold">{[certificate.title, certificate.issued].filter(Boolean).join(' · ')}</ThemedText>
              {certificate.url !== '' && (
                <ThemedText type="secondary" themeColor="primaryText" selectable numberOfLines={1}>
                  {`${labels.verify}: ${certificate.url}`}
                </ThemedText>
              )}
            </View>
          ))}
        </Block>
      )}
      {portfolio.skills.length > 0 && (
        <Block title={labels.skills}>
          <ThemedText type="body">{portfolio.skills.join(' · ')}</ThemedText>
        </Block>
      )}
      {portfolio.badges.length > 0 && (
        <Block title={labels.badges}>
          <ThemedText type="body">{portfolio.badges.join(' · ')}</ThemedText>
        </Block>
      )}
    </Card>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.block}>
      <ThemedText type="caption" themeColor="textSecondary" style={styles.heading} accessibilityRole="header">
        {title}
      </ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
  },
  head: {
    gap: Spacing.one,
  },
  photo: {
    width: 72,
    height: 72,
    borderRadius: Radius.pill,
    marginBottom: Spacing.one,
  },
  block: {
    gap: Spacing.one,
  },
  heading: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  entry: {
    gap: Spacing.half,
    marginTop: Spacing.two,
  },
  shots: {
    gap: Spacing.two,
    paddingBottom: Spacing.one,
  },
  shot: {
    width: 150,
    aspectRatio: 16 / 10,
    borderRadius: Radius.small,
    borderCurve: 'continuous',
  },
});
