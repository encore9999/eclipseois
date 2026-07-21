@import 'tailwindcss';
@import 'tw-animate-css';
@import 'shadcn/tailwind.css';

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-success: var(--success);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
}

:root {
  color-scheme: dark;

  /* Deep muted violet / indigo, almost black in the shadows */
  --background: oklch(0.16 0.035 288);
  --foreground: oklch(0.97 0.01 290);

  /* Glass cards sitting on the violet gradient */
  --card: oklch(0.22 0.045 289 / 55%);
  --card-foreground: oklch(0.97 0.01 290);
  --popover: oklch(0.19 0.04 289);
  --popover-foreground: oklch(0.97 0.01 290);

  /* Bright purple accent */
  --primary: oklch(0.62 0.235 303);
  --primary-foreground: oklch(0.99 0.005 290);

  --secondary: oklch(0.28 0.05 291 / 60%);
  --secondary-foreground: oklch(0.95 0.01 290);
  --muted: oklch(0.26 0.04 291 / 50%);
  --muted-foreground: oklch(0.72 0.03 291);
  --accent: oklch(0.62 0.235 303);
  --accent-foreground: oklch(0.99 0.005 290);

  --destructive: oklch(0.62 0.21 22);
  --destructive-foreground: oklch(0.98 0.01 290);
  --success: oklch(0.72 0.17 155);

  --border: oklch(0.85 0.05 300 / 12%);
  --input: oklch(0.85 0.05 300 / 14%);
  --ring: oklch(0.62 0.235 303);

  --chart-1: oklch(0.62 0.235 303);
  --chart-2: oklch(0.55 0.18 295);
  --chart-3: oklch(0.7 0.15 320);
  --chart-4: oklch(0.5 0.12 285);
  --chart-5: oklch(0.75 0.12 300);

  --radius: 0.9rem;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  html {
    @apply bg-background;
  }
  body {
    @apply text-foreground;
    /* Layered radial glows over a deep violet-to-near-black gradient,
       matching the "premium tech" mood of the reference site. */
    background-color: oklch(0.12 0.03 286);
    background-image:
      radial-gradient(120% 80% at 15% -10%, oklch(0.34 0.13 300 / 55%) 0%, transparent 55%),
      radial-gradient(110% 70% at 100% 0%, oklch(0.28 0.12 285 / 45%) 0%, transparent 50%),
      radial-gradient(140% 90% at 50% 120%, oklch(0.26 0.1 295 / 40%) 0%, transparent 60%),
      linear-gradient(180deg, oklch(0.17 0.045 288) 0%, oklch(0.11 0.028 285) 60%, oklch(0.08 0.02 284) 100%);
    background-attachment: fixed;
  }
}

@layer utilities {
  .glass {
    background: var(--card);
    backdrop-filter: blur(20px) saturate(1.3);
    -webkit-backdrop-filter: blur(20px) saturate(1.3);
  }

  /* Elevated card with a soft top highlight and inner sheen */
  .card-elevated {
    background:
      linear-gradient(180deg, oklch(0.28 0.06 292 / 40%) 0%, oklch(0.2 0.04 289 / 35%) 100%);
    backdrop-filter: blur(24px) saturate(1.35);
    -webkit-backdrop-filter: blur(24px) saturate(1.35);
    box-shadow:
      inset 0 1px 0 0 oklch(0.9 0.05 300 / 12%),
      0 20px 45px -25px oklch(0.05 0.02 285 / 90%);
  }

  /* Purple glow used for active/connected surfaces */
  .glow-primary {
    box-shadow:
      0 0 0 1px oklch(0.62 0.235 303 / 40%),
      0 0 40px -6px oklch(0.62 0.235 303 / 55%),
      inset 0 1px 0 0 oklch(0.9 0.05 300 / 15%);
  }

  .text-gradient {
    background: linear-gradient(120deg, oklch(0.98 0.01 290), oklch(0.78 0.16 305));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  /* Rotating conic aura for the connect dial */
  .conic-aura {
    background: conic-gradient(
      from 0deg,
      oklch(0.62 0.235 303 / 0%),
      oklch(0.62 0.235 303 / 90%),
      oklch(0.72 0.15 320 / 70%),
      oklch(0.55 0.2 288 / 20%),
      oklch(0.62 0.235 303 / 0%)
    );
    animation: spin-slow 4s linear infinite;
  }

  @keyframes spin-slow {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes breathe {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.6;
    }
    50% {
      transform: scale(1.08);
      opacity: 0.95;
    }
  }

  .animate-breathe {
    animation: breathe 3.5s ease-in-out infinite;
  }
}
