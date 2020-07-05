---
title: 3장 상호 작용성 추가
date: 2020-02-20
tags: ['computed', 'method', 'v-if', 'v-show']
series: true
canonical_url: false
description: "computed 옵션 내에서 계산 로직을 갖는 함수를 만들 수 있습니다. 그리고 그 함수 이름을 사용해서 데이터 바인딩이 가능합니다. data 객체에서 생성된 속성들을 바인딩시킬 때와 똑같이 동작합니다."
---

## 1. 계산된(computed) 속성으로 새로운 결괏값 추출

computed 옵션 내에서 계산 로직을 갖는 함수를 만들 수 있습니다. 그리고 그 함수 이름을 사용해서 데이터 바인딩이 가능합니다. data 객체에서 생성된 속성들을 바인딩시킬 때와 똑같이 동작합니다.

아래 예제에서 Vue 인스턴스의 computed 옵션 내에 생성된 area 함수는 p 태그 내에 수염 구문으로 바인딩되어 있습니다.

    <p>
    	 넓이: {{ area }}
    </p>

    var app = new Vue({
          el: '#app',
          data: {
            length: 5,
            width: 3
          },
          computed: {
            area: function() {
              return this.width * this.length;
            }
          }

### **인스턴스 데이터 변화 시 내부 동작 구조(feat. computed)**

1. 인스턴스 데이터 변경
2. computed 속성이 변경된 인스턴스 데이터로 재계산
3. beforeUpdate 이벤트 발생
4. 가상 DOM 업데이트
5. 웹 브라우저 DOM 패치
6. updated 이벤트 발생

<br>

**-- 주의사항 --**   
computed나 methods 옵션에 추가하는 함수는 화살표 함수를 사용하면 안 됩니다. <br>
화살표 함수는 this를 새로 정의하지않고, 상위 스코프의 this를 받기 때문입니다. <br>
methods나 computed에서 this가 따로 정의되어 있지 않기에 화살표 함수의 this는 window객체의 this를 받게 됩니다. <br>
이렇게 화살표 함수를 사용하면 화살표 함수의 this는 Vue인스턴스를 받지 못하기 때문에 data 객체의 속성에도 접근할 수 없습니다. 

참고자료 : [화살표 함수의 this(feat. Vue.js)](https://lovemewithoutall.github.io/it/this-in-arrow-function/)

---

## 2. DOM에 이벤트 바인딩 추가

### v-on 사용

- 함수 이름 사용하여 바인딩

    <button v-on:click="doThis"></button>

- 직접 인라인으로 자바스크립트 작성

    <button v-on:click="doThat('hello', $event)"></button>

**v-on 생략 가능, v-on을 @로 대체 가능

    <button @click="doThis"></button>

---

## 3. 사용자 상호 작용에 대한 응답

### computed와 methods 유사점

methods 함수에 return 값을 설정해주면 computed내 함수와 사실상 동일하게 사용 가능합니다.

아래 예시 코드에서 count를 올려주면 computed로 계산된 값 그리고 methods로 계산된 값 둘다 업데이트가 됩니다.

    <div id="app">
      <p>count: {{ count }}</p>
      <p>computed: {{ double }}</p>
      <p>methods: {{ triple() }}</p>
      <button v-on:click="count ++">클릭</button>
    </div>

    new Vue({ 
      el: "#app", 
      data: {
        count: 0,
        secondCount: 0
      },
      computed: {
        double: function () {
          console.log('Computed double')
          return this.count * 2
        }
      },
      methods: {
        triple: function () {
          console.log('methods triple')
          return this.count * 3
        }
      }
    })

### <u>computed와 methods 차이점</u>

- 위 예시에서도 확인할 수 있듯이 자바스크립트 템플릿에서 methods 함수는 () 사용해서 호출을 해주어야 합니다. 일반적인 자바스크립트 함수라고 생각하면 됩니다. 그리고 computed 함수의 경우 무조건 return 값이 존재해야 합니다. 물론, return 값 없어도 그 자체로 에러가 발생하진 않지만, return 값이 없다면 computed의 속성은 항상 undefined 값을 가지기 때문에 아무 쓸모가 없습니다.
- 매개변수 받을 수 있는지 없는지
    - computed 함수의 경우 매개변수를 받을 수가 없습니다.
    - methods 함수의 경우 매개변수를 받을 수가 있습니다.
- 캐싱되는지 안되는지
    - methods 함수는 렌더링 할 때마다 호출됩니다. 그래서 위 예시 코드에서도 secondCount라는 triple 메소드와 의존성이 없는 변수가 값이 변해도 렌더링은 다시 되기 때문에 methods 함수는 호출됩니다. 그래서 비효율적. 이러한 이유로 아마도 computed라는 옵션이 따로 존재하지 않나 추측해봅니다.
    - computed 함수는 내부적으로 의존성이 있는 데이터가 변했을 때에만 호출됩니다.


## 4. 조건부로 마크업 렌더링

### v-show

v-show 지시자를 사용해서 불리언을 리턴하는 함수는 불리언값을 가지는 변수를 기준으로 조건부 렌더링을 할 수 있습니다. 

기준이 되는 불리언 값이 false일 경우, 내부적으로 해당 엘리먼트에 인라인 스타일로 'display: none'을 적용하여 숨김 처리합니다. 

    <button class="btn btn-primary btn-lg" v-on:click="addToCart" v-show="canAddToCart">
        장바구니 담기
    </button>

** 리액트에서는 조건부로 css 클래스 추가하거나 빼거나 하여 렌더링할 수 있게 해주는 라이브러리를 따로 쓰거나 아니면 직접 코드로 따로 만들어야 했는데, Vue의 v-show 지시자는 이런 면에서 유용한 것 같습니다.

### v-if와 v-else

v-show와는 다르게 false일 때 무조건 해당 요소를 숨기는 것이 아니라 v-else를 사용해서 다른 것을 렌더링해서 보여줄 수 있습니다.

일반적으로 코딩할 때 사용하는 if else 문의 구조와 유사하게 사용되고 있어서 어렵지도 않고, 직관적입니다.

당연한 얘기겠지만, v-else 마크업은 v-if 마크업과 함께 붙어서만 사용될 수 있습니다.

    <div v-if="showMe">
      <p>The if text</p>
      <p>Some text related to the if text</p>
    </div>
    <div v-else>
      <p>The else text</p>
    </div>
---
## 기타

**기술적으로 보면 자바스크립트는 공유 호출(call by sharing) 언어입니다.(책 3.2.2의 Note에서 발췌)**

- 처음 듣는 얘기이고 책에서 안내하는 위키피디아의 영문 자료는 이해하기가 어려워서 아래의 한글 자료로 겨우 이해하였습니다.
- [http://milooy.github.io/TIL/JavaScript/call-by-sharing.html#결론](http://milooy.github.io/TIL/JavaScript/call-by-sharing.html#%EA%B2%B0%EB%A1%A0)
- Key Point : **함수에 객체 형태의 인자를 넘기면 속성은 공유하지만 새로 객체를 할당할 수는 없습니다.**

<u>**스터디 후 추가 내용**</u>
```
var obj1 = {
item: {level: 1}
},
obj2 = {
item: {level: 1}
},
obj3 = {
item: {level: 1}
};

function change(obj1, obj2, obj3) {
    obj1.item.level = 2;
    obj2.item = { level: 2 }
    obj3 = {
        item: {level: 2}
    };
}

change(obj1, obj2, obj3);

console.log(obj1.item.level);
console.log(obj2.item.level);
console.log(obj3.item.level);
```
앞서 첨부한 블로그에 있는 코드에서 객체의 속성은 원시값이었지만, 객체 내부의 속성 또한 객체를 참조한다면 어떻게 될지 궁금해서 블로그에 있는 코드를 조금 변경해서 테스트해보았습니다. change함수를 위와 같이 호출한 후에 obj2, obj3, obj3가 무엇을 가리키고 있는지 확인해보았습니다.

**콘솔 로그 결과**
```
2 
2
1
```

- obj1의 경우에는 당연히 change 함수에의 해 obj1.item.level의 값이 2로 바뀝니다.
- obj3의 경우에는 아예 새로운 객체를 할당하려는 것이므로 ob3은 바뀌지 않습니다. 그래서 obj3.item.leve의 값은 바뀌지 않습니다.
- obj2의 케이스가 관건인데요. 제 추측으로는 안 바뀌지 않을까 싶었는데, ob2.item.level도 2로 바뀌었습니다. 

**이를 통해 알 수 있었던 것은 함수에 객체 형태의 인자를 넘기면 객체의 속성은 원시값이 아닌 객체 형태(reference-type)일지라도 새롭게 할당할 수 있다는 것입니다.** 
  
결국 앞서 정리했던 Key Point가 핵심입니다. 그런데 'call by sharing'이라는 용어를 처음 들어봐서 그런지 sharing이라는 표현이 이러한 특성을 적절하게 표현하는 것인지 조금 애매한 것 같다는 생각도 듭니다. 

---
## 참고 자료

- [Vue 공식문서 computed](https://kr.vuejs.org/v2/guide/computed.html)
- [계산된 속성 compued, computed vs methods](https://medium.com/@hozacho/%EB%A7%A8%EB%95%85%EC%97%90-vuejs-%EA%B3%84%EC%82%B0%EB%90%9C-%EC%86%8D%EC%84%B1-vuejs-instance-computed-93cb6ad7dca9)
- [computed, 그리고 methods와의 차이(feat.watch)](https://kamang-it.tistory.com/entry/Vue23computed-%EA%B7%B8%EB%A6%AC%EA%B3%A0-methods%EC%99%80%EC%9D%98-%EC%B0%A8%EC%9D%B4featwatch)