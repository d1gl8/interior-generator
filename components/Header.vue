<script setup lang="ts"></script>

<template>
  <header class="artixel-logo">
    <in-svg src="/img/logo.svg" />
    <h1>Clear your interior photo of unwanted furniture</h1>
  </header>
</template>

<style lang="scss">
.artixel-logo {
  grid-area: "header";
  text-align: center;
  margin-top: 162rem;
  svg {
    width: 247rem;
    height: 49rem;
    margin: 0 auto 62rem;
  }
  h1 {
    font-size: 26rem;
    font-weight: 600;
    line-height: 33rem;
    margin-bottom: 60rem;
  }

  @include tablet {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: unset;
    margin-top: unset;
    margin-bottom: 42rem;
    svg {
      margin: unset;
    }
    h1 {
      @include text-body;
      margin-bottom: unset;
    }
  }

  @include tabAlb {
    justify-content: flex-start;
    svg {
      margin-right: 36rem;
    }
  }
}
</style>
