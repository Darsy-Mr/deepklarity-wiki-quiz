import requests
from bs4 import BeautifulSoup

def scrape_wikipedia(url: str):
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X)"
        }

        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        # Safe title extraction
        title_tag = soup.find("h1")
        title = title_tag.text.strip() if title_tag else "Unknown Title"

        # Safe paragraph extraction
        paragraphs = soup.find_all("p")
        content = " ".join(
            p.get_text(strip=True)
            for p in paragraphs
            if p.get_text(strip=True)
        )

        if not content:
            raise Exception("No content extracted from Wikipedia page")

        return {
            "title": title,
            "content": content
        }

    except Exception as e:
        print("SCRAPER ERROR:", e)
        raise
