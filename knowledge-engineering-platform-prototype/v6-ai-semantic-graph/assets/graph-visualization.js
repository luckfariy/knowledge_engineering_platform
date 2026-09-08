(() => {
  const entityTypes = [
    ['object','业务对象',3,'业','#2f79fb'],['activity','业务活动',4,'业','#49bea8'],['table','数据表',4,'数','#38bed1'],['rule','业务规则',4,'业','#9263f2'],['metric','指标',4,'指','#fbab47'],['field','字段',4,'字','#5f78f1']
  ];
  const relationTypes = [['all-relation','全部',26,'全','var(--color-type-700)'],['approve','审批',12,'审','#f45f62'],['include','包含',8,'含','#2f79fb'],['belong','归属',6,'归','#49bea8']];
  let activeTab='entity', activeType='object', scale=1, typeFilterActive=true, currentView='list', listPage=1, listPageSize=8, currentCreateType='object', editingEntityId=null, pendingDeleteEntityId=null;
  const nodes = [
    ['业务对象','object',450,280],['业务活动1','activity',418,174],['业务活动2','activity',334,175],['业务活动3','activity',330,242],['业务活动','activity',383,244],
    ['指标','metric',490,174],['指标2','metric',530,173],['指标3','metric',583,221],['规则名称1','rule',310,320],['规则名称2','rule',310,365],['业务规则','rule',390,328],
    ['数据表','table',520,326],['明细表','table',603,272],['汇总表','table',603,344],['人员组织','metric',450,390],['设备','metric',350,438],['总经理办','metric',530,438],['系统应用','metric',450,492]
  ].map((n,i)=>({id:`n${i}`,name:n[0],type:n[1],x:n[2],y:n[3]}));
  const entityInstances = [
    {id:'e-object-1',type:'object',name:'变电站',alias:'描述信息内容',description:'描述信息内容',creator:'Admin',createdAt:'2016-09-21 08:50:08'},
    {id:'e-object-2',type:'object',name:'线路',alias:'描述信息内容',description:'描述信息内容',creator:'Admin',createdAt:'2016-09-21 08:50:08'},
    {id:'e-object-3',type:'object',name:'变压器',alias:'',description:'描述信息内容',creator:'Admin',createdAt:'2016-09-21 08:50:08'},
    {id:'e-activity-1',type:'activity',name:'设备巡检',alias:'巡检作业',description:'按计划检查设备运行状态',creator:'Admin',createdAt:'2026-08-08 09:30:00'},
    {id:'e-activity-2',type:'activity',name:'故障处理',alias:'故障处置',description:'处理设备及线路故障',creator:'Admin',createdAt:'2026-08-08 09:32:00'},
    {id:'e-activity-3',type:'activity',name:'客户报装',alias:'业扩报装',description:'受理客户新增用电申请',creator:'Admin',createdAt:'2026-08-08 09:36:00'},
    {id:'e-activity-4',type:'activity',name:'电费核算',alias:'电费计算',description:'按计量数据完成电费核算',creator:'Admin',createdAt:'2026-08-08 09:40:00'},
    {id:'e-table-1',type:'table',name:'客户主数据表',alias:'CUSTOMER',description:'存储客户基础信息',creator:'Admin',createdAt:'2026-08-07 14:10:00'},
    {id:'e-table-2',type:'table',name:'设备台账表',alias:'DEVICE',description:'存储设备台账及状态',creator:'Admin',createdAt:'2026-08-07 14:12:00'},
    {id:'e-table-3',type:'table',name:'计量数据表',alias:'METER_DATA',description:'存储计量采集数据',creator:'Admin',createdAt:'2026-08-07 14:16:00'},
    {id:'e-table-4',type:'table',name:'工单明细表',alias:'WORK_ORDER',description:'存储业务工单明细',creator:'Admin',createdAt:'2026-08-07 14:20:00'},
    {id:'e-rule-1',type:'rule',name:'停电审批规则',alias:'停电审批',description:'停电计划的审批约束',creator:'Admin',createdAt:'2026-08-06 10:10:00'},
    {id:'e-rule-2',type:'rule',name:'电费计算规则',alias:'计费规则',description:'电费计算的业务口径',creator:'Admin',createdAt:'2026-08-06 10:14:00'},
    {id:'e-rule-3',type:'rule',name:'设备巡检规则',alias:'巡检规则',description:'设备巡检周期与要求',creator:'Admin',createdAt:'2026-08-06 10:18:00'},
    {id:'e-rule-4',type:'rule',name:'异常告警规则',alias:'告警规则',description:'异常数据的识别条件',creator:'Admin',createdAt:'2026-08-06 10:22:00'},
    {id:'e-metric-1',type:'metric',name:'月度售电量',alias:'售电量',description:'统计周期内的售电量',creator:'Admin',createdAt:'2026-08-05 11:10:00'},
    {id:'e-metric-2',type:'metric',name:'线损率',alias:'综合线损率',description:'输配电过程中的电量损耗率',creator:'Admin',createdAt:'2026-08-05 11:14:00'},
    {id:'e-metric-3',type:'metric',name:'供电可靠率',alias:'可靠率',description:'统计周期内的供电可靠程度',creator:'Admin',createdAt:'2026-08-05 11:18:00'},
    {id:'e-metric-4',type:'metric',name:'设备完好率',alias:'完好率',description:'设备完好数量占比',creator:'Admin',createdAt:'2026-08-05 11:22:00'},
    {id:'e-field-1',type:'field',name:'客户编号',alias:'customer_id',description:'客户的唯一业务标识',creator:'Admin',createdAt:'2026-08-04 15:10:00'},
    {id:'e-field-2',type:'field',name:'设备编号',alias:'device_id',description:'设备的唯一业务标识',creator:'Admin',createdAt:'2026-08-04 15:14:00'},
    {id:'e-field-3',type:'field',name:'统计日期',alias:'stat_date',description:'指标统计日期',creator:'Admin',createdAt:'2026-08-04 15:18:00'},
    {id:'e-field-4',type:'field',name:'电量值',alias:'energy_value',description:'采集或统计得到的电量数值',creator:'Admin',createdAt:'2026-08-04 15:22:00'}
  ];
  let edges = [[0,1,'审批'],[0,3,'审批'],[0,4,'审批'],[0,6,'审批'],[0,8,'审批'],[0,10,'审批'],[0,11,'审批'],[0,14,'管理'],[1,5,'审批'],[5,6,'审批'],[6,7,'审批'],[8,9,'审批'],[8,10,'审批'],[11,12,'审批'],[11,13,'审批'],[14,15,'管理'],[14,16,'管理'],[14,17,'管理']];
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const escapeHtml=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  $('#goGraphBuild').onclick=()=>{window.location.href='index.html'};
  const colorOf=t=>(entityTypes.find(x=>x[0]===t)||['','','','', '#2f79fb'])[4];
  function syncTypeCounts(){entityTypes.forEach(meta=>{meta[2]=entityInstances.filter(item=>item.type===meta[0]).length});relationTypes.forEach(meta=>{meta[2]=meta[0]==='all-relation'?edges.length:edges.filter(edge=>edge[2]===meta[1]).length})}
  function renderTypes(){syncTypeCounts();const q=$('#typeSearch').value.trim(); const list=(activeTab==='entity'?entityTypes:relationTypes).filter(x=>x[1].includes(q)); $('#typeList').innerHTML=list.map(x=>`<div class="type-item ${x[0]===activeType?'active':''}" data-value="${x[0]}"><i class="type-symbol" style="background:${x[4]}">${x[3]}</i><button class="type-copy" data-select-type="${x[0]}"><b>${x[1]}</b><small>${x[2]}个实例</small></button><em class="built-in">内置</em></div>`).join(''); $$('[data-select-type]').forEach(b=>b.onclick=()=>{activeType=b.dataset.selectType;typeFilterActive=activeTab==='entity';listPage=1;renderTypes();highlightType();if(currentView==='list')renderList()})}
  function renderGraph(){
    $('#nodeLayer').innerHTML=nodes.map(n=>`<button class="graph-node" data-id="${n.id}" data-type="${n.type}" data-name="${escapeHtml(n.name)}" style="left:${n.x}px;top:${n.y}px"><i class="node-circle" style="background:${colorOf(n.type)}">≋</i><span>${escapeHtml(n.name)}</span></button>`).join('');
    const lines=edges.map(e=>{const a=nodes[e[0]],b=nodes[e[1]],mx=(a.x+b.x)/2,my=(a.y+b.y)/2;return `<line class="edge" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/><text class="edge-label" x="${mx}" y="${my-4}" text-anchor="middle">${e[2]}</text>`}).join(''); $('#edgeLayer').innerHTML=lines;
    $('#miniNodes').innerHTML=nodes.map(n=>`<i class="mini-dot" style="left:${n.x/9}px;top:${n.y/8}px;background:${colorOf(n.type)}"></i>`).join('');
    $$('.graph-node').forEach(n=>n.onclick=()=>{ $$('.graph-node').forEach(x=>x.classList.remove('selected'));n.classList.add('selected')}); highlightType(); populateSelects();
  }
  function highlightType(){const q=$('#globalEntitySearch').value.trim().toLowerCase();$$('.graph-node').forEach(n=>{const typeMismatch=typeFilterActive&&activeTab==='entity'&&n.dataset.type!==activeType;const searchMismatch=q&&!n.dataset.name.toLowerCase().includes(q);n.style.opacity=(typeMismatch||searchMismatch)?.35:1})}
  function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(el.t);el.t=setTimeout(()=>el.classList.remove('show'),1800)}
  function applyScale(){ $('#graphStage').style.transform=`translate(-50%,-50%) scale(${scale})`;$('#zoomRange').value=Math.round(scale*100)}
  function autoLayout(){nodes.forEach((n,i)=>{const angle=(Math.PI*2*i/nodes.length)-Math.PI/2;const ring=i?180:0;n.x=450+Math.cos(angle)*ring;n.y=280+Math.sin(angle)*ring});renderGraph();toast('已完成自动布局')}
  function populateSelects(){const opts=nodes.map((n,i)=>`<option value="${i}">${n.name}</option>`).join('');$('#relationFrom').innerHTML=opts;$('#relationTo').innerHTML=opts;$('#relationTo').selectedIndex=1}
  function modal(show){$('#modalMask').classList.toggle('show',show);$('#relationModal').classList.toggle('show',show)}
  function showDialog(id){$('#modalMask').classList.add('show');$(`#${id}`).classList.add('show')}
  function closeDialogs(){ $('#modalMask').classList.remove('show'); $$('.figma-dialog,.relation-modal').forEach(x=>x.classList.remove('show')) }
  function openEntityDialog(type,entity=null){currentCreateType=type;editingEntityId=entity?.id||null;const meta=entityTypes.find(x=>x[0]===type)||entityTypes[0],label=meta[1];$('#entityDialogTitle').textContent=`${entity?'编辑':'新建'}${label}`;$('#entityNameLabel').textContent=`${label}名称`;$('#entityAliasLabel').textContent=`${label}别名`;$('#entityDescLabel').textContent=type==='object'?'业务术语':`${label}说明`;$('#newEntityName').value=entity?.name||'';$('#newEntityAlias').value=entity?.alias||'';$('#newEntityDesc').value=entity?.description||'';$('#descCount').textContent=$('#newEntityDesc').value.length;showDialog('entityDialog');$('#newEntityName').focus()}
  function rowsData(){return edges.map((e,i)=>({id:i,entity:nodes[e[0]].name,type:nodes[e[0]].type,relation:e[2],target:nodes[e[1]].name,targetType:nodes[e[1]].type,source:i%3===0?'手工创建':i%3===1?'AI 构建':'系统内置'}))}
  function tableEntityCell(name,type){const meta=entityTypes.find(x=>x[0]===type)||entityTypes[1];return `<span class="table-entity"><i class="table-entity-icon" style="background:${meta[4]}" aria-hidden="true">${meta[3]}</i><span>${name}</span></span>`}
  function renderPagination(total){const pages=Math.max(1,Math.ceil(total/listPageSize));listPage=Math.min(listPage,pages);$('#resultCount').textContent=`共 ${total} 条`;$('#pageInfo').textContent=`第 ${listPage} / ${pages} 页`;$('#pageButtons').innerHTML=Array.from({length:pages},(_,i)=>`<button class="${listPage===i+1?'active':''}" data-page="${i+1}">${i+1}</button>`).join('');$$('[data-page]').forEach(b=>b.onclick=()=>{listPage=+b.dataset.page;renderList()});$('#prevPage').disabled=listPage===1;$('#nextPage').disabled=listPage===pages;return pages}
  function renderEntityList(){
    const meta=entityTypes.find(item=>item[0]===activeType)||entityTypes[0];
    const q=($('#entityListSearch')?.value||$('#globalEntitySearch').value).trim().toLowerCase();
    const data=entityInstances.filter(item=>(q||item.type===activeType)&&(!q||[item.name,item.alias,item.description,item.creator].some(value=>value.toLowerCase().includes(q))));
    renderPagination(data.length);
    const pageRows=data.slice((listPage-1)*listPageSize,listPage*listPageSize);
    $('#entityListTitle').textContent=q?'全局实体搜索结果':meta[1];
    $('#entityListDescription').textContent=q?'展示全部实体类型中与关键词匹配的实体':`管理电力系统中的${meta[1]}实体，支持新建和从数据源拉取`;
    $('#resultTitle').textContent=q?'实体搜索结果':`${meta[1]}列表`;
    $('#entityTableHead').innerHTML='<tr><th><input class="checkbox" id="selectAllEntities" type="checkbox" aria-label="全选当前实体"></th><th>名称</th><th>别名</th><th>描述</th><th>创建人</th><th>创建时间</th><th class="cell-actions">操作</th></tr>';
    $('#entityRows').innerHTML=pageRows.map(item=>`<tr><td><input class="checkbox entity-row-check" type="checkbox" aria-label="选择${escapeHtml(item.name)}"></td><td><b>${escapeHtml(item.name)}</b></td><td>${escapeHtml(item.alias)||'—'}</td><td>${escapeHtml(item.description)||'—'}</td><td>${escapeHtml(item.creator)}</td><td class="text-number">${escapeHtml(item.createdAt)}</td><td class="cell-actions"><button class="btn btn-dense btn-text" data-edit-entity="${item.id}">编辑</button><button class="btn btn-dense btn-text" data-locate-entity="${item.id}">图谱定位</button><button class="btn btn-dense btn-text entity-delete-action" data-delete-entity="${item.id}">删除</button></td></tr>`).join('')||'<tr><td colspan="7" class="entity-empty">当前实体类型下暂无数据</td></tr>';
    $('#selectAllEntities')?.addEventListener('change',event=>$$('.entity-row-check').forEach(checkbox=>{checkbox.checked=event.target.checked}));
    $$('[data-edit-entity]').forEach(button=>button.onclick=()=>{const item=entityInstances.find(entity=>entity.id===button.dataset.editEntity);if(item)openEntityDialog(item.type,item)});
    $$('[data-locate-entity]').forEach(button=>button.onclick=()=>{const item=entityInstances.find(entity=>entity.id===button.dataset.locateEntity);if(!item)return;switchView('graph');setTimeout(()=>{const graphNode=$$('.graph-node').find(node=>node.dataset.name===item.name)||$$('.graph-node').find(node=>node.dataset.type===item.type);graphNode?.click()},0)});
    $$('[data-delete-entity]').forEach(button=>button.onclick=()=>{const item=entityInstances.find(entity=>entity.id===button.dataset.deleteEntity);if(!item)return;pendingDeleteEntityId=item.id;$('#deleteEntityName').textContent=item.name;showDialog('deleteEntityDialog')});
  }
  function renderRelationList(){
    const meta=relationTypes.find(item=>item[0]===activeType)||relationTypes[0];
    const q=($('#entityListSearch')?.value||$('#globalEntitySearch').value).trim().toLowerCase();
    const data=rowsData().filter(row=>(activeType==='all-relation'||row.relation===meta[1])&&(!q||row.entity.toLowerCase().includes(q)||row.target.toLowerCase().includes(q)));
    renderPagination(data.length);
    const pageRows=data.slice((listPage-1)*listPageSize,listPage*listPageSize);
    $('#entityListTitle').textContent=meta[1];
    $('#entityListDescription').textContent=activeType==='all-relation'?'查看图谱中的全部关系实例':`查看图谱中的${meta[1]}关系实例`;
    $('#resultTitle').textContent=activeType==='all-relation'?'全部关系列表':`${meta[1]}关系列表`;
    $('#entityTableHead').innerHTML='<tr><th>源实体</th><th>关系</th><th>目标实体</th><th>来源</th><th class="cell-actions">操作</th></tr>';
    $('#entityRows').innerHTML=pageRows.map(row=>`<tr><td>${tableEntityCell(row.entity,row.type)}</td><td>${escapeHtml(row.relation)}</td><td>${tableEntityCell(row.target,row.targetType)}</td><td>${escapeHtml(row.source)}</td><td class="cell-actions"><button class="btn btn-dense btn-text" data-locate="${row.id}">图谱定位</button><button class="btn btn-dense btn-text entity-delete-action" data-delete-relation="${row.id}">删除</button></td></tr>`).join('')||'<tr><td colspan="5" class="entity-empty">暂无匹配关系</td></tr>';
    $$('[data-locate]').forEach(button=>button.onclick=()=>{switchView('graph');const edge=edges[+button.dataset.locate];setTimeout(()=>document.querySelector(`[data-id="${nodes[edge[0]].id}"]`)?.click(),0)});
    $$('[data-delete-relation]').forEach(button=>button.onclick=()=>{const index=+button.dataset.deleteRelation;if(!edges[index])return;edges.splice(index,1);listPage=1;renderTypes();renderGraph();renderRelationList();toast('关系已删除')});
  }
  function renderList(){
    const entityMode=activeTab==='entity';
    $('.list-view').classList.toggle('entity-type-mode',entityMode);
    $('.entity-list-actions').hidden=!entityMode;
    if(entityMode)renderEntityList();else renderRelationList();
  }
  function switchView(view){currentView=view;$$('[data-view]').forEach(b=>{const on=b.dataset.view===view;b.classList.toggle('active',on);b.setAttribute('aria-selected',on)});$$('[data-view-panel]').forEach(p=>p.classList.toggle('active',p.dataset.viewPanel===view));$('.graph-panel').classList.toggle('graph-mode',view==='graph');if(view==='list')renderList()}
  $$('.type-tabs button').forEach(b=>b.onclick=()=>{activeTab=b.dataset.typeTab;activeType=(activeTab==='entity'?entityTypes:relationTypes)[0][0];typeFilterActive=activeTab==='entity';listPage=1;$$('.type-tabs button').forEach(x=>x.classList.toggle('active',x===b));renderTypes();highlightType();if(currentView==='list')renderList()});
  $('#typeSearch').oninput=renderTypes; $('#zoomIn').onclick=()=>{scale=Math.min(1.4,scale+.1);applyScale()};$('#zoomOut').onclick=()=>{scale=Math.max(.6,scale-.1);applyScale()};$('#zoomRange').oninput=e=>{scale=+e.target.value/100;applyScale()};
  $('#autoLayout').onclick=autoLayout;$('#undo').onclick=()=>toast('已撤销上一步操作');$('#redo').onclick=()=>toast('已恢复下一步操作');$('#selectMode').onclick=e=>{e.currentTarget.classList.toggle('active');toast('框选模式已切换')};
  $('#saveGraph').onclick=()=>toast('图谱已保存');$('#aiRelation').onclick=()=>toast('AI 正在分析可补充的关系');$('#addRelation').onclick=()=>modal(true);$('#closeModal').onclick=$('#cancelModal').onclick=()=>modal(false);$('#modalMask').onclick=()=>modal(false);
  $('#confirmRelation').onclick=()=>{edges.push([+$('#relationFrom').value,+$('#relationTo').value,$('#relationName').value||'关联']);renderGraph();modal(false);toast('关系已创建')};
  $$('[data-view]').forEach(b=>b.onclick=()=>switchView(b.dataset.view));$('#globalEntitySearch').oninput=()=>{listPage=1;$('#entityListSearch').value=$('#globalEntitySearch').value;if(currentView==='list')renderList();highlightType()};$('#entityListSearch').oninput=()=>{listPage=1;renderList()};$('#prevPage').onclick=()=>{if(listPage>1){listPage--;renderList()}};$('#nextPage').onclick=()=>{listPage++;renderList()};$('#pageSize').onchange=e=>{listPageSize=+e.target.value;listPage=1;renderList()};
  $('#openImport').onclick=()=>showDialog('importDialog');$('#createCurrentEntity').onclick=()=>openEntityDialog(activeType);$$('[data-close-dialog]').forEach(b=>b.onclick=()=>{editingEntityId=null;pendingDeleteEntityId=null;closeDialogs()});$('#modalMask').onclick=()=>{editingEntityId=null;pendingDeleteEntityId=null;closeDialogs()};$('#newEntityDesc').oninput=e=>$('#descCount').textContent=e.target.value.length;$('#confirmEntity').onclick=()=>{const name=$('#newEntityName').value.trim();if(!name){toast('请输入实体名称');return}const meta=entityTypes.find(x=>x[0]===currentCreateType);if(editingEntityId){const entity=entityInstances.find(item=>item.id===editingEntityId);if(entity){entity.name=name;entity.alias=$('#newEntityAlias').value.trim();entity.description=$('#newEntityDesc').value.trim();toast(`${meta[1]}已更新`)}}else{entityInstances.push({id:`e-${currentCreateType}-${Date.now()}`,type:currentCreateType,name,alias:$('#newEntityAlias').value.trim(),description:$('#newEntityDesc').value.trim(),creator:'Admin',createdAt:'2026-08-14 10:00:00'});nodes.push({id:`n${nodes.length}`,name,type:currentCreateType,x:450+Math.random()*100-50,y:280+Math.random()*100-50});toast(`${meta[1]}已创建`)}editingEntityId=null;renderTypes();renderGraph();renderList();closeDialogs()};
  $('#confirmDeleteEntity').onclick=()=>{const index=entityInstances.findIndex(item=>item.id===pendingDeleteEntityId);if(index<0)return;const [deleted]=entityInstances.splice(index,1);pendingDeleteEntityId=null;renderTypes();renderList();closeDialogs();toast(`已删除“${deleted.name}”及其关联关系`)};
  $('#importFile').onchange=e=>{$('#uploadFile span').textContent=e.target.files[0]?.name||'请选择文件'};['dragenter','dragover'].forEach(n=>$('#uploadArea').addEventListener(n,e=>{e.preventDefault();$('#uploadArea').classList.add('drag')}));['dragleave','drop'].forEach(n=>$('#uploadArea').addEventListener(n,e=>{e.preventDefault();$('#uploadArea').classList.remove('drag');if(n==='drop'&&e.dataTransfer.files[0]){$('#uploadFile span').textContent=e.dataTransfer.files[0].name}}));$('#downloadTemplate').onclick=e=>{e.preventDefault();toast('导入模板已准备下载')};$('#confirmImport').onclick=()=>{if($('#uploadFile span').textContent==='请选择文件'){toast('请先选择导入文件');return}closeDialogs();toast('文件已进入导入校验')};
  renderTypes();renderGraph();switchView('list');
})();
