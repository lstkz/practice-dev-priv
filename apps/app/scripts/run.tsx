import cp from 'child_process';
import Path from 'path';
import { AppConfig } from 'config/types';

export function runScript(
  config: AppConfig,
  cmd: string,
  nodeEnv: 'development' | 'production'
) {
  const p = cp.spawn(cmd, {
    shell: true,
    cwd: Path.join(__dirname, '..'),
    stdio: 'inherit' as const,
    env: {
      ...process.env,
      NODE_ENV: nodeEnv,
      ASSET_PREFIX: config.web.useCDN ? '/cdn/' : undefined,
      PD_PUBLIC_MIXPANEL_API_KEY: config.mixpanel.apiKey.toString(),
      PD_PUBLIC_BUGSNAG_API_KEY: config.bugsnag.frontKey.toString(),
      PD_PUBLIC_GITHUB_CLIENT_ID: config.github.clientId,
      PD_PUBLIC_GOOGLE_CLIENT_ID: config.google.clientId,
      PD_PUBLIC_API_URL: config.apiBaseUrl,
      PD_PUBLIC_PROTECTED_BASE_URL: config.apiBaseUrl,
      PD_PUBLIC_CDN_BASE_URL: config.cdnBaseUrl,
      PD_PUBLIC_IFRAME_ORIGIN: config.iframe.origin,
      PD_PUBLIC_SEGMENT_KEY: (config.segment?.key ?? -1).toString(),
    },
  });

  p.addListener('error', error => {
    console.error(error);
    process.exit(1);
  });

  p.addListener('exit', code => {
    process.exit(code ?? 0);
  });
}
