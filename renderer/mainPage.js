createBtn = document.getElementById('createNotes');

createBtn.addEventListener('click',()=>{
    window.WindowOption.CreateNotesWindow().then((id)=>{
        console.log(id)
        //获取当前时间
        let date = new Date();
        //获取当前时间
        let now = date.toLocaleString();
        notesList_ul = document.getElementById('notesList-ul');
        let li = document.createElement('li');
        //每个li记录notes的标题，创建时间，打开按钮和删除按钮，用空格分隔；打开按钮和删除按钮用id标识，id为notes-open或notes-del加上窗口id
        li.innerHTML = `<span>Notes</span> <span>${now}</span> <button id="notes-open-${id}">打开</button> <button id="notes-del-${id}">删除</button>`;
        notesList_ul.appendChild(li);
        // 给打开按钮添加click事件监听器
        document.getElementById(`notes-open-${id}`).addEventListener('click', ()=>{
            window.WindowOption.OpenWindow(id)
        });

        // 给删除按钮添加click事件监听器
        document.getElementById(`notes-del-${id}`).addEventListener('click', ()=>{
            window.WindowOption.DeleteWindow(id)
            //删除li
            notesList_ul.removeChild(li);
        });
    })
})