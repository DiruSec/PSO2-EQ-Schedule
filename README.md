# PSO2-EQ-Schedule
An event parser and timetable for PSO2 JP server.

# Usage
## Overall
Does not support browser which is not support `HTML5` anymore.  
Use `crontab` under a linux-based OS to grab and parse information automatically (from offical site, of course), that's all.  
Python files was tested under Python 2.7.
## Schedule parser
Due to renewal of the schedule page, a new method was used to fetch EQ schedule.  
Which needs `BeautifulSoup` library.

## Random EQ parser
Requires `tweepy` library.  
You will need a valid Twitter API Key to get tweets posted by `@pso2_emg_hour`.  
Replace the dummy text with your API Key in `script/twitter.py`.

# Notice
This schedule does not have muiti-Language support.

# License
CC-BY-SA 4.0
