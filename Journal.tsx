import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import JournalEntry from "@/components/JournalEntry";
import DivineHeader from "@/components/DivineHeader";
import { useTranslation } from "@/contexts/LanguageContext";
import { JournalEntry as JournalEntryType } from "@shared/schema";

export default function Journal() {
  const { data: entries, isLoading } = useQuery<JournalEntryType[]>({
    queryKey: ["/api/journal-entries"],
  });
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-soft-gray pb-20">
      <DivineHeader 
        title={t('headers.theVanityMirror')}
        subtitle={t('headers.sacredJournalingSpace')}
        icon={BookOpen}
        showBackButton={true}
      />

      <main className="pt-6">
        <JournalEntry />

        {/* Previous Entries */}
        <section className="px-6 pb-8">
          <Card className="celestial-card divine-glass-morphism">
            <CardContent className="p-6">
              <h2 className="font-playfair text-xl font-semibold text-divine-gold mb-6">
                {t('journal.recentEntries')}
              </h2>

              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border-l-4 border-gray-200 pl-4 py-2 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2 w-32"></div>
                      <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : entries && entries.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {entries.map((entry) => (
                    <div key={entry.id} className="border-l-4 border-divine-gold pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-deep-charcoal">
                          {formatDate(entry.date)}
                        </span>
                        <span className="text-xs text-gray-500">Sacred Reflection</span>
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1 italic">
                        "{entry.prompt}"
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {entry.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">{t('journal.noEntries')}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {t('journal.createFirst')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
