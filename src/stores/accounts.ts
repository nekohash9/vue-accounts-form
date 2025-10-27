import { defineStore } from "pinia";
import { ref } from "vue";

export type Label = { text: string };

export type AccountType = "LDAP" | "Локальная";

export interface Account {
  id: string;
  labels: Label[];
  type: AccountType;
  login: string;
  password: string | null;
}

const STORAGE_KEY = "accounts_v1";

export const useAccountsStore = defineStore("accounts", () => {
  const accounts = ref<Account[]>([]);

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) accounts.value = JSON.parse(raw);
    } catch (e) {
      console.error("Failed to load accounts", e);
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts.value));
  }

  function addEmpty() {
    const a: Account = {
      id: cryptoRandomId(),
      labels: [],
      type: "Локальная",
      login: "",
      password: "",
    };
    accounts.value.push(a);
    save();
    return a;
  }

  function remove(id: string) {
    accounts.value = accounts.value.filter((a) => a.id !== id);
    save();
  }

  function update(account: Account) {
    const idx = accounts.value.findIndex((a) => a.id === account.id);
    if (idx >= 0) {
      accounts.value[idx] = account;
    } else {
      accounts.value.push(account);
    }
    save();
  }

  load();

  return { accounts, load, save, addEmpty, remove, update };
});

function cryptoRandomId() {
  // simple id generator
  return Math.random().toString(36).slice(2, 9);
}
