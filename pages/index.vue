<script setup lang="ts">
const TEXT = {
  title: "A new way of interior creation",
  subtitle:
    "AI-based tools you need for interior design, decoration and furnishing",
  whom: [
    {
      title: "For end customers",
      text: "An effortless way to design your desired interior and order all necessary materials and furniture.",
    },
    {
      title: "For manufactures and sellers",
      text: "An interactive selling channel that connects you with potential customers and boosts your sales.",
    },
    {
      title: "For designers",
      text: "Multiple design projects with real SKUs, making it easier to discuss designs with your clients.",
    },
  ],
  solutions: {
    title: "Our solutions",
    items: [
      {
        title: "Interior cleaner",
        text: `AI automatically detects and removes all the furniture.\n\n After that you can get back any erased objects you need to stay in the room and erase manually any objects ai couldn’t erase.`,
        img: "/img/promo/solution-cleaner.webp",
      },
      {
        title: "Surface decorator",
        text: `AI detects the walls, floor and ceiling. After that you can choose new decorations for each type of surface from vast selection, compare several design projects, get calculations of material amount needed, buy it in our online-store (in progress) or just get the picture.`,
        img: "/img/promo/solution-decorator.webp",
      },
      {
        title: "Furniture sets advisor",
        text: `App will ask for your style preferences and limitations so that you could pick the best fitting sets of furniture, customize, place it on photo, buy it or share.`,
        img: "/img/promo/solution-furniture.webp",
      },
    ],
  },
  tryLink: "Try interior cleaner",
  footer: {
    copyright: "© Artixel 2023",
    mail: "contact@artixel.io",
  },
};
</script>

<template>
  <div class="artixel-promo">
    <header class="promo-header">
      <in-svg class="logo" src="/img/logo.svg" />
      <div class="artixel-mail">
        <in-svg src="/img/icon/mail.svg" />
        <p>{{ TEXT.footer.mail }}</p>
      </div>
    </header>
    <h1 class="promo-title">{{ TEXT.title }}</h1>
    <p class="promo-subtitle">{{ TEXT.subtitle }}</p>
    <div class="promo-img">
      <img src="/img/promo/img-before.webp" alt="img-before" />
      <img src="/img/promo/img-after.webp" alt="img-after" />
      <in-svg class="divider h" src="/img/promo/divider-horizontal.svg" />
      <in-svg class="divider v" src="/img/promo/divider-vertical.svg" />
      <in-svg class="wand" src="/img/promo/wand.svg" />
    </div>
    <ul class="artixel-whom">
      <li v-for="(itemFor, i) in TEXT.whom" :key="`whom-${i}`">
        <h3>{{ itemFor.title }}</h3>
        <p>{{ itemFor.text }}</p>
      </li>
    </ul>
    <main class="artixel-solutions">
      <h2>{{ TEXT.solutions.title }}</h2>
      <ul>
        <li
          v-for="(solution, i) in TEXT.solutions.items"
          :key="`solutions-${i}`"
        >
          <h3>{{ solution.title }}</h3>
          <p>{{ solution.text }}</p>
          <img loading="lazy" :src="solution.img" :alt="solution.title" />
        </li>
      </ul>
    </main>
    <nuxt-link class="try-cleaner" to="/cleaner"
      >Try interior cleaner</nuxt-link
    >
    <footer class="promo-footer">
      <p class="copyright">{{ TEXT.footer.copyright }}</p>
      <div class="artixel-mail">
        <in-svg src="/img/icon/mail.svg" />
        <p>{{ TEXT.footer.mail }}</p>
      </div>
    </footer>
  </div>
</template>

