import asyncio  # 비동기 처리를 위한 표준 라이브러리
from playwright.async_api import async_playwright  # Playwright 비동기 버전
import csv  # CSV 파일 저장용

# KoBART 요약 모델을 위한 Hugging Face 라이브러리
from transformers import PreTrainedTokenizerFast, BartForConditionalGeneration

# ▶ 요약 모델 로드 (KoBART 사전학습 모델 및 토크나이저)
tokenizer = PreTrainedTokenizerFast.from_pretrained("digit82/kobart-summarization")
model = BartForConditionalGeneration.from_pretrained("digit82/kobart-summarization")


# ▶ 긴 텍스트를 요약하는 함수 정의
def summarize_korean_article(text):
    if len(text) > 1024:
        text = text[:1024]  # 입력 길이가 모델 허용 범위 초과 시 자르기
    inputs = tokenizer(
        [text], max_length=1024, return_tensors="pt", truncation=True
    )  # 토큰화
    summary_ids = model.generate(  # 요약 생성
        inputs["input_ids"],
        max_length=128,
        min_length=10,
        length_penalty=2.0,
        num_beams=4,
        early_stopping=True,
    )
    return tokenizer.decode(summary_ids[0], skip_special_tokens=True)  # 토큰 → 문장


# ▶ 크롤링 대상 키워드 정의
TARGET_KEYWORDS = [
    "삼성전자",
    "카카오",
    "네이버",
    "SKT",
    "하락",
    "상승",
    "한은",
    "삼성",
    "LG",
]

# ▶ CSV 저장 파일명 및 병렬 처리 제한 수
CSV_FILE = "naver_economy_with_summary.csv"
MAX_CONCURRENT = 5  # 동시에 열 수 있는 기사 수 제한


# ▶ 각 뉴스 기사에 대해 처리하는 함수 (비동기)
async def process_article(context, link, writer, sem):
    async with sem:  # 세마포어로 동시에 MAX_CONCURRENT개만 실행되도록 제어
        page = await context.new_page()  # 새 브라우저 탭 열기
        try:
            await page.goto(link, timeout=10000)  # 기사 페이지 접속 (최대 10초 대기)
            await page.wait_for_selector(
                "#dic_area, #newsct_article", timeout=5000
            )  # 본문 로딩 대기

            title = await page.title()  # 기사 제목 추출

            # ▶ 본문 텍스트 추출 (PC/Mobile 구조 모두 대응)
            try:
                content = await page.inner_text("#dic_area")
            except:
                try:
                    content = await page.inner_text("#newsct_article")
                except:
                    content = ""  # 본문이 아예 없을 경우 빈 문자열

            # ▶ 날짜 정보 추출
            try:
                date = await page.inner_text("span.t11")  # PC 구조
            except:
                try:
                    date = await page.inner_text(
                        "span.media_end_head_info_datestamp_time"
                    )  # 모바일 구조
                except:
                    date = "날짜 없음"

            # ▶ 제목이나 본문에 키워드 포함 여부 확인
            if any(keyword in (title + content) for keyword in TARGET_KEYWORDS):
                summary = summarize_korean_article(content)  # 요약 생성
                writer.writerow(
                    [title.strip(), link, date.strip(), summary.strip()]
                )  # CSV 저장
                print(f"✅ 저장 완료: {title}")
            else:
                print(f"❎ 키워드 미포함 → {title}")

        except Exception as e:
            print(f"⚠️ 에러 발생: {e} / 링크: {link}")
        finally:
            await page.close()  # 브라우저 탭 닫기


# ▶ 전체 뉴스 페이지를 크롤링하고 각 기사 처리하는 메인 함수
async def scrape_naver_news():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)  # 브라우저 실행 (화면 없이)
        context = await browser.new_context()
        page = await context.new_page()

        # ▶ 네이버 경제 뉴스 목록 페이지 접속
        await page.goto(
            "https://news.naver.com/main/list.naver?mode=LSD&mid=sec&sid1=101"
        )

        # ▶ 기사 링크들 추출 (이미지 없는 제목 링크만)
        article_links = await page.eval_on_selector_all(
            "ul.type06_headline li > dl > dt:not(.photo) > a",
            "elements => elements.map(el => el.href)",
        )

        print(f"🔗 수집된 기사 링크 수: {len(article_links)}")

        # ▶ 중복 링크 제거
        seen = set()
        # filtered_links = [
        #     link for link in article_links if link not in seen and not seen.add(link)
        # ]
        filtered_links = []
        for link in article_links:
            if link not in seen:
                seen.add(link)
                filtered_links.append(link)

        # ▶ 세마포어로 동시에 처리할 수 있는 기사 수 제한
        sem = asyncio.Semaphore(MAX_CONCURRENT)

        # ▶ CSV 파일 열고 저장 시작
        with open(CSV_FILE, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.writer(f)
            writer.writerow(["제목", "링크", "날짜", "요약"])  # 헤더

            # ▶ 각 기사 링크마다 처리 태스크 생성 → 동시에 실행
            tasks = [
                process_article(context, link, writer, sem) for link in filtered_links
            ]
            await asyncio.gather(*tasks)  # 모든 기사 병렬 처리

        await browser.close()  # 브라우저 종료
        print("🎉 크롤링 및 요약 완료!")


# ▶ 프로그램 실행 진입점
asyncio.run(scrape_naver_news())
