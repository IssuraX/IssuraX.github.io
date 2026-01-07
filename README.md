# Portfolio Template (Static)

이 템플릿은 **HTML/CSS/JS 정적 사이트**로 구성되어 GitHub Pages에 바로 배포할 수 있습니다.

## 폴더 구조
- index.html : 메인
- projects/ : 프로젝트 상세 페이지
- css/style.css : 스타일
- js/main.js : 모바일 메뉴/연도 표시
- assets/ : PDF(이력서/경력기술서) 및 이미지 넣는 곳

## 커스터마이징 체크리스트
1) index.html
- 이름/소개/핵심역량(칩), 연락처 링크 수정
- Projects 카드 제목/요약/기간 수정

2) projects/*.html
- 문제/해결/결과 항목을 본인 경험으로 교체
- 수치(n%, n건 등) 실제 값으로 교체
- 스크린샷 자리: assets에 이미지 넣고 <img> 태그로 교체

3) assets/
- Resume.pdf, Career.pdf 등 넣고 링크 연결

## GitHub Pages 배포(추천)
1. GitHub에서 새 저장소 생성
   - 저장소 이름: **username.github.io** (username은 본인 GitHub 아이디)
2. 이 템플릿 파일을 저장소에 업로드(루트에 index.html이 있어야 함)
3. GitHub 저장소 → Settings → Pages
   - Build and deployment: **Deploy from a branch**
   - Branch: **main** / Folder: **/(root)** 선택 → Save
4. 몇 초 후 아래 주소로 접속
   - https://username.github.io

## 대안 배포
- Netlify: 드래그&드롭 업로드 가능
- Vercel: GitHub 연동 후 자동 배포 (정적 사이트도 가능)

