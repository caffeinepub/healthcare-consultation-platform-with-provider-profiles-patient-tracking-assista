import { useState } from 'react';
import AuthGate from '@/components/auth/AuthGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Pill, Calendar, Activity, Apple } from 'lucide-react';
import { toast } from 'sonner';

interface CareEntry {
  id: string;
  type: 'prescription' | 'record' | 'appointment' | 'habit' | 'nutrition';
  title: string;
  content: string;
  date: Date;
}

export default function MyCareAssistantPage() {
  return (
    <AuthGate>
      <MyCareContent />
    </AuthGate>
  );
}

function MyCareContent() {
  const [entries, setEntries] = useState<CareEntry[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [entryType, setEntryType] = useState<CareEntry['type']>('prescription');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const newEntry: CareEntry = {
      id: Date.now().toString(),
      type: entryType,
      title: title.trim(),
      content: content.trim(),
      date: new Date(),
    };

    setEntries([newEntry, ...entries]);
    toast.success('Entry added successfully!');
    setDialogOpen(false);
    setTitle('');
    setContent('');
  };

  const getEntryIcon = (type: CareEntry['type']) => {
    switch (type) {
      case 'prescription':
        return <Pill className="h-4 w-4" />;
      case 'record':
        return <FileText className="h-4 w-4" />;
      case 'appointment':
        return <Calendar className="h-4 w-4" />;
      case 'habit':
        return <Activity className="h-4 w-4" />;
      case 'nutrition':
        return <Apple className="h-4 w-4" />;
    }
  };

  const getEntryColor = (type: CareEntry['type']) => {
    switch (type) {
      case 'prescription':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'record':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
      case 'appointment':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'habit':
        return 'bg-orange-500/10 text-orange-700 dark:text-orange-400';
      case 'nutrition':
        return 'bg-pink-500/10 text-pink-700 dark:text-pink-400';
    }
  };

  const filterEntries = (type?: CareEntry['type']) => {
    if (!type) return entries;
    return entries.filter((e) => e.type === type);
  };

  return (
    <div className="container py-12 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Care Assistant</h1>
          <p className="text-muted-foreground">
            Track your health journey with personalized records and insights
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Care Entry</DialogTitle>
              <DialogDescription>Record a new item in your health timeline</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddEntry} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Entry Type</Label>
                <Select value={entryType} onValueChange={(v) => setEntryType(v as CareEntry['type'])}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="record">Medical Record</SelectItem>
                    <SelectItem value="appointment">Appointment Summary</SelectItem>
                    <SelectItem value="habit">Habit / Lifestyle Note</SelectItem>
                    <SelectItem value="nutrition">Nutrition Entry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief title for this entry"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Details</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Detailed information..."
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Add Entry
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="prescription">Prescriptions</TabsTrigger>
          <TabsTrigger value="record">Records</TabsTrigger>
          <TabsTrigger value="appointment">Appointments</TabsTrigger>
          <TabsTrigger value="habit">Habits</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <TimelineView entries={filterEntries()} getEntryIcon={getEntryIcon} getEntryColor={getEntryColor} />
        </TabsContent>
        <TabsContent value="prescription">
          <TimelineView
            entries={filterEntries('prescription')}
            getEntryIcon={getEntryIcon}
            getEntryColor={getEntryColor}
          />
        </TabsContent>
        <TabsContent value="record">
          <TimelineView entries={filterEntries('record')} getEntryIcon={getEntryIcon} getEntryColor={getEntryColor} />
        </TabsContent>
        <TabsContent value="appointment">
          <TimelineView
            entries={filterEntries('appointment')}
            getEntryIcon={getEntryIcon}
            getEntryColor={getEntryColor}
          />
        </TabsContent>
        <TabsContent value="habit">
          <TimelineView entries={filterEntries('habit')} getEntryIcon={getEntryIcon} getEntryColor={getEntryColor} />
        </TabsContent>
        <TabsContent value="nutrition">
          <TimelineView
            entries={filterEntries('nutrition')}
            getEntryIcon={getEntryIcon}
            getEntryColor={getEntryColor}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TimelineView({
  entries,
  getEntryIcon,
  getEntryColor,
}: {
  entries: CareEntry[];
  getEntryIcon: (type: CareEntry['type']) => React.ReactNode;
  getEntryColor: (type: CareEntry['type']) => string;
}) {
  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No entries yet. Start tracking your health journey!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        {entries.map((entry) => (
          <Card key={entry.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getEntryColor(entry.type)}>
                      {getEntryIcon(entry.type)}
                      <span className="ml-1 capitalize">{entry.type}</span>
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {entry.date.toLocaleDateString()} at {entry.date.toLocaleTimeString()}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{entry.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{entry.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

