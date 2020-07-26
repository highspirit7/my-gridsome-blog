---
title: 8장 Transition & Animation
date: 2020-03-07
tags: ['transition']
series: true
canonical_url: false
description: "Vue는 transition 컴포넌트를 제공하여 모든 엘리먼트나 컴포넌트가 DOM에 삽입, 갱신 또는 제거될 때 트랜지션을 적용할 수 있게 해준다."
---

공식 문서가 정리가 워낙 잘 되어 있어서 거의 공식문서를 그대로 많이 가져와서 정리하였다.

## 트랜지션 기본

Vue는 transition 컴포넌트를 제공하여 모든 엘리먼트나 컴포넌트가 DOM에 삽입, 갱신 또는 제거될 때 트랜지션을 적용할 수 있게 해준다.

**transition 래퍼 컴포넌트 내부에서 사용할 수 있는 것들**

- 조건부 렌더링 (`v-if` 사용)
- 조건부 출력 (`v-show` 사용)
- 동적 컴포넌트
- 컴포넌트 루트 노드

### 트랜지션 클래스

1. `v-enter`: enter의 시작 상태. 엘리먼트가 삽입되기 전에 적용되고 한 프레임 후에 제거됩니다.
2. `v-enter-active`: enter에 대한 활성 및 종료 상태. 엘리먼트가 삽입되기 전에 적용됩니다. 트랜지션 / 애니메이션이 완료되면 제거됩니다.
3. `v-enter-to`: **2.1.8 이상 버전에서 지원합니다.** 진입 상태의 끝에서 실행됩니다. 엘리먼트가 삽입된 후 (동시에 `v-enter`가 제거됨), 트랜지션/애니메이션이 끝나면 제거되는 하나의 프레임을 추가했습니다.
4. `v-leave`: leave를 위한 시작 상태. 진출 트랜지션이 트리거 될 때 적용되고 한 프레임 후에 제거됩니다.
5. `v-leave-active`: leave에 대한 활성 및 종료 상태. 진출 트랜지션이 트리거되면 적용되고 트랜지션 / 애니메이션이 완료되면 제거됩니다.
6. `v-leave-to`: **2.1.8 이상 버전에서 지원합니다.** 진출 상태의 끝에서 실행됩니다. 진출 트랜지션이 트리거되고 (동시에 `v-leave`가 제거됨), 트랜지션/애니메이션이 끝나면 제거되는 하나의 프레임을 추가했습니다.

아래 예제는 Toggle 버튼 클릭 시 show 불리언 데이터가 바뀌면서 p태그를 v-if를 활용하여 조건부 렌더링하는 코드.

transition 컴포넌트에 name 속성이 추가된 경우에는 해당 name 이름이 트랜지션 css 클래스에 추가된다.

    <div id="demo">
      <button v-on:click="show = !show">
        Toggle
      </button>
      <transition name="fade">
        <p v-if="show">hello</p>
      </transition>
    </div>

    new Vue({
      el: '#demo',
      data: {
        show: true
      }
    })

    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
    }

### 사용자 지정 트랜지션 클래스

다음 속성을 제공하여 사용자 정의 트랜지션 클래스를 지정할 수도 있습니다.

- `enter-class`
- `enter-active-class`
- `enter-to-class` (2.1.8+)
- `leave-class`
- `leave-active-class`
- `leave-to-class` (2.1.8+)

