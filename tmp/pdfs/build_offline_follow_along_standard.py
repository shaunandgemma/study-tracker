from pathlib import Path
from textwrap import dedent

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageBreak,
    PageTemplate,
    Paragraph,
    Preformatted,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(r"E:\code\study-tracker")
OUTPUT = ROOT / "output" / "pdf" / "STUDY_TRACKER_OFFLINE_FOLLOW_ALONG_AUTHORING_STANDARD.pdf"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

PAGE_WIDTH, PAGE_HEIGHT = A4
NAVY = colors.HexColor("#071426")
PANEL = colors.HexColor("#10233d")
CYAN = colors.HexColor("#18c8e8")
TEAL = colors.HexColor("#33e0b3")
AMBER = colors.HexColor("#f6c85f")
WHITE = colors.HexColor("#f7fbff")
MUTED = colors.HexColor("#b8c7d9")
INK = colors.HexColor("#14263d")
LIGHT = colors.HexColor("#eef5fb")
BORDER = colors.HexColor("#c8d9e8")


def page_chrome(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, PAGE_HEIGHT - 18 * mm, PAGE_WIDTH, 18 * mm, stroke=0, fill=1)
    canvas.setFillColor(CYAN)
    canvas.rect(0, PAGE_HEIGHT - 18 * mm, 4 * mm, 18 * mm, stroke=0, fill=1)
    canvas.setFont("Helvetica-Bold", 8.5)
    canvas.setFillColor(WHITE)
    canvas.drawString(12 * mm, PAGE_HEIGHT - 11.5 * mm, "STUDY TRACKER - OFFLINE FOLLOW ALONG STANDARD")
    canvas.setStrokeColor(BORDER)
    canvas.line(14 * mm, 13 * mm, PAGE_WIDTH - 14 * mm, 13 * mm)
    canvas.setFillColor(colors.HexColor("#607890"))
    canvas.setFont("Helvetica", 8)
    canvas.drawString(14 * mm, 8 * mm, "Version 1.0 - 16 August 2026")
    canvas.drawRightString(PAGE_WIDTH - 14 * mm, 8 * mm, f"Page {doc.page}")
    canvas.restoreState()


doc = BaseDocTemplate(
    str(OUTPUT),
    pagesize=A4,
    rightMargin=16 * mm,
    leftMargin=16 * mm,
    topMargin=25 * mm,
    bottomMargin=18 * mm,
    title="Study Tracker Offline Follow Along Authoring Standard",
    author="Study Tracker",
    subject="Standalone instructions for producing complete Follow Along educational manuscripts without repository access",
)
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="main")
doc.addPageTemplates([PageTemplate(id="standard", frames=[frame], onPage=page_chrome)])

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="DocTitle", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=26,
    leading=31, textColor=WHITE, alignment=TA_LEFT, spaceAfter=8 * mm,
))
styles.add(ParagraphStyle(
    name="Subtitle", parent=styles["Normal"], fontName="Helvetica", fontSize=12,
    leading=17, textColor=MUTED, spaceAfter=5 * mm,
))
styles.add(ParagraphStyle(
    name="H1x", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=19,
    leading=23, textColor=INK, spaceBefore=2 * mm, spaceAfter=4 * mm,
))
styles.add(ParagraphStyle(
    name="H2x", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=13,
    leading=16, textColor=colors.HexColor("#087c98"), spaceBefore=4 * mm, spaceAfter=2 * mm,
))
styles.add(ParagraphStyle(
    name="Bodyx", parent=styles["BodyText"], fontName="Helvetica", fontSize=9.4,
    leading=13.6, textColor=INK, spaceAfter=2.4 * mm,
))
styles.add(ParagraphStyle(
    name="Bulletx", parent=styles["BodyText"], fontName="Helvetica", fontSize=9.2,
    leading=13.2, leftIndent=5 * mm, firstLineIndent=-3.5 * mm, textColor=INK, spaceAfter=1.4 * mm,
))
styles.add(ParagraphStyle(
    name="Smallx", parent=styles["BodyText"], fontName="Helvetica", fontSize=8.2,
    leading=11.2, textColor=colors.HexColor("#405872"), spaceAfter=1.8 * mm,
))
styles.add(ParagraphStyle(
    name="Calloutx", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=9.2,
    leading=13, textColor=INK, leftIndent=3 * mm, rightIndent=3 * mm,
))
styles.add(ParagraphStyle(
    name="Codex", parent=styles["Code"], fontName="Courier", fontSize=6.8,
    leading=9.2, textColor=WHITE,
))