<style lang="scss">
.artixel-promo {
  --color-landing-background-2: #f6f6f4;
  --promo-main-padding-x: 20rem;

  position: relative;
  max-width: 1200rem;
  margin: 40rem var(--promo-main-padding-x) 0;

  .promo-header {
    display: flex;
    justify-content: center;
    margin-bottom: 60rem;
    .logo {
      width: 208rem;
      height: 42rem;
      padding-right: 20rem;
    }
    .artixel-mail {
      display: none;
    }
  }

  .promo-title,
  .promo-subtitle {
    text-align: center;
  }

  .promo-title {
    font-size: 40rem;
    line-height: 52rem;
    margin-bottom: 28rem;
  }

  .promo-subtitle {
    @include text-body;
    margin-bottom: 70rem;
  }

  .promo-img {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border-radius: 10rem;
    margin-bottom: 60rem;
    .divider {
      position: absolute;
      &.h {
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
      &.v {
        display: none;
      }
    }
    .wand {
      position: absolute;
      width: 60rem;
      height: 60rem;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .artixel-whom {
    list-style-type: none;
    padding: 0 20rem;
    margin-bottom: 60rem;
    li {
      &:not(:last-of-type) {
        margin-bottom: 40rem;
      }
      h3 {
        @include text-body;
        font-weight: bold;
        margin-bottom: 12rem;
      }
      p {
        @include reg-17;
      }
    }
  }

  .artixel-solutions {
    padding: 60rem 26rem;
    background-color: var(--color-landing-background-2);
    margin: 0 calc(var(--promo-main-padding-x) * -1);
    h2 {
      @extend .promo-title;
      text-align: left;
      margin-bottom: 60rem;
    }
    ul {
      list-style-type: none;
      li {
        &:not(:last-of-type) {
          padding-bottom: 50rem;
          border-bottom: 1rem solid rgba($color: #1a1a1a, $alpha: 0.1);
          margin-bottom: 54rem;
        }
        h3 {
          font-size: 24rem;
          margin-bottom: 40rem;
        }
        p {
          @include text-body;
          margin-bottom: 28rem;
        }
      }
    }
  }

  .try-cleaner {
    @include text-body;
    position: relative;
    display: block;
    width: max-content;
    text-decoration: none;
    font-weight: 700;
    color: var(--color-bright);
    background: linear-gradient(267.64deg, #54a812 0%, #4a8a18 100%);
    box-shadow: 0 2rem 0rem #3f800c;
    border-radius: 8rem;
    padding: 14rem 28rem 17rem;
    margin: 120rem auto;
    &::before,
    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: -1;
      width: calc(100vw - 40rem);
      height: 174rem;
      transform: translate(-50%, -50%);
      border-radius: 20rem;
    }
    &::before {
      background: linear-gradient(270.57deg, #fff59d 0%, #ffbff5 100%);
    }
    &::after {
      opacity: 0.6;
      background-image: url("/img/promo/pattern.svg");
    }
  }

  .promo-footer {
    @include reg-17;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--color-bright);
    background-color: var(--color-icon);
    padding: 9rem 20rem 13rem;
    margin: 0 calc(var(--promo-main-padding-x) * -1);
  }

  .artixel-mail {
    display: flex;
    align-items: center;
    svg {
      width: 16rem;
      margin-right: 8rem;
    }
    p {
      @include reg-17;
    }
  }

  @include laptop {
    --promo-main-padding-x: 40rem;

    .promo-header {
      align-items: center;
      justify-content: space-between;
      .artixel-mail {
        display: flex;
        color: var(--color-placeholder);
      }
    }

    .promo-title {
      font-size: 48rem;
      line-height: 54rem;
      margin-bottom: 32rem;
    }

    .promo-subtitle {
      margin-bottom: 77rem;
    }

    .promo-img {
      flex-direction: unset;
      margin-bottom: 72rem;
      img {
        width: 50%;
      }
      .divider {
        &.h {
          display: none;
        }
        &.v {
          display: block;
          height: 100%;
          left: 50%;
          transform: translateX(-50%);
        }
      }
      .wand {
        width: 90rem;
        height: 90rem;
      }
    }

    .artixel-whom,
    .artixel-solutions ul {
      display: flex;
      column-gap: 57rem;
      li {
        width: calc(100% / 3);
        &:not(:last-of-type) {
          border-bottom: unset;
          padding-bottom: unset;
          margin-bottom: unset;
        }
      }
    }

    .artixel-solutions {
      padding: 60rem 40rem;
      h2 {
        margin-bottom: 64rem;
      }
      h3 {
        margin-bottom: 40rem;
      }
      ul {
        li {
          height: inherit;
          display: flex;
          flex-direction: column;
          img {
            margin-top: auto;
          }
        }
      }
    }
  }

  @media (min-width: 1340px) {
    max-width: 1320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 40rem auto 0;

    .promo-header {
      width: 100%;
    }

    .promo-img,
    .artixel-whom {
      max-width: 1200px;
    }

    .artixel-whom {
      padding: 0;
    }

    .artixel-solutions {
      border-radius: 20rem;
      margin: 0;
    }

    .try-cleaner {
      &::before,
      &::after {
        max-width: 1320px;
      }
    }

    .promo-footer {
      width: 100vw;
      padding: 0 calc(calc(100vw - 1320px) / 2);
    }
  }

  @include desktop {
    max-width: 1320rem;
    .promo-img,
    .artixel-whom {
      max-width: 1200rem;
    }

    .try-cleaner {
      &::before,
      &::after {
        max-width: 1320rem;
      }
    }
    .promo-footer {
      width: 100vw;
      padding: 0 calc(calc(100vw - 1320rem) / 2);
    }
  }
}
</style>
