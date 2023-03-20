const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupTitle = popupBox.querySelector("header p"),
closeIcon = popupBox.querySelector("header i"),
titleTag = popupBox.querySelector("input"),
descTag = popupBox.querySelector("textarea"),
addBtn = popupBox.querySelector("button");

const months = ["January", "February", "March", "April", "May", "June",
                 "July", "August", "September", "October", "November", "December"];
//getting localstorage notes if exist and parsing them
// to js object else passing an empty array to notes
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;

addBox.addEventListener("click" , () => {
    titleTag.focus();
    popupBox.classList.add("show");
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = "";
    descTag.value = "";
    addBtn.innerText = "Add Note";
    popupTitle.innerText = "Add a new Note";
    popupBox.classList.remove("show");
});

function showNotes(){
    document.querySelectorAll(".note").forEach(note => note.remove());
    notes.forEach( (note, index) => {
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${note.description}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick = "updateNote(${index}, '${note.title}', '${note.description}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick = "deleteNote(${index})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);
    });
}
showNotes();

// Bu fonksiyon, menünün açılması için kullanılır.
function showMenu(elem) {
    elem.parentElement.classList.add("show");
    // Menü dışında bir yere tıklanınca menü kapatılır.
    document.addEventListener("click", e =>{
        if(e.target.tagName != "I" || e.target != elem){
            elem.parentElement.classList.remove("show");
        }
    });
}

// Bu fonksiyon, bir notun silinmesini sağlar.
function deleteNote(noteId){
    // Silme işleminin onaylanması istenir.
    let confirmDel = confirm("Bu notu silmek istediğinize emin misiniz?");
    if(!confirmDel) return;
    // Not dizisinden seçilen not silinir.
    notes.splice(noteId, 1);
    // Notları yerel depolamaya kaydetme
    localStorage.setItem("notes", JSON.stringify(notes)); 
    // Notları yeniden göster
    showNotes();
}

// Bu fonksiyon, bir notun güncellenmesi için kullanılır.
function updateNote(noteID, title, desc)
{
    // Güncelleme modu başlatılır.
    isUpdate = true;
    updateId = noteID;
    // Not ekleme kutusu açılır.
    addBox.click();
    // Başlık ve açıklama alanlarına veriler yazılır.
    titleTag.value = title;
    descTag.value = desc;
    // Ekleme butonu "Notu Güncelle" olarak değiştirilir.
    addBtn.innerText = "Update Note";
    // Popup penceresinin başlığı "Not Güncelleme" olarak değiştirilir.
    popupTitle.innerText = "Update a Note";
    console.log(noteID, title, desc);
}

// Ekleme butonuna tıklanınca çalışacak fonksiyon
addBtn.addEventListener("click", e=>{
    e.preventDefault(); // Formun submit olmasını engeller.

    // Girilen not başlık ve açıklama değerleri alınır.
    let noteTitle = titleTag.value,
        noteDesc = descTag.value;

    // Not başlığı veya açıklama boş değilse devam edilir.
    if(noteTitle || noteDesc)
    {
        // Tarih bilgisi oluşturulur.
        let dateObj = new Date(),
            month = months[dateObj.getMonth()],
            day = dateObj.getDate(),
            year = dateObj.getFullYear();

        // Yeni notun bilgileri oluşturulur.
        let noteInfo =  {
            title: noteTitle, 
            description: noteDesc,
            date: `${month} ${day}, ${year}`
        }

        // Güncelleme modu açık değilse notlar dizisine yeni not eklenir.
        if(!isUpdate){
            notes.push(noteInfo);
        }
        // Güncelleme modu açıksa, seçilen notun bilgileri güncellenir.
        else{
            isUpdate = false;
            notes[updateId] = noteInfo;
        }
        
        // Notlar yerel depolamaya kaydedilir.
        localStorage.setItem("notes", JSON.stringify(notes)); 
        // Not ekleme kutusu kapatılır.
        closeIcon.click();
        // Notlar yeniden gösterilir.
        showNotes();
    }

});
