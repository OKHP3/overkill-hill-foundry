#!/usr/bin/env python3
"""Inspect the FoundRy dispatch ledger without spawning, editing, or inferring gates."""
import argparse
import json
import re
from collections import Counter
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--series', default='docs/handoffs/2026-10-05-executable-series/tasks.json')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
path = root / args.series
ledger = json.loads(path.read_text(encoding='utf-8-sig'))
tasks = ledger['tasks']
ids = [t['id'] for t in tasks]
findings = [f for t in tasks for f in t['finding_ids']]
source = json.loads((root / ledger['source_review']).read_text(encoding='utf-8'))
expected = {f['id'] for f in source['follow_up']}
errors = []
if len(ids) != len(set(ids)):
    errors.append('Duplicate task IDs')
if len(findings) != len(set(findings)) or set(findings) != expected:
    errors.append('Review finding coverage is incomplete or duplicated')
planned_workers = sum(not t.get('reuse_worker_of') for t in tasks)
existing_reviewers = len(ledger.get('preexisting_review_agents', []))
supplemental_reviewers = len(ledger.get('supplemental_review_agents', []))
reviewer_ids = ledger.get('preexisting_review_agents', []) + ledger.get('supplemental_review_agents', [])
if len(reviewer_ids) != len(set(reviewer_ids)):
    errors.append('Duplicate reviewer identities')
planned_total = planned_workers + ledger['reserved_new_task_slots'] + ledger.get('replacement_worker_slots', 0) + existing_reviewers + supplemental_reviewers
if planned_total > ledger['maximum_new_worker_threads']:
    errors.append('Planned workers exceed the owner ceiling')
if ledger['spawned_new_worker_threads'] + existing_reviewers + supplemental_reviewers > 30:
    errors.append('Spawned workers exceed the owner ceiling')
known_workers = {t['thread_id'] for t in tasks if t['thread_id']}
known_workers.update(worker['thread_id'] for t in tasks for worker in t.get('previous_workers', []))
if len(known_workers) != ledger['spawned_new_worker_threads']:
    errors.append('Spawned worker count does not match current and preserved thread identities')
active = [t for t in tasks if t['status'] in ('dispatched', 'accepted', 'in-progress')]
if len(active) > ledger['concurrency_limit']:
    errors.append('Active writers exceed the series concurrency limit')
for t in tasks:
    if not 0 < t['goal_token_budget'] <= t['absolute_token_ceiling'] <= 2000000:
        errors.append(f"{t['id']}: invalid worker token ceiling")
    prompt_path = path.parent / t['prompt']
    if not prompt_path.is_file():
        errors.append(f"{t['id']}: missing launch prompt")
    else:
        prompt = prompt_path.read_text(encoding='utf-8-sig')
        configured = re.search(r'token_budget=(\d+)', prompt)
        if not configured or int(configured.group(1)) != t['goal_token_budget']:
            errors.append(f"{t['id']}: prompt goal ceiling differs from ledger")
    if t['status'] in ('accepted', 'in-progress', 'ready-for-review', 'integrated', 'verified') and not (root / t['receipt']).is_file():
        errors.append(f"{t['id']}: accepted status has no published receipt in this checkout")
allocations = Counter()
for t in tasks:
    allocations[t.get('reuse_worker_of', t['id'])] += t['goal_token_budget']
    allocations[t.get('reuse_worker_of', t['id'])] += sum(t.get('additional_goal_allocations', []))
    for worker in t.get('previous_workers', []):
        allocations[worker['thread_id']] += worker['goal_token_budget']
if any(amount > 2000000 for amount in allocations.values()):
    errors.append('Combined planned goals exceed an individual worker allocation ceiling')
for i, left in enumerate(active):
    for right in active[i+1:]:
        # Wildcard/subtree scopes are not active in the initial wave. Treat any
        # equal or containing scope as a collision when future writers activate.
        for a in left['allowed_files']:
            for b in right['allowed_files']:
                aa, bb = a.removesuffix('/**'), b.removesuffix('/**')
                if aa == bb or aa.startswith(bb + '/') or bb.startswith(aa + '/'):
                    errors.append(f"File ownership collision: {left['id']} / {right['id']}: {a} / {b}")
ready = [t for t in tasks if t['status'] == 'ready' and t['thread_id'] is None]
capacity = max(0, ledger['concurrency_limit'] - len(active))
print(json.dumps(dict(
    validation='FAIL' if errors else 'PASS', errors=errors,
    source_finding_count=len(expected), mapped_finding_count=len(findings),
    planned_tasks=len(tasks), spawned_workers=ledger['spawned_new_worker_threads'],
    preexisting_reviewers=existing_reviewers, supplemental_reviewers=supplemental_reviewers,
    total_spawned_and_preexisting=ledger['spawned_new_worker_threads']+existing_reviewers+supplemental_reviewers,
    planned_distinct_workers=planned_total,
    maximum_individual_allocated_goals=max(allocations.values()),
    reserved_slots=ledger['reserved_new_task_slots'], active=[t['id'] for t in active],
    free_worker_slots=capacity, states=dict(Counter(t['status'] for t in tasks)),
    next_dispatch=[dict(id=t['id'], model=t['model'], effort=t['reasoning_effort'],
                        goal_token_budget=t['goal_token_budget'], prompt=str(path.parent / t['prompt']))
                   for t in ready[:capacity]],
    gate_policy='Queued, conditional and external-gate tasks require coordinator evidence review; this command never assumes a gate passed.'
), indent=2))
raise SystemExit(bool(errors))
