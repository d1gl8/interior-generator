<script setup lang="ts"></script>

<template>
  <footer class="app-footer">
    <div class="problems">
      <in-svg src="/img/icon/info.svg" />
      <span>
        {{ $t("cleanerPhotoPage.problems") }}
      </span>
    </div>
    <div class="mail">
      <in-svg src="/img/icon/mail.svg" />
      <span>
        {{ $t("cleanerPhotoPage.mail") }}
      </span>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.app-footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  svg {
    width: 24rem;
    height: 24rem;
  }
  div {
    display: flex;
    align-items: center;
    font-size: 18rem;
    line-height: 23rem;
    &.problems {
      color: var(--color-link);
      svg {
        margin-right: 8rem;
      }
    }
    &.mail {
      svg {
        margin-right: 6rem;
      }
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
