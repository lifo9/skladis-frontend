<template>
  <section class="text-blueGray-700">
    <div class="container items-center px-5 py-12 lg:px-20">
      <div
        class="
            flex flex-col
            w-full
            max-w-md
            p-10
            mx-auto
            my-6
            transition
            duration-500
            ease-in-out
            transform
            bg-white
            rounded-lg
            md:mt-0
          "
      >
        <form class="space-y-6" @submit.prevent="signin">
          <div
            v-if="error"
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span class="block sm:inline">{{ error }}</span>
          </div>
          <div class="mt-1">
            <label
              for="email"
              class="block text-sm font-medium text-neutral-600 mb-1"
              >Email address</label
            >
            <input
              v-model="email"
              type="email"
              class="
                block
                w-full
                px-5
                py-3
                text-base text-neutral-600
                placeholder-gray-300
                transition
                duration-500
                ease-in-out
                transform
                border border-transparent
                rounded-lg
                bg-gray-50
                focus:outline-none
                focus:border-transparent
                focus:ring-2
                focus:ring-white
                focus:ring-offset-2
                focus:ring-offset-gray-300
              "
              id="email"
              placeholder="email@example.com"
            />
          </div>
          <div class="space-y-1">
            <label
              for="password"
              class="block text-sm font-medium text-neutral-600 mb-1"
              >Password</label
            >
            <input
              v-model="password"
              type="password"
              class="
                block
                w-full
                px-5
                py-3
                text-base text-neutral-600
                placeholder-gray-300
                transition
                duration-500
                ease-in-out
                transform
                border border-transparent
                rounded-lg
                bg-gray-50
                focus:outline-none
                focus:border-transparent
                focus:ring-2
                focus:ring-white
                focus:ring-offset-2
                focus:ring-offset-gray-300
              "
              id="password"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            class="
              flex
              items-center
              justify-center
              w-full
              px-10
              py-4
              text-base
              font-medium
              text-center text-white
              transition
              duration-500
              ease-in-out
              transform
              bg-blue-400
              rounded-xl
              hover:bg-blue-500
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-blue-500
            "
          >
            Sign in
          </button>
          <div>
            <router-link to="/signup">Sign up</router-link>
            <br />
            <router-link to="/forgot_password">Forgot Password</router-link>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  created () {
    this.checkSignedIn()
  },
  updated () {
    this.checkSignedIn()
  },
  methods: {
    signin () {
      this.$http.plain
        .post('/signin', { email: this.email, password: this.password })
        .then(response => this.signinSuccessful(response))
        .catch(error => this.signinFailed(error))
    },
    signinSuccessful (response) {
      if (!response.data.csrf) {
        this.signinFailed(response)
        return
      }
      this.$http.plain
        .get('/me')
        .then(meResponse => {
          this.$store.commit('setCurrentUser', {
            currentUser: meResponse.data,
            csrf: response.data.csrf
          })
          this.error = ''
          this.$router.replace('/admin')
        })
        .catch(error => this.signinFailed(error))
    },
    signinFailed (error) {
      this.error =
        (error.response && error.response.data && error.response.data.error) ||
        ''
      this.$store.commit('unsetCurrentUser')
    },
    checkSignedIn () {
      if (this.$store.state.signedIn) {
        this.$router.replace('/admin')
      }
    }
  }
}
</script>
