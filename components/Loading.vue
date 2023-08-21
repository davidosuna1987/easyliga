<template>
  <div class="easy-loading-component">
    <div class="spinner animate-spin"></div>
  </div>
</template>

<style lang="scss">
.easy-loading-component {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  display: grid;
  place-content: center;

  .spinner {
    display: inline-block;
    width: 50px;
    height: 50px;
    border: 3px solid var(--primary-color);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
    -webkit-animation: spin 1s ease-in-out infinite;
  }
}

@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}

@-webkit-keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>
