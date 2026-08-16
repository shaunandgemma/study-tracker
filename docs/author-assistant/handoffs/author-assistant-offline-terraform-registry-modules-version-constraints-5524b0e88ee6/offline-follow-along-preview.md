# Registry Modules and Version Constraints Follow Along

**Status:** Offline authoring manuscript only — not locally validated, imported, accepted, approved, published or fingerprinted.

- **Learner level:** Beginner
- **Exam workspace:** HashiCorp Terraform Associate 004
- **Scope:** Terraform public Registry global resources and local workstation only; no AWS or other cloud resources are created.
- **Training prefix:** `fa-registry-modules-terraform`

## Required outcome

Find and use a public Terraform Registry module; pin and verify an exact module version; practice pessimistic, compound and exact module version constraints; use terraform init -upgrade to change the selected registry module release; prove that .terraform.lock.hcl does not lock remote module versions; create and repair one unsatisfiable module-version failure; run reviewed plan/apply/destroy workflows without creating cloud resources; and safely remove all local training artifacts. This intentionally adds practical registry module-version coverage not claimed by the local-module refactoring lab.

## Exam objectives covered

- **5a:** Explain how Terraform sources modules
- **5b:** Describe variable scope within modules
- **5c:** Use modules in configuration
- **5d:** Manage module versions
- **3b-3f:** Initialize, validate, plan, apply and destroy during the registry-module workflow

## Completion definition

- The learner finds cloudposse/label/null in the public Terraform Registry and verifies baseline version 0.24.1 and current lab target 0.25.0.
- The root module calls the registry module with an exact version and uses module inputs and outputs without creating any cloud resource.
- terraform init installs the exact module version and .terraform/modules/modules.json is used to verify the selected release.
- A saved plan is reviewed before every apply in the lab.
- The learner broadens the constraint to ~> 0.24 and deliberately upgrades to 0.25.0.
- The learner narrows the constraint to ~> 0.24.0 and proves selection returns to 0.24.1.
- The learner practices the compound range >= 0.24.0, < 0.25.0 and the exact pin = 0.25.0.
- The learner proves .terraform.lock.hcl does not lock remote module version selections.
- An impossible >= 1.0.0 module constraint fails during init and is repaired by restoring the exact 0.25.0 pin.
- The learner can distinguish public registry module version management from local-module creation/refactoring.
- A saved destroy plan confirms no managed infrastructure exists, then all lab-only plan, cache, state and configuration files are removed in reverse-dependency order.

## Warnings

### Cost warning

This Follow Along downloads public Terraform Registry module source code but intentionally creates zero cloud resources, accounts, workspaces or paid services. No cloud resource charges are expected from the lab itself.

### Deletion safety

Delete only the exact local folder C:\terraform-labs\fa-registry-modules-terraform and the exact plan/cache/state files created inside it. Never delete the parent terraform-labs folder or a sibling lab.

### Credential warning

No cloud or registry credentials are required. Do not add AWS, HCP Terraform, GitHub or other credentials to the configuration or command history.

### Region / scope warning

The public Terraform Registry is global and this Follow Along runs locally. It intentionally creates no AWS or other cloud resource, so no cloud Region selection is required.

# Phase 1: Prepare and discover registry modules

Verify Terraform, understand the exam gap this lab fills, and inspect a real versioned public registry module before writing configuration.

## task-01-prerequisites — Verify Terraform and the lab boundary

- **Feature:** Prerequisites
- **Difficulty:** Easy
- **Goal:** Confirm Terraform is installed and understand that this lab creates no cloud infrastructure or credentials.
- **Why it matters:** The goal is module source and version behavior, so cloud authentication would add noise and risk without helping objective 5d.
- **Exam relevance:** Objectives 5a, 5c and especially 5d are the focus. This lab intentionally adds registry module version-management practice that a local-module refactoring lab does not claim.
- **Prerequisites:** None
- **Sources:** src-exam-004, src-find-use-modules

### Console / browser route

1. Open Windows PowerShell. If you use Bash instead, the Bash commands are supplied where syntax differs.
2. Run terraform version. If Terraform is missing, install it from the official HashiCorp install page before continuing.
3. Do not sign in to AWS, Azure, Google Cloud, HCP Terraform, or any other cloud for this lab. No credentials are required.
4. Record the safety boundary: the public Terraform Registry is used only to download module source code; the selected training module defines zero managed resources.
5. Record the learning boundary: this programme does not teach creating or refactoring a local child module. It teaches registry source addresses and practical module version constraints.

### CLI / Terraform route

#### PowerShell - verify Terraform

```
terraform version
```

#### Bash - verify Terraform

```
terraform version
```

### Expected results

- Terraform prints its installed version.
- No cloud sign-in or credential is required.
- The learner can state that this lab covers registry module sourcing and version management rather than local-module refactoring.

### Verification checks

- [ ] **task-01-prerequisites-verify-01** — terraform version completes successfully.
- [ ] **task-01-prerequisites-verify-02** — No cloud resource, account, workspace or credential has been created.
- [ ] **task-01-prerequisites-verify-03** — The learning boundary explicitly separates registry module versioning from local-module refactoring.

## task-02-registry-discovery — Find the training module and inspect its versions

- **Feature:** Terraform Registry discovery
- **Difficulty:** Easy
- **Goal:** Use the public Terraform Registry to inspect the module source address, available versions, inputs, outputs and resource count before using it.
- **Why it matters:** The version argument only makes sense when you know which registry module you are calling and which releases are available.
- **Exam relevance:** Objective 5a requires understanding how Terraform sources modules; objective 5d requires managing registry module versions.
- **Prerequisites:** task-01-prerequisites
- **Sources:** src-exam-004, src-find-use-modules, src-use-registry-modules, src-registry-label-current, src-registry-label-0241, src-cloudposse-label-docs

### Console / browser route

