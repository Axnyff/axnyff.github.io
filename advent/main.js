"use strict";
const container = new Vue({
  el: "#app",
  data: {
    stack: [],
    inputValue: "",
    showStack: false,
  },
  methods: {
    onSubmit() {
      const items = this.inputValue.split(" ");
      this.inputValue = "";
      items.forEach((item) => {
        const number = parseInt(item, 10);
        if (!Number.isNaN(number)) {
          this.stack.push(number);
        }
      });
    },
  },
});
