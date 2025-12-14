import React, { useEffect, useRef, useState } from 'react';

type Props = {
  onSnapshot?: (dataUrl: string) => void;
};

export default function CameraCoach({ onSnapshot }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isOn, setIsOn] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [mirrored, setMirrored] = useState(true);

  async function start() {
    setError(null);
    try {
      // stop existing
      stop();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsOn(true);
    } catch (e: any) {
      setIsOn(false);
      setError(e?.message ?? '카메라를 켤 수 없어요. 권한을 확인해 주세요.');
    }
  }

  function stop() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsOn(false);
  }

  function takeSnapshot() {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (mirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/png');
    onSnapshot?.(dataUrl);
  }

  useEffect(() => {
    // restart camera when facing mode changes and camera is on
    if (isOn) start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  useEffect(() => {
    return () => stop();
  }, []);

  return (
    <div className="card">
      <div className="row space-between wrap">
        <div className="row gap">
          {!isOn ? (
            <button className="btn" onClick={start}>카메라 켜기</button>
          ) : (
            <button className="btn ghost" onClick={stop}>끄기</button>
          )}
          <button
            className="btn ghost"
            onClick={() => setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'))}
            disabled={!navigator.mediaDevices?.getUserMedia}
            title="전면/후면 전환"
          >
            전환
          </button>
          <button className="btn ghost" onClick={() => setMirrored(m => !m)}>
            {mirrored ? '미러 끄기' : '미러 켜기'}
          </button>
        </div>
        <div className="row gap">
          <button className="btn" onClick={takeSnapshot} disabled={!isOn}>스냅샷</button>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="cameraWrap">
        <video
          ref={videoRef}
          className={`video ${mirrored ? 'mirrored' : ''}`}
          playsInline
          muted
        />
        {/* Overlay guide */}
        <div className="overlay">
          <div className="guide">
            <div className="guideLabel">눈을 이 안에 맞춰주세요</div>
          </div>
        </div>
      </div>

      <div className="muted small">
        팁: 조명을 밝게 하고, 폰을 흔들리지 않게 고정하면 더 잘 보여요.
      </div>
    </div>
  );
}
