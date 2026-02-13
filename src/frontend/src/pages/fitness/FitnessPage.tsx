import { useState, useMemo } from 'react';
import { useListFitnessListings } from '@/hooks/useQueries';
import { useGetVIPStatus } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import VIPBadge from '@/components/vip/VIPBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, MapPin, Video, Dumbbell, Music } from 'lucide-react';

export default function FitnessPage() {
  const { identity } = useInternetIdentity();
  const { data: fitnessListings = [], isLoading } = useListFitnessListings();
  const { data: isVIP = false } = useGetVIPStatus();
  const [typeFilter, setTypeFilter] = useState<'all' | 'Zumba' | 'Gym'>('all');
  const [modeFilter, setModeFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [locationSearch, setLocationSearch] = useState('');

  const filteredListings = useMemo(() => {
    return fitnessListings.filter((listing) => {
      if (typeFilter !== 'all' && !listing.typeOfClass.toLowerCase().includes(typeFilter.toLowerCase())) {
        return false;
      }
      if (modeFilter === 'online' && !listing.online) return false;
      if (modeFilter === 'offline' && listing.online) return false;
      if (
        modeFilter === 'offline' &&
        locationSearch &&
        !listing.location.toLowerCase().includes(locationSearch.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [fitnessListings, typeFilter, modeFilter, locationSearch]);

  return (
    <div className="container py-12 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">Fitness & Wellness</h1>
          {identity && <VIPBadge isVIP={isVIP} />}
        </div>
        <p className="text-muted-foreground">
          Discover Zumba classes and gym memberships, online or near you
        </p>
      </div>

      {identity && isVIP && (
        <Card className="mb-8 border-primary/50 bg-primary/5">
          <CardContent className="py-4">
            <p className="text-sm font-medium">
              🎉 As a VIP member, you enjoy priority booking and exclusive discounts on all fitness services!
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fitness Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="Zumba">
                  <Music className="h-4 w-4 mr-1" />
                  Zumba
                </TabsTrigger>
                <TabsTrigger value="Gym">
                  <Dumbbell className="h-4 w-4 mr-1" />
                  Gym
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mode & Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={modeFilter} onValueChange={(v) => setModeFilter(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="online">
                  <Video className="h-4 w-4 mr-1" />
                  Online
                </TabsTrigger>
                <TabsTrigger value="offline">
                  <MapPin className="h-4 w-4 mr-1" />
                  Offline
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {modeFilter === 'offline' && (
              <div className="space-y-2">
                <Label htmlFor="location">Search by Location</Label>
                <Input
                  id="location"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  placeholder="Enter city, area, or ZIP code..."
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredListings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No fitness listings match your filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-soft transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-xl">{listing.name}</CardTitle>
                  <Badge variant="secondary">{listing.typeOfClass}</Badge>
                </div>
                <CardDescription className="flex items-center gap-1">
                  {listing.online ? (
                    <>
                      <Video className="h-3 w-3" />
                      Online
                    </>
                  ) : (
                    <>
                      <MapPin className="h-3 w-3" />
                      {listing.location}
                    </>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{listing.duration} min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cost:</span>
                    <span className="font-medium">${listing.cost.toFixed(2)}</span>
                  </div>
                  <Button className="w-full mt-2">View Plans</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

