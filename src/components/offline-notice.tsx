import type { StyleProp, ViewStyle } from 'react-native';

import { Notice } from '@/components/ui/notice';
import { useStrings } from '@/hooks/use-strings';

export type OfflineNoticeProps = {
  /** What needs the internet, e.g. "Tali" or "Project reviews"; the notice says the rest stays available. */
  feature: string;
  /** What the learner can do meanwhile, when it isn't the default "everything else works". */
  meanwhile?: string;
  style?: StyleProp<ViewStyle>;
};

/** The same calm "needs internet" message wherever a server feature is reached with no connection. */
export function OfflineNotice({ feature, meanwhile, style }: OfflineNoticeProps) {
  const { common } = useStrings();
  return <Notice tone="info" message={common.needsInternet(feature, meanwhile)} style={style} />;
}
