<!--

  RegisterDBG.vue

  Used to register a new user on our site ;-)

  Jan 01 2019   Initial
  Jan 15 2019   vee-validate Not working ;-(

-->
<template>
  <ValidationObserver ref="logobserver">
    <template slot-scope="{ invalid, validated }">
      <div>
        <!-- The input area -->
        <h3>{{ Version }}</h3>

        <v-card-text>
          <v-form>
            <!-- Password -->
            <div class="row">
              <div class="col-4"></div>
              <div class="form-group col-4">
                <ValidationProvider
                  vid="password"
                  name="password"
                  rules="required|min:6|confirmed:passconf"
                >
                  <v-text-field
                    slot-scope="{ errors, valid }"
                    v-model="password"
                    :error-messages="errors"
                    :success="valid"
                    label="Password"
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
                  rules="required|min:6|confirmed:password"
                >
                  <v-text-field
                    slot-scope="{ errors, valid }"
                    v-model="passwordctl"
                    :error-messages="errors"
                    :success="valid"
                    label="Password again"
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
    </template>
  </ValidationObserver>
</template>

<script>
  import { ValidationObserver, ValidationProvider } from "vee-validate";
  const myenv = require("../../config/myenv");

  export default {
    data: () => ({
      Version: "registerDBG 1.30, Jan 15 2019",
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
