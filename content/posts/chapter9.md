---
title: 9장 Vue 확장
date: 2020-03-10
tags: ['믹스인', '커스텀 지시자', '렌더 함수']
series: true
canonical_url: false
description: "Mixins는 Vue 컴포넌트에 재사용 가능한 기능을 배포하는 유연한 방법입니다. mixin 객체는 모든 구성 요소 옵션을 포함할 수 있습니다. 컴포넌트에 mixin을 사용하면 해당 mixin의 모든 옵션이 컴포넌트의 고유 옵션에 “혼합”됩니다."
---

## 믹스인과 함께 기능 재사용

> Mixins는 Vue 컴포넌트에 재사용 가능한 기능을 배포하는 유연한 방법입니다. mixin 객체는 모든 구성 요소 옵션을 포함할 수 있습니다. 컴포넌트에 mixin을 사용하면 해당 mixin의 모든 옵션이 컴포넌트의 고유 옵션에 “혼합”됩니다.

아래 예제에서는 두 개의 컴포넌트가 하나의 믹스인을 공유한다. 각 컴포넌트가 복사된 별개의 data, methods를 가지게 되기 때문에 comp1의 data 옵션의 item 값이 comp2에 공유될 일은 없다.

    <script>
      const myButton = {
        methods: {
          pressed(val) {
            alert(val);
          }
        },
        data() {
            return {
                item: ''
            }
        }
      }
    
      const comp1 = {
        template: `<div>
        <h1>이메일을 입력하세요</h1>
        <form>
          <div class="form-group">
            <input v-model="item" type="email" class="form-control" placeholder="이메일 주소"/>
          </div>
          <div class="form-group">
            <button class="btn btn-primary btn-lg" @click.prevent="pressed(item)">버튼1 누르기</button>
          </div>
        </form>
        </div>`,
        mixins: [myButton]
      }
    
      const comp2 = {
        template: `<div>
        <h1>전화번호를 입력하세요</h1>
          <form>
            <div class="form-group">
                <input v-model="item" type="number" class="form-control" placeholder="전화번호"/>
            </div>
            <div class="form-group">
              <button class="btn btn-warning btn-lg" @click.prevent="pressed(item)">버튼2 누르기</button>
            </div>
          </form>
        </div>`,
        mixins:[myButton]
      }
    
      new Vue({
        el: '#app',
        data() {
          return {
            title: '컴포넌트 두 개를 사용한 믹스인 예제'
          }
        },
        components:{
            myComp1: comp1,
            myComp2: comp2
        }
      });
    </script>

앞서서 믹스인의 모든 옵션이 컴포넌트의 옵션과 혼합된다고 했는데, 같은 키값을 가지는 옵션의 경우 컴포넌트 내부에 있는 것이 우선된다. 아래의 예제에서는 data 옵션을 예로 들었지만 methods와 같이 객체 형태를 요구하는 다른 옵션들도 컴포넌트 내부의 것이 우선되는 방식으로 혼합된다.

    var mixin = {
      data: function () {
        return {
          message: 'hello',
          foo: 'abc'
        }
      }
    }
    
    new Vue({
      mixins: [mixin],
      data: function () {
        return {
          message: 'goodbye',
          bar: 'def'
        }
      },
      created: function () {
        console.log(this.$data)
        // => { message: "goodbye", foo: "abc", bar: "def" }
      }
    })

### 전역 믹스인

mixin을 전역으로 적용할 수도 있다. 믹스인 이후에 생성된 모든 Vue 인스턴스 에 영향을 미친다. 전역 믹스인은 커스텀 옵션을 모든 컴포넌트와 인스턴스에 적용하고 싶을 때 유용. 앱에 어떤 인증을 추가해야 하고 인증된 사용자만 사용할 수 있게 하고 싶다면 인증 커스텀 옵션을 갖는 전역 믹스인을 생성하여 해결할 수도 있다.

    // `myOption` 사용자 정의 옵션을 위한 핸들러 주입
    Vue.mixin({
      created: function () {
        var myOption = this.$options.myOption
        if (myOption) {
          console.log(myOption)
        }
      }
    })
    
    new Vue({
      myOption: 'hello!'
    })
    // => "hello!"

