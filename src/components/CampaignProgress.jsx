import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Heart, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function CampaignProgress({ campaignId, showDonateButton = true }) {
  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['campaigns', campaignId],
    queryFn: () => campaignId 
      ? base44.entities.Campaign.filter({ id: campaignId, active: true })
      : base44.entities.Campaign.filter({ active: true, featured: true }),
    initialData: [],
  });

  if (isLoading) return null;
  if (!campaigns || campaigns.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {campaigns.map((campaign) => {
        const percentage = Math.min((campaign.current_amount / campaign.goal_amount) * 100, 100);
        const daysLeft = campaign.end_date 
          ? Math.ceil((new Date(campaign.end_date) - new Date()) / (1000 * 60 * 60 * 24))
          : null;

        return (
          <Card key={campaign.id} className="overflow-hidden">
            {campaign.image_url && (
              <div className="h-48 overflow-hidden">
                <img 
                  src={campaign.image_url} 
                  alt={campaign.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl text-navy dark:text-gold">
                {campaign.name}
              </CardTitle>
              {campaign.description && (
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  {campaign.description}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 dark:text-slate-300">
                    ${campaign.current_amount?.toLocaleString() || 0} raised
                  </span>
                  <span className="font-bold text-navy dark:text-gold">
                    ${campaign.goal_amount?.toLocaleString()} goal
                  </span>
                </div>
                <Progress value={percentage} className="h-3" />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {percentage.toFixed(1)}% of goal reached
                </p>
              </div>

              {daysLeft !== null && daysLeft > 0 && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <Calendar className="w-4 h-4" />
                  <span>{daysLeft} days remaining</span>
                </div>
              )}

              {showDonateButton && (
                <Link to={createPageUrl('Donate') + `?campaign=${campaign.id}`}>
                  <Button className="w-full bg-navy dark:bg-gold hover:bg-navy/90 dark:hover:bg-gold/90 text-white dark:text-navy">
                    <Heart className="w-4 h-4 mr-2" />
                    Donate to This Campaign
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}