story = []


def h1(text):
    story.append(Paragraph(text, styles["H1x"]))


def h2(text):
    story.append(Paragraph(text, styles["H2x"]))


def p(text, style="Bodyx"):
    story.append(Paragraph(text, styles[style]))


def bullets(items):
    for item in items:
        story.append(Paragraph(f"- {item}", styles["Bulletx"]))


def numbered(items, start=1):
    for index, item in enumerate(items, start):
        story.append(Paragraph(f"{index}. {item}", styles["Bulletx"]))


def callout(title, text, color=CYAN):
    table = Table([[Paragraph(title, styles["Calloutx"]), Paragraph(text, styles["Bodyx"])]], colWidths=[38 * mm, 131 * mm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), LIGHT),
        ("BOX", (0, 0), (-1, -1), 0.8, color),
        ("LINEBEFORE", (0, 0), (0, -1), 3, color),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    story.extend([table, Spacer(1, 3 * mm)])


def code(text):
    block = Preformatted(dedent(text).strip("\n"), styles["Codex"], maxLineLength=106)
    panel = Table([[block]], colWidths=[169 * mm])
    panel.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PANEL),
        ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#254764")),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    story.extend([Spacer(1, 2 * mm), panel, Spacer(1, 3 * mm)])


def new_page():
    story.append(PageBreak())


# Cover
cover = Table([[Paragraph("OFFLINE AUTHORING STANDARD", ParagraphStyle(
    "coverTag", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=9,
    textColor=NAVY, alignment=TA_CENTER, leading=11,
))]], colWidths=[63 * mm])
cover.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), CYAN),
    ("BOX", (0, 0), (-1, -1), 0, CYAN),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
]))
story.extend([Spacer(1, 24 * mm), cover, Spacer(1, 8 * mm)])
title_panel = Table([[
    Paragraph("Study Tracker<br/>Follow Along<br/>Authoring Standard", styles["DocTitle"]),
]], colWidths=[169 * mm])
title_panel.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), NAVY),
    ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#254764")),
    ("LEFTPADDING", (0, 0), (-1, -1), 12 * mm),
    ("RIGHTPADDING", (0, 0), (-1, -1), 12 * mm),
    ("TOPPADDING", (0, 0), (-1, -1), 13 * mm),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 9 * mm),
]))
story.extend([title_panel, Spacer(1, 6 * mm)])
p("A standalone specification that can be uploaded to ChatGPT, Gemini or another capable model to create complete beginner-friendly Follow Along content without access to the Study Tracker repository.", "Subtitle")
callout("IMPORTANT", "The external model creates an educational manuscript. It must not claim that it created an app-ready handoff fingerprint, Author draft, release candidate or publication. Those remain controlled local-app operations.", AMBER)
p("Prepared for Shaun Estcourt | Version 1.0 | 16 August 2026", "Smallx")

new_page()
h1("1. How to use this PDF")
numbered([
    "Open a new ChatGPT or Gemini conversation.",
    "Upload this PDF as the governing specification.",
    "Send the short master request on page 17 with your chosen topic and learning outcome.",
    "Ask the model to return the two offline deliverables described in section 14.",
    "Review the readable preview. Correct educational content before involving Study Tracker.",
    "Give the approved manuscript to an app-aware local Codex task for schema conversion, deterministic validation and controlled import."
])
h2("What this saves")
bullets([
    "No OpenAI API key is required when the drafting model is used through a normal ChatGPT or Gemini plan.",
    "The expensive content-writing stage happens outside the Author Assistant API script.",
    "Only the much smaller deterministic conversion and validation stage needs repository access.",
    "The same specification can be reused for Terraform, AWS, networking, Kubernetes and future exam workspaces."
])
callout("ONE DOCUMENT", "Upload this entire PDF. Do not copy only isolated pages, because safety, cleanup and output rules depend on each other.")

h2("What the external model cannot do")
bullets([
    "It cannot inspect the current app schema, database state, Shared Drafts or candidate queue.",
    "It cannot generate a trustworthy Study Tracker fingerprint without the local fingerprint helper.",
    "It cannot bind an Author identity, import, approve or publish.",
    "It must not invent confirmation that local validation succeeded."
])

