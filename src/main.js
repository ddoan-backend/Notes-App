import { mode,wrapper,header,Addbtn,modal,cancelBtn,modalContent,BtnClose,main,inputContent,inputTitle,BtnSave,Colors
,modalContentEdit,modalEdit,inputTitleEdit,inputEditContent,SaveEdit,CloseEdit,CancelEdit,filter,search,searchBtn} from "./dom.js";
import { AddNewNote,getNotes,DeleteNote,EditNote } from "./api.js";


let selectorColor = null
let currentId = 0
let Notelist =  []
/* night mode */
mode.addEventListener("click" ,()=>{
    const isDark = wrapper.classList.toggle("bg-black")
    if(isDark){
        wrapper.classList.add("bg-gray-900" , "text-white")
        header.classList.remove("bg-gray-50")

        /* mode button */
        mode.classList.remove("bg-black")
        mode.classList.add("bg-white")
        /* modal content */
        modalContent.classList.remove("bg-white")
        modalContent.classList.add("bg-black","text-white")
        /* cancel button */
        cancelBtn.classList.remove("bg-black/20")
        cancelBtn.classList.add("bg-red-500")
        mode.innerHTML = `
        <i class="fa-solid fa-sun text-yellow-400 "></i>
        `
        
    }else{
        wrapper.classList.remove("bg-gray-900" , "text-white")
        header.classList.add("bg-gray-50")

        /* mode button */
        mode.classList.add("bg-black")
        mode.classList.remove("bg-white")
        /* modal content */
        modalContent.classList.add("bg-white")
        modalContent.classList.remove("bg-black","text-white")
        /* cancel button */
        cancelBtn.classList.add("bg-black/20")
        cancelBtn.classList.remove("bg-red-500")
        mode.innerHTML = `
        <i class="fa-solid fa-moon text-yellow-400"></i>
        `
    }
})
/* dong mo modal */
Addbtn.addEventListener("click",()=>{
    selectorColor = null
    inputTitle.value = ""
    inputContent.value =""
    modal.classList.remove("opacity-0","pointer-events-none")
    modalContent.classList.remove("-translate-y-6", "scale-95");
})
cancelBtn.addEventListener("click",()=>{
    modal.classList.add("opacity-0","pointer-events-none")
    modalContent.classList.add("-translate-y-6", "scale-95");
})
/* close modal by button x */
BtnClose.addEventListener("click",()=>{
    modal.classList.add("opacity-0","pointer-events-none")
    modalContent.classList.add("-translate-y-6", "scale-95");
})
/* CRUD APP */
async function start() {
    Notelist = await getNotes()
    applyrender()
}
start()

function rendernote(data){
    main.innerHTML =""
    const html = data.map(note=>{
        return `
         <div class="note ${note.color}  rounded-2xl px-2 flex flex-col h-[300px] min-h-0" data-id = ${note.id}>
            <h3 class="font-bold text-lg">${note.title}</h3>

             <div class="content text-sm text-gray-700 overflow-y-auto flex-1">
                ${note.content}
             </div>
            
            <div class="buttonNote flex gap-2 justify-end">
                <button class="buttonNote bg-white Edit">Edit</button>
                <button class="buttonNote bg-red-600 Delete">Delete</button>
            </div>
        </div>
        `
    })
    main.innerHTML = html.join("")
}

/* select color */
Colors.forEach(color =>{
        color.addEventListener("click",()=>{
            selectorColor = color.dataset.color
        })
    })
/* addd new note */
async function handleAddNote() {
    let error = []
    const newtitle = inputTitle.value.trim()
    const newContent = inputContent.value.trim()
    if(!newtitle) error.push("thieu tieu de")
    if(!newContent) error.push("thieu noi dung")
    if(!selectorColor) error.push("chua chon mau")
    if(error.length > 0){
        alert("thiếu:" + error.join(", "))
        return false
    }
    try {
        const form ={
            title : newtitle,
            content : newContent,
            color : selectorColor
        }
    await AddNewNote(form)

    start()
    inputTitle.value =""
    inputContent.value = ""
    selectorColor = null
    error = []
    return true
    } catch (error) {
        console.error("co loi xay ra",error)
    }
}
/* delete and edit */
main.addEventListener("click",async(e)=>{
    const note = e.target.closest(".note")
    if(!note)return
    const id = note.dataset.id
    if(e.target.closest(".Delete")){
        await DeleteNote(id)
        start()
    }
    if(e.target.closest(".Edit")){
        currentId = note.dataset.id
        modalEdit.classList.remove("opacity-0", "pointer-events-none")
        modalContentEdit.classList.remove("-translate-y-6", "scale-95")
    }
})
async function handleEditNote(id) {
    const ERROR =[]

    const newtitleEdit = inputTitleEdit.value.trim()
    const newcontentEdit = inputEditContent.value.trim()
    if(!newtitleEdit) ERROR.push("thieu tieu de")
    if(!newcontentEdit) ERROR.push("thieu content")
    if(!selectorColor) ERROR.push("chua chon mau")
    if(ERROR.length > 0){
        alert("thieu" + ERROR.join(", "))
        return false
    }
    try {
        const newform = {
            title:newtitleEdit,
            content:newcontentEdit,
            color:selectorColor
        }
    await EditNote(id,newform)
    start()

    inputEditContent.value =""
    inputTitleEdit.value =""
    selectorColor = null
    return true
    } catch (error) {
        console.error("co loi xay ra",error)
    }
}

/* button listen event */
BtnSave.addEventListener("click",async()=>{
    const success = await handleAddNote()
    if(success){
        modal.classList.add("opacity-0","pointer-events-none")
         modalContent.classList.add("-translate-y-6", "scale-95");
         currentId = 0
         return
    }
})
SaveEdit.addEventListener("click",async()=>{
    const success = await handleEditNote(currentId)
    if(success){
         modalEdit.classList.add("opacity-0","pointer-events-none")
        modalContentEdit.classList.add("-translate-y-6","scale-95")
        currentId = 0
    }
})
CancelEdit.addEventListener("click",()=>{
     modalEdit.classList.add("opacity-0","pointer-events-none")
    modalContentEdit.classList.add("-translate-y-6","scale-95")
})
CloseEdit.addEventListener("click",()=>{
     modalEdit.classList.add("opacity-0","pointer-events-none")
    modalContentEdit.classList.add("-translate-y-6","scale-95")
})

/* filter color note */
async function applyrender() {
    const value = filter.value.trim()
    let filtered = Notelist

    if(value === "Red"){
        filtered = Notelist.filter(note=>note.color === "bg-red-300")
    }
    if(value === "Yellow"){
        filtered = Notelist.filter(note=>note.color === "bg-yellow-300")
    }
    if(value === "Blue"){
        filtered = Notelist.filter(note=>note.color === "bg-blue-300")
    }
    rendernote(filtered)
}
filter.addEventListener("change",applyrender)

/* search note */
function searchNote(){
    const keyword = search.value.trim().toLowerCase()

    if(!keyword){
        applyrender()
        return
    }
    const result = Notelist.filter(note=>
            note.title.toLowerCase().includes(keyword)||
            note.content.toLowerCase().includes(keyword)
    )
    rendernote(result)
}
/* button search */
search.addEventListener("input",searchNote)
searchBtn.addEventListener("click",searchNote)
search.addEventListener("keydown",e=>{
    if(e.key === "Enter")searchNote()
})

