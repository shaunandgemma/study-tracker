import React, { useEffect, useMemo, useState } from 'react';
import { FollowAlongProgramme } from './shared/FollowAlongProgramme.jsx';
import { createProtectedFollowAlongContentService } from '../../services/protectedFollowAlongContentService.js';
import { createFollowAlongPersistence } from '../../services/followAlongPersistenceService.js';
import { useAuth } from '../../features/auth/useAuth.js';
import { demoProgressStorage } from '../../features/demo/demoMode.js';
import { evaluateFollowAlongRouteAccess } from '../../features/access/followAlongAccessPolicy.js';

function PublishedProgramme({ config, onBackToLanding }) {
  const { isDemoAccount } = useAuth();
  const persistence = useMemo(
    () => createFollowAlongPersistence(config, isDemoAccount ? { storage: demoProgressStorage } : {}),
    [config, isDemoAccount]
  );
  return <FollowAlongProgramme config={config} persistence={persistence} extensions={[]} onBackToLanding={onBackToLanding} />;
}

export const PublishedFollowAlongView = ({
  programmeId,
  expectedExamId,
  selectedFromExamCatalogue = false,
  onBackToLanding
}) => {
  const service = useMemo(() => createProtectedFollowAlongContentService(), []);
  const [state, setState] = useState({ loading: true, config: null, error: '' });

  useEffect(() => {
    let active = true;
    if (!selectedFromExamCatalogue) {
      setState({ loading: false, config: null, error: 'Choose the Follow Along from the current exam catalogue.' });
      return () => { active = false; };
    }
    setState({ loading: true, config: null, error: '' });
    service.loadProgramme(expectedExamId, programmeId).then(result => {
      if (!active) return;
      if (!result.success) {
        setState({ loading: false, config: null, error: result.error || 'Unable to load this Follow Along.' });
        return;
      }
      const protectedFollowAlong = result.followAlong;
      const access = evaluateFollowAlongRouteAccess({
        programmeId,
        programme: protectedFollowAlong.programme,
        selectedExamId: expectedExamId,
        selectedFromExamCatalogue
      });
      setState(access.allowed
        ? { loading: false, config: protectedFollowAlong.config, error: '' }
        : { loading: false, config: null, error: access.reason });
    });
    return () => { active = false; };
  }, [expectedExamId, programmeId, selectedFromExamCatalogue, service]);

  if (state.loading) return <div className="flex min-h-[400px] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" /></div>;
  if (!state.config) return <div role="alert" className="rounded-xl border border-rose-800 bg-rose-950/40 p-5 text-sm text-rose-200"><strong>Protected Follow Along unavailable.</strong><p className="mt-2">{state.error}</p><button type="button" onClick={onBackToLanding} className="mt-4 rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white">Back to Follow Alongs</button></div>;
  return <PublishedProgramme config={state.config} onBackToLanding={onBackToLanding} />;
};