1. Open https://registry.terraform.io in a browser.
2. Search for cloudposse/label/null and open the module page.
3. Confirm the module source address shown by the Registry is cloudposse/label/null.
4. Open the version selector and confirm version 0.24.1 is available.
5. Confirm version 0.25.0 is also available and is the current latest release used by this lab.
6. Open the Resources tab and confirm the module defines 0 resources. This is why the lab can safely run plan and apply without cloud credentials.
7. Open the Outputs tab and confirm the module exposes an id output.
8. Do not copy a latest-only example into the lab yet; the next task pins an exact baseline version so version changes are deliberate.

### CLI / Terraform route

#### No CLI action for registry browsing

```
# This task is intentionally completed in the Terraform Registry browser.
# No cloud or registry login is required for this public module.
```

### Expected results

- The Registry shows source cloudposse/label/null.
- Versions 0.24.1 and 0.25.0 are visible.
- The Registry reports zero resources for the module.
- The module exposes an id output.

### Verification checks

- [ ] **task-02-registry-discovery-verify-01** — Version 0.24.1 is visible in the Registry.
- [ ] **task-02-registry-discovery-verify-02** — Version 0.25.0 is visible in the Registry.
- [ ] **task-02-registry-discovery-verify-03** — The Resources view shows 0 resources.
- [ ] **task-02-registry-discovery-verify-04** — The source address is exactly cloudposse/label/null.

## task-03-create-root-config — Create the root configuration pinned to 0.24.1

- **Feature:** Registry module call
- **Difficulty:** Medium
- **Goal:** Create a new root module that calls cloudposse/label/null at the exact version 0.24.1 and exposes harmless calculated outputs.
- **Why it matters:** An exact initial pin gives a known baseline that you can later widen, narrow, break and repair.
- **Exam relevance:** Objectives 5b and 5c are reinforced through module input values and outputs; objective 5d starts with an exact registry module version.
- **Prerequisites:** task-02-registry-discovery
- **Sources:** src-module-block, src-version-constraints, src-use-registry-modules, src-registry-label-0241, src-cloudposse-label-docs

### Console / browser route

1. Create the folder C:\terraform-labs\fa-registry-modules-terraform.
2. Open the folder and create main.tf. Ensure Windows does not save it as main.tf.txt.
3. Paste the complete main.tf block supplied in this task.
4. Create outputs.tf in the same folder.
5. Paste the complete outputs.tf block supplied in this task.
6. Confirm the module block uses source cloudposse/label/null and exact version = 0.24.1.
7. Confirm there are no provider blocks, backend blocks, cloud blocks or credentials in either file.

### CLI / Terraform route

#### PowerShell - create and enter the lab folder

```
New-Item -ItemType Directory -Force C:\terraform-labs\fa-registry-modules-terraform
Set-Location C:\terraform-labs\fa-registry-modules-terraform
Get-Location
```

#### Bash - create and enter the lab folder

```
mkdir -p ~/terraform-labs/fa-registry-modules-terraform
cd ~/terraform-labs/fa-registry-modules-terraform
pwd
```

### Supplied configuration

#### main.tf

```
terraform {
  required_version = ">= 1.5.0, < 2.0.0"
}

module "training_label" {
  source  = "cloudposse/label/null"
  version = "= 0.24.1"

  namespace   = "fa"
  environment = "gbl"
  stage       = "training"
  name        = "registry-modules"
  attributes  = ["versioning"]
}
```

#### outputs.tf

```
output "training_label_id" {
  description = "Deterministic label generated by the registry module."
  value       = module.training_label.id
}

output "training_label_tags" {
  description = "Tags calculated by the registry module."
  value       = module.training_label.tags
}
```

### Expected results

- The lab folder contains main.tf and outputs.tf.
- main.tf pins the module to = 0.24.1.
- No credential or cloud provider configuration exists.

### Verification checks

- [ ] **task-03-create-root-config-verify-01** — main.tf exists with the exact registry source address.
- [ ] **task-03-create-root-config-verify-02** — The version line is exactly version = "= 0.24.1".
- [ ] **task-03-create-root-config-verify-03** — outputs.tf references module.training_label.id and module.training_label.tags.

# Phase 2: Install and use an exact module version

Call a public registry module at an exact version, initialize it, inspect the downloaded module metadata, and run the normal Terraform workflow safely.

## task-04-init-exact-version — Initialize and inspect the exact downloaded module

- **Feature:** Module installation
- **Difficulty:** Medium
- **Goal:** Run terraform init, then inspect the module cache metadata to prove Terraform installed version 0.24.1.
- **Why it matters:** Registry module versions are resolved during initialization; the downloaded module metadata gives direct evidence of the selected release.
- **Exam relevance:** Objective 5d is practical here: Terraform resolves an exact registry module version and installs it during init.
- **Prerequisites:** task-03-create-root-config
- **Sources:** src-init, src-module-block, src-find-use-modules, src-registry-label-0241, src-lock-file

### Console / browser route

1. Open PowerShell or Bash in C:\terraform-labs\fa-registry-modules-terraform.
2. Run terraform init.
3. Read the init output and find the line that says it is downloading cloudposse/label/null 0.24.1 for training_label.
4. Open the .terraform folder that init created. This is local working data and must not be committed as source.
5. Open .terraform/modules/modules.json and find the training_label entry. Confirm its Version is 0.24.1.
6. If .terraform.lock.hcl exists, do not use it as proof of the module version. HashiCorp documents that the dependency lock file currently tracks provider selections, not remote module selections.
7. Do not manually edit files under .terraform/modules. Terraform owns the downloaded cache.

### CLI / Terraform route

#### PowerShell - initialize and inspect module metadata

```
terraform init
Get-Content .terraform\modules\modules.json
```

#### Bash - initialize and inspect module metadata

```
terraform init
cat .terraform/modules/modules.json
```

### Expected results

- terraform init succeeds.
- The init output identifies cloudposse/label/null 0.24.1.
- .terraform/modules/modules.json records Version 0.24.1 for training_label.

