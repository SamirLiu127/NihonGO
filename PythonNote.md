# Python to json
```python
json.loads()
json.dumps() 
#sort_keys=True告訴編碼器由a-z輸出
#indent參數根據數據格式縮進檢視，讀起來更加清晰
#separators去除',:'後面空格，輸出精簡

# Writing JSON data
with open('data.json', 'w') as f:
    json.dump(data, f)

# Reading data back
with open('data.json', 'r') as f:
    data = json.load(f)
```

# Python list
### 串列 (list) 屬於可變 (mutable) 的序列 (sequence) 型態，可進行以下序列通用的計算
|計算|	描述|
|---|---|
|x in s|	判斷 x 是否在 s 中|
|x not in s|	判斷 x 是否不在 s 中|
|s + t|	連接 s 及 t|
|s * n, n * s|	將 s 重複 n 次連接 s 本身|
|s[i]|	取得索引值 i 的元素|
|s[i:j]|	取得索引值 i 到 j 的子序列|
|s[i:j:k]|	取得索引值 i 到 j ，間隔 k 的子序列|
|len(s)|	回傳 s 的元素個數|
|min(s)|	回傳 s 中的最小值|
|max(s)|	回傳 s 中的最大值|
|s.index(i)|	取得 s 中第一次出現 i 的索引值|
|s.count(i)|	累計 s 中 i 出現的個數|
### 由於串列是可變的複合資料型態 (compound data type) ，也是 Python 中大量運用的工作型態種類，因此有額外以下的計算
|計算 |	描述|
|------|--------|
|s[i] = x|	將索引值 i 的元素指派為 x|
|s[i:j] = t|	將索引值 i 到 j 的元素指派為 t ， t 為迭代器|
|del s[i:j]|	刪除索引值 i 到 j 的元素|
|s[i:j:k] = t|	將索引值 i 到 j ，間隔 k 的元素指派為 t ， t 為迭代器|
|del s[i:j:k]|	刪除索引值 i 到 j ，間隔 k 的元素|
|串列綜合運算 list comprehension|	運用運算式生成新的串列|
### 串列型態有以下的方法 (method)
|方法|	描述|
|---|---|
|list.append(x)|	將 x 附加到 list 的最後|
|list.extend(x)|	將 x 中的元素附加到 list 的最後|
|list.count(x)|	計算 list 中 x 出現的次數|
|list.index(x[, i[, j]])|	回傳 x 在 list 最小的索引值|
|list.insert(i, x)|	將 x 插入 list 索引值 i 的地方|
|list.pop([i])|	取出 list 中索引值為 i 的元素，預設是最後一個|
|list.remove(x)|	移除 list 中第一個 x 元素|
|list.reverse()|	倒轉 list 中元素的順序|
|list.sort([key[, reverse]])|	排序 list 中的元素|
