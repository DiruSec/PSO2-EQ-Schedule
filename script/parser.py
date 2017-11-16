# -*- coding: utf-8 -*-
#!/usr/bin/python
import urllib, urllib2, re, json, datetime, sys
from collections import OrderedDict
from bs4 import BeautifulSoup

# 确认是否有输入
try:
    if (sys.argv[1] == "nextweek"):
        parse = "nextweek"
except:
    parse = ""
# 读取紧急网页
try:
    if (parse == "nextweek"):
        content = urllib2.urlopen(url='http://pso2.jp/players/boost/?week=next')
    else:
        content = urllib2.urlopen(url='http://pso2.jp/players/boost/')
except:
    print("An error occured while getting webpage. \nParse progess interrupted.")
    sys.exit(0)
soup = BeautifulSoup(content, "html.parser")
table = soup.find("div", class_="eventTable--event")
day = soup.find("li", class_="pager--date").string

# 获取开始日期
time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
try:
    sypattern = re.compile(u'(.*/.*/.*)～')
    ymd = str(re.findall(sypattern,day)[0])
except:
    print ("Failed to get date.")
date = datetime.datetime.strptime(ymd,"%Y/%m/%d")

# 确认是否有第二周紧急
try:
    soup.find("li", class_="pager--next").a['href']
    nextweek = True
except:
    nextweek = False

# 初始化各种垃圾
result = OrderedDict()
result.update({"lastupdate": time})

def mainparser():
    count = 0
    daylist = ["wednesday1", "thursday", "friday", "saturday", "sunday", "monday", "tuesday", "wednesday2"]
    classtext = "t00m00"
    if (len(result) > 2):
        daylist.remove("wednesday1")
    # 貌似写在一行的话变量会相互影响？
    wednesday1 = []
    thursday = []
    friday = []
    saturday = []
    sunday = []
    monday = []
    tuesday = []
    wednesday2 = []
    while (count < 24):
        if (count < 10):
            hours = "t0"
        else:
            hours = "t"
        minscheck = 0

        while (minscheck <= 1):
            if (minscheck == 0):
                mins = "00"
            else:
                mins = "30"
            classtext = hours + str(count) + "m" + mins
            for index in daylist:
                tdclass = "day-" + index
                try:
                    if (len(list(table.find("tr", class_=classtext).find("td", class_=tdclass))) > 1):
                        data = []
                        try:
                            table.find("tr", class_=classtext).find("td", class_=tdclass)['rowspan']
                            start = table.find("tr", class_=classtext).find("td", class_=tdclass).dl.dd.contents[1]
                            end = table.find("tr", class_=classtext).find("td", class_=tdclass).dl.dd.contents[3]
                            data.append(start + end)
                        except:
                            data.append(str(count) + ":" + mins)
                        if (len(table.find("tr", class_=classtext).find("td", class_=tdclass).find_all("div")) > 1):
                            data.append(table.find("tr", class_=classtext).find("td", class_=tdclass).find("div", class_="event-emergency").dl.dt.string)
                            data.append(table.find("tr", class_=classtext).find("td", class_=tdclass).find("div", class_="event-emergency").dl.dd.next_sibling.string)
                        else:
                            data.append(table.find("tr", class_=classtext).find("td", class_=tdclass).dl.dt.string)
                            data.append(table.find("tr", class_=classtext).find("td", class_=tdclass).dl.dd.next_sibling.string)
                        locals()[index].append(data)
                except:
                    print ("No section at " + index +"@" + classtext)
            minscheck = minscheck + 1
        count = count + 1
    # 向result dic内写数据
    for index in daylist:
        global date
        outdate = date.strftime("%Y/%m/%d")
        result.update({outdate: locals()[index]})
        date = date + datetime.timedelta(days=1)

mainparser()
if (nextweek == True):
    print ("Start parsing week 2.")
    try:
        content = urllib2.urlopen(url='http://pso2.jp/players/boost/?week=next')
    except:
        print("An error occured while getting 2nd week webpage. \nParse progess interrupted.")
        sys.exit(0)
    soup = BeautifulSoup(content, "html.parser")
    table = soup.find("div", class_="eventTable--event")
    day = soup.find("li", class_="pager--date").string
    mainparser()

# 将数据保存到外部文件
with open( sys.path[0] + '/schedule.json', 'w+b') as f:
    f.write(json.dumps(result, ensure_ascii=False).encode('utf-8'))
print ("Parse finished.")