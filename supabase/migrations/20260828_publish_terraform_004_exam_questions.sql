-- Publish the 30 locally reviewed Terraform Associate (004) questions.
-- Scope: Terraform questions q-tf004-1 through q-tf004-30 and their topic links only.
-- AWS questions, exam attempts, Follow Alongs, drafts and approvals are not changed.

BEGIN;

CREATE TEMP TABLE terraform_004_question_seed (
  id TEXT PRIMARY KEY,
  exam_code TEXT NOT NULL,
  difficulty TEXT,
  question_type TEXT NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  option_e TEXT,
  option_f TEXT,
  correct_answer INTEGER NOT NULL,
  correct_answers INTEGER[] NOT NULL,
  explanation TEXT,
  topic_id TEXT NOT NULL
) ON COMMIT DROP;

INSERT INTO terraform_004_question_seed (
  id, exam_code, difficulty, question_type, question_text,
  option_a, option_b, option_c, option_d, option_e, option_f,
  correct_answer, correct_answers, explanation, topic_id
) VALUES
  ($tfq$q-tf004-1$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Easy$tfq$, $tfq$single$tfq$, $tfq$What is the main benefit of describing infrastructure in Terraform configuration?$tfq$, $tfq$Changes become repeatable and reviewable$tfq$, $tfq$Every cloud uses the same API$tfq$, $tfq$State is never required$tfq$, $tfq$Infrastructure cannot drift$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$Configuration provides a repeatable, version-controlled description that teams can review before applying.$tfq$, $tfq$tf004-iac$tfq$),
  ($tfq$q-tf004-2$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Medium$tfq$, $tfq$single$tfq$, $tfq$How does Terraform support multi-cloud workflows?$tfq$, $tfq$It uses providers for different service APIs$tfq$, $tfq$It converts every API into AWS CloudFormation$tfq$, $tfq$It requires one state file per resource$tfq$, $tfq$It removes provider authentication$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$Terraform providers connect the Terraform workflow to different cloud, SaaS, and infrastructure APIs.$tfq$, $tfq$tf004-iac$tfq$),
  ($tfq$q-tf004-3$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Easy$tfq$, $tfq$single$tfq$, $tfq$Which command installs the providers required by a Terraform configuration?$tfq$, $tfq$terraform init$tfq$, $tfq$terraform validate$tfq$, $tfq$terraform show$tfq$, $tfq$terraform output$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$terraform init initializes the working directory and installs the required provider plugins.$tfq$, $tfq$tf004-fundamentals$tfq$),
  ($tfq$q-tf004-4$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Medium$tfq$, $tfq$single$tfq$, $tfq$What is the purpose of the Terraform dependency lock file?$tfq$, $tfq$Record selected provider versions and checksums$tfq$, $tfq$Store cloud credentials$tfq$, $tfq$Replace the state file$tfq$, $tfq$Define output values$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$The lock file records provider selections and checksums so future initialization is consistent.$tfq$, $tfq$tf004-fundamentals$tfq$),
  ($tfq$q-tf004-5$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Easy$tfq$, $tfq$single$tfq$, $tfq$Which command previews proposed infrastructure changes without applying them?$tfq$, $tfq$terraform plan$tfq$, $tfq$terraform apply$tfq$, $tfq$terraform destroy$tfq$, $tfq$terraform fmt$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$terraform plan compares configuration and current state to produce a proposed execution plan.$tfq$, $tfq$tf004-workflow$tfq$),
  ($tfq$q-tf004-6$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Medium$tfq$, $tfq$single$tfq$, $tfq$Why should a saved plan be supplied to terraform apply?$tfq$, $tfq$It applies the exact reviewed plan$tfq$, $tfq$It upgrades every provider$tfq$, $tfq$It disables state locking$tfq$, $tfq$It skips authentication$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$Applying a saved plan helps ensure Terraform performs the same actions that were reviewed.$tfq$, $tfq$tf004-workflow$tfq$),
  ($tfq$q-tf004-7$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Easy$tfq$, $tfq$single$tfq$, $tfq$Which block manages an infrastructure object?$tfq$, $tfq$resource$tfq$, $tfq$output$tfq$, $tfq$terraform$tfq$, $tfq$locals$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$A resource block declares an infrastructure object that Terraform can manage.$tfq$, $tfq$tf004-configuration$tfq$),
  ($tfq$q-tf004-8$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Medium$tfq$, $tfq$single$tfq$, $tfq$When is an explicit depends_on normally needed?$tfq$, $tfq$When a dependency cannot be inferred from references$tfq$, $tfq$For every resource$tfq$, $tfq$Only for outputs$tfq$, $tfq$Whenever a variable has a default$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$Terraform infers most dependencies from expressions; depends_on is for otherwise hidden dependencies.$tfq$, $tfq$tf004-configuration$tfq$),
  ($tfq$q-tf004-9$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Easy$tfq$, $tfq$single$tfq$, $tfq$How does a child module receive values from its caller?$tfq$, $tfq$Through input variables$tfq$, $tfq$Through provider checksums$tfq$, $tfq$Through state locking$tfq$, $tfq$Through CLI aliases$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$The calling module supplies values to the child module’s declared input variables.$tfq$, $tfq$tf004-modules$tfq$),
  ($tfq$q-tf004-10$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Medium$tfq$, $tfq$single$tfq$, $tfq$Where can Terraform obtain reusable public modules?$tfq$, $tfq$The Terraform Registry$tfq$, $tfq$Only the local state file$tfq$, $tfq$The provider lock file$tfq$, $tfq$A plan file$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$The Terraform Registry is a standard source for discoverable, reusable modules.$tfq$, $tfq$tf004-modules$tfq$),
  ($tfq$q-tf004-11$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Easy$tfq$, $tfq$single$tfq$, $tfq$Why is Terraform state important?$tfq$, $tfq$It maps configuration to managed real-world objects$tfq$, $tfq$It stores provider binaries$tfq$, $tfq$It formats HCL$tfq$, $tfq$It replaces configuration$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$State records the relationship between configuration addresses and managed infrastructure objects.$tfq$, $tfq$tf004-state$tfq$),
  ($tfq$q-tf004-12$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Medium$tfq$, $tfq$single$tfq$, $tfq$What problem does state locking help prevent?$tfq$, $tfq$Concurrent state modification$tfq$, $tfq$Provider installation$tfq$, $tfq$Variable validation$tfq$, $tfq$Module downloads$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$Locking prevents multiple operations from changing the same state at the same time.$tfq$, $tfq$tf004-state$tfq$),
  ($tfq$q-tf004-13$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Easy$tfq$, $tfq$single$tfq$, $tfq$What does importing an existing resource do?$tfq$, $tfq$Associates it with a Terraform resource address$tfq$, $tfq$Deletes and recreates it$tfq$, $tfq$Copies it into a module$tfq$, $tfq$Automatically writes every configuration argument$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$Import associates an existing object with a resource address; configuration still needs to match the desired management state.$tfq$, $tfq$tf004-maintenance$tfq$),
  ($tfq$q-tf004-14$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Medium$tfq$, $tfq$single$tfq$, $tfq$Which environment variable enables detailed Terraform logging?$tfq$, $tfq$TF_LOG$tfq$, $tfq$TF_STATE$tfq$, $tfq$TF_OUTPUT$tfq$, $tfq$TF_LOCK$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$TF_LOG controls Terraform’s detailed logging level for troubleshooting.$tfq$, $tfq$tf004-maintenance$tfq$),
  ($tfq$q-tf004-15$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Easy$tfq$, $tfq$single$tfq$, $tfq$What does an HCP Terraform workspace commonly contain?$tfq$, $tfq$Configuration, variables, state, and run history$tfq$, $tfq$Only a provider binary$tfq$, $tfq$Only a local plan file$tfq$, $tfq$A cloud root password$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$An HCP Terraform workspace organizes configuration connections, variables, state, and runs.$tfq$, $tfq$tf004-hcp$tfq$),
  ($tfq$q-tf004-16$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Medium$tfq$, $tfq$single$tfq$, $tfq$Which HCP Terraform capability can evaluate rules before infrastructure changes are applied?$tfq$, $tfq$Policy enforcement$tfq$, $tfq$terraform fmt$tfq$, $tfq$Local backend storage$tfq$, $tfq$Provider aliasing$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$Policy enforcement adds governance checks to HCP Terraform run workflows.$tfq$, $tfq$tf004-hcp$tfq$),
  ($tfq$q-tf004-17$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Medium$tfq$, $tfq$single$tfq$, $tfq$A configuration uses two AWS provider configurations with different regions. How should a resource select the aliased provider named west?$tfq$, $tfq$provider = aws.west$tfq$, $tfq$provider = west.aws$tfq$, $tfq$region = aws.west$tfq$, $tfq$providers = [aws.west]$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$A resource selects an alternate provider configuration with the provider meta-argument and its local provider alias, such as provider = aws.west.$tfq$, $tfq$tf004-fundamentals$tfq$),
  ($tfq$q-tf004-18$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Medium$tfq$, $tfq$single$tfq$, $tfq$What does marking a Terraform variable as sensitive do?$tfq$, $tfq$Redacts its value from normal CLI output but does not guarantee exclusion from state$tfq$, $tfq$Encrypts the value in every state backend$tfq$, $tfq$Prevents providers from receiving the value$tfq$, $tfq$Deletes the value immediately after terraform apply$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$The sensitive flag limits normal display of a value. Sensitive values can still be stored in state, so the state must be protected.$tfq$, $tfq$tf004-configuration$tfq$),
  ($tfq$q-tf004-19$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Medium$tfq$, $tfq$single$tfq$, $tfq$What is the purpose of the create_before_destroy lifecycle rule?$tfq$, $tfq$Create a replacement before destroying the existing object when possible$tfq$, $tfq$Prevent Terraform from ever replacing the object$tfq$, $tfq$Skip dependency graph construction$tfq$, $tfq$Create every resource twice for availability$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$create_before_destroy reverses the normal replacement order when the remote API and naming constraints permit it, reducing disruption during replacement.$tfq$, $tfq$tf004-configuration$tfq$),
  ($tfq$q-tf004-20$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Hard$tfq$, $tfq$multiple$tfq$, $tfq$Which two Terraform features can validate assumptions using custom conditions? Select two.$tfq$, $tfq$A variable validation block$tfq$, $tfq$The dependency lock file$tfq$, $tfq$A resource precondition$tfq$, $tfq$The local backend$tfq$, NULL, NULL, 0, ARRAY[0, 2]::INTEGER[], $tfq$Variable validation checks supplied input values, while resource preconditions check assumptions before Terraform performs the associated operation.$tfq$, $tfq$tf004-configuration$tfq$),
  ($tfq$q-tf004-21$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Medium$tfq$, $tfq$single$tfq$, $tfq$Why is for_each often preferred over count when managing objects identified by meaningful names?$tfq$, $tfq$Its instance addresses use stable map keys or set members$tfq$, $tfq$It automatically creates a child module$tfq$, $tfq$It disables resource replacement$tfq$, $tfq$It stores no information in state$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$for_each identifies instances by keys, which can avoid the index shifting that may occur when count is used with a changing ordered list.$tfq$, $tfq$tf004-configuration$tfq$),
  ($tfq$q-tf004-22$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Medium$tfq$, $tfq$single$tfq$, $tfq$Where is the version argument normally used to constrain a registry module?$tfq$, $tfq$Inside the module block$tfq$, $tfq$Inside the provider block$tfq$, $tfq$Inside the output block$tfq$, $tfq$Inside the backend block$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$A module block can include a version constraint when its source supports versioning, such as a module from a registry.$tfq$, $tfq$tf004-modules$tfq$),
  ($tfq$q-tf004-23$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Medium$tfq$, $tfq$single$tfq$, $tfq$After changing a configuration from local state to a remote backend, which command initializes the new backend and can migrate the existing state?$tfq$, $tfq$terraform init -migrate-state$tfq$, $tfq$terraform state list -remote$tfq$, $tfq$terraform apply -refresh-only$tfq$, $tfq$terraform fmt -recursive$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$terraform init -migrate-state reinitializes the backend and confirms migration of existing state to the newly configured backend.$tfq$, $tfq$tf004-state$tfq$),
  ($tfq$q-tf004-24$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Medium$tfq$, $tfq$single$tfq$, $tfq$What is the purpose of a refresh-only plan?$tfq$, $tfq$Review updates needed to reconcile Terraform state with changes already made remotely$tfq$, $tfq$Recreate every object recorded in state$tfq$, $tfq$Download newer provider versions$tfq$, $tfq$Remove all resources missing from configuration$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$Refresh-only mode lets you review and record remote changes in state without proposing changes to the remote infrastructure.$tfq$, $tfq$tf004-state$tfq$),
  ($tfq$q-tf004-25$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Hard$tfq$, $tfq$single$tfq$, $tfq$A resource block is moved into a child module without changing the real infrastructure. What should record the address change in configuration?$tfq$, $tfq$A moved block$tfq$, $tfq$A check block$tfq$, $tfq$A provider alias$tfq$, $tfq$A backend block$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$A moved block tells Terraform that an existing object has a new resource address, allowing the refactor without treating it as an unrelated destroy-and-create operation.$tfq$, $tfq$tf004-state$tfq$),
  ($tfq$q-tf004-26$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Medium$tfq$, $tfq$multiple$tfq$, $tfq$Which two statements about importing existing infrastructure are correct? Select two.$tfq$, $tfq$The destination resource address must be chosen deliberately$tfq$, $tfq$Import always produces a complete production-ready configuration$tfq$, $tfq$The configuration must describe the object Terraform will manage$tfq$, $tfq$Import automatically moves the object to a new cloud account$tfq$, NULL, NULL, 0, ARRAY[0, 2]::INTEGER[], $tfq$Import associates an existing object with a selected Terraform address. Configuration is still required and must be reviewed so it represents the desired management state.$tfq$, $tfq$tf004-maintenance$tfq$),
  ($tfq$q-tf004-27$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Easy$tfq$, $tfq$multiple$tfq$, $tfq$Which two Terraform CLI commands inspect state without changing resource addresses? Select two.$tfq$, $tfq$terraform state list$tfq$, $tfq$terraform state show$tfq$, $tfq$terraform state mv$tfq$, $tfq$terraform state rm$tfq$, NULL, NULL, 0, ARRAY[0, 1]::INTEGER[], $tfq$state list displays the resource addresses in state and state show displays attributes for one state address. state mv and state rm modify Terraform state records.$tfq$, $tfq$tf004-maintenance$tfq$),
  ($tfq$q-tf004-28$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Hard$tfq$, $tfq$single$tfq$, $tfq$What is a key property of an ephemeral value in supported Terraform configuration?$tfq$, $tfq$Terraform omits it from state and plan files$tfq$, $tfq$Terraform automatically stores it in a local values file$tfq$, $tfq$It can only contain a number$tfq$, $tfq$It replaces the need for provider authentication$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$Ephemeral values are intended for temporary data and are omitted from state and plan files, reducing persistence of short-lived sensitive information.$tfq$, $tfq$tf004-configuration$tfq$),
  ($tfq$q-tf004-29$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Medium$tfq$, $tfq$single$tfq$, $tfq$What commonly happens when an HCP Terraform workspace is connected to a version control repository and an approved change is committed?$tfq$, $tfq$The workspace can automatically queue a run for the changed configuration$tfq$, $tfq$The local backend overwrites the HCP Terraform state$tfq$, $tfq$Terraform bypasses the plan stage$tfq$, $tfq$Every workspace in the organization is destroyed$tfq$, NULL, NULL, 0, ARRAY[0]::INTEGER[], $tfq$A VCS-connected workspace can detect relevant commits and queue Terraform runs according to the workspace configuration and approval workflow.$tfq$, $tfq$tf004-hcp$tfq$),
  ($tfq$q-tf004-30$tfq$, $tfq$terraform-associate-004$tfq$, $tfq$Hard$tfq$, $tfq$multiple$tfq$, $tfq$Which two HCP Terraform capabilities support controlled team workflows? Select two.$tfq$, $tfq$Policy enforcement$tfq$, $tfq$Disabling state history$tfq$, $tfq$Team-based workspace permissions$tfq$, $tfq$Storing every credential in configuration files$tfq$, NULL, NULL, 0, ARRAY[0, 2]::INTEGER[], $tfq$Policy enforcement can evaluate changes against organizational rules, while team permissions control who can view, plan, apply, or administer workspaces.$tfq$, $tfq$tf004-hcp$tfq$);

