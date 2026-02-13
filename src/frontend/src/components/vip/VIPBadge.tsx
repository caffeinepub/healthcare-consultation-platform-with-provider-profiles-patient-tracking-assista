import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Crown } from 'lucide-react';

interface VIPBadgeProps {
  isVIP: boolean;
  className?: string;
}

export default function VIPBadge({ isVIP, className }: VIPBadgeProps) {
  if (!isVIP) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="default" className={className}>
            <Crown className="h-3 w-3 mr-1" />
            VIP
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Enjoy personalized VIP treatment with priority access and exclusive benefits</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

