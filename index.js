const taskInput = document.querySelector('.todo-list__new-task input'),
taskBox = document.querySelector('.todo-list__task-box'),
filters = document.querySelectorAll(".todo-list__filters span"),
clearAll = document.querySelector(".todo-list__button")
 // getting localstorage todo-list
let Tlist = JSON.parse( localStorage.getItem("todo-list") ),
editId, isEdited = false;

clearAll.addEventListener("click", () => {
    Tlist.splice(0, Tlist.length)
    localStorage.setItem("todo-list", JSON.stringify(Tlist));
    showTlist("all")

})

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.--active").classList.remove("--active")
        btn.classList.add("--active")
        showTlist(btn.id)
    })
})


function showTlist(filter) {
    let li = "";

    if(Tlist){
        Tlist.forEach((task, id) => {
    //if Tlist status is completed, set the isCompleted value to checked
           let isCompleted = Tlist[id].status == "completed" ? "checked" : "";
           if(filter == Tlist[id].status || filter == "all") {
            li += ` <li class="todo-list__task">
                        <label for="${id}">
                            <input type="checkbox" id="${id}" ${isCompleted} />
                            <p class="--${isCompleted}">${task.name}</p>
                        </label>
                        <div class="todo-list__settings">
                            <img src="assets/dots-horizontal.svg" alt="dots" />
                            <ul class="todo-list__settings-menu">
                                <li class="icon-edit"><img src="assets/pencil.svg" alt="icon-pencil" />Edit</li>
                                <li class="icon-delete"><img src="assets/trash.svg" alt="icon-trash" />Delete</li>
                            </ul>
                        </div>
                    </li>`
           }
        }) 
    }
   

    taskBox.innerHTML = li || `<span>You don't have any task here </span>`;
    let inputs = taskBox.querySelectorAll("input") 
    let icons = taskBox.querySelectorAll(".todo-list__settings img")
    let idelete = taskBox.querySelectorAll(".icon-delete")
    let iedit = taskBox.querySelectorAll(".icon-edit")


    //create function for the inputs to update status (pending or completed)
    inputs.forEach(input => {
        input.addEventListener("click", () => {
            let taskParag = input.parentElement.lastElementChild;
            if(input.checked) {
                taskParag.classList.add("--checked")
                // updating the status of selected task to completed
                Tlist[input.id].status = "completed"
            } else {
                // updating the status of selected task to pending
                Tlist[input.id].status = "pending"
                taskParag.classList.remove("--checked")
            }

                //update localStorage with the actual status
            localStorage.setItem("todo-list", JSON.stringify(Tlist));

        })
    })

    icons.forEach(icon => {
        icon.addEventListener('click', () => {
            let taskMenu = icon.parentElement.lastElementChild;
            taskMenu.classList.add("--show")
            document.addEventListener("click", e => {

                if(e.target != icon || e.target.tagName != "IMG") {
                    taskMenu.classList.remove("--show")
                }
            })

        })
    })

    idelete.forEach(icon => {
        icon.addEventListener("click", () => {
            let task = icon.parentElement.parentElement.parentElement
            let id = task.querySelector("input")
            Tlist.splice(id.id, 1)
            task.remove()
            localStorage.setItem("todo-list", JSON.stringify(Tlist));


        })
    })

    iedit.forEach(icon => {
        icon.addEventListener("click", () => {
            let task = icon.parentElement.parentElement.parentElement
            let id = task.querySelector("input")
            let paramg = task.querySelector("p").innerText
            isEdited = true;
            editId = id.id;
            taskInput.value = paramg

            
        })
    })



} 

showTlist("all") 



taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim() // //Trim is to remove the spaces in front and behind
    if (e.key == "Enter" && userTask) {
        if(!isEdited) {
            if(!Tlist) { //create an array if don't exist todo-list
                Tlist = [];
            }
        //create an object with the task information and put default status pending
        let taskInfo = {name: userTask, status: "pending"}
        Tlist.push(taskInfo) // adding new task to array (list)
        //Convert TLIST(Object, object) to a Json object{name, status...}

        } else {
            isEdited = false;
            Tlist[editId].name = userTask;

        }
        taskInput.value = ""
        localStorage.setItem("todo-list", JSON.stringify(Tlist));
        showTlist("all")
        
    }
})