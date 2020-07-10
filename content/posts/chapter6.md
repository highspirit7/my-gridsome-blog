---
title: 6장 컴포넌트 사용
date: 2020-07-10
tags: ['컴포넌트', 'props', '싱글파일 컴포넌트', '커스텀 이벤트']
series: true
canonical_url: false
description: "스터디 첫 날에도 그랬고, 4장에서도 Vue는 양방향 데이터 바인딩이라는데 어떤 개념인지 잘 와닿지는 않았습니다. 그리고 단방향 데이터 바인딩인 리액트와는 또 어떻게 다른 것인지에 대해서도 궁금했습니다."
---

## 6.1 컴포넌트란?

반복되는 코드를 따로 분리하여 재사용할 수 있게 해주는 구성 요소. 꼭 Vue가 아니더라도 리액트 같은 프레임워크(라이브러리)에서도 쓰이는 용어.

is 속성 사용하는 경우에 컴포넌트는 순수 HTML 요소로만 구성될 수도 있다.

Vue 컴포넌트는 Vue 인스턴스이기도 해서 모든 옵션 객체를 사용할 수 있다.(루트에서만 사용하는 옵션은 제외) 라이프사이클 훅도 동일하게 사용할 수 있다.

### 컴포넌트 이름

어떠한 규칙도 없지만 **소문자와 하이픈(Kebab case)**으로 작명하기를 권장. 카멜 케이스를 사용하면 에러가 난다고 한다. 스네이크 케이스(snake_case)도 허용하지만, **W3C 규칙도 그렇고 케밥 케이스로 작성하자.**

***리액트 컴포넌트는 반드시 대문자로 시작해야 한다.*

### 전역 컴포넌트

Vue 애플리케이션 전체에서 사용 가능

전역 컴포넌트는 Vue 인스턴스 앞에서 생성해야 한다.

    // 등록
    Vue.component('my-component', {
      template: '<div>사용자 정의 컴포넌트 입니다!</div>'
    })
    
    // 루트 인스턴스 생성
    new Vue({
      el: '#example'
    })

— **특별한 요소 is — (나중에 테스트 해보자!!)**

`<ul>,<ol>,<table>`과 `<select>`와 같은 일부 HTML 엘리먼트는 그 안에 어떤 엘리먼트가 나타날 수 있는지에 대한 제한을 가지고 있으며 `<option>`과 같이 특정 다른 엘리먼트 안에만 나타날 수 있다. ****

table 태그 내에는 th, tr, td 등의 태그만 사용될 수 있기 때문에 아래와 같은 코드는 에러를 발생시킨다. my-row 컴포넌트가 tr태그로 만들어진 것이라고 해도 에러가 발생한다.

    <table>
      <my-row>...</my-row>
    </table>

그래서 특수 속성인 **is**를 사용하여 my-row 컴포넌트를 아래와 같이 사용할 수 있다.

아래의 경우에 my-row 컴포넌트가 tr태그 내부에서 렌더링될 것으로 보인다.(테스트 필요!)

    <table>
      <tr is="my-row"></tr>
    </table>

그런데 다음 소스 중 하나에 포함되면 이러한 제한 사항이 적용되지 않는다.(나중에 문서 내부 링크 따로 걸어주기)

- `<script type="text/x-template">`
- JavaScript 인라인 템플릿 문자열
- `.vue` 컴포넌트

### 지역 컴포넌트

Vue 인스턴스의 components 옵션을 사용하여 생성되는 컴포넌트. 키-값의 형태로 선언해준다

해당 Vue 인스턴스 내에서만 접근할 수 있다.

    <div id="example">
      <my-component></my-component>
    </div>

    var Child = {
      template: '<div>사용자 정의 컴포넌트 입니다!</div>'
    }
    
    new Vue({
      // ...
      components: {
        // <my-component> 는 상위 템플릿에서만 사용할 수 있습니다.
        'my-component': Child
      }
    })

위 코드는 공식문서에 있는 것을 그대로 가져온 것이고, `<my-component> 는 상위 템플릿에서만 사용할 수 있습니다.` 이렇게 주석이 달려있는데 my-component를 지역컴포넌트로 등록한 컴포넌트의 템플릿에서만 사용할 수 있다는 말로 이해했다.~~(사실 당연한 얘기일텐데 이렇게 다시 풀어서 쓸 필요가..)~~