### Verification checks

- [ ] **task-04-init-exact-version-verify-01** — Initialization completes without cloud authentication.
- [ ] **task-04-init-exact-version-verify-02** — modules.json contains cloudposse/label/null and version 0.24.1.
- [ ] **task-04-init-exact-version-verify-03** — The learner can explain why .terraform.lock.hcl is not the module-version lock.

## task-05-plan-apply-baseline — Format, validate, review and apply the baseline configuration

- **Feature:** Core workflow with a registry module
- **Difficulty:** Medium
- **Goal:** Run the normal Terraform workflow with the exact module version and verify the module output without creating infrastructure.
- **Why it matters:** Module version management is easier to trust when the selected module actually participates in a validated, reviewed and applied root configuration.
- **Exam relevance:** Objectives 3b through 3e and 5c support the module-version exercise; the module itself defines zero managed resources.
- **Prerequisites:** task-04-init-exact-version
- **Sources:** src-fmt, src-validate, src-plan, src-show, src-apply, src-output, src-state-list, src-registry-label-current

### Console / browser route

1. Run terraform fmt and confirm Terraform does not report a formatting error.
2. Run terraform validate and confirm Success! The configuration is valid.
3. Create a saved plan named fa-registry-modules-baseline.tfplan.
4. Review that saved plan with terraform show before applying it.
5. Confirm the plan proposes no cloud resources and only calculates root outputs.
6. Apply the reviewed saved plan by filename. Do not run an unreviewed terraform apply.
7. Run terraform output training_label_id.
8. Run terraform state list and confirm it prints no managed resource addresses.

### CLI / Terraform route

#### PowerShell and Bash - baseline workflow

```
terraform fmt
terraform validate
terraform plan -out=fa-registry-modules-baseline.tfplan
terraform show fa-registry-modules-baseline.tfplan
terraform apply fa-registry-modules-baseline.tfplan
terraform output training_label_id
terraform state list
```

### Expected results

- Validation succeeds.
- The saved plan contains no managed cloud resource creation.
- Apply succeeds.
- training_label_id prints fa-gbl-training-registry-modules-versioning.
- terraform state list prints no managed resource address.

### Verification checks

- [ ] **task-05-plan-apply-baseline-verify-01** — The saved plan was reviewed before apply.
- [ ] **task-05-plan-apply-baseline-verify-02** — training_label_id equals fa-gbl-training-registry-modules-versioning.
- [ ] **task-05-plan-apply-baseline-verify-03** — terraform state list is empty.
- [ ] **task-05-plan-apply-baseline-verify-04** — No cloud credentials or resources were used.

# Phase 3: Broaden a constraint and upgrade the module

Change the module constraint, deliberately allow a newer compatible release, run init -upgrade, and prove which version Terraform selected.

## task-06-broaden-constraint — Broaden the version constraint with ~> 0.24

- **Feature:** Pessimistic constraint
- **Difficulty:** Hard
- **Goal:** Replace the exact module pin with ~> 0.24 and understand exactly which version range that syntax permits.
- **Why it matters:** The pessimistic operator is easy to misread; the number of version components changes the upper bound.
- **Exam relevance:** Objective 5d includes module version management. HashiCorp documents that ~> allows the right-most specified component to increment.
- **Prerequisites:** task-05-plan-apply-baseline
- **Sources:** src-version-constraints, src-module-block, src-registry-label-current

### Console / browser route

1. Open main.tf.
2. Replace only version = "= 0.24.1" with version = "~> 0.24".
3. Do not change the source address or any module inputs.
4. Understand the constraint before running init: ~> 0.24 allows 0.24 and later 0.x releases but not 1.0 or later. Therefore 0.25.0 is acceptable.
5. Save main.tf.

### CLI / Terraform route

#### No upgrade yet

```
# Edit main.tf first using the complete replacement block below.
# The upgrade is deliberately performed in the next task.
```

### Supplied configuration

#### main.tf after broadening the constraint

```
terraform {
  required_version = ">= 1.5.0, < 2.0.0"
}

module "training_label" {
  source  = "cloudposse/label/null"
  version = "~> 0.24"

  namespace   = "fa"
  environment = "gbl"
  stage       = "training"
  name        = "registry-modules"
  attributes  = ["versioning"]
}
```

### Expected results

- main.tf uses version = "~> 0.24".
- The learner predicts that 0.25.0 is acceptable before running Terraform.

### Verification checks

- [ ] **task-06-broaden-constraint-verify-01** — The source remains cloudposse/label/null.
- [ ] **task-06-broaden-constraint-verify-02** — The version line is exactly ~> 0.24.
- [ ] **task-06-broaden-constraint-verify-03** — The learner can state that 1.0.0 would be outside this constraint.

## task-07-upgrade-to-0250 — Run init -upgrade and prove Terraform selects 0.25.0

- **Feature:** Registry module upgrade
- **Difficulty:** Hard
- **Goal:** Force Terraform to reconsider the already-installed module and select the newest version allowed by ~> 0.24.
- **Why it matters:** Re-running plain init does not necessarily replace an already-installed module; -upgrade is the deliberate signal to update module source selections.
- **Exam relevance:** Objective 5d is demonstrated by changing a registry module constraint and using init -upgrade to select a newer allowed release.
- **Prerequisites:** task-06-broaden-constraint
- **Sources:** src-init, src-version-constraints, src-lock-file, src-registry-label-current

### Console / browser route

1. Run terraform init -upgrade.
2. Read the init output and confirm Terraform downloads cloudposse/label/null 0.25.0 for training_label.
3. Open .terraform/modules/modules.json and confirm the training_label Version changed from 0.24.1 to 0.25.0.
4. Run terraform validate.
5. Create a saved plan named fa-registry-modules-upgrade-0250.tfplan.
6. Review the saved plan with terraform show.
7. Apply the reviewed saved plan by filename.
8. Run terraform output training_label_id and confirm the result remains stable.

