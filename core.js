export const dishes=[
 {id:1,name:'Hainanese Chicken Rice',stall:'Uncle Lim’s Kitchen',venue:'Kampung Commons',emoji:'🍗',cuisine:'Chinese',price:5.5,spice:0,vegetarian:false,description:'Poached chicken, fragrant rice and a bright ginger dip.',tags:['Comfort food','Mild'],ingredients:'Chicken, rice, ginger, stock. Sauce ingredients vary.',colour:'peach'},
 {id:2,name:'Garden Yong Tau Foo',stall:'Green Bowl',venue:'Kampung Commons',emoji:'🥬',cuisine:'Chinese',price:6,spice:0,vegetarian:true,description:'A colourful bowl of tofu and vegetables in vegetable broth.',tags:['Vegetarian recipe','Mild'],ingredients:'Tofu, leafy greens, mushrooms, vegetable stock. Confirm sauces.',colour:'green'},
 {id:3,name:'Kampung Nasi Lemak',stall:'Coconut & Spice',venue:'Kampung Commons',emoji:'🍚',cuisine:'Malay',price:5,spice:2,vegetarian:false,description:'Coconut rice with egg, crunchy ikan bilis and sambal.',tags:['Local favourite','Spicy'],ingredients:'Rice, coconut milk, egg, anchovies, peanuts, sambal.',colour:'yellow'},
 {id:4,name:'Masala Thosai',stall:'Little Tiffin',venue:'Kampung Commons',emoji:'🫓',cuisine:'Indian',price:4.5,spice:1,vegetarian:true,description:'A crisp fermented crepe with spiced potato and chutney.',tags:['Vegetarian recipe','Medium spice'],ingredients:'Rice, lentils, potato, spices, oil. Chutney ingredients vary.',colour:'peach'},
 {id:5,name:'Prawn Laksa',stall:'Nyonya Corner',venue:'Kampung Commons',emoji:'🍜',cuisine:'Peranakan',price:6.5,spice:2,vegetarian:false,description:'Rice noodles in a rich coconut broth with prawns.',tags:['Rich broth','Spicy'],ingredients:'Rice noodles, prawns, coconut milk, spice paste, fish cake.',colour:'red'},
 {id:6,name:'Kaya Toast Set',stall:'Morning Kopi',venue:'Kampung Commons',emoji:'🍞',cuisine:'Chinese',price:4,spice:0,vegetarian:true,description:'Crisp toast, kaya, soft eggs and a warm cup of kopi.',tags:['Breakfast','Mild'],ingredients:'Bread, eggs, coconut, butter, coffee. Bread may contain milk.',colour:'yellow'}
];
export const defaultPrefs={query:'',budget:8,cuisine:'',spice:2,vegetarian:false,area:'',goal:'any',priority:'relevance',visitor:false};
// Recipe examples are fictional, calculated by nutrition() below, and are not stall measurements.
const dishRecipes={1:[['rice',200],['chicken',100],['oil',8],['salt',1]],2:[['tofu',120],['vegetables',200],['oil',5],['salt',1.2]],3:[['rice',200],['coconut',80],['egg',50],['peanuts',15],['anchovy',10],['oil',10],['salt',1.4]],4:[['rice',100],['lentils',80],['potato',100],['oil',10],['salt',1]],6:[['bread',60],['kaya',30],['butter',10],['egg',100]]};
export function dishRecipe(id){const recipe=dishRecipes[id];return recipe?recipe.map(([ingredient,grams])=>({ingredient,grams})):null;}
export function dishNutrition(id){const recipe=dishRecipe(id);return recipe?nutrition(recipe,1):null;}
export function areaFor(id){return id<=3?'Riverside (demo)':'Neighbourhood (demo)';}
export function recommend(items,prefs={}){
 const options={...defaultPrefs,...prefs},budget=Number(options.budget),spice=Number(options.spice);
 if(!Number.isFinite(budget)||budget<0||!Number.isFinite(spice)||spice<0)return [];
 const q=String(options.query||'').trim().toLowerCase();
 return items.map(d=>({...d,area:areaFor(d.id),estimate:dishNutrition(d.id)})).filter(d=>{
  if(d.price>budget||d.spice>spice||(options.vegetarian&&!d.vegetarian)||(options.cuisine&&d.cuisine!==options.cuisine)||(options.area&&d.area!==options.area))return false;
  if(q&&![d.name,d.stall,d.cuisine,d.description,...d.tags].join(' ').toLowerCase().includes(q))return false;
  if(options.goal==='energy600'&&(!d.estimate||d.estimate.kcal>600))return false;
  if(options.goal==='protein20'&&(!d.estimate||d.estimate.protein<20))return false;
  if(options.goal==='sodium700'&&(!d.estimate||d.estimate.sodium>700))return false;
  return true;
 }).map(d=>{
  const reasons=[`${d.price.toFixed(2)} SGD is within your ${budget.toFixed(0)} SGD budget`,d.spice===0?'Mild dish':d.spice===1?'Medium spice':'Spicy dish'];
  if(options.area)reasons.push(`In your selected area: ${d.area}`);
  if(options.vegetarian)reasons.push('Vegetarian sample recipe');
  if(options.goal!=='any')reasons.push('Meets your selected threshold in the fictional recipe example');
  if(options.visitor)reasons.push('Plain-language dish and ingredient guide available');
  // Transparent content-based scoring. Hard filters above always apply before scoring.
  const score=50+(options.cuisine===d.cuisine?20:0)+(d.spice===spice?5:0)+(options.visitor?2:0)+(budget-d.price)/Math.max(1,budget)*5;
  return {...d,reasons,score};
 }).sort((a,b)=>options.priority==='price'?a.price-b.price||a.id-b.id:options.priority==='protein'?(b.estimate?.protein??-1)-(a.estimate?.protein??-1)||a.id-b.id:b.score-a.score||a.id-b.id);
}
export function aggregateDemand(signals,area='',minimum=5){
 const accepted=signals.filter(s=>s.consent===true&&(!area||s.area===area));
 const group=key=>{const buckets=new Map();for(const s of accepted){const v=s[key];if(v)buckets.set(v,(buckets.get(v)||0)+1)}return [...buckets].filter(([,count])=>count>=minimum).map(([label,count])=>({label,count})).sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label));};
 if(accepted.length<minimum)return {suppressed:true,total:null,cuisines:[],budgets:[],goals:[]};
 return {suppressed:false,total:accepted.length,cuisines:group('cuisine'),budgets:group('budgetBand'),goals:group('goal')};
}
// Synthetic cohort only. The app does not send visitor preferences into this dataset.
export const demoDemand=Array.from({length:48},(_,i)=>({consent:true,area:i<24?'Riverside (demo)':'Neighbourhood (demo)',cuisine:['Chinese','Malay','Indian'][i%3],budgetBand:i%4===0?'S$8–10':'S$4–6',goal:i%3===0?'Protein preference':i%3===1?'Energy preference':'No nutrition preference'}));
export function profitScenario({meals,price,variableCost,fixedCost,waste,extraMeals=0,wasteSaving=0}){
 const values=[meals,price,variableCost,fixedCost,waste,extraMeals,wasteSaving];
 if(values.some(x=>!Number.isFinite(x)||x<0)||wasteSaving>waste)throw Error('Use non-negative values. Waste saving cannot exceed current waste cost.');
 const baseline=meals*(price-variableCost)-fixedCost-waste;
 const scenario=(meals+extraMeals)*(price-variableCost)-fixedCost-(waste-wasteSaving);
 return {baseline,scenario,change:scenario-baseline};
}
// Illustrative ingredient coefficients per 100g. Replace with a licensed, validated database before real use.
export const nutrients={rice:{label:'Cooked rice',kcal:130,protein:2.7,carbs:28,fat:0.3,sodium:1},chicken:{label:'Cooked chicken',kcal:165,protein:31,carbs:0,fat:3.6,sodium:74},tofu:{label:'Firm tofu',kcal:144,protein:17.3,carbs:2.8,fat:8.7,sodium:14},vegetables:{label:'Mixed vegetables',kcal:35,protein:2,carbs:7,fat:0.3,sodium:30},oil:{label:'Cooking oil',kcal:884,protein:0,carbs:0,fat:100,sodium:0},coconut:{label:'Coconut milk',kcal:230,protein:2.3,carbs:5.5,fat:23.8,sodium:15},egg:{label:'Cooked egg',kcal:155,protein:12.6,carbs:1.1,fat:10.6,sodium:124},salt:{label:'Salt',kcal:0,protein:0,carbs:0,fat:0,sodium:39300}};
Object.assign(nutrients,{bread:{label:'Bread',kcal:265,protein:9,carbs:49,fat:3.2,sodium:490},kaya:{label:'Kaya (example)',kcal:300,protein:3,carbs:55,fat:8,sodium:80},butter:{label:'Butter',kcal:717,protein:0.9,carbs:0.1,fat:81,sodium:643},potato:{label:'Cooked potato',kcal:87,protein:1.9,carbs:20,fat:0.1,sodium:4},lentils:{label:'Cooked lentils',kcal:116,protein:9,carbs:20,fat:0.4,sodium:2},peanuts:{label:'Peanuts',kcal:567,protein:26,carbs:16,fat:49,sodium:18},anchovy:{label:'Anchovy (example)',kcal:210,protein:29,carbs:0,fat:10,sodium:1000}});
export function nutrition(rows,servings=1){
 if(!Number.isFinite(servings)||servings<=0)throw Error('Servings must be greater than zero.');
 const totals={kcal:0,protein:0,carbs:0,fat:0,sodium:0};
 for(const {ingredient,grams} of rows){if(!nutrients[ingredient]||!Number.isFinite(grams)||grams<0||grams>100000)throw Error('Enter valid ingredient weights.');for(const k of Object.keys(totals))totals[k]+=nutrients[ingredient][k]*grams/100/servings;}
 return Object.fromEntries(Object.entries(totals).map(([k,v])=>[k,Math.round(v*10)/10]));
}
export const sampleReviews=[
 {id:'r1',author:'Diner A',stall:'Uncle Lim’s Kitchen',rating:5,text:'Best food amazing service must visit',time:'2026-10-30T12:00:00+08:00'},
 {id:'r2',author:'Diner B',stall:'Uncle Lim’s Kitchen',rating:5,text:'Best food amazing service must visit',time:'2026-10-30T12:03:00+08:00'},
 {id:'r3',author:'Diner C',stall:'Uncle Lim’s Kitchen',rating:5,text:'Best food amazing service must visit',time:'2026-10-30T12:05:00+08:00'},
 {id:'r4',author:'Diner A',stall:'Nyonya Corner',rating:5,text:'Best food amazing service must visit',time:'2026-10-30T12:08:00+08:00'},
 {id:'r5',author:'Diner B',stall:'Nyonya Corner',rating:5,text:'Best food amazing service must visit',time:'2026-10-30T12:10:00+08:00'},
 {id:'r6',author:'Diner D',stall:'Green Bowl',rating:3,text:'Fresh greens. Soup was a little salty for me.',time:'2026-10-29T13:00:00+08:00'}
];
const tokens=t=>new Set(t.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu,' ').split(/\s+/).filter(Boolean));
function similarity(a,b){const x=tokens(a),y=tokens(b);return new Set([...x,...y]).size?[...x].filter(v=>y.has(v)).length/new Set([...x,...y]).size:0;}
export function analyseReviews(reviews){
 if(!Array.isArray(reviews)||reviews.length>300)throw Error('Supply an array of at most 300 reviews.');
 const ids=new Set();
 for(const r of reviews){if(!r||typeof r.id!=='string'||ids.has(r.id)||typeof r.text!=='string'||!r.text.trim()||r.text.length>5000||typeof r.author!=='string'||typeof r.stall!=='string'||!Number.isInteger(r.rating)||r.rating<1||r.rating>5||!Number.isFinite(Date.parse(r.time)))throw Error('Every review needs a unique id, author, stall, text, rating 1–5 and valid time.');ids.add(r.id);}
 return reviews.map(r=>{
  const other=reviews.filter(o=>o.id!==r.id), reasons=[];
  if(other.some(o=>similarity(r.text,o.text)>=0.85))reasons.push('Similar wording appears in other reviews');
  if([1,5].includes(r.rating)&&other.filter(o=>o.stall===r.stall&&o.rating===r.rating&&Math.abs(Date.parse(o.time)-Date.parse(r.time))<=30*60000).length>=2)reasons.push('At least 3 extreme ratings within a 30-minute window');
  const targets=new Set(reviews.filter(o=>o.author===r.author).map(o=>o.stall));
  if(targets.size>=2&&other.some(o=>o.author!==r.author&&[...targets].filter(t=>reviews.some(z=>z.author===o.author&&z.stall===t)).length>=2))reasons.push('Reviewer overlaps multiple stalls with another account');
  return {...r,reasons,priority:reasons.length>=2?'Review first':reasons.length?'Check context':'No pattern flagged'};
 });
}
export function draftContent(dish,channel){
 const intro=channel==='Story'?'Behind every plate is a hawker’s craft.':channel==='Short video'?'[Opening shot] A closer look at today’s dish.':'Your next hawker meal, discovered.';
 return `${intro}\n\n${dish.name} at ${dish.stall}. ${dish.description}\n\nS$${dish.price.toFixed(2)} · ${dish.venue}\n\n${channel==='Short video'?'[Closing shot] Show the stall and invite diners to explore.':'Explore the stall and find a dish that fits your day.'}\n\n#HawkerConnect #SupportOurHawkers\n\nDraft only. Confirm price, availability, wording and media rights before publication.`;
}
