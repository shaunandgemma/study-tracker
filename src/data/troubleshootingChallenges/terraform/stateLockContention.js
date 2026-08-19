export default Object.freeze({
  id: 'terraform-state-lock-contention',
  examId: 'terraform-associate-004',
  order: 23,
  category: 'Terraform State',
  title: 'Investigate Terraform State Lock Contention',
  difficulty: 'Intermediate',
  summary: 'Determine whether a state lock is active or abandoned before considering force-unlock.',
  scenario: 'A developer starts terraform plan against the shared remote backend and receives a state-lock error. Another engineer is known to have started a long-running terraform apply only two minutes earlier. The state must not be force-unlocked while a legitimate writer is still active.',
  task: 'Use the lock information and team activity evidence to determine whether the lock is legitimate, choose the safe immediate response, and verify normal access after the active operation finishes.',
  evidence: [
    {
      id: 'lock-error',
      title: 'Terraform Lock Error',
      kind: 'code',
      content: `$ terraform plan

╷
│ Error: Error acquiring the state lock
│
│ Error message: ConditionalCheckFailedException:
│ The conditional request failed
│
│ Lock Info:
│   ID:        6e713de4-training-lock-91aa
│   Path:      fa-terraform-state-123456789012/training/network/terraform.tfstate
│   Operation: OperationTypeApply
│   Who:       engineer-a@training-workstation
│   Version:   1.10.5
│   Created:   2026-08-19 12:28:14 +0000 UTC
│   Info:
╵`
    },
    {
      id: 'team-activity',
      title: 'Team Activity',
      kind: 'text',
      content: 'At 12:30 UTC, engineer-a confirmed that terraform apply is still running and is creating the final training resource. Their terminal is responsive and they have not reported a crash or lost connection. No incident has been declared against the lock holder.'
    },
    {
      id: 'safety-boundary',
      title: 'State Safety Boundary',
      kind: 'text',
      content: 'Do not use terraform force-unlock while another active Terraform process holds the lock. If a future lock appears abandoned, first confirm that no process is still writing state and verify the exact lock ID before considering force-unlock.'
    }
  ],
  successCriteria: [
    'The learner identifies the lock as a legitimate active apply rather than an abandoned stale lock.',
    'No force-unlock or backend manipulation is performed while engineer-a is still applying changes.',
    'The learner waits for or coordinates completion of the active operation and then retries the intended Terraform command.',
    'A final retry acquires the state lock normally after the first apply releases it.'
  ],
  hints: [
    'Compare the lock Created time and Operation value with the team activity evidence.',
    'State locking prevents multiple writers from changing the same state concurrently; a lock error is not automatically evidence of a stale lock.',
    'Because engineer-a confirms the apply is still running, do not force-unlock; let that operation finish and then retry.'
  ],
  validationQuestions: [
    {
      id: 'root-cause',
      prompt: 'Why can the second Terraform operation not acquire the state lock?',
      options: [
        { id: 'active-apply', text: 'Another legitimate terraform apply is currently holding the lock for the same remote state.' },
        { id: 'corrupt-state', text: 'The state file is corrupt and therefore permanently locked.' },
        { id: 'wrong-workspace', text: 'The second user selected a different workspace.' },
        { id: 'missing-provider', text: 'The provider plugin is missing from the second workstation.' }
      ],
      correctOptionId: 'active-apply',
      explanation: 'The lock metadata says OperationTypeApply, it was created only minutes earlier, and engineer-a confirms that the apply process is still actively running.'
    },
    {
      id: 'safe-resolution',
      prompt: 'What is the safest immediate response?',
      options: [
        { id: 'wait-and-retry', text: 'Allow the active apply to finish and release the lock, then retry the Terraform operation.' },
        { id: 'force-unlock-now', text: 'Immediately run terraform force-unlock with the displayed lock ID.' },
        { id: 'delete-lock-object', text: 'Delete the backend lock object manually while the apply continues.' },
        { id: 'copy-state', text: 'Download the state, create a second state file, and continue both operations independently.' }
      ],
      correctOptionId: 'wait-and-retry',
      explanation: 'Force-unlocking an active writer can allow concurrent state writes and risk state corruption, so the valid lock should be allowed to complete normally.'
    }
  ],
  solution: {
    rootCause: 'The shared state is legitimately locked by engineer-a’s currently running terraform apply, so the second Terraform process is correctly blocked from obtaining a concurrent write lock.',
    fix: 'Coordinate with engineer-a, allow the active apply to finish and release the state lock normally, then retry the second Terraform operation and confirm it can acquire the lock. Use force-unlock only for a verified abandoned lock and only with the exact lock ID.',
    prevention: 'Coordinate shared Terraform operations, use remote backends with locking, and establish a documented stale-lock procedure that requires confirming the original process is no longer active before any force-unlock.'
  }
});
