import { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import AuthGate from '@/components/auth/AuthGate';
import { useGetConsultations, useListProviders, useRequestConsultation } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, Calendar, Video, Building2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { ConsultationStatus } from '@/backend';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  confirmed: 'bg-green-500/10 text-green-700 dark:text-green-400',
  completed: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  cancelled: 'bg-red-500/10 text-red-700 dark:text-red-400',
};

export default function ConsultationsPage() {
  return (
    <AuthGate>
      <ConsultationsContent />
    </AuthGate>
  );
}

function ConsultationsContent() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/consultations' }) as any;
  const { identity } = useInternetIdentity();
  const { data: consultations = [], isLoading } = useGetConsultations();
  const { data: providers = [] } = useListProviders();
  const requestConsultation = useRequestConsultation();

  const [dialogOpen, setDialogOpen] = useState(!!search?.providerId);
  const [selectedProvider, setSelectedProvider] = useState(search?.providerId || '');
  const [modality, setModality] = useState('online');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProvider || !preferredDate || !preferredTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const dateTime = new Date(`${preferredDate}T${preferredTime}`);
      await requestConsultation.mutateAsync({
        patientId: identity!.getPrincipal(),
        providerId: selectedProvider as any,
        modality,
        time: BigInt(dateTime.getTime() * 1_000_000),
        notes,
      });
      toast.success('Consultation request submitted successfully!');
      setDialogOpen(false);
      setSelectedProvider('');
      setModality('online');
      setPreferredDate('');
      setPreferredTime('');
      setNotes('');
      if (search?.providerId) {
        navigate({ to: '/consultations' });
      }
    } catch (error) {
      console.error('Request consultation error:', error);
      toast.error('Failed to submit consultation request');
    }
  };

  return (
    <div className="container py-12 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Consultations</h1>
          <p className="text-muted-foreground">Manage your appointments with healthcare providers</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Request Consultation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Request a Consultation</DialogTitle>
              <DialogDescription>
                Choose a provider and preferred time for your consultation
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider">
                  Provider <span className="text-destructive">*</span>
                </Label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider} required>
                  <SelectTrigger id="provider">
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((provider) => (
                      <SelectItem key={provider.id.toString()} value={provider.id.toString()}>
                        {provider.name} - {provider.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="modality">
                  Consultation Type <span className="text-destructive">*</span>
                </Label>
                <Select value={modality} onValueChange={setModality} required>
                  <SelectTrigger id="modality">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online (Video Call)</SelectItem>
                    <SelectItem value="offline">In-Person Visit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">
                    Preferred Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">
                    Preferred Time <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific concerns or requirements..."
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full" disabled={requestConsultation.isPending}>
                {requestConsultation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : consultations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">You don't have any consultations yet.</p>
            <Button onClick={() => setDialogOpen(true)}>Request Your First Consultation</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {consultations.map((consultation) => {
            const provider = providers.find((p) => p.id.toString() === consultation.providerId.toString());
            const date = new Date(Number(consultation.time) / 1_000_000);

            return (
              <Card key={consultation.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{provider?.name || 'Unknown Provider'}</CardTitle>
                      <CardDescription>{provider?.specialization}</CardDescription>
                    </div>
                    <Badge className={STATUS_COLORS[consultation.status]}>
                      {consultation.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{date.toLocaleDateString()} at {date.toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {consultation.modality === 'online' ? (
                        <>
                          <Video className="h-4 w-4 text-muted-foreground" />
                          <span>Online Consultation</span>
                        </>
                      ) : (
                        <>
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>In-Person Visit</span>
                        </>
                      )}
                    </div>
                  </div>
                  {consultation.notes && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">{consultation.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

