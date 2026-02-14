# Skill: Phase Archiver
## Context: Qnowa ERP/CRM (DDD & Hybrid Structure)

**Trigger:** "Phase [X] completed"

**Actions:**
1. **Analyze Codebase:** Identify new Aggregate Roots, Entities, and Value Objects.
2. **Update Hybrid Glossary:** Map Turkish business terms to English technical definitions.
3. **Generate Diagram:** Update the Mermaid.js data flow diagram for the current phase.
4. **Append History:** Create a summary file in `.antigravity/history/phases/phase-[X].md`.
5. **Security Check:** Verify if new endpoints follow RLS (Row Level Security) and Org-Isolation rules.

**Output:** A cumulative "Master_Architecture.md" reflecting the state of Phase 5+.
