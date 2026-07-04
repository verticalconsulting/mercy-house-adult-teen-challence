import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '../utils';

export default function TeenChallengeStory() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative bg-navy dark:bg-slate-900 py-24 text-white overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-4">About Us</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">The Teen Challenge Story</h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            How one country preacher's compassion for troubled youth sparked a global movement of recovery and hope.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-gold mb-8">
            The Teen Challenge Story
          </h2>

          <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
            <p>
              It was February 28, 1958 when the 26-year-old country preacher from rural Pennsylvania
              disrupted a highly publicized murder trial in New York City.
            </p>

            <p>
              David Wilkerson had made the eight-hour drive from his quiet mountain village to downtown
              Manhattan for a simple reason: to speak to the seven accused gang members about their
              salvation. In a grave attempt to share the love of God, Wilkerson had rushed to the front
              of the courtroom at the close of trial proceedings and pleaded publicly with the judge for
              permission to meet the teenage defendants. News media were everywhere, and Wilkerson
              unwittingly made himself the source of headline news throughout New York City. The judge
              had been receiving death threats during the trial, and Wilkerson was almost arrested as a
              presumed assailant. The judge later refused Wilkerson's request to see the boys and ordered
              him never to return to his courtroom.
            </p>
          </div>

          {/* Founder image */}
          <figure className="my-12">
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-slate-100 dark:bg-slate-700">
              <img
                src="https://media.base44.com/images/public/6983b4b00291b5dfd8507106/39964017e_WILKERSON-obit-jumbo.webp"
                alt="David Wilkerson, founder of Teen Challenge, seated with a Bible"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            <figcaption className="text-center text-sm text-slate-500 dark:text-slate-400 mt-3">
              David Wilkerson — founder of Teen Challenge
            </figcaption>
          </figure>

          <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
            <p>
              Today the one-time rural preacher is known as the founder of an international drug
              rehabilitation program called Teen Challenge that has one of the highest success rates
              anywhere in the world. Since its first center opened in New York in 1960, Teen Challenge
              has grown to nearly 250 centers in 48 states and over 1,000 centers in 95 countries. In
              Puerto Rico the organization is building an AIDS hospital, the first of its kind. Wilkerson
              also founded a global evangelistic ministry, World Challenge. The pentecostal preacher
              remained what he was for over 40 years — a man dedicated to preaching the gospel in the
              heart of New York City. He pastored Times Square Church in Manhattan, which he founded in
              1987, until his death in April of 2011. Wilkerson made more than the news back in 1958 —
              five months after his discouraging day in court, his compassion for teen-age gangs and drug
              addicts made history.
            </p>

            <p>
              A year later he established the first Teen Challenge center in one of the roughest areas of
              Brooklyn. Addicts and other troubled youths poured into the center and were delivered by
              God's power. One skeptical psychiatrist observing the program remarked, "It seems to me
              you're just using Jesus as a crutch." "Then give me two of them," a resident of the center
              responded. "What is the program?" the psychiatrist asked. "God in the morning, Jesus in the
              afternoon and the Holy Ghost at night," the resident replied. The good news spread quickly,
              and Wilkerson was deluged with pleas for help with drug problems from all over the country.
              "I raised funds for the first 10-12 centers that started," he said. Answering appeals got so
              demanding that he allowed the ministry to come under the Home Missions department of the
              Assemblies of God. His brother Don then took over as director of the center. Based on strong
              Christian principles, the intensive program runs from 6 to 14 months. Residents come from
              the streets, detoxification facilities, hospitals or jails. Some are referred by pastors and
              counselors or court-ordered into treatment by judges. HIV-positive students are normally
              accepted. Teen Challenge teaches that the key to abstinence from substance abuse is a
              personal relationship with Jesus Christ.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link to={createPageUrl('About')}>
              <Button className="bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy font-semibold">
                Back to About Us
                <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}