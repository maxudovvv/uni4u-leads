(function(root){
  const statuses=['Новая','Написали','Ответил','Консультация','В работе','Закрыта'];
  function today(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit'}).format(now)}
  function day(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value+'T12:00Z'))&&new Date(value+'T12:00Z').toISOString().slice(0,10)===value}
  function text(v,max,required=false){return typeof v==='string'&&v.length<=max&&(!required||v.trim().length>0)}
  function validate(value){
    const leads=Array.isArray(value)?value:value?.version===1?value.leads:null;
    if(!Array.isArray(leads)||leads.length>2000)throw Error('Нужна копия Uni4U, не более 2000 заявок.');
    const ids=new Set();
    for(const l of leads){
      if(!l||!text(l.id,100,true)||!/^[A-Za-z0-9_-]+$/.test(l.id)||ids.has(l.id)||!text(l.name,100,true)||!text(l.email,254,true)||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l.email)||!text(l.phone,60)||!text(l.program,200,true)||!text(l.owner,100,true)||!Number.isInteger(l.year)||l.year<2026||l.year>2100||!statuses.includes(l.status)||!Number.isFinite(Date.parse(l.created))||l.first!==null&&!Number.isFinite(Date.parse(l.first))||!text(l.task,500)||!text(l.notes,20000)||!(l.due===''||day(l.due))||!Array.isArray(l.history)||l.history.length>5000||l.history.some(h=>!h||!text(h.text,5000,true)||!Number.isFinite(Date.parse(h.at))))throw Error('Копия содержит некорректные или повторяющиеся заявки. Текущие данные сохранены.');
      ids.add(l.id);
      if(l.flow){const f=l.flow;if(!Number.isInteger(f.followups)||f.followups<0||f.followups>2||f.reply!==null&&!Number.isFinite(Date.parse(f.reply))||f.booking&&(!day(f.booking.date)||!['10:00','12:00','14:00','16:00'].includes(f.booking.time)))throw Error('Некорректные данные консультации.');}
    }
    return leads;
  }
  function bookingError(leads,lead,date,time,now=new Date()){
    if(!day(date)||!['10:00','12:00','14:00','16:00'].includes(time)||new Date(`${date}T${time}:00+03:00`)<=now)return 'Выберите будущее время (Стамбул).';
    if(lead.status==='Закрыта')return 'Сначала откройте закрытую заявку.';
    if(leads.some(l=>l.id!==lead.id&&l.status!=='Закрыта'&&l.owner.trim().toLocaleLowerCase()===lead.owner.trim().toLocaleLowerCase()&&l.flow?.booking?.date===date&&l.flow.booking.time===time))return 'У этого менеджера уже есть консультация в выбранное время.';
    return '';
  }
  function csv(leads){const rows=[['Имя','Email','Телефон','Программа','Год','Статус','Ответственный','Действие','Дата'],...leads.map(l=>[l.name,l.email,l.phone,l.program,l.year,l.status,l.owner,l.task,l.due])];return '\uFEFF'+rows.map(r=>r.map(v=>'"'+String(v).replace(/^[=+@\-\t\r]/,"'$&").replaceAll('"','""')+'"').join(',')).join('\r\n')}
  root.UniDomain={today,day,validate,bookingError,csv};
  if(typeof module!=='undefined')module.exports=root.UniDomain;
})(typeof globalThis==='undefined'?window:globalThis);
