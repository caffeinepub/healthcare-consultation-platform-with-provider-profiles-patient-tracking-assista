import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useListProviders } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, MapPin, Video, Building2 } from 'lucide-react';

const CATEGORIES = [
  { value: 'all', label: 'All Providers' },
  { value: 'gynecology', label: 'Gynecology' },
  { value: 'psychology', label: 'Psychology' },
  { value: 'nutrition', label: 'Nutrition' },
];

const CATEGORY_ICONS: Record<string, string> = {
  gynecology: '🩺',
  psychology: '🧠',
  nutrition: '🥗',
};

export default function ProvidersDirectoryPage() {
  const navigate = useNavigate();
  const { data: providers = [], isLoading } = useListProviders();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProviders = useMemo(() => {
    if (selectedCategory === 'all') return providers;
    return providers.filter((p) =>
      p.specialization.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  }, [providers, selectedCategory]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-b">
        <div className="container py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Connect with Expert Healthcare Providers
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Find specialized care from gynecologists, psychologists, and nutritionists. Book online or
                in-person consultations tailored to your needs.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Video className="h-4 w-4 text-primary" />
                  <span>Online Consultations</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span>In-Person Visits</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="/assets/generated/hero-illustration.dim_1600x900.png"
                alt="Healthcare illustration"
                className="w-full h-auto rounded-2xl shadow-soft"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Icons */}
      <section className="container py-12">
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          {['gynecology', 'psychology', 'nutrition'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                selectedCategory === category
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-4xl">{CATEGORY_ICONS[category]}</div>
              <span className="text-sm font-medium capitalize">{category}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Providers List */}
      <section className="container py-12">
        <div className="mb-8">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
              {CATEGORIES.map((cat) => (
                <TabsTrigger key={cat.value} value={cat.value}>
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProviders.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No providers found in this category.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <Card key={provider.id.toString()} className="hover:shadow-soft transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl">{provider.name}</CardTitle>
                    <Badge variant="secondary">{provider.specialization}</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {provider.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {provider.online && (
                      <Badge variant="outline" className="text-xs">
                        <Video className="h-3 w-3 mr-1" />
                        Online
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      <Building2 className="h-3 w-3 mr-1" />
                      In-Person
                    </Badge>
                  </div>
                  <Button
                    onClick={() =>
                      navigate({ to: '/providers/$providerId', params: { providerId: provider.id.toString() } })
                    }
                    className="w-full"
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

