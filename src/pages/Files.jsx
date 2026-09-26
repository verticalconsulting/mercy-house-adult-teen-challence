import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { FileText, Download, Loader2 } from 'lucide-react';

export default function Files() {
  const { data: documents, isLoading } = useQuery({
    queryKey: ['documentResources'],
    queryFn: () => base44.entities.DocumentResource.filter({ published: true }, 'display_order'),
    initialData: [],
  });

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-navy dark:bg-slate-900 py-16 md:py-20 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-4">Doc Hub</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Files &amp; Forms</h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Download applications and forms published by Mercy House Adult Teen Challenge.
          </p>
        </div>
      </section>

      {/* Documents list */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-navy dark:text-gold mx-auto" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-20 text-slate-600 dark:text-slate-300">
              No documents are available for download right now.
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg hover:border-gold transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-navy/10 dark:bg-gold/10 flex items-center justify-center text-navy dark:text-gold shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-navy dark:text-gold">{doc.title}</h3>
                    {doc.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{doc.description}</p>
                    )}
                  </div>
                  <Download className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}