DO $migration_guard$
BEGIN
  IF (SELECT COUNT(*) FROM terraform_004_question_seed) <> 30 THEN
    RAISE EXCEPTION 'Terraform question publication stopped: expected 30 seed questions.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.exam_questions existing
    JOIN terraform_004_question_seed seed ON seed.id = existing.id
    WHERE existing.exam_code <> 'terraform-associate-004'
  ) THEN
    RAISE EXCEPTION 'Terraform question publication stopped: a question ID belongs to another exam.';
  END IF;
END
$migration_guard$;

INSERT INTO public.exam_questions (
  id, exam_code, difficulty, question_type, question_text,
  option_a, option_b, option_c, option_d, option_e, option_f,
  correct_answer, correct_answers, explanation
)
SELECT
  id, exam_code, difficulty, question_type, question_text,
  option_a, option_b, option_c, option_d, option_e, option_f,
  correct_answer, correct_answers, explanation
FROM terraform_004_question_seed
ON CONFLICT (id) DO UPDATE SET
  difficulty = EXCLUDED.difficulty,
  question_type = EXCLUDED.question_type,
  question_text = EXCLUDED.question_text,
  option_a = EXCLUDED.option_a,
  option_b = EXCLUDED.option_b,
  option_c = EXCLUDED.option_c,
  option_d = EXCLUDED.option_d,
  option_e = EXCLUDED.option_e,
  option_f = EXCLUDED.option_f,
  correct_answer = EXCLUDED.correct_answer,
  correct_answers = EXCLUDED.correct_answers,
  explanation = EXCLUDED.explanation
WHERE public.exam_questions.exam_code = EXCLUDED.exam_code;

DELETE FROM public.question_topics mappings
USING terraform_004_question_seed seed
WHERE mappings.question_id = seed.id;

INSERT INTO public.question_topics (question_id, topic_id)
SELECT id, topic_id
FROM terraform_004_question_seed
ON CONFLICT (question_id, topic_id) DO NOTHING;

DO $publication_check$
BEGIN
  IF (
    SELECT COUNT(*)
    FROM public.exam_questions questions
    JOIN terraform_004_question_seed seed ON seed.id = questions.id
    WHERE questions.exam_code = 'terraform-associate-004'
  ) <> 30 THEN
    RAISE EXCEPTION 'Terraform question publication failed verification: question count is not 30.';
  END IF;

  IF (
    SELECT COUNT(*)
    FROM public.question_topics mappings
    JOIN terraform_004_question_seed seed
      ON seed.id = mappings.question_id
     AND seed.topic_id = mappings.topic_id
  ) <> 30 THEN
    RAISE EXCEPTION 'Terraform question publication failed verification: topic mapping count is not 30.';
  END IF;
END
$publication_check$;

COMMIT;
