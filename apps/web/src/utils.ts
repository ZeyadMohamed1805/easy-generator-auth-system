export function cx(
  ...classes: Array<string | false | 0 | null | undefined>
): string {
  return classes.filter(Boolean).join(' ');
}
