import { useState } from 'react';
import { useListMembershipPlans, useAddMembershipPlan, useUpdateMembershipPlan, useDeleteMembershipPlan } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { MembershipPlan } from '@/backend';

export default function AdminMembershipPlansPanel() {
  const { data: plans = [], isLoading } = useListMembershipPlans();
  const addPlan = useAddMembershipPlan();
  const updatePlan = useUpdateMembershipPlan();
  const deletePlan = useDeleteMembershipPlan();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setDuration('');
    setEditingPlan(null);
  };

  const handleEdit = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setName(plan.name);
    setDescription(plan.description);
    setPrice(plan.price.toString());
    setDuration(plan.duration.toString());
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !price || !duration) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const planData: MembershipPlan = {
        id: editingPlan?.id || `plan_${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        duration: parseFloat(duration),
      };

      if (editingPlan) {
        await updatePlan.mutateAsync(planData);
        toast.success('Membership plan updated successfully!');
      } else {
        await addPlan.mutateAsync(planData);
        toast.success('Membership plan added successfully!');
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Membership plan error:', error);
      toast.error(`Failed to ${editingPlan ? 'update' : 'add'} membership plan`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this membership plan?')) return;

    try {
      await deletePlan.mutateAsync(id);
      toast.success('Membership plan deleted successfully!');
    } catch (error) {
      console.error('Delete membership plan error:', error);
      toast.error('Failed to delete membership plan');
    }
  };

  const getDurationLabel = (duration: number) => {
    if (duration <= 1) return 'Daily';
    if (duration <= 7) return 'Weekly';
    if (duration <= 31) return 'Monthly';
    return 'Yearly';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Membership Plans Management</CardTitle>
            <CardDescription>Add and manage membership pricing plans</CardDescription>
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
                Add Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingPlan ? 'Edit' : 'Add'} Membership Plan</DialogTitle>
                <DialogDescription>
                  {editingPlan ? 'Update' : 'Create'} a membership plan
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Plan Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Basic, Premium, etc."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Plan benefits and features..."
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (days)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="1, 7, 30, 365"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={addPlan.isPending || updatePlan.isPending}
                >
                  {addPlan.isPending || updatePlan.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingPlan ? 'Updating...' : 'Adding...'}
                    </>
                  ) : editingPlan ? (
                    'Update Plan'
                  ) : (
                    'Add Plan'
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
        ) : plans.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No membership plans yet. Add your first plan!</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{plan.description}</TableCell>
                  <TableCell>${plan.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{getDurationLabel(plan.duration)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(plan)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(plan.id)}
                        disabled={deletePlan.isPending}
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

