<template>
  <div class="mail">
    <in-svg src="/img/icon/mail.svg" />
    <span> contact@artixel.io </span>
  </div>
</template>

<style lang="scss">
.mail {
  display: flex;
  align-items: center;
  color: var(--color-placeholder);
  svg {
    width: 20rem;
    height: 20rem;
    margin-right: 6rem;
  }
  span {
    @include reg-17;
  }
}
</style>
