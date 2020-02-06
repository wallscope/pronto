<template lang="pug">
  section#Footer
    .divBlack
      .wrapperFooter
        .textInside
          div
            p Our platform quickly connects you with the most contextually relevant information
              |  from any number of diverse sources.
            p Use our tools to discover, explore and reveal new connections within texts.
            p Wallscope: for innovation with semantic web techniques,
              |  linked data principles and unifying vocabularies.
          div.address
            p
              span Wallscope
            p
              a(href="mailto:info@wallscope.co.uk")
                | info@wallscope.co.uk
            p
              a(target="_blank" href="https://wallscope.co.uk/")
                | www.wallscope.co.uk

        .logo
          //address, telephone
          .textInside#logo
            img(src="@/assets/logo.png" alt="Wallscope Logo")
        //.SocialMedia
          p
      .Additional
          p Copyright © 2017 Wallscope Limited. All rights reserved.
          p Registered in Scotland — Company No. SC487045 at 9 Ainslie Place Edinburgh EH3 6AT.

</template>
<script>
export default {
  name: 'FooterSection',
};
</script>

<style scoped>
section#Footer {
  background-color: rgb(16, 18, 25);
  display: flex;
  color: #aba1a1;
  /* min-height: 200px; */
}
.address {
  justify-self: center;
  color: #dadada;
}
.address p span {
  font-weight: bold;
  font-size: 14px;
  color: #15bce3;
}
.divBlack p {
  text-align: left;
}
.divBlack {
  width: 100%;
}
.textInside {
  grid-column: 2/3;
  display: grid;
  grid-template-columns: 2fr 1fr;
}
.textInside div {
  padding: 16px;
}
.wrapperFooter {
  display: grid;
  grid-template-columns: 15% 5fr 1fr 15%;
}
#Footer {
  padding-top: 10px;
  border-top: 10px solid #3e42508f;
}
.Additional {
  background: #07080b;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 6px 0;
}
.Additional p {
  font-size: 10px;
}
.textInside p {
  font-size: 12px;
  color: white;
}
#Footer a {
  text-decoration: none;
  color: white;
  font-size: 11px;
}
#Footer a:hover {
  color: #15bce3;
}
#Footer img {
  max-width: 180px;
}
.logo {
  display: flex;
  justify-content: flex-end;
}
</style>
