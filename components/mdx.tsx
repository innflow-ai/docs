import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Callout as FumaCallout } from 'fumadocs-ui/components/callout';
import { Steps, Step as FumaStep } from 'fumadocs-ui/components/steps';
import Link from 'next/link';
import type { MDXComponents } from 'mdx/types';
import type { ReactNode } from 'react';
function Card({ title, href, children }: { title: string; href?: string; children?: ReactNode; icon?: string }) { const content = <><span className="doc-card-title">{title}{href && <span aria-hidden="true">↗</span>}</span><div className="doc-card-body">{children}</div></>; return href ? <Link className="doc-card" href={href}>{content}</Link> : <section className="doc-card">{content}</section>; }
function Columns({ children, cols = 2 }: { children: ReactNode; cols?: number }) { return <div className="doc-columns" style={{ '--columns': cols } as React.CSSProperties}>{children}</div>; }
function Step({ title, children }: { title: string; children: ReactNode }) { return <FumaStep><h3>{title}</h3>{children}</FumaStep>; }
function Callout({ children, title, type }: { children: ReactNode; title?: string; type?: string; icon?: string }) { return <FumaCallout title={title} type={type === 'warning' || type === 'warn' ? 'warn' : type === 'error' ? 'error' : 'info'}>{children}</FumaCallout>; }
function LearningGoals({ children }: { children: ReactNode }) { return <section className="learning-goals"><p className="learning-label">IN THIS LESSON</p>{children}</section>; }
function WorkflowMap() { return <div className="workflow-map" aria-label="A trigger starts a workflow, nodes process data, and results go to your workspace or connected apps"><div><span>01 / START</span><strong>Trigger</strong><small>A message, form, or schedule</small></div><b aria-hidden="true">→</b><div><span>02 / PROCESS</span><strong>Workflow</strong><small>Connect actions and decisions</small></div><b aria-hidden="true">→</b><div><span>03 / DELIVER</span><strong>Result</strong><small>Update data or take action</small></div></div>; }
export function getMDXComponents(components?: MDXComponents) { return { ...defaultMdxComponents, Card, Columns, Steps, Step, Callout, LearningGoals, WorkflowMap, ...components } satisfies MDXComponents; }
export const useMDXComponents = getMDXComponents;
declare global { type MDXProvidedComponents = ReturnType<typeof getMDXComponents>; }
