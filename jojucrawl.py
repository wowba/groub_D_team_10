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

page = 1

for link in links:
# 드라이버 실행
    print(page,"페이지 크롤링 시작...")
    driver = webdriver.Chrome()
    # 실행 옵션 설정
    driver.set_window_position(0, 0)
    driver.set_window_size(1920, 1080)
    # 링크 이동
    driver.get(link)
    driver.implicitly_wait(5)
    
    # 썸네일 링크 따오기
    thumbnails = driver.find_elements_by_class_name("board_list_type_thumbnail")
    links = []
    for thumbnail in thumbnails:
        link = thumbnail.find_element_by_tag_name("a").get_attribute("href")
        links.append(link)
    for link in links:
        driver = webdriver.Chrome()
        driver.set_window_position(0, 0)
        driver.set_window_size(1920, 1080)
        driver.get(link)
        driver.implicitly_wait(5)
        time.sleep(3)

        nametag = driver.find_element_by_class_name("board_read_header_title")
        name = nametag.find_element_by_tag_name("a").text

        cocktail_class = "조주기능사"

        ingredient_desc = driver.find_element_by_class_name("board_read_header_ext_eid_ext_recipe")
        ingredient = ingredient_desc.find_element_by_tag_name("dd").text

        method_desc = driver.find_element_by_class_name("board_read_header_ext_eid_ext_method")
        method = method_desc.find_element_by_tag_name("dd").text

        garnish_desc = driver.find_element_by_class_name("board_read_header_ext_eid_ext_garnish")
        garnish = garnish_desc.find_element_by_tag_name("dd").text

        imgsrc_desc = driver.find_element_by_class_name("board_read_autoview_image")
        imgsrc = imgsrc_desc.find_element_by_tag_name("img").get_attribute("src")

        doc = {
            "name": name,
            "class": cocktail_class,
            "ingredient": ingredient,
            "method": method,
            "garnish": garnish,
            "imgsrc": imgsrc,
            "like": 0,
            "review": [],
            "stars": [],
        }

        print(doc)
        db.cocktails.insert_one(doc)

    print(page, "페이지 크롤링 종료...")
    page = page + 1

print("종료")