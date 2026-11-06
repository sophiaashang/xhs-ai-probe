/* AI能力探针：逐项检测 window.xhs.AI 是否可用（平台AI文本生成 §3.10） */
function log(msg, cls){
  var d = document.createElement('div');
  d.className = 'row ' + (cls || '');
  d.textContent = msg;
  document.getElementById('out').appendChild(d);
}
function stringify(v){
  try { return JSON.stringify(v); } catch (e) { return String(v); }
}
document.getElementById('go').onclick = function(){
  var out = document.getElementById('out');
  out.innerHTML = '';
  log('① 检查 window.xhs …');
  var xhs = window.xhs;
  if (!xhs){ log('✗ 不存在——当前不在小红书容器里（浏览器预览属正常）', 'bad'); return; }
  log('✓ 在', 'ok');

  log('② 检查 window.xhs.miniTool …');
  if (!xhs.miniTool){ log('✗ 不存在', 'bad'); } else { log('✓ 在', 'ok'); }

  log('③ 读取容器版本 …');
  if (xhs.miniTool && typeof xhs.miniTool.getLaunchOptions === 'function'){
    Promise.resolve().then(function(){ return xhs.miniTool.getLaunchOptions(); })
      .then(function(o){
        log('buildVersion=' + (o && o.miniToolEnv && o.miniToolEnv.buildVersion), 'ok');
      })
      .catch(function(e){ log('读取失败：' + (e && (e.errMsg || e.message) || e), 'warn'); });
  } else {
    log('无法读取', 'warn');
  }

  log('④ 检查 window.xhs.AI …');
  if (!xhs.AI){ log('✗ 不存在——App版本低或该能力未注入', 'bad'); return; }
  log('✓ 在', 'ok');

  var model;
  try {
    model = xhs.AI.createModel('deepseek-v4-flash');
    log('⑤ createModel ✓', 'ok');
  } catch (e) {
    log('✗ createModel 失败：' + (e && (e.message || e.errMsg) || e), 'bad');
    return;
  }

  log('⑥ generateText 调用中（约几秒）…');
  Promise.resolve()
    .then(function(){
      return model.generateText({
        messages: [
          { role: 'system', content: '你是探测助手，回答要极简。' },
          { role: 'user', content: '用不超过10个字打个招呼' }
        ],
        max_output_tokens: 64
      });
    })
    .then(function(r){
      var text = '';
      if (r){
        if (typeof r.text === 'string') text = r.text;
        else if (typeof r.result === 'string') text = r.result;
        else if (typeof r.content === 'string') text = r.content;
        else text = stringify(r).slice(0, 300);
      }
      if (text){ log('✓ AI 回复：' + text, 'ok big'); log('结论：AI 可用 🎉（把这屏截图发我）', 'big'); }
      else { log('返回为空：' + stringify(r).slice(0, 300), 'warn'); }
    })
    .catch(function(e){
      var m = (e && (e.errMsg || e.message)) || String(e);
      log('✗ 调用失败：' + m, 'bad');
      if (String(m).indexOf('AI_NOT_ALLOWED') >= 0){
        log('结论：AI_NOT_ALLOWED——appId 未加白，需在开发者群提交 uid', 'warn big');
      } else {
        log('结论：其他错误（截图发我）', 'warn');
      }
    });
};
