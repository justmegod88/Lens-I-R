import React, { useMemo, useState } from 'react';
import CameraCoach from './components/CameraCoach';
import { CARE_RULES, INSERTION_STEPS, REMOVAL_STEPS, SAFETY_RED_FLAGS, Step } from './content';

type Mode = '착용' | '제거' | '관리';

function StepCard({ step }: { step: Step }) {
  return (
    <div className="card">
      <h3 className="h3">{step.title}</h3>
      {step.whyItMatters && <p className="muted">{step.whyItMatters}</p>}
      <ul className="list">
        {step.checklist.map((c, i) => <li key={i}>{c}</li>)}
      </ul>
      {step.tips && step.tips.length > 0 && (
        <div className="tip">
          <strong>팁</strong>
          <ul className="list">
            {step.tips.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      )}
      {step.warning && (
        <div className="warn">
          <strong>주의</strong>
          <div>{step.warning}</div>
        </div>
      )}
    </div>
  );
}

function SafetyBox() {
  return (
    <div className="card danger">
      <h3 className="h3">🚨 바로 중단하고 상담이 필요한 경우</h3>
      <ul className="list">
        {SAFETY_RED_FLAGS.map((x, i) => <li key={i}>{x}</li>)}
      </ul>
      <div className="muted small">
        이 앱은 교육용 도구이며, 의료적 진단/치료를 대체하지 않습니다.
      </div>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState<Mode>('착용');
  const [idx, setIdx] = useState(0);
  const [snapshot, setSnapshot] = useState<string | null>(null);

  const steps = useMemo(() => {
    if (mode === '착용') return INSERTION_STEPS;
    if (mode === '제거') return REMOVAL_STEPS;
    return [];
  }, [mode]);

  // reset step index when changing mode
  function switchMode(m: Mode) {
    setMode(m);
    setIdx(0);
  }

  const current = steps[idx];

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 className="h1">콘택트렌즈 첫 착용 코치 (웹앱 · 카메라 포함)</h1>
          <p className="muted">
            혼자서도 따라 할 수 있게 “단계별 코칭”으로 구성했어요. 불편/통증이 있으면 무리하지 말고 전문가에게 상담하세요.
          </p>
        </div>
      </header>

      <nav className="tabs">
        {(['착용','제거','관리'] as Mode[]).map(m => (
          <button
            key={m}
            className={`tab ${mode === m ? 'active' : ''}`}
            onClick={() => switchMode(m)}
          >
            {m}
          </button>
        ))}
      </nav>

      <main className="grid">
        <section>
          <SafetyBox />

          {mode !== '관리' && current && (
            <>
              <div className="card">
                <div className="row space-between">
                  <div className="muted small">진행 {idx + 1} / {steps.length}</div>
                  <div className="row gap">
                    <button className="btn ghost" onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}>
                      이전
                    </button>
                    <button className="btn" onClick={() => setIdx(i => Math.min(steps.length - 1, i + 1))} disabled={idx === steps.length - 1}>
                      다음
                    </button>
                  </div>
                </div>
              </div>

              {current.id === 'camera-align' ? (
                <>
                  <CameraCoach onSnapshot={setSnapshot} />
                  {snapshot && (
                    <div className="card">
                      <h3 className="h3">스냅샷(로컬)</h3>
                      <p className="muted small">
                        스냅샷은 당신의 기기 안에서만 생성됩니다(서버 업로드 없음). 필요 없으면 새로고침하거나 이미지 삭제를 눌러주세요.
                      </p>
                      <img className="snapshot" src={snapshot} alt="snapshot" />
                      <div className="row gap">
                        <button className="btn ghost" onClick={() => setSnapshot(null)}>이미지 삭제</button>
                        <a className="btn ghost" href={snapshot} download="snapshot.png">다운로드</a>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <StepCard step={current} />
              )}

              <div className="card">
                <h3 className="h3">문제 해결 (빠른 선택)</h3>
                <div className="chips">
                  {[
                    { label: "눈이 자꾸 감겨요", tip: "속눈썹 라인 근처를 잡아 '위·아래 눈꺼풀'을 확실히 고정하고, 렌즈는 가볍게 터치해요." },
                    { label: "렌즈가 뒤집힌 것 같아요", tip: "컵 모양인지 확인해요. 가장자리가 바깥으로 퍼져 보이면 뒤집혔을 수 있어요." },
                    { label: "너무 무서워요", tip: "한쪽 눈만, 1~2회 짧게 연습해요. 손가락이 눈에 닿는 느낌을 '가볍게' 익히는 것이 먼저예요." },
                    { label: "이물감이 계속돼요", tip: "즉시 빼고(손 씻기), 렌즈 손상/이물/뒤집힘을 확인하고 용액으로 헹궈 다시 시도해요. 지속되면 중단." },
                  ].map((x, i) => (
                    <details key={i} className="chip">
                      <summary>{x.label}</summary>
                      <div className="muted">{x.tip}</div>
                    </details>
                  ))}
                </div>
              </div>
            </>
          )}

          {mode === '관리' && (
            <>
              <div className="card">
                <h3 className="h3">기본 안전 수칙</h3>
                <ul className="list">
                  {CARE_RULES.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
              <div className="card">
                <h3 className="h3">물과 렌즈는 분리!</h3>
                <p className="muted">
                  샤워/수영/온천/수돗물은 감염 위험을 높일 수 있어요. 렌즈를 물로 헹구거나 보관하지 마세요.
                </p>
              </div>
            </>
          )}
        </section>

        <aside className="card">
          <h3 className="h3">설정/배포 메모</h3>
          <ol className="list">
            <li>이 앱은 “서버 없이” 동작하도록 만들었습니다(정적 배포 가능).</li>
            <li>GitHub Pages 배포 시 <code>vite.config.ts</code>의 <code>base</code>를 <code>/{'{'}REPO_NAME{'}'}/</code>로 바꿔주세요.</li>
            <li>카메라 사용은 HTTPS에서만 잘 동작합니다(로컬 dev는 예외).</li>
          </ol>
          <div className="divider" />
          <h3 className="h3">면책</h3>
          <p className="muted small">
            본 앱은 교육·가이드 목적이며, 의료적 진단/치료를 제공하지 않습니다. 증상이 있으면 즉시 렌즈를 제거하고 전문가에게 상담하세요.
          </p>
        </aside>
      </main>

      <footer className="footer muted small">
        © {new Date().getFullYear()} Contact Lens Coach. (교육용)
      </footer>
    </div>
  );
}
