import { useState } from 'react';
import AuthGate from '@/components/auth/AuthGate';
import ProfileSetupModal from '@/components/auth/ProfileSetupModal';
import { useGetCallerUserProfile, useSaveCallerUserProfile, useGetVIPStatus } from '@/hooks/useQueries';
import VIPBadge from '@/components/vip/VIPBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Loader2, User, Crown } from 'lucide-react';
import { toast } from 'sonner';

export default function AccountPage() {
  return (
    <AuthGate>
      <AccountContent />
    </AuthGate>
  );
}

function AccountContent() {
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isVIP = false } = useGetVIPStatus();
  const saveProfile = useSaveCallerUserProfile();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [description, setDescription] = useState('');
  const [preferences, setPreferences] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const showProfileSetup = !profileLoading && isFetched && userProfile === null;

  // Initialize form when profile loads
  if (userProfile && !isEditing && !name) {
    setName(userProfile.name);
    setAge(userProfile.age.toString());
    setDescription(userProfile.description);
    setPreferences(userProfile.preferences);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !age) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        id: userProfile!.id,
        name: name.trim(),
        age: BigInt(parseInt(age)),
        description: description.trim(),
        preferences: preferences.trim(),
        isVIP: userProfile!.isVIP,
      });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    }
  };

  if (profileLoading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <ProfileSetupModal open={showProfileSetup} />
      <div className="container py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Account</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Your personal details and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">
                    Age <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    disabled={!isEditing}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">About You</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferences">Preferences</Label>
                  <Textarea
                    id="preferences"
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                    disabled={!isEditing}
                    rows={2}
                  />
                </div>
                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <Button type="submit" disabled={saveProfile.isPending}>
                        {saveProfile.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          if (userProfile) {
                            setName(userProfile.name);
                            setAge(userProfile.age.toString());
                            setDescription(userProfile.description);
                            setPreferences(userProfile.preferences);
                          }
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className={isVIP ? 'border-primary/50 bg-primary/5' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Crown className="h-5 w-5" />
                  Membership Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <VIPBadge isVIP={isVIP} />
                  </div>
                  {isVIP && (
                    <p className="text-xs text-muted-foreground">
                      You're enjoying VIP benefits including priority access and exclusive discounts!
                    </p>
                  )}
                  {!isVIP && (
                    <p className="text-xs text-muted-foreground">
                      Upgrade to VIP for personalized treatment at low cost.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Member since:</span>
                  <span className="font-medium">Recently</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Profile complete:</span>
                  <span className="font-medium">
                    {userProfile?.description && userProfile?.preferences ? '100%' : '75%'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

