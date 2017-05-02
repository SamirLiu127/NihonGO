#!/usr/bin/env python
"""
youtube-mp3.org utility.

Usage: 
youtube-mp3.py [--autoend] [--chunk=<bytes>] <url> <path>

Examples:
  youtube-mp3.py --autoend https://www.youtube.com/watch?v=YE7VzlLtp-4 ./bunny.mp3

Options:
  -h, --help
  --autoend    auto append ".mp3" to the file if not present.
  --chunk=<bytes>  buffer size when writing to file [default: 2048].
"""
from docopt import docopt
import requests
import time
import sys
import urllib
import json

import platform
VER = platform.python_version()
PY34 = VER.startswith('3.4')
PY35 = VER.startswith('3.5')
if PY34 or PY35:
    import urllib.parse
    urllib.quote_plus = urllib.parse.quote
    unicode = lambda x, y: x

MAIN="http://www.youtube-mp3.org"
#Choose an agent here
A="Mozilla/5.0 (X11; Linux x86_64; rv:42.0) Gecko/20100101 Firefox/42.0"
ACC="text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
HEADERS = {
    "Host": "www.youtube-mp3.org",
    "User-Agent": A,
    "Accept": ACC,
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Location": "*",
    "Cache-Control": "no-cache",
    "Referer": "http://www.youtube-mp3.org/",
    "Connection": "keep-alive",
    "Pragma": "no-cache",
    }


def sig(H):
    """Deobfuscated hashing"""
    A = {"a": 870,
         "b": 906,
         "c": 167,
         "d": 119,
         "e": 130,
         "f": 899,
         "g": 248,
         "h": 123,
         "i": 627,
         "j": 706,
         "k": 694,
         "l": 421,
         "m": 214,
         "n": 561,
         "o": 819,
         "p": 925,
         "q": 857,
         "r": 539,
         "s": 898,
         "t": 866,
         "u": 433,
         "v": 299,
         "w": 137,
         "x": 285,
         "y": 613,
         "z": 635,
         "_": 638,
         "&": 639,
         "-": 880,
         "/": 687,
         "=": 721}
    F = 1.51214
    N = 3219
    H = unicode(H.lower(), "utf-8")
    for char in H:
        if char.isnumeric():
            N += int(char) * 121 * F
        else:
            if char in A:
                N += A[char] * F
        N *= 0.1
    N = round(N * 1000)
    return int(N)

def prepare_url(formatstr, *args):
    """Format string and attach hash value."""
    rq = formatstr.format(*args)
    rq += "&s={0}".format(sig(rq))
    return rq

def prepare_and_send_url(stream, formatstr, *args):
    """
    Send a formatted string and return response object.
    Uses default header values.
    """
    rq = prepare_url(formatstr, *args)
    r = requests.get(rq, stream=stream, headers=HEADERS)
    return r

def download(url, filename, endwithmp3 = True, chunk=2048):
    """Fetch and save url to specified path."""
    URL = urllib.quote_plus(url)
    form = "{0}/a/pushItem/?item={1}&el=na&bf=false&r={2}"
    form2 = "{0}/a/itemInfo/?video_id={1}&ac=www&t=grp&r={2}"
    form3 = "{0}/get?video_id={1}&ts_create={2}&r={3}&h2={4}"
    timestamp = int(time.time()*1000)
    r = prepare_and_send_url(False, form, MAIN, URL, timestamp)
    video_id = r.text
    r = prepare_and_send_url(False, form2, MAIN, video_id, timestamp)
    json_data = json.loads(r.text[7:-1])
    ts_create = json_data[u'ts_create']
    h2 = json_data[u'h2']
    r_data = urllib.quote_plus(json_data[u'r'])
    r = prepare_and_send_url(True, form3, MAIN, video_id,
                             ts_create, r_data, h2)
    if not filename.endswith(".mp3") and endwithmp3:
        filename += ".mp3"
    with open(filename, 'wb') as f:
        for chunk in r.iter_content(chunk_size=chunk):
            if chunk: # filter out keep-alive new chunks
                f.write(chunk)

if __name__ == '__main__':
    arguments = docopt(__doc__)
    download(arguments["<url>"],
             arguments["<path>"],
             arguments["--autoend"],
             int(arguments["--chunk"]))
