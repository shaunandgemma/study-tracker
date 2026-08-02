import json

def validate():
    file_path = 'data/SAA-C03-question-bank-upgraded-250.json'
    with open(file_path, 'r', encoding='utf-8') as f:
        questions = json.load(f)

    print(f"Validating {file_path}...")
    
    # Rule 1: Exactly 250 questions
    assert len(questions) == 250, f"Expected 250 questions, got {len(questions)}"
    
    # Rule 2: Unique IDs q-saa-1 to q-saa-250
    expected_ids = set(f"q-saa-{i}" for i in range(1, 251))
    actual_ids = set(q['id'] for q in questions)
    assert actual_ids == expected_ids, f"ID mismatch! Missing: {expected_ids - actual_ids}, Extra: {actual_ids - expected_ids}"
    
    valid_difficulties = {'Easy', 'Medium', 'Hard'}
    
    named_6 = {'q-saa-41', 'q-saa-58', 'q-saa-70', 'q-saa-172', 'q-saa-174', 'q-saa-199'}

    for q in questions:
        qid = q['id']
        qtype = q.get('type')
        qdiff = q.get('difficulty')
        opts = q.get('options', [])
        exp = q.get('explanation', '')
        
        # Rule 3: Valid difficulty
        assert qdiff in valid_difficulties, f"Question {qid} has invalid difficulty: {qdiff}"
        
        # Rule 4: Non-empty options
        assert isinstance(opts, list) and len(opts) >= 4, f"Question {qid} has fewer than 4 options"
        for opt in opts:
            assert isinstance(opt, str) and len(opt.strip()) > 0, f"Question {qid} has empty option"
            
        # Rule 5: Non-empty explanation
        assert isinstance(exp, str) and len(exp.strip()) > 0, f"Question {qid} has empty explanation"
        
        # Rule 6 & 7: Schema compliance
        if qtype == 'single':
            assert q.get('correctAnswers') is None, f"Single question {qid} must have correctAnswers = null"
            ca = q.get('correctAnswer')
            assert isinstance(ca, int) and 0 <= ca < len(opts), f"Single question {qid} has invalid correctAnswer index: {ca}"
        elif qtype == 'multiple':
            assert q.get('correctAnswer') is None, f"Multiple question {qid} must have correctAnswer = null"
            cas = q.get('correctAnswers')
            assert isinstance(cas, list) and len(cas) in [2, 3], f"Multiple question {qid} correctAnswers length must be 2 or 3"
            for ca in cas:
                assert isinstance(ca, int) and 0 <= ca < len(opts), f"Multiple question {qid} out of bounds index {ca}"
            assert len(cas) == len(set(cas)), f"Multiple question {qid} has duplicate correct answer indexes"
            
            # Check prompt text instruction
            qtext = q.get('question', '')
            if len(cas) == 2:
                assert 'Select TWO' in qtext or 'select two' in qtext.lower(), f"Multiple question {qid} with 2 answers should state Select TWO"
            elif len(cas) == 3:
                assert 'Select THREE' in qtext or 'select three' in qtext.lower(), f"Multiple question {qid} with 3 answers should state Select THREE"
        else:
            raise AssertionError(f"Question {qid} has invalid type: {qtype}")

        # Check named 6 questions have required sections
        if qid in named_6:
            for req_sec in ['Exam trigger:', 'Exam trap:', 'Memory hook:']:
                assert req_sec in exp, f"Named question {qid} explanation missing section '{req_sec}'"

    print("ALL VALIDATION CHECKS PASSED SUCCESSFULLY!")

if __name__ == '__main__':
    validate()
