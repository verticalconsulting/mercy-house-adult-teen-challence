import React, { useState } from 'react';
import { User } from 'lucide-react';

const team = [
  {
    name: 'Bryan Wilson',
    title: 'President/CFO',
    photo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/b3560cfa-a4f6-42c3-3089-938b4db94000/small',
    bio: "God called me to start this Teen Challenge because our family had a long line of alcoholics until God delivered my father & broke the generational curse on our family. We are now three generations of ministers. One life changed can transform the trajectory of a whole family of generations, saving children from abuse, giving sons back to mothers, husbands back to wives, & fathers back to children. There is also the reality that our church had sent 200 men to other TCs around the country but some could not leave the state because of legal issues. So we could not help them & God said, \"Do something about it.\" The the miracles began.",
  },
  {
    name: 'Matthew Milliman',
    title: 'Executive Director/CEO',
    photo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/70e7c889-58c9-421b-b89a-188f9a87b400/small',
    bio: "I grew up seeing a lot of dysfunction which really altered how I viewed life. My dad was a good man but drank a lot and wasn't there for us like he should have been. This left me empty and looking for acceptance in all the wrong places. My only identity was in the alcohol I drank or the drugs I did. Coming through Adult and Teen Challenge helped rescue me from a lifestyle of addiction & taught me how to live again. I am now walking in my true calling helping men and their families find freedom from addiction!",
  },
  {
    name: 'Joshua Cook',
    title: 'Director of Operations',
    photo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/fbee339a-6e0e-41b1-dec4-7e39ded9b900/small',
    bio: "I lived in darkness for 22 years of my life. I have been in over 11 rehabs 3 psych ward and multiple jails and prisons. I have overdosed countless times. But God had other plans. I walked in Mercy House on August 17, 2017 and never looked back. God has changed everything. I'm a husband, father and deacon in my church. The Lord has given back everything plus more that the enemy stole from me. I'm blessed and humble that the Lord is using me today to help others who struggle like I did for years.",
  },
  {
    name: 'Thomas Reif',
    title: 'Campus Director — Men',
    photo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/1777985b-43aa-4dcc-e288-ea7079952b00/small',
    bio: "I am happily married to my wife, Ashley, and we have the privilege of raising our three boys: Cayden, Zane, and Wyatt. After nearly a decade in the military and local law enforcement, my life fell apart due to addiction and PTSD. By the grace of God, I was saved and my family was restored, leading us into full-time ministry. My wife and I felt called to move our family from the Pacific Northwest, where I was pastoring a church in Oregon, to join the Mercy House Adult and Teen Challenge family. I am passionate about witnessing the transformation of men's lives through the power of Jesus Christ. I firmly believe that if God can change a single man, He can begin to change entire communities.",
  },
  {
    name: 'Lindsay Hughes',
    title: 'Campus Director — Women',
    photo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/45c77396-fda6-438c-24a8-721975af3e00/small',
    bio: "Lindsay Hughes is the Director of the Women's Campus in Learned, MS, where she leads a dedicated team in creating a supportive environment for women. A Board Certified Christian Counselor with a Bachelor's in Social Work and graduate studies in Clinical Chaplaincy and Christian Counseling, she specializes in trauma-informed therapy. Lindsay has served as a Medical Chaplain in multiple hospitals, providing spiritual support to patients and families. Her coordination of mission projects for Global Outreach in Exuma, Bahamas, highlights her commitment to service and community. With her extensive experience and dedication, Lindsay plays a vital role in promoting holistic well-being at the Women's Campus.",
  },
  {
    name: 'Wesley Barnett',
    title: 'Student Life Coordinator',
    photo: 'https://imagedelivery.net/dXRounTcgmfhZwbsZCZLTw/18058ddc-6999-4a74-47a6-6fc6e80dce00/small',
    photoPosition: 'object-[center_30%]',
    bio: "My name is Wesley Barnett. I was in active addiction for 8 years of my life. God delivered me from my addiction and brought me to Mercy House Adult and Teen Challenge on November 12, 2020. I also now have a beautiful wife and two amazing step sons that I get to raise up in the Lord. My life is forever changed!",
  },
  {
    name: 'Howard Kittrell',
    title: '3rd Phase Director Coordinator',
    bio: "For 40 years I lived in darkness. I spent most of those years hopelessly addicted to gambling. I thought, \"It is just who I am what I would always be.\" In 2014 my addiction landed me in jail and from there I came to MHATC, where I found hope in Christ Jesus. My marriage, as well as my relationship with my family has been restored and my wife and I now work for MHATC and are able to help others find the same hope through a relationship with Jesus Christ.",
  },
  {
    name: 'Sharon Pointer',
    title: 'Auto Center Administrator / VDP Coordinator',
    bio: "Addiction has followed me for years. As I grew up, my family was dysfunctional because of Drugs/Alcohol/Relationships. Those are the things I craved in my life. I was receiving counseling with Pastor Bryan Wilson and that is what brought me to MHATC. My life has been forever changed through this ministry.",
  },
  {
    name: 'Jessica Bratton',
    title: 'Office Administrator',
    bio: "My association with MHATC began through my husband, who graduated from the program in 2013 and remained employed with MHATC until 2018. I have always aspired to work within a ministry environment. After transitioning from an 11-year career as a Paralegal in 2022, a series of events led me to join Mercy House part-time in January 2023. Currently, I serve as the full-time Human Resources and Financial Administrator. This role has allowed me to reconnect with what feels like my second home. Since 2012, this ministry has significantly impacted my family, and I am honored to contribute to a remarkable team dedicated to restoring families by rehabilitating the men who participate in our program.",
  },
  {
    name: 'Kim Brink',
    title: 'Counselor',
    bio: "By God's grace and His mercy I am able to write this. At 56 years old I came to Georgetown, MS to start a new life in Christ. The prior 38 years of my life, I had been a \"functioning\" alcoholic and drug addict who had ran from the life God had planned for me. Bound and determined not to run again, to set my feet on the solid foundation of Truth, and seek a relationship with Christ, I have been made \"new.\" Since 2010 God has had His Hand on directing me and, today, I am the Director of Education and an ordained minister of the Gospel. I give God the glory, honor and praise for His love, patience, and compassion. Thank you, Jesus!",
  },
  {
    name: 'Ramsey Cumpton',
    title: 'Work Detail Coordinator',
    bio: "My name is Ramsey Cumpton I was in addiction for 25 years. There, I found myself in total darkness not truly knowing that God had a purpose for my life. When I came to the end of myself I asked God for help. After I got out of prison I was brought to Mercy House under the order of MDOC on my birthday February 11 2020 where I went through the process of being set free from the bondage of sin. After graduating Mercy House Adult Teen Challenge I found a wife and family. Now that I have been sober since my surrender to Christ I have gotten peace from God's love and this has given me the opportunity to reach the broken guys that need help just like I did. All glory goes to God.",
  },
  {
    name: 'Michael Partridge',
    title: 'Marketing Director',
    bio: "My name is Michael Partridge. I'm 38 years old and I struggled with addiction for 22 years of my life. I came from good parents but because of their decision to divorce I became angry and rebellious and began to use drugs to fill that void and pain. I came through Teen Challenge and found freedom through Jesus Christ. I'm now happily married to my wife Stephanie and have found my purpose serving here at Mercy House helping men find FREEDOM!",
  },
  {
    name: 'Allison Yarborough',
    title: 'Outreach Coordinator — Women\'s Center',
    bio: '',
  },
];

function TeamCard({ member }) {
  const [expanded, setExpanded] = useState(false);
  const shortBio = member.bio.length > 200 ? member.bio.slice(0, 200) + '…' : member.bio;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden flex flex-col">
      {/* Photo */}
      <div className="aspect-square bg-slate-200 dark:bg-slate-700 overflow-hidden">
        {member.photo ? (
          <img src={member.photo} alt={member.name} className="w-full h-full object-cover object-center" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
            <User className="w-16 h-16" />
            <span className="text-sm">Photo coming soon</span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-navy dark:text-gold">{member.name}</h3>
        <p className="text-gold dark:text-gold/80 font-semibold text-sm mb-3">{member.title}</p>
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
    </div>
  );
}

export default function MeetTheTeam() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-navy dark:bg-slate-900 py-20 text-center text-white">
        <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Mercy House Adult &amp; Teen Challenge</p>
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
              <TeamCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}