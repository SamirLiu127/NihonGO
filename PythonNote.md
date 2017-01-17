# Python to json
```python
json.loads()
json.dumps() 
#sort_keys告訴編碼器由a-z輸出
#indent參數根據數據格式縮進檢視，讀起來更加清晰
#separators去除',:'後面空格，輸出精簡

# Writing JSON data
with open('data.json', 'w') as f:
    json.dump(data, f)

# Reading data back
with open('data.json', 'r') as f:
    data = json.load(f)
```
