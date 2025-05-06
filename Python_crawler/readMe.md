# 네이버 뉴스 요약 크롤러 (Playwright + KoBART)

Python 기반의 이 프로젝트는 네이버 경제 뉴스 기사를 크롤링한 뒤,  
Hugging Face의 **KoBART 요약 LLM**을 사용하여 내용을 요약하고 CSV 파일로 저장합니다.

---

## 주요 기능

- Playwright를 이용한 **비동기 웹 크롤링**
- KoBART 모델로 **뉴스 본문 요약**
- 특정 키워드 포함 기사만 선별 저장
- 요약된 데이터 CSV 파일로 출력

---

## 설치 및 환경 설정

### 1️⃣ Python 버전 확인

> Python **3.10 권장**  
> (transformers 라이브러리는 3.12 이상에서 일부 설치 오류 발생 가능)

### 2️⃣ 가상환경 설정

```bash
# 가상환경 생성 (Windows 기준)
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate

pip install --upgrade pip

pip install playwright transformers torch sentencepiece
playwright install
