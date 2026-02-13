import { useState, useEffect } from 'react';
import AuthGate from '@/components/auth/AuthGate';
import { useGetCallerUserProfile } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Apple, Loader2, Sparkles } from 'lucide-react';
import { generateNutritionRecommendations } from '@/lib/nutrition/rules';

export default function NutritionPage() {
  return (
    <AuthGate>
      <NutritionContent />
    </AuthGate>
  );
}

function NutritionContent() {
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const [goals, setGoals] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState('');
  const [allergies, setAllergies] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    if (userProfile && goals) {
      const recs = generateNutritionRecommendations({
        profile: userProfile,
        goals,
        dietaryPreferences,
        allergies,
        activityLevel,
      });
      setRecommendations(recs);
    }
  }, [userProfile, goals, dietaryPreferences, allergies, activityLevel]);

  if (profileLoading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Nutrition Guidance</h1>
        <p className="text-muted-foreground">
          Get personalized nutrition recommendations based on your profile and goals
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Nutrition Survey</CardTitle>
            <CardDescription>Tell us about your dietary needs and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goals">Health & Nutrition Goals</Label>
              <Textarea
                id="goals"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="e.g., Weight loss, muscle gain, better energy..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dietary">Dietary Preferences</Label>
              <Textarea
                id="dietary"
                value={dietaryPreferences}
                onChange={(e) => setDietaryPreferences(e.target.value)}
                placeholder="e.g., Vegetarian, vegan, keto, Mediterranean..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies & Restrictions</Label>
              <Textarea
                id="allergies"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g., Nuts, dairy, gluten..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activity">Activity Level</Label>
              <Select value={activityLevel} onValueChange={setActivityLevel}>
                <SelectTrigger id="activity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                  <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                  <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                  <SelectItem value="very-active">Very Active (intense daily)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Your Recommendations
            </CardTitle>
            <CardDescription>Personalized guidance based on your inputs</CardDescription>
          </CardHeader>
          <CardContent>
            {!goals ? (
              <div className="py-12 text-center">
                <Apple className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Fill in your nutrition survey to receive personalized recommendations
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div key={index} className="p-3 bg-secondary/50 rounded-lg">
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

