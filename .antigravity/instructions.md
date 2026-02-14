# Qnowa Project Protocols
- **Architecture:** Domain-Driven Design (DDD) with a Hybrid Language approach.
- **Security:** Zero-trust multi-tenancy. Never query without an `orgId`.
- **Phase Completion:** When a phase ends, invoke the `phase-archiver` skill automatically.
- **Document Storage:** Keep all architectural updates in `docs/architecture/MASTER_SPEC.md`.
