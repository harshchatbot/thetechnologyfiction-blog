export function isLegacyWordPressMediaUrl(value?: string) {
  if (!value) return false;
  return /thetechnologyfiction\.com/.test(value) && /\/wp-content\/uploads\//.test(value);
}

export function getWordPressMediaCandidates(value: string) {
  const candidates = new Set<string>();

  const pushCandidate = (candidate?: string) => {
    if (candidate) {
      candidates.add(candidate);
    }
  };

  pushCandidate(value);

  try {
    const url = new URL(value);
    const path = url.pathname;
    const variants = new Set<string>([path]);

    if (path.startsWith("/blog/wp-content/uploads/")) {
      variants.add(path.replace("/blog/wp-content/uploads/", "/wp-content/uploads/"));
    }

    if (path.startsWith("/wp-content/uploads/")) {
      variants.add(`/blog${path}`);
    }

    const hostnames = new Set<string>([url.hostname]);
    if (url.hostname.startsWith("www.")) {
      hostnames.add(url.hostname.replace(/^www\./, ""));
    } else {
      hostnames.add(`www.${url.hostname}`);
    }

    for (const hostname of hostnames) {
      for (const pathname of variants) {
        const candidate = new URL(url.toString());
        candidate.hostname = hostname;
        candidate.pathname = pathname;
        pushCandidate(candidate.toString());
      }
    }
  } catch {
    pushCandidate(value);
  }

  return Array.from(candidates);
}
