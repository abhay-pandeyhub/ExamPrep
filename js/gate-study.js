(async function(){
const title=document.getElementById('topicTitle'), sub=document.getElementById('subjectName'), output=document.getElementById('studyContent'), index=document.getElementById('studyIndex');
const el=(tag,text,cls)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node;};
let selection;try{selection=JSON.parse(localStorage.getItem('gateSelectedTopic'));}catch(e){}
if(!selection?.subject||!selection?.topic){title.textContent='No topic selected';output.append(el('p','Please choose a subject and topic first.'));return;}
title.textContent=selection.topic;sub.textContent=selection.subject;
try{const response=await fetch('data/gate-notes.json');if(!response.ok)throw Error('HTTP '+response.status);const notes=await response.json();const note=notes[selection.subject+'::'+selection.topic];if(!note){output.append(el('p','Notes not available for this topic yet.'));return;}
note.sections.forEach((section,i)=>{const card=el('section',undefined,'study-section');card.id='section-'+i;card.append(el('h2',(i+1)+'. '+section.heading));card.append(el('p',section.body, i===2||i===3||i===4?'study-callout':undefined));if(section.points){const list=el('ul');section.points.forEach(p=>list.append(el('li',p)));card.append(list);}output.append(card);const link=el('a',section.heading);link.href='#'+card.id;index.append(link);});
}catch(error){output.append(el('p','Could not load notes. Open the site using VS Code Live Server and check data/gate-notes.json.'));console.error(error);}
})();