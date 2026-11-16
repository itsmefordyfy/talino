import { createContext, use, useState, type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

/**
 * The width of the area a screen is really drawn in, when it differs from the window's: an iPad's sidebar (the tab bar turned
 * into a sidebar) takes a column of the window, and Split View / Stage Manager windows are measured by the window already.
 * Null until measured, so callers fall back to the window's width for the first frame.
 */
export const ContentWidthContext = createContext<number | null>(null);

export function useContentWidth(): number | null {
  return use(ContentWidthContext);
}

export type ContentWidthProviderProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Told the width whenever it is measured (the screen that also needs it outside its own children). */
  onWidth?: (width: number) => void;
};

/** Measures its own width and hands it to everything inside (see `useContentWidth`). Fills its parent. */
export function ContentWidthProvider({ children, style, onWidth }: ContentWidthProviderProps) {
  const [width, setWidth] = useState<number | null>(null);
  return (
    <View
      style={[{ flex: 1 }, style]}
      onLayout={(event) => {
        const next = Math.round(event.nativeEvent.layout.width);
        setWidth((previous) => (previous === next ? previous : next));
        onWidth?.(next);
      }}>
      <ContentWidthContext value={width}>{children}</ContentWidthContext>
    </View>
  );
}
