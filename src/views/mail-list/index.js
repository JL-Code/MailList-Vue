import Component from "./src/MailList";

Component.install = Vue => {
  Vue.component(Component.name, Component); // 全局注册组件
};

export default Component;
