import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import {
  Module,
  VuexModule,
  Mutation,
  Action,
  config,
  getModule,
} from 'vuex-module-decorators';

// Set rawError to true by default on all @Action decorators
config.rawError = true;

Vue.use(Vuex);
export const store = new Vuex.Store({});

@Module({ name: 'ontoM', store, namespaced: true, dynamic: true })
class OntoM extends VuexModule {
  prefixes: { [pName: string]: string } = {};

  /** Return an object that has URIs as keys and short prefix as value */
  get invertedPrefixes() {
    return Object.entries(this.prefixes).reduce((acc, entry) => {
      const [key, value] = entry;
      acc[value] = key;
      return acc;
    }, {} as { [uri: string]: string });
  }

  @Mutation
  ADD_PREFIXES(prefixes: { [pName: string]: string }) {
    this.prefixes = prefixes;
  }

  @Action
  async fetchPrefixes() {
    const { data } = await axios.get('api/ontology-list');
    this.ADD_PREFIXES(data);
  }
}

export default getModule(OntoM);
