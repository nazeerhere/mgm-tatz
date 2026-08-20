const minimumCompletionTimeMs = 1_500;

export function looksLikeAutomatedSubmission(
  formData: FormData,
  now = Date.now(),
) {
  if (String(formData.get("website") ?? "").trim()) return true;

  const startedAt = Number(formData.get("submissionStartedAt"));
  if (!Number.isFinite(startedAt) || startedAt <= 0) return false;

  const elapsed = now - startedAt;
  return elapsed < minimumCompletionTimeMs;
}
