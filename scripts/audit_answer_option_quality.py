#!/usr/bin/env python3
"""
Audit AWS practice-question answer options for patterns that may reveal
the correct answer without requiring AWS knowledge.

This script does NOT modify any questions.

Input:
    data/saa-c03-question-export.json

Outputs:
    data/audits/answer-option-quality-audit.csv
    data/audits/answer-option-quality-audit.json
    data/audits/answer-option-quality-summary.txt

Run from the project root:
    python scripts/audit_answer_option_quality.py
"""

from __future__ import annotations

import csv
import json
import re
import statistics
import sys
from collections import Counter
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parent.parent

DEFAULT_INPUT = PROJECT_ROOT / "data" / "saa-c03-question-export.json"
OUTPUT_DIRECTORY = PROJECT_ROOT / "data" / "audits"

CSV_OUTPUT = OUTPUT_DIRECTORY / "answer-option-quality-audit.csv"
JSON_OUTPUT = OUTPUT_DIRECTORY / "answer-option-quality-audit.json"
SUMMARY_OUTPUT = OUTPUT_DIRECTORY / "answer-option-quality-summary.txt"


OPTION_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

# Common words are ignored when measuring question/answer wording overlap.
STOP_WORDS = {
    "a", "an", "and", "are", "as", "at", "be", "been", "by", "can",
    "company", "configure", "each", "for", "from", "has", "have", "in",
    "into", "is", "it", "its", "most", "must", "of", "on", "or", "that",
    "the", "their", "these", "this", "to", "use", "using", "which", "with",
    "without", "would", "aws", "amazon", "solution", "solutions", "service",
    "services", "application", "applications", "requirement", "requirements",
}


def normalise_text(value: Any) -> str:
    """Return clean single-line text."""
    if value is None:
        return ""

    text = str(value)
    return re.sub(r"\s+", " ", text).strip()


def words(text: str) -> list[str]:
    """Return lowercase words containing letters, digits, hyphens or apostrophes."""
    return re.findall(r"[A-Za-z0-9][A-Za-z0-9'\-]*", text.lower())


def meaningful_words(text: str) -> set[str]:
    """Return meaningful words used for question-option overlap checks."""
    return {
        word
        for word in words(text)
        if len(word) >= 4 and word not in STOP_WORDS
    }


def get_questions(document: Any) -> list[dict[str, Any]]:
    """
    Locate the question list in common export shapes.

    Supported examples:
        {"questions": [...]}
        {"exam_questions": [...]}
        {"data": {"questions": [...]}}
        [...]
    """
    if isinstance(document, list):
        return [item for item in document if isinstance(item, dict)]

    if not isinstance(document, dict):
        raise ValueError("The JSON root is not an object or array.")

    for key in ("questions", "exam_questions", "items"):
        value = document.get(key)
        if isinstance(value, list):
            return [item for item in value if isinstance(item, dict)]

    data_value = document.get("data")
    if isinstance(data_value, dict):
        for key in ("questions", "exam_questions", "items"):
            value = data_value.get(key)
            if isinstance(value, list):
                return [item for item in value if isinstance(item, dict)]

    raise ValueError(
        "Could not locate a question array. Expected a key such as "
        "'questions' or 'exam_questions'."
    )


def get_question_id(question: dict[str, Any], fallback_number: int) -> str:
    """Read the question ID using common field names."""
    return normalise_text(
        question.get("id")
        or question.get("question_id")
        or question.get("questionId")
        or f"question-{fallback_number}"
    )


def get_question_text(question: dict[str, Any]) -> str:
    """Read question text using common field names."""
    return normalise_text(
        question.get("question")
        or question.get("question_text")
        or question.get("questionText")
        or question.get("text")
    )


def get_options(question: dict[str, Any]) -> list[str]:
    """
    Read answer options.

    Supports:
        "options": ["...", "..."]
        "answers": ["...", "..."]
        option_a through option_f
        optionA through optionF
    """
    for key in ("options", "answer_options", "answerOptions", "choices"):
        value = question.get(key)
        if isinstance(value, list):
            return [normalise_text(option) for option in value]

    options: list[str] = []

    for letter in "abcdef":
        value = (
            question.get(f"option_{letter}")
            or question.get(f"option{letter.upper()}")
            or question.get(f"option{letter}")
        )

        if value is not None and normalise_text(value):
            options.append(normalise_text(value))

    return options


def convert_answer_value(value: Any) -> int | None:
    """
    Convert an answer value into a zero-based integer index.

    Supports:
        0
        "0"
        "A"
        "B"
    """
    if isinstance(value, bool):
        return None

    if isinstance(value, int):
        return value

    if isinstance(value, float) and value.is_integer():
        return int(value)

    if isinstance(value, str):
        cleaned = value.strip().upper()

        if cleaned.isdigit():
            return int(cleaned)

        if len(cleaned) == 1 and cleaned in OPTION_LETTERS:
            return OPTION_LETTERS.index(cleaned)

    return None


