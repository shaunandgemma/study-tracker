-- ============================================================
-- MIGRATION: Hands-On Tasks & Guided AWS Labs
-- Target Tables: hands_on_tasks, hands_on_task_progress
-- ============================================================

-- 1. Table: hands_on_tasks (Centrally managed published task definitions)
CREATE TABLE IF NOT EXISTS public.hands_on_tasks (
    id TEXT PRIMARY KEY,
    exam_code TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    service TEXT NOT NULL,
    feature TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    estimated_minutes INTEGER NOT NULL DEFAULT 20,
    region TEXT NOT NULL DEFAULT 'eu-west-2',
    content JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for efficient querying by exam and topic
CREATE INDEX IF NOT EXISTS idx_hands_on_tasks_exam_topic 
    ON public.hands_on_tasks (exam_code, topic_id) 
    WHERE status = 'published';

-- 2. Table: hands_on_task_progress (User progress per task)
CREATE TABLE IF NOT EXISTS public.hands_on_task_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_id TEXT NOT NULL REFERENCES public.hands_on_tasks(id) ON DELETE CASCADE,
    selected_mode TEXT NOT NULL DEFAULT 'console' CHECK (selected_mode IN ('console', 'cli')),
    console_completed_items TEXT[] NOT NULL DEFAULT '{}',
    cli_completed_items TEXT[] NOT NULL DEFAULT '{}',
    verification_completed_items TEXT[] NOT NULL DEFAULT '{}',
    cleanup_completed_items TEXT[] NOT NULL DEFAULT '{}',
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_task_progress UNIQUE (user_id, task_id)
);

-- Index for fast user progress lookups
CREATE INDEX IF NOT EXISTS idx_hands_on_task_progress_user 
    ON public.hands_on_task_progress (user_id);

-- 3. Row Level Security (RLS)
ALTER TABLE public.hands_on_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hands_on_task_progress ENABLE ROW LEVEL SECURITY;

-- Read policy for tasks: Anyone (authenticated or anon) can read published tasks
CREATE POLICY "Allow public read access for published tasks"
    ON public.hands_on_tasks
    FOR SELECT
    USING (status = 'published');

-- RLS policies for task progress: Users can only read and write their own progress
CREATE POLICY "Users can view own task progress"
    ON public.hands_on_task_progress
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own task progress"
    ON public.hands_on_task_progress
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own task progress"
    ON public.hands_on_task_progress
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own task progress"
    ON public.hands_on_task_progress
    FOR DELETE
    USING (auth.uid() = user_id);

