import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ButtonLoading({ content }: { content: string }) {
  return (
    <Button className="w-full" size="sm" disabled>
      <Loader2Icon className="animate-spin" />
      {content}
    </Button>
  );
}
