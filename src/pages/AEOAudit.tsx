import { CrawlOverview } from '@/components/site-audit/CrawlOverview';
import { AEOIssuesSection } from '@/components/site-audit/AEOIssuesSection';

function AEOAudit() {
  return (
    <div className="space-y-8 h-full">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">AEO Audit</h1>
        <p className="text-muted-foreground">
          Comprehensive analysis of your website's Answer Engine Optimization performance, AI citation issues, and revenue opportunities
        </p>
      </div>

      <CrawlOverview />
      <AEOIssuesSection />
    </div>
  );
}

export default AEOAudit;