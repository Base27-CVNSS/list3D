const state={all:[],category:"all",region:"all",type:"all",query:"",sort:"name",page:1,pageSize:24};
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));
const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
function counts(){
  const c={}; state.all.forEach(e=>(e.categories||[]).forEach(x=>c[x]=(c[x]||0)+1)); return c;
}
function filtered(){
  let rows=state.all.filter(e=>{
    if(state.region!=="all"&&e.region!==state.region)return false;
    if(state.category!=="all"&&!(e.categories||[]).includes(state.category))return false;
    if(state.type!=="all"&&e.entity_type!==state.type)return false;
    if(state.query){
      const hay=norm([e.name,e.country,e.services,e.entity_type,...(e.categories||[])].join(" "));
      if(!hay.includes(norm(state.query)))return false;
    }
    return true;
  });
  const coll=new Intl.Collator("vi",{sensitivity:"base"});
  if(state.sort==="name")rows.sort((a,b)=>coll.compare(a.name,b.name));
  if(state.sort==="name-desc")rows.sort((a,b)=>coll.compare(b.name,a.name));
  if(state.sort==="country")rows.sort((a,b)=>coll.compare(a.country,b.country)||coll.compare(a.name,b.name));
  return rows;
}
function renderFilters(){
  const c=counts();
  const wanted=["all","3D Scan","LiDAR","Photogrammetry","360","VR","AR","Digital Twin","BIM","GIS"];
  $("#categoryFilters").innerHTML=wanted.map(x=>{
    const n=x==="all"?state.all.length:(c[x]||0);
    return `<button class="filter-btn ${state.category===x?"active":""}" data-cat="${esc(x)}">${x==="all"?"Tất cả":esc(x)} <span class="n">${n}</span></button>`
  }).join("");
  $("#categoryFilters").querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{state.category=b.dataset.cat;state.page=1;renderFilters();render();});
  const types=[...new Set(state.all.map(x=>x.entity_type).filter(Boolean))].sort();
  $("#typeSelect").innerHTML='<option value="all">Mọi loại thực thể</option>'+types.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join("");
  $("#typeSelect").value=state.type;
}
function renderStats(rows){
  $("#totalStat").textContent=state.all.length;
  $("#vnStat").textContent=state.all.filter(x=>x.region==="vn").length;
  $("#intlStat").textContent=state.all.filter(x=>x.region==="int").length;
  $("#matchStat").textContent=rows.length;
}
function render(){
  const rows=filtered(); renderStats(rows);
  const pages=Math.max(1,Math.ceil(rows.length/state.pageSize)); if(state.page>pages)state.page=pages;
  const start=(state.page-1)*state.pageSize, pageRows=rows.slice(start,start+state.pageSize);
  $("#resultTitle").textContent=`Kết quả: ${rows.length} thực thể`;
  $("#resultNote").textContent=`Trang ${state.page}/${pages} · Hiển thị ${pageRows.length} mục`;
  $("#grid").innerHTML=pageRows.length?pageRows.map(e=>`<article class="card">
    <div class="card-top"><h3>${esc(e.name)}</h3><span class="region ${e.region==="vn"?"vn":""}">${e.region==="vn"?"VIỆT NAM":"QUỐC TẾ"}</span></div>
    <div class="meta"><span>📍 ${esc(e.country)}</span><span>•</span><span class="type">${esc(e.entity_type||"company")}</span></div>
    <div class="tags">${(e.categories||[]).map((c,i)=>`<span class="tag ${i===0?"primary":""}">${esc(c)}</span>`).join("")}</div>
    <p class="desc">${esc(e.services)}</p>
    <div class="card-actions"><a class="site" href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">Mở website ↗</a><span class="source">${e.source_group==="legacy-152"?"Danh sách gốc":"Curated 2026"}</span></div>
  </article>`).join(""):'<div class="empty"><strong>Không có kết quả phù hợp.</strong><br>Thử bỏ bớt bộ lọc hoặc dùng từ khóa khác.</div>';
  renderPager(pages);
}
function renderPager(pages){
  const box=$("#pager"); if(pages<=1){box.innerHTML="";return}
  const nums=[]; for(let i=1;i<=pages;i++) if(i===1||i===pages||Math.abs(i-state.page)<=2)nums.push(i);
  const unique=[...new Set(nums)];
  let html=`<button ${state.page===1?"disabled":""} data-page="${state.page-1}">←</button>`;
  let prev=0; unique.forEach(n=>{if(prev&&n-prev>1)html+='<span>…</span>';html+=`<button class="${n===state.page?"active":""}" data-page="${n}">${n}</button>`;prev=n});
  html+=`<button ${state.page===pages?"disabled":""} data-page="${state.page+1}">→</button>`;
  box.innerHTML=html; box.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>{state.page=Number(b.dataset.page);render();window.scrollTo({top:$("#directory").offsetTop-20,behavior:"smooth"})});
}
function reset(){state.category="all";state.region="all";state.type="all";state.query="";state.sort="name";state.page=1;$("#searchInput").value="";$("#regionSelect").value="all";$("#sortSelect").value="name";renderFilters();render();}
async function init(){
  try{
    const r=await fetch("./data/companies.json",{cache:"no-store"}); if(!r.ok)throw new Error("HTTP "+r.status);
    const data=await r.json(); state.all=data.entities||[];
    $("#updatedAt").textContent=data.updated_at||"";
    renderFilters(); render();
    $("#searchInput").addEventListener("input",e=>{state.query=e.target.value;state.page=1;render()});
    $("#regionSelect").addEventListener("change",e=>{state.region=e.target.value;state.page=1;render()});
    $("#typeSelect").addEventListener("change",e=>{state.type=e.target.value;state.page=1;render()});
    $("#sortSelect").addEventListener("change",e=>{state.sort=e.target.value;state.page=1;render()});
    $("#clearBtn").onclick=reset;
  }catch(err){$("#grid").innerHTML=`<div class="empty"><strong>Không tải được dữ liệu.</strong><br>${esc(err.message)}</div>`;}
}
init();
