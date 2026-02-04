import React from 'react';
import { Wrench, Award, BookOpen, Briefcase } from 'lucide-react';

export default function MercyAutoAcademy() {
  return (
    <div className="w-full">
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🔧</div>
            <h1 className="text-5xl font-bold text-navy dark:text-gold mb-6">
              Mercy Auto Academy
            </h1>
            <p className="text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
              Professional automotive training preparing residents for successful careers in the automotive industry
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80"
                alt="Auto mechanic working"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-navy dark:text-gold mb-6">
                Build a Career in Automotive
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                Our state-of-the-art automotive training facility provides residents with hands-on experience in automotive repair, maintenance, diagnostics, and body work.
              </p>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                Under the guidance of certified technicians, residents learn industry-standard practices and can work toward ASE certification—opening doors to well-paying careers upon graduation.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: Wrench,
                title: 'Hands-On Training',
                description: 'Real vehicle repairs and maintenance in our fully equipped shop'
              },
              {
                icon: Award,
                title: 'Certification Prep',
                description: 'Preparation for ASE and other industry certifications'
              },
              {
                icon: BookOpen,
                title: 'Theory & Practice',
                description: 'Classroom instruction combined with practical application'
              },
              {
                icon: Briefcase,
                title: 'Job Placement',
                description: 'Connections with local dealerships and auto shops'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg text-center"
              >
                <feature.icon className="w-12 h-12 text-gold mx-auto mb-4" />
                <h3 className="text-xl font-bold text-navy dark:text-gold mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-navy dark:text-gold mb-6">Training Areas</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Engine Diagnostics & Repair',
                'Brake Systems',
                'Electrical Systems',
                'Transmission Service',
                'Heating & Air Conditioning',
                'Suspension & Steering',
                'Oil Changes & Preventive Maintenance',
                'Body Work & Paint',
                'Wheel Alignment',
                'Tire Service',
                'Computer Diagnostics',
                'Hybrid & Electric Vehicle Basics'
              ].map((area, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div className="w-2 h-2 bg-gold rounded-full" />
                  <span className="text-slate-700 dark:text-slate-300">{area}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 bg-navy dark:bg-slate-950 text-white p-8 rounded-xl text-center">
            <h2 className="text-3xl font-bold text-gold mb-4">Serving the Community</h2>
            <p className="text-lg max-w-3xl mx-auto">
              Our academy also provides affordable auto repair services to the community, with all work supervised by certified technicians. Schedule an appointment for quality service that supports recovery.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}