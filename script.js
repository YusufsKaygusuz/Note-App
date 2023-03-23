const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupTitle = popupBox.querySelector("header p"),
closeIcon = popupBox.querySelector("header i"),
titleTag = popupBox.querySelector("input"),
descTag = popupBox.querySelector("textarea"),
addBtn = popupBox.querySelector("button");

const months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;

// Bir "addBox" adında bir elemanın tıklanması durumunda, aşağıdaki işlevi gerçekleştir:
addBox.addEventListener("click", () => {
  // Popup penceresinin başlığı "Add a new Note" olarak değiştirilir.
    popupTitle.innerText = "Add a new Note";
  // Butonun metni "Add Note" olarak değiştirilir.
    addBtn.innerText = "Add Note";
  // Popup kutusu gösterilir.
    popupBox.classList.add("show");
  // Dokümanın gövdesinin kaydırma özelliği devre dışı bırakılır.
    document.querySelector("body").style.overflow = "hidden";
  // Eğer pencere genişliği 660 pikselden büyükse, başlık etiketi odaklanır.
    if(window.innerWidth > 660) titleTag.focus();
});

// "closeIcon" elemanı tıklandığında aşağıdaki işlev gerçekleştirilir:
closeIcon.addEventListener("click", () => {
  // "isUpdate" değişkeni false olarak ayarlanır.
    isUpdate = false;
  // Başlık ve açıklama alanları sıfırlanır.
    titleTag.value = descTag.value = "";
  // Popup kutusu gizlenir.
    popupBox.classList.remove("show");
  // Dokümanın gövdesinin kaydırma
    document.querySelector("body").style.overflow = "auto";
});

function showNotes() {
    // Eğer notlar boş ise, fonksiyondan çık
    if(!notes) return;
    // Tüm ".note" sınıfı elemanlarını seç ve kaldır
    document.querySelectorAll(".note").forEach(li => li.remove());
    // Her not için ayrı ayrı işlemler yap
    notes.forEach((note, id) => {
        // Not açıklamasındaki yeni satırları HTML "br" etiketiyle değiştir
        let filterDesc = note.description.replaceAll("\n", '<br/>');
        // Her not için HTML kodunu oluştur
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Düzenle</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Sil</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        // "addBox" adlı elemanın hemen altına notu ekle
        addBox.insertAdjacentHTML("afterend", liTag);
    });
}

showNotes();

function showMenu(elem) {
    // Öğenin ebeveynine "show" sınıfını ekle
    elem.parentElement.classList.add("show");
    // Belge üzerinde herhangi bir yere tıklanırsa yapılacak işlemler
    document.addEventListener("click", e => {
        // Tıklanan öğe bir "I" etiketi değilse veya tıklanan öğe "elem" öğesi değilse
        if(e.target.tagName != "I" || e.target != elem) {
            // Öğenin ebeveyninden "show" sınıfını kaldır
            elem.parentElement.classList.remove("show");
        }
    });
}

function deleteNote(noteId) {
    // Kullanıcıya notu silmek isteyip istemediğini sormak için onay kutusu göster
    let confirmDel = confirm("Bu notu silmek istediğinize emin misiniz?");
    // Kullanıcı onay vermezse fonksiyondan çık
    if(!confirmDel) return;
    // "notes" dizisinden notu sil
    notes.splice(noteId, 1);
    // Güncellenmiş "notes" dizisini yerel depolamada sakla
    localStorage.setItem("notes", JSON.stringify(notes));
    // Notları yeniden göster
    showNotes();
}

function updateNote(noteId, title, filterDesc) {
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    updateId = noteId;
    isUpdate = true;
    addBox.click();
    titleTag.value = title;
    descTag.value = description;
    popupTitle.innerText = "Update a Note";
    addBtn.innerText = "Update Note";
}

addBtn.addEventListener("click", e => {
    e.preventDefault();
    let title = titleTag.value.trim(),
    description = descTag.value.trim();

    if(title || description) {
        let currentDate = new Date(),
        month = months[currentDate.getMonth()],
        day = currentDate.getDate(),
        year = currentDate.getFullYear();

        let noteInfo = {title, description, date: `${month} ${day}, ${year}`}
        if(!isUpdate) {
            notes.push(noteInfo);
        } else {
            isUpdate = false;
            notes[updateId] = noteInfo;
        }
        localStorage.setItem("notes", JSON.stringify(notes));
        showNotes();
        closeIcon.click();
    }
});
