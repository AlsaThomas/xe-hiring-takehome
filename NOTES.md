QA Testing Notes

1. Testing Approach

A risk-based testing approach was used to focus on areas with the highest potential business and user impact.

Priority Areas

Exchange rate retrieval

Alert creation and validation

Alert trigger evaluation logic

Frontend/backend integration

Failure and recovery scenarios

User experience during backend/API failures

2. Test Coverage

API Testing

GET /api/rates

POST /api/alerts

Alert field validation

Currency pair validation

Direction validation

Threshold validation

Alert trigger evaluation

UI Testing

Application loads successfully

Currency pairs and exchange rates are displayed

Refresh functionality

Last updated timestamp

Frontend behavior when the backend/API is unavailable

Automated Test Execution

Playwright: 8 tests passed

Playwright: 0 tests failed

3. Environment / Startup Observation

Observation

During environment setup, the Rate Board initially displayed placeholder values (...) because the frontend could not retrieve exchange-rate data while the backend service was unavailable.

Investigation

Verified the /api/rates endpoint independently.

Confirmed backend service availability.

Confirmed the frontend successfully retrieved and rendered exchange rates once the API was available.

Conclusion

Not a product defect.

Classification: Environment / startup dependency condition

4. Confirmed Defect

DEFECT-001 — Negative Threshold Values Accepted

Title: Alert API accepts negative threshold values

Severity: Medium

Priority: Medium

Area: Alert Management API

Preconditions

Backend service is running.

/api/alerts endpoint is available.

Steps to Reproduce

1. Send a POST request to /api/alerts.

2. Submit:

{
  "pair": "USD/CAD",
  "threshold": -100,
  "direction": "above"
}

Actual Result

The API successfully creates the alert and returns 201 Created.

{
  "threshold": -100,
  "triggered": true
}

Expected Result

The API should reject negative threshold values with a validation error, for example 400 Bad Request.

Business Impact

Invalid alert configurations can be created.

Unexpected alert behavior may occur.

Users may receive misleading notifications.

Data quality may be affected.

Classification: Confirmed Defect

5. Risk / Open Question

RISK-001 — Duplicate Alerts Can Be Created

Title: Duplicate alerts can be created for the same pair, threshold, and direction

Scenario

Create the following alert twice:

{
  "pair": "USD/CAD",
  "threshold": 1.30,
  "direction": "above"
}

Actual Result

Both requests succeed and create separate alert records.

Potential Impact

Duplicate notifications

Alert fatigue

Duplicate data

Increased processing overhead

Recommendation

Clarify the expected business behavior with the Product Owner / Business Analyst.

Questions to confirm: Should duplicate alerts be allowed? Should identical alerts be rejected, merged, or ignored?

Classification: Risk / Open Question

This is not currently classified as a confirmed defect because the expected business behavior has not been established.

6. Risk / UX Reliability

RISK-002 — No User-Facing Error Handling When Exchange Rates Fail

Title: No user-facing error handling when exchange-rate retrieval fails

Steps to Reproduce

Start the frontend application.

Confirm the Rate Board is displayed.

Stop the backend API/service.

Refresh the Rate Board.

Observe the UI.

Evidence

The UI continues displaying placeholder values (...). The browser Network tab shows the rates request returning 500. No visible error message is presented to the user.

Actual Result

The application continues displaying placeholder values without explaining why exchange rates are unavailable.

Expected Result

The application should provide a meaningful error state, for example: "Unable to load exchange rates. Please try again later." A retry or recovery action could also be provided.

Business / User Impact

Users cannot distinguish between data still loading and an API failure.

Users may not know whether the backend is unavailable.

Users may not know whether there is an internet/connectivity issue.

This may cause confusion and reduce user confidence.

Recommendation

Display an explicit error message.

Provide a retry option where appropriate.

Distinguish loading, success, and error states.

Avoid displaying indefinite placeholder values when the request has failed.

Classification: UX / Reliability Risk

This is not classified as a critical defect because the application is intentionally incomplete in some areas, but it is a valid reliability and user-experience risk.

7. Validated Behaviors — PASS

PASS-001 — Invalid Direction Rejected

Request:

