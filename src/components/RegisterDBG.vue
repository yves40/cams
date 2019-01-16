<!--

  RegisterDBG.vue

  Used to register a new user on our site ;-)

  Jan 01 2019   Initial
  Jan 15 2019   vee-validate Not working ;-(
  Jan 16 2019   vee-validate Not working ;-( Fortunately we've one running well in packt samples

-->
<template>
  <ValidationObserver>
    <div slot-scope="{ invalid, validated }">
      <v-card-title>{{ Version }}</v-card-title>
      <!-- The input area -->
      <v-card-text>
        <v-form>
          <!-- Name -->
          <div class="row">
            <div class="col-4"></div>
            <div class="form-group col-4">
              <ValidationProvider name="name" rules="required|min:4|max:20">
                <v-text-field
                  slot-scope="{ errors, valid }"
                  v-model="name"
                  :error-messages="errors"
                  :success="valid"
                  label="Name"
                  required
                ></v-text-field>
              </ValidationProvider>
            </div>
            <div class="col-4"></div>
          </div>
          <!-- Mail -->
          <div class="row">
            <div class="col-4"></div>
            <div class="form-group col-4">
              <ValidationProvider name="email" rules="required|email">
                <v-text-field
                  slot-scope="{ errors, valid }"
                  v-model="email"
                  :error-messages="errors"
                  :success="valid"
                  label="E-mail"
                  required
                ></v-text-field>
              </ValidationProvider>
            </div>
            <div class="col-4"></div>
          </div>
          <!-- Password -->
          <div class="row">
            <div class="col-4"></div>
            <div class="form-group col-4">
              <ValidationProvider
                name="password"
                rules="required|min:6|confirmed:passconf"
              >
                <v-text-field
                  slot-scope="{ errors, valid }"
                  v-model="password"
                  :error-messages="errors"
                  :success="valid"
                  label="Password"
                  required
                  type="text"
                ></v-text-field>
              </ValidationProvider>
            </div>
            <div class="col-4"></div>
          </div>
          <!-- Password control -->
          <div class="row">
            <div class="col-4"></div>
            <div class="form-group col-4">
              <ValidationProvider
                vid="passconf"
                name="passwordctl"
                rules="required"
              >
                <v-text-field
                  slot-scope="{ errors, valid }"
                  v-model="passwordctl"
                  :error-messages="errors"
                  :success="valid"
                  label="Password again"
                  required
                  type="text"
                ></v-text-field>
              </ValidationProvider>
            </div>
            <div class="col-4"></div>
          </div>
        </v-form>
      </v-card-text>
      <!-- Buttons -->
      <div class="row">
        <v-card-actions>
          <div class="col"></div>
          <div class="col"><v-btn @click="clear">Clear</v-btn></div>
          <div class="col">
            <v-btn
              color="primary"
              @click="submit"
              :disabled="invalid || !validated"
              >Register</v-btn
            >
          </div>
          <div class="col"></div>
        </v-card-actions>
      </div>
    </div>
  </ValidationObserver>
</template>

<script>
  import { ValidationObserver, ValidationProvider } from "vee-validate";
  const myenv = require("../../config/myenv");

  export default {
    data: () => ({
      Version: "registerDBG 1.34, Jan 16 2019",
      name: "",
      email: "",
      password: "",
      passwordctl: ""
    }),
    components: {
      ValidationProvider,
      ValidationObserver
    },
    methods: {
      async clear() {
        this.name = this.password = this.email = this.passwordctl = "";
      },
      // All rules satisfied otherwise button is disabled
      submit() {
        this.$log.debug("Submit called ");
      }
    }
  };
</script>
