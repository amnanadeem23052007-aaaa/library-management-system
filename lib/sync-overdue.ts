export const FINE_PER_DAY = 10;

function startOfDay(value: Date) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function syncOverdueIssues(issues: any[]) {
  const today = startOfDay(new Date());

  for (const issue of issues) {
    if (!issue?.dueDate || issue.status === "returned") {
      continue;
    }

    const due = startOfDay(new Date(issue.dueDate));

    if (due >= today) {
      continue;
    }

    const days = Math.max(
      1,
      Math.floor((today.getTime() - due.getTime()) / 86_400_000)
    );
    const fine = days * FINE_PER_DAY;

    let changed = false;

    if (issue.status === "issued") {
      issue.status = "overdue";
      changed = true;
    }

    if (Number(issue.fine || 0) !== fine) {
      issue.fine = fine;
      changed = true;
    }

    if (changed) {
      await issue.save();
    }
  }

  return issues;
}
