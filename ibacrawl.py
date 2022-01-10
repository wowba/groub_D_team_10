from selenium import webdriver
from selenium.webdriver.common.keys import Keys

import time

from pymongo import MongoClient

# localhost 용 MongoDB 연결
client = MongoClient("localhost", 27017)

# DB 이름 team10
db = client.team10

# 드라이버 실행
driver = webdriver.Chrome()
driver.set_window_position(0, 0)
driver.set_window_size(1920, 1080)
# IBA 칵테일 사이트 들어가기

links = ["https://iba-world.com/category/iba-cocktails/the-unforgettables/",
         "https://iba-world.com/category/iba-cocktails/contemporary-classics/",
         "https://iba-world.com/category/iba-cocktails/new-era-drinks/"]

for link in links:
    driver.get(link)
    driver.implicitly_wait(5)

    # 클릭 설정
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    drinks = driver.find_elements_by_class_name("entry-featured-image-url")

    # 페이지 이동 및 크롤링
    for drink in drinks:
        link = drink.get_attribute("href")
        driver = webdriver.Chrome()
        driver.set_window_position(0, 0)
        driver.set_window_size(1920, 1080)
        driver.get(link)
        driver.implicitly_wait(5)

        name = driver.find_element_by_class_name("entry-title").text
        cocktail_class = driver.find_element_by_css_selector(
            "#main-content > div > div > div > div > div.et_pb_column.et_pb_column_1_2.et_pb_column_0_tb_body.et_pb_css_mix_blend_mode_passthrough > div > div > p > a:nth-child(2)").text
        ingredients = driver.find_element_by_css_selector(
            "#main-content > div > div > div > div > div.et_pb_column.et_pb_column_1_2.et_pb_column_1_tb_body.et_pb_css_mix_blend_mode_passthrough.et-last-child > div.et_pb_module.et_pb_post_content.et_pb_post_content_0_tb_body.blog-post-content > p:nth-child(2)").text
        method = driver.find_element_by_css_selector(
            "#main-content > div > div > div > div > div.et_pb_column.et_pb_column_1_2.et_pb_column_1_tb_body.et_pb_css_mix_blend_mode_passthrough.et-last-child > div.et_pb_module.et_pb_post_content.et_pb_post_content_0_tb_body.blog-post-content > p:nth-child(4)").text
        try:
            garnish = driver.find_element_by_css_selector(
                "#main-content > div > div > div > div > div.et_pb_column.et_pb_column_1_2.et_pb_column_1_tb_body.et_pb_css_mix_blend_mode_passthrough.et-last-child > div.et_pb_module.et_pb_post_content.et_pb_post_content_0_tb_body.blog-post-content > p:nth-child(6)").text
        except:
            garnish = driver.find_element_by_css_selector(
                "#main-content > div > div > div > div > div.et_pb_column.et_pb_column_1_2.et_pb_column_1_tb_body.et_pb_css_mix_blend_mode_passthrough.et-last-child > div.et_pb_module.et_pb_post_content.et_pb_post_content_0_tb_body.blog-post-content > p:nth-child(7)")
        imgsrc = driver.find_element_by_xpath("//meta[@property='og:image']").get_attribute("content")

        doc = {
            "name": name,
            "class": cocktail_class,
            "ingredients": ingredients,
            "method": method,
            "garnish": garnish,
            "imgsrc": imgsrc,
            "like": 0,
            "review": [],
            "stars": [],
        }
        print(name)
        driver.close()
        time.sleep(2)

    print(link, "크롤링 끝sdsdsdsd")

print("전체 크롤링 끝")