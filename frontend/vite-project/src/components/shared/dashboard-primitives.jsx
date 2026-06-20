import React from "react";

export const PageShell = ({ children }) => (
  <div className="app-bg">
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
  </div>
);

export const GradientHero = ({ title, subtitle, right, children }) => (
  <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#0f172a_0%,#164e63_52%,#0f766e_100%)] p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)] lg:p-8">
    <div className="absolute inset-x-0 top-0 h-px bg-white/30" />
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight lg:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">{subtitle}</p> : null}
      </div>
      {right}
    </div>
    {children}
  </div>
);

export const StatCard = ({ label, value }) => (
  <div className="premium-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.12)]">
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
  </div>
);

export const SectionCard = ({ title, action, children, className = "" }) => (
  <div className={`premium-card p-5 sm:p-6 ${className}`}>
    {(title || action) && (
      <div className="mb-4 flex items-center justify-between gap-3">
        {title ? <h2 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h2> : <span />}
        {action}
      </div>
    )}
    {children}
  </div>
);

export const SkeletonGrid = ({ count = 3 }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="h-36 rounded-2xl border border-slate-200 bg-gradient-to-r from-white via-slate-100 to-white animate-pulse" />
    ))}
  </div>
);

export const EmptyState = ({ message }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center text-sm font-medium text-slate-500">
    {message}
  </div>
);
