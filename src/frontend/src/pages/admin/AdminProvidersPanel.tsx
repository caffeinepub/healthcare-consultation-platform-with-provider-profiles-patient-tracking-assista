import { useState } from 'react';
import { useListProviders, useAddProvider } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Video, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';

export default function AdminProvidersPanel() {
  const { data: providers = [], isLoading } = useListProviders();
  const addProvider = useAddProvider();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [location, setLocation] = useState('');
  const [online, setOnline] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !specialization.trim() || !location.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const randomPrincipal = Principal.fromText(
        `${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}-cai`
      );

      await addProvider.mutateAsync({
        id: randomPrincipal,
        name: name.trim(),
        specialization: specialization.trim(),
        location: location.trim(),
        online,
      });
      toast.success('Provider added successfully!');
      setDialogOpen(false);
      setName('');
      setSpecialization('');
      setLocation('');
      setOnline(true);
    } catch (error) {
      console.error('Add provider error:', error);
      toast.error('Failed to add provider');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Providers Management</CardTitle>
            <CardDescription>Add and manage healthcare providers</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Provider
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Provider</DialogTitle>
                <DialogDescription>Create a new healthcare provider profile</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Provider Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Jane Smith"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="Gynecology, Psychology, or Nutrition"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, State"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="online">Offers Online Consultations</Label>
                  <Switch id="online" checked={online} onCheckedChange={setOnline} />
                </div>
                <Button type="submit" className="w-full" disabled={addProvider.isPending}>
                  {addProvider.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Provider'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : providers.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No providers yet. Add your first provider!</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Services</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((provider) => (
                <TableRow key={provider.id.toString()}>
                  <TableCell className="font-medium">{provider.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{provider.specialization}</Badge>
                  </TableCell>
                  <TableCell>{provider.location}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

