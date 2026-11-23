/** Bound stalled requests without retrying writes or changing TLS/DNS settings. */
export function createBoundedFetch(fetcher: typeof fetch = fetch, timeoutMs = 12_000): typeof fetch {
  return (input, init) => {
    const signals = [AbortSignal.timeout(timeoutMs)];
    if (input instanceof Request) signals.push(input.signal);
    if (init?.signal) signals.push(init.signal);
    return fetcher(input, { ...init, signal: AbortSignal.any(signals) });
  };
}
