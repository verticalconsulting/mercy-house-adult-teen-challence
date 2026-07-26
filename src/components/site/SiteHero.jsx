import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Full-bleed photographic hero with a left-to-right navy scrim.
 *
 * The scrim is what makes the hero work: it holds white headline text at 8.6:1
 * over the left third of the photo while letting the right side stay bright, so
 * the imagery still reads as people rather than as a texture. Values come
 * straight from the design — rgba(21,39,58,.92) → rgba(47,78,111,.72) at 45%
 * → rgba(47,78,111,.2).
 *
 * One gold CTA above the fold. Donate stays outlined so a person looking for
 * help is never competing with a fundraising ask.
 */
export default function SiteHero({
  headline,
  headlineBreak,
  body,
  primaryLabel = 'Start Your Journey',
  primaryTo = '/help-for-dependency-abuse',
  secondaryLabel = 'Donate',
  secondaryTo = '/Donate',
  reassurance,
  image,
  imageAlt = '',
}) {
  return (
    <section className="relative overflow-hidden bg-navy">
      {image && (
        <img
          src={image}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
          /* Above the fold — never lazy. */
          fetchPriority="high"
          width="1792"
          height="1344"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(21,39,58,0.92),rgba(47,78,111,0.72)_45%,rgba(47,78,111,0.2))]"
      />

      <div className="relative mx-auto max-w-7xl animate-mh-fade-up px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl lg:text-[52px]">
            {headline}
            {headlineBreak && (
              <>
                <br />
                {headlineBreak}
              </>
            )}
          </h1>

          {body && (
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/85">{body}</p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={primaryTo} className="mh-cta-primary">
              {primaryLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            {/*
              Outlined on glass rather than `.mh-cta-outline`: on a photographic
              hero a solid white border reads as a second focal point, which the
              one-focal-point rule rules out.
            */}
            <Link
              to={secondaryTo}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-white/40 bg-white/10 px-6 py-[15px] font-bold text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-navy"
            >
              {secondaryLabel}
            </Link>
          </div>

          {reassurance && (
            <p className="mt-6 flex items-center gap-2 text-sm text-white/75">
              <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-gold" />
              {reassurance}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
