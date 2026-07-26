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
        sans: ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        // Handwritten accent from the wireframes — pull quotes and eyebrows only.
        accent: ['Caveat', 'ui-rounded', 'cursive'],
      },
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
        /* Mercy House brand palette */
        navy: {
          DEFAULT: channel('navy'),
          deep: channel('navy-deep'),
          light: channel('navy-light'),
        },
        gold: {
          DEFAULT: channel('gold'),
          deep: channel('gold-deep'),
          /* Gold that clears WCAG AA as *text* on light surfaces. */
          accessible: channel('gold-accessible'),
        },
        parchment: {
          DEFAULT: channel('parchment'),
          soft: channel('parchment-soft'),
          deep: channel('parchment-deep'),
        },
        'warm-gray': channel('warm-gray'),
        ink: channel('ink'),
        note: {
          DEFAULT: channel('note-bg'),
          ink: channel('note-ink'),
        },

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
      backgroundImage: {
        /* The crossed-diagonals placeholder box the wireframes use for imagery. */
        'wire-placeholder':
          'linear-gradient(to top right, transparent calc(50% - 1px), rgb(var(--warm-gray)) calc(50%), transparent calc(50% + 1px)), linear-gradient(to top left, transparent calc(50% - 1px), rgb(var(--warm-gray)) calc(50%), transparent calc(50% + 1px))',
      },
  		keyframes: {
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
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  safelist: ['object-[center_30%]'],
  plugins: [require("tailwindcss-animate")],
}
