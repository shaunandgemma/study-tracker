import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { DEFAULT_EXAMS } from '../src/data/examData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const EXAM_CODE = 'aws-saa-c03';
const EXPECTED_BATCH_SIZE = 10;

const sourcePath = path.join(
    projectRoot,
    'data',
    'question-import.json'
);

const backupDirectory = path.join(
    projectRoot,
    'data',
    'backups'
);

function loadEnvLocal() {
    const envPath = path.join(projectRoot, '.env.local');

    if (!fs.existsSync(envPath)) {
        return;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');

    envContent.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith('#')) {
            return;
        }

        const equalsIndex = trimmed.indexOf('=');

        if (equalsIndex === -1) {
            return;
        }

        const key = trimmed.slice(0, equalsIndex).trim();
        let value = trimmed.slice(equalsIndex + 1).trim();

        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }

        if (key && !process.env[key]) {
            process.env[key] = value;
        }
    });
}

function parseArguments(args) {
    const allowedArguments = new Set(['--dry-run']);
    const unknownArguments = args.filter(
        argument => !allowedArguments.has(argument)
    );

    if (unknownArguments.length > 0) {
        throw new Error(
            `Unknown argument(s): ${unknownArguments.join(', ')}`
        );
    }

    return {
        dryRun: args.includes('--dry-run')
    };
}

function createTimestamp() {
    return new Date()
        .toISOString()
        .replace(/[:.]/g, '-');
}

function loadSourceQuestions() {
    if (!fs.existsSync(sourcePath)) {
        throw new Error(
            `Source file not found: ${sourcePath}`
        );
    }

    let parsed;

    try {
        parsed = JSON.parse(
            fs.readFileSync(sourcePath, 'utf8')
        );
    } catch (error) {
        throw new Error(
            `Invalid JSON in data/question-import.json: ${error.message}`
        );
    }

    return parsed;
}

function getValidTopicIds() {
    const exam = DEFAULT_EXAMS.find(
        item => item.id === EXAM_CODE
    );

    if (!exam) {
        throw new Error(
            `Could not find ${EXAM_CODE} in src/data/examData.js.`
        );
    }

    return new Set(
        (exam.topics || []).map(topic => topic.id)
    );
}