new_page()
h1("2. Required input from the learner")
p("Before writing, the external model must have the following facts. If a fact is missing, it may ask a short question rather than inventing it.")
data = [
    ["Input", "Example"],
    ["Programme title", "Terraform Import and Maintenance Follow Along"],
    ["Topic or service", "Terraform import blocks with AWS Systems Manager Parameter Store"],
    ["Exam workspace", "HashiCorp Terraform Associate 004"],
    ["Learner level", "Beginner to Intermediate"],
    ["Outcome", "Import, inspect, repair drift and safely destroy one existing object"],
    ["Region or scope", "eu-west-2 or global"],
    ["Routes", "Graphical/Console and CLI/Terraform"],
    ["Resource prefix", "fa-terraform-import-maintenance"],
    ["Constraints", "No existing infrastructure; training account only"],
]
t = Table([[Paragraph(cell, styles["Smallx"]) for cell in row] for row in data], colWidths=[48 * mm, 121 * mm], repeatRows=1)
t.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), NAVY),
    ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
    ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
    ("BACKGROUND", (0, 1), (-1, -1), colors.white),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
]))
story.extend([t, Spacer(1, 4 * mm)])
h2("Default assumptions")
bullets([
    "The learner starts with no infrastructure created for this lab.",
    "The learner may not know how to open a terminal, create a folder, create a file or save it with the correct extension.",
    "The learner uses a disposable training account and must not use the root account for routine work.",
    "Every resource has a harmless fixed training name wherever the provider permits one.",
    "Durations are optional. Use Self-paced when no genuine estimate exists."
])

new_page()
h1("3. Non-negotiable teaching standard")
bullets([
    "Write for a learner performing the task for the first time.",
    "Explain what the learner is doing, why it matters and how to recognise success.",
    "Use one concrete action per checkbox. Do not compress several clicks into vague prose.",
    "Name the exact page, menu, button, field, value and Region whenever relevant.",
    "Supply every required policy, Terraform file, YAML document, JSON body, shell script and command in full.",
    "Explain every placeholder before first use. Prefer fixed harmless names over placeholders.",
    "Include a visible expected result after each meaningful step.",
    "Include complete verification and complete reverse-dependency cleanup.",
    "Do not use placeholder, catalogue, future work, add later, supplied elsewhere or deferred wording.",
    "Do not assume existing VPCs, subnets, roles, profiles, repositories, folders, files, state or credentials unless the user explicitly says they exist."
])
callout("QUALITY TEST", "A learner should be able to complete the lab using only the generated manuscript and its linked official documentation.", TEAL)
h2("Forbidden shortcuts")
bullets([
    "Configure the service as required.",
    "Create the necessary permissions.",
    "Use your existing network.",
    "Paste the supplied JSON when no JSON block is included.",
    "Run the usual Terraform commands.",
    "Delete the resources when finished."
])

new_page()
h1("4. Programme structure")
p("Organise the programme in a logical learning journey. Four phases is a useful minimum for a substantial Follow Along, but use as many phases and tasks as the subject genuinely requires.")
h2("Recommended phase pattern")
numbered([
    "Prepare - explain scope, tools, identity, Region, names and safety boundaries.",
    "Create - build the smallest complete working environment from nothing.",
    "Understand - inspect files, resources, state, outputs and important decisions.",
    "Change and troubleshoot - make a controlled change, observe behaviour and repair a realistic fault.",
    "Verify - prove the intended result using visible evidence.",
    "Cleanup - delete every lab-created item in reverse dependency order and verify absence."
])
h2("Every task requires")
bullets([
    "Stable unique task ID and phase ID.",
    "Title, feature, goal, why it matters and Easy, Medium or Hard difficulty.",
    "Prerequisites referencing earlier task IDs only.",
    "Explicit mode availability for graphical/Console and CLI/Terraform routes.",
    "Complete steps, expected results, warnings where needed and at least one verification check.",
    "Official source IDs that resolve to the source list."
])

new_page()
h1("5. Console and graphical route")
p("A graphical route is not a summary of the CLI route. It must be independently usable.")
numbered([
    "State where to sign in and how to confirm the intended training account.",
    "State how to select the required Region.",
    "Name the service to enter in the Console search box.",
    "Name each navigation item and button in click order.",
    "Give the exact value for every field and explain important choices.",
    "Explain safe defaults and settings that must remain unchanged.",
    "Show where generated IDs, status values, logs, tags or outputs appear.",
    "Include a visible success condition before continuing.",
    "Explain the Console cleanup path and exact confirmation text."
])
h2("Good instruction")
callout("EXAMPLE", "In the upper-right Region selector choose Europe (London) eu-west-2. In the Console search box enter Systems Manager, open it, choose Parameter Store in the left navigation, then choose Create parameter.", TEAL)
h2("Weak instruction")
callout("DO NOT USE", "Open SSM and create the parameter with the correct settings.", AMBER)

