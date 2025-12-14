const Api = "http://localhost:3000/notes"

export async function getNotes() {
    try {
        const res = await fetch(Api)
        const data = await res.json()
        return data
    } catch (error) {
        console.error("co loi khi ket noi serer",error)
        console.log("co loi xay ra khi noi server")
    }
    
}
/* function for addnew data */
export async function AddNewNote(newNote) {
    try {
        const option = {
        method: "POST",
        headers: {
                "Content-Type": "application/json"
                 },
        body: JSON.stringify(newNote)
    }
    const res = await fetch(Api,option)
    } catch (error) {
        console.error("co loi khi them note vao serer",error)
        console.log("co loi xay ra khi noi server")
    }
}
/* function for delete */
export async function DeleteNote(id) {
    try {
        const option ={
            method: "DELETE"
        }
        const res = await fetch(`${Api}/${id}`,option)
    } catch (error) {
        console.error("co loi khi them note vao serer",error)
        console.log("co loi xay ra khi noi server")
    }
}