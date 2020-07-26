---
title: 제 10장 Vuex
date: 2020-03-12
tags: ['Vuex', '이벤트 버스']
series: true
canonical_url: false
description: "Vuex는 React 진영에서의 Redux와 같은 상태관리 라이브러리.
Redux는 Flux로부터 영감을 받았고, Vuex는 공식문서에서 Flux와 Redux 둘 다로부터 영감을 받았다고 한다. 
Vue도 리액트와 마찬가지로 props로 데이터를 부모에서 자식으로 전달할 수 있고, 커스텀 이벤트로 자식에서 부모로 전달할 수도 있다. 심지어 이벤트 버스라는 것을 사용해서 부모 자식 관계가 아닌 컴포넌트 간에도 데이터를 주고 받을 수가 있다. 
"
---

** 공식문서에 있는 설명 그대로 가져온 부분이 많습니다. 공식문서에서 그대로 가져온 설명은 '기울임(italicized)' 처리가 되어 있습니다.

## Vuex, 뭐가 좋을까?

Vuex는 React 진영에서의 Redux와 같은 상태관리 라이브러리. 

Redux는 [Flux](https://facebook.github.io/flux/docs/in-depth-overview)로부터 영감을 받았고, Vuex는 공식문서에서 Flux와 Redux 둘 다로부터 영감을 받았다고 한다. 

Vue도 리액트와 마찬가지로 props로 데이터를 부모에서 자식으로 전달할 수 있고, 커스텀 이벤트로 자식에서 부모로 전달할 수도 있다. 심지어 **이벤트 버스**라는 것을 사용해서 부모 자식 관계가 아닌 컴포넌트 간에도 데이터를 주고 받을 수가 있다. 

**부모-자식 간이 아닌 컴포넌트 사이의 통신(by 이벤트 버스)**

    // event-bus.ts ; 컴포넌트 간의 통신을 위해 이벤트 버스용 파일을 하나 생성
    import Vue from 'vue';
    
    export default new Vue();

    // 컴포넌트 A의 메소드
    bus.$emit('id-selected', 1)

    // 컴포넌트 B의 created 훅
    bus.$on('id-selected', function (id) {
      // ...
    })

통신이 필요한 두 컴포넌트 모두 이벤트 버스(비어있는 Vue 인스턴스)를 import로 불러와서 원하는 이벤트를 발생시키고 받아와서 데이터를 주고 받을 수 있다.

하지만 애플리케이션 규모가 커지고 수많음 컴포넌트들이 존재한다면 위에 언급했던 방식들로만 상태 관리를 하기에는 쉽지 않다. 이러한 경우에 Vuex를 통해 상태 관리하는 것이 효율적.

## State & Mutation

*모든 Vuex 애플리케이션의 중심에는 **store** 가 있습니다. "저장소"는 기본적으로 애플리케이션 **상태** 를 보유하고있는 컨테이너입니다. Vuex 저장소가 일반 전역 객체와 두 가지 다른 점이 있습니다.*

1. ***Vuex store는 반응형 입니다. Vue 컴포넌트는 상태를 검색할 때 저장소의 상태가 변경되면 효율적으로 대응하고 업데이트합니다.*** → store 내부가 변경되면 store의 state를 사용하고 있는 모든 컴포넌트들이 자동적으로 업데이트 된다는 얘기.
2. ***저장소의 상태를 직접 변경할 수 없습니다. 저장소의 상태를 변경하는 유일한 방법은 명시적인 커밋을 이용한 변이 입니다. 이렇게하면 모든 상태에 대한 추적이 가능한 기록이 남을 수 있으며 툴을 사용하여 앱을 더 잘 이해할 수 있습니다.*** → 커밋으로 코드를 변경하는 Git이 떠오르는 대목. 애플리케이션 내 상태가 어떻게 사용되고 관리되는지에 대한 이해 그리고 디버깅을 위해서도 매우 중요한 부분일 것이다.

***Vue 컴포넌트에서 저장소 내부의 상태를 어떻게 표시하나요?*** 

*Vuex 저장소는 반응적이기 때문에 저장소에서 상태를 "검색"하는 가장 간단한 방법은 계산된 속성(computed)내에서 일부 저장소 상태를 가져오는 것입니다.* → computed가 아닌 data 옵션에서 사용해도 될 것 같은데 공식 문서에서는 computed를 추천하고 아래의 코딩 공작소 책 예제에서도 computed 속성을 사용하여 store의 상태 데이터에 접근하고 있다.

**Vue 컴포넌트에서 저장소 내부의 상태를 어떻게 업데이트하나요?** 

mutations 객체 내부에 각 상태 데이터를 업데이트하기 위한 함수를 만들어 줄 수 있다. 그리고 store.commit 메소드로만 mutations에 내부의 함수를 실행시킬 수 있다.

    <script>
        const store = new Vuex.Store({
          state: {
            msg: 'Hello World',
            count: 0
          },
          mutations: {
            increment(state, payload) {
              state.count += payload;
            }
          }
        });
    
        new Vue({
            el: '#app',
            data() {
              return {
                header: 'Vuex App'
              }
            },
            computed: {
              welcome() {
                return store.state.msg;
              },
              counter() {
                return store.state.count;
              }
            },
            methods: {
              increment() {
                store.commit('increment', 10);
              }
            }
          });
      </script>

**state를 직접 변경하기보다 mutations를 통해서 업데이트 하는 이유**

*store.state.count를 직접 변경하는 대신 변이를 수행하는 이유는 명시적으로 추적을 하기 때문입니다. 이 간단한 규칙에 따라 의도를보다 명확하게 표현할 수 있으므로 코드를 읽을 때 상태 변화를 더 잘 지켜볼 수 있습니다. 또한 모든 변이를 기록하고 상태 스냅샷을 저장하거나 시간 흐름에 따라 디버깅을 할 수 있는 도구를 제공합니다.*

 

❇︎ commit 메소드 사용시 두번째 인자를 활용하여 mutations 함수에 데이터를 전달할 수도 있다. payload라고 부르는데, 컴퓨터 용어로 전송되는 데이터를 지칭할 때 많이 사용하는 용어로 알고 있다. Redux에서도 마찬가지로 payload라는 용어를 사용했었다.

## Getters & Actions

때로는 store의 state를 가져와서 또 계산해야 할 수도 있다.

    computed: {
      doneTodosCount () {
        return this.$store.state.todos.filter(todo => todo.done).length
      }
    }

*Vuex를 사용하면 저장소에서 "getters"를 정의 할 수 있습니다. 저장소의 계산된 속성으로 생각할 수 있습니다. 계산된 속성처럼 getter의 결과는 종속성에 따라 캐쉬되고, 일부 종속성이 변경된 경우에만 다시 재계산 됩니다.*

    const store = new Vuex.Store({
      state: {
        todos: [
          { id: 1, text: '...', done: true },
          { id: 2, text: '...', done: false }
        ]
      },
      getters: {
        doneTodos: state => {
          return state.todos.filter(todo => todo.done)
        }
      }
    })

Mutations는 동기적으로만 사용할 수 있고, 비동기 연산을 위해서는 Actions를 사용해야 한다. Mutations는 state를 직접 업데이트하는 코드이지만, Actions는 그러한 Mutations를 커밋하는 구조를 가지고 있다. 이러한 구조 때문에 비동기 연산이 가능한 것으로 보인다. 

리덕스에서는 비동기 작업을 위해 따로 미들웨어를 사용했어야 했는데, 내부적으로 어떻게 되길래 Vue에서는 이렇게 가능한 것인지 모르겠지만, Vuex 자체적으로 이러한 부분이 가능해서 더 간편하게 느껴진다.

    const store = new Vuex.Store({
      state: {
        count: 0
      },
      mutations: {
        increment (state) {
          state.count++
        }
      },
      actions: {
    	   incrementAsync ({ commit }) {
    	    setTimeout(() => {
    	      commit('increment')
    	    }, 1000)
    	  }
      }
    })

액션의 경우 dispatch 메소드를 사용한다. commit 메소드와 마찬가지로 payload를 전달할 수 있는데, 다만 객체 형식으로 전달 가능하다.

    // 페이로드와 함께 디스패치
    store.dispatch('incrementAsync', {
      amount: 10
    })

그리고 비동기 연산의 각 프로세스를 기록하는 것도 가능하다. 공식문서에서도 볼 수 있듯이 보통 요청, 성공, 실패로 액션 결과를 기록한다. 해당 비동기 작업이 이루어질 때 사용자가 인식할 수 있도록 프론트에서 요긴하게 쓰일 수 있다.

    actions: {
      checkout ({ commit, state }, products) {
        // 장바구니에 현재있는 항목을 저장하십시오.
        const savedCartItems = [...state.cart.added]
    
        // 결제 요청을 보낸 후 장바구니를 비웁니다.
        commit(types.CHECKOUT_REQUEST)
    
        // 상점 API는 성공 콜백 및 실패 콜백을 받습니다.
        shop.buyProducts(
          products,
          // 요청 성공 핸들러
          () => commit(types.CHECKOUT_SUCCESS),
          // 요청 실패 핸들러
          () => commit(types.CHECKOUT_FAILURE, savedCartItems)
        )
      }
    }

## Helpers

Vuex 스토어에 정의된 state, getters, actions, mutations이 많아지면 각 컴포넌트의 computed나 methods 속성에 각각 추가하기가 어려워지고, 사용되는 코드의 양도 많아질 것이다. 이러한 부분에서 도움을 주기위해 Vuex는 헬퍼가 존재한다.

이렇게 책에서는 4가지 헬퍼를 소개한다. 이름만봐도 충분히 어떤 역할을 하는지 알 수가 있다.

- mapGetters
- mapState
- mapActions
- mapMutations

        computed: {
          ...mapState({
            a: state => state.some.nested.module.a,
            b: state => state.some.nested.module.b
          })
        },
        methods: {
          ...mapActions([
            'some/nested/module/foo', // -> this['some/nested/module/foo']()
            'some/nested/module/bar' // -> this['some/nested/module/bar']()
          ])
        }

*위의 예시 코드는 조금 장황한데, 이러한 경우에는 모듈의 네임스페이스 문자열을 헬퍼의 첫 번째 인수로 전달하여 해당 모듈을 컨텍스트로 사용하여 모든 바인딩을 할 수 있습니다.*

    computed: {
      ...mapState('some/nested/module', {
        a: state => state.a,
        b: state => state.b
      })
    },
    methods: {
      ...mapActions('some/nested/module', [
        'foo', // -> this.foo()
        'bar' // -> this.bar()
      ])
    }

## Module

*단일 상태 트리를 사용하기 때문에 애플리케이션의 모든 상태가 하나의 큰 객체 안에 포함됩니다. 그러나 규모가 커짐에 따라 저장소는 매우 비대해질 수 있습니다.*

*이를 위해 Vuex는 저장소를 **모듈** 로 나눌 수 있습니다. 각 모듈은 자체 상태, 변이, 액션, 게터 및 심지어 중첩된 모듈을 포함 할 수 있습니다.*

아래 코드는 store폴더의 index.ts파일(현재 작업하고 있는 회사 프로젝트 코드인데, 이 정도 가져오는 것은 문제 될 것은 없다고 생각했다.)

auth라는 모듈이 store/modules/auth 폴더 내에 생성되어 있고, import로 불러와 사용하고 있는 것을 볼 수 있다.

    import { auth } from "./modules/auth";
    
    Vue.use(Vuex);
    const store = new Vuex.Store<RootState>({
    	state: {
    		isLoading: false,
    		isLogin: false,
    		property: {
    			email: ""
    		}
    	},
    	mutations: {},
    	actions: {},
    	modules: {
    		auth
    	}
    });
    export default store

**네임스페이스**

*기본적으로 모듈 내의 액션, 변이 및 getter는 여전히 **전역 네임 스페이스** 아래에 등록됩니다. 여러 모듈이 동일한 변이/액션 유형에 반응 할 수 있습니다.*

*만약 모듈이 독립적이거나 재사용되기를 원한다면, `namespaced: true`라고 네임스페이스에 명시하면 됩니다. 모듈이 등록될 때, 해당 모듈의 모든 getter, 액션/변이는 자동으로 등록된 모듈의 경로를 기반으로 네임스페이스가 지정됩니다.*

    const store = new Vuex.Store({
      modules: {
        account: {
          namespaced: true,
    
          // 모듈 자산
          state: { ... }, // 모듈 상태는 이미 중첩되어 있고, 네임스페이스 옵션의 영향을 받지 않음
          getters: {
            isAdmin () { ... } // -> getters['account/isAdmin']
          },
          actions: {
            login () { ... } // -> dispatch('account/login')
          },
          mutations: {
            login () { ... } // -> commit('account/login')
          },
    
          // 중첩 모듈
          modules: {
            // 부모 모듈로부터 네임스페이스를 상속받음
            myPage: {
              state: { ... },
              getters: {
                profile () { ... } // -> getters['account/profile']
              }
            },
    
            // 네임스페이스를 더 중첩
            posts: {
              namespaced: true,
    
              state: { ... },
              getters: {
                popular () { ... } // -> getters['account/posts/popular']
              }
            }
          }
        }
      }
    })