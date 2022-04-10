// modal constructor
class Modal {
    constructor(window, createBtn, updateBtn) {
        this.window = document.getElementById(window);
        this.createBtn = document.getElementById(createBtn);
        this.updateBtn = document.getElementById(updateBtn);
    }

    // open modal window
    open() {
        this.window.classList.add("modal__open");
    }

    // close modal window
    close() {
        this.window.classList.remove("modal__open");
    }

    // show create btn, hide update btn
    showCreateBtn() {
        this.createBtn.classList.remove("hidden");
        this.updateBtn.classList.add("hidden");
    }

    // show update btn, hide create btn
    showUpdateBtn() {
        this.updateBtn.classList.remove("hidden");
        this.createBtn.classList.add("hidden");
    }

    // clear all text fields and error messages
    clear() {
        let textInputs = this.window.querySelectorAll(".modal__input");
        for (let i = 0; i < textInputs.length; i++) {
            textInputs[i].value = "";
        }
        if (this.window.querySelector(".modal__message") != null) {
            this.window.querySelector(".modal__message").innerHTML = "";
        }
    }

    // check if text input is valid
    inputIsValid() {
        let regex = /^[^\s]+[A-Za-z\d\s]+[^\s]$/;
        let inputValue = this.window.querySelector(".modal__input").value;

        console.log("in check " + inputValue);

        if (regex.test(inputValue)) {
            return true;
        }
    }
}

export { Modal };