> 글로벌 mixin은 써드파티 컴포넌트를 포함하여 생성된 모든 단일 Vue 인스턴스에 영향을 주기 때문에 적게 이용하고 신중하게 사용하십시오. 대부분의 경우 위 예제에서와 같이 사용자 지정 옵션 처리에만 사용해야합니다.

## 커스텀 지시자

### 컴포넌트나 믹스인과의 차이점

- 컴포넌트 : 규모 있는 기능을 쪼개서 태그 하나로 사용할 수 있게 한다. 보통은 HTML 요소 하나 이상으로 구성되어 있고 템플릿을 포함.
- 믹스인 : 로직을 여러 컴포넌트나 인스턴스에서 공유할 수 있도록 재사용 가능한 코드로 분리.
- 커스텀 지시자 :  하위 DOM 요소에 대한 접근에 초점이 맞추어져 있다.

모든 커스텀 지시자는 "v-"로 시작한다.

    <div id='app'>
          <p v-style-me>
              {{welcome}}
          </p>
          <div v-style-me>안녕하세요 여러분</div>
      </div>
    <script>
      new Vue({
        el: '#app',
        data() {
          return {
            welcome: '안녕하세요'
          }
        },
        directives: {
          styleMe(el, binding, vnode, oldVnode) {
            bind: {
              el.style.color = "blue"
              el.style.fontSize= "42px";
              el.className="text-center";
            }
          }
        }
      });
    </script>

위 예제에서 볼 수 있듯이 directives 옵션에서 커스텀 지시자를 생성해줄 수 있다. 

모든 지시자는 훅 하나는 명시를 해야 한다. 지시자가 사용할 수 있는 훅들은 아래와 같다.

- `bind`: 지시자가 처음 엘리먼트에 바인딩 될 때 한번만 호출. 이곳에서 일회성 설정을 할 수 있습니다.
- `inserted`: 바인딩 된 엘리먼트가 부모 노드에 삽입 되었을 때 호출. (이것은 부모 노드 존재를 보장하며 반드시 document 내에 있는 것은 아닙니다.)

    **→ 여기서 document라는 것이 무엇인지 잘 모르겠다. DOM 전체를 얘기하는 거라면 document 내에 있지 않을 수도 있다는 것이 말이 안된다...**

- `update`: 포함하는 컴포넌트가 업데이트 된 후 호출. **그러나 자식이 업데이트 되기 전일 가능성이 있습니다** 디렉티브의 값은 변경되었거나 변경되지 않았을 수 있지만 바인딩의 현재 값과 이전 값을 비교하여 불필요한 업데이트를 건너 뛸 수 있습니다. (아래의 훅 전달인자를 참고)
- `componentUpdated`: 포함하고 있는 컴포넌트와 **그 자식들** 이 업데이트 된 후에 호출.
- `unbind`: 지시자가 엘리먼트로부터 언바인딩된 경우에만 한번 호출.

그리고 각 지시자는 아래와 같이 여러 인자에 접근할 수 있다.

- `el`: 디렉티브가 바인딩된 엘리먼트. 이 것을 사용하면 DOM 조작을 할 수 있습니다.
- `binding`: 아래의 속성을 가진 객체.
    - `name`: 디렉티브 이름, `v-` 프리픽스가 없습니다.
    - `value`: 디렉티브에서 전달받은 값. 예를 들어 `v-my-directive="1 + 1"`인 경우 value는 `2` 입니다.
    - `oldValue`: 이전 값. `update`와 `componentUpdated`에서만 사용할 수 있습니다. 이를 통해 값이 변경되었는지 확인할 수 있습니다.
    - `expression`: 표현식 문자열. 예를 들어 `v-my-directive="1 + 1"`이면, 표현식은 `"1 + 1"` 입니다.
    - `arg`: 디렉티브의 전달인자, 있는 경우에만 존재합니다. 예를 들어 `v-my-directive:foo` 이면 `"foo"` 입니다.
    - `modifiers`: 포함된 수식어 객체, 있는 경우에만 존재합니다. 예를 들어 `v-my-directive.foo.bar`이면, 수식어 객체는 `{ foo: true, bar: true }`입니다.
- `vnode`: Vue 컴파일러가 만든 가상 노드.
- `oldVnode`: 이전의 가상 노드. `update`와 `componentUpdated`에서만 사용할 수 있습니다.