def get_correct_indexes(question: dict[str, Any]) -> list[int]:
    """Read zero-based correct-answer indexes using common field names."""
    multiple_keys = (
        "correct_answers",
        "correctAnswers",
        "correct_answer_indexes",
        "correctAnswerIndexes",
    )

    single_keys = (
        "correct_answer",
        "correctAnswer",
        "answer",
    )

    for key in multiple_keys:
        value = question.get(key)

        if isinstance(value, list):
            converted = [
                answer_index
                for item in value
                if (answer_index := convert_answer_value(item)) is not None
            ]
            return sorted(set(converted))

    for key in single_keys:
        if key not in question:
            continue

        value = question.get(key)

        if isinstance(value, list):
            converted = [
                answer_index
                for item in value
                if (answer_index := convert_answer_value(item)) is not None
            ]
            return sorted(set(converted))

        converted = convert_answer_value(value)

        if converted is not None:
            return [converted]

    return []


def percentage_difference(value: float, baseline: float) -> float:
    """Calculate how much larger value is than baseline as a percentage."""
    if baseline <= 0:
        return 0.0

    return ((value - baseline) / baseline) * 100.0


def inspect_question(
    question: dict[str, Any],
    question_number: int,
) -> dict[str, Any]:
    """Run heuristic checks on one question."""
    question_id = get_question_id(question, question_number)
    question_text = get_question_text(question)
    options = get_options(question)
    correct_indexes = get_correct_indexes(question)

    option_word_counts = [len(words(option)) for option in options]
    option_character_counts = [len(option) for option in options]

    valid_correct_indexes = [
        index for index in correct_indexes if 0 <= index < len(options)
    ]

    correct_word_counts = [
        option_word_counts[index] for index in valid_correct_indexes
    ]

    distractor_indexes = [
        index for index in range(len(options))
        if index not in valid_correct_indexes
    ]

    distractor_word_counts = [
        option_word_counts[index] for index in distractor_indexes
    ]

    average_correct_words = (
        statistics.mean(correct_word_counts)
        if correct_word_counts
        else 0
    )

    average_distractor_words = (
        statistics.mean(distractor_word_counts)
        if distractor_word_counts
        else 0
    )

    overall_average_words = (
        statistics.mean(option_word_counts)
        if option_word_counts
        else 0
    )

    longest_option_words = max(option_word_counts, default=0)
    shortest_option_words = min(option_word_counts, default=0)

    longest_option_indexes = [
        index
        for index, count in enumerate(option_word_counts)
        if count == longest_option_words
    ]

    correct_is_longest = bool(
        valid_correct_indexes
        and any(index in longest_option_indexes for index in valid_correct_indexes)
    )

    correct_vs_distractor_ratio = (
        average_correct_words / average_distractor_words
        if average_distractor_words > 0
        else 0
    )

    option_length_ratio = (
        longest_option_words / shortest_option_words
        if shortest_option_words > 0
        else 0
    )

    question_terms = meaningful_words(question_text)

    overlap_scores: list[float] = []

    for option in options:
        option_terms = meaningful_words(option)

        if not option_terms:
            overlap_scores.append(0.0)
            continue

        overlap = question_terms.intersection(option_terms)
        overlap_scores.append(len(overlap) / len(option_terms))

    correct_overlap_scores = [
        overlap_scores[index] for index in valid_correct_indexes
    ]

    distractor_overlap_scores = [
        overlap_scores[index] for index in distractor_indexes
    ]

    average_correct_overlap = (
        statistics.mean(correct_overlap_scores)
        if correct_overlap_scores
        else 0
    )

    average_distractor_overlap = (
        statistics.mean(distractor_overlap_scores)
        if distractor_overlap_scores
        else 0
    )

    overlap_advantage = average_correct_overlap - average_distractor_overlap

    reasons: list[str] = []
    risk_points = 0

    # Structural validation
    if not question_text:
        reasons.append("Question text is missing")
        risk_points += 10

    if len(options) < 4:
        reasons.append(f"Only {len(options)} answer options were found")
        risk_points += 10

    if not valid_correct_indexes:
        reasons.append("No valid correct-answer index was found")
        risk_points += 10

    if len(valid_correct_indexes) != len(correct_indexes):
        reasons.append("One or more correct-answer indexes are out of range")
        risk_points += 10

    # Correct answer is visibly longer
    if correct_vs_distractor_ratio >= 2.0:
        reasons.append(
            "Correct answer is at least twice the average distractor length"
        )
        risk_points += 6
    elif correct_vs_distractor_ratio >= 1.6:
        reasons.append(
            "Correct answer is at least 60% longer than the average distractor"
        )
        risk_points += 4
    elif correct_vs_distractor_ratio >= 1.35:
        reasons.append(
            "Correct answer is at least 35% longer than the average distractor"
        )
        risk_points += 2

    # One answer is much longer than another
    if option_length_ratio >= 4.0:
        reasons.append(
            "Longest option is at least four times the shortest option"
        )
        risk_points += 5
    elif option_length_ratio >= 2.5:
        reasons.append(
            "Longest option is at least 2.5 times the shortest option"
        )
        risk_points += 3
    elif option_length_ratio >= 2.0:
        reasons.append(
            "Longest option is at least twice the shortest option"
        )
        risk_points += 1

    # Correct answer is the longest
    if correct_is_longest and correct_vs_distractor_ratio >= 1.35:
        reasons.append(
            "A correct answer is also the longest answer option"
        )
        risk_points += 3

    # Very short distractors
    very_short_distractors = [
        index
        for index in distractor_indexes
        if option_word_counts[index] <= 5
        and overall_average_words >= 10
    ]

    if len(very_short_distractors) >= 2:
        letters = ", ".join(
            OPTION_LETTERS[index] for index in very_short_distractors
        )
        reasons.append(
            f"Multiple distractors are unusually short: {letters}"
        )
        risk_points += 4
    elif len(very_short_distractors) == 1:
        letter = OPTION_LETTERS[very_short_distractors[0]]
        reasons.append(
            f"Distractor {letter} is unusually short"
        )
        risk_points += 1

    # Wording copied from the question
    if overlap_advantage >= 0.30:
        reasons.append(
            "Correct answer repeats substantially more question wording "
            "than the distractors"
        )
        risk_points += 4
    elif overlap_advantage >= 0.18:
        reasons.append(
            "Correct answer repeats more question wording than distractors"
        )
        risk_points += 2

    # Empty or duplicate options
    empty_options = [
        index for index, option in enumerate(options) if not option
    ]

    if empty_options:
        letters = ", ".join(OPTION_LETTERS[index] for index in empty_options)
        reasons.append(f"Empty answer options found: {letters}")
        risk_points += 10

    normalised_options = [
        re.sub(r"[^a-z0-9]+", " ", option.lower()).strip()
        for option in options
    ]

    duplicates = [
        option
        for option, count in Counter(normalised_options).items()
        if option and count > 1
    ]

    if duplicates:
        reasons.append("Duplicate or near-identical answer options found")
        risk_points += 10

    # Classify risk
    if risk_points >= 10:
        risk_level = "CRITICAL"
    elif risk_points >= 7:
        risk_level = "HIGH"
    elif risk_points >= 4:
        risk_level = "MEDIUM"
    elif risk_points >= 1:
        risk_level = "LOW"
    else:
        risk_level = "PASS"

    correct_letters = [
        OPTION_LETTERS[index]
        for index in valid_correct_indexes
        if index < len(OPTION_LETTERS)
    ]

    return {
        "question_id": question_id,
        "question_number": question_number,
        "risk_level": risk_level,
        "risk_points": risk_points,
        "correct_options": ", ".join(correct_letters),
        "option_count": len(options),
        "correct_answer_count": len(valid_correct_indexes),
        "average_correct_words": round(average_correct_words, 2),
        "average_distractor_words": round(average_distractor_words, 2),
        "correct_vs_distractor_ratio": round(correct_vs_distractor_ratio, 2),
        "correct_vs_distractor_percent_longer": round(
            percentage_difference(
                average_correct_words,
                average_distractor_words,
            ),
            2,
        ),
        "shortest_option_words": shortest_option_words,
        "longest_option_words": longest_option_words,
        "option_length_ratio": round(option_length_ratio, 2),
        "correct_is_longest": correct_is_longest,
        "correct_question_overlap": round(average_correct_overlap, 3),
        "distractor_question_overlap": round(average_distractor_overlap, 3),
        "overlap_advantage": round(overlap_advantage, 3),
        "reasons": reasons,
        "reasons_text": " | ".join(reasons),
        "question_text": question_text,
        "options": options,
    }


