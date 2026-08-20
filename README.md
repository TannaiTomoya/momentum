# Momentum Verbs

規則・不規則動詞の想起練習に加え、TOEIC 向けの語彙・文法ドリルをまとめたランダム学習アプリです。

**公開URL:** https://momentum-verbs.pages.dev/

---

## このアプリの優位性・差別化

多くの英単語アプリは「単語カードを見る」「4択で意味を選ぶ」止まりです。Momentum Verbs は、**テスト本番で問われる形（活用・品詞・語順・接続詞・前置詞・文章穴埋め）まで一気通貫で練習できる**点が強みです。

### 1. 「覚える」より「引き出す」設計

| 一般的な学習アプリ | Momentum Verbs |
|--------------------|----------------|
| カードをめくって確認 | 意味↔原形↔過去形↔過去分詞の**能動想起** |
| 同じ形式の反復 | 規則／不規則・出題形式を**インターリーブ** |
| 間違えても次へ | 誤答直後に**挽回チャンス**で再出題 |

検索練習・望ましい困難・簡易 SM-2（間隔反復）をゲーム内に組み込み、暗記ではなく定着を狙います。

### 2. Psychological Momentum（乗っている感覚）

連続正解でコンボ倍率・ヒート演出が伸びるため、「正解するほど加速する」感覚でテンポよく周回できます。単なる正誤ログではなく、**短期集中のラン形式**になっている点が差別化要因です。

### 3. 動詞だけじゃない「TOEIC 総合ドリル」

1 アプリ内で次をカバーします。

- **動詞**: 最重要不規則 50 / A-B-B・A-B-A・A-B-C 型別
- **語彙**: ビジネス英単語・写真描写語彙・フレーズ・イニシャル入力
- **文章穴埋め**: TOEIC超必須 / FOR BIZ Unit1・2（英文空欄に英語を入力）
- **文法**: 品詞（接尾辞）、語順、補語/目的語、句/節、接続詞、可算・不可算、数量形容詞、前置詞
- **Web基礎**: HTML/CSS 判別、JavaScript 基礎（変数〜DOM）

「動詞アプリ」「文法アプリ」「単語帳」を行き来せず、**本番で混ざる論点を同じ UI・同じモメンタム体験で練習**できます。

### 4. パターン認識を明示した教材設計

- 不規則動詞を **A-B-B / A-B-A / A-B-C** に分けて出題
- 接尾辞（`-ment` / `-ize` / `-ive` / `-ly`）から品詞を推測
- 接続詞と前置詞を「後ろが節か句か」で選ばせる

丸暗記ではなく、**判別ルールをゲーム化**している点が一般的な単語帳との差です。

### 5. インストール不要・進捗はローカル保存

ブラウザだけで完結し、アカウント登録なし。進捗（XP・レベル・語ごとの習熟度）は `localStorage` に保存されます。すぐ開いて短時間ランできる軽さが、継続のハードルを下げます。

---

## 技術構成

- React 19 + TypeScript + Vite
- Cloudflare Pages（静的デプロイ、`wrangler`）
- 進捗: ブラウザ `localStorage`

## 起動 / ビルド / デプロイ

```bash
npm install
npm run dev      # 開発サーバー（通常 http://localhost:5173）
npm run build    # 本番ビルド
npm run preview  # ビルド結果の確認
```

### Cloudflare Pages への公開

初回のみログインが必要です。

```bash
npx wrangler login   # ブラウザで Allow
npm run deploy       # build + pages deploy
```

- プロジェクト名: `momentum-verbs`
- 本番URL: https://momentum-verbs.pages.dev/

---

## 共通の遊び方

1. タイトル画面からモードを選択
2. 制限時間内に回答（4択 / 2択 / タイピング）
3. 連続正解でコンボ倍率を伸ばす
4. ミスするとコンボは切れるが、直後に「挽回チャンス」で同じ項目が再出題される
5. XP を貯めてレベルアップ。**Participle Mix（Lv.2）** / **Hard Rush（Lv.3）** を解放

---

## モード一覧

### 動詞ラッシュ

