<template>
  <transition name="slide">
    <slot></slot>
  </transition>
</template>

<script>
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
	transition: all 0.2s;
}

.slide-enter,
.slide-leave-to {
	transform: translate3d(30%, 0, 0);
	opacity: 0;
}
</style>