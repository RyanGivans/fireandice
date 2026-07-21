#!/usr/bin/env python3
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
ROOT=Path(__file__).resolve().parents[1]
IGNORED={'http','https','mailto','tel','data','javascript'}
class Parser(HTMLParser):
 def __init__(self): super().__init__(convert_charrefs=True);self.titles=0;self.h1s=0;self.refs=[];self.no_alt=[]
 def handle_starttag(self,tag,attrs):
  v=dict(attrs)
  if tag=='title':self.titles+=1
  if tag=='h1':self.h1s+=1
  if tag in {'a','link'} and v.get('href'):self.refs.append((tag,v['href']))
  if tag in {'img','script'} and v.get('src'):self.refs.append((tag,v['src']))
  if tag=='img' and 'alt' not in v:self.no_alt.append(v.get('src','unknown'))
def local(page,value):
 if not value or value.startswith('#'):return None
 p=urlsplit(value)
 if p.scheme.lower() in IGNORED or p.netloc or not p.path:return None
 return (page.parent/p.path).resolve()
def main():
 errors=[];pages=sorted(ROOT.glob('*.html'))
 for page in pages:
  p=Parser();p.feed(page.read_text(encoding='utf-8'))
  if p.titles!=1:errors.append(f'{page.name}: expected one title, found {p.titles}')
  if p.h1s!=1:errors.append(f'{page.name}: expected one h1, found {p.h1s}')
  errors += [f'{page.name}: missing alt on {x}' for x in p.no_alt]
  for tag,value in p.refs:
   target=local(page,value)
   if target and not target.exists():errors.append(f'{page.name}: missing local {tag} reference {value}')
  print(f'PASS {page.name}: title={p.titles}, h1={p.h1s}, references={len(p.refs)}')
 css=ROOT/'assets/css/styles.css'
 if not css.exists():errors.append('Missing assets/css/styles.css')
 else:
  for line in css.read_text().splitlines():
   if '@import' in line:
    name=line.split('url(',1)[1].split(')',1)[0].strip("\"'")
    if not (css.parent/name).exists():errors.append(f'styles.css: missing {name}')
 if errors:
  print('\nVALIDATION FAILED');[print('- '+e) for e in errors];return 1
 print(f'\nPASS: validated {len(pages)} pages with no structural errors.');return 0
if __name__=='__main__':raise SystemExit(main())
