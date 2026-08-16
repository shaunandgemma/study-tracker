# Terraform Associate 004 Content Coverage Map

This map is the content-production source of truth for the local Terraform exam workspace.

## Current position

| Content area | Current coverage |
|---|---:|
| Official checklist objectives | 37 |
| Knowledge Guide objectives | 37 of 37 |
| Objectives with direct practice questions | 32 of 37 |
| Objectives represented in existing Follow Alongs | 28 of 37 |
| Objectives directly exercised by Troubleshooting | 5 of 37 |
| Unique practice questions | 30 |
| Terraform Follow Along programmes | 4 |
| Terraform Troubleshooting incidents | 3 |

## Existing practical programmes

1. `terraform-configuration-foundations-learning-path` — Understanding and Building Terraform Configuration.
2. `terraform-beginner-learning-path` — Terraform Associate Beginner Follow Along.
3. `terraform-state-backend-learning-path` — Terraform State and Remote Backend Follow Along.
4. `terraform-modules-refactoring-learning-path` — Terraform Modules and Refactoring Follow Along.

Follow Along 3 deepens provider initialization, the core workflow, variables, outputs, functions, validation, module sources, module scope, module reuse, state inspection and safe moved-block refactoring. It does not claim module-version coverage because the practical lab uses a local module source.

## Objective map

Legend: **Yes** means at least one directly mapped item currently exists. A dash identifies a genuine content gap, not a broken application link.

| Objective | Checklist subject | Guide | Questions | Follow Along | Troubleshooting |
|---|---|---:|---:|---:|---:|
| 1a | Explain what infrastructure as code is | Yes | 1 | Yes | — |
| 1b | Advantages of infrastructure-as-code patterns | Yes | 1 | Yes | — |
| 1c | Multi-cloud, hybrid-cloud and service-agnostic workflows | Yes | 1 | — | — |
| 2a | Install and version providers | Yes | 2 | Yes | — |
| 2b | How Terraform uses providers | Yes | 1 | Yes | — |
| 2c | Configuration using multiple providers | Yes | 1 | — | — |
| 2d | How Terraform uses and manages state | Yes | 1 | Yes | — |
| 3a | Core Terraform workflow | Yes | 2 | Yes | — |
| 3b | Initialise a working directory | Yes | 1 | Yes | — |
| 3c | Validate configuration | Yes | — | Yes | Yes |
| 3d | Generate and review an execution plan | Yes | 2 | Yes | Yes |
| 3e | Apply infrastructure changes | Yes | 1 | Yes | — |
| 3f | Destroy managed infrastructure | Yes | — | Yes | — |
| 3g | Formatting and style adjustments | Yes | — | Yes | — |
| 4a | Resource and data blocks | Yes | 1 | Yes | Yes |
| 4b | Attributes and cross-resource references | Yes | 1 | Yes | — |
| 4c | Variables and outputs | Yes | — | Yes | — |
| 4d | Complex types | Yes | — | Yes | — |
| 4e | Expressions and functions | Yes | 1 | Yes | — |
| 4f | Resource dependencies | Yes | 2 | Yes | Yes |
| 4g | Custom validation conditions | Yes | 1 | Yes | — |
| 4h | Sensitive data and secrets management | Yes | 2 | — | — |
| 5a | Module sources | Yes | 1 | Yes | — |
| 5b | Variable scope within modules | Yes | 1 | Yes | — |
| 5c | Use modules in configuration | Yes | 1 | Yes | — |
| 5d | Module versions | Yes | 1 | — | — |
| 6a | Local backend | Yes | 1 | Yes | — |
| 6b | State locking | Yes | 1 | Yes | — |
| 6c | Remote state using a backend block | Yes | 1 | Yes | — |
| 6d | Resource drift and state | Yes | 2 | Yes | Yes |
| 7a | Import existing infrastructure | Yes | 2 | Yes | — |
| 7b | Inspect state with the CLI | Yes | 1 | Yes | — |
| 7c | Verbose Terraform logging | Yes | 1 | — | — |
| 8a | Create infrastructure with HCP Terraform | Yes | 2 | — | — |
| 8b | HCP Terraform collaboration and governance | Yes | 2 | — | — |
| 8c | HCP Terraform workspaces and projects | Yes | 2 | — | — |
| 8d | HCP Terraform integrations | Yes | 1 | — | — |

## Immediate content priorities

### Priority 1 — close direct question gaps

Add questions for:

1. `tf004-3c` — validation.
2. `tf004-3f` — destruction.
3. `tf004-3g` — formatting.
4. `tf004-4c` — variables and outputs.
5. `tf004-4d` — complex types.

After these five objectives have direct questions, question coverage will reach 37 of 37. Continue expanding toward approximately three strong questions per objective rather than stopping at one.

### Priority 2 — build the next practical programmes

1. **Variables, Expressions and Validation Follow Along** — deepen objectives 4c–4g, including complex types.
2. **Import and Maintenance Follow Along** — deepen objectives 7a–7c, including logging.
3. **HCP Terraform Follow Along** — cover objectives 8a–8d.
4. **Providers and Sensitive Data Follow Along** — cover multiple providers, aliases, authentication and objective 4h.
5. **Registry Modules and Version Constraints Follow Along** — add the practical module-version coverage intentionally not claimed by the local-module refactoring lab.

Objective 1c is primarily conceptual, but it can be demonstrated naturally in the providers programme rather than receiving a separate lab.

### Priority 3 — expand troubleshooting by skill cluster

The next incidents should be:

1. Provider alias or initialization failure.
2. Variable type, expression or validation failure.
3. Broken module input/output or version constraint.
4. Backend initialization or state-lock failure.
5. Import and resource-address mismatch.
6. Sensitive value exposed in plan or state.
7. HCP Terraform run, variable or integration failure.

Troubleshooting does not require one incident per objective. One well-designed incident should exercise several connected skills.

## Maintenance rule

Update `src/data/terraformCoverageMap.js` whenever a Terraform question, Follow Along or Troubleshooting incident is added. Knowledge Guide coverage is resolved directly from the existing 37 guide files. The Markdown document is the readable planning snapshot; the JavaScript map is the machine-readable source of truth.

## Boundaries

This map records local application content only. It does not write to Supabase, Author, AWS, HCP Terraform or any published programme.