### CLI / Terraform route

#### PowerShell - upgrade and inspect

```
terraform init -upgrade
Get-Content .terraform\modules\modules.json
terraform validate
terraform plan -out=fa-registry-modules-upgrade-0250.tfplan
terraform show fa-registry-modules-upgrade-0250.tfplan
terraform apply fa-registry-modules-upgrade-0250.tfplan
terraform output training_label_id
```

#### Bash - upgrade and inspect

```
terraform init -upgrade
cat .terraform/modules/modules.json
terraform validate
terraform plan -out=fa-registry-modules-upgrade-0250.tfplan
terraform show fa-registry-modules-upgrade-0250.tfplan
terraform apply fa-registry-modules-upgrade-0250.tfplan
terraform output training_label_id
```

### Expected results

- Terraform selects module version 0.25.0.
- modules.json records Version 0.25.0.
- Validation succeeds.
- The reviewed apply succeeds and the calculated label remains fa-gbl-training-registry-modules-versioning.

### Verification checks

- [ ] **task-07-upgrade-to-0250-verify-01** — modules.json shows 0.25.0.
- [ ] **task-07-upgrade-to-0250-verify-02** — The saved plan was reviewed before apply.
- [ ] **task-07-upgrade-to-0250-verify-03** — The module output remains stable after the version upgrade.

## task-08-lock-file-distinction — Prove module versions are not locked in .terraform.lock.hcl

- **Feature:** Dependency locking distinction
- **Difficulty:** Medium
- **Goal:** Compare module installation metadata with Terraform dependency lock behavior and explain where the selected remote module version is remembered.
- **Why it matters:** A common exam and real-world mistake is assuming .terraform.lock.hcl locks both providers and registry modules.
- **Exam relevance:** HashiCorp states that the dependency lock file currently tracks provider dependencies only; remote module versions are re-selected from their constraints.
- **Prerequisites:** task-07-upgrade-to-0250
- **Sources:** src-lock-file, src-init, src-module-block

### Console / browser route

1. Open .terraform/modules/modules.json and locate training_label Version 0.25.0.
2. Look in the root folder for .terraform.lock.hcl.
3. If no lock file exists, note that this configuration has no provider dependency requiring a lock selection.
4. If a lock file exists because of a local Terraform behavior or prior experiment, search it for cloudposse/label/null and confirm it does not contain a remote module version selection.
5. State the rule: module version constraints live in the module block; exact pins are the way to force the same registry module version across fresh installations.

### CLI / Terraform route

#### PowerShell - compare module metadata and lock file

```
Get-Content .terraform\modules\modules.json
Test-Path .terraform.lock.hcl
if (Test-Path .terraform.lock.hcl) { Select-String -Path .terraform.lock.hcl -SimpleMatch "cloudposse/label/null" }
```

#### Bash - compare module metadata and lock file

```
cat .terraform/modules/modules.json
test -f .terraform.lock.hcl && echo "lock file exists" || echo "no lock file"
if [ -f .terraform.lock.hcl ]; then grep -F "cloudposse/label/null" .terraform.lock.hcl || true; fi
```

### Expected results

- modules.json shows the selected module version.
- .terraform.lock.hcl is not used to pin the remote module version.
- The learner can explain why an exact module version constraint provides reproducible registry module selection.

### Verification checks

- [ ] **task-08-lock-file-distinction-verify-01** — The selected module version is visible in modules.json.
- [ ] **task-08-lock-file-distinction-verify-02** — No cloudposse/label/null module selection is treated as a provider lock entry.
- [ ] **task-08-lock-file-distinction-verify-03** — The learner can distinguish provider locking from remote module version constraints.

# Phase 4: Narrow constraints and pin versions

Practice patch-line, compound-range and exact version constraints and observe how they change module selection.

## task-09-narrow-patch-line — Narrow the constraint to the 0.24 patch line

- **Feature:** Pessimistic patch constraint
- **Difficulty:** Hard
- **Goal:** Use ~> 0.24.0, reinitialize with -upgrade, and prove Terraform returns to the newest 0.24.x release.
- **Why it matters:** Adding the patch component changes the pessimistic upper bound, which is a practical version-constraint distinction worth seeing directly.
- **Exam relevance:** Objective 5d: manage module versions with precise version ranges rather than assuming all ~> expressions behave the same.
- **Prerequisites:** task-08-lock-file-distinction
- **Sources:** src-version-constraints, src-init, src-registry-label-0241

### Console / browser route

1. Replace version = "~> 0.24" with version = "~> 0.24.0" in main.tf.
2. Understand the new range: versions from 0.24.0 up to but not including 0.25.0 are acceptable.
3. Run terraform init -upgrade.
4. Inspect modules.json and confirm Terraform selects 0.24.1.
5. Run terraform validate.
6. Create and review a saved plan named fa-registry-modules-patch-line.tfplan.
7. Apply the reviewed saved plan and confirm the label output is unchanged.

### CLI / Terraform route

#### PowerShell - patch-line selection

```
terraform init -upgrade
Get-Content .terraform\modules\modules.json
terraform validate
terraform plan -out=fa-registry-modules-patch-line.tfplan
terraform show fa-registry-modules-patch-line.tfplan
terraform apply fa-registry-modules-patch-line.tfplan
terraform output training_label_id
```

#### Bash - patch-line selection

```
terraform init -upgrade
cat .terraform/modules/modules.json
terraform validate
terraform plan -out=fa-registry-modules-patch-line.tfplan
terraform show fa-registry-modules-patch-line.tfplan
terraform apply fa-registry-modules-patch-line.tfplan
terraform output training_label_id
```

### Supplied configuration

#### main.tf with patch-line constraint

```
terraform {
  required_version = ">= 1.5.0, < 2.0.0"
}

module "training_label" {
  source  = "cloudposse/label/null"
  version = "~> 0.24.0"

  namespace   = "fa"
  environment = "gbl"
  stage       = "training"
  name        = "registry-modules"
  attributes  = ["versioning"]
}
```

