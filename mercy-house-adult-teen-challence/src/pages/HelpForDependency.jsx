import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, ArrowRight, Sun, Shield, BookOpen } from 'lucide-react';
import CTABand from '../components/CTABand';

const signs = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Pulling Away from People',
    desc: 'Withdrawing from family, close friends, and activities that once brought joy. Isolation is often one of the earliest and most consistent signs that something deeper is wrong.',
  },
  {
    icon: <Sun className="w-6 h-6" />,
    title: 'Inability to Stop on Their Own',
    desc: "Repeated attempts to quit or slow down — followed by returning to the same patterns. If someone has promised to stop many times but can't seem to make it stick, the struggle is real and the need for outside support is real too.",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Neglecting Responsibilities',
    desc: 'Jobs lost, bills unpaid, children left without care, commitments broken. When a life-controlling issue takes over, priorities shift in ways that are painful to watch — and often invisible to the person in the middle of it.',
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Secrecy and Defensiveness',
    desc: 'Hiding behaviors, lying about whereabouts, becoming angry when questioned. Secrecy almost always accompanies dependency — not because someone is a bad person, but because shame drives people underground.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Changes in Mood and Behavior',
    desc: "Dramatic mood swings, unpredictable behavior, or a personality that seems to shift depending on the day. Friends and family often describe it as feeling like they no longer know the person they love.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Legal or Financial Trouble',
    desc: 'Arrests, DUIs, borrowed money that never comes back, or stolen property. Life-controlling dependency has a way of eventually touching every area of a person\'s life — including the legal and financial dimensions.',
  },
];