function validateQuestions(questions) {
    if (!Array.isArray(questions)) {
        throw new Error(
            'data/question-import.json must contain a JSON array.'
        );
    }

    if (questions.length !== EXPECTED_BATCH_SIZE) {
        throw new Error(
            `The batch must contain exactly ${EXPECTED_BATCH_SIZE} questions. ` +
            `Found ${questions.length}.`
        );
    }

    const validTopicIds = getValidTopicIds();
    const seenIds = new Set();
    const errors = [];

    questions.forEach((question, index) => {
        const label =
            question?.id || `Question #${index + 1}`;

        if (
            !question ||
            typeof question !== 'object' ||
            Array.isArray(question)
        ) {
            errors.push(`${label}: must be an object.`);
            return;
        }

        if (
            typeof question.id !== 'string' ||
            !question.id.trim()
        ) {
            errors.push(`${label}: missing or invalid id.`);
        } else if (seenIds.has(question.id)) {
            errors.push(`${label}: duplicate question ID.`);
        } else {
            seenIds.add(question.id);
        }

        if (question.exam_code !== EXAM_CODE) {
            errors.push(
                `${label}: exam_code must be "${EXAM_CODE}".`
            );
        }

        if (
            !['Easy', 'Medium', 'Hard'].includes(
                question.difficulty
            )
        ) {
            errors.push(
                `${label}: difficulty must be Easy, Medium, or Hard.`
            );
        }

        if (
            question.type !== 'single' &&
            question.type !== 'multiple'
        ) {
            errors.push(
                `${label}: type must be "single" or "multiple".`
            );
        }

        if (
            typeof question.question !== 'string' ||
            !question.question.trim()
        ) {
            errors.push(
                `${label}: question text must not be empty.`
            );
        }

        if (!Array.isArray(question.options)) {
            errors.push(`${label}: options must be an array.`);
            return;
        }

        if (
            question.type === 'single' &&
            question.options.length !== 4
        ) {
            errors.push(
                `${label}: a single-answer question must have exactly 4 options.`
            );
        }

        if (
            question.type === 'multiple' &&
            ![5, 6].includes(question.options.length)
        ) {
            errors.push(
                `${label}: a multiple-answer question must have 5 or 6 options.`
            );
        }

        if (
            question.options.some(
                option =>
                    typeof option !== 'string' ||
                    !option.trim()
            )
        ) {
            errors.push(
                `${label}: every option must be a non-empty string.`
            );
        }

        if (question.type === 'single') {
            if (
                !Number.isInteger(question.correctAnswer) ||
                question.correctAnswer < 0 ||
                question.correctAnswer >=
                question.options.length
            ) {
                errors.push(
                    `${label}: correctAnswer must be a valid zero-based option index.`
                );
            }

            if (
                Array.isArray(question.correctAnswers) &&
                (
                    question.correctAnswers.length !== 1 ||
                    question.correctAnswers[0] !==
                    question.correctAnswer
                )
            ) {
                errors.push(
                    `${label}: correctAnswers must contain only correctAnswer for a single-answer question.`
                );
            }
        }

        if (question.type === 'multiple') {
            if (
                !Array.isArray(question.correctAnswers) ||
                ![2, 3].includes(
                    question.correctAnswers.length
                )
            ) {
                errors.push(
                    `${label}: multiple-answer questions must have 2 or 3 correctAnswers.`
                );
            } else {
                const uniqueAnswers = new Set(
                    question.correctAnswers
                );

                if (
                    uniqueAnswers.size !==
                    question.correctAnswers.length
                ) {
                    errors.push(
                        `${label}: correctAnswers contains duplicate indexes.`
                    );
                }

                if (
                    question.correctAnswers.some(
                        answer =>
                            !Number.isInteger(answer) ||
                            answer < 0 ||
                            answer >= question.options.length
                    )
                ) {
                    errors.push(
                        `${label}: correctAnswers contains an invalid option index.`
                    );
                }
            }
        }

        if (
            typeof question.explanation !== 'string' ||
            !question.explanation.trim()
        ) {
            errors.push(
                `${label}: explanation must not be empty.`
            );
        }

        if (
            !Array.isArray(question.topics) ||
            question.topics.length === 0
        ) {
            errors.push(
                `${label}: at least one topic is required.`
            );
        } else {
            const uniqueTopics = new Set(question.topics);

            if (
                uniqueTopics.size !== question.topics.length
            ) {
                errors.push(
                    `${label}: duplicate topic mappings found.`
                );
            }

            const invalidTopics = question.topics.filter(
                topicId => !validTopicIds.has(topicId)
            );

            if (invalidTopics.length > 0) {
                errors.push(
                    `${label}: invalid topic IDs: ${invalidTopics.join(', ')}`
                );
            }
        }
    });

    if (errors.length > 0) {
        throw new Error(
            `Validation failed:\n\n${errors
                .map(error => `- ${error}`)
                .join('\n')}`
        );
    }

    return questions;
}

function mapQuestionToDatabaseRow(question) {
    const correctAnswers =
        question.type === 'single'
            ? [question.correctAnswer]
            : question.correctAnswers;

    return {
        id: question.id,
        exam_code: EXAM_CODE,
        difficulty: question.difficulty,
        question_type: question.type,
        question_text: question.question,
        option_a: question.options[0],
        option_b: question.options[1],
        option_c: question.options[2],
        option_d: question.options[3],
        option_e: question.options[4] ?? null,
        option_f: question.options[5] ?? null,
        correct_answer: correctAnswers[0],
        correct_answers: correctAnswers,
        explanation: question.explanation
    };
}

function buildTopicRows(questions) {
    return questions.flatMap(question =>
        question.topics.map(topicId => ({
            question_id: question.id,
            topic_id: topicId
        }))
    );
}

function assertExactIds(actualRows, expectedIds) {
    const actualIds = actualRows.map(row => row.id);
    const actualSet = new Set(actualIds);
    const expectedSet = new Set(expectedIds);

    const missingIds = expectedIds.filter(
        id => !actualSet.has(id)
    );

    const unexpectedIds = actualIds.filter(
        id => !expectedSet.has(id)
    );

    if (
        actualRows.length !== expectedIds.length ||
        missingIds.length > 0 ||
        unexpectedIds.length > 0
    ) {
        throw new Error(
            `All batch IDs must already exist in Supabase. ` +
            `Missing: ${missingIds.join(', ') || 'none'}. ` +
            `Unexpected: ${unexpectedIds.join(', ') || 'none'}.`
        );
    }
}

function normaliseDatabaseRow(row) {
    return {
        id: row.id,
        exam_code: row.exam_code,
        difficulty: row.difficulty,
        question_type: row.question_type,
        question_text: row.question_text,
        option_a: row.option_a,
        option_b: row.option_b,
        option_c: row.option_c,
        option_d: row.option_d,
        option_e: row.option_e ?? null,
        option_f: row.option_f ?? null,
        correct_answer: row.correct_answer,
        correct_answers: row.correct_answers,
        explanation: row.explanation
    };
}

