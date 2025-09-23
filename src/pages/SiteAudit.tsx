import { CrawlOverview } from '@/components/site-audit/CrawlOverview';
import { IssuesSection } from '@/components/site-audit/IssuesSection';

export default function SiteAudit() {
  return (
    <div className="space-y-8 h-full">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Site Audit</h1>
        <p className="text-muted-foreground">
          Comprehensive analysis of your website's SEO performance, technical issues, and optimization opportunities
        </p>
      </div>

      <CrawlOverview />
      <IssuesSection />
    </div>
  );
}