export default function HelpForDependency() {
  return (
    <div className="w-full">

      {/* Hero */}
      <section className="bg-navy dark:bg-slate-900 py-24 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-4">Help &amp; Hope</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            There Is a Way Forward
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Life-controlling dependency doesn't just affect the person caught in it — it affects everyone who loves
            them. If you're searching for answers, you're in the right place. This page is for you.
          </p>
        </div>
      </section>

      {/* What Is a Life-Controlling Issue */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Understanding the Struggle</p>
          <h2 className="text-4xl font-bold text-navy dark:text-gold mb-6">What Is a Life-Controlling Issue?</h2>
          <div className="space-y-5 text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
            <p>
              A life-controlling issue is any pattern of behavior — whether involving substances, alcohol, or
              destructive habits — that has taken control of a person's life. It affects their relationships,
              their decisions, their identity, and their future. And no matter how much they want to stop, they
              find themselves unable to do so on their own.
            </p>
            <p>
              This is not a character flaw. It is not simply a lack of willpower. It is a deep, complex struggle
              that touches every part of a person — their mind, their emotions, their spirit. And it requires
              more than a good intention to overcome. It requires real support, real community, and — we believe —
              real faith.
            </p>
            <p>
              At Mercy House, we've seen men and women arrive broken, hopeless, and certain that nothing could
              ever change for them. And we've watched God do what nothing else could. That doesn't mean the
              journey is easy. It means the journey is worth it.
            </p>
          </div>
        </div>
      </section>

      {/* Signs of Dependency */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Recognizing the Signs</p>
            <h2 className="text-4xl font-bold text-navy dark:text-gold mb-4">What to Watch For</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              You don't have to be certain before you reach out. But understanding what life-controlling dependency
              can look like may help you recognize when someone — or you yourself — needs more support than
              willpower alone can provide.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {signs.map((sign) => (
              <div key={sign.title} className="bg-white dark:bg-slate-800 rounded-2xl p-7 shadow-md border border-slate-100 dark:border-slate-700">
                <div className="w-12 h-12 bg-navy/10 dark:bg-gold/10 rounded-xl flex items-center justify-center text-navy dark:text-gold mb-4">
                  {sign.icon}
                </div>
                <h3 className="text-lg font-bold text-navy dark:text-gold mb-2">{sign.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{sign.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Help a Loved One */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">For Families &amp; Friends</p>
            <h2 className="text-4xl font-bold text-navy dark:text-gold mb-6">How to Help Someone You Love</h2>
          </div>
          <div className="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
            <div>
              <h3 className="text-xl font-bold text-navy dark:text-gold mb-2">Start with Honesty, Not an Ultimatum</h3>
              <p>
                The most powerful thing you can do is have an honest, compassionate conversation. Not an argument.
                Not a list of everything they've done wrong. Just a real conversation where you express what you've
                seen, what you feel, and what you hope for them. People are more likely to take a step toward help
                when they feel loved, not cornered.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-navy dark:text-gold mb-2">Stop Enabling, Start Encouraging</h3>
              <p>
                Enabling looks like protecting someone from the consequences of their choices — paying fines, covering
                for them at work, making excuses. It feels like love. But it often keeps the person from reaching the
                point where they are willing to accept help. The most loving thing is sometimes the hardest: letting
                reality do its work while keeping the door of hope open.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-navy dark:text-gold mb-2">Point Them to a Real Option</h3>
              <p>
                Telling someone they need help without giving them a clear next step rarely works. Have the name of a
                program ready. Have the phone number. Offer to make the call with them. The gap between "I should get
                help" and "I'm getting help" is often just one person willing to take that step alongside them.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-navy dark:text-gold mb-2">Take Care of Yourself Too</h3>
              <p>
                Living with or loving someone in this struggle is exhausting. You cannot pour from an empty cup.
                Seek support — whether through your church, a trusted counselor, or others who have walked this road.
                You matter in this story too.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20 bg-navy dark:bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">What Comes Next</p>
            <h2 className="text-4xl font-bold mb-4">What to Expect When Seeking Help</h2>
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Fear of the unknown keeps a lot of people from making the call. Here's what seeking help at
              Mercy House actually looks like — no surprises.
            </p>
          </div>
          <div className="space-y-5">
            {[
              { num: '1', title: 'A Real Conversation', desc: "You'll speak with a real person — someone who has likely seen or experienced what you're going through. There's no judgment. Just honesty about whether our program is the right fit and what the next step looks like." },
              { num: '2', title: 'A Simple Application', desc: "We'll gather some basic information to prepare for your arrival. It's a conversation, not an interrogation. The goal is to understand your situation so we can best support you from day one." },
              { num: '3', title: 'A Structured, Supportive Environment', desc: "When you arrive, you enter a community — not a facility. You'll have a daily routine, people around you who understand your struggle, and staff who are genuinely invested in your story. The first few weeks are about settling in and beginning the process. One day at a time." },
              { num: '4', title: 'Real Work — and Real Growth', desc: "This program asks something of you. It requires honesty, commitment, and a willingness to change. It will be hard at times. But the men and women who engage fully — who show up even when it's hard — come out the other side with something they didn't have before: a life worth living." },
            ].map((item) => (
              <div key={item.num} className="flex gap-5 items-start bg-white/10 dark:bg-white/5 rounded-2xl p-6">
                <div className="flex-shrink-0 w-10 h-10 bg-gold rounded-full flex items-center justify-center text-navy font-black text-lg">
                  {item.num}
                </div>
                <div>
                  <h3 className="font-bold text-gold text-lg mb-1">{item.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Encouragement */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-4">A Word of Hope</p>
          <h2 className="text-4xl font-bold text-navy dark:text-gold mb-6">You Were Not Made for This</h2>
          <div className="space-y-5 text-slate-700 dark:text-slate-300 leading-relaxed text-lg text-left">
            <p>
              Whatever has brought you to this page — whether you're the one struggling or someone who loves them —
              we want you to hear this clearly: <strong className="text-navy dark:text-gold">there is real hope.</strong> Not
              the kind that sounds good on a poster. The kind that has shown up in the lives of real people, in real
              darkness, and walked them into something completely different.
            </p>
            <p>
              We have seen it happen at Mercy House over and over again. Men and women who arrived with nothing —
              no hope, no support, no belief that anything could change — and left with a faith that held, a
              community that cared, and a future they could actually see.
            </p>
            <p>
              We're not promising it's easy. We're not promising it's quick. We're saying it's possible. And we're
              saying there are people at Mercy House right now who are walking through it — and would be honored to
              walk through it with you.
            </p>
            <blockquote className="border-l-4 border-gold pl-5 my-6 italic text-slate-600 dark:text-slate-400">
              "Therefore if anyone is in Christ, the new creation has come: The old has gone, the new is here!"
              <br />
              <span className="not-italic font-semibold text-navy dark:text-gold">— 2 Corinthians 5:17</span>
            </blockquote>
            <p>
              If you're ready to take the next step — or even just ready to ask a question — we're here. One call
              can change everything.
            </p>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:6017203718"
              className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-4 rounded-lg text-lg transition-colors shadow-xl"
            >
              Call (601) 720-3718
            </a>
            <Link
              to="/IntakeForm"
              className="inline-flex items-center justify-center gap-2 bg-navy dark:bg-slate-700 hover:bg-navy/90 text-white font-bold px-8 py-4 rounded-lg text-lg transition-colors"
            >
              Apply for the Program <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <CTABand
        heading="Ready to Talk?"
        subtext="Our intake team is available Monday – Friday, 8am – 5pm. There's no obligation — just a real conversation."
        primaryLabel="Call Intake: (601) 720-3718"
        primaryTo="/Contact"
        secondaryLabel="Learn About Our Programs"
        secondaryTo="/Programs"
      />
    </div>
  );
}