그리고 위 코드에서는 components의 키가 케밥 케이스로 되어 있다. 그런데 카멜케이스(myComponent)나 파스칼케이스(MyComponent)로 해도 문제없이 동작한다. 하지만 여전히 상위에서 HTML 태그상에서는 컴포넌트를 위치시킬 때는 케밥케이스로 사용해야 한다. 참고로 Vue 데브툴즈에서는 각 컴포넌트 이름이 파스칼 케이스로 보여진다.

## 6.2 컴포넌트의 관계

![https://kr.vuejs.org/images/props-events.png](https://kr.vuejs.org/images/props-events.png)

v-model 디렉티브 사용해서 폼 입력 구성할 때는 양방향 데이터 바인딩이었지만, 컴포넌트의 경우 단방향 데이터 바인딩.

데이터는 부모에서 자식으로만 props로 전달된다. props로 전달되는 경우, 부모가 자신의 상태를 업데이트하면 자동적으로 업데이트된 데이터가 자식으로 전달된다.

전달되는 데이터 변경도 부모 컴포넌트에 의해서만 이루어져야 한다. 자식 컴포넌트에서 부모의 상태(부모가 가지고 있는 데이터)를 변경하려 한다면 에러가 발생한다.(추후 더 검토 필요)

vue.js:634 [Vue warn]: Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders. Instead, use a data or computed property based on the prop's value.

→ 위와 같은 에러가 발생하는데, data 객체나 computed 속성을 사용하여 부모로부터 전달받은 props 값을 변경해서 사용하기를 권고하고 있다. 나중에 나오겠지만 Vue에서는 자식 컴포넌트가 부모의 상태를 변경하는 것이 가능은 하다.

자식 컴포넌트는 단지 이벤트를 생성해 부모에게 메시지를 보낼 수 있을 뿐이다.(이벤트를 통해서 부모에게 데이터도 전달할 수 있는 것으로 보이는데, 이게 과연 그럼 단방향 데이터 바인딩이라는 표현이 맞는지 모르겠다. 여기도 더 공부해야할 부분)

→ 기본적으로 단방향 데이터 바인딩을 추구하지만 Vue에서는 자식 컴포넌트가 부모의 데이터를 변경하는 것이 가능하다.

자바 스크립트의 객체와 배열은 참조로 전달되므로 prop가 배열이나 객체인 경우 하위 객체 또는 배열 자체를 부모 상태로 변경하면 부모 상태에 영향을 줍니다. ⇒ 이 부분도 테스트 필요

→ 객체나 배열의 경우 자식이 props로 전달받아 변경하면 변경한 것이 부모의 상태에도 적용된다.

## 6.3 속성을 사용해서 데이터 전달

### 리터럴 props

해당 컴포넌트의 props 속성에 전달하는 props의 이름을 선언해주어야 한다.

    <div id="app">
    		// text props에 이렇게 문자 리터럴을 그대로 넣어줄 수 있다.
        <my-component text="World"></my-component>
      </div>
      <script>
      const MyComponent= {
        template:'<div>안녕 {{text}}! </div>',
        props:['text']
      }
      new Vue({
        el: "#app",
        components: {'my-component': MyComponent}
      });

### 동적 props

v-bind를 사용하여 props를 자식 컴포넌트에 동적으로 바인딩할 수 있다. 

아래 코드에서 parentMsg는 문자 리터럴이 아닌 부모 컴포넌트가 가지고 있는 데이터 속성의 이름이다.

자식 컴포넌트에서는 `{{my-message}}` 와 같은 식으로 전달받은 props를 사용할 수 있다.

    <div>
      <input v-model="parentMsg">
      <br>
      <child v-bind:my-message="parentMsg"></child>
    </div>

**이해 못한 부분**

책 6.3.2 동적 속성에 나오는 설명 중에 *'Vue.js 인스턴스의 데이터는 더이상 data: {} 객체가 아닙니다. 이것은 의도된 것으로 컴포넌트가 조금 다르게 작동할 수 있지만, 데이터는 객체가 아닌 함수로 표현되어야 합니다.'* 라는 부분이 나온다. data 객체를 아래 코드처럼 함수로 구현해 놓았는데. 왜 함수로 표현되어야 하는지 아직 모르겠다.

    new Vue({
        el: "#app",
        components: {'my-component': MyComponent},
        data() {
          return {
            message: '부모 컴포넌트로부터!'
          }
        }
      });

### 속성 검증(prop validation)

여러 사람이 협업하는 프로젝트에서 컴포넌트 제작 시 유용.

필수적인 props의 경우 `required: true`

`default` 값을 부여할 수도 있다.

직접 `validatior` 함수를 제작해 커스텀 유효성 검사를 할 수도 있다.

    Vue.component('example', {
      props: {
        // 기본 타입 확인 (`null` 은 어떤 타입이든 가능하다는 뜻입니다)
        propA: Number,
        // 여러개의 가능한 타입
        propB: [String, Number],
        // 문자열이며 꼭 필요합니다
        propC: {
          type: String,
          required: true
        },
        // 숫자이며 기본 값을 가집니다
        propD: {
          type: Number,
          default: 100
        },
        // 객체/배열의 기본값은 팩토리 함수에서 반환 되어야 합니다.
        propE: {
          type: Object,
          default: function () {
            return { message: 'hello' }
          }
        },
        // 사용자 정의 유효성 검사 가능
        biggerThanTen: {
          validator: function (value) {
            return value > 10
          }
        }
      }
    })

`type` 으로 사용 가능한 네이티브 생성자

- String
- Number
- Boolean
- Function
- Object
- Array
- Symbol

위 코드에서 biggerThanTen의 경우 따로 `type`이 들어간 것이 없는데 validator 함수를 정의하여 만들어진 경우,  biggerThanTen 그 자체가 하나의 새로운 `type`이다.

props 검증이 실패하면 Vue는 콘솔에서 경고를 출력한다(개발 빌드를 사용하는 경우). 

props는 컴포넌트 인스턴스가 생성되기 전에 검증되기 때문에 default 또는 validator 함수 내에서 data, computed 또는 methods와 같은 인스턴스 속성을 사용할 수 없다.

## 6.4 템플릿 컴포넌트 정의

### 인라인 템플릿

inline-template이라는 특수한 속성을 사용하면 해당 컴포넌트 내부에 있는 모든 태그를 템플릿으로 사용.

    <my-component inline-template>
      <div>
        <p>이것은 컴포넌트의 자체 템플릿으로 컴파일됩니다.</p>
        <p>부모가 만들어낸 내용이 아닙니다.</p>
      </div>
    </my-component>

**장점**

템플릿 문자열 방식은 다른 개발 환경에서 구문 강조(Syntax Highlighting)가 어렵다. 그리고 여러 줄로 작성하려면 이스케이프 문자가 필요하다.(ES6 템플릿 리터럴인 백틱을 사용하면 이스케이프 문자 없이 줄바꿈은 가능하다.) → 책 내용

**단점**

템플릿의 범위를 추론하기 어렵게 만든다. → 공식 문서 내용

**결국 공식문서 상에서는 별로 추천하는 방법은 아니다. 아직 Vue로 제대로 프로젝트를 해보지 않았지만, 인라인 템플릿을 사용할 일은 거의 없어 보인다.

### X-Templates

text/x-template 유형의 스크립트 엘리먼트 내부에 ID로 템플릿을 참조

    <script type="text/x-template" id="hello-world-template">
      <p>Hello hello hello</p>
    </script>

    Vue.component('hello-world', {
      template: '#hello-world-template'
    }

템플릿이 컴포넌트가 정의된 부분과 분리되는 구조이기 때문에 큰 애플리케이션에서는 비추천.(이것도 사실상 거의 사용할 일 없어보인다.)

### 싱글 파일 컴포넌트

템플릿과 정의 그리고 CSS를 모두 하나의 파일(.vue)에 합쳐서 제작. 큰 규모의 프로젝트에 적합(사실상 실무에서는 이 형태로 컴포넌트를 제작하게 될 것)

그런데 .vue 컴포넌트를 사용하기 위해서 빌드 도구가 필요. Vue-CLI라는 것을 사용하면 쉽게 할 수 있다고 한다.

템플릿은 <template></template> 

컴포넌트 정의는 <script></script>

CSS는 <style></style> 

    <template>
      <div class="hello">
        {{msg}}
      </div>
    </template>
    
    <script>
    export default {
      name: 'hello',
      data () {
        return {
          msg: 'Vue.js 앱에 오신걸 환영합니다'
        }
      }
    }
    </script>
    
    <!-- Add "scoped" attribute to limit CSS to this component only -->
    <style scoped>
    </style>

장점 : ES6 템플릿 문자열(백틱)을 사용하면 이스케이프 문자 필요 없이 줄바꿈도 가능하나 여전히 구문 강조가 모든 개발환경에서 지원되는 것은 아니다.

**네이밍 규칙**

Vue.component(전역)나 Vue 인스턴스의 components(지역)로 컴포넌트를 생성할 때처럼 카멜케이스도 가능은 하지만, 공식문서에서는 파스칼케이스나 케밥케이스를 추천한다. 

**현재 진행중인 회사 프로젝트도 그렇고 뷰 데브툴즈에서도 컴포넌트가 파스칼 케이스로 보여진다. 리액트 컴포넌트 이름도 파스칼 케이스로 사용했기 때문에 앞으로 파스칼 케이스로만 쓰면 되겠다.**

## 6.5 커스텀 이벤트

$emit을 사용해 이벤트를 생성할 수 있고, v-on 디렉티브를 이용하여 자식의 이벤트를 부모로 전달할 수 있다. 

이런 식으로 자식에서 부모의 속성을 변경하지 않고 이벤트만 전달해서 부모 컴포넌트에서 직접 속성을 변경하게 하면 단방향 데이터 흐름을 유지할 수 있다.

    <body>
      <div id="app">
        {{counter}}<br/>
        <button v-on:click="incrementCounter">카운터 증가</button>
    		// increment-me 라는 이벤트가 자식으로부터 발생 시 부모의 incrementCounter 함수가 호출되도록 바인딩
        <my-component v-on:increment-me="incrementCounter" ></my-component>
      </div>
      <script>
      const MyComponent = {
    		// 자식 컴포넌트의 버튼을 클릭하게되면 increment-me 라는 이벤트가 발생한다
        template: `<div>
          <button v-on:click="childIncrementCounter">자식으로부터 증가</button>
        </div>`,
        methods: {
          childIncrementCounter() {
    				// increment-me라는 이벤트를 생성
            this.$emit('increment-me');
          }
        }
      }
      new Vue({
        el: '#app',
        data() {
            return {
                counter: 0
            }
        },
        methods: {
          incrementCounter() {
            this.counter++;
          }
        },
        components: {'my-component': MyComponent}
      });
      </script>
    </body>

대부분의 경우에 단방향 데이터 흐름을 유지해야 한다. 

그러나 Vue에서는 아래와 같이 자식 컴포넌트에서 부모 컴포넌트의 속성값을 변경하는 것이 가능하다. 

    <body>
      <div id="app">
        {{counter}}<br/>
        <button v-on:click="incrementCounter">카운터 증가</button>
    		// 자식 컴포넌트의 my-counter 값을 부모의 counter에 세팅
        <my-component :my-counter.sync="counter"></my-component>
      </div>
      <script>
      const MyComponent = {
        template: `<div>
          <button v-on:click="childIncrementCounter">자식으로부터 증가</button>
        </div>`,
        methods: {
          childIncrementCounter() {
    				// 변경 시킬 값 앞에 update 사용
            this.$emit('update:myCounter', this.myCounter+1);
          }
        },
        props:['my-counter']
      }
      new Vue({
        el: '#app',
        data() {
            return {
                counter: 0
            }
        },
        methods: {
          incrementCounter() {
            this.counter++;
          }
        },
        components: {'my-component': MyComponent}
      });
      </script>
    </body>

**아직 이해가 부족한 부분**

.sync 변경자는 `<my-component :my-counter="counter" @update:my-counter="var⇒bar-val"></my-component>` 의 syntax sugar라고 책에 나오는데 정확하게 어떻게 구현해야 .sync 사용하는 것과 똑같이 동작하는 지는 아직 모르겠다.(여러 테스트를 해봤는데 실패한 상황)

---

### 참고자료

[https://kr.vuejs.org/v2/guide/components.html](https://kr.vuejs.org/v2/guide/components.html)

[[vuejs] Kebab Case, Camel Case, Snake Case](https://eddie2yim.tistory.com/46)

[https://github.com/FEDevelopers/tech.description/wiki/Vue에서-컴포넌트-템플릿을-정의하는-7가지-방법](https://github.com/FEDevelopers/tech.description/wiki/Vue%EC%97%90%EC%84%9C-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8-%ED%85%9C%ED%94%8C%EB%A6%BF%EC%9D%84-%EC%A0%95%EC%9D%98%ED%95%98%EB%8A%94-7%EA%B0%80%EC%A7%80-%EB%B0%A9%EB%B2%95)