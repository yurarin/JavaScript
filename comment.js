const ADMIN_PASS = "007113";   // 管理人パスワード

const NGWORDS = [
  "バカ",
  "死ね",
  "うんこ",
  "ちんちん",
  "ちんこ",
  "うんぴ",
  "カス",
  "クズ",
  "アホ",
  "FAKKU",
  "パイパイ",
  "おっぱい"
];

const db = window.supabase.createClient(
  "https://pstlhuyzamxbipojvnjh.supabase.co",
  "sb_publishable_5ZWoJJlzP5UDIvtnz_0Mrg_S3ZUaXcP"
);

async function send() {
  const name = document.getElementById("name").value || "匿名";
  const comment = document.getElementById("comment").value;

  if(comment=="") return alert("コメントを書いてください");

  // URL禁止
  if(comment.includes("http") || comment.includes("www") || comment.includes(".com")){
    alert("URLは貼れません");
    return;
  }

  // NGワードチェック
  for(let word of NGWORDS){
    if(comment.toLowerCase().includes(word.toLowerCase())){
      alert("NGワードが含まれています");
      return;
    }
  }

  await db
    .from("comments")
    .insert([{name:name, comment:comment}]);

  document.getElementById("comment").value="";

  load();
}

// ここからいいね1回制限
async function like(id){
  // localStorageでいいね済みチェック
  let liked = JSON.parse(localStorage.getItem("likedComments") || "[]");
  if(liked.includes(id)){
    alert("いいねは1回しか押せません");
    return;
  }

  const {data} = await db
    .from("comments")
    .select("likes")
    .eq("id",id)
    .single();

  await db
    .from("comments")
    .update({likes:(data.likes||0)+1})
    .eq("id",id);

  // いいねしたIDを保存
  liked.push(id);
  localStorage.setItem("likedComments", JSON.stringify(liked));

  load(); // 再読み込みで反映
}

async function del(id){
  let pass = prompt("管理人パスワード");

  if(pass !== ADMIN_PASS){
    alert("削除できません");
    return;
  }

  await db
    .from("comments")
    .delete()
    .eq("id",id);

  load();
}

async function load(){
  const {data} = await db
    .from("comments")
    .select("*")
    .order("created_at",{ascending:false});

  let html="";

  data.forEach(c=>{
    html += `
      <div class="comment">
        <div class="top">
          <b>${c.name}</b>
          <div>
            <button onclick="like(${c.id})">👍 ${c.likes||0}</button>
            <button onclick="del(${c.id})">削除</button>
          </div>
        </div>
        <p>${c.comment}</p>
      </div>
    `;
  });

  document.getElementById("comments").innerHTML = html;
}

load();

db
  .channel("comments")
  .on(
    "postgres_changes",
    {
      event:"*",
      schema:"public",
      table:"comments"
    },
    payload=>{
      load();
    }
  )
  .subscribe();