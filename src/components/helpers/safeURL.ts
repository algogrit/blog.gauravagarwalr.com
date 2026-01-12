export default function safeURL(
  relativePath: string,
  params: Record<string, string>
): string {
  // Create URLSearchParams object
  const searchParams = new URLSearchParams(params);

  // Construct the final relative path with query parameters
  return `${relativePath}?${searchParams.toString()}`;
}
