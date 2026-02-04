import { neon } from '@neondatabase/serverless';

export default async function handler(request, response) {
  // 環境変数 DATABASE_URL を使って接続
  const sql = neon(process.env.DATABASE_URL);

  try {
    // GETリクエスト: メモ取得
    if (request.method === 'GET') {
      const { username } = request.query;
      if (!username) throw new Error('Username required');

      // SQLを実行（書き方は同じです）
      const rows = await sql`SELECT * FROM memos WHERE username = ${username} ORDER BY created_at DESC;`;
      return response.status(200).json({ memos: rows });
    }

    // POSTリクエスト: メモ保存
    if (request.method === 'POST') {
      const { username, content } = request.body;
      if (!username || !content) throw new Error('Missing data');

      await sql`INSERT INTO memos (username, content) VALUES (${username}, ${content});`;
      return response.status(200).json({ success: true });
    }

  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: error.message });
  }
}