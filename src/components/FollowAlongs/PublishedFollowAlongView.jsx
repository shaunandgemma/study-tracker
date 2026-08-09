import React, { useEffect, useMemo, useState } from 'react';
import { FollowAlongProgramme } from './shared/FollowAlongProgramme.jsx';
import { createPublishedFollowAlongService } from '../../features/followAlongs/published/publishedFollowAlongService.js';
import { createFollowAlongPersistence } from '../../services/followAlongPersistenceService.js';

function PublishedProgramme({ config, onBackToLanding }) {
  const persistence = useMemo(() => createFollowAlongPersistence(config), [config]);
  return <FollowAlongProgramme config={config} persistence={persistence} extensions={[]} onBackToLanding={onBackToLanding} />;
}

export const PublishedFollowAlongView = ({ programmeId, onBackToLanding }) => {
  const service = useMemo(() => createPublishedFollowAlongService(), []);
  const [state, setState] = useState({ loading: true, config: null, error: '' });

  useEffect(() => {
    let active = true;
    setState({ loading: true, config: null, error: '' });
    service.loadPublishedProgramme(programmeId).then(result => {
      if (!active) return;
      setState(result.success
        ? { loading: false, config: result.config, error: '' }
        : { loading: false, config: null, error: result.error || 'Unable to load this Follow Along.' });
    });
    return () => { active = false; };
  }, [programmeId, service]);

  if (state.loading) return <div className="flex min-h-[400px] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" /></div>;
  if (!state.config) return <div role="alert" className="rounded-xl border border-rose-800 bg-rose-950/40 p-5 text-sm text-rose-200"><strong>Published Follow Along unavailable.</strong><p className="mt-2">{state.error}</p><button type="button" onClick={onBackToLanding} className="mt-4 rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white">Back to Follow Alongs</button></div>;
  return <PublishedProgramme config={state.config} onBackToLanding={onBackToLanding} />;
};
