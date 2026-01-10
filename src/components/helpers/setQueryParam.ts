export default function setQueryParam(key: string, value?: string | null) {
  const url = new URL(window.location.href);

  if (value === null || value === undefined || value === "") {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }

  window.history.pushState({}, "", url);
}
