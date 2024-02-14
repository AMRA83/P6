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

    });
    /*Pour supprimer une image de la modale*/
    const iconsDelete = document.querySelectorAll('.icon_delete');

    iconsDelete.forEach(iconDelete => {

        iconDelete.addEventListener('click', () => {
            let dataId = iconDelete.parentNode.dataset.id;
            console.log(dataId);
            deleteWork(dataId);
        });
    })
}
addWorksModale()

async function deleteWork(id) {
    const token = sessionStorage.getItem('token');
    const deleterequest = await fetch("http://localhost:5678/api/works/" + id, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (deleterequest.ok) {
        const deletedWork = document.querySelectorAll(`[data-id="${id}"]`);
        //Supprime l'élément de la modale
        if (deletedWork && deletedWork.length > 0) {
            for (var i = 0; i < deletedWork.length; i++) {
                deletedWork[i].remove();
            }
        }
    }
    else {
        alert('Une erreur est survenue');
    }
}