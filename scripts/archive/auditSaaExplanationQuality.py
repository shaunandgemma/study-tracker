#!/usr/bin/env python3

import json
import re
from collections import Counter
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SOURCE_PATH = PROJECT_ROOT / "data" / "SAA-C03-question-bank-upgraded-250.json"
TXT_REPORT_PATH = PROJECT_ROOT / "data" / "SAA-C03-explanation-quality-audit-2026-07-30.txt"
JSON_REPORT_PATH = PROJECT_ROOT / "data" / "SAA-C03-explanation-quality-audit-2026-07-30.json"

ALREADY_REPAIRED_IDS = {
    "q-saa-37",
    "q-saa-38",
    "q-saa-39",
    "q-saa-127",
    "q-saa-133",
    "q-saa-138",
}

GENERIC_PHRASES = [
    "Fulfills all scenario requirements with optimal AWS architectural alignment.",
    "Fails multi-constraint trade-offs or operational requirements.",
    "Key architectural requirement for topic-",
    "Selecting higher-cost or non-automated options.",
    "Always align AWS service features directly with requirement constraints.",
]

SECTION_PATTERNS = {
    "correct": [
        r"(?im)^\s*correct answer(?:s)?\s*:",
        r"(?im)^\s*why (?:this|these) (?:answer|answers|option|options) (?:is|are) correct\s*:",
        r"(?im)^\s*correct option(?:s)?\s*:",
    ],
    "wrong": [
        r"(?im)^\s*why the other options are wrong\s*:",
        r"(?im)^\s*why the remaining options are wrong\s*:",
        r"(?im)^\s*incorrect options\s*:",
        r"(?im)^\s*why the distractors are wrong\s*:",
    ],
    "trigger": [
        r"(?im)^\s*exam trigger\s*:",
        r"(?im)^\s*key exam trigger\s*:",
    ],
    "trap": [
        r"(?im)^\s*exam trap\s*:",
        r"(?im)^\s*common exam trap\s*:",
    ],
    "memory": [
        r"(?im)^\s*memory hook\s*:",
        r"(?im)^\s*memory rule\s*:",
    ],
}

LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"


