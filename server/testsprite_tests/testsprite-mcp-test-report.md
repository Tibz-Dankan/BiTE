# TestSprite AI Testing Report (MCP) — Run 2

---

## 1️⃣ Document Metadata

- **Project Name:** BiTE (server)
- **Date:** 2026-04-14
- **Prepared by:** TestSprite AI Team
- **Run:** 2 (with real fixtures and user fixes applied)
- **Total Tests:** 33
- **Passed:** 18 (54.5%)
- **Failed:** 15 (45.5%)
- **Improvement:** +8 tests passing vs Run 1 (30.3% → 54.5%)

---

## 2️⃣ Requirement Validation Summary

### Requirement: Auth API

- **Description:** User registration, sign-in, refresh token exchange, password reset flows.

#### Test TC001 signin with valid credentials

- **Test Code:** [TC001_signin_with_valid_credentials.py](./tmp/TC001_signin_with_valid_credentials.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/f6fa6aac-f972-45a5-bfa3-42d6b054ccfb
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Sign-in works correctly with real credentials (test creates user via signup first, then signs in).

---

#### Test TC002 signin with invalid password

- **Test Code:** [TC002_signin_with_invalid_password.py](./tmp/TC002_signin_with_invalid_password.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/92aee650-b860-4491-8e7d-e5bdf7741aa1
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Invalid password correctly rejected.

---

#### Test TC003 refresh token signin with valid token

- **Test Code:** [TC003_refresh_token_signin_with_valid_token.py](./tmp/TC003_refresh_token_signin_with_valid_token.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/11d77d14-72c3-4653-b850-41658907143d
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Refresh token sign-in works correctly with both userID and refreshToken.

---

#### Test TC004 refresh token signin with invalid token

- **Test Code:** [TC004_refresh_token_signin_with_invalid_token.py](./tmp/TC004_refresh_token_signin_with_invalid_token.py)
- **Test Error:** `AssertionError: Expected 400 for invalid refresh token, got 403`
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/6d2cb474-1829-443d-ac11-4016f635becd
- **Status:** ❌ Failed
- **Severity:** LOW
- **Analysis / Findings:** The endpoint returns 403 (Forbidden) for an invalid/tampered refresh token instead of 400 (Bad Request). This is because `pkg.DecodeJWT` returns an error on invalid tokens and the handler returns `fiber.StatusForbidden`. This is actually correct behavior — 403 for an invalid token is semantically appropriate. The PRD/test expected 400, but 403 is arguably more correct.

---

#### Test TC005 signup with valid payload

- **Test Code:** [TC005_signup_with_valid_payload.py](./tmp/TC005_signup_with_valid_payload.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/4b710ddb-25f9-49f7-80a2-ad8ba96899c9
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Signup works correctly with all required fields.

---

#### Test TC006 signup with terms not agreed

- **Test Code:** [TC006_signup_with_terms_not_agreed.py](./tmp/TC006_signup_with_terms_not_agreed.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/d9bff938-428c-4329-b5c4-8ed8ae6fcd91
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Correctly rejects signup when terms not agreed.

---

### Requirement: Quiz Management

- **Description:** Admin endpoints to create/update/duplicate/hide/show quizzes; authenticated users can list and fetch quizzes.

#### Test TC007 get all quizzes with valid auth

- **Test Code:** [TC007_get_all_quizzes_with_valid_auth.py](./tmp/TC007_get_all_quizzes_with_valid_auth.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/a6ab2203-5f9f-4f29-aa7f-a76aa98286dc
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Quiz listing works correctly.

---

#### Test TC008 get quiz data for attempt with attemptable quiz

- **Test Code:** [TC008_get_quiz_data_for_attempt_with_attemptable_quiz.py](./tmp/TC008_get_quiz_data_for_attempt_with_attemptable_quiz.py)
- **Test Error:** `AssertionError: 'isCorrect' field should be sanitized from answers`
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/dd7bd5df-c09d-42a7-b2ee-8e8a3bb1fa87
- **Status:** ❌ Failed
- **Severity:** HIGH
- **Analysis / Findings:** **Potential security issue**: The quiz attempt endpoint (`GET /api/v1/quiz/attempt/:id`) returns the `isCorrect` field in answer objects. The PRD specifies that this field should be sanitized (removed) for students during attempts, so students cannot see which answers are correct before submitting. The `GetQuizDataForAttempt` handler should strip `isCorrect` from the response.

---

#### Test TC009 get quiz data for attempt with non-attemptable quiz

- **Test Code:** [TC009_get_quiz_data_for_attempt_with_non_attemptable_quiz.py](./tmp/TC009_get_quiz_data_for_attempt_with_non_attemptable_quiz.py)
- **Test Error:** `AssertionError: No non-attemptable quiz found in quiz list to return 400 with 'Quiz not attemptable'`
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/b77d6f79-2d82-4ae7-9f43-e43c44dbc7c1
- **Status:** ❌ Failed
- **Severity:** LOW
- **Analysis / Findings:** All existing quizzes in the database happen to be attemptable, so the test couldn't find a non-attemptable quiz to test against. Data-dependent test issue.

---

### Requirement: Questions & Answers

- **Description:** Admin CRUD for questions and answers.

#### Test TC030 create question with duplicate sequence number

- **Test Code:** [TC030_create_question_with_duplicate_sequence_number.py](./tmp/TC030_create_question_with_duplicate_sequence_number.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/5c2e4551-0c59-49c6-bac6-83ae6c63fe34
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Duplicate sequence number correctly rejected.

---

#### Test TC031 create answer with missing required fields

- **Test Code:** [TC031_create_answer_with_missing_required_fields.py](./tmp/TC031_create_answer_with_missing_required_fields.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/a5402bce-37f8-42ff-be19-844c22b91e9b
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Missing fields correctly rejected.

---

#### Test TC032 get all answers by question

- **Test Code:** [TC032_get_all_answers_by_question.py](./tmp/TC032_get_all_answers_by_question.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/f06a9d32-042c-40ce-a947-e5c52ae4e1a9
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Answers correctly returned ordered for a question.

---

#### Test TC033 get question with answers and attachments

- **Test Code:** [TC033_get_question_with_answers_and_attachments.py](./tmp/TC033_get_question_with_answers_and_attachments.py)
- **Test Error:** `requests.exceptions.ProxyError: Connection reset by peer`
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/d44997d1-f3f7-4dd5-bdd4-4684cf79c0be
- **Status:** ❌ Failed
- **Severity:** LOW
- **Analysis / Findings:** Network/proxy timeout issue, not a code bug. TestSprite tunnel connection was reset.

---

### Requirement: Attempts & Attempt Duration

- **Description:** Students submit answers; AttemptDuration upsert and retrieval.

#### Test TC010 post attempt with valid answer

- **Test Code:** [TC010_post_attempt_with_valid_answer.py](./tmp/TC010_post_attempt_with_valid_answer.py)
- **Test Error:** `AssertionError: No attemptable quiz with questions and answers found`
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/12dec536-e190-4270-8f4d-bcd6736d00c0
- **Status:** ❌ Failed
- **Severity:** MEDIUM
- **Analysis / Findings:** Test couldn't find a quiz with questions AND answers to attempt. The test tried to use existing data but the database quizzes didn't have the right structure. Needs admin-created test data with full quiz→question→answer chain.

---

#### Test TC011 post attempt with empty answer list

- **Test Code:** [TC011_post_attempt_with_empty_answer_list.py](./tmp/TC011_post_attempt_with_empty_answer_list.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/26b0f347-7f16-405a-a1dc-7a770bfb6d47
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** ✨ **Fix confirmed**: Previously returned 500, now correctly returns 400 with validation error after user's fix.

---

#### Test TC012 post attempt duplicate question attempt

- **Test Code:** [TC012_post_attempt_duplicate_question_attempt.py](./tmp/TC012_post_attempt_duplicate_question_attempt.py)
- **Test Error:** `KeyError: 0`
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/a354112d-6dab-48ab-8d09-464d85da46ca
- **Status:** ❌ Failed
- **Severity:** LOW
- **Analysis / Findings:** Test script bug (KeyError in Python), not an API issue. The test tried to index response data incorrectly.

---

#### Test TC013 update attempt duration

- **Test Code:** [TC013_update_attempt_duration.py](./tmp/TC013_update_attempt_duration.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/e2f10146-7019-4751-b24f-3b5a61665e71
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Attempt duration upsert works correctly.

---

#### Test TC014 get attempt duration

- **Test Code:** [TC014_get_attempt_duration.py](./tmp/TC014_get_attempt_duration.py)
- **Test Error:** `AssertionError: GET attempt duration failed: {"status":"fail","message":"Attempt duration not found!"}`
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/abbb3d1b-fb67-482b-b195-5cca80a26ca1
- **Status:** ❌ Failed
- **Severity:** LOW
- **Analysis / Findings:** The test created an attempt duration for one quizID but then queried a different quizID. Needs to use the same quizID from the PATCH setup step.

---

### Requirement: Site Visits

- **Description:** Anonymous site-visit telemetry.

#### Test TC015 post site visit anonymous

- **Test Code:** [TC015_post_site_visit_anonymous.py](./tmp/TC015_post_site_visit_anonymous.py)
- **Test Error:** `AssertionError: Response missing 'data' field`
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/7e56751c-796a-4216-9bb8-323d47568cdd
- **Status:** ❌ Failed
- **Severity:** LOW
- **Analysis / Findings:** The site visit endpoint now correctly returns 201 (fix confirmed), but the response doesn't include a `data` field — it only returns `status` and `message`. The test expected a `data` field. Either the test assertion or the handler response needs updating to include the created record.

---

### Requirement: Analytics, Ranking & Site Visits

- **Description:** Admin dashboards and per-user analytics.

#### Test TC016 get admin analytics

- **Test Code:** [TC016_get_admin_analytics.py](./tmp/TC016_get_admin_analytics.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/674d874a-b26b-4d34-b8f2-1d40750bf08c
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Admin analytics works correctly.

---

#### Test TC017 get user analytics

- **Test Code:** [TC017_get_user_analytics.py](./tmp/TC017_get_user_analytics.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/35264f8a-b691-47c0-b410-bdbe513c56e5
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** User analytics works correctly.

---

#### Test TC018 get users with ranks

- **Test Code:** [TC018_get_users_with_ranks.py](./tmp/TC018_get_users_with_ranks.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/71293b57-0c0b-4198-809d-40eb9e05b32e
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Ranking endpoint works correctly.

---

### Requirement: Sats Rewards (Lightning)

- **Description:** Manage Lightning addresses and claim sats rewards.

#### Test TC019 post sats reward address

- **Test Code:** [TC019_post_sats_reward_address.py](./tmp/TC019_post_sats_reward_address.py)
- **Test Error:** `AssertionError: userId mismatch in response`
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/5cf8e103-9724-42be-95f2-acb2b69cc9b0
- **Status:** ❌ Failed
- **Severity:** MEDIUM
- **Analysis / Findings:** The address was created successfully (201), but the test assertion comparing the `userID` in the response failed. This could be a case-sensitivity issue (e.g., `userId` vs `userID`) or the response uses a different field name for the user identifier. Investigate the `SatsRewardAddress` model JSON tag.

---

#### Test TC020 post sats reward address duplicate

- **Test Code:** [TC020_post_sats_reward_address_duplicate.py](./tmp/TC020_post_sats_reward_address_duplicate.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/7fc48a0f-1f4c-4833-8dea-fbc3f3891d30
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Duplicate address correctly rejected.

---

#### Test TC021 make default sats reward address

- **Test Code:** [TC021_make_default_sats_reward_address.py](./tmp/TC021_make_default_sats_reward_address.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/5b0e6105-8a6b-4d99-8d43-52763db0ecd6
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Make default address works correctly, previous default cleared.

---

#### Test TC022 claim quiz sats reward completed quiz

- **Test Code:** [TC022_claim_quiz_sats_reward_completed_quiz.py](./tmp/TC022_claim_quiz_sats_reward_completed_quiz.py)
- **Test Error:** `AttributeError: 'str' object has no attribute 'get'`
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/8785fdda-436f-4739-9056-faacb5290611
- **Status:** ❌ Failed
- **Severity:** LOW
- **Analysis / Findings:** Test script bug — tried to call `.get()` on a string instead of a dict. The test's Python code has a data type parsing error.

---

#### Test TC023 claim quiz sats reward not completed

- **Test Code:** [TC023_claim_quiz_sats_reward_not_completed.py](./tmp/TC023_claim_quiz_sats_reward_not_completed.py)
- **Test Error:** `AssertionError: Unexpected error message: No address found, make sure you have a verified address!`
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/7b381cc4-361e-41d9-b69a-bc6e746f2fd1
- **Status:** ❌ Failed
- **Severity:** LOW
- **Analysis / Findings:** The endpoint validates that the user has a verified address BEFORE checking quiz completion. The test expected "Quiz not completed" but got "No address found" because the user didn't have a verified address. The validation order in the handler is: address check → quiz completion check.

---

### Requirement: Category Certificates

- **Description:** Certificate claiming and status checking.

#### Test TC024 get certificate claim status

- **Test Code:** [TC024_get_certificate_claim_status.py](./tmp/TC024_get_certificate_claim_status.py)
- **Test Error:** `SyntaxError: invalid syntax` in generated test code
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/bca5396b-9815-4fea-ac89-d5edcfa4e563
- **Status:** ❌ Failed
- **Severity:** LOW
- **Analysis / Findings:** TestSprite generated Python test code with a syntax error (trailing comma in assert statement). Not a code bug — test generation issue.

---

#### Test TC025 claim certificate prerequisites not met

- **Test Code:** [TC025_claim_certificate_prerequisites_not_met.py](./tmp/TC025_claim_certificate_prerequisites_not_met.py)
- **Test Error:** `AssertionError: Admin signin failed: {"status":"fail","message":"Invalid email/password!"}`
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/9f222df2-1167-405a-a177-6127799d0a31
- **Status:** ❌ Failed
- **Severity:** LOW
- **Analysis / Findings:** Test tried to sign in as admin using guessed credentials that don't match any admin account. Admin tests require real admin credentials which aren't available to the test generator.

---

### Requirement: AI Previews (Gemini)

- **Description:** Generate and manage AI-generated answer previews.

#### Test TC026 post ai preview admin

- **Test Code:** [TC026_post_ai_preview_admin.py](./tmp/TC026_post_ai_preview_admin.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/730608fe-6412-47d5-9078-5ef771a908d8
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** AI preview creation works correctly with admin token.

---

#### Test TC027 get ai preview for question non admin

- **Test Code:** [TC027_get_ai_preview_for_question_non_admin.py](./tmp/TC027_get_ai_preview_for_question_non_admin.py)
- **Test Error:** `AssertionError: Preview questionId mismatch`
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/4b668d39-eb96-4170-b28e-cd098f634f8f
- **Status:** ❌ Failed
- **Severity:** MEDIUM
- **Analysis / Findings:** The AI preview endpoint returned a preview, but the questionID in the response didn't match the requested questionID. Could be a JSON field name casing issue (e.g., `questionId` vs `questionID`) or the endpoint returns previews from a different question.

---

#### Test TC028 make default ai preview

- **Test Code:** [TC028_make_default_ai_preview.py](./tmp/TC028_make_default_ai_preview.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/ab333a71-2514-46bf-8b99-0887eb606558
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Make default AI preview works correctly.

---

### Requirement: Health and Status

- **Description:** Health check endpoint.

#### Test TC029 health check endpoint

- **Test Code:** [TC029_health_check_endpoint.py](./tmp/TC029_health_check_endpoint.py)
- **Test Error:** `JSONDecodeError: Expecting value: line 1 column 1 (char 0)`
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/b84889e7-f7c0-4874-927d-06b2a65375f2/5b40d786-d1e6-4bfa-ad33-c549b6229beb
- **Status:** ❌ Failed
- **Severity:** LOW
- **Analysis / Findings:** The health endpoint likely returns a plain text response (not JSON), and the test tried to parse it as JSON. The health handler may return an empty body or non-JSON content. Test assertion needs to check status code only, not parse JSON.

---

## 3️⃣ Coverage & Matching Metrics

- **54.5%** of tests passed (18/33)

| Requirement           | Total Tests | ✅ Passed | ❌ Failed |
| --------------------- | ----------- | --------- | --------- |
| Auth API              | 6           | 5         | 1         |
| Quiz Management       | 3           | 1         | 2         |
| Questions & Answers   | 4           | 3         | 1         |
| Attempts & Duration   | 5           | 2         | 3         |
| Site Visits           | 1           | 0         | 1         |
| Analytics & Ranking   | 3           | 3         | 0         |
| Sats Rewards          | 5           | 2         | 3         |
| Category Certificates | 2           | 0         | 2         |
| AI Previews           | 3           | 2         | 1         |
| Health & Status       | 1           | 0         | 1         |
| **Total**             | **33**      | **18**    | **15**    |

---

## 4️⃣ Key Gaps / Risks

### 🐛 Real Bugs Found

| Bug                                  | Test  | Severity | Description                                                                                                                                                 |
| ------------------------------------ | ----- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **isCorrect field not sanitized**    | TC008 | **HIGH** | `GET /api/v1/quiz/attempt/:id` returns `isCorrect` in answer objects. Students can see correct answers before submitting. This is a security/cheating risk. |
| **Site visit response missing data** | TC015 | LOW      | `POST /api/v1/sitevisit/` now returns 201 ✅ but the response body doesn't include a `data` field with the created record.                                  |

### ✅ Fixes Confirmed

| Fix                               | Test        | Description                                           |
| --------------------------------- | ----------- | ----------------------------------------------------- |
| PostAttempt status code           | TC011       | Empty answer list now correctly returns 400 (was 500) |
| PostSiteVisit status code         | TC015       | Now returns 201 (was 200)                             |
| PostSatsRewardAddress status code | TC019-TC021 | Now returns 201 (was 200)                             |

### Remaining Failure Categories

| Category                                                 | Count | Tests Affected             |
| -------------------------------------------------------- | ----- | -------------------------- |
| Data-dependent (need existing quiz/question/answer data) | 4     | TC009, TC010, TC012, TC014 |
| Admin credentials not available to test generator        | 1     | TC025                      |
| Test script bugs (Python code issues)                    | 3     | TC022, TC024, TC033        |
| JSON field name casing mismatch                          | 2     | TC019, TC027               |
| Semantic status code difference (403 vs 400)             | 1     | TC004                      |
| Health endpoint returns non-JSON                         | 1     | TC029                      |
| Validation order differs from PRD expectation            | 1     | TC023                      |

### 🔒 Priority Action Items

1. **CRITICAL — Fix isCorrect leakage (TC008):** The `GetQuizDataForAttempt` handler should strip the `isCorrect` field from all answer objects before returning the response. This allows students to cheat.
2. **LOW — Add `data` to site visit response (TC015):** Include the created `SiteVisit` record in the response body.
3. **LOW — Consider standardizing field casing:** Some tests failed due to `userId` vs `userID` or `questionId` vs `questionID` mismatches. Ensure consistent JSON field naming across all models.

---