### 전역 커스텀 지시자

아래 예제를 보면

Vue.directive를 사용하여 전역으로 커스텀 지시자를 생성.

커스텀 지시자의 value에 색상을, modifiers에 폰트 사이즈를(small과 large로 나누어서), arg에 클래스 네임을 바인딩해주었다.

`**:(콜론)` 뒤에 있는 것이 arg, `.(dot)` 뒤에 있는 것이 modifier, `=` 뒤에 위치하는 것이 value.**

그런데 책에서 text-center가 value이고 색상인 red가 arg라고 설명되어 있는 부분이 있었는데, 이는 잘못된 것이다.

    <body>
      <div id='app'>
          <p v-style-me:text-center.large="'red'">
              {{welcome}}
          </p>
          <div v-style-me.small>안녕하세요 여러분</div>
      </div>
    <script>
      Vue.directive('style-me', {
        bind(el, binding) {
          el.style.color = binding.value || "blue";
    
          if (binding.modifiers.large)
            el.style.fontSize = "42px";
          else if (binding.modifiers.small)
            el.style.fontSize = "17px";
    
          el.className = binding.arg;
        }
      });
    
      new Vue({
        el: '#app',
        data() {
          return {
            welcome: '안녕하세요'
          }
        }
      });
    </script>

## 렌더 함수와 JSX

Vue는 템플릿을 사용하여 대다수의 경우 HTML을 작성할 것을 권장. 그러나 JavaScript를 이용할 필요가 있는 경우가 있다. render 함수를 사용하여 컴포넌트를 생성할 수 있다.

    <script type="text/x-template" id="anchored-heading-template">
      <h1 v-if="level === 1">
        <slot></slot>
      </h1>
      <h2 v-else-if="level === 2">
        <slot></slot>
      </h2>
      <h3 v-else-if="level === 3">
        <slot></slot>
      </h3>
      <h4 v-else-if="level === 4">
        <slot></slot>
      </h4>
      <h5 v-else-if="level === 5">
        <slot></slot>
      </h5>
      <h6 v-else-if="level === 6">
        <slot></slot>
      </h6>
    </script>

    Vue.component('anchored-heading', {
      template: '#anchored-heading-template',
      props: {
        level: {
          type: Number,
          required: true
        }
      }
    })

위 컴포넌트 템플릿은 한 눈에 봐도 너무 장황하다. 위의 경우처럼 props로 전달받는 값에 따라 렌더되는 요소가 달라져야 한다면 render 함수로 만드는 것이 효율적이다.

    Vue.component('anchored-heading', {
      render: function (createElement) {
        return createElement(
          'h' + this.level,   // 태그 이름
          this.$slots.default // 자식의 배열
        )
      },
      props: {
        level: {
          type: Number,
          required: true
        }
      }
    })

훨씬 간단해졌다! 그리고 anchored-heading 안에 Hello world!와 같이 slot 속성 없이 자식 노드가 있을 때 그것들은 **$slots.default**로 접근할 수 있다.

공식문서를 렌더 함수 파트를 살펴보면서 아래 두 파트도 함께 보았는데, 충분히 보면 좋을 것 같은 내용이었습니다.

- [**버추얼 DOM**](https://kr.vuejs.org/v2/guide/render-function.html#버추얼-DOM)
- [**createElement 전달인자](https://kr.vuejs.org/v2/guide/render-function.html#createElement-전달인자)**

***이미 개인적으로는 리액트에서 접한 내용이기도 하고, 책에서 JSX 설명 하기 위한 내용들은 장황했습니다. Vue에서 엄청 중요한 파트도 아닐 것 같아서 그냥 뺐습니다.* 

***인용문 처리되어있는 부분은 모두 공식문서에서 그대로 가져왔습니다.*

---

### 참고 자료

[https://kr.vuejs.org/v2/guide/mixins.html](https://kr.vuejs.org/v2/guide/mixins.html)

[https://kr.vuejs.org/v2/guide/custom-directive.html](https://kr.vuejs.org/v2/guide/custom-directive.html)

[https://kr.vuejs.org/v2/guide/render-function.html](https://kr.vuejs.org/v2/guide/render-function.html)