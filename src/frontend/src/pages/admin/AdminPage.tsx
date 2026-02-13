import { useState } from 'react';
import { useIsCallerAdmin } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ShieldAlert } from 'lucide-react';
import AdminProvidersPanel from './AdminProvidersPanel';
import AdminFitnessPanel from './AdminFitnessPanel';
import AdminMembershipPlansPanel from './AdminMembershipPlansPanel';

export default function AdminPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  if (!identity) {
    return (
      <div className="container py-16 max-w-md mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <ShieldAlert className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Please log in to access the admin area.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-16 max-w-md mx-auto">
        <Card className="border-destructive">
          <CardContent className="py-12 text-center">
            <ShieldAlert className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You do not have permission to access the admin area.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage providers, fitness listings, and membership plans</p>
      </div>

      <Alert className="mb-8">
        <AlertDescription>
          You have admin access. Changes made here will be reflected across the platform immediately.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="providers" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="fitness">Fitness Listings</TabsTrigger>
          <TabsTrigger value="plans">Membership Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="providers">
          <AdminProvidersPanel />
        </TabsContent>

        <TabsContent value="fitness">
          <AdminFitnessPanel />
        </TabsContent>

        <TabsContent value="plans">
          <AdminMembershipPlansPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

