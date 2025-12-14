# Contact Lens Coach (Camera Web App)

소비자가 혼자서 콘택트렌즈를 착용/제거 연습할 수 있도록 만든 **단계형 가이드 + 카메라(미러/스냅샷) 포함** 웹앱입니다.

> ⚠️ 교육용 도구입니다. 통증/충혈/시야저하 등이 있으면 즉시 렌즈를 제거하고 전문가에게 상담하세요.

## 1) 로컬 실행

```bash
npm install
npm run dev
```

## 2) 빌드

```bash
npm run build
npm run preview
```

## 3) GitHub Pages 배포(정적)

Vite는 `dist/`를 만들어요. GitHub Pages는 정적 사이트로 배포 가능합니다.

1. `vite.config.ts`의 base를 레포명으로 변경:

```ts
export default defineConfig({
  base: '/<REPO_NAME>/',
})
```

2. 빌드 후 `dist/`를 Pages로 배포 (GitHub Actions 추천)

## 참고 근거(일반적 위생/안전 수칙)

- FDA: Contact Lens Wear and Care (손 씻기, 보풀 없는 수건으로 건조 등)
- AAO: How to Put In Contact Lenses
- CDC: Keep Water Away from Contact Lenses / Preventing Eye Infections When Wearing Contacts
- NHS(병원 안내): 렌즈 방향(컵 모양) 확인 등
- ACUVUE(브랜드 예시): 단계별 착용 가이드(손 씻기/렌즈 확인 등)

(이 앱은 위 자료들을 바탕으로 소비자 이해를 돕기 위한 “일반적인 안내” 형태로 구성되어 있습니다.)
