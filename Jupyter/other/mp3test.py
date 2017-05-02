# youtube mp3 download test

import requests
import os
from bs4 import BeautifulSoup

playlist="https://www.youtube.com/playlist?list=PLm_3vnTS-pvl0nwpX1TiwlogaV_OlBkoJ"

res = requests.get(playlist)

soup = BeautifulSoup(res.text.encode("utf-8"),'html.parser')

mp3list = []
i=0
for line in soup.select('.pl-video-title-link'):
	# print(line['href'])
	url = 'www.youtube.com'+line['href'][:20] #取至第20字元(去除後面的list與index) 或使用split('&')分割字串
	# print(line.text.strip())
	title = line.text.strip()

	i=i+1
	mp3list.append([i,title,url])

# print('python youtube-mp3.py --autoend '+mp3list[0][2]+' "./'+mp3list[0][1]+'.mp3"')
# os.system('python youtube-mp3.py --autoend '+mp3list[0][2]+' "./'+mp3list[0][1]+'.mp3"')
	j=0
for song in mp3list:
	os.system('python youtube-mp3.py --autoend '+song[2]+' "./201705/'+song[1]+'.mp3"')
	print(song[0])
print('fin')

