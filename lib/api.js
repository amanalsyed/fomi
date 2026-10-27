/** Thin client for the mocked API routes. Throws Error with a user-facing message. */

async function request(url, options = {}) {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error("Network error. Check your connection and try again.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }
  return data;
}

export const fetchGeneration = (id) =>
  request(`/api/generations/${encodeURIComponent(id)}`).then((d) => d.generation);

export const createGeneration = (payload, { signal } = {}) =>
  request("/api/generations", {
    method: "POST",
    body: JSON.stringify(payload),
    signal,
  }).then((d) => d.generation);
