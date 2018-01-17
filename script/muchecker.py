# -*- coding: utf-8 -*-
#!/usr/bin/python3
import urllib, urllib.request, re, json, datetime, sys

time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
date = datetime.datetime.now().date()
year = datetime.datetime.now().strftime("%Y")

# 初始化dict
result = dict()
result.update({"lastupdate": time, "ismtnchanged": "false", "hasupdate": "false", "ismtncancelled": "false"})

# 抓维护时间变更/取消公告id
#    没抓到不管（判断item是否存在以防出错）
#    出错直接终止运行
#    没出错就传递id继续执行
try:
    response = urllib.request.urlopen(url='http://pso2.jp/players/news/maintenance/')
    content = response.read().decode('utf-8')
    pattern = re.compile('<a.*?news/(\d*)/"><span.*?title">(\d*)/(\d*).*?変更')
    item = re.findall(pattern,content)
    if (item):
        mtninfodate = datetime.datetime.strptime(year+"-"+item[0][1]+"-"+item[0][2], "%Y-%m-%d").date()
    cpattern = re.compile('<a.*?news/(\d*)/"><span.*?title">(\d*)/(\d*).*?休止')
    citem = re.findall(cpattern,content)
    if (citem):
        mtncanceldate = datetime.datetime.strptime(year+"-"+citem[0][1]+"-"+citem[0][2], "%Y-%m-%d").date()
except:
    print("An error occured while getting maintenance page.\nParse progess interrupted.")
    raise

# 获取维护取消详细
if (citem) and (date <= mtncanceldate):
    try:
        response = urllib.request.urlopen(url='http://pso2.jp/players/news/'+citem[0][0]+'/')
        content = response.read().decode('utf-8')
        pattern = re.compile('<p class="time f04">(.*?)年(.*?)月(.*?)日（.*?）(.*?) ～ (.*?)</p>',re.S)
        mcancel = re.findall(pattern,content)[0]
        mctime = datetime.datetime.strptime(mcancel[0]+"-"+mcancel[1]+"-"+mcancel[2], "%Y-%m-%d").date()
        if (date <= mctime):
            result.update({"ismtncancelled":"true"})
            result.update({"mtncanceldate": mcancel[0]+"-"+mcancel[1]+"-"+mcancel[2]})
    except:
        print("An error occured while getting maintenance cancel details. \nParse progess interrupted.")
        sys.exit(0)

# 获取维护时间变更详细
if (item) and (date <= mtninfodate):
    try:
        response = urllib.request.urlopen(url='http://pso2.jp/players/news/'+item[0][0]+'/')
        content = response.read().decode('utf-8')
        pattern = re.compile('<ul class="image">.*?<li>(.*?)月(.*?)日（.*?）(.*?) ～ (.*?)　→.*?<strong>(.*?)月(.*?)日（.*?）(.*?) ～ (.*?)</strong></li>',re.S)
        mchange = re.findall(pattern,content)[0]
        pattern2 = re.compile('<time datetime="">(.*?)/(.*?)/(.*?) (.*?):(.*?)</time>',re.S)
        mchange2 = re.findall(pattern2,content)[0]
        mtime = datetime.datetime.strptime(mchange2[0]+"-"+mchange[0]+"-"+mchange[1], "%Y-%m-%d").date()
        if (date <= mtime):
            result.update({"ismtnchanged":"true"})
            result.update({"mtndate": year+"-"+mchange[4]+"-"+mchange[5]})
            result.update({"mtnstart": mchange[6], "mtnend": mchange[7]})
    except:
        print("An error occured while getting maintenance time change details. \nParse progess interrupted.")
        sys.exit(0)

        
# 抓更新公告id
#    没抓到不管（判断item是否存在以防出错）
#    出错直接终止运行
#    没出错就传递id继续执行
try:
    response = urllib.request.urlopen(url='http://pso2.jp/players/news/information/')
    content = response.read().decode('utf-8')
    pattern = re.compile('<a.*?news/(\d*)/"><span.*?title">(\d*)/(\d*).*?“PC”.*?アップデート')
    item = re.findall(pattern,content)
    if (item):
        uinfodate = datetime.datetime.strptime(year+"-"+item[0][1]+"-"+item[0][2], "%Y-%m-%d").date()
except:
    print("An error occured while getting information page. \nParse progess interrupted.")
    sys.exit(0)

# 获取更新公告详细
if (item) and (date <= uinfodate):
    try:
        response = urllib.request.urlopen(url='http://pso2.jp/players/news/?id='+item[0][0])
        content = response.read().decode('utf-8')
        pattern = re.compile('<p>(\d*)年(\d*)月(\d*)日（.*?）の定期')
        updatetime = re.findall(pattern,content)[0]
        pattern = re.compile('空き容量が、約(.*?)必要')
        updatesize = re.findall(pattern,content)[0]
        utime = datetime.datetime.strptime(updatetime[0]+"-"+updatetime[1]+"-"+updatetime[2], "%Y-%m-%d").date()
        if (date <= utime):
            result.update({"hasupdate":"true"})
            result.update({"updatetime": updatetime[0]+"-"+updatetime[1]+"-"+updatetime[2]})
            result.update({"updatesize": updatesize})
    except:
        print("An error occured while getting update details. \nParse progess interrupted.")
        sys.exit(0)

with open( sys.path[0] + '/mtnupdate.json', 'w+b') as f:
    f.write(json.dumps(result, ensure_ascii=False).encode('utf-8'))
print ("Maintenance & Update information parse finished.")