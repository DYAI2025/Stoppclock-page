---
description: Dispatch worker-specialist agents to execute multi-task projects using TDD with automated git commits and testing
allowed-tools: [Task, Bash, Read, Write, Edit, Grep, Glob]
---

## Context

When a project has 10+ auto-generated tasks, manually implementing each is slow and error-prone. This skill implements:
- Dispatch single worker-specialist agent
- Agent executes tasks sequentially using TDD
- For each task: Write test → Implement → Run tests → Commit
- Automatic progress tracking
- No manual intervention needed

Evidence: stoppclock AdSense integration - 21 tasks, 495 tests, 12 commits in 9.5 minutes.

## Your Task

Implement a deployment workflow that spawns executor agents for multi-task projects.

### Requirements

- Identify project with multiple auto-generated tasks
- Extract task list with full descriptions
- Dispatch worker-specialist agent with:
  - Repository path
  - Task list (prioritized by complexity: low → high)
  - TDD workflow mandate
  - Commit requirements (one per task)
- Agent runs autonomously
- Monitor progress without blocking

### Workflow

**Pre-execution:**
1. Verify project exists and has tasks
2. Sort tasks by complexity (low first)
3. Extract full task descriptions
4. Prepare agent prompt with all context

**Agent Execution:**
1. Agent clones/enters repository
2. For EACH task (low→high):
   - Write FAILING test
   - Run test (verify it fails)
   - Implement minimal code to pass
   - Run all tests (verify no regressions)
   - git add + git commit with task name
   - Report completion
3. Agent generates final summary

**Post-execution:**
1. Verify all commits present
2. Run full test suite
3. Push to remote
4. Activate monitoring/CI/CD

### Implementation

**Agent Dispatch:**
```bash
Task subagent_type=worker-specialist
- Repository path: /path/to/project
- Task list: [Task 1, Task 2, ...]
- Mandate: TDD workflow, one commit per task
- No planning, only code
```

**Agent Prompt Structure:**
```
MISSION: [Project Name] - TDD Approach

Repository: [path]
Workspace: [workspace-path]

Tasks (sorted by complexity):
1. [Task Title] - LOW
   - What: [Description]
   - Tests needed: [What to test?]

2. [Task Title] - MEDIUM
   ...

CRITICAL RULES:
- Write test FIRST (must fail)
- Implement code to pass test
- All tests must pass
- One task = one commit
- NO planning documents
- NO design docs
```

### Guardrails

**DO:**
- Sort tasks by complexity (lowest first)
- Provide complete task descriptions upfront
- Mandate TDD: tests before code
- Require git commits after each task
- Run full test suite between tasks
- Background execution is OK (don't wait)

**DON'T:**
- Dispatch without task list
- Skip test writing
- Commit without tests passing
- Mix multiple tasks in one commit
- Allow agent to skip tasks
- Require manual approval between tasks

### Monitoring

```bash
# Check progress
tail -50 /tmp/claude/.../tasks/[agent-id].output

# Expected output:
# Task 1: Setup AdSense - PASSING (22 tests)
# Task 2: Review Policies - PASSING (16 tests)
# Task 3: EU Consent - PASSING (30 tests)
# ...
```

### Success Criteria

- All tasks have corresponding git commits
- All tests passing (0 failures)
- No regressions between tasks
- Final summary shows task count + test count
- Deployment ready for next phase

---
*Generated from pattern: 21 tasks → 495 tests → 12 commits → DONE*
