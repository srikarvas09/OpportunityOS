// ============================================================
// Organizations Page — Partner Directory
// ============================================================
import { useEffect, useState } from 'react';
import { ExternalLink, MapPin, Building2, Globe } from 'lucide-react';
import * as api from '../services/api';
import type { Organization } from '../types/database';
import { Card, Badge, Spinner } from '../components/ui';
import { orgTypeConfig } from '../utils/helpers';
import { locations, opportunities } from '../data/mockDatabase';

export function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrganizations().then(o => { setOrgs(o); setLoading(false); });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner className="w-8 h-8" /></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Partner Organizations</h1>
        <p className="text-slate-500 mt-1">{orgs.length} organizations in our network</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {orgs.map(org => {
          const hq = org.hq_location_id ? locations.find(l => l.location_id === org.hq_location_id) : null;
          const orgOpps = opportunities.filter(o => o.org_id === org.org_id);
          const typeConf = orgTypeConfig[org.org_type];

          return (
            <Card key={org.org_id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-slate-500" />
                </div>
                <Badge className={`${typeConf.bg} ${typeConf.color} shrink-0`}>{org.org_type}</Badge>
              </div>
              <h3 className="font-semibold text-slate-900">{org.org_name}</h3>
              {hq && (
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{hq.city}, {hq.state}
                </p>
              )}
              {org.website && (
                <a href={org.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 mt-1 transition-colors">
                  <Globe className="w-3 h-3" />{org.website.replace('https://', '')}
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs text-slate-400">{orgOpps.length} posted opportunities</span>
                <div className="flex gap-1 flex-wrap justify-end">
                  {orgOpps.slice(0, 2).map(o => (
                    <span key={o.opp_id} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                      {o.opp_type}
                    </span>
                  ))}
                  {orgOpps.length > 2 && (
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">+{orgOpps.length - 2}</span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
