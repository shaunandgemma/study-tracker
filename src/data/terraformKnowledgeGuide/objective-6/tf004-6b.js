export const guide = Object.freeze({
  "id": "tf004-6b",
  "group": "state",
  "title": "Terraform state locking",
  "plainEnglish": "Locking prevents another supported Terraform operation from writing the same state at the same time. Terraform acquires a lock when the backend supports it and releases it when the operation ends.",
  "whyItMatters": "Two simultaneous writers could overwrite each other’s state and lose the mapping to real resources.",
  "workplaceExample": "A deployment waits because another run holds the workspace lock. The team investigates the run instead of immediately forcing the lock open.",
  "examFocus": "Know that backend support varies. force-unlock is exceptional and requires the exact lock ID after confirming no operation is active.",
  "keyPoints": [
    "Locking protects concurrent writes.",
    "Not every backend behaves identically.",
    "Do not force-unlock an active operation.",
    "Locking protects state, not every external manual change."
  ],
  "commonMistake": "Editing or sharing a state file manually. State may contain sensitive data and must be protected and changed with supported workflows.",
  "example": null,
  "sources": [
    {
      "title": "Terraform Associate 004 exam content list",
      "url": "https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-review-004"
    },
    {
      "title": "Official Terraform documentation for this topic",
      "url": "https://developer.hashicorp.com/terraform/language/state"
    }
  ]
});

export default guide;