function compareQuestionRows(actualRows, expectedRows) {
    const actualById = new Map(
        actualRows.map(row => [
            row.id,
            normaliseDatabaseRow(row)
        ])
    );

    const differences = [];

    expectedRows.forEach(expectedRow => {
        const actualRow = actualById.get(expectedRow.id);

        if (!actualRow) {
            differences.push(
                `${expectedRow.id}: missing after replacement`
            );
            return;
        }

        const normalisedExpected =
            normaliseDatabaseRow(expectedRow);

        if (
            JSON.stringify(actualRow) !==
            JSON.stringify(normalisedExpected)
        ) {
            differences.push(
                `${expectedRow.id}: database row does not match source`
            );
        }
    });

    if (differences.length > 0) {
        throw new Error(
            `Post-write question verification failed:\n- ` +
            differences.join('\n- ')
        );
    }
}

function compareTopicRows(actualRows, expectedRows) {
    const toKey = row =>
        `${row.question_id}\u0000${row.topic_id}`;

    const actualKeys = actualRows
        .map(toKey)
        .sort();

    const expectedKeys = expectedRows
        .map(toKey)
        .sort();

    if (
        JSON.stringify(actualKeys) !==
        JSON.stringify(expectedKeys)
    ) {
        throw new Error(
            `Post-write topic verification failed. ` +
            `Expected ${expectedRows.length} mappings but found ${actualRows.length}.`
        );
    }
}

async function fetchExistingQuestions(
    supabase,
    questionIds
) {
    const { data, error } = await supabase
        .from('exam_questions')
        .select(
            [
                'id',
                'exam_code',
                'difficulty',
                'question_type',
                'question_text',
                'option_a',
                'option_b',
                'option_c',
                'option_d',
                'option_e',
                'option_f',
                'correct_answer',
                'correct_answers',
                'explanation'
            ].join(',')
        )
        .in('id', questionIds);

    if (error) {
        throw new Error(
            `Failed to read existing questions: ${error.message}`
        );
    }

    return data || [];
}

async function fetchTopicMappings(
    supabase,
    questionIds
) {
    const { data, error } = await supabase
        .from('question_topics')
        .select('question_id, topic_id')
        .in('question_id', questionIds);

    if (error) {
        throw new Error(
            `Failed to read topic mappings: ${error.message}`
        );
    }

    return data || [];
}

async function writeQuestionRows(
    supabase,
    questionRows
) {
    const { data, error } = await supabase
        .from('exam_questions')
        .upsert(questionRows, {
            onConflict: 'id'
        })
        .select('id');

    if (error) {
        throw new Error(
            `Failed to replace exam_questions rows: ${error.message}`
        );
    }

    if (
        !data ||
        data.length !== questionRows.length
    ) {
        throw new Error(
            `Expected ${questionRows.length} updated rows, but Supabase returned ${data?.length || 0}.`
        );
    }
}

async function deleteTopicMappings(
    supabase,
    questionIds
) {
    const { data, error } = await supabase
        .from('question_topics')
        .delete()
        .in('question_id', questionIds)
        .select('question_id, topic_id');

    if (error) {
        throw new Error(
            `Failed to delete old topic mappings: ${error.message}`
        );
    }

    return data || [];
}

async function insertTopicMappings(
    supabase,
    topicRows
) {
    const { data, error } = await supabase
        .from('question_topics')
        .insert(topicRows)
        .select('question_id, topic_id');

    if (error) {
        throw new Error(
            `Failed to insert new topic mappings: ${error.message}`
        );
    }

    if (
        !data ||
        data.length !== topicRows.length
    ) {
        throw new Error(
            `Expected ${topicRows.length} topic mappings, but Supabase returned ${data?.length || 0}.`
        );
    }
}

async function restoreBackup(
    supabase,
    backupQuestions,
    backupTopicRows
) {
    const questionIds = backupQuestions.map(
        question => question.id
    );

    await writeQuestionRows(
        supabase,
        backupQuestions
    );

    await deleteTopicMappings(
        supabase,
        questionIds
    );

    if (backupTopicRows.length > 0) {
        await insertTopicMappings(
            supabase,
            backupTopicRows
        );
    }
}

