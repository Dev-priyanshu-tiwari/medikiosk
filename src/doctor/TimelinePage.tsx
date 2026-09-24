import React from 'react';
import { Card, PageTitle, Timeline, Badge } from '../ui';
import { DEMO_TIMELINE } from '../demo';

export function TimelinePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle
        title="Medical Timeline — Rajesh Kumar"
        sub="Combined view: kiosk conversation + document extraction"
      />
      <div className="mb-4 flex gap-2">
        <Badge tone="blue">Document</Badge>
        <Badge tone="teal">Patient</Badge>
        <Badge tone="rose">Current visit</Badge>
      </div>
      <Card className="p-6">
        <Timeline events={DEMO_TIMELINE} compact />
      </Card>
    </div>
  );
}