### Expected results

- Terraform selects 0.24.1 because 0.25.0 is outside ~> 0.24.0.
- Validation and reviewed apply succeed.
- The output remains stable.

### Verification checks

- [ ] **task-09-narrow-patch-line-verify-01** — modules.json shows Version 0.24.1.
- [ ] **task-09-narrow-patch-line-verify-02** — The learner can explain the difference between ~> 0.24 and ~> 0.24.0.
- [ ] **task-09-narrow-patch-line-verify-03** — The saved plan was reviewed before apply.

## task-10-compound-and-exact — Practice a compound range and then an exact pin

- **Feature:** Version constraint forms
- **Difficulty:** Hard
- **Goal:** Use an explicit lower/upper range and then finish with an exact module version pin.
- **Why it matters:** Being able to read equivalent constraints helps you understand what versions Terraform may select and when upgrades can happen.
- **Exam relevance:** Objective 5d covers managing module versions; this task compares compound constraints with an exact pin.
- **Prerequisites:** task-09-narrow-patch-line
- **Sources:** src-version-constraints, src-module-block, src-init, src-registry-label-current

### Console / browser route

1. Replace the version line with version = ">= 0.24.0, < 0.25.0" using the complete file below.
2. Run terraform init -upgrade and confirm modules.json still selects 0.24.1.
3. Notice that this compound range expresses the same practical 0.24.x ceiling as ~> 0.24.0 for the versions used in this lab.
4. Now replace the version line with version = "= 0.25.0" using the second complete file below.
5. Run terraform init -upgrade again and confirm modules.json selects exactly 0.25.0.
6. Run terraform validate after the final exact pin.

### CLI / Terraform route

#### PowerShell - reinitialize after each edit

```
terraform init -upgrade
Get-Content .terraform\modules\modules.json
terraform validate
```

#### Bash - reinitialize after each edit

```
terraform init -upgrade
cat .terraform/modules/modules.json
terraform validate
```

### Supplied configuration

#### main.tf with compound 0.24.x range

```
terraform {
  required_version = ">= 1.5.0, < 2.0.0"
}

module "training_label" {
  source  = "cloudposse/label/null"
  version = ">= 0.24.0, < 0.25.0"

  namespace   = "fa"
  environment = "gbl"
  stage       = "training"
  name        = "registry-modules"
  attributes  = ["versioning"]
}
```

#### main.tf final exact 0.25.0 pin

```
terraform {
  required_version = ">= 1.5.0, < 2.0.0"
}

module "training_label" {
  source  = "cloudposse/label/null"
  version = "= 0.25.0"

  namespace   = "fa"
  environment = "gbl"
  stage       = "training"
  name        = "registry-modules"
  attributes  = ["versioning"]
}
```

### Expected results

- The compound range selects 0.24.1.
- The final exact pin selects only 0.25.0.
- Validation succeeds after the exact pin.

### Verification checks

- [ ] **task-10-compound-and-exact-verify-01** — The learner can read >= 0.24.0, < 0.25.0 as an explicit range.
- [ ] **task-10-compound-and-exact-verify-02** — modules.json shows 0.25.0 after the final exact pin.
- [ ] **task-10-compound-and-exact-verify-03** — main.tf ends this task with version = "= 0.25.0".

# Phase 5: Create and repair a version-selection failure

Introduce an impossible module version constraint, read the init failure, and repair it without changing unrelated configuration.

## task-11-break-version-selection — Create an impossible module version constraint

- **Feature:** Troubleshooting version resolution
- **Difficulty:** Hard
- **Goal:** Intentionally request a version range the Registry cannot satisfy and diagnose the failure at terraform init.
- **Why it matters:** Version constraint failures happen before plan/apply; recognizing that boundary prevents you from troubleshooting unrelated providers or resources.
- **Exam relevance:** Objective 5d: an invalid or unsatisfiable module constraint prevents Terraform from installing an acceptable module version.
- **Prerequisites:** task-10-compound-and-exact
- **Sources:** src-version-constraints, src-init, src-registry-label-current

### Warnings

- This failure is intentional. Do not change the source address, delete state, or add credentials to try to fix it.

### Console / browser route

1. Replace the exact version line with version = ">= 1.0.0" using the complete failure file below.
2. Save main.tf.
3. Run terraform init -upgrade.
4. Expect initialization to fail because the Registry module used by this lab has no 1.x release and the current latest verified release is 0.25.0.
5. Read the error and identify that Terraform cannot find an available module version matching the configured constraint.
6. Do not run terraform plan or apply after the failed init. The working directory is not successfully initialized for the requested dependency set.

### CLI / Terraform route

#### PowerShell and Bash - trigger the safe failure

```
terraform init -upgrade
```

### Supplied configuration

#### main.tf with intentionally impossible constraint

```
terraform {
  required_version = ">= 1.5.0, < 2.0.0"
}

module "training_label" {
  source  = "cloudposse/label/null"
  version = ">= 1.0.0"

  namespace   = "fa"
  environment = "gbl"
  stage       = "training"
  name        = "registry-modules"
  attributes  = ["versioning"]
}
```

### Expected results

- terraform init -upgrade fails safely.
- The error identifies the module version constraint as unsatisfied.
- No resource or state change occurs because initialization stops first.

### Verification checks

- [ ] **task-11-break-version-selection-verify-01** — The failure happens during init.
- [ ] **task-11-break-version-selection-verify-02** — No plan or apply is attempted after the failure.
- [ ] **task-11-break-version-selection-verify-03** — The learner identifies >= 1.0.0 as the deliberate cause.

## task-12-repair-version-selection — Repair the failed init and re-establish the exact pin