{
  "pair": "USD/CAD",
  "threshold": 1.30,
  "direction": "up"
}

Actual Result: 400 Bad Request

Expected Result: Unsupported direction values should be rejected.

Supported values: above, below

The value "up" is invalid and was correctly rejected.

Conclusion: PASS — Not a defect. The API correctly validates the direction field.

8. Validated Behaviors — PASS

PASS-002 — Invalid Currency Pair Rejected

Request:

{
  "pair": "AAA/BBB",
  "threshold": 1.30,
  "direction": "above"
}

Actual Result: 400 Bad Request

Supported currency pairs: USD/CAD, GBP/USD, EUR/USD

The invalid pair AAA/BBB was correctly rejected.

Conclusion: PASS — Not a defect. The API correctly validates supported currency pairs.

9. Validated Behaviors — PASS

PASS-003 — Alert Trigger Evaluation Logic

Request:

{
  "pair": "USD/CAD",
  "threshold": 2,
  "direction": "above"
}

Current USD/CAD rate: 1.4106

Business rule: Trigger when rate > 2

Calculation: 1.4106 > 2 = false

API response:

{
  "pair": "USD/CAD",
  "threshold": 2,
  "direction": "above",
  "triggered": false
}

Conclusion: PASS — Business rule works as expected. The API correctly evaluates the current exchange rate against the configured threshold.

10. Overall Findings Summary

ID

Type

Area

Result

Severity

DEFECT-001

Confirmed Defect

Alert API

Negative thresholds accepted

Medium

RISK-001

Risk / Open Question

Alert Management

Duplicate alerts allowed

To be confirmed

RISK-002

UX / Reliability Risk

Rate Board

No user-facing API failure message

To be assessed

PASS-001

Passed Validation

Alert API

Invalid direction rejected

N/A

PASS-002

Passed Validation

Alert API

Invalid currency pair rejected

N/A

PASS-003

Passed Validation

Alert API

Trigger logic works correctly

N/A

OBS-001

Environment Observation

Environment Setup

Placeholder rates caused by unavailable backend

N/A

11. Testing Conclusions

The main validation areas were successfully covered across the API and UI.

Exchange-rate retrieval once the backend is available

Invalid direction validation

Invalid currency-pair validation

Alert trigger evaluation

Frontend rendering of exchange rates when the API is available

UI refresh functionality

Last updated timestamp

Automated Playwright coverage

One confirmed defect was identified: DEFECT-001 — The Alert API accepts negative threshold values.

Two additional risks were identified: RISK-001 — Duplicate alerts can be created; and RISK-002 — The UI does not provide a user-facing error state when exchange-rate retrieval fails.

RISK-001 should be clarified with the Product Owner/Business Analyst before being classified as a defect because the expected duplicate-alert behavior has not yet been established.

RISK-002 is considered primarily a UX/reliability risk rather than a critical functional defect.

12. Additional Testing Recommendations

API

API contract testing

Boundary-value testing

Additional negative-value scenarios

Zero threshold validation

Very large threshold values

Missing required fields

Null values

Incorrect data types

Duplicate request behavior

Authentication/authorization where applicable

UI

Accessibility testing

Cross-browser testing

Loading-state validation

Error-state validation

Retry/recovery behavior

Responsive behavior

Network interruption scenarios

Integration

External dependency failure simulation

Backend timeout scenarios

API 4xx/5xx response handling

Frontend/backend contract validation

CI/CD

Cross-browser Playwright execution in CI

Automated test reporting

Test execution against deployment environments

Failure notifications

13. AI Usage

Test-design discussions

Automation structure review

Risk-analysis brainstorming

Identifying additional scenarios and edge cases

All findings, validations, conclusions, and observed behaviors were manually executed and verified before being documented.

14. Test Artifacts

tests/api/alerts.spec.ts
tests/api/rates.spec.ts
tests/ui/rate-board.spec.ts

Playwright execution: 8 tests passed, 0 tests failed.

15. Git Status Verification

After creating this NOTES.md file and the automated tests, run:

git status

Expected new files should include:

new file: NOTES.md
new file: tests/api/alerts.spec.ts
new file: tests/api/rates.spec.ts
new file: tests/ui/rate-board.spec.ts