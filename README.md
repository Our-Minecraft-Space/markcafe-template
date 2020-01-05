# 마크카페 템플릿
마크카페는 [우리들의 마인크래프트 공간 초심자 가이드](https://cafe.naver.com/minecraftgame/1677174)를 작성하기 위해 만들어진 스크립트입니다. 마크다운 문서를 네이버 카페에 업로드해도 가독성 좋은 HTML 문서로 변환합니다.

이 템플릿을 이용하면 articles 디렉터리에 마크다운 문서를 작성해 업로드했을 때 자동으로 HTML 문서가 깃허브 페이지에 업로드되도록 할 수 있습니다.

별도의 저장소 없이 간단하게 마크다운 문서를 HTML로 변환하고 싶다면 [마크카페 웹](https://markcafe.finalchild.me)을 이용해 주세요.

## 기본 설정
1. 이 저장소에서 <kbd><samp>Use this template</samp></kbd> 버튼을 누릅니다.
2. `markcafe-config.json`에서 `imgSrcPrefix`를 `"https://<페이지 루트 URL>/"`로 설정합니다.<br>예) `https://finalchild.github.io/my-tutorial/`
3. (트라비스 CI를 사용한 적이 없다면) [트라비스 CI](https://travis-ci.com/)에 접속하여, 깃허브로 로그인하여 계정을 활성화합니다.
4. [깃허브 도움말](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)을 참고하여 깃허브 계정의 개인 접근 토큰을 생성합니다. 공개 저장소의 경우에는 `public_repo`, 비공개 저장소의 경우에는 `repo` 권한이 필요합니다.
5. 트라비스 CI의 저장소 설정 페이지에서 `GITHUB_TOKEN` 환경 변수의 값을 생성한 개인 접근 토큰으로 설정합니다.
6. (와이드 스킨 카페의 경우) `style.css`에서 `.container`의 `width`를 `100%`로 설정합니다.

## 사용
### `markcafe-config.json`
스크립트의 설정을 변경할 수 있습니다.
* `articlesDirectoryPath`: 대상 마크다운 파일이 있는 디렉터리의 경로를 지정합니다.
* `imagesDirectoryPath`: 사용되는 이미지가 들어 있는 디렉터리의 경로를 지정합니다.
* `cssPath`: CSS 파일의 경로를 지정합니다.
* `generatedDirectoryPath`: 변환 목적지 디렉터리의 경로를 지정합니다.
* `cname`: 깃허브 페이지에 사용자 지정 도메인을 사용할 때, `CNAME` 파일에 들어갈 내용을 지정합니다. 비어 있으면 `CNAME` 파일을 생성하지 않습니다.
* `markdownItOptions`: [Markdown-It](https://markdown-it.github.io/)에 전달되는 설정 객체입니다.
* `imgSrcPrefix`: `![]()` 구문으로 이미지를 삽입할 때, 경로가 문자열 `images/`로 시작하면 그 앞에 설정된 문자열을 더합니다. 이미지를 절대 경로로 바꾸어 네이버 카페에 HTML을 바로 붙여넣을 수 있게 하는 용도입니다.
* `tipHeaderContent`: 아래에서 설명하는 팁 구문을 사용할 때, 팁의 헤더에 삽입되는 HTML을 설정합니다.

### 마크다운 문서 작성
`articles` 디렉터리를 만들어 그 안에 마크다운 문서 파일을 작성합니다. 이미지는 `images` 디렉터리(루트 바로 아래)를 만들어 넣습니다. `images` 폴더에 있는 이미지를 마크다운에 삽입할 때에는 `![](images/<이미지 파일명>)`처럼 경로가 `images/`로 시작하도록 합니다.

일반적인 마크다운과 몇 가지 다르게 동작하는 부분이 있습니다.

#### 단일 줄바꿈
기본적으로 단일 줄바꿈은 `<br>` 태그로 취급됩니다. 이 동작은 `markcafe-config.json`에서 `markdownItOptions.breaks`를 `false`로 바꾸면 꺼집니다.

#### 이미지 태그
`![]()` 구문으로 이미지를 삽입할 때, 그 구문이 다른 구문 안에 중첩된 것이 아니면 다음 규칙들이 적용됩니다.

`<div class="img-wrapper">` 태그로 감싸집니다. 기본 `style.css`에서 감싸진 이미지의 너비를 `668.7px`로 지정하고 있습니다.

경로가 문자열 `images/`로 시작하면 그 앞에 `markcafe-config.json`의 `imgSrcPrefix`를 더합니다.

#### 팁 구문
아래와 같은 구문은 팁으로 꾸며집니다.
~~~
```tip
팁 내용1
팁 내용2
```
~~~

#### 기타 사용자 지정
[Markdown-It](https://markdown-it.github.io/)으로 몇 가지 설정을 하고 있으며, 이는 `markcafe-config.json`의 `markdownItOptions`와 `markcafe.mjs`에서 확인 및 수정할 수 있습니다.

### 명령줄에서 실행
`npm run-script generate` 명령어를 실행합니다. 변환된 파일은 `generated` 디렉터리에 저장됩니다.

### CI
트라비스 CI가 활성화되어 있으면 커밋이 푸시될 때 빌드 후 깃허브 페이지에 `generated` 디렉터리를 자동으로 업로드합니다. 깃허브 페이지가 `gh-pages` 브랜치를 사용하도록 설정해 주세요.

### 실행 결과
`generated` 디렉터리의 `<파일명>.html`에 미리보기 페이지가, `<파일명>.html.txt`에 네이버 카페에 붙여넣을 수 있는 HTML이 저장됩니다.

깃허브 페이지에서도 `<파일명>.html`과 `<파일명>.html.txt`를 볼 수 있습니다.

## 네이버 카페에 HTML 업로드
브라우저에 [탬퍼멍키](https://www.tampermonkey.net/) 확장을 설치하고, [우리의 카페테리아](https://openuserjs.org/scripts/finalchild/Our_Cafeteria) 스크립트를 설치하면 게시글 작성 창에 아래와 같이 HTML 편집 버튼이 나타납니다.

![우리의 카페테리아 스크린숏](https://i.imgur.com/yauzGbb.png)

`<파일명>.html.txt`의 내용을 복사하여 HTML 편집기에 붙여 넣으면 됩니다.

## 예시
### 우리들의 마인크래프트 공간 초심자 가이드
* [깃허브 저장소](https://github.com/finalchild/our-mc-tutorial)
* [네이버 카페 게시글](https://cafe.naver.com/minecraftgame/1677174)

## 라이선스
```
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>
```
