---
title: 4장 폼과 입력
date: 2020-02-24
tags: ['양방향 데이터 바인딩', 'v-model', 'v-for']
series: true
canonical_url: false
description: "스터디 첫 날에도 그랬고, 4장에서도 Vue는 양방향 데이터 바인딩이라는데 어떤 개념인지 잘 와닿지는 않았습니다. 그리고 단방향 데이터 바인딩인 리액트와는 또 어떻게 다른 것인지에 대해서도 궁금했습니다."
---

### 양방향 데이터 바인딩과 단방향 데이터 바인딩

스터디 첫 날에도 그랬고, 4장에서도 Vue는 양방향 데이터 바인딩이라는데 어떤 개념인지 잘 와닿지는 않았습니다. 그리고 단방향 데이터 바인딩인 리액트와는 또 어떻게 다른 것인지에 대해서도 궁금했습니다.

아래 예제는 [velopert님의 블로그 글](https://velopert.com/3136)에서 가져왔습니다.

HTML

    <div id="app">
    <h1>Hello, {{ name }}</h1>
    <input type="text" v-model="name"/>
    </div>

JavaScript

    var app = new Vue({
    	el: '#app', 
    	data: {
    	name: 'Vue'
    	}
    });

위 예제를 보면서 양방향 데이터 바인딩이라는 것이 무엇인지 리액트와는 어떻게 다르게 동작하는지 알 수 있었습니다. 사용자가 input창에 입력하는 대로 h1 태그의 'Hello'라는 문구 옆에 나타나게 됩니다. 단순히 위 코드만으로요. 

물론 리액트에서도 위와 같이 구현할 수는 있습니다. 하지만 input 태그에 onChange와 같은 변화를 감지하는 이벤트를 따로 걸어주고 그렇게 기존 데이터를 변화한 데이터로 교체해주는 로직도 부모 컴포넌트(일반적으로 리액트 프로젝트는 로직을 갖는 컴포넌트와 뷰를 그리는 컴포넌트를 분리하는 것으로 알고있습니다.)에 필요합니다. 아마도 Vue에서는 이러한 것들이 내부적으로 이루어지고 있을 것 같습니다.

### **v-model**

사용 목적 : 폼 input과 textarea 엘리먼트에 양방향 데이터 바인딩을 생성

v-model 디렉티브는 사실 v-bind 디렉티브를 내부적으로 사용하고 있는 syntax sugar.

__책에서 나오는 상세설명__ 

`<input v-model="something">`은 `<input v-bind:"something" v-on:input="something=$event.target">`의 문법적 설탕

⇒ 더 정확하게는 `input v-bind:"something"`이 아니라 `input v-bind:value="something"` 이것이 맞습니다. 그리고 입력 요소에 따라 v-model이 구성되는 방식은 달라집니다.(아래 참고)


***HTML 입력 요소의 종류에 따른 `v-model` 속성 구성***  
(1) input 태그에는 `value / input`  
(2) checkbox 태그에는 `checked / change`  
(3) select 태그에는 `value / change`


**input 체크박스 바인딩 by v-model**

    <div class="form-group">
        <div class="col-md-6 boxes">
          <input type="checkbox" id="gift" value="true" v-bind:true-value="order.sendGift"
            v-bind:false-value="order.dontSendGift" v-model="order.gift">
          <label for="gift">선물로 보내기?</label>
        </div>
    </div>

**vue 인스턴스 data 객체 中**

    order: {
              firstName: '',
              lastName: '',
              address: '',
              city: '',
              zip: '',
              state: '',
              method: '자택 주소',
              business: '직장 주소',
              home: '자택 주소',
              gift:'선물로 보내기',
              sendGift: '선물로 보내기',
              dontSendGift: '선물로 보내기 않기'
            },

체크박스가 체크되면 ⇒ sendGift 텍스트 출력

체크박스가 해제되면 ⇒ dontSendGift 텍스트 출력

위 코드에서처럼 <u>input 체크박스의 값이 true일 때와 false일 때를 나누어서 v-bind:value를 해 줄 수 있습니다.</u> 이 점이 상당히 신기했네요. 

그리고 또 신기했던 점은 **v-model로 바인딩 된 value값(최초의 value값)이 v-bind:true-value의 값과 동일하다면 처음부터 체크박스가 체크된 상태로 출력된다는 점입니다.**

    <div class="form-group">
        <div class="col-md-6 boxes">
          <input type="radio" id="home" 
    							v-bind:value="order.home" 
    							v-model="order.method">
          <label for="home">자택</label>
          <input type="radio" 
    							id="business" 
    							v-bind:value="order.business" 
    							v-model="order.method">
          <label for="business">직장</label>
        </div>
    </div>

order.method에 처음 세팅된 값으로 라디오 버튼으로 부터 가져오는 값의 초기값('자택 주소')을 설정해 줄 수 있다. 그리고 나서 각 라디오 버튼 클릭 시 v-bind로 바인딩 된 값이 v-model 바인딩으로 인해 order.method에 세팅되어 출력된다. 

따로 home 선택 혹은 business 선택 시 값이 다르게 출력되도록 코딩할 필요가 없이 order.method 값만 사용자에게 보여주면 된다. 이런 점이 편리해보인다.

### **v-for**

일반적인 프로그래밍 언어에서 사용하는 for문과 거의 동일하게 사용할 수 있다. v-for 디렉티브는 `item in items` 형태의 문법을 가진다. 

아래 코드처럼 data 객체의 속성(여기서는 provinces 배열)을 'in' 뒤에 넣어서 바로 사용할 수 있다. 

'in' 앞에 배열의 요소를 나타내는 인자가 들어가고 필요하면 index를 나타내는 인자도 두번째로 사용할 수 있다.(자바스크립트의 배열메소드인 map 같은 것을 사용할 때의 인자와 동일)

    <option v-for="(province, key) in provinces" v-bind:value="province">
      {{province}}
    </option>

**객체의 경우도 v-for를 사용해서 반복시킬 수 있다. 객체의 경우 최대로 인자를 3가지`(속성값, 속성 이름, 인덱스)`를 가질 수 있다.

---
## 수식어

v-model은 여러 수식어와 함께 사용할 수 있다. 수식어에 또 다른 수식어를 추가해서 사용할 수도 있다.

**number 수식어**

숫자만 입력되어야 하는 경우에 `.number` 수식어를 사용하여  숫자로 타입 변환할 수 있다.

type="number"를 사용하는 경우에도 HTML 입력 엘리먼트의 값은 항상 문자열을 반환하기 때문에 .number 수식어 사용은 유용할 수 있다.

    <input v-model.number="order.zip" 	
          class="form-control"
          type="number"/>

**trim 수식어**

앞뒤로 공백 제거

**lazy 수식어**

그냥 수식어 없이 v-model을 input 태그에 사용하다면 각 글자의 입력마다 데이터가 동기화된다. 그러나 .lazy 수식어를 사용하면 글자 그대로 키 입력할때마다 동기화되는 것이 아니라 change 이벤트가 발생할 때마다 동기화된다. 그러나 모든 웹 브라우저가 동일한 상황에서 change 이벤트를 발생시키는 것은 아니라는 점을 잊지 말자. 

input의 경우에는 type이 text일 때, value가 변했고 포커스를 잃으면 change 이벤트가 발생한다고 한다. 

---

### References(참고 자료)

- [Vue.js와 양방향 데이터 바인딩](https://brunch.co.kr/@clay1987/139)
- [change 이벤트](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event)
- [v-model의 동작 원리와 활용 방법](https://joshua1988.github.io/web-development/vuejs/v-model-usage/)