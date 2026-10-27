import React, { useState } from 'react';
import { User } from 'lucide-react';

export default function TeamCard({ member, photoUrl }) {
  const [expanded, setExpanded] = useState(false);
  const shortBio = member.bio.length > 200 ? member.bio.slice(0, 200) + '…' : member.bio;

  return (
    <article className="mh-card overflow-hidden flex flex-col">
      <div className="aspect-[4/5] bg-navy-50 dark:bg-slate-700 overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={`${member.name}, ${member.title}`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-navy-300">
            <User className="w-12 h-12" aria-hidden="true" />
            <span className="text-xs uppercase tracking-[0.12em]">Photo coming soon</span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-navy dark:text-gold">{member.name}</h3>
        <p className="text-gold-accessible dark:text-gold font-semibold text-sm mb-3">{member.title}</p>
        {member.bio && (
          <>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed flex-1">
              {expanded ? member.bio : shortBio}
            </p>
            {member.bio.length > 200 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-3 text-navy dark:text-gold text-sm font-semibold hover:underline self-start"
              >
                {expanded ? 'Read less' : 'Read more'}
              </button>
            )}
          </>
        )}
      </div>
    </article>
  );
}