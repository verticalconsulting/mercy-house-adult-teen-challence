/** @type {import('tailwindcss').Config} */

/**
 * Brand colors come through as raw `R G B` channel triplets (see src/index.css)
 * so that `<alpha-value>` composition works — that is what makes `bg-navy/90`,
 * `ring-gold/40` and `text-navy/80` resolve. Declaring them as plain CSS
 * utility classes instead silently drops every opacity modifier.
 */
const channel = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
      fontFamily: {
        // Roboto only — the brand guide rules out decorative faces entirely.
        sans: ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
  		borderRadius: {
        // DS radius scale: 6px buttons, 12px small cards, 16px feature cards.
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
        xl: '0.75rem',
        '2xl': '1rem',
  		},
  		colors: {
        /* Mercy House brand palette — see src/index.css for provenance. */
        navy: {
          DEFAULT: channel('navy'),      /* #2F4E6F Deep Harbor */
          light: channel('navy-light'),  /* #5F8FBF Steel Blue */
          deep: channel('navy-deep'),    /* alias of 950 — footer bands */
          950: channel('navy-950'),
          900: channel('navy-900'),
          500: channel('navy-500'),
          300: channel('navy-300'),
          100: channel('navy-100'),
          50: channel('navy-50'),
        },
        gold: {
          DEFAULT: channel('gold'),      /* #CFA869 — CTA fills only */
          /* Gold that clears WCAG AA as *text* on light surfaces. */
          accessible: channel('gold-accessible'),
          300: channel('gold-300'),
          100: channel('gold-100'),
        },
        stone: {
          900: channel('stone-900'),
          700: channel('stone-700'),
          500: channel('stone-500'),
          200: channel('stone-200'),
          100: channel('stone-100'),
        },
        'warm-gray': channel('warm-gray'), /* #D6D2CB Warm Stone */
        /* Rare highlight — women and family contexts only. */
        blush: channel('blush'),

  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
      spacing: {
        section: 'var(--space-section)',
        'section-sm': 'var(--space-section-sm)',
        block: 'var(--space-block)',
      },
      transitionTimingFunction: {
        /* The DS motion curve — calm, no overshoot. */
        standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      boxShadow: {
        /* Soft, cool navy-tinted elevation — never hard or pure black. */
        sm: '0 1px 3px rgba(15, 39, 58, 0.10), 0 1px 2px rgba(15, 39, 58, 0.06)',
        md: '0 4px 6px -1px rgba(15, 39, 58, 0.10), 0 2px 4px -2px rgba(15, 39, 58, 0.08)',
        lg: '0 10px 15px -3px rgba(15, 39, 58, 0.12), 0 4px 6px -4px rgba(15, 39, 58, 0.08)',
        xl: '0 20px 25px -5px rgba(15, 39, 58, 0.14), 0 8px 10px -6px rgba(15, 39, 58, 0.10)',
        '2xl': '0 25px 50px -12px rgba(15, 39, 58, 0.28)',
        /* Warm glow reserved for gold CTAs. */
        cta: '0 8px 20px -6px rgba(207, 168, 105, 0.55)',
      },
  		keyframes: {
        /* Hero entrance from the design — a single calm rise, no bounce. */
        'mh-fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
        'mh-fade-up': 'mh-fade-up 0.7s cubic-bezier(0.4, 0, 0.2, 1) both',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  safelist: ['object-[center_30%]'],
  plugins: [require("tailwindcss-animate")],
}
