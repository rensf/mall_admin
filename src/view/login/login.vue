<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入用户名和密码即可登录</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from "_c/login-form";
import { mapActions } from "vuex";
export default {
  components: {
    LoginForm,
  },
  methods: {
    ...mapActions(["handleLogin", "getUserInfo"]),
    handleSubmit({ username, password, grant_type }) {
      this.$postRequest("/auth/oauth/token", { username, password, grant_type }).then(
        (res) => {
          let data = res.data.result;
          this.$store.commit("setToken", data.token_type + ' ' + data.access_token);
          this.$router.push({
            name: this.$config.homeName
          });
        }
      );
    },
  },
};
</script>

<style lang="less">
@import "./login.less";
</style>
