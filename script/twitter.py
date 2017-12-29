# -*- coding: utf-8 -*-
#!/usr/bin/python
import json, sys, tweepy, datetime
updatetime = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

result = [{"lastupdate": updatetime}]
count = 1

consumer_key = ""
consumer_secret = ""
access_token = ""
access_token_secret = ""

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api = tweepy.API(auth)

public_tweets = api.user_timeline('pso2_emg_hour',count="8")

# 直接抓推特内容，只获取包含#PSO2 Tag的4个紧急
for tweet in public_tweets:
    try:
        if (tweet.entities["hashtags"][0]["text"] == "PSO2"):
            if (count > 4):
                break
            text = tweet.text
            time = tweet.created_at+ datetime.timedelta(hours=9)
            hour = datetime.datetime.strftime(time,"%H")
            result.append({"time": hour, "text" : text})
            count = count + 1
    except:
        print ("there's no hashtags")
    
with open( sys.path[0] + '/twitter.json', 'w+b') as f:
	f.write(json.dumps(result, ensure_ascii=False).encode('utf-8'))
print ("Twitter EQ information has been get.")