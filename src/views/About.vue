<template lang="pug">
  .about
    .ui.grid.container
      .row
        .ten.wide.tablet.ten.wide.computer.sixteen.wide.mobile.centered.column
          p#about-text.
            Pronto was created by Wallscope to fight against the boring and time-consuming task of
            searching for predicates and classes in ontologies. Read our
            #[a(href="https://medium.com/wallscope/pronto-find-predicates-fast-15187f52f516" target="_blank") Wallscope's blog post] for more information.

      .row
        .eight.wide.tablet.six.wide.computer.sixteen.wide.mobile.centered.left.aligned.column
          h2 List of the included ontologies
          .ui.list
            a.item http://www.w3.org/1999/02/22-rdf-syntax-ns#
            a.item http://www.w3.org/2000/01/rdf-schema#
            a.item http://www.w3.org/2002/07/owl#
            a.item http://proton.semanticweb.org/protonsys#
            a.item http://purl.org/dc/terms/
            a.item http://www.w3.org/2004/02/skos/core#
            a.item http://www.loc.gov/mads/rdf/v1#
            a.item http://purl.org/dc/elements/1.1/
            a.item http://www.w3.org/2003/06/sw-vocab-status/ns#
            a.item http://xmlns.com/foaf/0.1/
            a.item http://schema.org/
            a.item http://www.w3.org/2007/05/powder-s#
            a.item http://creativecommons.org/ns#
            a.item http://purl.org/vocab/vann/
            a.item http://open.vocab.org/terms/
            a.item http://www.w3.org/2003/g/data-view#
            a.item http://www.w3.org/ns/prov#
</template>

<style lang="scss" scoped>
#about-text {
  margin-top: 1.5em;
}
</style>
