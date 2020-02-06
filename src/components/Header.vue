<template lang="pug">
  section.main-nav-section
    .ui.top.fixed.menu.topmenu
      .item(@click="$router.push('/')")
        .ui.tiny.image
          img(src='@/assets/logo-small.png')
        .middle.aligned.content
          h1.header.white
            | Pronto
            //- span.blue o
            //- | nto

</template>

<script>
export default {
  name: 'Header',
};
</script>

<style lang="scss" scoped>
.item {
  cursor: pointer;
}
.white {
  color: white;
}
.blue {
  color: #4183c4;
}
.page-title {
  color: white !important;
}
.homepage {
  text-decoration: none;
}
.homepage > div {
  padding: 5px;
}
img {
  width: 37px;
  padding: 20px 0;
}
.user,
.logout-user {
  display: flex;
}
.user {
  .svg-inline--fa.fa-w-14 {
    font-size: 16px;
  }
}
.topmenu {
  background: #4d4d4d !important;
  height: 50px;
  color: #d0cece;
  padding: 0 20px;
  .web-name {
    p {
      font-size: 23px;
      font-weight: bold;
      color: white;
    }
    justify-self: flex-start;
  }
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    &.dashboard {
      grid-column: 4/5;
      display: flex;
      justify-content: flex-start;
    }
    button {
      display: flex;
      align-items: center;
      svg {
        margin-right: 8px;
        font-size: 16px;
        margin: 0 5px;
      }
    }
  }
  a {
    text-decoration: none;
    color: #d0cece;
    border: none;
    background: transparent;
    outline: none;
    cursor: pointer;
    p,
    svg {
      font-size: 17.5px;
      color: #d0cece;
    }
    svg {
      margin-right: 7px;
    }
    &.active a p,
    &.active a svg {
      color: #3fd1f3;
    }
    &:hover {
      color: white;
      p,
      svg {
        color: white;
      }
    }
    &.router-link-active {
      p,
      svg {
        color: #3fd1f3;
      }
    }
  }
}
</style>
