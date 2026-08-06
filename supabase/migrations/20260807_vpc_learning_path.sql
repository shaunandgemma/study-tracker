-- ============================================================
-- ExamPulse / Study Tracker: VPC Learning Path Isolation Migration
-- Target Tables: user_learning_path_progress, user_learning_path_resources
-- Zero-regression isolation requirement: Does not alter hands_on_task_progress
-- ============================================================

-- 1. Table: user_learning_path_progress
CREATE TABLE IF NOT EXISTS public.user_learning_path_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    path_id TEXT NOT NULL DEFAULT 'vpc-learning-path',
    preferred_mode TEXT NOT NULL DEFAULT 'console' CHECK (preferred_mode IN ('console', 'cli', 'both')),
    current_task_id TEXT NOT NULL DEFAULT 'task-saa-vpc-design-a-vpc-cidr-plan-001',
    completed_task_ids TEXT[] NOT NULL DEFAULT '{}',
    task_mode_history JSONB NOT NULL DEFAULT '{}',
    task_step_progress JSONB NOT NULL DEFAULT '{}',
    resource_decisions JSONB NOT NULL DEFAULT '{}',
    nat_branch_state JSONB NOT NULL DEFAULT '{}',
    completion_status TEXT NOT NULL DEFAULT 'in_progress' CHECK (completion_status IN ('in_progress', 'completed_retained', 'completed_cleaned')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    CONSTRAINT unique_user_learning_path UNIQUE (user_id, path_id)
);

-- 2. Table: user_learning_path_resources
CREATE TABLE IF NOT EXISTS public.user_learning_path_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    path_id TEXT NOT NULL DEFAULT 'vpc-learning-path',
    region TEXT NOT NULL DEFAULT 'eu-west-2',
    resources JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_path_resources UNIQUE (user_id, path_id)
);

-- 3. Trigger Function for updated_at
CREATE OR REPLACE FUNCTION public.update_vpc_path_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_user_learning_path_progress_updated_at ON public.user_learning_path_progress;
CREATE TRIGGER trigger_user_learning_path_progress_updated_at
    BEFORE UPDATE ON public.user_learning_path_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_vpc_path_updated_at();

DROP TRIGGER IF EXISTS trigger_user_learning_path_resources_updated_at ON public.user_learning_path_resources;
CREATE TRIGGER trigger_user_learning_path_resources_updated_at
    BEFORE UPDATE ON public.user_learning_path_resources
    FOR EACH ROW EXECUTE FUNCTION public.update_vpc_path_updated_at();

-- 4. Enable Row Level Security
ALTER TABLE public.user_learning_path_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_path_resources ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies: user_learning_path_progress
DROP POLICY IF EXISTS "Users view own path progress" ON public.user_learning_path_progress;
CREATE POLICY "Users view own path progress" ON public.user_learning_path_progress FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own path progress" ON public.user_learning_path_progress;
CREATE POLICY "Users insert own path progress" ON public.user_learning_path_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own path progress" ON public.user_learning_path_progress;
CREATE POLICY "Users update own path progress" ON public.user_learning_path_progress FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own path progress" ON public.user_learning_path_progress;
CREATE POLICY "Users delete own path progress" ON public.user_learning_path_progress FOR DELETE USING (auth.uid() = user_id);

-- 6. RLS Policies: user_learning_path_resources
DROP POLICY IF EXISTS "Users view own path resources" ON public.user_learning_path_resources;
CREATE POLICY "Users view own path resources" ON public.user_learning_path_resources FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own path resources" ON public.user_learning_path_resources;
CREATE POLICY "Users insert own path resources" ON public.user_learning_path_resources FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own path resources" ON public.user_learning_path_resources;
CREATE POLICY "Users update own path resources" ON public.user_learning_path_resources FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own path resources" ON public.user_learning_path_resources;
CREATE POLICY "Users delete own path resources" ON public.user_learning_path_resources FOR DELETE USING (auth.uid() = user_id);
