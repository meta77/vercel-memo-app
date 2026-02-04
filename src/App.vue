<script setup>
import { ref } from 'vue';

// 状態管理
const currentUser = ref('');      // ログイン中のユーザー名
const usernameInput = ref('');    // 入力欄のユーザー名
const noteInput = ref('');        // 入力欄のメモ
const memos = ref([]);            // メモ一覧データ
const isLoggedIn = ref(false);    // ログインしているか？

// ログイン処理（という名のデータ取得）
const login = async () => {
  if (!usernameInput.value) return;
  currentUser.value = usernameInput.value;
  isLoggedIn.value = true;
  await fetchMemos();
};

// メモ取得
const fetchMemos = async () => {
  // バックエンドAPI (/api/memos) を呼び出す
  const res = await fetch(`/api/memos?username=${currentUser.value}`);
  const data = await res.json();
  memos.value = data.memos || [];
};

// メモ追加
const addMemo = async () => {
  if (!noteInput.value) return;

  await fetch('/api/memos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: currentUser.value,
      content: noteInput.value
    })
  });

  noteInput.value = ''; // 入力欄を空にする
  await fetchMemos();   // リストを更新
};

// ログアウト
const logout = () => {
  isLoggedIn.value = false;
  currentUser.value = '';
  memos.value = [];
};
</script>

<template>
  <div class="container">
    <h1>📝 Vercel Memo App</h1>

    <div v-if="!isLoggedIn" class="login-box">
      <h2>ログイン</h2>
      <p>ユーザー名を入力してください（新規なら自動作成されます）</p>
      <input v-model="usernameInput" placeholder="ユーザー名 (例: guest)" />
      <button @click="login">開始</button>
    </div>

    <div v-else>
      <div class="header">
        <p>ようこそ、<strong>{{ currentUser }}</strong> さん</p>
        <button @click="logout" class="logout-btn">ログアウト</button>
      </div>

      <div class="input-area">
        <input v-model="noteInput" placeholder="新しいメモ..." />
        <button @click="addMemo">追加</button>
      </div>

      <ul class="memo-list">
        <li v-for="memo in memos" :key="memo.id">
          {{ memo.content }}
          <span class="date">{{ new Date(memo.created_at).toLocaleString() }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.container { max-width: 500px; margin: 0 auto; padding: 2rem; font-family: sans-serif; }
input { padding: 8px; margin-right: 5px; border: 1px solid #ccc; border-radius: 4px; }
button { padding: 8px 16px; background: #000; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
.login-box { text-align: center; margin-top: 50px; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.logout-btn { background: #666; font-size: 0.8rem; }
.memo-list { list-style: none; padding: 0; margin-top: 20px; }
.memo-list li { background: #f4f4f4; padding: 10px; margin-bottom: 8px; border-radius: 4px; display: flex; justify-content: space-between; }
.date { font-size: 0.7rem; color: #888; align-self: center; }
</style>
