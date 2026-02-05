import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { ArrowRight, Heart, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DonateButton from '../components/DonateButton';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&q=80"
            alt="Diverse families showing hope and freedom"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-transparent dark:from-slate-900/95 dark:via-slate-900/80" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight">
              A New Beginning
              <span className="block text-gold mt-2">Starts Here</span>
            </h1>
            <p className="text-lg md:text-2xl mb-8 text-slate-200 leading-relaxed">
              Providing comprehensive Christian faith-based solutions to life-controlling problems. Become mentally sound, emotionally balanced, and socially adjusted.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl('IntakeForm')}>
                <Button className="bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <DonateButton className="px-8 py-6 text-lg font-semibold" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-gold mb-6">Our Mission</h2>
            <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
              To provide an effective and comprehensive Christian faith-based solution to life-controlling problems in order to become productive members of society. By applying biblical principles, we endeavor to help people become mentally sound, emotionally balanced, and socially adjusted.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-navy dark:text-gold mb-12">Our Programs</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Women's Campus */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
              <div className="h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80"
                  alt="Women's Campus"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-navy dark:text-gold mb-4">Women's Campus</h3>
                <p className="text-base md:text-base text-slate-600 dark:text-slate-300 mb-6">
                  A safe, supportive environment where women can heal, grow, and rebuild their lives through faith-based recovery and life skills training.
                </p>
                <Link to={createPageUrl('WomensCampus')}>
                  <Button className="w-full bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy">
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Men's Campus */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
              <div className="h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&q=80"
                  alt="Men's Campus"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-navy dark:text-gold mb-4">Men's Campus</h3>
                <p className="text-base md:text-base text-slate-600 dark:text-slate-300 mb-6">
                  Empowering men to overcome addiction and life-controlling issues through structured programming, spiritual development, and vocational training.
                </p>
                <Link to={createPageUrl('MensCampus')}>
                  <Button className="w-full bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy">
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-navy dark:bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-gold mb-2">15+</div>
              <div className="text-sm md:text-base text-slate-300">Years of Service</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-gold mb-2">110%</div>
              <div className="text-sm md:text-base text-slate-300">Donations to Mission</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-gold mb-2">1000+</div>
              <div className="text-sm md:text-base text-slate-300">Lives Changed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-gold mb-2">24/7</div>
              <div className="text-sm md:text-base text-slate-300">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Micro Businesses Section */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-gold mb-4">Micro Businesses</h2>
            <p className="text-base md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Our micro businesses provide job training, develop work skills, and fund our operations—ensuring 110% of individual donations go directly to our mission.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Thrift Store', icon: '🏪', path: 'ThriftStore' },
              { name: 'Vehicle Donation', icon: '🚗', path: 'VehicleDonation' },
              { name: 'Mercy Auto Academy', icon: '🔧', path: 'MercyAutoAcademy' },
              { name: 'Products & Purpose', icon: '📦', path: 'ProductsPurpose' }
            ].map((business) => (
              <Link
                key={business.name}
                to={createPageUrl(business.path)}
                className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-slate-200 dark:border-slate-700"
              >
                <div className="text-5xl mb-4">{business.icon}</div>
                <h3 className="font-semibold text-navy dark:text-gold">{business.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-navy dark:text-gold mb-12">Our Story</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
              Mercy House Adult and Teen Challenge was founded in 1960 by David Wilkerson, an Assemblies of God pastor who left a rural Pennsylvania church to work on the street among teenage gang members and socially marginalized people in New York City. David Wilkerson is perhaps best known for authoring The Cross and the Switchblade and founding Times Square Church.
            </p>
            <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              Teen Challenge started its first residential program in December 1960, in a house in Brooklyn. Since then, the program has grown to help thousands of individuals find freedom from life-controlling problems through the power of Jesus Christ.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Phases */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-navy dark:text-gold mb-4">Our 4 Phase Program</h2>
          <p className="text-center text-base md:text-lg text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto">
            Life transformation through a structured, progressive approach
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                phase: 'Phase 1',
                title: 'Why was I created?',
                description: 'Dealing with past wounds. How to move forward from life altering dependency.'
              },
              {
                phase: 'Phase 2',
                title: 'Conflict resolution',
                description: 'Building healthy relationships. Dealing with triggers. Continued in-depth Bible studies.'
              },
              {
                phase: 'Phase 3',
                title: 'Move into our transition home',
                description: 'Get a job. Pay fines. Get a driver\'s license. Marriage counseling. Improved life skills.'
              },
              {
                phase: 'Phase 4',
                title: 'Transition to alumni home',
                description: 'Have accountability. Live freely. Develop a new life.'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg border-l-4 border-gold">
                <div className="text-gold font-bold text-base md:text-sm mb-2">{item.phase}</div>
                <h3 className="text-xl md:text-2xl font-bold text-navy dark:text-gold mb-3">{item.title}</h3>
                <p className="text-base md:text-base text-slate-600 dark:text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values & Beliefs */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-navy dark:text-gold mb-12">Our Values & Beliefs</h2>
          
          <div className="space-y-12">
            {/* Studies Centered In Christ */}
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl md:text-2xl font-bold text-navy dark:text-gold mb-4">Studies Centered In Christ</h3>
              <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 mb-4">
                Our studies are designed to teach about Christ, the Word of God, and how to live a godly life once graduating the program. This curriculum is based on the nationally accredited Teen Challenge Group Studies, Personal Studies, and Advanced Studies for New Life In Christ.
              </p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Personal Studies</strong> – Focuses on contract-work based on individual needs for recovery and capabilities</li>
                <li><strong>Group Studies</strong> – Focuses on successful Christian living and 14 core classes developed by Adult & Teen Challenge</li>
                <li><strong>Advanced Studies</strong> – Focuses on deeper spiritual principles and an in-depth look at Scripture</li>
              </ul>
            </div>

            {/* Work Centered In Christ */}
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl md:text-2xl font-bold text-navy dark:text-gold mb-4">Work Centered In Christ</h3>
              <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 mb-4">
                We believe hardwork and dedication are critical to recovery. Our program has a variety of skilled labor positions that students will train in:
              </p>
              <ul className="space-y-2 text-base md:text-base text-slate-700 dark:text-slate-300">
                <li>• Mercy House Thrift Store</li>
                <li>• Mercy House Auto Center</li>
                <li>• Woodshop/Craft Center</li>
              </ul>
            </div>

            {/* Worship Centered In Christ */}
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl md:text-2xl font-bold text-navy dark:text-gold mb-4">Worship Centered In Christ</h3>
              <p className="text-base md:text-lg text-slate-700 dark:text-slate-300">
                We believe in passionate and loving fellowship with God. We have set times daily for praise and worship. Students will attend Sunday church services and also have the opportunity to visit various churches and ministries in Mississippi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Programs */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-navy dark:text-gold mb-12">More Than Recovery</h2>
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg">
              <h3 className="text-xl md:text-2xl font-bold text-navy dark:text-gold mb-4">Life Transformation</h3>
              <p className="text-base md:text-base text-slate-700 dark:text-slate-300">
                Our program is not just to help someone overcome a life debilitating problem, but also to find their life in Christ.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg">
              <h3 className="text-xl md:text-2xl font-bold text-navy dark:text-gold mb-4">GED Program</h3>
              <p className="text-base md:text-base text-slate-700 dark:text-slate-300">
                We believe that everyone has the ability to succeed. We can assist those who have not had the chance to move forward in their journey of receiving their diploma.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg">
              <h3 className="text-xl md:text-2xl font-bold text-navy dark:text-gold mb-4">Discipleship Training</h3>
              <p className="text-base md:text-base text-slate-700 dark:text-slate-300">
                We focus on learning how to process and overcome the stress and pressure of addiction through spiritual teachings.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg">
              <h3 className="text-xl md:text-2xl font-bold text-navy dark:text-gold mb-4">Family Restoration</h3>
              <p className="text-base md:text-base text-slate-700 dark:text-slate-300">
                Our goal is to help broken families be restored and to help give them a path forward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-navy to-navy/80 dark:from-slate-900 dark:to-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-lg md:text-xl mb-8 text-slate-200">
            Take the first step towards freedom and transformation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={createPageUrl('IntakeForm')}>
            <Button className="bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-6 text-lg shadow-xl">
              Apply Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link to={createPageUrl('Contact')}>
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-navy px-8 py-6 text-lg font-semibold">
              Contact Us
            </Button>
          </Link>
          </div>
        </div>
      </section>
    </div>
  );
}