---
title: 5장 조건부, 반복, 리스트
date: 2020-03-04
tags: ['리스트 렌더링', 'v-for']
series: true
canonical_url: false
description: "자바스크립트에서 if, else if, else를 사용하는 방법과 동일하다. 그래서 v-else-if는 여러번 사용 가능하다.
다만, 템플릿에 너무 많은 조건부 로직을 사용하지 않도록 주의하자. 로직이 길어질 때는 computed나 methods를 활용하는 것이 좋다. "
---

### 조건부 사용(v-if, v-else-if, v-else)

**자바스크립트에서 if, else if, else를 사용하는 방법과 동일**하다. 그래서 v-else-if는 여러번 사용 가능하다.

다만, 템플릿에 너무 많은 조건부 로직을 사용하지 않도록 주의하자. 로직이 길어질 때는 computed나 methods를 활용하는 것이 좋다. 

---

### v-for(4장에서 정리하지 않았던 부분만 정리)

**숫자 사용**

아래 예시처럼 원하는 숫자만큼 반복하도록 v-for를 사용할 수 있다. n은 1에서부터 in 뒤에 설정한 숫자까지 증가하며 해당 태그를 반복해서 출력한다.

    <div>
      <span v-for="n in 10">{{ n }} </span>
    </div>

**key 속성 사용(공식문서 참고)**

개별 DOM 노드를 추적하고 기존 요소를 재사용, 재정렬하기 위해 v-for의 각 항목에 고유한 key 속성을 부여해야 한다. 

아래와 같이 v-bind를 이용하여 key 속성을 바인딩해주어야 한다.

    <div v-for="item in items" v-bind:key="item.id">
      <!-- content -->
    </div>

** 리액트와 다른 점은 리액트에서는 이렇게 반복적으로 리스트를 렌더링하는 경우에 key를 무조건 부여해주어야 하는데, vue에서는 필수는 아니고 권장사항이다.

객체나 배열처럼, 원시값(Primitive value)이 아닌 값을 키로 사용해서는 안된다!

---

### 레코드 정렬

v-for 디렉티브를 사용하여 다수의 데이터를 출력하는 경우에 아래와 같은 함수를 computed 속성에 추가하여 정렬시킬 수 있다. 

    sortedProducts() {
      if(this.products.length > 0) {
        let productsArray = this.products.slice(0);
        function compare(a, b) {
          if(a.title.toLowerCase() < b.title.toLowerCase())
            return -1;
          if(a.title.toLowerCase() > b.title.toLowerCase())
            return 1;
          return 0;
        }
        return productsArray.sort(compare);
      }
    }

**한글 문자열도 아래와 같이 부등호로 비교해서 '가, 나, 다, 라' 순서대로 정렬시킬 수 있다.(처음 알게 된 부분)

**이해 안 되는 부분**

let productsArray = this.products.slice(0); 객체를 배열로 변환하기 위해 이런 코드를 사용한다고 책에 나와있는데, products에 이미 배열이 들어가는데 왜 이런 코드를 사용했는지 모르겠다. 이 코드 없이도 문제 없이 돌아간다.

⇒ 책에서는 배열이 들어가기 때문에 다시 배열로 변환할 필요는 없지만 유사 배열 객체인 경우에 대응하기 위해 저러한 코드를 넣은 것으로 보인다. 참고로 slice(0)은 해당 배열의 **shallow copy(첫번째 depth만 복사; 첫번째 depth에 객체나 배열처럼 reference-type 요소들이 있다면 두번째 혹은 그 이상의 depth에 위치한 내부 데이터들은 참조로 연결되어 있다.)**를 반환한다. 그런데 slice는 유사배열 객체에 사용할 수 없으므로 `Array.prototype.slice.call(arrayLikeObject, 0)` 이렇게 사용하는 것이 맞다.

---

### 참고자료

- [리스트 렌더링(Vue.js 공식문서)](https://kr.vuejs.org/v2/guide/list.html)