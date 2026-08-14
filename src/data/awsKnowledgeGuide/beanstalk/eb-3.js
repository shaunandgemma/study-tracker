import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "eb-3",
  "topicId": "topic-beanstalk",
  "topicTitle": "AWS Elastic Beanstalk",
  "objectiveCode": "Compute",
  "title": "Beanstalk Configuration Files (.ebextensions / Procfile) & Platform Updates",
  "status": "ready",
  "plainEnglish": "Elastic Beanstalk configuration files (stored in the `.ebextensions/` directory of your source bundle with a `.config` extension) allow you to customize your server environment using YAML or JSON. You can use `.ebextensions` to install Linux packages, run setup shell commands, configure Linux daemons, create custom AWS resources, and set environment option settings. A `Procfile` is a simple text file placed at the root of your application code that specifies the exact command used to start your application process.",
  "whyItMatters": "While Elastic Beanstalk provides automated platform defaults, real-world enterprise applications require custom OS packages (e.g. ImageMagick, libpq), custom cron jobs, or auxiliary AWS resources (like custom S3 buckets or DynamoDB tables). Configuration files allow you to version-control your server configuration directly alongside your source code.",
  "workplaceExample": "A Node.js application team adds a file `.ebextensions/01_packages.config` that installs `htop` and `graphicsmagick` on all EC2 instances and creates a `Procfile` containing `web: node server.js`. When Beanstalk deploys the code, it automatically executes these setup tasks before launching the application.",
  "examFocus": "For SAA-C03, know that `.ebextensions/*.config` files must reside in the `.ebextensions` folder at the root of your application source bundle. Configuration files are executed in alphabetical order. Understand Managed Platform Updates: Elastic Beanstalk can automatically apply minor and patch platform version updates (OS, web server, runtime patches) during a weekly maintenance window with zero downtime.",
  "keyPoints": [
    "`.ebextensions/` folder contains `.config` files written in YAML or JSON to customize instances.",
    "Executed in alphabetical/lexicographical order (e.g., `01_packages.config`, `02_cron.config`).",
    "Can install OS packages, execute shell commands, manage container files, and declare AWS resources.",
    "`Procfile` at the application root specifies the startup command for your application process.",
    "Managed Platform Updates automatically apply minor/patch OS and runtime updates during maintenance windows."
  ],
  "commonMistake": "Placing `.config` files directly in the root directory instead of inside a hidden `.ebextensions/` folder. Files outside `.ebextensions/` will be ignored by the Elastic Beanstalk deployment engine.",
  "example": "# File: .ebextensions/01_setup.config\npackages:\n  yum:\n    htop: []\n    git: []\ncontainer_commands:\n  01_migrate_database:\n    command: \"npm run db:migrate\"\n    leader_only: true",
  "sources": [
    {
      "title": "Customizing Software on Linux Servers with .ebextensions",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/ebextensions.html"
    },
    {
      "title": "Managed Platform Updates in Elastic Beanstalk",
      "url": "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/environment-platform-update-managed.html"
    }
  ]
});
