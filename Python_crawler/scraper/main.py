# playwright의 동기 API를 사용하여 크롤링 작업을 진행합니다.
from playwright.sync_api import sync_playwright
import pandas as pd  # pandas를 사용하여 데이터를 DataFrame 형식으로 변환하고 저장합니다.
import time

# 넥슨 채용 정보를 크롤링하는 함수 정의
def scrape_nexon_jobs():
    # Playwright를 사용하여 브라우저를 시작합니다.
    with sync_playwright() as p:
        # 크롬 브라우저를 헤드리스 모드가 아닌 상태로 실행합니다.
        browser = p.chromium.launch(headless=False)
        # 새 페이지를 엽니다.
        page = browser.new_page()
        # 넥슨 채용 사이트로 이동합니다.
        page.goto("https://careers.nexon.com/recruit")
        
        last_height = page.evaluate("document.body.scrollHeight")
        while True:
            # 페이지를 조금씩 스크롤 내리기
            page.evaluate("window.scrollTo(0, document.body.scrollHeight - 1000)")  # 200px 만큼 내리기
            time.sleep(2)  # 페이지 로딩 대기

            # 새로운 높이가 이전 높이와 같다면 끝에 도달한 것입니다.
            new_height = page.evaluate("document.body.scrollHeight")
            if new_height == last_height:
               break
            last_height = new_height

        # 채용 공고 목록이 로드될 때까지 기다립니다.
        page.wait_for_selector("a[href^='/recruit/']")

        # 채용 공고들을 저장할 빈 리스트를 초기화합니다.
        jobs = []

        # 모든 채용 공고 요소를 선택합니다.
        items = page.query_selector_all("a[href^='/recruit/']")
        
        # 각 채용 공고 항목에 대해 반복하면서 정보를 추출합니다.
        for item in items:
            # 공고의 링크를 가져옵니다.
            link = item.get_attribute("href")
            # 전체 URL을 생성합니다.
            full_link = f"https://careers.nexon.com{link}"

            # 공고 제목을 추출합니다.
            title_elem = item.query_selector("h4")
            title = title_elem.inner_text().strip() if title_elem else ""

            # 회사명을 추출합니다.
            company_elem = item.query_selector(".text-company")
            company = company_elem.inner_text().strip() if company_elem else ""

            # 마감일을 추출합니다.
            deadline_elem = item.query_selector(".d-day")
            deadline = deadline_elem.inner_text().strip() if deadline_elem else ""

            # 추출한 정보를 딕셔너리로 저장하고, jobs 리스트에 추가합니다.
            jobs.append({
                "제목": title,
                "회사명": company,
                "마감일": deadline,
                "링크": full_link
            })

        # 브라우저를 닫습니다.
        browser.close()

        # 수집한 채용 공고 정보를 반환합니다.
        return jobs

# 함수 실행하여 채용 정보 리스트를 가져옵니다.
job_list = scrape_nexon_jobs()

# 가져온 정보를 pandas DataFrame으로 변환합니다.
df = pd.DataFrame(job_list)

# DataFrame을 CSV 파일로 저장합니다. 한글이 깨지지 않도록 utf-8-sig 인코딩을 사용합니다.
df.to_csv("scraper/output/nexon_jobs.csv", index=False, encoding="utf-8-sig")

# 저장된 데이터를 콘솔에 출력하여 확인합니다.
print(df)
