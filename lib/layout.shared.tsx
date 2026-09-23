import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="brand">
          <img className="brand-logo brand-logo-light" src="/logo/innflow-black-full.svg" width="124" height="30" alt="Innflow" />
          <img className="brand-logo brand-logo-dark" src="/logo/innflow-white-full.svg" width="124" height="30" alt="Innflow" />
          <span className="brand-label">Docs</span>
        </span>
      ),
    },
    links: [{ text: 'Open Innflow', url: 'https://innflow.ai', external: true }],
  };
}