new_page()
h1("6. CLI and Terraform route")
bullets([
    "Show how to open the correct terminal for Windows PowerShell and Bash-based environments where both are supported.",
    "Show how to create and enter the exact lab folder, then verify the current location.",
    "Show how to create every file. Include the complete content directly after the instruction.",
    "Use one executable command per command entry. Do not chain commands with semicolons, && or pipes unless the pipe itself is the concept being taught.",
    "Explain what each command does, why it is run and the expected output.",
    "For Terraform, teach init, fmt, validate, plan, saved-plan review, apply and verification in order.",
    "Never apply an unreviewed plan. Use a named saved plan for consequential changes and teardown.",
    "Explain configuration, provider cache, lock file, state, plan files and outputs when they first appear.",
    "Provide separate PowerShell and Bash commands when syntax differs materially."
])
h2("Terraform file rule")
p("Never say Save the supplied file unless the complete file is present in the same task. Terraform and HCL must use a text block, not a JSON block.")
code('''
EDITABLE BLOCK: main.tf
language: text

terraform {
  required_version = ">= 1.5.0"
}

# Complete configuration continues here.
END EDITABLE BLOCK
''')

new_page()
h1("7. Editable code and policy blocks")
h2("Required block fields")
bullets([
    "A clear title or filename.",
    "A correct language value.",
    "Complete copyable content with readable line breaks and indentation.",
    "An instruction explaining exactly where the learner pastes or saves it.",
    "Any safe values that must be replaced, explained before the block."
])
h2("Language rules")
bullets([
    "Use language json only when the block is valid JSON.",
    "Use language text for Terraform HCL, YAML, PowerShell, Bash, user data and other non-JSON content.",
    "Do not convert multiline code into one long line.",
    "Do not hide required content in prose or an external source link."
])
callout("IAM POLICY", "If a lab creates a customer-managed IAM policy, provide the complete valid policy JSON in a visible editable block. Explain its scope and why each permission group exists.")

new_page()
h1("8. Identity, credentials and secrets")
bullets([
    "Do not use the AWS root user for routine lab actions.",
    "Prefer IAM Identity Center and temporary credentials when the learning goal permits it.",
    "If the lab specifically teaches a temporary IAM user, an administrator creates the narrowly scoped user and policy, and cleanup deletes them.",
    "Never put a password, secret access key, session token, private key or other credential in the manuscript, source control, screenshots, chat or Study Tracker.",
    "Never ask the learner to paste a credential into a Saved Resource Capture field.",
    "Access-key values may be entered only into the protected AWS CLI configure prompts, then the creation screen must be closed.",
    "Do not invent a least-privilege policy. Derive permissions from the exact lab actions and official documentation, then explain any unavoidable Resource star."
])
callout("SECRET RULE", "The output must contain zero real credentials. If the user supplies a credential, do not repeat it; tell the user to revoke or rotate it.", AMBER)

h2("Saved resource capture")
p("Only recommend saved bindings for genuinely variable, non-secret values that later instructions interpolate, such as an automatically generated instance ID, ARN or mapping UUID. Do not capture fixed names, local folders, profile names, policy names, user names or access keys.")

new_page()
h1("9. Resource naming and lifecycle")
bullets([
    "Use one unique fixed prefix across the programme.",
    "List every created cloud, identity, networking and local resource.",
    "Mark whether a name is fixed or generated.",
    "Mark whether a resource can incur charges.",
    "Record dependencies so cleanup can be reversed safely.",
    "Do not tell the learner to select or delete an unnamed resource.",
    "When a value is generated, explain exactly where to find it and use a safe symbolic reference in later prose."
])
h2("Portable resource record")
code('''
{
  "id": "resource-app-instance",
  "label": "Application EC2 instance",
  "exactName": "fa-example-web-a",
  "generatedValue": "instance ID",
  "captureAllowed": true,
  "sensitive": false,
  "chargeable": true,
  "createdByTaskId": "task-create-instance",
  "dependsOn": ["resource-public-subnet", "resource-security-group"]
}
''')

