async function getWorks() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}
getWorks();
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
getCategories();
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

filtre();
