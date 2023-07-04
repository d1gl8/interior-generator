<template>
  <footer class="contacts">
    <div class="problems" @click="$emit('clickProblems')">
      <in-svg src="/img/icon/info.svg" />
      <span>
        {{ $t("cleanerPhotoPage.problems") }}
      </span>
    </div>
    <mail />
  </footer>
</template>

<style lang="scss" scoped>
.contacts {
  width: calc(100% + calc(var(--cleaner-padding-x) * 2));
  display: flex;
  justify-content: space-between;
  background-color: var(--color-secondary-button);
  padding: 20rem var(--cleaner-padding-x);
  .problems {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: var(--color-text);
    svg {
      width: 20rem;
      height: 20rem;
      margin-right: 8rem;
    }
    span {
      @include reg-17;
    }
  }
  @include tablet {
    justify-content: flex-start;
    margin-top: unset;
    .problems {
      margin-right: 50rem;
    }
  }
}
</style>