new_page()
h1("10. Verification and expected results")
p("Verification must prove that the learner achieved the goal. Merely repeating the action is not verification.")
bullets([
    "Use visible Console state, command output, HTTP response, log event, metric, plan summary or state listing.",
    "State the exact expected result and important values.",
    "Include failure clues and the safest next check when practical.",
    "Keep Console verification and CLI verification separately identifiable.",
    "Use at least one verification check per task and as many as the task genuinely needs."
])
h2("Verification record")
code('''
{
  "id": "verify-imported-address",
  "title": "Verify the imported state binding",
  "route": "cli",
  "instruction": "Run terraform state list from the initialized lab folder.",
  "expectedResult": "Exactly aws_ssm_parameter.application_mode is printed."
}
''')

new_page()
h1("11. Cleanup and cost safety")
p("Cleanup is part of the learning outcome, not a short final note.")
numbered([
    "Inventory every resource created by the programme.",
    "Identify dependencies and start with the most dependent workload.",
    "Create and inspect a saved destroy plan where Terraform manages the resource.",
    "Delete cloud resources before deleting credentials, state or local configuration.",
    "Verify cloud absence while the required verification identity still works.",
    "Delete temporary access keys, users, policies and local profiles only after cloud verification.",
    "Delete local state, plan files and the exact lab folder last.",
    "Verify that unrelated resources and profiles remain unchanged.",
    "Finish with one explicit programme-cleanup acknowledgement."
])
h2("Required cleanup properties")
code('''
{
  "manualOnly": true,
  "ordering": "reverse_dependency",
  "completionGate": "acknowledgement"
}
''')
callout("DELETION SAFETY", "Every deletion instruction must name the exact target and include a visible verification. Never use a broad wildcard or unresolved path.", AMBER)

new_page()
h1("12. Official source rules")
bullets([
    "Use primary official documentation only unless the user explicitly approves another source.",
    "For AWS use docs.aws.amazon.com and other official AWS documentation domains.",
    "For Terraform and HCP Terraform use developer.hashicorp.com.",
    "For another vendor use that vendor's official documentation.",
    "Do not rely on search-result snippets. Open and read the supporting page.",
    "Every source record lists the task IDs it supports.",
    "Every task lists the source IDs supporting it.",
    "Do not cite a source for a claim it does not support."
])
h2("Source record")
code('''
{
  "id": "source-terraform-import-block",
  "title": "Import existing resources",
  "url": "https://developer.hashicorp.com/terraform/language/import",
  "publisher": "HashiCorp",
  "purpose": "Supports declarative import-block behaviour.",
  "taskIds": ["task-write-import", "task-apply-import"]
}
''')

new_page()
h1("13. Portable manuscript format")
p("The external model must return one complete JSON manuscript using this top-level structure. This is deliberately app-independent; a local converter will map it to the current Study Tracker schema.")
code('''
{
  "manuscriptVersion": "1.0",
  "programme": {
    "title": "...",
    "suggestedProgrammeId": "...-learning-path",
    "topic": "...",
    "examWorkspace": "...",
    "learnerLevel": "...",
    "outcome": "...",
    "region": "...",
    "resourcePrefix": "...",
    "selfPaced": true
  },
  "sources": [],
  "phases": [],
  "tasks": [],
  "resources": [],
  "programmeCleanup": [],
  "warnings": {
    "cost": "...",
    "safety": "...",
    "credentials": "...",
    "region": "..."
  },
  "qualityReport": {},
  "boundaries": {
    "appReady": false,
    "fingerprinted": false,
    "imported": false,
    "published": false
  }
}
''')

new_page()
h1("14. Required offline deliverables")
h2("Deliverable 1 - complete manuscript")
p("Filename: <b>offline-follow-along-manuscript.json</b>")
bullets([
    "Valid UTF-8 JSON.",
    "Complete programme, phases, tasks, steps, commands, editable blocks, verification, sources, resources, warnings and cleanup.",
    "No comments outside JSON and no truncated sections."
])
h2("Deliverable 2 - readable review")
p("Filename: <b>offline-follow-along-preview.md</b>")
bullets([
    "Programme summary and learner outcome.",
    "Numbered phases and tasks.",
    "All Console instructions, CLI commands and editable blocks.",
    "Expected results, verification and cleanup.",
    "A final quality report listing counts and unresolved issues."
])
callout("STOP BOUNDARY", "After producing these two files, the external model must stop. It must not fabricate a Step 90 package, acceptance audit, fingerprint, Author identity, candidate ID, approval or publication.")

