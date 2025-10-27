<template>
  <div class="max-w-6xl mx-auto px-4">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-2xl font-semibold text-slate-800">Учётные записи</h2>
        </div>
        <button @click="onAdd"
          class="inline-flex items-center gap-2 bg-white border border-sky-100 text-sky-600 rounded-md px-3 py-1.5 shadow-sm hover:bg-sky-50 hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-200">
          <span class="text-lg">+</span>
        </button>
      </div>

      <!-- Hint -->
      <div class="flex items-center bg-sky-50 border border-sky-100 text-sky-800 text-sm rounded-md px-4 py-2 mb-4">
        <svg class="w-5 h-5 mr-3 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 8V12" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 16.0195V16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="12" cy="12" r="10" stroke="#000000" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
        <div>Для указания нескольких меток для одной пары логин/пароль используйте разделитель <code
            class="bg-white px-1 rounded ml-1">;</code></div>
      </div>

      <!-- Table header labels -->
      <div class="grid items-center text-slate-500 text-sm mb-2"
        style="grid-template-columns: 320px 160px 1fr 1fr 48px;">
        <div class="pl-3">Метки</div>
        <div>Тип записи</div>
        <div>Логин</div>
        <div>Пароль</div>
        <div></div>
      </div>

      <!-- Rows -->
      <div class="space-y-3">
        <template v-for="item in localItems" :key="item.id">
          <div class="grid items-center gap-3 p-3 border rounded-md"
            style="grid-template-columns: 320px 160px 1fr 1fr 48px;">
            <!-- Labels -->
            <div>
              <input v-model="item.labelsText" @blur="onBlur(item)" maxlength="50" placeholder="XXX; YYY; ZZZ"
                :class="['w-full px-3 py-2 rounded-sm transition', item.errors.labels ? 'border-rose-500' : 'border-slate-200']" />
              <div v-if="item.errors.labels" class="text-rose-600 text-xs mt-1">Максимум 50 символов</div>
            </div>

            <!-- Type -->
            <div>
              <select v-model="item.type" @change="onSelectChange(item)"
                class="w-full px-3 py-2 rounded-sm border border-slate-200 bg-white">
                <option value="Локальная">Локальная</option>
                <option value="LDAP">LDAP</option>
              </select>
            </div>

            <!-- Login -->
            <div>
              <input v-model="item.login" @blur="onBlur(item)" maxlength="100" placeholder="Значение"
                :class="['w-full px-3 py-2 rounded-sm transition', item.errors.login ? 'border-rose-500' : 'border-slate-200']" />
              <div v-if="item.errors.login" class="text-rose-600 text-xs mt-1">Обязательное поле, максимум 100 символов
              </div>
            </div>

            <!-- Password -->
            <div class="relative">
              <template v-if="item.type === 'Локальная'">
                <input :type="item.showPassword ? 'text' : 'password'" v-model="item.password" @blur="onBlur(item)"
                  maxlength="100" placeholder="••••••••"
                  :class="['w-full px-3 py-2 pr-10 rounded-sm transition', item.errors.password ? 'border-rose-500' : 'border-slate-200']" />
                <button type="button" @click="item.showPassword = !item.showPassword"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  :title="item.showPassword ? 'Скрыть' : 'Показать'">
                  <!-- simple eye icon -->
                  <svg v-if="!item.showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-sky-600 block"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-sky-600 block" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.96 9.96 0 012.223-3.428M3 3l18 18" />
                  </svg>
                </button>
              </template>

              <template v-else>
                <div class="text-slate-500">—</div>
              </template>
            </div>

            <!-- Delete -->
            <div class="flex items-center justify-center">
              <button @click="onDelete(item.id)"
                class="w-10 h-10 flex items-center justify-center p-0 rounded hover:bg-sky-50 text-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-200"
                title="Удалить">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"
                  class="block h-5 w-5 text-sky-600" fill="none" stroke="currentColor">
                  <path
                    d="M3 6H21M5 6V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M14 11V17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M10 11V17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>

          </div>
        </template>

        <div v-if="localItems.length === 0" class="text-center py-8 text-slate-500">Список пуст — добавьте запись</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useAccountsStore, Account } from '../stores/accounts'

const store = useAccountsStore()

type LocalItem = {
  id: string
  labelsText: string
  labelsArr: { text: string }[]
  type: 'LDAP' | 'Локальная'
  login: string
  password: string | null
  showPassword?: boolean
  errors: { labels?: boolean; login?: boolean; password?: boolean }
}

function accountToLocal(a: Account): LocalItem {
  return reactive({
    id: a.id,
    labelsText: a.labels.map(l => l.text).join(';'),
    labelsArr: a.labels.slice(),
    type: a.type,
    login: a.login,
    password: a.password,
    showPassword: false,
    errors: {}
  })
}

function localToAccount(l: LocalItem): Account {
  const labels = (l.labelsText || '').split(';').map(s => s.trim()).filter(Boolean).slice(0, 50).map(t => ({ text: t }))
  return {
    id: l.id,
    labels,
    type: l.type,
    login: (l.login || '').trim(),
    password: l.type === 'Локальная' ? (l.password || '') : null
  }
}

const localItems = reactive<LocalItem[]>([])
function initLocal() {
  localItems.splice(0, localItems.length)
  for (const a of store.accounts) localItems.push(accountToLocal(a))
}
initLocal()

function onAdd() {
  const created = store.addEmpty()
  localItems.push(accountToLocal(created))
}
function onDelete(id: string) {
  store.remove(id)
  const idx = localItems.findIndex(i => i.id === id)
  if (idx >= 0) localItems.splice(idx, 1)
}
function validateLocal(l: LocalItem) {
  l.errors.labels = (l.labelsText || '').length > 50
  l.errors.login = !(l.login && l.login.trim().length > 0) || l.login.length > 100
  if (l.type === 'Локальная') l.errors.password = !(l.password && (l.password as string).length > 0) || ((l.password as string).length > 100)
  else l.errors.password = false
  return !(l.errors.labels || l.errors.login || l.errors.password)
}
function onBlur(l: LocalItem) {
  const ok = validateLocal(l)
  if (ok) store.update(localToAccount(l))
}
function onSelectChange(l: LocalItem) {
  if (l.type === 'LDAP') l.password = null
  else if (l.password === null) l.password = ''
  onBlur(l)
}
</script>

<style scoped>
/* subtle visual tweak to mimic the reference look */
input.border,
select.border {
  border-width: 1px;
  border-color: #dbe6ee;
}
</style>
