import React from "react";

export const PageShell = ({ children }) => (
  <div className="min-h-screen bg-slate-50">
    <div className="mx-auto max-w-6xl p-6 lg:p-8">{children}</div>
  </div>
);

export const GradientHero = ({ title, subtitle, right, children }) => (
  <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 text-white p-6 lg:p-8 shadow-lg">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">{title}</h1>
        {subtitle ? <p className="text-slate-200 mt-1">{subtitle}</p> : null}
      </div>
      {right}
    </div>
    {children}
  </div>
);

export const StatCard = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
  </div>
);

export const SectionCard = ({ title, action, children, className = "" }) => (
  <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
    {(title || action) && (
      <div className="mb-4 flex items-center justify-between gap-3">
        {title ? <h2 className="text-lg font-semibold text-slate-900">{title}</h2> : <span />}
        {action}
      </div>
    )}
    {children}
  </div>
);

export const SkeletonGrid = ({ count = 3 }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="h-36 rounded-2xl border border-slate-200 bg-white animate-pulse" />
    ))}
  </div>
);

export const EmptyState = ({ message }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
    {message}
  </div>
);
