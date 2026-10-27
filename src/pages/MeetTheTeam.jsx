import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { team } from '@/lib/teamMembers';
import TeamCard from '@/components/site/TeamCard';

const boardMembers = [
  { name: 'Board Member Name', title: 'Board Position' },
  { name: 'Board Member Name', title: 'Board Position' },
  { name: 'Board Member Name', title: 'Board Position' },
  { name: 'Board Member Name', title: 'Board Position' },
];

export default function MeetTheTeam() {
  const [photos, setPhotos] = useState({});

  useEffect(() => {
    base44.entities.TeamMemberPhoto.filter({}, { limit: 100 })
      .then(({ items }) => {
        const map = {};
        items.forEach((photo) => {
          map[photo.member_name] = photo.photo_url;
        });
        setPhotos(map);
      })
      .catch(() => setPhotos({}));
  }, []);

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-navy dark:bg-slate-900 py-20 text-center text-white">
        <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Mercy House Adult Teen Challenge</p>
        <h1 className="text-5xl font-bold mb-4">Meet Our Team</h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          A dedicated team of staff and graduates united by faith and a mission to bring lasting freedom to those in need.
        </p>
      </section>

      {/* Team Grid */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {team.map((member) => (
              <TeamCard key={member.name} member={member} photoUrl={photos[member.name]} />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-border" />
      </div>

      {/* Board of Directors */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Mercy House Adult Teen Challenge</p>
          <h2 className="text-4xl font-bold text-navy dark:text-gold mb-12">Board of Directors</h2>

          {/* Group photo placeholder */}
          <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-2xl mb-12 flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
            <User className="w-16 h-16" />
            <span className="text-sm">Group photo coming soon</span>
          </div>

          {/* Board member names & positions */}
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6 max-w-2xl mx-auto">
            {boardMembers.map((member, i) => (
              <div key={i} className="text-center">
                <h3 className="text-lg font-bold text-navy dark:text-gold">{member.name}</h3>
                <p className="text-gold dark:text-gold/80 font-semibold text-sm">{member.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}