async function getWorks() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function displayWorks() {
    const gallery = document.querySelector('.gallery');
    const works = await getWorks();

    works.forEach(work => {
        const figure = document.createElement('figure');
        const image = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        figure.setAttribute('data-id', work.id);
        image.setAttribute('src', work.imageUrl);
        image.setAttribute('alt', work.title);
        figcaption.innerText = work.title;
        image.setAttribute("data-category-id", work.categoryId);

        figure.appendChild(image);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}
displayWorks();

async function getCategories() {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function filtre() {
    const filtres = document.querySelector('.filtres');
    const categories = await getCategories();

    const buttonAll = document.createElement("button");
    buttonAll.setAttribute("data-filtre-id", "all");
    buttonAll.setAttribute("class", "filtresborder");
    buttonAll.innerText = "Tous";
    filtres.appendChild(buttonAll);

    categories.forEach(category => {
        const button = document.createElement('button');
        button.setAttribute("name", category.name);
        button.setAttribute("class", "filtresborder");
        button.setAttribute("data-filtre-id", category.id);
        button.innerText = category.name;
        filtres.appendChild(button);
    });

    tabsFilter();
}

function tabsFilter() {
    const filterButtons = document.querySelectorAll('.filtresborder');

    const resetActive = () => {
        filterButtons.forEach(filterButton => {
            filterButton.classList.remove('active');
        });
    };

    const displayProjects = (filtreId) => {
        const pictures = document.querySelectorAll(".gallery img");
        pictures.forEach(picture => {
            const categoryId = picture.dataset.categoryId;
            if (filtreId === 'all') {
                picture.parentNode.classList.remove('hide');
                return;
            }
            if (categoryId !== filtreId) {
                picture.parentNode.classList.add('hide');
            } else {
                picture.parentNode.classList.remove('hide');
            }
        });
    }

    filterButtons.forEach(filterButton => {
        filterButton.addEventListener("click", () => {
            const filtre = filterButton.dataset.filtreId;
            displayProjects(filtre);
            resetActive();
            filterButton.classList.add('active');
        });
    });
}



/*Cette fonction va permettre de modifier le "login" et le "logout" ainsi que le bouton "modifier".*/

const containerAdmin = document.getElementById('admin')
const buttonModifier = document.querySelector('.modification_icon');
const login = document.getElementById('login');
const token = sessionStorage.getItem('token');
const filtres = document.querySelector('.filtres');

/*Si nous avons le token alors on change le "login" en "logout" et nous pouvons afficher le button modifier*/
if (token) {
    containerAdmin.classList.remove('hide');
    buttonModifier.classList.remove('hide');
    filtres.classList.add('hide')
    login.innerText = "logout";
    createCategories();
    addWorksModale();
    /*Si nous cliquons sur le bouton logout alors on enlève le token on change le "logout" en "login" et on enlève le bouton modifier */
    login.addEventListener('click', () => {
        containerAdmin.classList.add('hide');
        sessionStorage.removeItem('token');
        buttonModifier.classList.add('hide');
        filtres.classList.remove('hide')
        login.innerText = "login";
        filtre();

    })
} else {
    filtre();
}




/*MODAL*/

const buttonOpenModal = document.querySelector('.modification_icon');
const modaleContainer = document.querySelector('.modale_container');
const buttonCloseModal = document.getElementById('close_modale')

/*Bouton pour ouvrir le modal*/
buttonOpenModal.addEventListener("click", function () {
    modaleContainer.classList.remove('hide')
});

/*Bouton pour fermer le modal*/
buttonCloseModal.addEventListener("click", function () {
    modaleContainer.classList.add('hide')
});
/*Permet de fermer la modale en cliquant en dehors de la modale*/
const overlayClose = document.querySelector('.modale_overlay');
overlayClose.addEventListener('click', () => {
    modaleContainer.classList.add('hide');
    resetForm();
})
const modalGallery = document.querySelector('.modal_gallery')

/* Ajout des images dans la modale* en recuperant la fonction getWorks*/

async function addWorksModale() {
    const images = await getWorks();

    images.forEach(image => {
        const img = document.createElement('img');
        img.src = image.imageUrl;
        img.alt = image.title;
        const ImageModal = document.createElement('div');
        img.classList.add('image_modal');
        ImageModal.classList.add('position_image');
        ImageModal.dataset.id = image.id;
        ImageModal.appendChild(img);
        const iconDelete = document.createElement("img");
        iconDelete.src = "./assets/icons/delete_icon.jpg";
        iconDelete.classList.add('icon_delete');

        modalGallery.appendChild(ImageModal);
        ImageModal.appendChild(iconDelete);

        // Ajouter un écouteur d'événement pour chaque icône de suppression

        iconDelete.addEventListener('click', () => {
            const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer cette image ?");
            if (confirmDelete) {
                const dataId = ImageModal.dataset.id;
                deleteWork(dataId);
            }
        });
    });
}

async function deleteWork(id) {


    // Envoyer une requête de suppression au serveur
    const token = sessionStorage.getItem('token');
    const deleterequest = await fetch("http://localhost:5678/api/works/" + id, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    // Vérifier si la suppression s'est bien déroulée
    if (deleterequest.ok) {
        // Supprimer l'élément de la modale
        const deletedImageModal = document.querySelector(`[data-id="${id}"]`);
        if (deletedImageModal) {
            deletedImageModal.remove();
        }
        // Supprimer l'élément de la page principale
        const imagePage = document.querySelector(`[data-id="${id}"]`);
        imagePage.classList.add('hide')

    }
}

/*MODAL2*/

const modaleAddContainer = document.querySelector('.modaleAdd_container');
const buttonOpenModal2 = document.querySelector('.modal_button');
buttonOpenModal2.addEventListener("click", function () {
    modaleAddContainer.classList.remove('hide');

});

const buttonCloseModal2 = document.getElementById('icon_close');

buttonCloseModal2.addEventListener("click", function () {
    modaleAddContainer.classList.add('hide')
    resetForm();
}

)

const overlayClose2 = document.querySelector('.modale2_overlay');
const arrowModale = document.querySelector('.arrow');

const buttonValider = document.querySelector("#button_submit");
const addTitle = document.querySelector("#title");
var fileBoolean = false;
var nameBoolean = false;

/*Permet de fermer la modale en cliquant en dehors de la modale*/
overlayClose2.addEventListener('click', () => {
    modaleAddContainer.classList.add('hide');
    resetForm();
})
/*La flêche va permettre de me rediriger vers la première modale*/
arrowModale.addEventListener('click', () => {
    modaleAddContainer.classList.add('hide');
    resetForm();
});

/**
 * Permet d'afficher l'explorateur de fichier
 * On ajoute la fonction PreviewPictures pour pouvoir afficher la photo selectionner
 */
const addPictures = document.querySelector(".addPictures"); // Ajout de la sélection de l'élément
addPictures.addEventListener("change", function (event) {
    previewPictures(event);
});

/**
 * Si il y a quelque chose dans le champ "titre" alors on passe à true
 * On regarde si les autres autres champs sont à true avec la function checkFromBoolean*/
addTitle.addEventListener("keyup", function () {

    nameBoolean = false;
    if (addTitle.value && addTitle.value.length > 0) {
        nameBoolean = true;
    }
    checkFormBoolean();
});

/*Preview de photo selectionnée dans la deuxième modale*/
function previewPictures(e) {
    const file = e.target.files[0];
    if (file.type.match("image.*")) {
        if (file.size <= 4194304) {
            var reader = new FileReader();

            /*Une fois la photo selectionner les elements seront caché grace a un display none*/
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                document.getElementById("imageModale").style.display = "none";
                document.getElementById("imagePreview").style.display = "block";
                document.getElementById("input_image_container").style.display = "none";

                fileBoolean = true;
                checkFormBoolean();
            };
            reader.readAsDataURL(file);
        } else {
            alert('Votre image ne doit pas dépasser les 4MO.');
        }
    }
}

/*Cette function permet d'ajouter une class sur le bouton valider en vert si le nom et la photo est choisie*/
function checkFormBoolean() {
    if (fileBoolean && nameBoolean) {
        buttonValider.removeAttribute("disabled");
        buttonValider.classList.add('modale_green');
    } else {
        buttonValider.setAttribute("disabled", "disabled");
        buttonValider.classList.remove("modale_green");
    }
}



async function createCategories() {
    const select = document.getElementById("categorie");
    const categories = await getCategories();

    /**
     * Cette boucle va permettre d'ajouter les categories dans les balises "option" grace a l'appel API "getCategories".
     * Dans les balises "option" on a le nom et l'id de la category seul le nom sera afficher grace à "textContent".k
     * Les options seront afficher dans la balise "select".
     */
    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}


/**
 * Cette function va permettre d'envoyer ce qu'il y a dans le FromData, si il y a le token alors je peux réaliser la methode POST.
 * En cas de reussite il y aura un message de reussite.
 * Autrement il y aura un message d'erreur
 */
async function addWork() {  // fonction d'ajout de travaux via le formulaire + appel api
    const formAddWorkData = document.getElementById('form-add-work');
    const formData = new FormData(formAddWorkData);

    const token = sessionStorage.getItem('token');
    const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
    /* Envoie d'un message si la réponse est ok*/
    if (response.ok) {
        alert("Votre image à bien été ajoutée!")
        return true;
    }
    /*Message d'alert en cas d'une erreur*/
    else {
        alert('Une erreur est survenue')
    }
    return response;
}

const titleForm = document.getElementById('form-add-work');

titleForm.addEventListener('submit', addPicturesModal);


// Fonction pour réinitialiser le formulaire
function resetForm() {
    document.getElementById('form-add-work').reset();
    // Réinitialiser les variables de contrôle de validation
    fileBoolean = false;
    nameBoolean = false;
    document.getElementById("imageModale").style.display = "block";
    document.getElementById("imagePreview").style.display = "none";
    document.getElementById("input_image_container").style.display = "block";

    checkFormBoolean(); // Appeler la fonction pour mettre à jour l'état du bouton Valider
}


async function addPicturesModal(event) {
    event.preventDefault();

    const workAdd = await addWork();
    if (workAdd) {
        /*Cette boucle va permettre de vider la gallery présente dans la gallery sur les balises "figure"*/
        const gallery = document.querySelector(".gallery");

        const galleryElem = gallery.querySelectorAll('figure');
        if (workAdd) {
            // Réinitialiser le formulaire
            resetForm();
            // Masquer la deuxième modale et afficher à nouveau la première modale
            modaleAddContainer.classList.add('hide');
            modaleContainer.classList.remove('hide');

        }

        if (galleryElem && galleryElem.length > 0) {
            for (var i = 0; i < galleryElem.length; i++) {
                galleryElem[i].remove();
            }
        }
        /**Ensuite on appel la fonction suivante afin de recuperer les images */
        displayWorks();
        /*Cette boucle va permettre de vider la gallery présente dans la modale*/
        const workModalGalleryChildren = document.querySelectorAll(".position_image");
        if (workModalGalleryChildren && workModalGalleryChildren.length > 0) {
            for (var i = 0; i < workModalGalleryChildren.length; i++) {
                workModalGalleryChildren[i].remove();
            }
        }
        /**Ensuite on appel la fonction suivante afin de recuperer les images et ajouter l'image envoyer */
        addWorksModale();
    }
}