async function runReplacement({ dryRun }) {
    console.log('\n========================================');
    console.log('   TARGETED QUESTION BATCH REPLACER');
    console.log('========================================\n');

    const sourceQuestions = validateQuestions(
        loadSourceQuestions()
    );

    const questionIds = sourceQuestions.map(
        question => question.id
    );

    const replacementRows = sourceQuestions.map(
        mapQuestionToDatabaseRow
    );

    const replacementTopicRows =
        buildTopicRows(sourceQuestions);

    console.log(
        `Source: ${path.relative(projectRoot, sourcePath)}`
    );
    console.log(
        `Validated questions: ${sourceQuestions.length}`
    );
    console.log(
        `Question IDs: ${questionIds.join(', ')}`
    );
    console.log(
        `New topic mappings: ${replacementTopicRows.length}`
    );

    loadEnvLocal();

    const supabaseUrl =
        process.env.SUPABASE_URL ||
        process.env.VITE_SUPABASE_URL;

    const serviceRoleKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error(
            'SUPABASE_URL or VITE_SUPABASE_URL and ' +
            'SUPABASE_SERVICE_ROLE_KEY are required in .env.local.'
        );
    }

    const supabase = createClient(
        supabaseUrl,
        serviceRoleKey,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false
            }
        }
    );

    const existingQuestions =
        await fetchExistingQuestions(
            supabase,
            questionIds
        );

    assertExactIds(
        existingQuestions,
        questionIds
    );

    const existingTopicRows =
        await fetchTopicMappings(
            supabase,
            questionIds
        );

    console.log(
        `Existing questions found: ${existingQuestions.length}`
    );
    console.log(
        `Existing topic mappings found: ${existingTopicRows.length}`
    );

    if (dryRun) {
        console.log('\nDRY RUN PASSED');
        console.log(
            `Would replace questions: ${replacementRows.length}`
        );
        console.log(
            `Would delete topic mappings: ${existingTopicRows.length}`
        );
        console.log(
            `Would insert topic mappings: ${replacementTopicRows.length}`
        );
        console.log(
            'No database changes were made.\n'
        );
        return;
    }

    fs.mkdirSync(backupDirectory, {
        recursive: true
    });

    const backupPath = path.join(
        backupDirectory,
        `question-batch-backup-${createTimestamp()}.json`
    );

    const backup = {
        createdAt: new Date().toISOString(),
        sourceFile: path.relative(
            projectRoot,
            sourcePath
        ),
        questionIds,
        examQuestions: existingQuestions,
        questionTopics: existingTopicRows
    };

    fs.writeFileSync(
        backupPath,
        JSON.stringify(backup, null, 2),
        'utf8'
    );

    console.log(
        `Backup created: ${path.relative(projectRoot, backupPath)}`
    );

    let writesStarted = false;

    try {
        writesStarted = true;

        await writeQuestionRows(
            supabase,
            replacementRows
        );

        const deletedTopicRows =
            await deleteTopicMappings(
                supabase,
                questionIds
            );

        await insertTopicMappings(
            supabase,
            replacementTopicRows
        );

        const verifiedQuestions =
            await fetchExistingQuestions(
                supabase,
                questionIds
            );

        const verifiedTopicRows =
            await fetchTopicMappings(
                supabase,
                questionIds
            );

        assertExactIds(
            verifiedQuestions,
            questionIds
        );

        compareQuestionRows(
            verifiedQuestions,
            replacementRows
        );

        compareTopicRows(
            verifiedTopicRows,
            replacementTopicRows
        );

        console.log('\n========================================');
        console.log('      BATCH REPLACEMENT COMPLETE');
        console.log('========================================');
        console.log(
            `Questions replaced: ${replacementRows.length}`
        );
        console.log(
            `Old topic mappings deleted: ${deletedTopicRows.length}`
        );
        console.log(
            `New topic mappings inserted: ${replacementTopicRows.length}`
        );
        console.log('Failed: 0\n');
    } catch (error) {
        console.error(
            `\nReplacement failed: ${error.message}`
        );

        if (writesStarted) {
            console.error(
                'Attempting to restore the 10 original questions from the backup...'
            );

            try {
                await restoreBackup(
                    supabase,
                    existingQuestions,
                    existingTopicRows
                );

                console.error(
                    'Rollback completed successfully.'
                );
            } catch (rollbackError) {
                console.error(
                    `CRITICAL: Rollback failed: ${rollbackError.message}`
                );

                console.error(
                    `Manual backup location: ${backupPath}`
                );
            }
        }

        throw error;
    }
}

let options;

try {
    options = parseArguments(
        process.argv.slice(2)
    );
} catch (error) {
    console.error(`\n${error.message}\n`);
    process.exit(1);
}

runReplacement(options).catch(error => {
    console.error(
        `\nQUESTION BATCH REPLACEMENT FAILED: ${error.message}\n`
    );

    process.exit(1);
});