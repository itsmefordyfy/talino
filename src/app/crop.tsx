import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';

import { PhotoCropper } from '@/components/photo-cropper';
import { finishCrop, peekCropRequest } from '@/lib/crop-request';
import { closeScreen } from '@/lib/navigation';

const cancel = () => {
  finishCrop({ kind: 'cancelled' });
  closeScreen();
};

const fail = () => {
  finishCrop({ kind: 'failed' });
  closeScreen();
};

/** The crop screen (lib/crop-request): crops the photo a screen asked for and hands the answer back to it. */
export default function CropScreen() {
  const navigation = useNavigation();
  const [request] = useState(() => peekCropRequest());

  // Closed any other way (Android's back button) counts as a cancel; after Done this finds nothing waiting. The event comes after
  // the screen unmounts, so the listener is dropped a microtask later (React Navigation's own advice).
  useEffect(() => {
    const unsubscribe = navigation.addListener('removed', () => finishCrop({ kind: 'cancelled' }));
    return () => queueMicrotask(unsubscribe);
  }, [navigation]);

  // Opened without a photo (a reload mid-crop): nothing to do here.
  useEffect(() => {
    if (!request) closeScreen();
  }, [request]);
  if (!request) return null;

  return (
    <PhotoCropper
      uri={request.uri}
      aspect={request.aspect}
      shape={request.shape}
      onCancel={cancel}
      onFail={fail}
      onApply={(photo) => {
        finishCrop({ kind: 'cropped', photo });
        closeScreen();
      }}
    />
  );
}