new_page()
h1("15. Self-review before returning files")
numbered([
    "Confirm every task has a unique ID and belongs to exactly one phase.",
    "Confirm prerequisites reference existing earlier tasks and contain no cycle.",
    "Confirm every supported route is complete and independently usable.",
    "Confirm every required file or policy appears in full.",
    "Confirm every command has a purpose and visible expected result.",
    "Confirm every task has verification.",
    "Confirm every source-to-task and task-to-source link is reciprocal.",
    "Confirm cleanup names every created item and follows reverse dependency order.",
    "Confirm cloud cleanup occurs before credential, state and local-file cleanup.",
    "Confirm the output contains no real credential or sensitive saved binding.",
    "Confirm there is no placeholder, deferred or future-content wording.",
    "Confirm the model reports any genuine uncertainty instead of inventing details."
])
h2("Required quality report")
bullets([
    "Phase count, task count and checkbox count.",
    "CLI command count, editable-block count and verification count.",
    "Cleanup-item count and official-source count.",
    "Missing or uncertain items, which must be zero for a complete manuscript."
])

new_page()
h1("16. Local Study Tracker handoff")
p("When the manuscript is approved educationally, give both files to a local Codex task that can access the Study Tracker repository.")
numbered([
    "Read the current verified builder and schema from the local repository.",
    "Convert the portable manuscript without weakening or summarising its content.",
    "Create new stable IDs and a unique programme ID.",
    "Run the current planning, content and review validators.",
    "Calculate the fingerprint using the app's deterministic helper.",
    "Show the exact fingerprint and stop for human acceptance.",
    "Create the acceptance audit only after exact fingerprint approval.",
    "Use the existing controlled Author, Shared Draft, candidate, Approver and publishing workflow."
])
callout("LOCAL AUTHORITY", "Only the app-aware local stage may claim that the package is import-ready. Only the protected database workflow may approve or publish it.", TEAL)

new_page()
h1("17. Short master request")
p("Upload this PDF, then send the following request. Replace the bracketed values only.")
code('''
Read the complete attached Study Tracker Offline Follow Along Authoring Standard and treat it as the governing contract. Create a complete Follow Along manuscript for [TOPIC OR SERVICE], aimed at [LEARNER LEVEL] learners studying [EXAM OR WORKSPACE]. The learner starts with no lab infrastructure. The required outcome is: [OUTCOME]. Use [REGION OR GLOBAL SCOPE] and the fixed training prefix [RESOURCE PREFIX]. Include complete graphical or Console guidance where relevant, complete CLI or Terraform guidance, every required editable file or policy, visible expected results, verification, official primary sources and reverse-dependency cleanup. Return exactly offline-follow-along-manuscript.json and offline-follow-along-preview.md. Do not claim app validation, fingerprinting, import, approval or publication.
''')
h2("Example topic request")
code('''
Topic: HCP Terraform
Learner level: Beginner
Exam workspace: HashiCorp Terraform Associate 004
Outcome: Create an HCP Terraform organisation, project and VCS-backed workspace; configure non-secret and sensitive variables; run, review and apply a remote plan; inspect remote state and locking; diagnose one failed run; then safely destroy the training infrastructure and remove the workspace.
Scope: AWS eu-west-2 plus global HCP Terraform resources
Resource prefix: fa-hcp-terraform
''')

new_page()
h1("18. Final acceptance checklist")
bullets([
    "The manuscript teaches rather than merely instructs.",
    "The learner creates required infrastructure from nothing.",
    "Every click, field, value, file and command is available.",
    "Console and CLI routes are both complete when relevant.",
    "All code blocks preserve readable formatting.",
    "No secrets are requested, displayed or stored.",
    "Only genuinely variable non-secret IDs are eligible for saved capture.",
    "Every action has an expected result or verification path.",
    "Every created item appears in cleanup.",
    "Cleanup order is safe and visibly verified.",
    "Only official documentation supports technical claims.",
    "The external model stops after the two offline files."
])
callout("READY", "If every item above is true, the educational manuscript is ready for local Study Tracker conversion and deterministic validation.", TEAL)
p("End of standard.", "Smallx")


doc.build(story)
print(OUTPUT)