| モード | 内容 |
|--------|------|
| Momentum Rush | 規則・不規則を混ぜ、意味 / 原形 / 過去形をインターリーブ |
| Core Irregular 50 | 最重要不規則動詞 50 語に集中 |
| A-B-B 型 | 過去形＝過去分詞（buy → bought → bought など） |
| A-B-A 型 | 原形＝過去分詞（come → came → come など） |
| A-B-C 型 | 3 形すべて異なる（begin → began → begun など） |
| Participle Mix | 過去分詞を混ぜた検索練習（Lv.2 で解放） |
| Hard Rush | 短時間・多問数（Lv.3 で解放） |

### 文法ドリル

| モード | 内容 |
|--------|------|
| 現在進行形 vs 動名詞 | be + -ing か、名詞の働きの -ing かを判別 |
| 接尾辞 → 品詞 | `-ment` / `-ize` / `-ive` / `-ly` などを仕分け |
| 単語 → 品詞 | effective / discussion などの品詞判別 |
| 英文の語順 | S+be+補語 / S+一般動詞(+目的語) の 4 パターン |
| 補語 vs 目的語 | 主語＝補語か、動作の対象かを判別 |
| 句 vs 節 | 主語＋本動詞の有無で判別 |
| 接続詞 vs 前置詞 | Because / Despite / While など、後ろが節か句か |
| 等位・従位・接続副詞 | so / because / however のつなぎ方 |
| 接続詞 Part5 | either…or / unless / whether など TOEIC 形式 |
| 可算 / 不可算 | information / furniture / passenger など |
| 複数形入力 | woman → women などをタイピング |
| 数量形容詞 | many / much / a few / each など |
| 主語と動詞の一致 | is / are を選択 |
| 前置詞（時・場所・その他・セット） | at/on/in、behind、subscribe to など |

### Web基礎ドリル

| モード | 内容 |
|--------|------|
| HTML/CSS 判別 | margin / padding / flex / colspan / form など（12問） |
| JavaScript 基礎 | let・const・if・for・配列・関数・DOM・FizzBuzz（20問） |

### ビジネス英単語

| モード | 内容 |
|--------|------|
| 単語テスト① 日→英 | freezer / section / service request など |
| イニシャル入力① 日→英 | `f______` ヒント付きタイピング |
| 単語テスト② 英→日 | 短めセット |
| イニシャル入力② 英→日 | 日本語頭文字ヒント付き |
| 穴埋め 英文→日本語 | 文全体の意味選択 |
| イニシャル入力③ 穴埋め | 英文空欄をタイピング |
| 重要表現ドリル | be eligible for / submit A to B など |
| イニシャル入力④ TOEICフレーズ | フレーズの日本語をタイピング |

### TOEIC 写真描写・文章穴埋め

| モード | 内容 |
|--------|------|
| TOEIC単語① 英→日 | wipe down / patio / sidewalk など |
| TOEIC単語② 日→英 | 写真描写語彙の英語入力 |
| TOEIC穴埋め | wiping / sweeping / in front など |
| 単語テスト① 文章穴埋め | TOEIC超必須（extinguisher / appointment など 20 問） |
| FOR BIZ Unit1・2 穴埋め | inspecting / filing / assembling など 30 問 |

---

## 科学的根拠

| 原理 | アプリ内の実装 |
|------|----------------|
| 検索練習 (Retrieval Practice) | 意味→原形、原形→過去形などの能動想起 |
| インターリービング | 規則／不規則、出題形式をセッション内で混在 |
| 望ましい困難 | 誤答は短間隔で再出題、正解は間隔を空ける |
| 間隔反復 (簡易 SM-2) | 正誤と反応時間で次回優先度を更新 |
| Psychological Momentum | コンボ倍率・演出・ヒートゲージで「乗っている」感覚を設計 |

---

## データ概要

- 規則動詞 約 49 語、不規則動詞 50 語（型別リストあり）
- ビジネス英単語・穴埋め・TOEIC フレーズ・写真描写語彙
- TOEIC超必須文章穴埋め 20 問、FOR BIZ Unit1・2 穴埋め 30 問（`src/data/toeicSentenceCloze.ts`）
- HTML/CSS 判別・JavaScript 基礎（`src/data/webBasics.ts`）
- 文法問題（品詞・語順・接続詞・名詞・前置詞）は `src/data/` 配下に定義

---

## プロジェクト構成（抜粋）

```
src/
  components/     # タイトル・ゲーム・結果画面
  data/           # 単語・文法・語彙・文章穴埋めデータ
  engine/         # 出題・進捗・スケジューラ（動詞 / 語彙）
  hooks/          # ゲーム状態
  styles/         # グローバル CSS
```