이것들은 원본 클래스 명을 오버라이드 합니다. 이는 Vue의 트랜지션 시스템을 **[Animate.css](https://daneden.github.io/animate.css/)**와 같은 기존 CSS 애니메이션 라이브러리와 결합하려는 경우 특히 유용.

아래 예제에서는 v-enter-active, v-leave-active css 클래스 네임을 아래와 같이 animated tada, animated bounceOutRight로 오버라이딩하였다.

    <transition
        name="custom-classes-transition"
        enter-active-class="animated tada"
        leave-active-class="animated bounceOutRight"
      >
        <p v-if="show">hello</p>
    </transition>

### 트랜지션 모드

[https://kr.vuejs.org/v2/guide/transitions.html#트랜지션-모드](https://kr.vuejs.org/v2/guide/transitions.html#%ED%8A%B8%EB%9E%9C%EC%A7%80%EC%85%98-%EB%AA%A8%EB%93%9C)

아래 설명을 제대로 이해하기 위해서는 위 공식문서 설명에서 눈으로 직접 확인하면서 하는게 좋다.

**이것이 왜 필요한지?**

다른 트랜지션이 진행되는 동안 하나의 트랜지션이 트랜지션됩니다. 이것은 <transition>의 기본 동작입니다 - 들어오고 나가는 것이 동시에 발생합니다.

동시 들어가고 떠나는 트랜지션이 항상 바람직한 것은 아니기 때문에 Vue는 몇 가지 대안을 제공한다.

- `in-out`: 처음에는 새로운 엘리먼트가 트랜지션되고, 완료되면 현재 엘리먼트가 트랜지션됩니다.
- `out-in`: 현재 엘리먼트가 먼저 트랜지션되고, 완료되면 새로운 요소가 바뀝니다.

---

## 애니메이션 기본

css 상에서 원하는 애니메이션 코드를 작성하면, 기본적으로 트랜지션과 같은 방식으로 Vue에서 동작한다.

**트랜지션과의 개념 차이**

트랜지션은 하나의 상태에서 다른 상태로 이동하는 것.

애니메이션은 여러 상태를 가지고 있을 수 있다. 애니메이션도 트랜지션처럼 효과를 사용할 수 있긴 하다.

**Vue에서 트랜지션과의 차이**

엘리먼트가 삽입 된 직후에 v-enter가 제거되지 않지만 animationend 이벤트에 있습니다. (공식 문서에 나와있어서 그대로 가져온 내용) 

⇒ 그렇다면 v-enter가 트랜지션의 경우에는 제거된다는 얘기인데, v-enter 자체가 엘리먼트가 삽입되기 전에 적용되고 한 프레임 후에 제거되기에 DOM에서 확인해볼 수도 없었고, 이 차이가 어떤 의미가 있는건지 기억해두어야할 가치가 있는 차이인지 모르겠다.

---

## 자바스크립트 훅

트랜지션에 진입하고 트랜지션을 마무리하는 프로세스 중에서 transition 컴포넌트가 제공하는 8가지 속성을 이용하여 각 단계별로 자바스크립트 훅을 정의할 수 있다.

꼭 아래 예제처럼 자바스크립트 훅 이름을 정의할 필요는 없지만 아래와 같이 하는게 제일 무난한 선택일 것이라고 본다. methods 객체에서 정의한 함수들을 트랜지션 컴포넌트의 자바스크립트 훅으로 사용할 수 있다.

    <transition
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:after-enter="afterEnter"
      v-on:enter-cancelled="enterCancelled"
    
      v-on:before-leave="beforeLeave"
      v-on:leave="leave"
      v-on:after-leave="afterLeave"
      v-on:leave-cancelled="leaveCancelled"
    >
      <!-- ... -->
    </transition>

    methods: {
      // --------
      // enter
      // --------
    
      beforeEnter: function (el) {
        // ...
      },
      // done 콜백은 CSS와 함께 사용할 때 선택 사항입니다.
      enter: function (el, done) {
        // ...
        done()
      },
      afterEnter: function (el) {
        // ...
      },
      enterCancelled: function (el) {
        // ...
      },
    
      // --------
      // leave
      // --------
    
      beforeLeave: function (el) {
        // ...
      },
      // done 콜백은 CSS와 함께 사용할 때 선택 사항입니다.
      leave: function (el, done) {
        // ...
        done()
      },
      afterLeave: function (el) {
        // ...
      },
      // leaveCancelled은 v-show와 함께 사용됩니다.
      leaveCancelled: function (el) {
        // ...
      }
    }

---

### Question(사실 상 책 내용 지적..)

동일한 태그 이름을 가진 요소에 key 속성을 추가해야 트랜지션 효과를 적용할 수 있다.

*'key에 아무 값도 넣지 않으면 트랜지션이 적용되지 않는다.*'라고 설명해야 맞다고 생각하는데 책에서는 key="" 이렇게 해놓고 *'다른 키를 추가해서 애니메이션이 일어나지 않습니다.'* 라고 설명한다. 번역을 잘못한건지 설명이 부정확했다고 보여진다.

코드 8-11 애완용품샵 트랜지션 요소에 애니메이션 추가하기 : chapter-08/petstore/src/components/Main.vue 파일

    <transition name="bounce" mode="out-in">
      <span class="inventory-message"
            v-if="product.availableInventory - cartCount(product.id) === 0" key="0">
          품절!
      </span>
    
      <span class="inventory-message"
            v-else-if="product.availableInventory - cartCount(product.id) < 5" key="1">
            **<!-- 이런 식으로 여기에도 key 값을 부여하면 애니메이션 적용된다. 
            그런데 책에서는 key="" 이렇게 해놓고 다른 키를 추가해서 
            애니메이션이 일어나지 않는다고 설명한다. -->**
          {{product.availableInventory - cartCount(product.id)}} 남았습니다!
      </span>
      <span class="inventory-message"
            v-else key="">지금 구매하세요!
      </span>
    </transition>