-- 4. Seed Task Definition: S3 Versioning Task 001
INSERT INTO public.hands_on_tasks (
    id,
    exam_code,
    topic_id,
    title,
    slug,
    service,
    feature,
    difficulty,
    estimated_minutes,
    region,
    status,
    content
) VALUES (
    'task-saa-s3-versioning-001',
    'aws-saa-c03',
    'topic-s3',
    'Create a test S3 bucket and turn on versioning',
    's3-enable-versioning',
    'Amazon S3',
    'Versioning',
    'Easy',
    25,
    'eu-west-2',
    'published',
$content$
{
    "id": "task-saa-s3-versioning-001",
    "examCode": "aws-saa-c03",
    "topicId": "topic-s3",
    "title": "Create a test S3 bucket and turn on versioning",
    "slug": "s3-enable-versioning",
    "service": "Amazon S3",
    "feature": "Versioning",
    "difficulty": "Easy",
    "estimatedMinutes": 25,
    "region": "eu-west-2",
    "goal": "Create a test Amazon S3 bucket, turn on versioning, upload test files, and prove that S3 keeps older versions after changes or deletes.",
    "status": "published",
    "tags": [
        "S3",
        "Versioning",
        "Delete markers",
        "Object Storage"
    ],
    "flow": [
        "Create bucket",
        "Enable versioning",
        "Upload object",
        "Upload changed object",
        "View versions",
        "Delete object",
        "Inspect delete marker",
        "Clean up"
    ],
    "concepts": [
        {
            "id": "concept-1",
            "title": "Versioning",
            "body": "Amazon S3 can keep multiple versions of the same object key in the same bucket."
        },
        {
            "id": "concept-2",
            "title": "Object key",
            "body": "The object key is the file path/name inside the bucket, such as notes.txt."
        },
        {
            "id": "concept-3",
            "title": "Overwrite behavior",
            "body": "Uploading a file with an existing key creates a new version instead of permanently overwriting the old version."
        },
        {
            "id": "concept-4",
            "title": "Delete marker",
            "body": "Deleting a versioned object adds a delete marker. Older versions still exist and can be restored."
        },
        {
            "id": "concept-5",
            "title": "Versioning cannot be disabled",
            "body": "After enabling versioning, you can only suspend it. You cannot return the bucket to the unversioned state."
        },
        {
            "id": "concept-6",
            "title": "Cost reminder",
            "body": "Each stored version incurs standard storage charges. Old versions are real stored objects."
        }
    ],
    "whyItMatters": "Amazon S3 versioning protects against accidental overwrites and deletes. It is a fundamental building block for backup, recovery, and secure object storage design.",
    "values": [
        {
            "label": "Region",
            "value": "eu-west-2"
        },
        {
            "label": "Bucket name",
            "value": "s3-task-2-versioning-[account-id]"
        },
        {
            "label": "Test object",
            "value": "notes.txt"
        },
        {
            "label": "Versioning status",
            "value": "Enabled"
        },
        {
            "label": "Console location",
            "value": "S3 -> Bucket -> Properties -> Bucket Versioning"
        },
        {
            "label": "CLI command",
            "value": "put-bucket-versioning"
        }
    ],
    "costWarning": "This lab costs minimal amounts if tiny test files are used and resources are torn down promptly. S3 charges apply to object storage, API requests, and non-current versions. Delete all versions and delete markers during cleanup.",
    "consoleSteps": [
        {
            "id": "console-step-1",
            "number": 1,
            "title": "Start from AWS login",
            "instructions": [
                {
                    "id": "console-step-1-item-1",
                    "text": "Sign in to the AWS Management Console."
                },
                {
                    "id": "console-step-1-item-2",
                    "text": "Use an admin user or lab role with S3 permissions."
                },
                {
                    "id": "console-step-1-item-3",
                    "text": "Use the Region eu-west-2 (Europe London) for this lab."
                }
            ],
            "expectedResult": "Signed into the AWS Management Console in Region eu-west-2."
        },
        {
            "id": "console-step-2",
            "number": 2,
            "title": "Create the S3 bucket",
            "instructions": [
                {
                    "id": "console-step-2-item-1",
                    "text": "Open Amazon S3 from the Console service menu."
                },
                {
                    "id": "console-step-2-item-2",
                    "text": "Click Create bucket."
                },
                {
                    "id": "console-step-2-item-3",
                    "text": "Enter Bucket name: s3-task-2-versioning-[account-id] (replace [account-id] with your real AWS account ID or unique string)."
                },
                {
                    "id": "console-step-2-item-4",
                    "text": "Select AWS Region: Europe (London) eu-west-2."
                },
                {
                    "id": "console-step-2-item-5",
                    "text": "Keep Block all public access enabled."
                },
                {
                    "id": "console-step-2-item-6",
                    "text": "Click Create bucket at the bottom of the page."
                }
            ],
            "note": "S3 bucket names are globally unique across all AWS accounts. Appending your account ID prevents naming collisions.",
            "expectedResult": "The bucket appears in your Amazon S3 bucket list."
        },
        {
            "id": "console-step-3",
            "number": 3,
            "title": "Turn on bucket versioning",
            "instructions": [
                {
                    "id": "console-step-3-item-1",
                    "text": "Click on your new bucket name to open it."
                },
                {
                    "id": "console-step-3-item-2",
                    "text": "Select the Properties tab."
                },
                {
                    "id": "console-step-3-item-3",
                    "text": "Locate the Bucket Versioning panel."
                },
                {
                    "id": "console-step-3-item-4",
                    "text": "Click Edit."
                },
                {
                    "id": "console-step-3-item-5",
                    "text": "Select Enable."
                },
                {
                    "id": "console-step-3-item-6",
                    "text": "Click Save changes."
                }
            ],
            "warning": "Once versioning is enabled on a bucket, it can be suspended later, but cannot be returned to the unversioned state.",
            "expectedResult": "Bucket Versioning status displays Enabled under Properties."
        },
        {
            "id": "console-step-4",
            "number": 4,
            "title": "Upload the first test file",
            "instructions": [
                {
                    "id": "console-step-4-item-1",
                    "text": "Create a small text file on your local machine named notes.txt."
                },
                {
                    "id": "console-step-4-item-2",
                    "text": "Add simple text inside the file: version 1."
                },
                {
                    "id": "console-step-4-item-3",
                    "text": "In the bucket Objects tab, click Upload."
                },
                {
                    "id": "console-step-4-item-4",
                    "text": "Add notes.txt and click Upload."
                },
                {
                    "id": "console-step-4-item-5",
                    "text": "Confirm notes.txt appears in the object list."
                }
            ],
            "note": "This object represents Version 1.",
            "expectedResult": "notes.txt is uploaded successfully to the root of the bucket."
        },
        {
            "id": "console-step-5",
            "number": 5,
            "title": "Upload a changed version",
            "instructions": [
                {
                    "id": "console-step-5-item-1",
                    "text": "Edit local notes.txt file to change its content to: version 2."
                },
                {
                    "id": "console-step-5-item-2",
                    "text": "Upload the modified notes.txt to the exact same S3 bucket."
                },
                {
                    "id": "console-step-5-item-3",
                    "text": "Keep the object key identical (notes.txt)."
                },
                {
                    "id": "console-step-5-item-4",
                    "text": "Confirm the upload completes."
                }
            ],
            "note": "Because versioning is enabled, S3 stores the new content as a separate version while preserving the previous version.",
            "expectedResult": "The upload succeeds without deleting the previous version."
        },
        {
            "id": "console-step-6",
            "number": 6,
            "title": "Show object versions",
            "instructions": [
                {
                    "id": "console-step-6-item-1",
                    "text": "In the S3 bucket object list, toggle on Show versions."
                },
                {
                    "id": "console-step-6-item-2",
                    "text": "Locate notes.txt."
                },
                {
                    "id": "console-step-6-item-3",
                    "text": "Verify that two versions of notes.txt are listed."
                },
                {
                    "id": "console-step-6-item-4",
                    "text": "Note that each version has a distinct Version ID."
                }
            ],
            "note": "This confirms versioning is functioning correctly.",
            "expectedResult": "Two versions of notes.txt are displayed under the object hierarchy."
        },
        {
            "id": "console-step-7",
            "number": 7,
            "title": "Delete the object and view the delete marker",
            "instructions": [
                {
                    "id": "console-step-7-item-1",
                    "text": "Select notes.txt and click Delete."
                },
                {
                    "id": "console-step-7-item-2",
                    "text": "Confirm deletion by typing delete."
                },
                {
                    "id": "console-step-7-item-3",
                    "text": "Ensure Show versions remains enabled."
                },
                {
                    "id": "console-step-7-item-4",
                    "text": "Observe the Delete marker listed at the top of the version stack."
                },
                {
                    "id": "console-step-7-item-5",
                    "text": "Confirm older versions still exist beneath the delete marker."
                }
            ],
            "warning": "A standard delete on a versioned object inserts a delete marker. It does not permanently remove older versions.",
            "expectedResult": "A Delete marker is created as the current version; earlier versions remain intact."
        },
        {
            "id": "console-step-8",
            "number": 8,
            "title": "Verify the lab",
            "instructions": [
                {
                    "id": "console-step-8-item-1",
                    "text": "Confirm Bucket versioning status is Enabled."
                },
                {
                    "id": "console-step-8-item-2",
                    "text": "Confirm notes.txt has multiple historical versions."
                },
                {
                    "id": "console-step-8-item-3",
                    "text": "Confirm deleting the object placed a Delete marker."
                },
                {
                    "id": "console-step-8-item-4",
                    "text": "Confirm older versions are visible when Show versions is on."
                }
            ],
            "expectedResult": "All lab verification criteria are satisfied."
        },
        {
            "id": "console-step-9",
            "number": 9,
            "title": "Tear down in the correct order",
            "instructions": [
                {
                    "id": "console-step-9-item-1",
                    "text": "Open the S3 bucket with Show versions turned ON."
                },
                {
                    "id": "console-step-9-item-2",
                    "text": "Select all versions of notes.txt and click Delete."
                },
                {
                    "id": "console-step-9-item-3",
                    "text": "Select all delete markers and click Delete."
                },
                {
                    "id": "console-step-9-item-4",
                    "text": "Confirm permanently delete for all selected versions."
                },
                {
                    "id": "console-step-9-item-5",
                    "text": "Verify the bucket is completely empty."
                },
                {
                    "id": "console-step-9-item-6",
                    "text": "Delete the test bucket."
                }
            ],
            "warning": "All object versions and delete markers must be permanently deleted before S3 allows a versioned bucket to be deleted.",
            "expectedResult": "Bucket is permanently deleted and no residual AWS resources remain."
        }
    ],
    "cliSteps": [
        {
            "id": "cli-step-1",
            "number": 1,
            "title": "Set shell variables",
            "commands": [
                {
                    "id": "cli-step-1-cmd-1",
                    "language": "bash",
                    "text": "REGION=\"eu-west-2\"\nPROFILE=\"default\"\nACCOUNT_ID=$(aws sts get-caller-identity --profile \"$PROFILE\" --query Account --output text)\nBUCKET=\"s3-task-2-versioning-$ACCOUNT_ID\"\n\necho \"Bucket: $BUCKET\"\necho \"Region: $REGION\""
                }
            ],
            "note": "Requires AWS CLI v2 configured with active credentials.",
            "expectedResult": "Shell prints bucket name containing your AWS account ID."
        },
        {
            "id": "cli-step-2",
            "number": 2,
            "title": "Create the test bucket",
            "commands": [
                {
                    "id": "cli-step-2-cmd-1",
                    "language": "bash",
                    "text": "aws s3api create-bucket \\\n  --bucket \"$BUCKET\" \\\n  --region \"$REGION\" \\\n  --create-bucket-configuration LocationConstraint=\"$REGION\" \\\n  --profile \"$PROFILE\""
                }
            ],
            "note": "LocationConstraint is required for regions outside us-east-1.",
            "expectedResult": "Returns JSON containing Location header."
        },
        {
            "id": "cli-step-3",
            "number": 3,
            "title": "Enable versioning",
            "commands": [
                {
                    "id": "cli-step-3-cmd-1",
                    "language": "bash",
                    "text": "aws s3api put-bucket-versioning \\\n  --bucket \"$BUCKET\" \\\n  --versioning-configuration Status=Enabled \\\n  --profile \"$PROFILE\""
                }
            ],
            "expectedResult": "Command completes silently with exit code 0."
        },
        {
            "id": "cli-step-4",
            "number": 4,
            "title": "Verify versioning is enabled",
            "commands": [
                {
                    "id": "cli-step-4-cmd-1",
                    "language": "bash",
                    "text": "aws s3api get-bucket-versioning \\\n  --bucket \"$BUCKET\" \\\n  --profile \"$PROFILE\""
                }
            ],
            "expectedResult": "Output contains Status: Enabled."
        },
        {
            "id": "cli-step-5",
            "number": 5,
            "title": "Upload version 1",
            "commands": [
                {
                    "id": "cli-step-5-cmd-1",
                    "language": "bash",
                    "text": "echo \"version 1\" > notes.txt\n\naws s3api put-object \\\n  --bucket \"$BUCKET\" \\\n  --key notes.txt \\\n  --body notes.txt \\\n  --profile \"$PROFILE\""
                }
            ],
            "expectedResult": "Returns ETag and VersionId for the first version."
        },
        {
            "id": "cli-step-6",
            "number": 6,
            "title": "Upload version 2",
            "commands": [
                {
                    "id": "cli-step-6-cmd-1",
                    "language": "bash",
                    "text": "echo \"version 2\" > notes.txt\n\naws s3api put-object \\\n  --bucket \"$BUCKET\" \\\n  --key notes.txt \\\n  --body notes.txt \\\n  --profile \"$PROFILE\""
                }
            ],
            "note": "Same key (notes.txt). New content produces a new VersionId.",
            "expectedResult": "Returns a new distinct VersionId."
        },
        {
            "id": "cli-step-7",
            "number": 7,
            "title": "List object versions",
            "commands": [
                {
                    "id": "cli-step-7-cmd-1",
                    "language": "bash",
                    "text": "aws s3api list-object-versions \\\n  --bucket \"$BUCKET\" \\\n  --prefix notes.txt \\\n  --profile \"$PROFILE\""
                }
            ],
            "expectedResult": "JSON response lists two object entries under Versions array."
        },
        {
            "id": "cli-step-8",
            "number": 8,
            "title": "Delete object and view delete marker",
            "commands": [
                {
                    "id": "cli-step-8-cmd-1",
                    "language": "bash",
                    "text": "aws s3api delete-object \\\n  --bucket \"$BUCKET\" \\\n  --key notes.txt \\\n  --profile \"$PROFILE\"\n\naws s3api list-object-versions \\\n  --bucket \"$BUCKET\" \\\n  --prefix notes.txt \\\n  --profile \"$PROFILE\""
                }
            ],
            "expectedResult": "JSON lists a DeleteMarker entry alongside previous Versions."
        },
        {
            "id": "cli-step-9",
            "number": 9,
            "title": "Tear down all versions and the bucket",
            "commands": [
                {
                    "id": "cli-step-9-cmd-1",
                    "language": "bash",
                    "text": "aws s3api delete-objects \\\n  --bucket \"$BUCKET\" \\\n  --delete \"$(aws s3api list-object-versions \\\n    --bucket \"$BUCKET\" \\\n    --query '{Objects: Versions[].{Key:Key,VersionId:VersionId}}' \\\n    --output json \\\n    --profile \"$PROFILE\")\" \\\n  --profile \"$PROFILE\" 2>/dev/null || true\n\naws s3api delete-objects \\\n  --bucket \"$BUCKET\" \\\n  --delete \"$(aws s3api list-object-versions \\\n    --bucket \"$BUCKET\" \\\n    --query '{Objects: DeleteMarkers[].{Key:Key,VersionId:VersionId}}' \\\n    --output json \\\n    --profile \"$PROFILE\")\" \\\n  --profile \"$PROFILE\" 2>/dev/null || true\n\naws s3 rb \"s3://$BUCKET\" --profile \"$PROFILE\"\nrm -f notes.txt"
                }
            ],
            "warning": "This command permanently removes object versions, delete markers, and the bucket.",
            "expectedResult": "Bucket and local test file are removed cleanly."
        }
    ],
    "verification": [
        {
            "id": "verify-1",
            "text": "Bucket versioning status is Enabled."
        },
        {
            "id": "verify-2",
            "text": "Uploading the same object key twice creates two distinct object versions."
        },
        {
            "id": "verify-3",
            "text": "Deleting the object creates a delete marker while older versions remain accessible."
        }
    ],
    "cleanup": [
        {
            "id": "cleanup-1",
            "text": "Delete all stored object versions from the bucket."
        },
        {
            "id": "cleanup-2",
            "text": "Delete all delete markers from the bucket."
        },
        {
            "id": "cleanup-3",
            "text": "Delete the test bucket and remove local notes.txt file."
        }
    ],
    "cheatSheet": [
        {
            "id": "cs-1",
            "title": "S3 Versioning",
            "body": "Keeps multiple versions of an object in one bucket to protect against accidental overwrite or delete."
        },
        {
            "id": "cs-2",
            "title": "Overwrite protection",
            "body": "Uploading to an existing key creates a new version rather than replacing the old object permanently."
        },
        {
            "id": "cs-3",
            "title": "Delete marker",
            "body": "A standard delete inserts a delete marker as the current version instead of deleting old versions."
        },
        {
            "id": "cs-4",
            "title": "Suspend only",
            "body": "Once versioning is enabled, it can be suspended, but cannot be reverted to unversioned."
        },
        {
            "id": "cs-5",
            "title": "Storage Cost",
            "body": "All stored versions count toward S3 storage charges until deleted or expired by lifecycle rules."
        },
        {
            "id": "cs-6",
            "title": "Bucket Deletion",
            "body": "All object versions and delete markers must be deleted before S3 permits bucket deletion."
        }
    ],
    "troubleshooting": [
        {
            "id": "ts-1",
            "title": "Bucket name already exists",
            "body": "S3 bucket names are globally unique across all AWS accounts. Append your account ID or a random string."
        },
        {
            "id": "ts-2",
            "title": "Versioning status does not show Enabled",
            "body": "Refresh the Console Properties tab or execute get-bucket-versioning via AWS CLI."
        },
        {
            "id": "ts-3",
            "title": "Only one version appears in Console",
            "body": "Ensure the Show versions toggle is switched ON in the S3 bucket object browser."
        },
        {
            "id": "ts-4",
            "title": "Bucket deletion fails with BucketNotEmpty error",
            "body": "Delete every version of every object and all delete markers before attempting bucket deletion."
        },
        {
            "id": "ts-5",
            "title": "CLI permission denied",
            "body": "Ensure your AWS IAM user or role has s3:CreateBucket, s3:PutBucketVersioning, s3:PutObject, s3:GetObjectVersion, and s3:DeleteObject permissions."
        },
        {
            "id": "ts-6",
            "title": "InvalidLocationConstraint CLI error",
            "body": "Ensure LocationConstraint matches your specified --region parameter (e.g. eu-west-2)."
        }
    ],
    "examTraps": [
        {
            "id": "trap-1",
            "title": "Versioning is not a complete backup by itself",
            "body": "Versioning protects from accidental overwrite/delete, but doesn't protect against bucket deletion or account compromise unless paired with MFA Delete and S3 Replication."
        },
        {
            "id": "trap-2",
            "title": "Deleting a versioned object does NOT free storage space immediately",
            "body": "A normal delete merely adds a delete marker. Older object versions remain in storage and continue to incur charges until explicitly deleted."
        },
        {
            "id": "trap-3",
            "title": "Versioning cannot be disabled",
            "body": "Once enabled, S3 versioning can only be Suspended. Suspending stops creating new versions for new uploads, but retains existing version history."
        },
        {
            "id": "trap-4",
            "title": "MFA Delete is separate from basic versioning",
            "body": "MFA Delete requires root account credentials to enable and adds extra protection for deleting object versions or changing bucket versioning state."
        }
    ],
    "examTips": [
        {
            "id": "tip-1",
            "text": "SAA-C03: Select S3 Versioning when a question requires protection against accidental object overwrite or deletion."
        },
        {
            "id": "tip-2",
            "text": "SAA-C03: S3 Cross-Region Replication (CRR) and Same-Region Replication (SRR) both strictly require Versioning to be enabled on source and destination buckets."
        },
        {
            "id": "tip-3",
            "text": "SAA-C03: Pair S3 Versioning with Lifecycle rules to transition noncurrent object versions to S3 Glacier for cost optimization."
        }
    ],
    "memoryHook": "S3 versioning is a save-history button. Overwrite creates a new save. Delete adds a marker. Old saves remain recoverable.",
    "flashcardSetId": null
}
$content$::jsonb
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    updated_at = NOW();
