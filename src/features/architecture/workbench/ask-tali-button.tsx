import { router } from 'expo-router';

import { Button } from '@/components/ui/button';
import { tapFeedback } from '@/lib/haptics';

export type AskTaliButtonProps = { title: string; prompt: string; disabled?: boolean };

/** Opens a Tali chat with the prompt ready in the message box (nothing is sent until the learner sends it), on the architecture coach focus. */
export function AskTaliButton({ title, prompt, disabled }: AskTaliButtonProps) {
  return (
    <Button
      size="small"
      variant="secondary"
      icon="forum"
      title={title}
      disabled={disabled}
      onPress={() => {
        tapFeedback();
        router.push({ pathname: '/tali', params: { prompt, focus: 'architecture' } });
      }}
    />
  );
}
