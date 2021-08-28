import Analytics from 'analytics';
import segmentPlugin from '@analytics/segment';
import { SEGMENT_KEY } from 'src/config';

export const analytics = Analytics({
  app: 'practice.dev',
  plugins: [
    SEGMENT_KEY != -1 &&
      segmentPlugin({
        writeKey: SEGMENT_KEY,
      }),
  ].filter(Boolean),
});
