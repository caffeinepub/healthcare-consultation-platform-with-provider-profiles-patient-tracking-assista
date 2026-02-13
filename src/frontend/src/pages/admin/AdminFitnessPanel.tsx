import { useState } from 'react';
import { useListFitnessListings, useAddFitnessListing, useUpdateFitnessListing, useDeleteFitnessListing } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { FitnessListing } from '@/backend';

export default function AdminFitnessPanel() {
  const { data: listings = [], isLoading } = useListFitnessListings();
  const addListing = useAddFitnessListing();
  const updateListing = useUpdateFitnessListing();
  const deleteListing = useDeleteFitnessListing();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<FitnessListing | null>(null);
  const [name, setName] = useState('');
  const [typeOfClass, setTypeOfClass] = useState('');
  const [location, setLocation] = useState('');
  const [online, setOnline] = useState(false);
  const [cost, setCost] = useState('');
  const [duration, setDuration] = useState('');

  const resetForm = () => {
    setName('');
    setTypeOfClass('');
    setLocation('');
    setOnline(false);
    setCost('');
    setDuration('');
    setEditingListing(null);
  };

  const handleEdit = (listing: FitnessListing) => {
    setEditingListing(listing);
    setName(listing.name);
    setTypeOfClass(listing.typeOfClass);
    setLocation(listing.location);
    setOnline(listing.online);
    setCost(listing.cost.toString());
    setDuration(listing.duration.toString());
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !typeOfClass.trim() || !location.trim() || !cost || !duration) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const listingData: FitnessListing = {
        id: editingListing?.id || `fitness_${Date.now()}`,
        name: name.trim(),
        typeOfClass: typeOfClass.trim(),
        location: location.trim(),
        online,
        cost: parseFloat(cost),
        duration: parseFloat(duration),
      };

      if (editingListing) {
        await updateListing.mutateAsync(listingData);
        toast.success('Fitness listing updated successfully!');
      } else {
        await addListing.mutateAsync(listingData);
        toast.success('Fitness listing added successfully!');
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Fitness listing error:', error);
      toast.error(`Failed to ${editingListing ? 'update' : 'add'} fitness listing`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fitness listing?')) return;

    try {
      await deleteListing.mutateAsync(id);
      toast.success('Fitness listing deleted successfully!');
    } catch (error) {
      console.error('Delete fitness listing error:', error);
      toast.error('Failed to delete fitness listing');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Fitness Listings Management</CardTitle>
            <CardDescription>Add and manage Zumba and gym offerings</CardDescription>
          </div>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Listing
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingListing ? 'Edit' : 'Add'} Fitness Listing</DialogTitle>
                <DialogDescription>
                  {editingListing ? 'Update' : 'Create'} a fitness listing
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Morning Zumba Class"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Input
                    id="type"
                    value={typeOfClass}
                    onChange={(e) => setTypeOfClass(e.target.value)}
                    placeholder="Zumba or Gym"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, State or 'Online'"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost ($)</Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      min="0"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (min)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="online">Online Offering</Label>
                  <Switch id="online" checked={online} onCheckedChange={setOnline} />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={addListing.isPending || updateListing.isPending}
                >
                  {addListing.isPending || updateListing.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingListing ? 'Updating...' : 'Adding...'}
                    </>
                  ) : editingListing ? (
                    'Update Listing'
                  ) : (
                    'Add Listing'
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
        ) : listings.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No fitness listings yet. Add your first listing!</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium">{listing.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{listing.typeOfClass}</Badge>
                  </TableCell>
                  <TableCell>
                    {listing.online ? (
                      <Badge variant="outline">Online</Badge>
                    ) : (
                      listing.location
                    )}
                  </TableCell>
                  <TableCell>${listing.cost.toFixed(2)}</TableCell>
                  <TableCell>{listing.duration} min</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(listing)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(listing.id)}
                        disabled={deleteListing.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

