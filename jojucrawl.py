from selenium import webdriver

import time

from pymongo import MongoClient

# localhost 용 MongoDB 연결
client = MongoClient("localhost", 27017)

# DB 이름 team10
db = client.team10

# 크롤링 해야할 페이지들
links = ["https://www.beveragemaster.kr/index.php?mid=license_practice&page=1",
          "https://www.beveragemaster.kr/index.php?mid=license_practice&page=2",
          "https://www.beveragemaster.kr/index.php?mid=license_practice&page=3",
         "https://www.beveragemaster.kr/index.php?mid=license_practice&page=4"]

for link in links:
# 드라이버 실행
    driver = webdriver.Chrome()
    # 실행 옵션 설정
    driver.set_window_position(0, 0)
    driver.set_window_size(1920, 1080)
    # 링크 이동
    driver.get(link)
    driver.implicitly_wait(5)