const spinner = document.getElementById("spinner");
const wordInputFile = document.querySelector("#wordFile");
const wordDownload = document.querySelector('.wordDownloadPDF');

wordInputFile.addEventListener('change', () => {
    wordDownload.classList.remove('btnDownloadActive');
    let extension = wordInputFile.value.split('.').pop();
    if (extension !== "docx") { //front-end validation
        if (extension !== "") reportExtensionError();
        //modal with error message opens if file with bad extension is selected
        //extension equals to "" only if we just close choose file window, so modal with error is not required
    } else {
        spinner.className = "show";
        const formData = new FormData();
        formData.append('wordFile', wordInputFile.files[0]);
        fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                spinner.classList.remove("show"); //stop spinner loading
                if (response.ok) {
                    return response.json();
                } else{
                    throw new Error("Problem on server side");
                }
            })
            .then(data => {
                wordDownload.classList.add('btnDownloadActive');
                window.url = data.url; //update global variable url 
                window.fileName = data.fileName;
                wordDownload.addEventListener('click', downloadLink);
            })
            .catch(error => alert(error));
    }
});

function downloadLink() {
    if (url != "") {
        window.open(url, "_blank");
    }
}

function closeModalWindow() {
    document.querySelector('.purchaseModalHeader').classList.add('invisibleElement');
    document.querySelector('.purchaseModalBody').classList.add('invisibleElement');
    document.querySelector('.purchaseModalFooter').classList.add('invisibleElement');
    document.querySelector('.purchaseModalContent').classList.add('modalFadeOut');
    setTimeout(() => {
        document.querySelector('.purchaseModal').style.display = 'none';
    }, 500)
}

function reportExtensionError() {
    document.querySelector('.purchaseModalHeader').classList.remove('invisibleElement');
    document.querySelector('.purchaseModalBody').classList.remove('invisibleElement');
    document.querySelector('.purchaseModalFooter').classList.remove('invisibleElement');
    document.querySelector('.purchaseModalContent').classList.remove('modalFadeOut');
    document.querySelector('.purchaseModal').style.display = "block";
    wordInputFile.value = "";
}
