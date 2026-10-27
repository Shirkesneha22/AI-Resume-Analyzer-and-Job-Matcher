import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ROLES } from '../constants/roles';
import {
  H,
  SECS,
  STEPS,
  factors,
  applyFixes,
  makeFixes,
  buildSampleReport,
  mapBackendResponse
} from '../utils/workbenchEngine';
import { analyzeResumeApi } from '../services/api';

const colT = v => (v >= 70 ? 'var(--goodt)' : v >= 45 ? 'var(--warnt)' : 'var(--badt)');
const colB = v => (v >= 70 ? 'var(--good)' : v >= 45 ? 'var(--warn)' : 'var(--bad)');

export const WorkbenchPage = () => {
  const { theme, toggleTheme } = useTheme();

  // Navigation page state: 'analyze' | 'run' | 'report' | 'guide'
  const [currentPage, setCurrentPage] = useState('analyze');
  const [reportData, setReportData] = useState(null);
  const [runsHistory, setRunsHistory] = useState([]);

  // Sidebar rail toggle (Desktop)
  const [railOff, setRailOff] = useState(() => {
    try {
      return localStorage.getItem('mc3-rail') === 'off';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.body.classList.toggle('rail-off', railOff);
    try {
      localStorage.setItem('mc3-rail', railOff ? 'off' : 'on');
    } catch {}
  }, [railOff]);

  // Form Inputs
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [targetMode, setTargetMode] = useState('role'); // 'role' | 'jd'
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [roleSearch, setRoleSearch] = useState('');
  const [customJd, setCustomJd] = useState('');

  // Running State & Progress
  const [isBusy, setIsBusy] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [runStatus, setRunStatus] = useState('');
  const [runError, setRunError] = useState('');
  const abortControllerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Report View State
  const [checkedFixes, setCheckedFixes] = useState(new Set());
  const [activeTab, setActiveTab] = useState(0); // 0: Breakdown, 1: Skills, 2: Sections, 3: Coach
  const [skillFilter, setSkillFilter] = useState('all');
  const [copyFeedback, setCopyFeedback] = useState('Copy as checklist');

  // Handle URL hash changes
  useEffect(() => {
    const handleHash = () => {
      let hash = (window.location.hash || '#analyze').replace('#', '');
      if (hash === 'faq') {
        setCurrentPage('guide');
        setTimeout(() => {
          document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return;
      }
      if (hash === 'report' && !reportData) {
        hash = 'analyze';
      }
      if (['analyze', 'report', 'guide'].includes(hash)) {
        setCurrentPage(hash);
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, [reportData]);

  const navigateTo = (page) => {
    if (page === 'report' && !reportData) return;
    window.location.hash = '#' + page;
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // File Handling
  const handleFileChange = (newFile) => {
    setFileError('');
    if (!newFile) return;

    if (!/\.pdf$/i.test(newFile.name)) {
      setFileError('That isn’t a PDF. Export your resume as a PDF and try again.');
      return;
    }
    if (newFile.size > 10485760) {
      setFileError('That file is over 10 MB. Compress it and try again.');
      return;
    }

    setFile(newFile);
  };

  const clearFile = () => {
    setFile(null);
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Drag and drop events
  const [isDragOver, setIsDragOver] = useState(false);
  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const onDragLeave = () => setIsDragOver(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Sample Resume
  const loadSampleResume = () => {
    handleFileChange({
      name: 'sample-resume.pdf',
      size: 184320,
      sample: true
    });
    navigateTo('analyze');
  };

  // Target label
  const targetLabel = targetMode === 'role' ? selectedRole : 'Custom job description';
  const isFormValid = Boolean(file && (targetMode === 'role' || customJd.trim().length > 30));

  // Run Analysis
  const startAnalysis = async () => {
    if (!isFormValid || !file) return;

    setIsBusy(true);
    setRunError('');
    setCurrentStep(0);
    setCurrentPage('run');
    abortControllerRef.current = new AbortController();

    const targetDesc = targetMode === 'role' ? selectedRole : customJd.trim();

    try {
      let finalResult = null;

      if (!file.sample) {
        // Attempt actual FastAPI call
        const formData = new FormData();
        formData.append('file', file);
        if (targetMode === 'role') {
          formData.append('role', selectedRole);
        } else {
          formData.append('job_description', customJd.trim());
        }

        // Stepper animation
        for (let i = 0; i < STEPS.length; i++) {
          setCurrentStep(i);
          setRunStatus(`Step ${i + 1} of ${STEPS.length}: ${STEPS[i]}`);
          if (i === 1) {
            // Initiate backend network request
            try {
              const apiRes = await analyzeResumeApi(formData);
              finalResult = mapBackendResponse(apiRes, file, targetLabel);
            } catch (err) {
              console.warn('Backend unavailable, falling back to instant analyzer engine:', err);
              finalResult = buildSampleReport(file, targetLabel, customJd);
            }
          }
          await new Promise((res) => setTimeout(res, 380));
        }
      } else {
        // Sample resume simulation mode
        for (let i = 0; i < STEPS.length; i++) {
          setCurrentStep(i);
          setRunStatus(`Step ${i + 1} of ${STEPS.length}: ${STEPS[i]} (demo mode)`);
          await new Promise((res) => setTimeout(res, 420 + (H(file.name) % 5) * 80));
        }
        finalResult = buildSampleReport(file, targetLabel, customJd);
      }

      setReportData(finalResult);
      setCheckedFixes(new Set());
      const baseScore = factors(finalResult).total;
      setRunsHistory((prev) => [...prev, { name: finalResult.name, score: baseScore }]);
      setIsBusy(false);
      navigateTo('report');
    } catch (err) {
      setIsBusy(false);
      if (err.name === 'AbortError') {
        navigateTo('analyze');
        return;
      }
      setRunError('Analysis failed: ' + (err.message || 'unknown error') + '. Your file was not saved.');
    }
  };

  const cancelAnalysis = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsBusy(false);
    navigateTo('analyze');
  };

  // Report Calculations
  const currentFactors = useMemo(() => {
    if (!reportData) return null;
    return factors(reportData);
  }, [reportData]);

  const reportFixes = useMemo(() => {
    if (!reportData) return [];
    return makeFixes(reportData);
  }, [reportData]);

  const topFixes = useMemo(() => reportFixes.slice(0, 3), [reportFixes]);
  const restFixes = useMemo(() => reportFixes.slice(3), [reportFixes]);

  const projectedScore = useMemo(() => {
    if (!reportData) return 0;
    const applied = reportFixes.filter((f) => checkedFixes.has(f.id));
    return Math.min(100, factors(reportData, applyFixes(reportData, applied)).total);
  }, [reportData, reportFixes, checkedFixes]);

  const topProjectedScore = useMemo(() => {
    if (!reportData) return 0;
    const topSet = new Set(topFixes.map((f) => f.id));
    const applied = reportFixes.filter((f) => topSet.has(f.id));
    return Math.round(Math.min(100, factors(reportData, applyFixes(reportData, applied)).total));
  }, [reportData, reportFixes, topFixes]);

  const toggleFix = (fixId) => {
    setCheckedFixes((prev) => {
      const next = new Set(prev);
      if (next.has(fixId)) next.delete(fixId);
      else next.add(fixId);
      return next;
    });
  };

  const copyChecklist = async () => {
    const text = reportFixes.map((f) => `- [ ] ${f.text}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopyFeedback('Copied!');
    setTimeout(() => setCopyFeedback('Copy as checklist'), 1800);
  };

  // Skills domains and filter
  const skillDomains = useMemo(() => {
    if (!reportData?.skills) return [];
    return [...new Set(reportData.skills.map((x) => x.d))];
  }, [reportData]);

  const matchedSkillsCount = reportData?.skills?.filter((x) => x.s === 'match').length || 0;
  const partialSkillsCount = reportData?.skills?.filter((x) => x.s === 'partial').length || 0;
  const missingSkillsCount = reportData?.skills?.filter((x) => x.s === 'miss').length || 0;
  const missingSkillsList = reportData?.skills?.filter((x) => x.s !== 'match') || [];

  // Previous run comparison
  const previousRun = runsHistory.length > 1 ? runsHistory[runsHistory.length - 2] : null;
  const scoreDelta = previousRun && currentFactors ? Math.round((currentFactors.total - previousRun.score) * 10) / 10 : null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Site Header */}
      <header className="site">
        <a
          className="brand"
          href="#analyze"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('analyze');
          }}
          aria-label="MatchCraft AI home"
        >
          <i>✦</i>MatchCraft AI
        </a>
        <nav className="links" aria-label="Site">
          <a
            href="#analyze"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('analyze');
            }}
          >
            Analyzer
          </a>
          <a
            href="#guide"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('guide');
            }}
          >
            How it works
          </a>
          <a
            href="#faq"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('guide');
              setTimeout(() => {
                document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
              }, 150);
            }}
          >
            FAQ
          </a>
        </nav>
        <span className="sp" />
        <button className="btn btn-sm" id="theme" onClick={toggleTheme} aria-label="Switch light or dark theme">
          Theme ({theme})
        </button>
        <a
          className="btn btn-primary btn-sm cta"
          href="#analyze"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('analyze');
          }}
        >
          Analyze resume
        </a>
      </header>

      {/* 2. Main Shell with Left Rail (or Fixed Bottom Bar on Mobile) */}
      <div className="shell">
        <nav className="rail" id="rail" aria-label="Main">
          <button
            className="tog"
            id="sb"
            onClick={() => setRailOff(!railOff)}
            aria-controls="rail"
            aria-expanded={String(!railOff)}
            aria-label={railOff ? 'Show sidebar' : 'Hide sidebar'}
          >
            <span className="ic" id="sbi" aria-hidden="true">
              {railOff ? '»' : '«'}
            </span>
            <span className="lbl" id="sbt">
              {railOff ? 'Show sidebar' : 'Hide sidebar'}
            </span>
          </button>

          <a
            href="#analyze"
            id="n-analyze"
            className={currentPage === 'analyze' ? 'on' : ''}
            onClick={(e) => {
              e.preventDefault();
              navigateTo('analyze');
            }}
            title="Analyze"
          >
            <span className="ic" aria-hidden="true">
              ◧
            </span>
            <span className="lbl">Analyze</span>
          </a>

          <a
            href="#report"
            id="n-report"
            className={currentPage === 'report' ? 'on' : ''}
            aria-disabled={!reportData}
            onClick={(e) => {
              e.preventDefault();
              if (reportData) navigateTo('report');
            }}
            title="Report"
          >
            <span className="ic" aria-hidden="true">
              ▤
            </span>
            <span className="lbl">
              Report
              <small id="n-sub">{reportData ? '1 report ready' : 'Run an analysis first'}</small>
            </span>
            {reportData && <span className="dot" aria-hidden="true" />}
          </a>

          <a
            href="#guide"
            id="n-guide"
            className={currentPage === 'guide' ? 'on' : ''}
            onClick={(e) => {
              e.preventDefault();
              navigateTo('guide');
            }}
            title="Guide"
          >
            <span className="ic" aria-hidden="true">
              ?
            </span>
            <span className="lbl">Guide</span>
          </a>

          <span className="sp" />
          <p>Files stay in memory and are never stored.</p>
        </nav>

        {/* 3. Main Content Views */}
        <main className="main-content">
          {/* VIEW A: ANALYZE BENCH */}
          {currentPage === 'analyze' && !isBusy && (
            <section className="page on" id="p-analyze">
              <div className="top">
                <div>
                  <h1>Match a resume to a role</h1>
                  <p>Add your PDF, choose what you’re applying for, and see your score.</p>
                </div>
                <button className="btn" id="sample" onClick={loadSampleResume}>
                  Try a sample resume
                </button>
              </div>

              <div className="bench">
                {/* Pane 1: Resume Upload */}
                <div className="pane">
                  <h2>1. Resume</h2>
                  <p className="s">PDF, up to 10 MB</p>

                  {!file ? (
                    <label
                      className={`drop ${isDragOver ? 'over' : ''}`}
                      id="drop"
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                    >
                      <div>
                        <b>Drop your PDF here</b>
                        <span>or press Enter to browse</span>
                      </div>
                      <input
                        ref={fileInputRef}
                        id="file"
                        type="file"
                        accept="application/pdf"
                        aria-label="Upload resume PDF"
                        onChange={(e) => handleFileChange(e.target.files?.[0])}
                      />
                    </label>
                  ) : (
                    <div className="fcard" id="fcard">
                      <div className="ic">PDF</div>
                      <div className="n" id="fn">
                        {file.name}
                        <small>{Math.max(1, Math.round((file.size || 184320) / 1024))} KB</small>
                      </div>
                      <button
                        className="btn btn-sm"
                        id="replace"
                        onClick={() => {
                          fileInputRef.current?.click();
                        }}
                      >
                        Replace
                      </button>
                      <button className="btn btn-sm" id="remove" onClick={clearFile}>
                        Remove
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => handleFileChange(e.target.files?.[0])}
                      />
                    </div>
                  )}

                  {fileError && (
                    <div className="err" id="err" role="alert">
                      {fileError}
                    </div>
                  )}
                </div>

                {/* Pane 2: Target Selector */}
                <div className="pane">
                  <h2>2. Target</h2>
                  <p className="s">Pick a role, or paste the exact job description.</p>

                  <div className="seg" role="group" aria-label="Target type">
                    <button
                      id="t-role"
                      aria-pressed={targetMode === 'role'}
                      onClick={() => setTargetMode('role')}
                    >
                      Role
                    </button>
                    <button
                      id="t-jd"
                      aria-pressed={targetMode === 'jd'}
                      onClick={() => setTargetMode('jd')}
                    >
                      Job description
                    </button>
                  </div>

                  {targetMode === 'role' ? (
                    <div id="rolebox">
                      <input
                        type="search"
                        id="rq"
                        value={roleSearch}
                        onChange={(e) => setRoleSearch(e.target.value)}
                        placeholder={`Search ${ROLES.length} roles`}
                        aria-label="Search roles"
                      />
                      <div className="roles" id="roles" role="group" aria-label="Roles">
                        {ROLES.filter((r) => r.toLowerCase().includes(roleSearch.toLowerCase())).map((r) => (
                          <button
                            key={r}
                            className="rc"
                            aria-pressed={r === selectedRole}
                            onClick={() => setSelectedRole(r)}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <textarea
                      id="jd"
                      value={customJd}
                      onChange={(e) => setCustomJd(e.target.value)}
                      placeholder="Paste the full job description"
                      aria-label="Job description"
                    />
                  )}
                </div>
              </div>

              {/* Sticky Runbar */}
              <div className="runbar">
                <span id="rtxt">
                  {!file
                    ? 'Add a resume to begin'
                    : targetMode === 'jd' && customJd.trim().length <= 30
                    ? 'Paste a longer job description'
                    : `${file.name} → ${targetLabel}`}
                </span>
                <button className="btn btn-primary" id="go" disabled={!isFormValid} onClick={startAnalysis}>
                  Calculate match
                </button>
              </div>
            </section>
          )}

          {/* VIEW B: RUNNING STEPPER */}
          {(currentPage === 'run' || isBusy) && (
            <section className="page on" id="p-run">
              <div className="top">
                <div>
                  <h1>Analyzing your resume</h1>
                  <p id="rfile">{file?.name} → {targetLabel}</p>
                </div>
                <button className="btn" id="cancel" onClick={cancelAnalysis}>
                  Cancel
                </button>
              </div>

              <div className="stepper" id="stepper">
                {STEPS.map((s, idx) => (
                  <div
                    key={s}
                    className={`st ${idx < currentStep ? 'done' : idx === currentStep ? 'run' : ''}`}
                    id={`st${idx}`}
                  >
                    {s}
                  </div>
                ))}
              </div>

              <p className="note" id="rstat" role="status" aria-live="polite">
                {runStatus}
              </p>

              {runError && (
                <div className="err" id="rerr" role="alert">
                  <span id="rmsg">{runError}</span>{' '}
                  <button className="btn btn-sm" id="retry" onClick={startAnalysis}>
                    Try again
                  </button>
                </div>
              )}
            </section>
          )}

          {/* VIEW C: REPORT */}
          {currentPage === 'report' && reportData && currentFactors && !isBusy && (
            <section className="page on" id="p-report">
              <div className="print-h">
                MatchCraft AI report: {reportData.name} → {reportData.target}
              </div>

              <div className="top">
                <div>
                  <h1>Your report</h1>
                  <p>
                    {reportData.name} → {reportData.target}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    className="btn"
                    id="again"
                    onClick={() => {
                      clearFile();
                      navigateTo('analyze');
                    }}
                  >
                    Upload revised resume
                  </button>
                  <button className="btn btn-primary" onClick={() => window.print()}>
                    Download PDF
                  </button>
                </div>
              </div>

              {reportData.sample && (
                <div className="demo">
                  Sample report: numbers are simulated for demonstration. Connect your API or upload a full resume for real assessment.
                </div>
              )}

              {/* Strip Score Hero */}
              <div className="pane strip">
                <div>
                  <div className="big" style={{ color: colT(currentFactors.total) }}>
                    {currentFactors.total}
                  </div>
                  <div style={{ fontWeight: 600, marginTop: 6 }}>ATS match</div>
                </div>

                <div>
                  <div className="arrow">
                    <span>{Math.round(currentFactors.total)}</span>
                    <span aria-hidden="true">→</span>
                    <b style={{ color: 'var(--goodt)' }}>~{topProjectedScore}</b>
                    <span style={{ fontSize: 16, color: 'var(--mute)', fontWeight: 400 }}>
                      estimated after the top {topFixes.length} fixes
                    </span>
                  </div>
                  <p className="note">
                    ATS match estimates how well an applicant tracking system would rank this resume for the role (0–100). Below 50 usually means filtered out early.
                    {scoreDelta !== null && ` Previous upload (${previousRun.name}): ${previousRun.score}, now ${scoreDelta >= 0 ? '+' : ''}${scoreDelta}.`}
                  </p>
                </div>
              </div>

              {/* Do these first: Interactive Fixes */}
              <div className="pane" style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                  <div>
                    <h2>Do these first</h2>
                    <p className="s" style={{ margin: '0 0 14px' }}>
                      Tick fixes to estimate their combined effect. Overlaps aren’t double counted.
                    </p>
                  </div>
                  <button className="btn btn-sm" id="copy" onClick={copyChecklist}>
                    {copyFeedback}
                  </button>
                </div>

                {topFixes.length > 0 ? (
                  topFixes.map((f) => (
                    <label key={f.id} className="fix">
                      <input
                        type="checkbox"
                        checked={checkedFixes.has(f.id)}
                        onChange={() => toggleFix(f.id)}
                      />
                      <span>{f.text}</span>
                      <b>~+{f.gain}</b>
                    </label>
                  ))
                ) : (
                  <p>No fixes needed. Nice work.</p>
                )}

                {restFixes.length > 0 && (
                  <details>
                    <summary>
                      {restFixes.length} more fix{restFixes.length > 1 ? 'es' : ''}
                    </summary>
                    <div style={{ marginTop: 10 }}>
                      {restFixes.map((f) => (
                        <label key={f.id} className="fix">
                          <input
                            type="checkbox"
                            checked={checkedFixes.has(f.id)}
                            onChange={() => toggleFix(f.id)}
                          />
                          <span>{f.text}</span>
                          <b>~+{f.gain}</b>
                        </label>
                      ))}
                    </div>
                  </details>
                )}

                <p style={{ margin: '12px 0 0', fontWeight: 600 }}>
                  Estimated score with ticked fixes:{' '}
                  <span id="pj" style={{ color: 'var(--goodt)' }}>
                    {checkedFixes.size > 0 ? `~${Math.round(projectedScore)}` : Math.round(currentFactors.total)}
                  </span>{' '}
                  <span className="note" id="pjn" style={{ display: 'inline' }}>
                    {checkedFixes.size > 0
                      ? `(estimate, ${checkedFixes.size} fix${checkedFixes.size > 1 ? 'es' : ''} ticked)`
                      : '(none ticked)'}
                  </span>
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="tabs" role="tablist" aria-label="Report details">
                {['Score breakdown', 'Skills', 'Sections', 'Coach'].map((t, i) => (
                  <button
                    key={t}
                    role="tab"
                    id={`tb${i}`}
                    aria-controls={`tp${i}`}
                    aria-selected={activeTab === i}
                    onClick={() => setActiveTab(i)}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* TAB 0: SCORE BREAKDOWN */}
              {activeTab === 0 && (
                <div className="pane" role="tabpanel" id="tp0" aria-labelledby="tb0">
                  <h2>Where your points come from</h2>
                  <p className="s">Points earned out of the most each factor can add.</p>
                  <div className="two">
                    <div>
                      {currentFactors.F.map((f) => {
                        const earned = Math.round((f[1] * f[2]) / 100);
                        return (
                          <div key={f[0]} className="pts">
                            <div>
                              <span>
                                {f[0]}{' '}
                                <span style={{ color: 'var(--mute)', fontWeight: 400 }}>
                                  · {f[2]}% weight
                                </span>
                              </span>
                              <span>
                                {earned} / {f[2]}
                              </span>
                            </div>
                            <div className="trk">
                              <i style={{ width: `${f[1]}%`, background: colB(f[1]) }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <RadarChart factorsList={currentFactors.F} />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 1: SKILLS */}
              {activeTab === 1 && (
                <div className="pane" role="tabpanel" id="tp1" aria-labelledby="tb1">
                  <h2>Skills</h2>
                  <p className="s">
                    <span className="tag tag-match">{matchedSkillsCount} matched</span>
                    <span className="tag tag-partial">{partialSkillsCount} partial</span>
                    <span className="tag tag-miss">{missingSkillsCount} missing</span>
                  </p>
                  <div className="flt" id="flt" role="group" aria-label="Filter skills">
                    {[
                      ['all', 'All'],
                      ['miss', 'Missing'],
                      ['partial', 'Partial'],
                      ['match', 'Matched']
                    ].map(([fKey, fLabel]) => (
                      <button
                        key={fKey}
                        aria-pressed={skillFilter === fKey}
                        onClick={() => setSkillFilter(fKey)}
                      >
                        {fLabel}
                      </button>
                    ))}
                  </div>

                  <div id="heat">
                    {skillDomains.map((d) => {
                      const filteredSkills = reportData.skills.filter(
                        (x) => x.d === d && (skillFilter === 'all' || x.s === skillFilter)
                      );
                      if (!filteredSkills.length) return null;
                      return (
                        <div key={d} className="heat">
                          <h4>{d}</h4>
                          <div>
                            {filteredSkills.map((x) => (
                              <span key={x.n} className={`tag tag-${x.s}`}>
                                {x.s === 'match' ? '✓ Found' : x.s === 'partial' ? '~ Partial' : '✕ Missing'}: {x.n}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: SECTIONS AUDIT */}
              {activeTab === 2 && (
                <div className="pane" role="tabpanel" id="tp2" aria-labelledby="tb2">
                  <h2>Section audit</h2>
                  <p className="s">
                    {Object.values(reportData.sections).filter(Boolean).length} present,{' '}
                    {Object.values(reportData.sections).filter((v) => !v).length} missing
                  </p>
                  <div>
                    {SECS.map((s) => (
                      <span
                        key={s}
                        className={`tag ${reportData.sections[s] ? 'tag-match' : 'tag-miss'}`}
                      >
                        {reportData.sections[s] ? '✓ Found' : '✕ Missing'}: {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: COACH */}
              {activeTab === 3 && (
                <div className="pane" role="tabpanel" id="tp3" aria-labelledby="tb3">
                  <h2>Coach</h2>
                  <p className="s">Built from the skills you’re missing.</p>
                  {missingSkillsList.length > 0 ? (
                    <>
                      <h3 style={{ fontSize: 16 }}>Interview practice</h3>
                      <ul className="l">
                        {missingSkillsList.slice(0, 3).map((x) => (
                          <li key={x.n}>
                            Describe a time you used {x.n}. What would you do differently?
                          </li>
                        ))}
                      </ul>

                      <h3 style={{ fontSize: 16, marginTop: 18 }}>Project ideas</h3>
                      <ul className="l">
                        {[...new Set(missingSkillsList.map((x) => x.d))].slice(0, 3).map((d) => (
                          <li key={d}>
                            A small {d.toLowerCase()} project using{' '}
                            {missingSkillsList
                              .filter((x) => x.d === d)
                              .map((x) => x.n)
                              .join(' and ')}
                            , with a public GitHub link.
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p>You cover every required skill. Focus on the fixes above.</p>
                  )}
                </div>
              )}
            </section>
          )}

          {/* VIEW D: GUIDE */}
          {currentPage === 'guide' && (
            <section className="page on" id="p-guide">
              <div className="top">
                <div>
                  <h1>How MatchCraft works</h1>
                  <p>One score, a short list of fixes, and a way to check they worked.</p>
                </div>
                <a
                  className="btn btn-primary"
                  href="#analyze"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('analyze');
                  }}
                >
                  Start an analysis
                </a>
              </div>

              <div className="guide">
                <div className="pane">
                  <h2>The score</h2>
                  <p className="s">
                    0.4 × Skills + 0.2 × Experience + 0.1 × Education + 0.2 × Keywords + 0.1 × Formatting
                  </p>
                  <ul className="l">
                    <li>
                      <b>ATS match</b> estimates how well an applicant tracking system would rank your resume for the target, from 0 to 100.
                    </li>
                    <li>
                      <b>Fixes</b> are estimates. We recalculate the score with the fixes applied together, so overlapping fixes aren’t double counted.
                    </li>
                    <li>
                      <b>Compare</b> by uploading a revised resume. Your previous score from this session is shown.
                    </li>
                  </ul>
                </div>

                <div className="pane" id="faq">
                  <h2>Questions</h2>
                  <p className="s">&nbsp;</p>
                  <details>
                    <summary>Is my resume stored?</summary>
                    <p>No. The PDF is processed in memory and discarded after the analysis.</p>
                  </details>
                  <details>
                    <summary>What if I have no job description?</summary>
                    <p>Choose a role and a typical job description is used for it.</p>
                  </details>
                  <details>
                    <summary>Which files can I upload?</summary>
                    <p>PDF files up to 10 MB.</p>
                  </details>
                  <details>
                    <summary>Can I download the report?</summary>
                    <p>Yes. Use Download PDF on the report page; it prints the full report.</p>
                  </details>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* 4. Footer */}
      <footer className="foot">
        <div className="cols">
          <div>
            <div className="brand" style={{ padding: 0, color: 'var(--ink)' }}>
              <i>✦</i>MatchCraft AI
            </div>
            <p>Check how an applicant tracking system reads your resume, then fix what holds it back.</p>
          </div>
          <div>
            <h3>Product</h3>
            <a
              href="#analyze"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('analyze');
              }}
            >
              Analyze a resume
            </a>
            <a
              href="#guide"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('guide');
              }}
            >
              How it works
            </a>
            <a
              href="#faq"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('guide');
                setTimeout(() => {
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                }, 150);
              }}
            >
              FAQ
            </a>
          </div>
          <div>
            <h3>Privacy</h3>
            <ul>
              <li>Processed in memory</li>
              <li>No database</li>
              <li>Files are never stored</li>
            </ul>
          </div>
          <div>
            <h3>Built with</h3>
            <ul>
              <li>FastAPI and Python</li>
              <li>React and Vite</li>
              <li>Gemini API and spaCy</li>
            </ul>
          </div>
        </div>
        <div className="base">
          <span>© 2026 MatchCraft AI. Open source.</span>
          <span>Scores are estimates, not hiring guarantees.</span>
        </div>
      </footer>
    </div>
  );
};

// 5-Axis SVG Radar Chart Component
function RadarChart({ factorsList }) {
  const cx = 130;
  const cy = 118;
  const R0 = 80;

  const pt = (i, v) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return [cx + ((R0 * v) / 100) * Math.cos(a), cy + ((R0 * v) / 100) * Math.sin(a)];
  };

  const polyPoints = factorsList.map((f, i) => pt(i, f[1]).join(',')).join(' ');

  return (
    <svg
      viewBox="0 0 260 240"
      width="100%"
      style={{ maxWidth: 280 }}
      role="img"
      aria-label={`Radar chart: ${factorsList.map((f) => f[0] + ' ' + f[1] + '%').join(', ')}`}
    >
      {[25, 50, 75, 100].map((lvl) => (
        <polygon
          key={lvl}
          points={factorsList.map((_, i) => pt(i, lvl).join(',')).join(' ')}
          fill="none"
          stroke="var(--line)"
        />
      ))}
      {factorsList.map((f, i) => {
        const p = pt(i, 122);
        return (
          <text key={f[0]} x={p[0]} y={p[1] + 4} textAnchor="middle" fontSize="12" fill="var(--mute)">
            {f[0]}
          </text>
        );
      })}
      <polygon
        points={polyPoints}
        fill="var(--acc)"
        fillOpacity="0.25"
        stroke="var(--acc)"
        strokeWidth="2"
      />
    </svg>
  );
}

export default WorkbenchPage;
