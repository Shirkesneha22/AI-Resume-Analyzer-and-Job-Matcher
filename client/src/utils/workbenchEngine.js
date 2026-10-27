// FNV-1a hash function for deterministic seeded randomization
export function H(s) {
  let h = 2166136261;
  for (const c of s) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function rng(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const SECS = [
  "Contact",
  "Summary",
  "Education",
  "Skills",
  "Projects",
  "Work experience",
  "Certifications",
  "Links"
];

export const POOL = [
  ["Frontend", "React"],
  ["Frontend", "TypeScript"],
  ["Frontend", "JavaScript"],
  ["Frontend", "Tailwind CSS"],
  ["Backend", "Python"],
  ["Backend", "FastAPI"],
  ["Backend", "Node.js"],
  ["Backend", "REST API"],
  ["Database", "PostgreSQL"],
  ["Database", "MongoDB"],
  ["Database", "Redis"],
  ["Cloud", "AWS"],
  ["Cloud", "Docker"],
  ["DevOps", "Git"],
  ["DevOps", "CI/CD"]
];

export const STEPS = [
  "Read PDF",
  "Find skills",
  "Set requirements",
  "Compare keywords",
  "Score",
  "Write advice"
];

// Generates a realistic mock report if sample resume is used or as fallback
export function buildSampleReport(f, t, jd) {
  const seed = H(f.name + (f.size || 184320) + t + (jd || "").length);
  const r = rng(seed);
  const str = 0.18 + r() * 0.58;

  const req = POOL.filter(p => H(t + p[1]) % 5 !== 0);
  const skills = req.map(([d, n]) => {
    const x = r();
    return {
      d,
      n,
      s: x < str * 0.75 ? "match" : x < str * 0.75 + 0.16 ? "partial" : "miss"
    };
  });

  const sections = {};
  SECS.forEach(s => {
    sections[s] = s === "Contact" ? true : r() < 0.48 + str * 0.5;
  });

  return {
    name: f.name,
    target: t,
    sample: !!f.sample,
    skills,
    sections,
    e: r(),
    d: r(),
    f: r(),
    kwb: r() * 16,
    q: false,
    seed
  };
}

// Factors calculation: Skills (40%), Experience (20%), Education (10%), Keywords (20%), Formatting (10%)
export function factors(R, ov) {
  if (R.isBackend && !ov) {
    const F = [
      ["Skills", Math.round(R.skill_score * 10) / 10, 40],
      ["Experience", Math.round(R.experience_score * 10) / 10, 20],
      ["Education", Math.round(R.education_score * 10) / 10, 10],
      ["Keywords", Math.round(R.keyword_score * 10) / 10, 20],
      ["Formatting", Math.round(R.formatting_score * 10) / 10, 10]
    ];
    return {
      F,
      total: Math.round(R.score * 10) / 10
    };
  }

  const sk = ov?.skills || R.skills;
  const se = ov?.sections || R.sections;
  const q = ov?.q || R.q;

  const N = sk.length || 1;
  const m = sk.filter(x => x.s === "match").length;
  const p = sk.filter(x => x.s === "partial").length;

  const sp = ((m + 0.5 * p) / N) * 100;
  const kw = Math.min(100, sp * 0.75 + (R.kwb || 10));
  const ex = se["Work experience"] ? 45 + (R.e || 0.6) * 45 : 10 + (R.e || 0.3) * 18;
  const ed = se.Education ? 55 + (R.d || 0.7) * 40 : 15;
  const cnt = Object.values(se).filter(Boolean).length;
  const fm = Math.min(100, (cnt / SECS.length) * 65 + (R.f || 0.6) * 25 + (q ? 10 : 0));

  const F = [
    ["Skills", sp, 40],
    ["Experience", ex, 20],
    ["Education", ed, 10],
    ["Keywords", kw, 20],
    ["Formatting", fm, 10]
  ].map(a => [a[0], Math.round(a[1] * 10) / 10, a[2]]);

  return {
    F,
    total: Math.round(F.reduce((acc, f) => acc + (f[1] * f[2]) / 100, 0) * 10) / 10
  };
}

export function applyFixes(R, fx) {
  const sk = R.skills.map(x => ({ ...x }));
  const se = { ...R.sections };
  let q = R.q;

  fx.forEach(f => {
    f.skills?.forEach(n => {
      const k = sk.find(x => x.n === n);
      if (k) k.s = "match";
    });
    if (f.section) se[f.section] = true;
    if (f.q) q = true;
  });

  return { skills: sk, sections: se, q };
}

export function makeFixes(R) {
  const out = [];
  const base = factors(R).total;
  const miss = R.skills.filter(x => x.s !== "match");
  const by = {};

  miss.forEach(x => {
    by[x.d] = by[x.d] || [];
    by[x.d].push(x.n);
  });

  Object.entries(by).forEach(([d, ns]) => {
    out.push({
      id: "d" + d,
      text: `Add ${ns.join(", ")} to your Skills section and a project bullet (${d.toLowerCase()})`,
      skills: ns
    });
  });

  SECS.filter(s => !R.sections[s] && s !== "Certifications").forEach(s => {
    out.push({
      id: "s" + s,
      text: s === "Links" ? "Add GitHub and LinkedIn links to your header" : `Add a “${s}” section`,
      section: s
    });
  });

  if (!R.q) {
    out.push({
      id: "q",
      text: "Add numbers to bullets (for example “cut load time by 40%”)",
      q: true
    });
  }

  out.forEach(f => {
    f.gain = Math.round((factors(R, applyFixes(R, [f])).total - base) * 10) / 10;
  });

  return out.sort((a, b) => b.gain - a.gain);
}

// Map backend API data to workbench format
export function mapBackendResponse(apiData, file, target) {
  const skills = (apiData.skill_heatmap || []).map(item => ({
    d: item.category || "Core",
    n: item.name,
    s: item.status === "matched" ? "match" : item.status === "partial" ? "partial" : "miss"
  }));

  const sections = {};
  const present = (apiData.sections_audit?.present_sections || []).map(s => s.toLowerCase());
  SECS.forEach(sec => {
    sections[sec] = present.some(p => p.includes(sec.toLowerCase()) || sec.toLowerCase().includes(p));
  });

  return {
    isBackend: true,
    name: file?.name || "resume.pdf",
    target: target || "Full Stack Developer",
    sample: false,
    score: apiData.score ?? 75,
    skill_score: apiData.skill_score ?? 72,
    experience_score: apiData.experience_score ?? 78,
    education_score: apiData.education_score ?? 85,
    keyword_score: apiData.keyword_score ?? 70,
    formatting_score: apiData.formatting_score ?? 80,
    skills,
    sections,
    interview_tips: apiData.interview_tips || [],
    projects: apiData.projects || [],
    suggestions: apiData.suggestions || [],
    roadmap: apiData.roadmap || [],
    career_advice: apiData.career_advice || "",
    e: 0.7,
    d: 0.8,
    f: 0.7,
    kwb: 12,
    q: false
  };
}