- **Feature:** Controlled repair
- **Difficulty:** Hard
- **Goal:** Restore version 0.25.0, reinitialize, validate, review a saved plan and apply it.
- **Why it matters:** A controlled repair changes only the faulty version constraint and then re-runs the normal verification workflow.
- **Exam relevance:** Objective 5d plus troubleshooting discipline: fix the dependency constraint itself rather than changing unrelated infrastructure settings.
- **Prerequisites:** task-11-break-version-selection
- **Sources:** src-init, src-version-constraints, src-plan, src-show, src-apply, src-registry-label-current

### Console / browser route

1. Replace the impossible version line with version = "= 0.25.0" using the complete repaired main.tf below.
2. Run terraform init -upgrade.
3. Inspect modules.json and confirm Version 0.25.0.
4. Run terraform validate.
5. Create a saved plan named fa-registry-modules-repaired.tfplan.
6. Review it with terraform show.
7. Apply the reviewed plan by filename.
8. Run terraform output training_label_id and confirm the expected deterministic value.

### CLI / Terraform route

#### PowerShell - repair and verify

```
terraform init -upgrade
Get-Content .terraform\modules\modules.json
terraform validate
terraform plan -out=fa-registry-modules-repaired.tfplan
terraform show fa-registry-modules-repaired.tfplan
terraform apply fa-registry-modules-repaired.tfplan
terraform output training_label_id
```

#### Bash - repair and verify

```
terraform init -upgrade
cat .terraform/modules/modules.json
terraform validate
terraform plan -out=fa-registry-modules-repaired.tfplan
terraform show fa-registry-modules-repaired.tfplan
terraform apply fa-registry-modules-repaired.tfplan
terraform output training_label_id
```

### Supplied configuration

#### main.tf repaired to exact 0.25.0

```
terraform {
  required_version = ">= 1.5.0, < 2.0.0"
}

module "training_label" {
  source  = "cloudposse/label/null"
  version = "= 0.25.0"

  namespace   = "fa"
  environment = "gbl"
  stage       = "training"
  name        = "registry-modules"
  attributes  = ["versioning"]
}
```

### Expected results

- Initialization succeeds again.
- modules.json shows 0.25.0.
- Validation succeeds.
- The reviewed apply succeeds.
- training_label_id is fa-gbl-training-registry-modules-versioning.

### Verification checks

- [ ] **task-12-repair-version-selection-verify-01** — The repaired file changes only the version constraint from the deliberate failure.
- [ ] **task-12-repair-version-selection-verify-02** — The saved plan was reviewed before apply.
- [ ] **task-12-repair-version-selection-verify-03** — The expected label output returns.

# Phase 6: Verify exam coverage and clean up

Prove the module-version lessons, review the registry-versus-local-module boundary, and remove every local training artifact in reverse-dependency order.

## task-13-exam-review — Review Registry module and version-constraint exam points

- **Feature:** Exam consolidation
- **Difficulty:** Easy
- **Goal:** Turn the completed commands into a clear Terraform Associate 004 mental model for objectives 5a, 5c and 5d.
- **Why it matters:** The hands-on work matters only if you can explain the general Terraform behavior without relying on this one module.
- **Exam relevance:** Official exam mapping: 5a module sourcing, 5c using modules, and 5d managing module versions.
- **Prerequisites:** task-12-repair-version-selection
- **Sources:** src-exam-004, src-module-block, src-version-constraints, src-find-use-modules, src-lock-file, src-init

### Console / browser route

1. State the registry source rule: a public registry module source uses namespace/name/provider syntax, such as cloudposse/label/null.
2. State the version rule: the version argument is available for modules sourced from a registry; local filesystem modules do not use the version argument.
3. State the init rule: terraform init downloads child modules; terraform init -upgrade deliberately reconsiders already-installed module versions against the current constraints.
4. State the exact-pin rule: = 0.25.0 allows only 0.25.0.
5. State the pessimistic rule shown in the lab: ~> 0.24 allowed 0.25.0, while ~> 0.24.0 kept selection within the 0.24.x line.
6. State the compound rule: >= 0.24.0, < 0.25.0 expresses explicit lower and upper bounds.
7. State the lock-file rule: .terraform.lock.hcl currently records provider selections, not remote module version selections.
8. State the failure rule: if no module release satisfies the configured constraint, initialization fails before plan/apply.
9. State the boundary with the separate local-module refactoring lab: local module structure/refactoring and registry module release selection are different skills; this Follow Along intentionally covers the latter.

### CLI / Terraform route

#### Final module metadata check

```
terraform init
terraform validate
terraform output training_label_id
```

### Expected results

- The learner can explain all nine review points in their own words.
- Final configuration is initialized, valid and pinned to 0.25.0.
- No cloud infrastructure exists.

### Verification checks

- [ ] **task-13-exam-review-verify-01** — main.tf is pinned to = 0.25.0.
- [ ] **task-13-exam-review-verify-02** — The learner can explain why local modules do not use the registry version argument.
- [ ] **task-13-exam-review-verify-03** — The learner can explain why .terraform.lock.hcl is not a remote-module lock.
- [ ] **task-13-exam-review-verify-04** — The learner can explain when init -upgrade is required.

## task-14-cleanup — Run a saved destroy review and remove all local lab artifacts

- **Feature:** Reverse-dependency cleanup
- **Difficulty:** Medium
- **Goal:** Verify there is no managed infrastructure, review a saved destroy plan, and delete the local module cache, state, plan files and lab folder in safe order.
- **Why it matters:** Even a no-cloud lab should prove what Terraform manages before local state and caches are removed.
- **Exam relevance:** Objective 3f is reinforced safely: the destroy review confirms there are no managed resources, then local training artifacts are removed.
- **Prerequisites:** task-13-exam-review
- **Sources:** src-plan, src-show, src-apply, src-state-list, src-destroy

### Warnings

- Delete only C:\terraform-labs\fa-registry-modules-terraform and the exact plan/state/cache artifacts named by this lab.

### Console / browser route