def load_questions():
    if not SOURCE_PATH.exists():
        raise SystemExit(f"Source file not found: {SOURCE_PATH}")

    try:
        data = json.loads(SOURCE_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        raise SystemExit(f"Invalid JSON: {error}")

    if not isinstance(data, list):
        raise SystemExit("Expected the source JSON root to be an array.")

    return data


def find_heading(explanation, section_name):
    positions = []

    for pattern in SECTION_PATTERNS[section_name]:
        match = re.search(pattern, explanation)
        if match:
            positions.append((match.start(), match.end()))

    return min(positions) if positions else None


def extract_section(explanation, section_name):
    heading = find_heading(explanation, section_name)

    if not heading:
        return ""

    section_start = heading[1]
    following_positions = []

    for other_name in SECTION_PATTERNS:
        if other_name == section_name:
            continue

        other_heading = find_heading(explanation[section_start:], other_name)

        if other_heading:
            following_positions.append(section_start + other_heading[0])

    section_end = min(following_positions) if following_positions else len(explanation)
    return explanation[section_start:section_end].strip()


def option_letter_mentions(text):
    mentions = set()

    for match in re.finditer(r"(?im)^\s*([A-Z])[\.\)\:\-]\s+", text):
        mentions.add(match.group(1).upper())

    return mentions


def answer_indexes(question):
    qtype = question.get("type")

    if qtype == "single":
        value = question.get("correctAnswer")
        return [value] if isinstance(value, int) else []

    if qtype == "multiple":
        values = question.get("correctAnswers")
        return values if isinstance(values, list) else []

    return []


def answer_letters(question):
    return {
        LETTERS[index]
        for index in answer_indexes(question)
        if isinstance(index, int) and 0 <= index < len(LETTERS)
    }


def all_option_letters(question):
    options = question.get("options", [])

    if not isinstance(options, list):
        return set()

    return {LETTERS[index] for index in range(min(len(options), len(LETTERS)))}


def expected_select_count(question):
    if question.get("type") != "multiple":
        return None

    answers = question.get("correctAnswers")

    if isinstance(answers, list):
        return len(answers)

    return None


def stated_select_count(question_text):
    match = re.search(r"select\s+(two|three)", question_text or "", re.IGNORECASE)

    if not match:
        return None

    return {"two": 2, "three": 3}[match.group(1).lower()]


def has_generic_text(explanation):
    return [phrase for phrase in GENERIC_PHRASES if phrase in explanation]


def analyse_question(question):
    qid = question.get("id", "<missing-id>")
    explanation = question.get("explanation") or ""
    question_text = question.get("question") or ""
    options = question.get("options") or []

    correct_letters = answer_letters(question)
    option_letters = all_option_letters(question)
    incorrect_letters = option_letters - correct_letters

    correct_section = extract_section(explanation, "correct")
    wrong_section = extract_section(explanation, "wrong")
    trigger_section = extract_section(explanation, "trigger")
    trap_section = extract_section(explanation, "trap")
    memory_section = extract_section(explanation, "memory")

    correct_mentions = option_letter_mentions(correct_section)
    wrong_mentions = option_letter_mentions(wrong_section)

    generic_matches = has_generic_text(explanation)

    high_confidence_issues = []
    structural_issues = []
    manual_review_reasons = []

    if not explanation.strip():
        high_confidence_issues.append("Explanation is empty")

    if generic_matches:
        high_confidence_issues.append(
            f"Uses {len(generic_matches)} generic template phrase(s)"
        )

    if question.get("type") == "multiple":
        expected = expected_select_count(question)
        stated = stated_select_count(question_text)

        if expected not in (2, 3):
            high_confidence_issues.append(
                f"Invalid multiple-answer count: {expected}"
            )
        elif stated != expected:
            high_confidence_issues.append(
                f"Question wording states Select {stated}, but answer array contains {expected}"
            )

    if correct_section:
        missing_correct = correct_letters - correct_mentions

        if missing_correct:
            high_confidence_issues.append(
                "Correct option(s) not individually explained: "
                + ", ".join(sorted(missing_correct))
            )
    else:
        structural_issues.append("No recognised correct-answer section heading")

    if wrong_section:
        contradictory = correct_letters & wrong_mentions

        if contradictory:
            high_confidence_issues.append(
                "Correct option(s) listed in wrong-options section: "
                + ", ".join(sorted(contradictory))
            )

        missing_incorrect = incorrect_letters - wrong_mentions

        if missing_incorrect:
            high_confidence_issues.append(
                "Incorrect option(s) not individually explained: "
                + ", ".join(sorted(missing_incorrect))
            )
    else:
        structural_issues.append("No recognised wrong-options section heading")

    if not trigger_section:
        structural_issues.append("No recognised exam-trigger section")
    elif len(trigger_section.split()) < 4:
        high_confidence_issues.append("Exam trigger is too shallow")

    if not trap_section:
        structural_issues.append("No recognised exam-trap section")
    elif len(trap_section.split()) < 5:
        high_confidence_issues.append("Exam trap is too shallow")

    if not memory_section:
        structural_issues.append("No recognised memory-hook section")
    elif len(memory_section.split()) < 3:
        high_confidence_issues.append("Memory hook is too shallow")

    explanation_word_count = len(re.findall(r"\b[\w'-]+\b", explanation))

    if explanation_word_count < 45:
        high_confidence_issues.append(
            f"Explanation is unusually short: {explanation_word_count} words"
        )

    if structural_issues and not high_confidence_issues:
        manual_review_reasons.append(
            "Explanation may use a different format rather than being low quality"
        )

    if not structural_issues and not high_confidence_issues:
        classification = "PASS_AUTOMATED_STRUCTURE"
    elif high_confidence_issues:
        classification = "LIKELY_BELOW_STANDARD"
    else:
        classification = "FORMAT_VARIANT_OR_MANUAL_REVIEW"

    return {
        "id": qid,
        "already_repaired": qid in ALREADY_REPAIRED_IDS,
        "type": question.get("type"),
        "difficulty": question.get("difficulty"),
        "topics": question.get("topics"),
        "question": question_text,
        "option_count": len(options),
        "correct_letters": sorted(correct_letters),
        "incorrect_letters": sorted(incorrect_letters),
        "explanation_word_count": explanation_word_count,
        "classification": classification,
        "high_confidence_issues": high_confidence_issues,
        "structural_issues": structural_issues,
        "manual_review_reasons": manual_review_reasons,
        "generic_phrases_found": generic_matches,
        "sections_found": {
            "correct": bool(correct_section),
            "wrong": bool(wrong_section),
            "trigger": bool(trigger_section),
            "trap": bool(trap_section),
            "memory": bool(memory_section),
        },
    }


def build_text_report(results):
    classification_counts = Counter(
        item["classification"] for item in results
    )

    remaining = [
        item for item in results
        if not item["already_repaired"]
    ]

    remaining_counts = Counter(
        item["classification"] for item in remaining
    )

    likely_below = [
        item for item in remaining
        if item["classification"] == "LIKELY_BELOW_STANDARD"
    ]

    format_variants = [
        item for item in remaining
        if item["classification"] == "FORMAT_VARIANT_OR_MANUAL_REVIEW"
    ]

    passed = [
        item for item in remaining
        if item["classification"] == "PASS_AUTOMATED_STRUCTURE"
    ]

    lines = [
        "AWS SAA-C03 EXPLANATION QUALITY AUDIT",
        "Date: 2026-07-30",
        "",
        f"Source: {SOURCE_PATH.relative_to(PROJECT_ROOT)}",
        f"Questions audited: {len(results)}",
        f"Previously repaired questions excluded from remaining count: {len(ALREADY_REPAIRED_IDS)}",
        "",
        "ALL 250 QUESTIONS",
        f"- Likely below standard: {classification_counts['LIKELY_BELOW_STANDARD']}",
        f"- Format variant or manual review: {classification_counts['FORMAT_VARIANT_OR_MANUAL_REVIEW']}",
        f"- Passed automated structure: {classification_counts['PASS_AUTOMATED_STRUCTURE']}",
        "",
        "REMAINING QUESTIONS ONLY",
        f"- Likely below standard: {remaining_counts['LIKELY_BELOW_STANDARD']}",
        f"- Format variant or manual review: {remaining_counts['FORMAT_VARIANT_OR_MANUAL_REVIEW']}",
        f"- Passed automated structure: {remaining_counts['PASS_AUTOMATED_STRUCTURE']}",
        "",
        "IMPORTANT",
        "This script detects structural and wording problems.",
        "It does not claim to prove AWS technical accuracy.",
        "Technical claims still require manual verification against current official AWS documentation.",
        "",
        "=" * 80,
        "LIKELY BELOW STANDARD",
        "=" * 80,
    ]

    if not likely_below:
        lines.append("None found.")
    else:
        for item in likely_below:
            lines.extend([
                "",
                f"ID: {item['id']}",
                f"Type: {item['type']}",
                f"Difficulty: {item['difficulty']}",
                f"Correct options: {', '.join(item['correct_letters'])}",
                f"Explanation words: {item['explanation_word_count']}",
                "Issues:",
            ])

            for issue in item["high_confidence_issues"]:
                lines.append(f"- {issue}")

            for issue in item["structural_issues"]:
                lines.append(f"- Structural: {issue}")

    lines.extend([
        "",
        "=" * 80,
        "FORMAT VARIANT OR MANUAL REVIEW",
        "=" * 80,
    ])

    if not format_variants:
        lines.append("None found.")
    else:
        for item in format_variants:
            lines.extend([
                "",
                f"ID: {item['id']}",
                f"Type: {item['type']}",
                f"Difficulty: {item['difficulty']}",
                f"Correct options: {', '.join(item['correct_letters'])}",
                f"Explanation words: {item['explanation_word_count']}",
                "Reasons:",
            ])

            for issue in item["structural_issues"]:
                lines.append(f"- {issue}")

            for reason in item["manual_review_reasons"]:
                lines.append(f"- {reason}")

    lines.extend([
        "",
        "=" * 80,
        "PASSED AUTOMATED STRUCTURE",
        "=" * 80,
    ])

    if not passed:
        lines.append("None found.")
    else:
        for item in passed:
            lines.append(f"- {item['id']}")

    return "\n".join(lines) + "\n"


def main():
    questions = load_questions()
    results = [analyse_question(question) for question in questions]

    JSON_REPORT_PATH.write_text(
        json.dumps(results, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    text_report = build_text_report(results)
    TXT_REPORT_PATH.write_text(text_report, encoding="utf-8")

    remaining = [
        item for item in results
        if not item["already_repaired"]
    ]

    counts = Counter(item["classification"] for item in remaining)

    print("Audit complete.")
    print(f"Questions audited: {len(results)}")
    print(f"Previously repaired excluded: {len(ALREADY_REPAIRED_IDS)}")
    print(
        "Remaining likely below standard:",
        counts["LIKELY_BELOW_STANDARD"],
    )
    print(
        "Remaining format variants or manual review:",
        counts["FORMAT_VARIANT_OR_MANUAL_REVIEW"],
    )
    print(
        "Remaining passed automated structure:",
        counts["PASS_AUTOMATED_STRUCTURE"],
    )
    print(f"Text report: {TXT_REPORT_PATH.relative_to(PROJECT_ROOT)}")
    print(f"JSON report: {JSON_REPORT_PATH.relative_to(PROJECT_ROOT)}")
    print("No question-bank files were modified.")


if __name__ == "__main__":
    main()
