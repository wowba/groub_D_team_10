from selenium import webdriver

import time

from pymongo import MongoClient

# localhost 용 MongoDB 연결
client = MongoClient("localhost", 27017)

# DB 이름 team10
db = client.team10

# 크롤링 해야할 페이지들
links = ["https://iba-world.com/category/iba-cocktails/the-unforgettables/",
          "https://iba-world.com/category/iba-cocktails/contemporary-classics/",
          "https://iba-world.com/category/iba-cocktails/new-era-drinks/"]

for link in links:
    # 드라이버 실행
    driver = webdriver.Chrome()
    # 실행 옵션 설정
    driver.set_window_position(0, 0)
    driver.set_window_size(1920, 1080)
    # 링크 이동
    driver.get(link)
    driver.implicitly_wait(5)

    # 전체 페이지 내용 불러오기 위한 페이지 다운
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    # 페이지 이동을 위한 url을 list로 저장.
    drinks = driver.find_elements_by_class_name("entry-featured-image-url")

    # 페이지 이동 및 크롤링
    for drink in drinks:
        # 메모리 최적화를 위해 한 페이지마다 크롬드라이버 재실행
        link = drink.get_attribute("href")
        driver = webdriver.Chrome()
        driver.set_window_position(0, 0)
        driver.set_window_size(1920, 1080)
        driver.get(link)
        driver.implicitly_wait(5)
        try: # desc 에러 발생시 제외.
            name = driver.find_element_by_class_name("entry-title").text
            cocktail_class = driver.find_element_by_class_name(
                "et_pb_title_meta_container").text.replace("IBA COCKTAIL,", "")
            desc = driver.find_element_by_xpath("//meta[@property='og:description']").get_attribute("content").split("METHOD")
            ingredient = desc[0].replace("INGREDIENTS","")
            desc2 = desc[1].split("GARNISH")
            method = desc2[0]
            try: # split 에러 제거
                desc3 = desc2[1].split("HISTORY")
                garnish = desc3[0]
            except:
                garnish = desc2[1]
            imgsrc = driver.find_element_by_xpath("//meta[@property='og:image']").get_attribute("content")
            print(name)
            # db에 저장
            doc = {
                "name": name,
                "class": cocktail_class,
                "ingredient": ingredient,
                "method": method,
                "garnish": garnish,
                "imgsrc": imgsrc,
                "like": 0,
                "review": [],
                "stars" : [],
            }
            db.cocktails.insert_one(doc)

            driver.close()
            time.sleep(3)
        except:
            driver.close()
            time.sleep(3)

    print(link, "크롤링 끝")

print("전체 크롤링 끝")