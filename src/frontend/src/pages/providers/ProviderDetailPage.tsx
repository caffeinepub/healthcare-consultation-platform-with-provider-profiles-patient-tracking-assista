import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetProvider } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, MapPin, Video, Building2, Calendar, ArrowLeft } from 'lucide-react';

export default function ProviderDetailPage() {
  const { providerId } = useParams({ from: '/providers/$providerId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: provider, isLoading } = useGetProvider(providerId);

  const isAuthenticated = !!identity;

  const handleBookConsultation = () => {
    if (!isAuthenticated) {
      navigate({ to: '/consultations' });
    } else {
      navigate({ to: '/consultations', search: { providerId } });
    }
  };

  if (isLoading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="container py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Provider not found.</p>
            <Button onClick={() => navigate({ to: '/providers' })} className="mt-4">
              Back to Providers
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/providers' })}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Providers
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl mb-2">{provider.name}</CardTitle>
              <CardDescription className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {provider.location}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              {provider.specialization}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Consultation Options</h3>
            <div className="flex flex-wrap gap-3">
              {provider.online && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50">
                  <Video className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Online Consultation</p>
                    <p className="text-xs text-muted-foreground">Video call from anywhere</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">In-Person Visit</p>
                  <p className="text-xs text-muted-foreground">Visit at {provider.location}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">About</h3>
            <p className="text-muted-foreground">
              {provider.name} is a qualified {provider.specialization.toLowerCase()} specialist providing
              comprehensive care. They offer both online and in-person consultations to meet your healthcare
              needs.
            </p>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button onClick={handleBookConsultation} size="lg" className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Book Consultation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

