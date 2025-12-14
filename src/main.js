import { mode,wrapper,header,Addbtn,modal,cancelBtn,modalContent,BtnClose,main,inputContent,inputTitle,BtnSave,Colors
} from "./dom.js";
import { AddNewNote,getNotes,DeleteNote } from "./api.js";


let selectorColor = null
let error = []
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
    const data = await getNotes()
    rendernote(data)
}
start()

function rendernote(data){
    main.innerHTML =""
    const html = data.map(note=>{
        return `
         <div class="note ${note.color}  rounded-2xl px-2 flex flex-col h-[300px]" data-id = ${note.id}>
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
    const newtitle = inputTitle.value.trim()
    const newContent = inputContent.value.trim()
    if(!newtitle) error.push("thieu tieu de")
    if(!newContent) error.push("thieu noi dung")
    if(!selectorColor) error.push("chua chon mau")
    if(error.length > 0){
        alert("thiếu:" + error.join(", "))
        return
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
    inputTitle.value = "",inputContent.value = ""
    } catch (error) {
        console.error("co loi xay ra",error)
    }
}
/* delete and edit */
main.addEventListener("click",async(e)=>{
    const note = e.target.closest(".note")
    const id = note.dataset.id
    if(e.target.closest(".Delete")){
        await DeleteNote(id)
        start()
    }
})

/* button listen event */
BtnSave.addEventListener("click",async()=>{
    const success = await handleAddNote()
    if(!success){
        modal.classList.add("opacity-0","pointer-events-none")
         modalContent.classList.add("-translate-y-6", "scale-95");
         return
    }
})
