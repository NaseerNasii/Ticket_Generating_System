let addBtn=document.querySelector(".add-btn");
let addmodel=true;
let modelCont=document.querySelector(".model-cont");
let mainCont=document.querySelector(".main-cont");
let text=document.querySelector(".textarea-cont");
let allprioritycolours=document.querySelectorAll(".priority-colours");
let colorarr=['lightpink','blue','green','black'];
let ticketcolour=colorarr[colorarr.length-1];
let trash=document.querySelector(".remove-btn");
let trashflag=true;
var uid = new ShortUniqueId();
let toolboxcolour=document.querySelectorAll(".colour");
let count=document.querySelector(".total-btn");
let countarea=document.querySelector(".ticcount");
let countflag=true;

let ticketarr=[];
let opennext=document.querySelector(".open");
let mod1=document.querySelector(".mod1");
let mod2=document.querySelector(".mod2");

opennext.addEventListener("click",function(){
    mod1.style.display="none";
    mod2.style.display="inline";
});






//getting data from local storage
if(localStorage.getItem("tickets")){
    ticketarrstr=localStorage.getItem("tickets");
    ticketarr=JSON.parse(ticketarrstr);
    for(let k=0;k<ticketarr.length;k++){
        let colour=ticketarr[k].colour;
        let txt=ticketarr[k].text;
        let id=ticketarr[k].id;
        ticketcreat(colour,txt,id);
    }
}

//toolbox priority colours filter
for(let i=0;i<toolboxcolour.length;i++){
    toolboxcolour[i].addEventListener("click",function(){
         let currentcolour=toolboxcolour[i].classList[1];
         let filteredarr=ticketarr.filter(function(ticketbj){
              return currentcolour == ticketbj.colour;
            })
         let alltic=document.querySelectorAll(".ticket-cont");
         for(let j=0;j<alltic.length;j++){
            alltic[j].remove();
         }
         for(let k=0;k<filteredarr.length;k++){
            let colour=filteredarr[k].colour;
            let txt=filteredarr[k].text;
            let id=filteredarr[k].id;
            ticketcreat(colour,txt,id);
        }
        countarea.style.display="flex";
        countarea.textContent=filteredarr.length;
    toolboxcolour[i].addEventListener("dblclick",function(){
        let alltic=document.querySelectorAll(".ticket-cont");
        for(let j=0;j<alltic.length;j++){
           alltic[j].remove();
        }
        for(let k=0;k<ticketarr.length;k++){
            let colour=ticketarr[k].colour;
            let txt=ticketarr[k].text;
            let id=ticketarr[k].id;
            ticketcreat(colour,txt,id);
        }
        countarea.style.display="none";
        countarea.textContent="";
     })
    })
}


//showing model
addBtn.addEventListener("click",function(e){
    //Display a module
    if(addmodel){
        modelCont.style.display="flex";
    }else{
        modelCont.style.display="none";
    }
    addmodel=!addmodel;
});

//generating ticket
modelCont.addEventListener("keydown",function(e){
   
    let entertext=e.key;
    if(entertext =="Enter"){
        ticketcreat(ticketcolour,text.value);
        text.value="";
        modelCont.style.display="none";
        addmodel=!addmodel;
    }
   
})
//ticket stored
function ticketcreat(ticketcolour,text,ticketId){
    let id;
    if(!ticketId){
        id=uid();
    }else{
        id=ticketId;
    }
    let ticket=document.createElement('div');
    ticket.setAttribute('class','ticket-cont');
    ticket.innerHTML=`<div class="ticket-colour ${ticketcolour}"></div>
                      <div class="ticket-id">#${id}</div>
                      <div class="task-area">${text}</div>
                      <div class="ticket-lock"><i class="fa fa-lock"></i></div>`
    mainCont.appendChild(ticket);
    removeTicket(ticket,id);
    colorhandle(ticket,id);
    
    lockunlock(ticket,id);

    if(!ticketId){
        ticketarr.push({"colour":ticketcolour,"text":text,"id":id});
        let ticketarrstr=JSON.stringify(ticketarr);
        localStorage.setItem("tickets",ticketarrstr);
    }
}
//priority colour changed
for(let i=0;i<allprioritycolours.length;i++){
    let oneprioritycolour=allprioritycolours[i];
    oneprioritycolour.addEventListener("click",function(e){
        for(let j=0;j<allprioritycolours.length;j++){
            allprioritycolours[j].classList.remove("active");
        }
        oneprioritycolour.classList.add("active");
        ticketcolour=oneprioritycolour.classList[0];
    })
}
//delete button clicked it should change red
trash.addEventListener("click",function(e){
        if(trashflag){
            trash.style.color="red";

        }else{
            trash.style.color="black";
        }
        trashflag=!trashflag;
})
//delete ticket
function removeTicket(ticket,id){
    ticket.addEventListener("click",function(e){
        if(!trashflag){
            let idx=getTicketIdx(id);
            ticketarr.splice(idx,1);
            let ticketarrstr=JSON.stringify(ticketarr);
            localStorage.setItem("tickets",ticketarrstr);
            ticket.remove();
        }

    })
}

//colurs changing in ticket head
function colorhandle(ticket,id){
    let ticcol=ticket.querySelector(".ticket-colour");
    ticcol.addEventListener("click",function(e){
        let presentcolour=ticcol.classList[1];
        let presentcolourindex=colorarr.findIndex(function(color){
            return presentcolour===color;
        })
        let newcol=colorarr[(presentcolourindex+1)%colorarr.length];
        let lockelement=ticket.querySelector(".ticket-lock i");
        if(lockelement.classList.contains("fa-unlock")){
                ticcol.classList.remove(presentcolour);
                ticcol.classList.add(newcol);
                let ticIdx=getTicketIdx(id);
                ticketarr[ticIdx].colour=newcol;
                let ticketarrstr=JSON.stringify(ticketarr);
                localStorage.setItem("tickets",ticketarrstr);
        }
    })
}
//lock and unlock ticket
function lockunlock(ticket,id){
    let lockelement=ticket.querySelector(".ticket-lock i");
    let taskarea=ticket.querySelector(".task-area");
    lockelement.addEventListener("click",function(e){
        let ticidx=getTicketIdx(id);
        if(lockelement.classList.contains("fa-lock")){
            lockelement.classList.remove("fa-lock");
            lockelement.classList.add("fa-unlock");
            taskarea.setAttribute('contenteditable','true');
        }else{
            lockelement.classList.remove("fa-unlock");
            lockelement.classList.add("fa-lock");
            taskarea.setAttribute('contenteditable','false');
        }
        ticketarr[ticidx].text=taskarea.innerText;
        localStorage.setItem("tickets",JSON.stringify(ticketarr));
    })
}
function getTicketIdx(id){
    let idx=ticketarr.findIndex(function(ticketObj){
        return ticketObj.id==id;
    })
    return idx;
}

count.addEventListener("click",function(){
 
    if(countflag){
        countarea.style.display="flex";
        countarea.textContent="Total "+ticketarr.length+" Ticket's Created";
    }else{
        countarea.style.display="none";
        countarea.textContent="";
    }

    countflag=!countflag;
})