1. Run terraform state list and confirm it prints no managed resource addresses.
2. Create a saved destroy plan named fa-registry-modules-destroy.tfplan with terraform plan -destroy -out=....
3. Review the destroy plan with terraform show. It must not contain any cloud resource destruction.
4. Apply the reviewed destroy plan by filename. Because the training module defines zero resources, Terraform has no infrastructure object to destroy.
5. Run terraform state list again and confirm it is still empty.
6. Delete the generated saved plan files from this lab only: baseline, upgrade-0250, patch-line, repaired and destroy plan files.
7. Delete the .terraform module cache only after the final Terraform verification is complete.
8. Delete any local terraform.tfstate or terraform.tfstate.backup files created by the local apply only after the final state verification.
9. Delete the exact lab folder C:\terraform-labs\fa-registry-modules-terraform last. Do not delete C:\terraform-labs or any sibling lab folder.
10. Verify the exact fa-registry-modules-terraform folder no longer exists.
11. Affirm the programme cleanup acknowledgement supplied below.

### CLI / Terraform route

#### PowerShell - saved destroy review

```
terraform state list
terraform plan -destroy -out=fa-registry-modules-destroy.tfplan
terraform show fa-registry-modules-destroy.tfplan
terraform apply fa-registry-modules-destroy.tfplan
terraform state list
```

#### PowerShell - local file cleanup

```
Remove-Item .\fa-registry-modules-baseline.tfplan -ErrorAction SilentlyContinue
Remove-Item .\fa-registry-modules-upgrade-0250.tfplan -ErrorAction SilentlyContinue
Remove-Item .\fa-registry-modules-patch-line.tfplan -ErrorAction SilentlyContinue
Remove-Item .\fa-registry-modules-repaired.tfplan -ErrorAction SilentlyContinue
Remove-Item .\fa-registry-modules-destroy.tfplan -ErrorAction SilentlyContinue
Remove-Item .\.terraform -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item .\terraform.tfstate -Force -ErrorAction SilentlyContinue
Remove-Item .\terraform.tfstate.backup -Force -ErrorAction SilentlyContinue
Set-Location ..
Remove-Item .\fa-registry-modules-terraform -Recurse -Force
Test-Path .\fa-registry-modules-terraform
```

#### Bash - saved destroy review

```
terraform state list
terraform plan -destroy -out=fa-registry-modules-destroy.tfplan
terraform show fa-registry-modules-destroy.tfplan
terraform apply fa-registry-modules-destroy.tfplan
terraform state list
```

#### Bash - local file cleanup

```
rm -f fa-registry-modules-baseline.tfplan
rm -f fa-registry-modules-upgrade-0250.tfplan
rm -f fa-registry-modules-patch-line.tfplan
rm -f fa-registry-modules-repaired.tfplan
rm -f fa-registry-modules-destroy.tfplan
rm -rf .terraform
rm -f terraform.tfstate
rm -f terraform.tfstate.backup
cd ..
rm -rf fa-registry-modules-terraform
test ! -d fa-registry-modules-terraform
```

### Expected results

- The saved destroy plan contains no cloud resource destruction.
- terraform state list is empty before and after the destroy review.
- All lab-only plan, cache and state files are removed.
- The exact fa-registry-modules-terraform folder is removed last.

### Verification checks

- [ ] **task-14-cleanup-verify-01** — No managed resource address exists before cleanup.
- [ ] **task-14-cleanup-verify-02** — The saved destroy plan was reviewed before apply.
- [ ] **task-14-cleanup-verify-03** — No cloud resource was destroyed because none was created.
- [ ] **task-14-cleanup-verify-04** — The exact local lab folder is absent after cleanup.
- [ ] **task-14-cleanup-verify-05** — No sibling lab folder or unrelated file was removed.

# Ordered manual cleanup

- **Completion gate:** `acknowledgement`
- **Manual only:** `true`
- **Ordering:** `reverse_dependency`

## Cleanup 1: fa-registry-modules-destroy.tfplan

- **Action:** Create and review the saved destroy plan, then apply that reviewed plan.
- **Verification:** terraform state list is empty and no cloud resource destruction appears in the destroy plan.
- **Task:** task-14-cleanup

## Cleanup 2: fa-registry-modules-baseline.tfplan, fa-registry-modules-upgrade-0250.tfplan, fa-registry-modules-patch-line.tfplan, fa-registry-modules-repaired.tfplan, fa-registry-modules-destroy.tfplan

- **Action:** Delete only the named saved plan files after final Terraform verification.
- **Verification:** None of the five lab plan files remains.
- **Task:** task-14-cleanup

## Cleanup 3: .terraform module cache

- **Action:** Delete the exact .terraform directory inside the lab folder.
- **Verification:** .terraform/modules and modules.json are absent.
- **Task:** task-14-cleanup

## Cleanup 4: terraform.tfstate and terraform.tfstate.backup

- **Action:** Delete only the lab-local state files after state list and destroy verification are complete.
- **Verification:** No lab-local state file remains.
- **Task:** task-14-cleanup

## Cleanup 5: main.tf and outputs.tf

- **Action:** Remove the configuration only as part of deleting the exact lab folder after all verification is finished.
- **Verification:** The files disappear with the exact lab folder.
- **Task:** task-14-cleanup

## Cleanup 6: C:\terraform-labs\fa-registry-modules-terraform

- **Action:** Delete the exact lab folder last. Do not delete its parent or sibling labs.
- **Verification:** The exact fa-registry-modules-terraform folder is absent and unrelated folders remain.
- **Task:** task-14-cleanup

## Programme cleanup acknowledgement

I verified that terraform state list contained no managed resource addresses; the saved destroy plan contained no cloud resource destruction; all five fa-registry-modules-terraform saved plan files, the .terraform module cache, and any lab-local Terraform state files were removed; and only then was the exact folder C:\terraform-labs\fa-registry-modules-terraform deleted without changing any sibling lab or unrelated file.

# Official sources

