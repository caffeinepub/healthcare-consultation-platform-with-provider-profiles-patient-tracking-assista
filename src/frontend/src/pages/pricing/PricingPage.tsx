import { useListMembershipPlans } from '@/hooks/useQueries';
import { useGetVIPStatus } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import VIPBadge from '@/components/vip/VIPBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check } from 'lucide-react';

export default function PricingPage() {
  const { identity } = useInternetIdentity();
  const { data: plans = [], isLoading } = useListMembershipPlans();
  const { data: isVIP = false } = useGetVIPStatus();

  const getDurationLabel = (duration: number) => {
    if (duration <= 1) return 'Daily';
    if (duration <= 7) return 'Weekly';
    if (duration <= 31) return 'Monthly';
    return 'Yearly';
  };

  return (
    <div className="container py-12 max-w-6xl">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl font-bold">Membership Plans</h1>
          {identity && <VIPBadge isVIP={isVIP} />}
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose a plan that fits your lifestyle. All plans include access to our platform and personalized care
          features.
        </p>
      </div>

      {identity && isVIP && (
        <Card className="mb-12 border-primary/50 bg-primary/5 max-w-2xl mx-auto">
          <CardContent className="py-6 text-center">
            <p className="font-medium">
              🎉 VIP members receive exclusive discounts and priority support across all membership tiers!
            </p>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : plans.length === 0 ? (
        <Card className="max-w-md mx-auto">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No membership plans available at this time.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const isPopular = plan.duration >= 30 && plan.duration <= 31;
            return (
              <Card
                key={plan.id}
                className={`relative ${
                  isPopular ? 'border-primary shadow-soft' : ''
                }`}
              >
                {isPopular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{getDurationLabel(plan.duration)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="text-4xl font-bold">${plan.price.toFixed(2)}</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      per {getDurationLabel(plan.duration).toLowerCase()}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Platform access</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Provider consultations</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Care assistant</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Fitness access</span>
                    </li>
                  </ul>
                  <Button className="w-full" variant={isPopular ? 'default' : 'outline'}>
                    Select Plan
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