def write_csv(results: list[dict[str, Any]]) -> None:
    """Write the human-friendly CSV audit."""
    fieldnames = [
        "question_id",
        "question_number",
        "risk_level",
        "risk_points",
        "correct_options",
        "option_count",
        "correct_answer_count",
        "average_correct_words",
        "average_distractor_words",
        "correct_vs_distractor_ratio",
        "correct_vs_distractor_percent_longer",
        "shortest_option_words",
        "longest_option_words",
        "option_length_ratio",
        "correct_is_longest",
        "correct_question_overlap",
        "distractor_question_overlap",
        "overlap_advantage",
        "reasons_text",
        "question_text",
    ]

    with CSV_OUTPUT.open("w", encoding="utf-8-sig", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()

        for result in results:
            writer.writerow({
                field: result.get(field, "")
                for field in fieldnames
            })


def write_json(results: list[dict[str, Any]]) -> None:
    """Write the complete machine-readable audit."""
    payload = {
        "source_file": str(DEFAULT_INPUT.relative_to(PROJECT_ROOT)),
        "question_count": len(results),
        "results": results,
    }

    with JSON_OUTPUT.open("w", encoding="utf-8") as file:
        json.dump(payload, file, indent=2, ensure_ascii=False)


def write_summary(results: list[dict[str, Any]]) -> None:
    """Write a concise text summary."""
    risk_counts = Counter(result["risk_level"] for result in results)

    correct_longest_count = sum(
        1 for result in results if result["correct_is_longest"]
    )

    high_length_difference_count = sum(
        1
        for result in results
        if result["correct_vs_distractor_ratio"] >= 1.6
    )

    ranked = [
        result
        for result in results
        if result["risk_level"] != "PASS"
    ][:30]

    lines = [
        "AWS SAA-C03 Answer Option Quality Audit",
        "=" * 43,
        "",
        f"Questions scanned: {len(results)}",
        f"Critical risk: {risk_counts.get('CRITICAL', 0)}",
        f"High risk: {risk_counts.get('HIGH', 0)}",
        f"Medium risk: {risk_counts.get('MEDIUM', 0)}",
        f"Low risk: {risk_counts.get('LOW', 0)}",
        f"Passed automatic checks: {risk_counts.get('PASS', 0)}",
        "",
        f"Questions where a correct answer is longest: "
        f"{correct_longest_count}",
        f"Questions where correct answer is at least 60% longer: "
        f"{high_length_difference_count}",
        "",
        "Top flagged questions",
        "-" * 21,
    ]

    if not ranked:
        lines.append("No questions were flagged.")
    else:
        for result in ranked:
            lines.extend([
                "",
                (
                    f"{result['question_id']} "
                    f"[{result['risk_level']} - {result['risk_points']} points]"
                ),
                (
                    f"Correct/distractor length ratio: "
                    f"{result['correct_vs_distractor_ratio']}"
                ),
                f"Reasons: {result['reasons_text']}",
            ])

    lines.extend([
        "",
        "",
        "Important:",
        "This is a statistical and structural audit only.",
        "A flagged question is not automatically technically incorrect.",
        "Use an AWS technical review before rewriting or approving questions.",
    ])

    SUMMARY_OUTPUT.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    """Load the question export, audit it, and create reports."""
    input_path = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else DEFAULT_INPUT

    if not input_path.exists():
        print(f"ERROR: Input file was not found:\n{input_path}")
        return 1

    try:
        with input_path.open("r", encoding="utf-8-sig") as file:
            document = json.load(file)

        questions = get_questions(document)

        if not questions:
            print("ERROR: No questions were found in the input file.")
            return 1

        results = [
            inspect_question(question, number)
            for number, question in enumerate(questions, start=1)
        ]

        risk_order = {
            "CRITICAL": 0,
            "HIGH": 1,
            "MEDIUM": 2,
            "LOW": 3,
            "PASS": 4,
        }

        results.sort(
            key=lambda result: (
                risk_order[result["risk_level"]],
                -result["risk_points"],
                result["question_number"],
            )
        )

        OUTPUT_DIRECTORY.mkdir(parents=True, exist_ok=True)

        write_csv(results)
        write_json(results)
        write_summary(results)

        risk_counts = Counter(result["risk_level"] for result in results)

        print()
        print("Answer option quality audit complete")
        print("------------------------------------")
        print(f"Questions scanned: {len(results)}")
        print(f"Critical: {risk_counts.get('CRITICAL', 0)}")
        print(f"High:     {risk_counts.get('HIGH', 0)}")
        print(f"Medium:   {risk_counts.get('MEDIUM', 0)}")
        print(f"Low:      {risk_counts.get('LOW', 0)}")
        print(f"Pass:     {risk_counts.get('PASS', 0)}")
        print()
        print(f"CSV:     {CSV_OUTPUT}")
        print(f"JSON:    {JSON_OUTPUT}")
        print(f"Summary: {SUMMARY_OUTPUT}")
        print()
        print(
            "This script only flags statistical risks. "
            "It does not modify the question bank."
        )

        return 0

    except json.JSONDecodeError as error:
        print(f"ERROR: Invalid JSON: {error}")
        return 1
    except Exception as error:
        print(f"ERROR: Audit failed: {error}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())