## src-exam-004 — Exam Content List - Terraform Associate 004

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-review-004
- **Purpose:** Maps Terraform Associate 004 module objectives 5a through 5d to official documentation and tutorials.
- **Used by:** task-01-prerequisites, task-02-registry-discovery, task-13-exam-review

## src-module-block — module block reference

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/language/block/module
- **Purpose:** Defines module source and version arguments and explains that version applies to registry modules.
- **Used by:** task-03-create-root-config, task-04-init-exact-version, task-06-broaden-constraint, task-08-lock-file-distinction, task-10-compound-and-exact, task-13-exam-review

## src-version-constraints — Version constraints

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/language/expressions/version-constraints
- **Purpose:** Defines exact, comparison, compound and pessimistic version constraint operators and best practices.
- **Used by:** task-03-create-root-config, task-06-broaden-constraint, task-07-upgrade-to-0250, task-09-narrow-patch-line, task-10-compound-and-exact, task-11-break-version-selection, task-12-repair-version-selection, task-13-exam-review

## src-find-use-modules — Find and use modules in the Terraform registry

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/registry/modules/use
- **Purpose:** Explains public registry module discovery, registry source addresses, versioned modules and terraform init module installation.
- **Used by:** task-01-prerequisites, task-02-registry-discovery, task-04-init-exact-version, task-13-exam-review

## src-use-registry-modules — Use registry modules in configuration

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/tutorials/modules/module-use
- **Purpose:** Official hands-on tutorial for selecting, configuring and using registry modules.
- **Used by:** task-02-registry-discovery, task-03-create-root-config

## src-init — terraform init command reference

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cli/commands/init
- **Purpose:** Explains child module installation and the -upgrade behavior for already-installed modules.
- **Used by:** task-04-init-exact-version, task-07-upgrade-to-0250, task-08-lock-file-distinction, task-09-narrow-patch-line, task-10-compound-and-exact, task-11-break-version-selection, task-12-repair-version-selection, task-13-exam-review

## src-lock-file — Dependency Lock File

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/language/files/dependency-lock
- **Purpose:** Explains that the dependency lock file currently tracks provider selections, not remote module version selections.
- **Used by:** task-04-init-exact-version, task-07-upgrade-to-0250, task-08-lock-file-distinction, task-13-exam-review

## src-fmt — terraform fmt command reference

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cli/commands/fmt
- **Purpose:** Formats Terraform configuration before validation.
- **Used by:** task-05-plan-apply-baseline

## src-validate — terraform validate command reference

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cli/commands/validate
- **Purpose:** Validates the syntax and internal consistency of Terraform configuration.
- **Used by:** task-05-plan-apply-baseline

## src-plan — terraform plan command reference

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cli/commands/plan
- **Purpose:** Creates and saves an execution plan for review.
- **Used by:** task-05-plan-apply-baseline, task-12-repair-version-selection, task-14-cleanup

## src-show — terraform show command reference

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cli/commands/show
- **Purpose:** Displays a saved Terraform plan for human review.
- **Used by:** task-05-plan-apply-baseline, task-12-repair-version-selection, task-14-cleanup

## src-apply — terraform apply command reference

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cli/commands/apply
- **Purpose:** Applies a previously reviewed saved plan.
- **Used by:** task-05-plan-apply-baseline, task-12-repair-version-selection, task-14-cleanup

## src-output — terraform output command reference

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cli/commands/output
- **Purpose:** Reads root module output values after apply.
- **Used by:** task-05-plan-apply-baseline

## src-state-list — terraform state list command reference

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cli/commands/state/list
- **Purpose:** Shows that this module-version lab manages no cloud resources.
- **Used by:** task-05-plan-apply-baseline, task-14-cleanup

## src-destroy — terraform destroy command reference

- **Publisher:** HashiCorp
- **URL:** https://developer.hashicorp.com/terraform/cli/commands/destroy
- **Purpose:** Supports the teardown concept; this lab uses a saved destroy plan and verifies that no managed resources exist.
- **Used by:** task-14-cleanup

## src-registry-label-current — cloudposse/label/null - Terraform Registry

- **Publisher:** Cloud Posse via Terraform Registry
- **URL:** https://registry.terraform.io/modules/cloudposse/label/null
- **Purpose:** Registry page for the no-resource label module used to practice module installation and version selection; shows multiple versions and zero managed resources.
- **Used by:** task-02-registry-discovery, task-05-plan-apply-baseline, task-06-broaden-constraint, task-07-upgrade-to-0250, task-10-compound-and-exact, task-11-break-version-selection, task-12-repair-version-selection

## src-registry-label-0241 — cloudposse/label/null version 0.24.1 - Terraform Registry

- **Publisher:** Cloud Posse via Terraform Registry
- **URL:** https://registry.terraform.io/modules/cloudposse/label/null/0.24.1
- **Purpose:** Confirms that the baseline module version 0.24.1 exists in the registry.
- **Used by:** task-02-registry-discovery, task-03-create-root-config, task-04-init-exact-version, task-09-narrow-patch-line

## src-cloudposse-label-docs — Cloud Posse label module documentation

- **Publisher:** Cloud Posse
- **URL:** https://docs.cloudposse.com/modules/library/null/label/
- **Purpose:** Primary module-publisher documentation for the label module inputs and naming behavior.
- **Used by:** task-02-registry-discovery, task-03-create-root-config

# Quality report

- **Phase count:** 6
- **Task count:** 14
- **Checkbox count:** 47
- **CLI command count:** 109
- **Editable-block count:** 8
- **Verification count:** 47
- **Cleanup-item count:** 6
- **Official-source count:** 18
- **Missing items:** 0
- **Uncertain items:** 0

# Offline conversion boundary

This preview and its JSON manuscript are intentionally offline authoring artifacts. They have not been locally validated by Study Tracker, imported, accepted, approved, published, or fingerprinted. Local Codex should convert and validate them using the repository's controlled workflow.
